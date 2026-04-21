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
    const tmdbResults = await enrichBatch(toEnrich, 10, 300)

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
// HOME — Página Principal
// ═══════════════════════════════════════════════════════════════════
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

  const fallbackNeeded = 10 - historyChannels.length
  let mostWatchedPool = historyChannels
  if (fallbackNeeded > 0) {
    mostWatchedPool = [
      ...historyChannels,
      ...ContentCatalog.pickMix(['filmes', 'series', 'abertos'], fallbackNeeded, 0)
    ]
  }

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
  
  console.log('[ContentSelector] Total - Filmes:', allFilmes.length, 'Séries:', allSeries.length)

  // ─── Build rows IMEDIATAMENTE sem esperar TMDB ────
  // Usa dados já cacheados do warmup (ch.tmdb) que o ContentCatalog já enriqueceu
  let rows: ContentRow[]

  try {
    console.log('[ContentSelector] Iniciando build de Top 50 TMDB...')
    const { buildTopRows } = await import('./topRowsBuilder')
    const topRows = await buildTopRows(allFilmes, allSeries)
    console.log('[ContentSelector] Top rows criadas:', topRows.length)
    
    if (topRows.length === 0) {
      throw new Error('buildTopRows retornou 0 rows')
    }
    
    rows = topRows.map(tr => ({
      type: tr.type,
      title: tr.title,
      titleAccent: tr.titleAccent,
      channels: tr.channels,
      tmdb: tr.tmdb as any,
    }))
  } catch (err) {
    console.error('[ContentSelector] TMDB Top 50 falhou, usando fallback:', err)
    
    // Fallback: rows diretas do pool sem TMDB
    rows = [
      { type: 'portrait' as const, title: '🎬 Top ', titleAccent: 'Filmes', channels: allFilmes.slice(0, 20), tmdb: new Map() },
      { type: 'portrait' as const, title: '🍿 Mais ', titleAccent: 'Filmes', channels: allFilmes.slice(20, 40), tmdb: new Map() },
      { type: 'portrait' as const, title: '🎥 Descobrir ', titleAccent: 'Filmes', channels: allFilmes.slice(40, 60), tmdb: new Map() },
      { type: 'portrait' as const, title: '🎞️ Novos ', titleAccent: 'Filmes', channels: allFilmes.slice(60, 80), tmdb: new Map() },
      { type: 'portrait' as const, title: '🌟 Clássicos ', titleAccent: 'Filmes', channels: allFilmes.slice(80, 100), tmdb: new Map() },
      { type: 'portrait' as const, title: '📺 Top ', titleAccent: 'Séries', channels: allSeries.slice(0, 20), tmdb: new Map() },
      { type: 'portrait' as const, title: '🎭 Mais ', titleAccent: 'Séries', channels: allSeries.slice(20, 40), tmdb: new Map() },
      { type: 'portrait' as const, title: '🎪 Descobrir ', titleAccent: 'Séries', channels: allSeries.slice(40, 60), tmdb: new Map() },
      { type: 'portrait' as const, title: '✨ Novas ', titleAccent: 'Séries', channels: allSeries.slice(60, 80), tmdb: new Map() },
      { type: 'portrait' as const, title: '🏆 Populares ', titleAccent: 'Séries', channels: allSeries.slice(80, 100), tmdb: new Map() },
    ]
  }

  // Adiciona Continuar Assistindo
  rows.push({
    type: 'wide' as const,
    title: '🔥 Continuar ',
    titleAccent: 'Assistindo',
    channels: mostWatchedPool,
    tmdb: new Map(),
  })

  // Preenche tmdb com dados já cacheados
  fillTmdbFromCache(rows)

  console.log('[ContentSelector] Rows criadas:', rows.length)
  rows.forEach((r, i) => console.log(`  Row ${i}: ${r.title}${r.titleAccent} (${r.channels.length} canais)`))

  const heroTmdb = buildHeroTmdb(heroChannels)

  // Background enrich (não bloqueia)
  backgroundEnrich(heroChannels, rows, heroTmdb)

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
  ContentCatalog.resetUsed()
  
  const heroChannels = ContentCatalog.getPool('abertos').slice(0, 5)

  const rows = buildRows([
    {
      type: 'wide',
      title: '⚽ Jogos & ',
      titleAccent: 'Campeonatos',
      channels: ContentCatalog.searchPool('esportes', /( x | \/ | - )|(libertadores|brasileir|champions|sulamericana)/i, 20)
    },
    {
      type: 'portrait',
      title: '🏟️ Rede ',
      titleAccent: 'Premiere',
      channels: ContentCatalog.searchPool('esportes', /premiere/i, 20)
    },
    {
      type: 'portrait',
      title: '🏆 ESPN & ',
      titleAccent: 'SporTV',
      channels: ContentCatalog.searchPool('esportes', /espn|sportv/i, 20)
    },
    {
      type: 'portrait',
      title: '🥊 Paramount, NBA & ',
      titleAccent: 'Lutas',
      channels: ContentCatalog.searchPool('esportes', /paramount|tnt|space|band|nba|ufc|combate/i, 20)
    },
    { 
      type: 'simple', 
      title: '⚡ Mais ', 
      titleAccent: 'Esportes', 
      channels: ContentCatalog.getPool('esportes').slice(0, 20) 
    },
    { 
      type: 'simple', 
      title: '📡 Canais ', 
      titleAccent: 'Abertos', 
      channels: ContentCatalog.getPool('abertos').slice(0, 20) 
    },
  ])

  return { heroChannels, heroTmdb: new Map(), rows }
}
