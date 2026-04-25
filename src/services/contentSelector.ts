// Content Selector — Monta as rows de cada tela filtrando do ContentCatalog
// OTIMIZADO: retorna rows IMEDIATAMENTE com dados do cache TMDB (warmup).
// Não bloqueia mais em enrichBatch — a UI já renderiza e os dados TMDB
// preenchem conforme o warmup do ContentCatalog progride em background.
import type { Channel } from '../types/channel'
import type { TMDBResult } from './tmdbService'
import { ContentCatalog } from './contentCatalog'
import type { UICategory } from './categoryMapper'
import { getMostWatched } from './historyService'

export type RowType = 'wide' | 'simple' | 'portrait' | 'grid'

export interface ContentRow {
  type: RowType
  title: string
  titleAccent: string
  channels: Channel[]
  tmdb: Map<string, TMDBResult | null>
}

export interface ScreenContent {
  heroChannels: Channel[]
  heroTmdb: Map<string, TMDBResult | null>
  rows: ContentRow[]
}

type NormalizedGroups = Record<UICategory, Channel[]>

function dedupByCanonical(channels: Channel[], minLength = 10, maxLength = 25): Channel[] {
  const seen = new Set<string>()
  let filtered = channels.filter(ch => {
    const key = (ch as any).canonical?.slug ?? ch.id
    if (seen.has(key)) return false
    seen.add(key)
    return true
  }).slice(0, maxLength)
  
  if (filtered.length === 0) return filtered
  // Preenchimento reverso (Loop infinito visual fake): 
  // No Netflix Carousel, a tela física precisa ter N elementos visuais preenchidos
  // para que o gap à direita/esquerda não descentralize a fila principal inteira!
  while (filtered.length < minLength) {
    filtered = [...filtered, ...filtered]
  }
  return filtered
}

function pickByStreamingFromFilmes(streaming: string, limit = 20): Channel[] {
  return dedupByCanonical(
    ContentCatalog
      .getPool('filmes')
      .filter(ch => ((ch as any).canonical?.streaming || '') === streaming)
  ).slice(0, limit)
}

// ─── Helpers ───────────────────────────────────────────
function buildRows(rowsData: Partial<ContentRow>[]): ContentRow[] {
  return rowsData
    .filter(r => r.channels && r.channels.length > 0)
    .map(r => ({
      type: r.type as RowType,
      title: r.title || '',
      titleAccent: r.titleAccent || '',
      channels: r.channels!,
      tmdb: new Map()
    }))
}

// ─── Preenche tmdb das rows COM dados já cacheados (sem chamar API) ───
function fillTmdbFromCache(rows: ContentRow[]): void {
  for (const row of rows) {
    for (const ch of row.channels) {
      if (ch.tmdb) {
        row.tmdb.set(ch.name, ch.tmdb)
      }
    }
  }
}

function buildHeroTmdb(heroChannels: Channel[]): Map<string, TMDBResult | null> {
  const heroTmdb = new Map<string, TMDBResult | null>()
  for (const ch of heroChannels) {
    if (ch.name === 'ziiiTV') {
      heroTmdb.set(ch.name, {
        title: 'ziiiTV', year: '2024', rating: 9.9,
        overview: 'Seu universo de entretenimento alienígena. Canais ao vivo, filmes e séries em ultra definições otimizadas.',
        poster: '', backdrop: '/banner-ziii.jpg',
        tmdbId: 0, mediaType: 'movie', trailerKey: '',
      })
    } else {
      heroTmdb.set(ch.name, ch.tmdb || null)
    }
  }
  return heroTmdb
}

// ─── Enrichment background (não bloqueia, atualiza em background) ───
async function backgroundEnrich(
  heroChannels: Channel[],
  rows: ContentRow[],
  heroTmdb: Map<string, TMDBResult | null>,
  onUpdate?: (heroTmdb: Map<string, TMDBResult | null>, rows: ContentRow[]) => void
): Promise<void> {
  try {
    const allChannels = [
      ...heroChannels,
      ...rows.flatMap(r => r.channels),
    ]
    const uniqueNames = Array.from(new Set(allChannels.map(ch => ch.name)))
    
    // Só enriquecer nomes que ainda não têm dados TMDB
    const toEnrich = uniqueNames.filter(name => {
      const existing = allChannels.find(ch => ch.name === name)
      return !existing?.tmdb
    })
    
    if (toEnrich.length === 0) return
    
    const { enrichBatch } = await import('./tmdbService')
    const tmdbResults = await enrichBatch(toEnrich.slice(0, 20), 10, 300)

    for (const row of rows) {
      for (const ch of row.channels) {
        const tmdb = tmdbResults.get(ch.name) ?? ch.tmdb ?? null
        if (tmdb) row.tmdb.set(ch.name, tmdb)
      }
    }

    for (const ch of heroChannels) {
      if (ch.name === 'ziiiTV') continue
      const tmdb = tmdbResults.get(ch.name) ?? ch.tmdb ?? null
      if (tmdb) heroTmdb.set(ch.name, tmdb)
    }

    if (onUpdate) onUpdate(heroTmdb, rows)
  } catch (err) {
    console.warn('[ContentSelector] Background enrich error (non-fatal):', err)
  }
}

// ═══════════════════════════════════════════════════════════════════
// HOME — Página Principal (Otimizada: CatalogMatcher instantâneo)
// ═══════════════════════════════════════════════════════════════════
export async function buildHomeContent(_groups: NormalizedGroups): Promise<ScreenContent> {
  const t0 = performance.now()
  console.log('[ContentSelector] buildHomeContent iniciado')

  // ─── 1. Dados instantâneos do CatalogMatcher (já matchou durante splash) ───
  const { CatalogMatcher } = await import('./catalogMatcher')
  const byStreaming = CatalogMatcher.getMatchedByStreaming()
  const hasMatcherData = Object.keys(byStreaming).length > 0

  console.log('[ContentSelector] CatalogMatcher streamings:', Object.keys(byStreaming).join(', ') || 'VAZIO')

  let rows: ContentRow[] = []

  // ─── 2. Histórico: "Continuar Assistindo" ───
  const allChannelsMap = new Map<string, Channel>()
  for (const list of Object.values(_groups)) {
    for (const ch of list) allChannelsMap.set(ch.name, ch)
  }
  const historyEntries = getMostWatched(10)
  const historyChannels = historyEntries
    .map(h => allChannelsMap.get(h.name)!)
    .filter(Boolean)

  const fallbackNeeded = 10 - historyChannels.length
  let mostWatchedPool = historyChannels
  if (fallbackNeeded > 0) {
    mostWatchedPool = [
      ...historyChannels,
      ...ContentCatalog.pickMix(['filmes', 'series', 'abertos'], fallbackNeeded, 0)
    ]
  }

  // ─── 3. Renderização por Streaming (Filmes → Séries → Mixto) ───
  if (hasMatcherData) {
    // Histórico no topo
    if (mostWatchedPool.length > 0) {
      rows.push({ type: 'wide' as const, title: '🔥 Continuar ', titleAccent: 'Assistindo', channels: dedupByCanonical(mostWatchedPool), tmdb: new Map() })
    }

    // Streamings: Filmes primeiro, depois Séries
    const STREAMING_CONF = [
      { keys: ['netflix'], emoji: '🎬', label: 'Netflix', emojiSeries: '📺' },
      { keys: ['hbo', 'hbomax'], emoji: '🎭', label: 'Max', emojiSeries: '🎪' },
      { keys: ['disney'],  emoji: '✨', label: 'Disney+', emojiSeries: '🏰' },
      { keys: ['apple', 'appletv'], emoji: '🍎', label: 'Apple TV+', emojiSeries: '📺' },
      { keys: ['amazon', 'prime'], emoji: '📦', label: 'Prime Video', emojiSeries: '📺' },
      { keys: ['paramount'], emoji: '🏔️', label: 'Paramount', emojiSeries: '🎪' },
      { keys: ['globoplay', 'globo'], emoji: '🌐', label: 'Globoplay', emojiSeries: '📺' },
      { keys: ['star', 'starplus'], emoji: '⭐', label: 'Star+', emojiSeries: '🎪' },
      { keys: ['telecine'], emoji: '🎬', label: 'Telecine', emojiSeries: '🎥' },
      { keys: ['crunchyroll', 'anime'], emoji: '👺', label: 'Animês', emojiSeries: '🏯' },
    ]

    for (const { keys, emoji, label, emojiSeries } of STREAMING_CONF) {
      const group = keys.map(k => byStreaming[k]).find(Boolean)
      if (!group) continue
      
      // Filmes primeiro
      if (group.movies.length >= 3) {
        rows.push({ type: 'portrait', title: `${emoji} ${label} `, titleAccent: 'Filmes', channels: dedupByCanonical(group.movies), tmdb: new Map() })
      }
      
      // Séries depois
      if (group.series.length >= 3) {
        rows.push({ type: 'portrait', title: `${emojiSeries} ${label} `, titleAccent: 'Séries', channels: dedupByCanonical(group.series), tmdb: new Map() })
      }
    }

    // Rows extras globais com todo o catálogo restante
    const allFilmes = ContentCatalog.getPool('filmes')
    const allSeries = ContentCatalog.getPool('series')
    const abertos   = ContentCatalog.getPool('abertos')
    if (allFilmes.length > 0) {
      rows.push({ type: 'portrait' as const, title: '🎥 Mais ', titleAccent: 'Filmes', channels: dedupByCanonical(allFilmes), tmdb: new Map() })
    }
    if (allSeries.length > 0) {
      rows.push({ type: 'portrait' as const, title: '🎭 Mais ', titleAccent: 'Séries', channels: dedupByCanonical(allSeries), tmdb: new Map() })
    }
    if (abertos.length > 4) {
      rows.push({ type: 'portrait' as const, title: '📡 TV ', titleAccent: 'ao Vivo', channels: dedupByCanonical(abertos), tmdb: new Map() })
    }

    // Popula TMDB de todos instataneamente via dados canonicos embutidos
    for (const row of rows) {
      if (!row.tmdb) row.tmdb = new Map()
      for (const ch of row.channels) {
        const canonical = (ch as any).canonical
        if (canonical) {
          row.tmdb.set(ch.name, {
            title: canonical.title ?? ch.name,
            year: String(canonical.year ?? ''),
            rating: canonical.rating ?? 0,
            overview: canonical.overview ?? '',
            poster: canonical.poster ?? '',
            backdrop: canonical.backdrop ?? '',
            tmdbId: canonical.tmdbId ?? 0,
            mediaType: canonical.type === 'series' ? 'tv' : 'movie',
            trailerKey: '',
          } as any)
        }
      }
    }
    // Preenche tmdb de itens históricos que não eram da M3U premium (se estiverem no cache)
    fillTmdbFromCache([rows[0]])
    console.log(`[ContentSelector] CAMINHO RÁPIDO: ${rows.length} rows intercaladas criadas.`)
  } else {
    // CAMINHO FALLBACK
    ContentCatalog.resetUsed()
    const allFilmes = ContentCatalog.getPool('filmes')
    const allSeries = ContentCatalog.getPool('series')

    if (mostWatchedPool.length > 0) {
      rows.push({ type: 'wide' as const, title: '🔥 Continuar ', titleAccent: 'Assistindo', channels: mostWatchedPool.slice(0, 10), tmdb: new Map() })
    }

    rows.push(...[
      { type: 'portrait' as const, title: '🎬 Top ', titleAccent: 'Filmes', channels: allFilmes.slice(0, 20), tmdb: new Map() },
      { type: 'portrait' as const, title: '🍿 Mais ', titleAccent: 'Filmes', channels: allFilmes.slice(20, 40), tmdb: new Map() },
      { type: 'portrait' as const, title: '🎥 Descobrir ', titleAccent: 'Filmes', channels: allFilmes.slice(40, 60), tmdb: new Map() },
      { type: 'portrait' as const, title: '📺 Top ', titleAccent: 'Séries', channels: allSeries.slice(0, 20), tmdb: new Map() },
      { type: 'portrait' as const, title: '🎭 Mais ', titleAccent: 'Séries', channels: allSeries.slice(20, 40), tmdb: new Map() },
      { type: 'portrait' as const, title: '🎪 Descobrir ', titleAccent: 'Séries', channels: allSeries.slice(40, 60), tmdb: new Map() },
    ].filter(r => r.channels.length > 0))

    fillTmdbFromCache(rows)
  }

  // ─── 4. Hero section (dinâmico: melhores canais reais do catalog) ───
  let heroChannels: Channel[] = []

  if (hasMatcherData) {
    const streamingsOrder = ['netflix', 'hbo', 'disney', 'amazon', 'apple', 'paramount', 'globoplay']
    for (const s of streamingsOrder) {
      const group = byStreaming[s]
      if (!group) continue
      const best = group.movies[0] || group.series[0]
      if (best && !heroChannels.find(h => h.id === best.id)) {
        heroChannels.push(best)
        if (heroChannels.length >= 5) break
      }
    }
  }

  if (heroChannels.length < 3) {
    const extra = ContentCatalog.pickMix(['filmes', 'series'], 5 - heroChannels.length, 50)
    heroChannels = [...heroChannels, ...extra]
  }

  const heroTmdb = new Map<string, TMDBResult | null>()
  for (const ch of heroChannels) {
    const canonical = (ch as any).canonical
    if (canonical) {
      heroTmdb.set(ch.name, {
        title: canonical.title ?? ch.name,
        year: String(canonical.year ?? ''),
        rating: canonical.rating ?? 0,
        overview: canonical.overview ?? '',
        poster: canonical.poster ?? '',
        backdrop: canonical.backdrop ?? '',
        tmdbId: canonical.tmdbId ?? 0,
        mediaType: canonical.type === 'series' ? 'tv' : 'movie',
        trailerKey: '',
      })
    } else {
      heroTmdb.set(ch.name, ch.tmdb || null)
    }
  }

  console.log(`[ContentSelector] buildHomeContent em ${(performance.now() - t0).toFixed(1)}ms — ${rows.length} rows`)
  return { heroChannels, heroTmdb, rows }
}


// ═══════════════════════════════════════════════════════════════════
// FILMES
// ═══════════════════════════════════════════════════════════════════
export async function buildFilmesContent(_groups: NormalizedGroups): Promise<ScreenContent> {
  ContentCatalog.resetUsed()

  const heroChannels = ContentCatalog.pickBest('filmes', 5, { minScore: 70 })

  // Extrair histórico específico de filmes
  const allChannelsMap = new Map<string, Channel>()
  for (const list of Object.values(_groups)) {
    for (const ch of list) allChannelsMap.set(ch.name, ch)
  }
  const historyEntries = getMostWatched(10)
  const historyFilmes = historyEntries
    .map(h => allChannelsMap.get(h.name)!)
    .filter(ch => ch && ContentCatalog.getPool('filmes').includes(ch))

  const fallbackNeeded = 10 - historyFilmes.length
  let maisAssistidos = historyFilmes
  if (fallbackNeeded > 0) {
    maisAssistidos = [
      ...historyFilmes,
      ...ContentCatalog.pickBest('filmes', fallbackNeeded, { minScore: 70 })
    ]
  }

  const rows = buildRows([
    { type: 'wide', title: '🔥 Mais ', titleAccent: 'Assistidos', channels: maisAssistidos },
    { type: 'portrait', title: '🍎 Apple TV+ ', titleAccent: 'Filmes', channels: pickByStreamingFromFilmes('apple', 20) },
    { type: 'portrait', title: '📦 Amazon Prime ', titleAccent: 'Filmes', channels: pickByStreamingFromFilmes('amazon', 20) },
    { type: 'portrait', title: '🏔️ Paramount+ ', titleAccent: 'Filmes', channels: pickByStreamingFromFilmes('paramount', 20) },
    { type: 'portrait', title: '✨ Disney+ ', titleAccent: 'Filmes', channels: pickByStreamingFromFilmes('disney', 20) },
    { type: 'portrait', title: '🖥️ Filmes em ', titleAccent: '4K & UHD', channels: ContentCatalog.searchByGroup('filmes', /4k/i, 20) },
    { type: 'portrait', title: '😂 ', titleAccent: 'Comédias', channels: ContentCatalog.searchByGroup('filmes', /com\u00e9dia|comedia/i, 20) },
    { type: 'portrait', title: '💥 ', titleAccent: 'Ação', channels: ContentCatalog.searchByGroup('filmes', /a\u00e7\u00e3o|acao|aventura/i, 20) },
    { type: 'portrait', title: '🎬 Grandes ', titleAccent: 'Clássicos', channels: ContentCatalog.searchByGroup('filmes', /cl\u00e1ssico|classico|antigo/i, 20) },
  ])

  // Preencher com dados TMDB já cacheados
  fillTmdbFromCache(rows)

  const heroTmdb = buildHeroTmdb(heroChannels)

  // Background enrich (não bloqueia)
  backgroundEnrich(heroChannels, rows, heroTmdb)

  return { heroChannels, heroTmdb, rows }
}

// ═══════════════════════════════════════════════════════════════════
// SÉRIES
// ═══════════════════════════════════════════════════════════════════
export async function buildSeriesContent(_groups: NormalizedGroups): Promise<ScreenContent> {
  ContentCatalog.resetUsed()

  const heroChannels = ContentCatalog.pickBest('series', 5, { minScore: 70 })

  const rows = buildRows([
    { type: 'wide', title: '🏆 Top ', titleAccent: 'Séries', channels: ContentCatalog.pickBest('series', 20, { minScore: 65 }) },
    { type: 'portrait', title: '🆕 ', titleAccent: 'Lançamentos', channels: ContentCatalog.pickBest('series', 20, { minYear: 2023 }) },
    { type: 'portrait', title: '😂 ', titleAccent: 'Comédias', channels: ContentCatalog.searchByGroup('series', /com\u00e9dia|comedia/i, 20) },
    { type: 'portrait', title: '🍕 ', titleAccent: 'Variados', channels: ContentCatalog.pickBest('series', 20, { minScore: 50 }) },
    { type: 'portrait', title: '💥 ', titleAccent: 'Ação', channels: ContentCatalog.searchByGroup('series', /a\u00e7\u00e3o|acao|aventura/i, 20) },
    { type: 'portrait', title: '🎭 ', titleAccent: 'Drama', channels: ContentCatalog.searchByGroup('series', /drama/i, 20) },
    { type: 'portrait', title: '🔮 Sci-Fi & ', titleAccent: 'Mistério', channels: ContentCatalog.searchByGroup('series', /fic\u00e7\u00e3o|sci|mist\u00e9rio/i, 20) },
  ])

  fillTmdbFromCache(rows)

  const heroTmdb = buildHeroTmdb(heroChannels)
  
  backgroundEnrich(heroChannels, rows, heroTmdb)

  return { heroChannels, heroTmdb, rows }
}

// ═══════════════════════════════════════════════════════════════════
// TV AO VIVO
// ═══════════════════════════════════════════════════════════════════
export async function buildTvContent(_groups: NormalizedGroups): Promise<ScreenContent> {
  const t0 = performance.now()
  ContentCatalog.resetUsed()

  const sportv   = ContentCatalog.searchPool('esportes', /sportv/i, 20)
  const espn     = ContentCatalog.searchPool('esportes', /espn/i, 20)
  const premiere = ContentCatalog.searchPool('esportes', /premiere|pfc/i, 20)
  const lutas    = ContentCatalog.searchPool('esportes', /combate|ufc|boxe/i, 20)
  const jogos    = ContentCatalog.searchPool('esportes', /libertadores|brasileir|champions|sulamericana| x | vs /i, 20)
  const outros   = ContentCatalog.getPool('esportes').slice(0, 30)

  const rows = buildRows([
    { type: 'wide',    title: '⚽ Jogos & ',   titleAccent: 'Campeonatos',  channels: jogos },
    { type: 'portrait', title: '🏆 ESPN & ',   titleAccent: 'SporTV',       channels: [...espn, ...sportv] },
    { type: 'portrait', title: '🏟️ Rede ',     titleAccent: 'Premiere',     channels: premiere },
    { type: 'portrait', title: '🥊 Combate & ', titleAccent: 'Lutas',       channels: lutas },
    { type: 'simple',   title: '⚽ Todos os ', titleAccent: 'Esportes',     channels: outros },
  ])

  const heroChannels = [...sportv.slice(0, 2), ...espn.slice(0, 2), ...premiere.slice(0, 1)]
  const heroTmdb = buildHeroTmdb(heroChannels)
  fillTmdbFromCache(rows)

  console.log(`[ContentSelector] buildTvContent em ${(performance.now() - t0).toFixed(1)}ms — ${rows.length} rows`)
  return { heroChannels, heroTmdb, rows }
}
