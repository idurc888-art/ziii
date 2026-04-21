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

  // ─── 2. Montar rows por streaming (instantâneo, zero API) ───
  let rows: ContentRow[]

  if (hasMatcherData) {
    // CAMINHO RÁPIDO: usa dados pré-matchados do CatalogMatcher
    const STREAMING_CONF = [
      { key: 'netflix', emoji: '🎬', label: 'Netflix' },
      { key: 'amazon',  emoji: '🎥', label: 'Amazon' },
      { key: 'hbo',     emoji: '🎭', label: 'HBO Max' },
      { key: 'disney',  emoji: '✨', label: 'Disney+' },
      { key: 'paramount', emoji: '🎞', label: 'Paramount' },
      { key: 'apple',   emoji: '🍎', label: 'Apple TV+' },
    ]

    rows = STREAMING_CONF.flatMap(({ key, emoji, label }) => {
      const group = byStreaming[key]
      if (!group) return []
      const result: ContentRow[] = []
      if (group.movies.length >= 3) {
        result.push({
          type: 'portrait', title: `${emoji} ${label} `, titleAccent: 'Filmes',
          channels: group.movies.slice(0, 20), tmdb: new Map(),
        })
      }
      if (group.series.length >= 3) {
        result.push({
          type: 'portrait', title: `${emoji} ${label} `, titleAccent: 'Séries',
          channels: group.series.slice(0, 20), tmdb: new Map(),
        })
      }
      return result
    })

    // Preenche TMDB dos matched channels usando seus dados canônicos embutidos
    for (const row of rows) {
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

    console.log(`[ContentSelector] CAMINHO RÁPIDO: ${rows.length} rows do CatalogMatcher`)
  } else {
    // CAMINHO FALLBACK: ContentCatalog com pools genéricos (sem esperar TMDB)
    console.log('[ContentSelector] FALLBACK: CatalogMatcher vazio, usando ContentCatalog pools')
    ContentCatalog.resetUsed()
    const allFilmes = ContentCatalog.getPool('filmes')
    const allSeries = ContentCatalog.getPool('series')

    rows = [
      { type: 'portrait' as const, title: '🎬 Top ', titleAccent: 'Filmes', channels: allFilmes.slice(0, 20), tmdb: new Map() },
      { type: 'portrait' as const, title: '🍿 Mais ', titleAccent: 'Filmes', channels: allFilmes.slice(20, 40), tmdb: new Map() },
      { type: 'portrait' as const, title: '🎥 Descobrir ', titleAccent: 'Filmes', channels: allFilmes.slice(40, 60), tmdb: new Map() },
      { type: 'portrait' as const, title: '📺 Top ', titleAccent: 'Séries', channels: allSeries.slice(0, 20), tmdb: new Map() },
      { type: 'portrait' as const, title: '🎭 Mais ', titleAccent: 'Séries', channels: allSeries.slice(20, 40), tmdb: new Map() },
      { type: 'portrait' as const, title: '🎪 Descobrir ', titleAccent: 'Séries', channels: allSeries.slice(40, 60), tmdb: new Map() },
    ].filter(r => r.channels.length > 0)

    fillTmdbFromCache(rows)
  }

  // ─── 3. Histórico: "Continuar Assistindo" ───
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

  if (mostWatchedPool.length > 0) {
    rows.unshift({
      type: 'wide' as const,
      title: '🔥 Continuar ',
      titleAccent: 'Assistindo',
      channels: mostWatchedPool,
      tmdb: new Map(),
    })
  }

  // ─── 4. Hero section ───
  const strangerThings: Channel = {
    id: 'stranger-things', name: 'Stranger Things', url: '', logo: '', group: 'Séries',
    streams: [], activeStream: { url: '', quality: 'FHD', label: 'Trailer' }, variantCount: 1,
    tmdb: {
      title: 'Stranger Things', year: '2016', rating: 8.7,
      overview: 'Quando um garoto desaparece, a cidade toda participa nas buscas. Mas o que encontram são segredos, forças sobrenaturais e uma menina.',
      poster: '', backdrop: 'https://image.tmdb.org/t/p/w1280/56v2KjBlU4XaOv9rVYEQypROD7P.jpg',
      tmdbId: 66732, mediaType: 'tv', trailerKey: 'b9EkMc79ZSU'
    }
  } as Channel

  // Hero: pega as primeiras séries Netflix matchadas como destaque, se existirem
  let heroChannels: Channel[] = [strangerThings]
  if (hasMatcherData && byStreaming.netflix?.series?.length > 0) {
    heroChannels = [strangerThings, ...byStreaming.netflix.series.slice(0, 4)]
  } else {
    const mix = ContentCatalog.pickMix(['filmes', 'series'], 4, 0)
    if (mix.length > 0) heroChannels = [strangerThings, ...mix]
  }

  const heroTmdb = buildHeroTmdb(heroChannels)

  // Background enrich para canais sem TMDB data (não bloqueia)
  backgroundEnrich(heroChannels, rows, heroTmdb)

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
  console.log('[ContentSelector] buildTvContent iniciado')
  ContentCatalog.resetUsed()
  
  let rows: ContentRow[] = []

  // ─── 1. Histórico: "Continuar Assistindo" ───
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
      ...ContentCatalog.pickMix(['abertos', 'esportes', 'noticias'], fallbackNeeded, 0)
    ]
  }

  if (mostWatchedPool.length > 0) {
    rows.push({
      type: 'wide' as const,
      title: '🔥 Continuar ',
      titleAccent: 'Assistindo',
      channels: mostWatchedPool,
      tmdb: new Map(),
    })
  }

  // ─── 2. Pesquisa de Canais por Prioridade ───
  const canais4k = [
    ...ContentCatalog.searchPool('filmes', /4k|uhd/i, 10),
    ...ContentCatalog.searchPool('esportes', /4k|uhd/i, 10),
    ...ContentCatalog.searchPool('abertos', /4k|uhd/i, 10)
  ]
  const filmesLive = ContentCatalog.searchPool('filmes', /telecine|hbo|megapix|space|tnt|cinemax|fox/i, 20)
  
  const sportv = ContentCatalog.searchPool('esportes', /sportv/i, 20)
  const espn = ContentCatalog.searchPool('esportes', /espn/i, 20)
  const premiere = ContentCatalog.searchPool('esportes', /premiere|pfc/i, 20)
  const lutas = ContentCatalog.searchPool('esportes', /combate|ufc|boxe/i, 20)
  const abertos = ContentCatalog.getPool('abertos').slice(0, 20)
  const jogosAoVivo = ContentCatalog.searchPool('esportes', /( x | \/ | - )|(libertadores|brasileir|champions|sulamericana)/i, 20)

  const liveRows = buildRows([
    { type: 'wide', title: '⚽ Jogos & ', titleAccent: 'Campeonatos', channels: jogosAoVivo },
    { type: 'portrait', title: '🏆 ESPN & ', titleAccent: 'SporTV', channels: [...espn, ...sportv].slice(0, 20) },
    { type: 'portrait', title: '🖥️ Canais em ', titleAccent: '4K', channels: canais4k.slice(0, 20) },
    { type: 'portrait', title: '🏟️ Rede ', titleAccent: 'Premiere', channels: premiere },
    { type: 'portrait', title: '🎬 Canais de ', titleAccent: 'Filmes', channels: filmesLive.length > 0 ? filmesLive : ContentCatalog.getPool('filmes').slice(0, 20) },
    { type: 'simple', title: '📡 Canais ', titleAccent: 'Abertos', channels: abertos },
    { type: 'portrait', title: '🥊 Combate & ', titleAccent: 'Lutas', channels: lutas },
    { type: 'simple', title: '⚽ Mais ', titleAccent: 'Esportes', channels: ContentCatalog.getPool('esportes').slice(0, 20) },
    { type: 'simple', title: '📰 Jornalismo & ', titleAccent: 'Notícias', channels: ContentCatalog.getPool('noticias').slice(0, 20) },
    { type: 'simple', title: '🌍 Documentários & ', titleAccent: 'Natureza', channels: ContentCatalog.getPool('documentarios').slice(0, 20) },
    { type: 'simple', title: '🧸 Canais ', titleAccent: 'Infantis', channels: ContentCatalog.getPool('infantil').slice(0, 20) },
  ])

  rows.push(...liveRows)

  // ─── 3. Hero Section ───
  let heroChannels = [
    ...sportv.slice(0, 1),
    ...premiere.slice(0, 1),
    ...espn.slice(0, 1),
    ...abertos.slice(0, 2)
  ]
  if (heroChannels.length === 0) {
    heroChannels = ContentCatalog.pickMix(['abertos', 'esportes'], 5, 0)
  }

  const heroTmdb = buildHeroTmdb(heroChannels)

  // Enriquecimento e TMDB Cache
  fillTmdbFromCache(rows)
  backgroundEnrich(heroChannels, rows, heroTmdb)

  console.log(`[ContentSelector] buildTvContent em ${(performance.now() - t0).toFixed(1)}ms — ${rows.length} rows`)
  return { heroChannels, heroTmdb, rows }
}
