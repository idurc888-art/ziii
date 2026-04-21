// topRowsBuilder.ts - Constrói rows Top 50 sem duplicatas

import type { ProviderId, CanonicalGenre, CanonicalContent } from '../types/tmdbCatalog'
import type { Channel } from '../types/channel'
import { getCachedTopByProvider, getCachedTopByGenre } from './tmdbTopCatalog'
import { matchCanonicalToChannels } from './contentMatcher'

export interface TopRow {
  title: string
  titleAccent: string
  channels: Channel[]
  tmdb: Map<string, CanonicalContent>
  type: 'portrait' | 'wide'
}

export async function buildTopRows(
  movieChannels: Channel[],
  seriesChannels: Channel[]
): Promise<TopRow[]> {
  const rows: TopRow[] = []
  const usedChannelIds = new Set<string>()
  const usedTmdbIds = new Set<number>()

  const addRow = (row: TopRow) => {
    if (row.channels.length >= 5) {
      rows.push(row)
      row.channels.forEach(ch => {
        usedChannelIds.add(ch.id)
        const tmdb = row.tmdb.get(ch.name)
        if (tmdb) usedTmdbIds.add(tmdb.tmdbId)
      })
    }
  }

  const PROVIDERS: Array<{ id: ProviderId; emoji: string; name: string }> = [
    { id: 'netflix', emoji: '🎬', name: 'Netflix' },
    { id: 'prime', emoji: '🎥', name: 'Prime' },
    { id: 'disney', emoji: '✨', name: 'Disney+' },
    { id: 'hbomax', emoji: '🎭', name: 'HBO' },
    { id: 'globoplay', emoji: '📺', name: 'Globoplay' },
    { id: 'paramount', emoji: '🎪', name: 'Paramount' },
  ]

  console.log('[TopRows] Iniciando build de rows Top 50...')

  // 1. Top filmes por streaming
  for (const prov of PROVIDERS) {
    const canonical = await getCachedTopByProvider(prov.id, 'movie', 50, 'BR')
    const { matchedChannels, tmdbMap } = matchCanonicalToChannels(
      canonical.filter(c => !usedTmdbIds.has(c.tmdbId)),
      movieChannels.filter(c => !usedChannelIds.has(c.id))
    )
    addRow({
      title: `${prov.emoji} Top ${prov.name} `,
      titleAccent: 'Filmes',
      type: 'portrait',
      channels: matchedChannels.slice(0, 20),
      tmdb: tmdbMap,
    })
  }

  // 2. Top séries por streaming
  for (const prov of PROVIDERS) {
    const canonical = await getCachedTopByProvider(prov.id, 'tv', 50, 'BR')
    const { matchedChannels, tmdbMap } = matchCanonicalToChannels(
      canonical.filter(c => !usedTmdbIds.has(c.tmdbId)),
      seriesChannels.filter(c => !usedChannelIds.has(c.id))
    )
    addRow({
      title: `${prov.emoji} Top ${prov.name} `,
      titleAccent: 'Séries',
      type: 'portrait',
      channels: matchedChannels.slice(0, 20),
      tmdb: tmdbMap,
    })
  }

  // 3. Top por gênero (filmes)
  const GENRES: Array<{ id: CanonicalGenre; emoji: string; name: string }> = [
    { id: 'acao', emoji: '💥', name: 'Ação' },
    { id: 'comedia', emoji: '😂', name: 'Comédia' },
    { id: 'drama', emoji: '🎭', name: 'Drama' },
    { id: 'terror', emoji: '👻', name: 'Terror' },
    { id: 'romance', emoji: '💕', name: 'Romance' },
    { id: 'ficcao', emoji: '🚀', name: 'Ficção' },
  ]

  for (const genre of GENRES) {
    const canonical = await getCachedTopByGenre(genre.id, 'movie', 50, 'BR')
    const { matchedChannels, tmdbMap } = matchCanonicalToChannels(
      canonical.filter(c => !usedTmdbIds.has(c.tmdbId)),
      movieChannels.filter(c => !usedChannelIds.has(c.id))
    )
    addRow({
      title: `${genre.emoji} Top ${genre.name} `,
      titleAccent: 'Filmes',
      type: 'portrait',
      channels: matchedChannels.slice(0, 20),
      tmdb: tmdbMap,
    })
  }

  console.log(`[TopRows] ${rows.length} rows criadas com ${usedChannelIds.size} canais únicos`)
  
  return rows
}
