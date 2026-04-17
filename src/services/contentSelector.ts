// Content Selector — Monta as rows de cada tela filtrando do ContentCatalog
import type { Channel } from '../types/channel'
import type { TMDBResult } from './tmdbService'
import { ContentCatalog } from './contentCatalog'
import type { UICategory } from './categoryMapper'

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

  // Hero: mix filmes + s\u00e9ries mais bem avaliados
  const heroChannels = [
    { id: 'ziii', name: 'ziiiTV', url: '', logo: '', group: 'Ziii', streams: [], activeStream: { url: '', quality: 'UNKNOWN', label: 'Padr\u00e3o' }, variantCount: 1 } as unknown as Channel,
    ...ContentCatalog.pickMix(['filmes', 'series'], 4, 70)
  ]

  const rows = buildRows([
    // Linha 1 \u2014 Canais Ao Vivo / Mais Assistidos (wide horizontal)
    {
      type: 'wide',
      title: '📡 Canais Ao Vivo \u2014 ',
      titleAccent: 'Mais Assistidos',
      channels: ContentCatalog.getPool('abertos').slice(0, 20)
    },
    // Linha 2 \u2014 Top 10 Filmes
    {
      type: 'portrait',
      title: '🎬 Top 10 ',
      titleAccent: 'Filmes',
      channels: ContentCatalog.pickBest('filmes', 10, { minScore: 50 })
    },
    // Linha 3 \u2014 Top 10 S\u00e9ries
    {
      type: 'portrait',
      title: '📺 Top 10 ',
      titleAccent: 'S\u00e9ries',
      channels: ContentCatalog.pickBest('series', 10, { minScore: 50 })
    },
    // Linha 4 \u2014 Top 10 Canais (esportes + noticias + outros)
    {
      type: 'wide',
      title: '⚡ Top 10 ',
      titleAccent: 'Canais',
      channels: [
        ...ContentCatalog.getPool('esportes').slice(0, 4),
        ...ContentCatalog.getPool('noticias').slice(0, 3),
        ...ContentCatalog.getPool('documentarios').slice(0, 3),
      ].slice(0, 10)
    },
    // Linha 5 \u2014 Top 10 YouTube (canais do tipo infantil/documenta\u00e3o que tendem a ser YouTube)
    {
      type: 'portrait',
      title: '▶️ Top 10 ',
      titleAccent: 'YouTube',
      channels: ContentCatalog.getPool('infantil').slice(0, 10)
    },
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
    { type: 'simple', title: '📺 Canais ', titleAccent: 'Abertos', channels: ContentCatalog.getPool('abertos').slice(0, 20) },
    { type: 'simple', title: '⚽ ', titleAccent: 'Esportes', channels: ContentCatalog.getPool('esportes').slice(0, 20) },
    { type: 'simple', title: '📰 ', titleAccent: 'Notícias', channels: ContentCatalog.getPool('noticias').slice(0, 20) },
    { type: 'simple', title: '🌍 ', titleAccent: 'Documentários', channels: ContentCatalog.getPool('documentarios').slice(0, 20) },
    { type: 'simple', title: '🎠 ', titleAccent: 'Infantil', channels: ContentCatalog.getPool('infantil').slice(0, 20) },
  ])

  return { heroChannels, heroTmdb: new Map(), rows }
}
