import { parseM3U } from '@iptv/playlist'
import type { Channel, RawChannel } from '../types/channel'
import { normalizeStreams } from './streamNormalizer'
import * as db from './dbClient'

const DEBUG = false // Feature flag para logs detalhados

export interface CacheEntry {
  data: Record<string, Channel[]>
  status: string
  loadedAt: number
  channelCount: number
  source: 'memory' | 'cache' | 'remote'
}

let loadId = 0
const activeLoads = new Map<string, Promise<Record<string, Channel[]>>>()
const loadedUrls = new Map<string, CacheEntry>()

async function checkCache(url: string, id: number): Promise<Record<string, Channel[]> | null> {
  console.log(`[Run #${id}] cache_check`)
  try {
    const cached = await db.get(url)
    if (cached) {
      console.log(`[Run #${id}] cache_hit`)
      return cached
    }
  } catch (err) {
    console.warn(`[Run #${id}] cache_error — ignorando:`, err)
  }
  console.log(`[Run #${id}] cache_miss`)
  return null
}

async function loadRemote(url: string, id: number): Promise<Record<string, Channel[]>> {
  console.log(`[Run #${id}] remote_fetch`)
  if (DEBUG) console.log(`[Playlist #${id}] Fetch iniciado`)
  
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  
  const text = await res.text()
  const playlist = parseM3U(text)
  
  const rawChannels: RawChannel[] = playlist.channels.map(item => ({
    name: item.name ?? '',
    url: item.url ?? '',
    logo: item.tvgLogo ?? '',
    group: item.groupTitle ?? 'Sem categoria'
  }))

  const channels = normalizeStreams(rawChannels)

  const groups: Record<string, Channel[]> = {}
  let count = channels.length

  for (const ch of channels) {
    if (!groups[ch.group]) groups[ch.group] = []
    groups[ch.group].push(ch)
  }
  
  if (DEBUG) console.log(`[Playlist #${id}] Parse completo: ${Object.keys(groups).length} grupos, ${count} canais`)
  
  if (DEBUG) console.log(`[Playlist #${id}] Salvando cache`)
  await db.put(url, groups)
  
  return groups
}

export async function loadPlaylist(url: string): Promise<Record<string, Channel[]>> {
  const id = ++loadId
  console.log(`[Run #${id}] start`)
  
  // Idempotência: RAM primeiro
  if (loadedUrls.has(url)) {
    console.log(`[Run #${id}] memory_hit`)
    console.log(`[Run #${id}] ready (source: memory)`)
    return loadedUrls.get(url)!.data
  }
  console.log(`[Run #${id}] no_memory`)
  
  // Reutiliza promise em andamento
  if (activeLoads.has(url)) {
    console.log(`[Run #${id}] in_flight_reuse`)
    console.log(`[Run #${id}] ready (source: in_flight_reused)`)
    return activeLoads.get(url)!
  }
  console.log(`[Run #${id}] no_in_flight`)
  
  const promise = (async () => {
    try {
      // Tenta cache persistente
      let groups = await checkCache(url, id)
      let source: CacheEntry['source'] = 'cache'
      
      // Se não, fetch remoto
      if (!groups) {
        groups = await loadRemote(url, id)
        source = 'remote'
      }
      
      console.log(`[Run #${id}] ready (source: ${source})`)
      
      // Conta os canais (já agrupados)
      const channelCount = Object.values(groups).reduce((acc, curr) => acc + curr.length, 0)
      
      // Armazena metadados na memória
      loadedUrls.set(url, {
        data: groups,
        status: 'ready',
        loadedAt: Date.now(),
        channelCount,
        source
      })
      
      return groups
    } catch (err) {
      console.log(`[Run #${id}] error`)
      throw err
    } finally {
      activeLoads.delete(url)
    }
  })()
  
  activeLoads.set(url, promise)
  return promise
}

export async function clearPlaylistCache(): Promise<void> {
  await db.clear()
  loadedUrls.clear()
  activeLoads.clear()
}

