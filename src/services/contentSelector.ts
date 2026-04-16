// Content Selector — Monta as rows de cada tela
// Consome: categoryMapper (normalizedGroups) + historyService + tmdbService
// Produz: arrays de rows prontas para renderização
// Cada row tem: tipo visual, título, canais, e metadados TMDB (quando disponíveis)

import type { Channel } from '../types/channel'
import type { UICategory } from './categoryMapper'
import type { TMDBResult } from './tmdbService'
import { enrichBatch } from './tmdbService'
import { getRecentlyWatched, getMostWatched } from './historyService'

// ─── Tipos ──────────────────────────────────────────────────────────────────

export type RowType = 'wide' | 'simple' | 'portrait' | 'grid'

export interface ContentRow {
  type: RowType
  title: string
  titleAccent: string
  channels: Channel[]
  tmdb: Map<string, TMDBResult | null>  // name → dados TMDB
}

export interface ScreenContent {
  heroChannels: Channel[]      // canais para slides do hero
  heroTmdb: Map<string, TMDBResult | null>
  rows: ContentRow[]
}

type NormalizedGroups = Record<UICategory, Channel[]>

// ─── Helpers ────────────────────────────────────────────────────────────────

function pickFromCategory(
  groups: NormalizedGroups,
  cat: UICategory,
  count: number,
  offset: number = 0
): Channel[] {
  const arr = groups[cat] || []
  return arr.slice(offset, offset + count)
}

function pickPremium(channels: Channel[], count: number, offset: number = 0): Channel[] {
  const isTrash = (name: string) => /info\s*[-|]?|aviso|manuten[çc][ãa]o|leia\s+aqui/i.test(name)
  const isPremium = (name: string) => /4k|fhd|uhd|lan[çc]amento|hd/i.test(name)

  const valid = channels.filter(c => !isTrash(c.name))
  
  valid.sort((a, b) => {
    const aPrem = isPremium(a.name) ? 1 : 0
    const bPrem = isPremium(b.name) ? 1 : 0
    return bPrem - aPrem
  })

  return valid.slice(offset, offset + count)
}

function pickFromCategoryPremium(
  groups: NormalizedGroups,
  cat: UICategory,
  count: number,
  offset: number = 0
): Channel[] {
  const arr = groups[cat] || []
  return pickPremium(arr, count, offset)
}

/** Injeta canais do histórico que ainda existem nos groups */
function matchHistoryToChannels(
  historyNames: string[],
  allChannels: Channel[]
): Channel[] {
  const channelMap = new Map<string, Channel>()
  for (const ch of allChannels) {
    channelMap.set(ch.name.toLowerCase(), ch)
  }
  return historyNames
    .map(n => channelMap.get(n.toLowerCase()))
    .filter(Boolean) as Channel[]
}

function allChannelsFlat(groups: NormalizedGroups): Channel[] {
  return Object.values(groups).flat()
}

// ─── Montagem por Tela ──────────────────────────────────────────────────────

/**
 * HOME — Mix curado do melhor de cada categoria
 */
export async function buildHomeContent(groups: NormalizedGroups): Promise<ScreenContent> {
  const all = allChannelsFlat(groups)

  // Hero: Banner ZiiiTV fixo + 2 filmes + 2 canais ao vivo
  const ziiiBanner = [{ name: 'ziiiTV', url: '', logo: '', group: 'Ziii' }]
  const heroFilmes = pickFromCategoryPremium(groups, 'filmes', 2)
  const heroTV = pickFromCategoryPremium(groups, 'abertos', 2)
  const heroChannels = [...ziiiBanner, ...heroFilmes, ...heroTV]

  // Rows
  const rows: ContentRow[] = []

  // Row 0: Top 10 — mais vistos ou melhores filmes
  const mostWatched = getMostWatched(10)
  const top10Matched = matchHistoryToChannels(mostWatched.map(h => h.name), all)
  const top10 = top10Matched.length >= 5
    ? top10Matched
    : pickFromCategoryPremium(groups, 'filmes', 10)

  rows.push({
    type: 'wide', title: 'top 10 ', titleAccent: 'no brasil',
    channels: top10.slice(0, 10), tmdb: new Map(),
  })

  // Row 1: Continuar assistindo
  const recent = getRecentlyWatched(15)
  const continueWatching = matchHistoryToChannels(recent.map(h => h.name), all)
  if (continueWatching.length > 0) {
    rows.push({
      type: 'simple', title: 'continuar ', titleAccent: 'assistindo',
      channels: continueWatching, tmdb: new Map(),
    })
  }

  // Row 2: Canais ao vivo
  const liveChannels = pickFromCategory(groups, 'abertos', 15)
  if (liveChannels.length > 0) {
    rows.push({
      type: 'simple', title: 'canais ', titleAccent: 'ao vivo',
      channels: liveChannels, tmdb: new Map(),
    })
  }

  // Row 3: Séries em destaque
  const series = pickFromCategory(groups, 'series', 12)
  if (series.length > 0) {
    rows.push({
      type: 'portrait', title: 'séries ', titleAccent: 'em destaque',
      channels: series, tmdb: new Map(),
    })
  }

  // Row 4: Esportes
  const esportes = pickFromCategory(groups, 'esportes', 12)
  if (esportes.length > 0) {
    rows.push({
      type: 'simple', title: '', titleAccent: 'esportes',
      channels: esportes, tmdb: new Map(),
    })
  }

  // Row 5: Grid de categorias
  const catChannels: Channel[] = (['filmes', 'series', 'esportes', 'infantil',
    'abertos', 'documentarios', 'noticias', 'outros'] as UICategory[])
    .filter(c => (groups[c]?.length || 0) > 0)
    .map(c => ({ name: c, url: '', logo: '', group: c }))

  rows.push({
    type: 'grid', title: 'explorar ', titleAccent: 'categorias',
    channels: catChannels, tmdb: new Map(),
  })

  // Enriquecer hero + top10 com TMDB (15 requests máx)
  const toEnrich = [...heroChannels, ...top10.slice(0, 10)]
    .map(ch => ch.name)
    .filter((v, i, a) => a.indexOf(v) === i) // deduplica

  const tmdbResults = await enrichBatch(toEnrich, 10, 300)

  // Distribui resultados
  const heroTmdb = new Map<string, TMDBResult | null>()
  for (const ch of heroChannels) {
    if (ch.name === 'ziiiTV') {
      heroTmdb.set(ch.name, {
        title: 'ziiiTV', year: '2024', rating: 9.9,
        overview: 'Seu universo de entretenimento alienígena. Milhares de canais ao vivo, filmes e séries.',
        poster: '', backdrop: '/banner-ziii.jpg',
        tmdbId: 0, mediaType: 'movie', trailerKey: '',
      })
    } else {
      heroTmdb.set(ch.name, tmdbResults.get(ch.name) || null)
    }
  }

  // Atualiza row0 (top10) com TMDB
  for (const ch of rows[0].channels) {
    rows[0].tmdb.set(ch.name, tmdbResults.get(ch.name) || null)
  }

  return { heroChannels, heroTmdb, rows }
}

/**
 * FILMES — Focado 100% em filmes, TMDB enriquece tudo
 */
export async function buildFilmesContent(groups: NormalizedGroups): Promise<ScreenContent> {
  const filmes = groups.filmes || []
  const heroChannels = filmes.slice(0, 5)

  const rows: ContentRow[] = [
    { type: 'wide' as RowType, title: 'top 10 ', titleAccent: 'filmes', channels: filmes.slice(0, 10), tmdb: new Map() },
    { type: 'portrait' as RowType, title: '', titleAccent: 'lançamentos', channels: filmes.slice(10, 22), tmdb: new Map() },
    { type: 'portrait' as RowType, title: 'ação & ', titleAccent: 'aventura', channels: filmes.slice(22, 34), tmdb: new Map() },
    { type: 'portrait' as RowType, title: 'comédia & ', titleAccent: 'romance', channels: filmes.slice(34, 46), tmdb: new Map() },
    { type: 'portrait' as RowType, title: 'drama & ', titleAccent: 'suspense', channels: filmes.slice(46, 58), tmdb: new Map() },
  ].filter(r => r.channels.length > 0)

  // Enriquecer hero + top10
  const toEnrich = [...heroChannels, ...filmes.slice(0, 10)]
    .map(ch => ch.name)
    .filter((v, i, a) => a.indexOf(v) === i)

  const tmdbResults = await enrichBatch(toEnrich, 10, 300)

  const heroTmdb = new Map<string, TMDBResult | null>()
  for (const ch of heroChannels) heroTmdb.set(ch.name, tmdbResults.get(ch.name) || null)
  if (rows[0]) {
    for (const ch of rows[0].channels) rows[0].tmdb.set(ch.name, tmdbResults.get(ch.name) || null)
  }

  return { heroChannels, heroTmdb, rows }
}

/**
 * SÉRIES — Focado em séries
 */
export async function buildSeriesContent(groups: NormalizedGroups): Promise<ScreenContent> {
  const series = groups.series || []
  const all = allChannelsFlat(groups)
  const heroChannels = series.slice(0, 5)

  const recent = getRecentlyWatched(10)
  const continueWatching = matchHistoryToChannels(
    recent.filter(h => h.category === 'series').map(h => h.name), all
  )

  const rows: ContentRow[] = [
    { type: 'wide' as RowType, title: 'top 10 ', titleAccent: 'séries', channels: series.slice(0, 10), tmdb: new Map() },
  ]

  if (continueWatching.length > 0) {
    rows.push({ type: 'simple', title: 'continuar ', titleAccent: 'assistindo', channels: continueWatching, tmdb: new Map() })
  }

  // Sub-categorias simuladas por posição na lista
  const chunks = [
    { title: '', accent: 'dramas', start: 10, end: 22 },
    { title: '', accent: 'comédias', start: 22, end: 34 },
    { title: '', accent: 'ação', start: 34, end: 46 },
  ]
  for (const c of chunks) {
    const chs = series.slice(c.start, c.end)
    if (chs.length > 0) {
      rows.push({ type: 'portrait', title: c.title, titleAccent: c.accent, channels: chs, tmdb: new Map() })
    }
  }

  const toEnrich = [...heroChannels, ...series.slice(0, 10)]
    .map(ch => ch.name).filter((v, i, a) => a.indexOf(v) === i)
  const tmdbResults = await enrichBatch(toEnrich, 10, 300)

  const heroTmdb = new Map<string, TMDBResult | null>()
  for (const ch of heroChannels) heroTmdb.set(ch.name, tmdbResults.get(ch.name) || null)
  if (rows[0]) {
    for (const ch of rows[0].channels) rows[0].tmdb.set(ch.name, tmdbResults.get(ch.name) || null)
  }

  return { heroChannels, heroTmdb, rows }
}

/**
 * TV AO VIVO — Sem TMDB, usa logo da M3U
 */
export async function buildTvContent(groups: NormalizedGroups): Promise<ScreenContent> {
  const heroChannels = pickFromCategory(groups, 'abertos', 5)

  const rows: ContentRow[] = [
    { type: 'simple' as RowType, title: 'canais ', titleAccent: 'abertos', channels: pickFromCategory(groups, 'abertos', 20), tmdb: new Map() },
    { type: 'simple' as RowType, title: '', titleAccent: 'esportes', channels: pickFromCategory(groups, 'esportes', 20), tmdb: new Map() },
    { type: 'simple' as RowType, title: '', titleAccent: 'notícias', channels: pickFromCategory(groups, 'noticias', 20), tmdb: new Map() },
    { type: 'simple' as RowType, title: '', titleAccent: 'infantil', channels: pickFromCategory(groups, 'infantil', 20), tmdb: new Map() },
    { type: 'simple' as RowType, title: '', titleAccent: 'documentários', channels: pickFromCategory(groups, 'documentarios', 20), tmdb: new Map() },
    { type: 'simple' as RowType, title: '', titleAccent: 'outros', channels: pickFromCategory(groups, 'outros', 20), tmdb: new Map() },
  ].filter(r => r.channels.length > 0)

  return { heroChannels, heroTmdb: new Map(), rows }
}
