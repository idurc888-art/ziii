// Content Selector — Monta as rows de cada tela filtrando do ContentCatalog
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

// ─── Helpers TMDB Binding ───────────────────────────────────────────
function buildRows(rowsData: Partial<ContentRow>[]): ContentRow[] {
  return rowsData
    .filter(r => r.channels && r.channels.length > 0)
    .map(r => ({
      type: r.type as RowType,
      title: r.title || '',
      titleAccent: r.titleAccent || '',
      channels: r.channels!,
      tmdb: new Map() // tmdb is attached inside channels directly now, but kept for compatibility
    }))
}

// ─── Centralized TMDB enrichment for hero + rows ────────────────────
async function enrichRowsAndHero(
  heroChannels: Channel[],
  rows: ContentRow[],
  heroTmdbBase?: Map<string, TMDBResult | null>,
): Promise<{ heroTmdb: Map<string, TMDBResult | null>; rows: ContentRow[] }> {
  const heroTmdb = heroTmdbBase ? new Map(heroTmdbBase) : new Map<string, TMDBResult | null>()

  const allChannels = [
    ...heroChannels,
    ...rows.flatMap(r => r.channels),
  ]
  const uniqueNames = Array.from(new Set(allChannels.map(ch => ch.name)))

  const { enrichBatch } = await import('./tmdbService')
  const tmdbResults = await enrichBatch(uniqueNames, 30, 300)

  for (const row of rows) {
    for (const ch of row.channels) {
      const tmdb = tmdbResults.get(ch.name) ?? ch.tmdb ?? null
      row.tmdb.set(ch.name, tmdb)
    }
  }

  for (const ch of heroChannels) {
    if (ch.name === 'ziiiTV') continue
    const tmdb = tmdbResults.get(ch.name) ?? ch.tmdb ?? null
    if (tmdb) heroTmdb.set(ch.name, tmdb)
  }

  return { heroTmdb, rows }
}

export async function buildHomeContent(_groups: NormalizedGroups): Promise<ScreenContent> {
  console.log('[ContentSelector] buildHomeContent iniciado')
  ContentCatalog.resetUsed()

  // ─── Extrair histórico real ───
  const allChannelsMap = new Map<string, Channel>()
  for (const list of Object.values(_groups)) {
    for (const ch of list) allChannelsMap.set(ch.name, ch)
  }

  const historyEntries = getMostWatched(10)
  const historyChannels = historyEntries
    .map(h => allChannelsMap.get(h.name)!)
    .filter(Boolean)

  // Fallback se histórico for vazio ou < 10
  const fallbackNeeded = 10 - historyChannels.length
  let mostWatchedPool = historyChannels
  if (fallbackNeeded > 0) {
    mostWatchedPool = [
      ...historyChannels,
      ...ContentCatalog.pickMix(['filmes', 'series', 'abertos'], fallbackNeeded, 50)
    ]
  }
  // Marca o pool como usado para o dedup
  mostWatchedPool.forEach(ch => ContentCatalog.pickBest('filmes', 0, { excludeLocal: new Set([ch.id]), allowReuse: false })) 
  // ↑ hack seguro para adicionar ao usedIds indiretamente no ContentCatalog.
  // Melhor abordagem explícita se pudéssemos, mas no ContentCatalog o pickMix/pickBest já o faz.

  // Hero: Stranger Things fixo como primeiro slide
  const strangerThings: Channel = {
    id: 'stranger-things',
    name: 'Stranger Things',
    url: '',
    logo: '',
    group: 'Séries',
    streams: [],
    activeStream: { url: '', quality: 'FHD', label: 'Trailer' },
    variantCount: 1,
    tmdb: {
      title: 'Stranger Things',
      year: '2016',
      rating: 8.7,
      overview: 'Quando um garoto desaparece, a cidade toda participa nas buscas. Mas o que encontram são segredos, forças sobrenaturais e uma menina.',
      poster: '',
      backdrop: 'https://image.tmdb.org/t/p/w1280/56v2KjBlU4XaOv9rVYEQypROD7P.jpg',
      tmdbId: 66732,
      mediaType: 'tv',
      trailerKey: 'b9EkMc79ZSU'
    }
  } as Channel
  
  let heroChannels = [strangerThings, ...ContentCatalog.pickBest('filmes', 4, { minScore: 0 })]
  if (heroChannels.length === 1) {
     const mix = ContentCatalog.pickMix(['filmes', 'series'], 4, 0);
     if (mix.length > 0) heroChannels = [strangerThings, ...mix];
  }

  console.log('[ContentSelector] Hero channels:', heroChannels.length)

  const allFilmes = ContentCatalog.getPool('filmes')
  const allSeries = ContentCatalog.getPool('series')

  // Detecta streaming pelo group-title
  const detectStreaming = (ch: Channel): string => {
    const g = (ch.group || '').toLowerCase()
    if (g.includes('netflix')) return 'netflix'
    if (g.includes('amazon') || g.includes('prime')) return 'amazon'
    if (g.includes('hbo') || g.includes('max')) return 'hbo'
    if (g.includes('disney')) return 'disney'
    if (g.includes('paramount')) return 'paramount'
    if (g.includes('apple')) return 'apple'
    return 'outros'
  }

  // Agrupa filmes por streaming
  const filmesPorStreaming: Record<string, Channel[]> = {}
  for (const filme of allFilmes) {
    const streaming = detectStreaming(filme)
    if (!filmesPorStreaming[streaming]) filmesPorStreaming[streaming] = []
    filmesPorStreaming[streaming].push(filme)
  }

  // Agrupa séries por streaming
  const seriesPorStreaming: Record<string, Channel[]> = {}
  for (const serie of allSeries) {
    const streaming = detectStreaming(serie)
    if (!seriesPorStreaming[streaming]) seriesPorStreaming[streaming] = []
    seriesPorStreaming[streaming].push(serie)
  }

  const rows = buildRows([
    { type: 'portrait' as const, title: '🎬 Netflix ', titleAccent: 'Filmes', channels: (filmesPorStreaming.netflix || []).slice(0, 20) },
    { type: 'portrait' as const, title: '📺 Netflix ', titleAccent: 'Séries', channels: (seriesPorStreaming.netflix || []).slice(0, 20) },
    { type: 'portrait' as const, title: '🎥 Amazon ', titleAccent: 'Filmes', channels: (filmesPorStreaming.amazon || []).slice(0, 20) },
    { type: 'portrait' as const, title: '🍿 Amazon ', titleAccent: 'Séries', channels: (seriesPorStreaming.amazon || []).slice(0, 20) },
    { type: 'portrait' as const, title: '🎭 HBO ', titleAccent: 'Filmes', channels: (filmesPorStreaming.hbo || []).slice(0, 20) },
    { type: 'portrait' as const, title: '🎪 HBO ', titleAccent: 'Séries', channels: (seriesPorStreaming.hbo || []).slice(0, 20) },
    { type: 'portrait' as const, title: '✨ Disney+ ', titleAccent: 'Filmes', channels: (filmesPorStreaming.disney || []).slice(0, 20) },
    { type: 'portrait' as const, title: '🏰 Disney+ ', titleAccent: 'Séries', channels: (seriesPorStreaming.disney || []).slice(0, 20) },
    {
      type: 'wide' as const,
      title: '🔥 Continuar ',
      titleAccent: 'Assistindo',
      channels: mostWatchedPool
    },
  ].filter(row => row.channels.length > 0)) // Remove rows vazias

  console.log('[ContentSelector] Rows criadas:', rows.length)
  rows.forEach((r, i) => console.log(`  Row ${i}: ${r.title}${r.titleAccent} (${r.channels.length} canais)`))

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

  const enriched = await enrichRowsAndHero(heroChannels, rows, heroTmdb)
  return { heroChannels, heroTmdb: enriched.heroTmdb, rows: enriched.rows }
}


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

  // Fallback se histórico for vazio
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

  const heroTmdb = new Map<string, TMDBResult | null>()
  for (const ch of heroChannels) {
    heroTmdb.set(ch.name, ch.tmdb || null)
  }

  const enriched = await enrichRowsAndHero(heroChannels, rows, heroTmdb)
  return { heroChannels, heroTmdb: enriched.heroTmdb, rows: enriched.rows }
}

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

  const heroTmdb = new Map<string, TMDBResult | null>()
  for (const ch of heroChannels) {
    heroTmdb.set(ch.name, ch.tmdb || null)
  }

  const enriched = await enrichRowsAndHero(heroChannels, rows, heroTmdb)
  return { heroChannels, heroTmdb: enriched.heroTmdb, rows: enriched.rows }
}

export async function buildTvContent(_groups: NormalizedGroups): Promise<ScreenContent> {
  ContentCatalog.resetUsed()
  
  const heroChannels = ContentCatalog.getPool('abertos').slice(0, 5)

  const rows = buildRows([
    // Linha 1 — Jogos & Campeonatos
    {
      type: 'wide',
      title: '⚽ Jogos & ',
      titleAccent: 'Campeonatos',
      channels: ContentCatalog.searchPool('esportes', /( x | \/ | - )|(libertadores|brasileir|champions|sulamericana)/i, 20)
    },
    // Linha 2 — Premiere Clubes
    {
      type: 'portrait',
      title: '🏟️ Rede ',
      titleAccent: 'Premiere',
      channels: ContentCatalog.searchPool('esportes', /premiere/i, 20)
    },
    // Linha 3 — Canais de Esportes Clássicos
    {
      type: 'portrait',
      title: '🏆 ESPN & ',
      titleAccent: 'SporTV',
      channels: ContentCatalog.searchPool('esportes', /espn|sportv/i, 20)
    },
    // Linha 4 — Mais Esportes & Lutas
    {
      type: 'portrait',
      title: '🥊 Paramount, NBA & ',
      titleAccent: 'Lutas',
      channels: ContentCatalog.searchPool('esportes', /paramount|tnt|space|band|nba|ufc|combate/i, 20)
    },
    // Linha 5 — Esportes Diversos (Restante do pool de esportes)
    { 
      type: 'simple', 
      title: '⚡ Mais ', 
      titleAccent: 'Esportes', 
      channels: ContentCatalog.getPool('esportes').slice(0, 20) 
    },
    // Linha 6 — Canais Abertos / Notícias (Complemento do Hub de TV Ao Vivo)
    { 
      type: 'simple', 
      title: '📡 Canais ', 
      titleAccent: 'Abertos', 
      channels: ContentCatalog.getPool('abertos').slice(0, 20) 
    },
  ])

  return { heroChannels, heroTmdb: new Map(), rows }
}
