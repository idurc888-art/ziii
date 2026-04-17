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

export async function buildHomeContent(_groups: NormalizedGroups): Promise<ScreenContent> {
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

  // Hero: mix filmes + séries mais bem avaliados
  const heroChannels = [
    { id: 'ziii', name: 'ziiiTV', url: '', logo: '', group: 'Ziii', streams: [], activeStream: { url: '', quality: 'UNKNOWN', label: 'Padrão' }, variantCount: 1 } as unknown as Channel,
    ...ContentCatalog.pickMix(['filmes', 'series'], 4, 70)
  ]

  const rows = buildRows([
    // 1- O QUE VC MAIS ASSISTE (Histórico)
    {
      type: 'wide',
      title: '🔥 O Que Você ',
      titleAccent: 'Mais Assiste',
      channels: mostWatchedPool
    },
    // 2- JOGOS DO DIA
    {
      type: 'wide',
      title: '⚽ Jogos ',
      titleAccent: 'do Dia',
      channels: ContentCatalog.getPool('esportes').slice(0, 10)
    },
    // 3- PRINCIPAIS FILMES
    {
      type: 'portrait',
      title: '🎬 Principais ',
      titleAccent: 'Filmes',
      channels: ContentCatalog.pickBest('filmes', 20, { minScore: 50 })
    },
    // 4- PRINCIPAIS SÉRIES
    {
      type: 'portrait',
      title: '📺 Principais ',
      titleAccent: 'Séries',
      channels: ContentCatalog.pickBest('series', 20, { minScore: 50 })
    },
    // 5- PRINCIPAIS DESENHOS
    {
      type: 'portrait',
      title: '🧸 Principais ',
      titleAccent: 'Desenhos',
      channels: ContentCatalog.getPool('infantil').slice(0, 20)
    },
    // 6- FILMES DE COMÉDIA
    {
      type: 'portrait',
      title: '😂 Filmes de ',
      titleAccent: 'Comédia',
      channels: ContentCatalog.pickByGenre('filmes', [35], 20)
    },
    // --- SCROLL INFINITO (Mais Mix) ---
    { type: 'portrait', title: '💥 Filmes de ', titleAccent: 'Ação', channels: ContentCatalog.pickByGenre('filmes', [28, 12], 20) },
    { type: 'portrait', title: '🎭 Principais ', titleAccent: 'Dramas', channels: ContentCatalog.pickByGenre('series', [18], 20) },
    { type: 'simple',   title: '📰 Fique Por ', titleAccent: 'Dentro', channels: ContentCatalog.getPool('noticias').slice(0, 20) },
    { type: 'portrait', title: '👻 Madrugada do ', titleAccent: 'Terror', channels: ContentCatalog.pickByGenre('filmes', [27, 53], 20) },
    { type: 'simple',   title: '🌍 Documentários & ', titleAccent: 'Mundo', channels: ContentCatalog.getPool('documentarios').slice(0, 20) },
    { type: 'portrait', title: '👨‍👩‍👧 Programação em ', titleAccent: 'Família', channels: ContentCatalog.pickByGenre('series', [10751, 10762], 20) },
    { type: 'portrait', title: '🔮 Mundos ', titleAccent: 'Sci-Fi', channels: ContentCatalog.pickByGenre('filmes', [878, 14], 20) },
  ])

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

  return { heroChannels, heroTmdb, rows }
}


export async function buildFilmesContent(_groups: NormalizedGroups): Promise<ScreenContent> {
  ContentCatalog.resetUsed()

  const heroChannels = ContentCatalog.pickBest('filmes', 5, { minScore: 70 })

  const rows = buildRows([
    { type: 'wide', title: '⭐ Melhores ', titleAccent: 'Filmes', channels: ContentCatalog.pickBest('filmes', 20, { minScore: 60 }) },
    { type: 'portrait', title: '🆕 ', titleAccent: 'Lançamentos', channels: ContentCatalog.pickBest('filmes', 20, { minYear: 2023 }) },
    { type: 'portrait', title: '💥 Ação & ', titleAccent: 'Aventura', channels: ContentCatalog.pickByGenre('filmes', [28, 12], 20) },
    { type: 'portrait', title: '😂 ', titleAccent: 'Comédia', channels: ContentCatalog.pickByGenre('filmes', [35], 20) },
    { type: 'portrait', title: '🎭 Drama & ', titleAccent: 'Suspense', channels: ContentCatalog.pickByGenre('filmes', [18, 53], 20) },
    { type: 'portrait', title: '👻 Terror & ', titleAccent: 'Thriller', channels: ContentCatalog.pickByGenre('filmes', [27, 53], 20) },
    { type: 'portrait', title: '🚀 Sci-Fi & ', titleAccent: 'Fantasia', channels: ContentCatalog.pickByGenre('filmes', [878, 14], 20) },
  ])

  const heroTmdb = new Map<string, TMDBResult | null>()
  for (const ch of heroChannels) heroTmdb.set(ch.name, ch.tmdb || null)

  return { heroChannels, heroTmdb, rows }
}

export async function buildSeriesContent(_groups: NormalizedGroups): Promise<ScreenContent> {
  ContentCatalog.resetUsed()

  const heroChannels = ContentCatalog.pickBest('series', 5, { minScore: 70 })

  const rows = buildRows([
    { type: 'wide', title: '🏆 Top ', titleAccent: 'Séries', channels: ContentCatalog.pickBest('series', 20, { minScore: 65 }) },
    { type: 'portrait', title: '🆕 Novas ', titleAccent: 'Temporadas', channels: ContentCatalog.pickBest('series', 20, { minYear: 2023 }) },
    { type: 'portrait', title: '🎭 ', titleAccent: 'Dramas', channels: ContentCatalog.pickByGenre('series', [18], 20) },
    { type: 'portrait', title: '😂 ', titleAccent: 'Comédias', channels: ContentCatalog.pickByGenre('series', [35], 20) },
    { type: 'portrait', title: '💥 ', titleAccent: 'Ação', channels: ContentCatalog.pickByGenre('series', [28, 10759], 20) },
    { type: 'portrait', title: '🔮 Sci-Fi & ', titleAccent: 'Mistério', channels: ContentCatalog.pickByGenre('series', [878, 9648], 20) },
    { type: 'portrait', title: '👨‍👩‍👧 ', titleAccent: 'Família', channels: ContentCatalog.pickByGenre('series', [10751, 10762], 20) },
  ])

  const heroTmdb = new Map<string, TMDBResult | null>()
  for (const ch of heroChannels) heroTmdb.set(ch.name, ch.tmdb || null)

  return { heroChannels, heroTmdb, rows }
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
