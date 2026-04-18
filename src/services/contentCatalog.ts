// contentCatalog.ts
// Singleton enterprise: fonte única da verdade de todo o conteúdo.
// Responsável por:
//   1. Receber canais já normalizados (sem duplicatas)
//   2. Enriquecer com TMDB em background (warmup)
//   3. Calcular score de qualidade de cada canal
//   4. Expor picks inteligentes por página sem duplicatas globais

import type { Channel } from '../types/channel'
import type { TMDBResult } from './tmdbService'
import { enrichBatch } from './tmdbService'
import type { UICategory } from './categoryMapper'

// ─── Score de qualidade ──────────────────────────────
function calcScore(ch: Channel, tmdb: TMDBResult | null): number {
  let score = 0

  // TMDB rating (0-40 pts)
  if (tmdb?.rating) score += Math.min(40, tmdb.rating * 4)

  // Backdrop e poster (0-25 pts)
  if (tmdb?.backdrop) score += 15
  if (tmdb?.poster)   score += 10

  // Overview existe (0-10 pts)
  if (tmdb?.overview && tmdb.overview.length > 20) score += 10

  // Conteúdo recente — ano >= 2022 (0-10 pts)
  const year = tmdb?.year ? parseInt(tmdb.year) : 0
  if (year >= 2022) score += 10
  else if (year >= 2018) score += 5

  // Nome limpo — sem lixo (0-10 pts)
  const hasJunk = /\||\[|\]|\{|\}|HD|SD|FHD|4K/i.test(ch.name)
  if (!hasJunk) score += 10

  // Stream premium disponível (0-5 pts)
  const hasPremium = ch.streams?.some(s => s.quality === '4K' || s.quality === 'FHD') || false
  if (hasPremium) score += 5

  return Math.round(score)
}

// ─── Singleton ───────────────────────────────────────
class ContentCatalogClass {
  private catalog = new Map<UICategory, Channel[]>()
  private usedIds = new Set<string>()   // IDs já usados em alguma página (dedup global)
  private warmupDone = false
  private warmupPromise: Promise<void> | null = null

  // ─── Inicializar com canais normalizados ──────────
  init(groups: Record<UICategory, Channel[]>) {
    this.catalog.clear()
    this.usedIds.clear()
    this.warmupDone = false

    let totalChannels = 0
    for (const [cat, channels] of Object.entries(groups)) {
      this.catalog.set(cat as UICategory, [...channels])
      totalChannels += channels.length
    }
    
    console.log(`[ContentCatalog] Inicializado com ${totalChannels} canais únicos`)
    console.log(`[ContentCatalog] Distribuição:`, 
      Object.entries(groups).map(([k, v]) => `${k}:${v.length}`).join(', ')
    )
  }

  // ─── Warmup: enriquece com TMDB em background ────
  async warmup(): Promise<void> {
    if (this.warmupPromise) return this.warmupPromise

    this.warmupPromise = this._doWarmup()
    return this.warmupPromise
  }

  private async _doWarmup(): Promise<void> {
    console.log('[ContentCatalog] Iniciando warmup TMDB...')

    // Fase 1: top 100 filmes + top 100 séries (garantir dados na home)
    const filmes  = this.catalog.get('filmes')?.slice(0, 100) ?? []
    const series  = this.catalog.get('series')?.slice(0, 100) ?? []

    console.log(`[ContentCatalog] Warmup: ${filmes.length} filmes, ${series.length} séries`)

    await Promise.all([
      this._enrichCategory('filmes', filmes),
      this._enrichCategory('series', series),
    ])

    // Fase 2: restante em background (não await)
    this._enrichRemainder()

    this.warmupDone = true
    console.log('[ContentCatalog] Warmup fase 1 concluído')
  }

  private async _enrichCategory(cat: UICategory, channels: Channel[]): Promise<void> {
    if (!channels.length) return

    try {
      const namesToEnrich = channels.map(ch => ch.name)
      const mappedResults = await enrichBatch(namesToEnrich)
      
      const current = this.catalog.get(cat) ?? []

      // Mescla: canais enriquecidos
      const merged = current.map(ch => {
         const tmdb = mappedResults.get(ch.name) || ch.tmdb
         return { ...ch, tmdb }
      })

      // Calcula score e ordena por score desc
      const scored = merged.map(ch => ({
        ...ch,
        score: calcScore(ch, ch.tmdb ?? null),
      })).sort((a, b) => (b.score ?? 0) - (a.score ?? 0))

      this.catalog.set(cat, scored)
    } catch (err) {
      console.warn(`[ContentCatalog] Erro enriquecendo ${cat}:`, err)
    }
  }

  private async _enrichRemainder(): Promise<void> {
    const cats: UICategory[] = ['esportes', 'documentarios', 'noticias', 'infantil']
    for (const cat of cats) {
      const channels = this.catalog.get(cat) ?? []
      if (channels.length) await this._enrichCategory(cat, channels)
    }
  }

  // ─── Pegar pool de uma categoria ─────────────────
  getPool(cat: UICategory, minScore = 0): Channel[] {
    return (this.catalog.get(cat) ?? [])
      .filter(ch => (ch.score ?? 0) >= minScore)
  }

  // ─── Search Pool via Regex (ex: achar todos Premiere no esportes) ──
  searchPool(cat: UICategory, regex: RegExp, count: number, opts: { allowReuse?: boolean } = {}): Channel[] {
    const pool = this.getPool(cat)
    const result: Channel[] = []
    
    for (const ch of pool) {
      if (result.length >= count) break
      if (!opts.allowReuse && this.usedIds.has(ch.id)) continue
      
      if (regex.test(ch.name)) {
        result.push(ch)
        if (!opts.allowReuse) this.usedIds.add(ch.id)
      }
    }
    
    return result
  }

  // ─── Search Pool via Regex no grupo (M3U group-title) ──
  searchByGroup(cat: UICategory, regex: RegExp, count: number, opts: { allowReuse?: boolean } = {}): Channel[] {
    const pool = this.getPool(cat)
    const result: Channel[] = []
    
    for (const ch of pool) {
      if (result.length >= count) break
      if (!opts.allowReuse && this.usedIds.has(ch.id)) continue
      
      if (regex.test(ch.group || '')) {
        result.push(ch)
        if (!opts.allowReuse) this.usedIds.add(ch.id)
      }
    }
    
    return result
  }

  // ─── Pick sem repetir (dedup global entre páginas) ──
  // excludeLocal: IDs já usados nesta página (para não repetir dentro da mesma)
  pickBest(
    cat: UICategory,
    count: number,
    opts: {
      minScore?: number
      excludeLocal?: Set<string>
      minYear?: number
      maxYear?: number
      allowReuse?: boolean  // ignora dedup global (ex: "continuar assistindo")
    } = {}
  ): Channel[] {
    const { minScore = 0, excludeLocal, minYear, maxYear, allowReuse = false } = opts

    const pool = this.getPool(cat, minScore)
    const result: Channel[] = []
    const localUsed = excludeLocal ?? new Set<string>()

    for (const ch of pool) {
      if (result.length >= count) break
      if (localUsed.has(ch.id)) continue
      if (!allowReuse && this.usedIds.has(ch.id)) continue

      // Filtro por ano
      if (minYear || maxYear) {
        const year = ch.tmdb?.year ? parseInt(ch.tmdb.year) : 0
        if (minYear && year < minYear) continue
        if (maxYear && year > maxYear) continue
      }

      result.push(ch)
      localUsed.add(ch.id)
      if (!allowReuse) this.usedIds.add(ch.id)
    }

    return result
  }

  // ─── Pick por gênero TMDB ─────────────────────────
  // genreIds: IDs de gênero do TMDB (28=Action, 35=Comedy, 18=Drama, etc.)
  pickByGenre(cat: UICategory, genreIds: number[], count: number): Channel[] {
    const pool = this.getPool(cat)
    const result: Channel[] = []

    for (const ch of pool) {
      if (result.length >= count) break
      if (this.usedIds.has(ch.id)) continue
      // Note: we don't have genreIds stored natively in our TMDBResult object at the moment,
      // But we will simulate it safely. If it exists in a future implementation:
      const chGenres = (ch.tmdb as any)?.genreIds ?? []
      const hasGenre = genreIds.some(id => chGenres.includes(id))
      if (!hasGenre) continue
      result.push(ch)
      this.usedIds.add(ch.id)
    }

    return result
  }

  // ─── Mix de categorias (para home geral) ─────────
  pickMix(
    cats: UICategory[],
    count: number,
    minScore = 50
  ): Channel[] {
    const allPools = cats.flatMap(c => this.getPool(c, minScore))
    const sorted = allPools
      .filter(ch => !this.usedIds.has(ch.id))
      .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))

    const result = sorted.slice(0, count)
    result.forEach(ch => this.usedIds.add(ch.id))
    return result
  }

  // ─── Resetar dedup (ao trocar de página) ────────
  resetUsed() {
    this.usedIds.clear()
  }

  isReady() { return this.warmupDone }
}

// Exporta singleton
export const ContentCatalog = new ContentCatalogClass()
