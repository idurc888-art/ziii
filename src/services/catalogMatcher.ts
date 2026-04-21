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
  
  // Callback para a UI plugar e atualizar a barra de progresso
  public onProgress?: (status: MatchStatus, progress: number, message: string) => void

  async loadAndMatch(url: string): Promise<MatchResult> {
    // 1. CHECAGEM DE CACHE (Rápido, Thread Principal)
    try {
      const cached = await db.get(url)
      if (cached && !this.isCacheExpired(cached.timestamp)) {
        this.indexByStreaming(cached.matched)
        this.onProgress?.('done', 100, 'Carregado do cache!')
        return { matched: cached.matched, unmatched: cached.unmatched }
      }
    } catch (e) {
      console.warn('[CatalogMatcher] Erro ao ler cache, ignorando...', e)
    }

    // 2. CACHE MISS: Tenta Worker, fallback para main thread
    try {
      return await this.loadWithWorker(url)
    } catch (err) {
      console.warn('[CatalogMatcher] Worker failed, using main thread fallback:', err)
      return await this.loadInMainThread(url)
    }
  }

  // Carrega usando Web Worker (pode falhar no Tizen 4.0)
  private async loadWithWorker(url: string): Promise<MatchResult> {
    return new Promise((resolve, reject) => {
      try {
        // Instancia o worker
        this.worker = new Worker(
          new URL('../workers/catalogMatcherWorker.ts', import.meta.url),
          { type: 'module' }
        )

        this.worker.onmessage = async (e) => {
          const { status, progress, message, matched, unmatched } = e.data

          // Repassa o estado atual para a tela de Upload/Loading
          if (this.onProgress) {
            this.onProgress(status, progress, message || '')
          }

          if (status === 'done') {
            this.indexByStreaming(matched)
            
            // Salva no IndexedDB para a próxima vez
            try {
              await db.put(url, { matched, unmatched, timestamp: Date.now() })
              console.log('[CatalogMatcher] Cache salvo com sucesso')
            } catch (dbErr) {
              console.error('[CatalogMatcher] Erro ao salvar no cache', dbErr)
            }

            this.worker?.terminate()
            this.worker = null
            resolve({ matched, unmatched })
          }

          if (status === 'error') {
            this.worker?.terminate()
            this.worker = null
            reject(new Error(message))
          }
        }

        this.worker.onerror = (err) => {
          console.error('[CatalogMatcher] Worker error:', err)
          this.worker?.terminate()
          this.worker = null
          reject(new Error('Worker crashed'))
        }

        // Dispara o worker passando APENAS a URL (zero bloqueio de memória)
        this.worker.postMessage({ url })
      } catch (err) {
        reject(err)
      }
    })
  }

  // Fallback: carrega na thread principal (bloqueia UI mas funciona)
  private async loadInMainThread(url: string): Promise<MatchResult> {
    // Importa dinamicamente para não carregar se não for necessário
    const { parseM3U } = await import('@iptv/playlist')
    const { normalizeStreams } = await import('./streamNormalizer')
    const { CANONICAL_CATALOG } = await import('../data/catalog')

    this.onProgress?.('fetching', 5, 'Baixando M3U...')
    
    const res = await fetch(url)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    
    this.onProgress?.('parsing', 15, 'Lendo playlist...')
    
    const text = await res.text()
    const playlist = parseM3U(text)
    
    const rawChannels = playlist.channels.map((item: any) => ({
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

    const slugify = (text: string) => text.toLowerCase()
      .replace(/\[.*?\]|\(.*?\)|\{.*?\}/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    for (let i = 0; i < total; i++) {
      const ch = channels[i]
      const chSlug = slugify(ch.name)
      let bestMatch = null
      let score = 0

      // Exact Match (Score 100)
      bestMatch = CANONICAL_CATALOG.find(c => c.slug === chSlug)
      if (bestMatch) score = 100
      
      // AltTitle Match (Score 92)
      if (!bestMatch) {
        bestMatch = CANONICAL_CATALOG.find(c => c.altTitles.some(a => slugify(a) === chSlug))
        if (bestMatch) score = 92
      }

      // Prefix Match (Score 80)
      if (!bestMatch) {
        bestMatch = CANONICAL_CATALOG.find(c => chSlug.startsWith(c.slug) || c.slug.startsWith(chSlug))
        if (bestMatch) score = 80
      }

      if (score >= 80) {
        matched.push({ ...ch, canonical: bestMatch, matchScore: score } as MatchedChannel)
      } else {
        unmatched.push(ch)
      }

      // Progress a cada 500 canais (mais frequente que no Worker)
      if (i % 500 === 0) {
        const prog = 30 + Math.floor((i / total) * 65)
        this.onProgress?.('matching', prog, `${i}/${total} processados`)
      }
    }

    this.onProgress?.('done', 100, `${matched.length} matches, ${unmatched.length} sem match`)

    this.indexByStreaming(matched)
    
    // Salva no cache
    try {
      await db.put(url, { matched, unmatched, timestamp: Date.now() })
      console.log('[CatalogMatcher] Cache salvo (main thread)')
    } catch (dbErr) {
      console.error('[CatalogMatcher] Erro ao salvar cache', dbErr)
    }

    return { matched, unmatched }
  }

  // Agrupa os itens para a UI consumir (Netflix, Amazon, etc)
  private indexByStreaming(matched: MatchedChannel[]) {
    this.matchedByStreaming.clear()
    
    for (const item of matched) {
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
    return Object.fromEntries(this.matchedByStreaming)
  }

  private isCacheExpired(timestamp: number): boolean {
    const TTL = 7 * 24 * 60 * 60 * 1000 // 7 dias
    return (Date.now() - timestamp) > TTL
  }

  reset() {
    this.worker?.terminate()
    this.worker = null
    this.matchedByStreaming.clear()
  }
}

export const CatalogMatcher = new CatalogMatcherClass()
