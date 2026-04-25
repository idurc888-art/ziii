import * as db from './dbClient'
import type { Channel } from '../types/channel'
import type { CanonicalTitle } from '../data/catalog'

export type MatchStatus = 'idle' | 'fetching' | 'parsing' | 'matching' | 'done' | 'error'

export interface MatchedChannel extends Channel {
  canonical: CanonicalTitle
  matchScore: number
}

export interface MatchResult {
  matched: MatchedChannel[]
  unmatched: Channel[]
}

class CatalogMatcherClass {
  private worker: Worker | null = null
  private matchedByStreaming = new Map<string, { movies: MatchedChannel[]; series: MatchedChannel[] }>()
  // Cache L1 (RAM)
  private memoryCache = new Map<string, { matched: MatchedChannel[], unmatched: Channel[], timestamp: number, contentLength?: number }>()

  // Callbacks para SWR e UI
  public onProgress?: (status: MatchStatus, progress: number, message: string) => void
  public onSilentUpdateReady?: (url: string, matched: MatchedChannel[], unmatched: Channel[]) => void

  async loadAndMatch(url: string): Promise<MatchResult> {
    // 1. CHECAGEM DE CACHE L1 (RAM) - IMEDIATO (SWR)
    const l1 = this.memoryCache.get(url)
    if (l1) {
      if (this.isCacheExpired(l1.timestamp)) {
        console.log('[SWR] L1 Cache expirado, disparando revalidate em background')
        this.backgroundRevalidate(url, l1.contentLength)
      } else {
        console.log('[SWR] L1 Cache hit (fresh)')
      }
      this.indexByStreaming(l1.matched)
      this.onProgress?.('done', 100, 'Carregado da memória!')
      return { matched: l1.matched, unmatched: l1.unmatched }
    }

    // 2. CHECAGEM DE CACHE L3 (DB) - Rápido (SWR)
    try {
      const cached = await db.get(url)
      if (cached) {
        this.memoryCache.set(url, cached) // Popula L1
        if (this.isCacheExpired(cached.timestamp)) {
          console.log('[SWR] L3 DB Cache expirado, disparando revalidate em background')
          this.backgroundRevalidate(url, cached.contentLength)
        } else {
          console.log('[SWR] L3 DB Cache hit (fresh)')
        }
        this.indexByStreaming(cached.matched)
        this.onProgress?.('done', 100, 'Carregado do cache DB!')
        return { matched: cached.matched, unmatched: cached.unmatched }
      }
    } catch (e) {
      console.warn('[CatalogMatcher] Erro ao ler cache, ignorando...', e)
    }

    // 3. CACHE MISS REAL (Cold Start): Tenta Worker com timeout, fallback para main thread
    const workerResult = await this.tryWorkerWithTimeout(url, 20000)
    if (workerResult) return workerResult

    console.warn('[CatalogMatcher] Worker não respondeu ou falhou — usando main thread')
    return await this.loadInMainThread(url)
  }

  // --- SWR BACKGROUND REVALIDATION ---
  private async backgroundRevalidate(url: string, lastLength?: number) {
    try {
      console.log(`[SWR] Checando diff no background para: ${url}`)
      const res = await fetch(url)
      if (!res.ok) return
      const text = await res.text()
      const newLength = text.length

      if (lastLength && newLength === lastLength) {
        console.log(`[SWR] Diff ignorado (Length idêntico: ${newLength}). Playlist intocada. Atualizando TTL.`)
        // Apenas atualiza a data no BD para renovar as 6 horas sem re-processar
        const cached = await db.get(url)
        if (cached) {
          cached.timestamp = Date.now()
          await db.put(url, cached)
          this.memoryCache.set(url, cached)
        }
        return
      }

      console.log(`[SWR] Diff detectado! (${lastLength} -> ${newLength}). Processando novo M3U silenciosamente...`)
      // Fallback para varrer e atualizar silenciosamente usando o motor atual
      // Sem emitir 'onProgress' para não sujar a UI (mas no worker não temos como supressar facilmente, o que é OK pois o UI spinner vai ignorar devido ao silenceUpdate)
      const workerResult = await this.tryWorkerWithTimeout(url, 20000)
      const data = workerResult || await this.loadInMainThread(url)

      // Salva no cache com o novo length
      const toSave = { ...data, timestamp: Date.now(), contentLength: newLength }
      await db.put(url, toSave)
      this.memoryCache.set(url, toSave)
      this.indexByStreaming(toSave.matched)

      // Avisa a store para trocar os dados por baixo dos panos!
      if (this.onSilentUpdateReady) {
        this.onSilentUpdateReady(url, data.matched, data.unmatched)
      }
    } catch (e) {
      console.warn('[SWR] Falha na revalidação de background:', e)
    }
  }

  // Tenta o Worker mas com timeout seguro — resolve null se não funcionar
  private tryWorkerWithTimeout(url: string, timeoutMs: number): Promise<MatchResult | null> {
    return new Promise((resolve) => {
      let settled = false
      const settle = (val: MatchResult | null) => {
        if (settled) return
        settled = true
        resolve(val)
      }

      // Timeout de segurança — se o Worker não responder, cai no fallback
      const timer = setTimeout(() => {
        console.warn('[CatalogMatcher] Worker timeout após', timeoutMs, 'ms')
        if (this.worker) {
          try { this.worker.terminate() } catch (_) {}
          this.worker = null
        }
        settle(null)
      }, timeoutMs)

      try {
        this.worker = new Worker(
          new URL('../workers/catalogMatcherWorker.ts', import.meta.url),
          { type: 'module' }
        )

        this.worker.onmessage = async (e: MessageEvent) => {
          const { status, progress, message, matched, unmatched } = e.data

          if (this.onProgress) {
            this.onProgress(status, progress, message || '')
          }

          if (status === 'done') {
            clearTimeout(timer)
            this.indexByStreaming(matched)
            try {
              await db.put(url, { matched, unmatched, timestamp: Date.now() })
            } catch (dbErr) {
              console.error('[CatalogMatcher] Erro ao salvar cache', dbErr)
            }
            if (this.worker) {
              try { this.worker.terminate() } catch (_) {}
              this.worker = null
            }
            settle({ matched, unmatched })
          }

          if (status === 'error') {
            clearTimeout(timer)
            if (this.worker) {
              try { this.worker.terminate() } catch (_) {}
              this.worker = null
            }
            settle(null)
          }
        }

        this.worker.onerror = (err) => {
          console.error('[CatalogMatcher] Worker error:', err)
          clearTimeout(timer)
          if (this.worker) {
            try { this.worker.terminate() } catch (_) {}
            this.worker = null
          }
          settle(null)
        }

        this.worker.postMessage({ url })
      } catch (err) {
        console.warn('[CatalogMatcher] Falha ao criar Worker:', err)
        clearTimeout(timer)
        settle(null)
      }
    })
  }

  // Fallback: carrega na thread principal de forma NÃO-BLOQUEANTE
  // Usa yield via setTimeout para não travar a UI no Tizen
  private async loadInMainThread(url: string): Promise<MatchResult> {
    const { parseM3U } = await import('@iptv/playlist')
    const { normalizeStreams } = await import('./streamNormalizer')
    const { CANONICAL_CATALOG } = await import('../data/catalog')

    this.onProgress?.('fetching', 5, 'Baixando M3U...')

    const res = await fetch(url)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)

    this.onProgress?.('parsing', 15, 'Lendo playlist...')

    const text = await res.text()
    const playlist = parseM3U(text)

    const rawChannels = playlist.channels.slice(0, 3000).map((item: any) => ({
      name: item.name ?? '',
      url: item.url ?? '',
      logo: item.tvgLogo ?? '',
      group: item.groupTitle ?? 'Sem categoria',
    }))

    const channels = normalizeStreams(rawChannels)
    const total = channels.length

    this.onProgress?.('matching', 30, `Processando ${total} canais...`)

    const matched: MatchedChannel[] = []
    const unmatched: Channel[] = []

    const BATCH_SIZE = 200 // Processa em lotes para não bloquear a UI

    const slugify = (text: string) =>
      text.toLowerCase()
        .replace(/\[.*?\]|\(.*?\)|\{.*?\}/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')

    for (let i = 0; i < total; i += BATCH_SIZE) {
      const batch = channels.slice(i, i + BATCH_SIZE)

      for (const ch of batch) {
        const chSlug = slugify(ch.name)
        let bestMatch: CanonicalTitle | null = null
        let score = 0

        // Exact Match (Score 100)
        for (let j = 0; j < CANONICAL_CATALOG.length; j++) {
          if (CANONICAL_CATALOG[j].slug === chSlug) { bestMatch = CANONICAL_CATALOG[j]; score = 100; break }
        }

        // AltTitle Match (Score 92)
        if (!bestMatch) {
          for (let j = 0; j < CANONICAL_CATALOG.length; j++) {
            const c = CANONICAL_CATALOG[j]
            for (let k = 0; k < c.altTitles.length; k++) {
              if (slugify(c.altTitles[k]) === chSlug) { bestMatch = c; score = 92; break }
            }
            if (bestMatch) break
          }
        }

        // Prefix Match (Score 80)
        if (!bestMatch) {
          for (let j = 0; j < CANONICAL_CATALOG.length; j++) {
            const c = CANONICAL_CATALOG[j]
            if (chSlug.startsWith(c.slug) || c.slug.startsWith(chSlug)) { bestMatch = c; score = 80; break }
          }
        }

        if (score >= 80 && bestMatch) {
          matched.push({ ...ch, canonical: bestMatch as CanonicalTitle, matchScore: score })
        } else {
          unmatched.push(ch)
        }
      }

      // Yield para não bloquear a UI (respiração entre lotes)
      const prog = 30 + Math.floor((Math.min(i + BATCH_SIZE, total) / total) * 65)
      this.onProgress?.('matching', prog, `${Math.min(i + BATCH_SIZE, total)}/${total} processados`)
      await new Promise<void>(r => setTimeout(r, 0))
    }

    this.onProgress?.('done', 100, `${matched.length} matches, ${unmatched.length} sem match`)
    this.indexByStreaming(matched)

    try {
      await db.put(url, { matched, unmatched, timestamp: Date.now() })
      console.log('[CatalogMatcher] Cache salvo (main thread)')
    } catch (dbErr) {
      console.error('[CatalogMatcher] Erro ao salvar cache', dbErr)
    }

    return { matched, unmatched }
  }

  private indexByStreaming(matched: MatchedChannel[]) {
    this.matchedByStreaming.clear()

    // Dedup por canonical.slug: mantém o de maior matchScore
    const bestBySlug = new Map<string, MatchedChannel>()
    for (const item of matched) {
      const existing = bestBySlug.get(item.canonical.slug)
      if (!existing || item.matchScore > existing.matchScore) {
        bestBySlug.set(item.canonical.slug, item)
      }
    }

    for (const item of bestBySlug.values()) {
      const streaming = item.canonical.streaming
      if (!this.matchedByStreaming.has(streaming)) {
        this.matchedByStreaming.set(streaming, { movies: [], series: [] })
      }
      const group = this.matchedByStreaming.get(streaming)!
      if (item.canonical.type === 'movie') {
        group.movies.push(item)
      } else {
        group.series.push(item)
      }
    }
  }

  getMatchedByStreaming() {
    const result: Record<string, { movies: MatchedChannel[]; series: MatchedChannel[] }> = {}
    for (const [key, val] of this.matchedByStreaming.entries()) {
      result[key] = val
    }
    return result
  }

  private isCacheExpired(timestamp: number): boolean {
    const TTL = 7 * 24 * 60 * 60 * 1000 // 7 dias
    return (Date.now() - timestamp) > TTL
  }

  reset() {
    if (this.worker) {
      try { this.worker.terminate() } catch (_) {}
      this.worker = null
    }
    this.matchedByStreaming.clear()
  }
}

export const CatalogMatcher = new CatalogMatcherClass()
