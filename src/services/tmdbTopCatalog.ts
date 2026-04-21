// tmdbTopCatalog.ts - Fetch e cache de tops TMDB

import type { ProviderId, CanonicalGenre, CanonicalContent } from '../types/tmdbCatalog'
import { get as dbGet, put as dbPut } from './dbClient'

const TMDB_API_KEY = 'be6939bd7cb565c3cdb467a360f8b0b7'
const TMDB_BASE = 'https://api.themoviedb.org/3'
const CACHE_TTL = 24 * 60 * 60 * 1000 // 24 horas

// IDs reais de watch providers da TMDB (região BR)
const WATCH_PROVIDERS: Record<ProviderId, number | null> = {
  netflix: 8,
  prime: 119,
  disney: 337,
  hbomax: 384,
  appletv: 350,
  globoplay: 307,
  paramount: 531,
  starplus: 619,
  outro: null,
}

// Mapeamento de genre_ids TMDB → CanonicalGenre
const TMDB_GENRE_MAP: Record<number, CanonicalGenre> = {
  28: 'acao',
  12: 'aventura',
  16: 'animacao',
  35: 'comedia',
  80: 'crime',
  99: 'documentario',
  18: 'drama',
  10751: 'familia',
  14: 'fantasia',
  36: 'historia',
  27: 'terror',
  10402: 'musica',
  9648: 'misterio',
  10749: 'romance',
  878: 'ficcao',
  10752: 'guerra',
  37: 'faroeste',
  10770: 'reality',
}

const CANONICAL_GENRE_TO_TMDB: Record<CanonicalGenre, number[]> = {
  acao: [28],
  aventura: [12],
  animacao: [16],
  comedia: [35],
  crime: [80],
  documentario: [99],
  drama: [18],
  familia: [10751],
  fantasia: [14],
  historia: [36],
  terror: [27],
  musica: [10402],
  misterio: [9648],
  romance: [10749],
  ficcao: [878],
  guerra: [10752],
  faroeste: [37],
  reality: [10770],
  scifi_fantasia: [878, 14],
  outro: [],
}

function mapGenreIds(ids: number[]): CanonicalGenre[] {
  return ids.map(id => TMDB_GENRE_MAP[id] || 'outro').filter((g, i, arr) => arr.indexOf(g) === i)
}

// Cache persistente no IndexedDB
async function getCachedData(key: string): Promise<CanonicalContent[] | null> {
  try {
    const result = await dbGet(key)
    
    if (result && result.timestamp && Date.now() - result.timestamp < CACHE_TTL) {
      console.log(`[TMDB Cache] Hit: ${key}`)
      return result.data
    }
    console.log(`[TMDB Cache] Miss: ${key}`)
    return null
  } catch (err) {
    console.warn('[TMDB Cache] Erro ao ler:', err)
    return null
  }
}

async function setCachedData(key: string, data: CanonicalContent[]): Promise<void> {
  try {
    await dbPut(key, { data, timestamp: Date.now() })
    console.log(`[TMDB Cache] Saved: ${key}`)
  } catch (err) {
    console.warn('[TMDB Cache] Erro ao salvar:', err)
  }
}

async function fetchJson(url: string): Promise<any> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`TMDB error: ${res.status}`)
  return res.json()
}

export async function fetchTopByProvider(
  provider: ProviderId,
  mediaType: 'movie' | 'tv',
  count = 50,
  region = 'BR'
): Promise<CanonicalContent[]> {
  const providerId = WATCH_PROVIDERS[provider]
  if (!providerId) return []

  const results: CanonicalContent[] = []
  let page = 1
  
  while (results.length < count && page <= 3) {
    const url = `${TMDB_BASE}/discover/${mediaType}?api_key=${TMDB_API_KEY}&with_watch_providers=${providerId}&watch_region=${region}&sort_by=popularity.desc&page=${page}&include_adult=false&language=pt-BR`
    const data = await fetchJson(url)
    
    for (const item of data.results || []) {
      if (results.length >= count) break
      
      results.push({
        tmdbId: item.id,
        title: item.title || item.name,
        originalTitle: item.original_title || item.original_name,
        overview: item.overview || '',
        posterPath: item.poster_path,
        backdropPath: item.backdrop_path,
        year: item.release_date ? parseInt(item.release_date.split('-')[0]) : 
              item.first_air_date ? parseInt(item.first_air_date.split('-')[0]) : null,
        mediaType,
        provider,
        rank: results.length + 1,
        popularity: item.popularity || 0,
        voteAverage: item.vote_average || 0,
        voteCount: item.vote_count || 0,
        genres: mapGenreIds(item.genre_ids || []),
      })
    }
    
    page++
  }
  
  return results
}

export async function fetchTopByGenre(
  genre: CanonicalGenre,
  mediaType: 'movie' | 'tv',
  count = 50,
  region = 'BR'
): Promise<CanonicalContent[]> {
  const genreIds = CANONICAL_GENRE_TO_TMDB[genre]
  if (!genreIds.length) return []

  const results: CanonicalContent[] = []
  let page = 1
  
  while (results.length < count && page <= 3) {
    const url = `${TMDB_BASE}/discover/${mediaType}?api_key=${TMDB_API_KEY}&with_genres=${genreIds.join(',')}&sort_by=popularity.desc&page=${page}&include_adult=false&language=pt-BR&watch_region=${region}`
    const data = await fetchJson(url)
    
    for (const item of data.results || []) {
      if (results.length >= count) break
      
      results.push({
        tmdbId: item.id,
        title: item.title || item.name,
        originalTitle: item.original_title || item.original_name,
        overview: item.overview || '',
        posterPath: item.poster_path,
        backdropPath: item.backdrop_path,
        year: item.release_date ? parseInt(item.release_date.split('-')[0]) : 
              item.first_air_date ? parseInt(item.first_air_date.split('-')[0]) : null,
        mediaType,
        provider: 'outro',
        rank: results.length + 1,
        popularity: item.popularity || 0,
        voteAverage: item.vote_average || 0,
        voteCount: item.vote_count || 0,
        genres: mapGenreIds(item.genre_ids || []),
      })
    }
    
    page++
  }
  
  return results
}

export async function getCachedTopByProvider(
  provider: ProviderId,
  mediaType: 'movie' | 'tv',
  count = 50,
  region = 'BR'
): Promise<CanonicalContent[]> {
  const key = `tmdb_provider_${provider}_${mediaType}_${count}_${region}`
  
  // Tenta cache primeiro
  const cached = await getCachedData(key)
  if (cached) return cached
  
  // Busca da API
  const data = await fetchTopByProvider(provider, mediaType, count, region)
  await setCachedData(key, data)
  return data
}

export async function getCachedTopByGenre(
  genre: CanonicalGenre,
  mediaType: 'movie' | 'tv',
  count = 50,
  region = 'BR'
): Promise<CanonicalContent[]> {
  const key = `tmdb_genre_${genre}_${mediaType}_${count}_${region}`
  
  // Tenta cache primeiro
  const cached = await getCachedData(key)
  if (cached) return cached
  
  // Busca da API
  const data = await fetchTopByGenre(genre, mediaType, count, region)
  await setCachedData(key, data)
  return data
}
