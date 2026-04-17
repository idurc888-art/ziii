// TMDB Service — Enriquecimento de canais com poster, backdrop, sinopse
// 3 camadas de cache: Memory → IndexedDB (TTL 7d) → Fetch API
// Rate limit TMDB: 40 req/10s — respeitamos com batch + delay
// Chave salva em constante (Tizen não suporta .env)

const API_KEY = 'b68afbadedebf0889f00a0cf577d3e5a'
const BASE_URL = 'https://api.themoviedb.org/3'
const IMG_BASE = 'https://image.tmdb.org/t/p'

// Tamanhos de imagem
const POSTER_SIZE = '/w342'   // cards
const BACKDROP_SIZE = '/w780' // hero (otimizado para performance)

// Cache TTL
const TTL_MS = 7 * 24 * 60 * 60 * 1000 // 7 dias

// ─── Tipos ──────────────────────────────────────────────────────────────────

export interface TMDBResult {
  poster: string    // URL completa do poster
  backdrop: string  // URL completa do backdrop
  overview: string  // sinopse
  rating: number    // 0-10
  year: string      // ano de lançamento
  title: string     // título oficial
  tmdbId: number    // ID interno TMDB
  mediaType: 'movie' | 'tv'  // tipo de mídia
  trailerKey: string // YouTube key (preenchido sob demanda)
  // Dados Completos (opcionais — retrocompatível com dados mockados antigos)
  tagline?: string          // frase de efeito
  genres?: string[]         // lista de gêneros
  runtime?: number          // duração em minutos (filmes) ou episódios (séries)
  cast?: string[]           // top 5 atores
  director?: string         // diretor (filmes) ou criador (séries)
  voteCount?: number        // número de votos
  popularity?: number       // score de popularidade TMDB
  status?: string           // 'Released', 'Ended', 'Returning Series', etc.
  posterFull?: string       // poster em qualidade máxima (w500)
  backdropFull?: string     // backdrop em qualidade máxima (w1280)
}

interface CacheEntry {
  data: TMDBResult | null  // null = "buscou e não encontrou"
  cachedAt: number
}

// ─── Camada 1: Cache em Memória (Map) ───────────────────────────────────────

const memoryCache = new Map<string, TMDBResult | null>()

// ─── Camada 2: Cache IndexedDB ──────────────────────────────────────────────

const TMDB_DB = 'ziiiTV-tmdb'
const TMDB_STORE = 'tmdb_cache'
let tmdbDb: IDBDatabase | null = null
let tmdbDbPromise: Promise<IDBDatabase> | null = null

function openTmdbDB(): Promise<IDBDatabase> {
  if (tmdbDb) return Promise.resolve(tmdbDb)
  if (tmdbDbPromise) return tmdbDbPromise

  tmdbDbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(TMDB_DB, 1)
    req.onerror = () => { tmdbDbPromise = null; reject(req.error) }
    req.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result
      if (!db.objectStoreNames.contains(TMDB_STORE)) {
        db.createObjectStore(TMDB_STORE)
      }
    }
    req.onsuccess = () => {
      tmdbDb = req.result
      tmdbDbPromise = null
      resolve(tmdbDb)
    }
  })
  return tmdbDbPromise
}

async function idbGet(key: string): Promise<CacheEntry | undefined> {
  try {
    const db = await openTmdbDB()
    return new Promise((resolve, reject) => {
      const tx = db.transaction(TMDB_STORE, 'readonly')
      const store = tx.objectStore(TMDB_STORE)
      const r = store.get(key)
      r.onsuccess = () => resolve(r.result)
      r.onerror = () => reject(r.error)
    })
  } catch {
    return undefined
  }
}

async function idbPut(key: string, entry: CacheEntry): Promise<void> {
  try {
    const db = await openTmdbDB()
    return new Promise((resolve, reject) => {
      const tx = db.transaction(TMDB_STORE, 'readwrite')
      const store = tx.objectStore(TMDB_STORE)
      const r = store.put(entry, key)
      r.onsuccess = () => resolve()
      r.onerror = () => reject(r.error)
    })
  } catch {
    // silenciar — cache é best-effort
  }
}

// ─── Limpeza de nome da M3U ─────────────────────────────────────────────────

function cleanName(name: string): string {
  return name
    // Remove prefixos de M3U (|||BR|||, [BR], etc.)
    .replace(/\|{2,}[^|]*\|{2,}/g, '')
    .replace(/\[[^\]]*\]/g, '')
    // Remove tags de qualidade/idioma
    .replace(/\b(HD|FHD|UHD|4K|SD|BR|PT|EN|DUB|LEG|DUBLADO|LEGENDADO|NATIONAL|MULTI)\b/gi, '')
    // Remove S01E01, temporada, episódio
    .replace(/S\d{1,2}E\d{1,3}/gi, '')
    .replace(/\b(temporada|season|ep|episodio|episode)\s*\d*/gi, '')
    // Remove anos isolados (2024, 2023)
    .replace(/\b(19|20)\d{2}\b/g, '')
    // Remove caracteres especiais restantes
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

// ─── Camada 3: Fetch TMDB API ───────────────────────────────────────────────

async function fetchTMDB(query: string, type: 'movie' | 'tv'): Promise<TMDBResult | null> {
  const endpoint = type === 'movie' ? '/search/movie' : '/search/tv'
  const searchUrl = `${BASE_URL}${endpoint}?api_key=${API_KEY}&query=${encodeURIComponent(query)}&language=pt-BR`

  try {
    const res = await fetch(searchUrl)
    if (!res.ok) {
      if (res.status === 429) {
        await new Promise(r => setTimeout(r, 2000))
        return fetchTMDB(query, type)
      }
      return null
    }

    const data = await res.json()
    const item = data.results?.[0]
    if (!item) return null

    // Segunda chamada com append_to_response para dados completos (créditos + vídeos)
    const detailPath = type === 'movie' ? `/movie/${item.id}` : `/tv/${item.id}`
    const detailUrl  = `${BASE_URL}${detailPath}?api_key=${API_KEY}&language=pt-BR&append_to_response=credits,videos`
    const detailRes  = await fetch(detailUrl)
    const detail     = detailRes.ok ? await detailRes.json() : item

    const posterPath   = detail.poster_path   || item.poster_path
    const backdropPath = detail.backdrop_path || item.backdrop_path

    // Elenco: top 5 atores + diretor/criador
    const cast: string[] = (detail.credits?.cast || [])
      .slice(0, 5)
      .map((p: any) => p.name as string)
    const director = type === 'movie'
      ? ((detail.credits?.crew || []).find((p: any) => p.job === 'Director')?.name || '')
      : ((detail.created_by || [])[0]?.name || '')

    // Gêneros
    const genres: string[] = (detail.genres || []).map((g: any) => g.name as string)

    // Duração
    const runtime = type === 'movie'
      ? (detail.runtime || 0)
      : (detail.number_of_episodes || 0)

    return {
      poster:      posterPath   ? `${IMG_BASE}${POSTER_SIZE}${posterPath}`   : '',
      backdrop:    backdropPath ? `${IMG_BASE}${BACKDROP_SIZE}${backdropPath}` : '',
      posterFull:  posterPath   ? `${IMG_BASE}/w500${posterPath}`   : '',
      backdropFull: backdropPath ? `${IMG_BASE}/w1280${backdropPath}` : '',
      overview:    detail.overview || item.overview || '',
      rating:      detail.vote_average || item.vote_average || 0,
      voteCount:   detail.vote_count || item.vote_count || 0,
      popularity:  detail.popularity || item.popularity || 0,
      year:        (detail.release_date || detail.first_air_date || item.release_date || item.first_air_date || '').substring(0, 4),
      title:       detail.title || detail.name || item.title || item.name || query,
      tagline:     detail.tagline || '',
      genres,
      runtime,
      cast,
      director,
      status:      detail.status || '',
      tmdbId:      item.id || 0,
      mediaType:   type,
      trailerKey:  '',
    }
  } catch (e) {
    console.warn(`[TMDB] Erro ao buscar "${query}":`, e)
    return null
  }
}

// ─── API Pública ────────────────────────────────────────────────────────────

/**
 * Enriquece um canal com dados TMDB.
 * Fluxo: Memory → IndexedDB (TTL) → API (movie, fallback tv)
 * Retorna null se não encontrou nada.
 */
export async function enrichChannel(channelName: string): Promise<TMDBResult | null> {
  const cacheKey = channelName.toLowerCase().trim()

  // ─── Camada 1: Memória ──────────────────────────────────────────
  if (memoryCache.has(cacheKey)) {
    return memoryCache.get(cacheKey) || null
  }

  // ─── Camada 2: IndexedDB ───────────────────────────────────────
  const idbEntry = await idbGet(cacheKey)
  if (idbEntry && (Date.now() - idbEntry.cachedAt) < TTL_MS) {
    memoryCache.set(cacheKey, idbEntry.data)
    return idbEntry.data
  }

  // ─── Camada 3: Fetch API ────────────────────────────────────────
  const cleaned = cleanName(channelName)
  if (!cleaned || cleaned.length < 2) {
    memoryCache.set(cacheKey, null)
    return null
  }

  // Tenta movie primeiro, fallback tv
  let result = await fetchTMDB(cleaned, 'movie')
  if (!result) {
    result = await fetchTMDB(cleaned, 'tv')
  }

  // Salva nas duas camadas (mesmo null, para não repetir busca)
  memoryCache.set(cacheKey, result)
  await idbPut(cacheKey, { data: result, cachedAt: Date.now() })

  if (result) {
    console.log(`[TMDB] ✓ "${channelName}" → "${result.title}" (${result.year})`)
  }

  return result
}

/**
 * Enriquece um lote de canais respeitando rate limit.
 * Processa em batches de batchSize com pausa de delayMs.
 */
export async function enrichBatch(
  channelNames: string[],
  batchSize: number = 10,
  delayMs: number = 300
): Promise<Map<string, TMDBResult | null>> {
  const results = new Map<string, TMDBResult | null>()

  console.log(`[TMDB] Enriquecendo ${channelNames.length} canais (batches de ${batchSize})...`)

  for (let i = 0; i < channelNames.length; i += batchSize) {
    const batch = channelNames.slice(i, i + batchSize)

    const batchResults = await Promise.all(
      batch.map(async name => {
        const result = await enrichChannel(name)
        return { name, result }
      })
    )

    for (const { name, result } of batchResults) {
      results.set(name, result)
    }

    // Pausa entre batches (respeitando rate limit)
    if (i + batchSize < channelNames.length) {
      await new Promise(r => setTimeout(r, delayMs))
    }
  }

  const found = Array.from(results.values()).filter(Boolean).length
  console.log(`[TMDB] Concluído: ${found}/${channelNames.length} encontrados`)

  return results
}

// ─── Cache de trailers em memória ───────────────────────────────────────────
const trailerCache = new Map<number, string>()

/**
 * Busca a key do trailer no YouTube via TMDB Videos API.
 * Retorna a YouTube key ou string vazia se não encontrou.
 * Cache em memória para evitar chamadas repetidas.
 */
export async function fetchTrailerKey(tmdbId: number, mediaType: 'movie' | 'tv'): Promise<string> {
  if (!tmdbId) return ''
  if (trailerCache.has(tmdbId)) return trailerCache.get(tmdbId) || ''

  const endpoint = mediaType === 'movie' ? `/movie/${tmdbId}/videos` : `/tv/${tmdbId}/videos`
  const url = `${BASE_URL}${endpoint}?api_key=${API_KEY}&language=pt-BR`

  try {
    const res = await fetch(url)
    if (!res.ok) return ''

    const data = await res.json()
    const videos = data.results || []

    // Prioridade: Trailer oficial em PT-BR, depois EN
    let trailer = videos.find((v: any) => v.type === 'Trailer' && v.site === 'YouTube' && v.official)
    if (!trailer) trailer = videos.find((v: any) => v.type === 'Trailer' && v.site === 'YouTube')
    if (!trailer) trailer = videos.find((v: any) => v.site === 'YouTube')

    const key = trailer?.key || ''
    trailerCache.set(tmdbId, key)

    if (key) {
      console.log(`[TMDB] 🎬 Trailer encontrado: ${mediaType}/${tmdbId} → ${key}`)
    }

    // Se não achou em PT-BR, tenta em inglês
    if (!key) {
      const urlEn = `${BASE_URL}${endpoint}?api_key=${API_KEY}&language=en-US`
      const resEn = await fetch(urlEn)
      if (resEn.ok) {
        const dataEn = await resEn.json()
        const videosEn = dataEn.results || []
        let trailerEn = videosEn.find((v: any) => v.type === 'Trailer' && v.site === 'YouTube' && v.official)
        if (!trailerEn) trailerEn = videosEn.find((v: any) => v.type === 'Trailer' && v.site === 'YouTube')
        if (!trailerEn) trailerEn = videosEn.find((v: any) => v.site === 'YouTube')
        const keyEn = trailerEn?.key || ''
        trailerCache.set(tmdbId, keyEn)
        if (keyEn) console.log(`[TMDB] 🎬 Trailer (EN): ${mediaType}/${tmdbId} → ${keyEn}`)
        return keyEn
      }
    }

    return key
  } catch (e) {
    console.warn(`[TMDB] Erro ao buscar trailer:`, e)
    return ''
  }
}

/**
 * Limpa o cache TMDB (memória + IndexedDB).
 */
export async function clearTmdbCache(): Promise<void> {
  memoryCache.clear()
  trailerCache.clear()
  try {
    const db = await openTmdbDB()
    return new Promise((resolve, reject) => {
      const tx = db.transaction(TMDB_STORE, 'readwrite')
      const r = tx.objectStore(TMDB_STORE).clear()
      r.onsuccess = () => { console.log('[TMDB] cache cleared'); resolve() }
      r.onerror = () => reject(r.error)
    })
  } catch { /* silent */ }
}
