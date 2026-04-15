import { create } from 'zustand'
import type { Channel } from '../types/channel'
import { mockGroups } from '../data/mockChannels'
import { loadPlaylist, clearPlaylistCache } from '../services/playlistService'
import { normalizeGroups, type UICategory } from '../services/categoryMapper'

type LoadStatus = 
  | 'idle' 
  | 'cache_check' 
  | 'cache_hit' 
  | 'cache_miss' 
  | 'fetching' 
  | 'parsing' 
  | 'saving' 
  | 'ready' 
  | 'error'

type BootStatus = 'cold' | 'warming' | 'warm'

interface ChannelsState {
  // Dados brutos (pipeline nível 1)
  groups: Record<string, Channel[]>
  // Dados normalizados (pipeline nível 2 — UI consome isto)
  normalizedGroups: Record<UICategory, Channel[]>

  currentChannel: Channel | null
  status: LoadStatus
  bootStatus: BootStatus
  error: string | null
  lastUrl: string | null

  setCurrentChannel: (ch: Channel | null) => void
  loadMock: () => void
  loadFromUrl: (url: string) => Promise<void>
  clearCache: () => Promise<void>
}

const EMPTY_NORMALIZED: Record<UICategory, Channel[]> = {
  filmes: [], series: [], esportes: [], infantil: [],
  abertos: [], documentarios: [], noticias: [], outros: [],
}

export const useChannelsStore = create<ChannelsState>((set, get) => ({
  groups: {},
  normalizedGroups: { ...EMPTY_NORMALIZED },
  currentChannel: null,
  status: 'idle',
  bootStatus: 'cold',
  error: null,
  lastUrl: null,
  
  setCurrentChannel: (ch) => set({ currentChannel: ch }),
  
  loadMock: () => set({ 
    groups: mockGroups, 
    normalizedGroups: normalizeGroups(mockGroups),
    status: 'ready', 
    bootStatus: 'warm',
    error: null,
    lastUrl: null
  }),
  
  loadFromUrl: async (url) => {
    const state = get()
    
    // Previne reprocessamento da mesma URL na memória
    if (state.lastUrl === url && state.status === 'ready') {
      console.log('[Store] memory_hit')
      return
    }
    
    // Previne execução simultânea (in-flight)
    if (state.status !== 'idle' && state.status !== 'ready' && state.status !== 'error') {
      console.log('[Store] in_flight_reuse')
      return
    }
    
    set({ status: 'cache_check', bootStatus: 'warming', error: null, lastUrl: url })
    
    try {
      // Pipeline nível 1: parse bruto
      const groups = await loadPlaylist(url)
      
      // Pipeline nível 2: normalização
      const normalizedGroups = normalizeGroups(groups)
      
      // Persiste a URL para a próxima sessão
      localStorage.setItem('ziiiTV_lastUrl', url)
      
      // Pipeline nível 3: UI ready
      set({ groups, normalizedGroups, status: 'ready', bootStatus: 'warm', error: null })
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err)
      set({ status: 'error', error: errorMsg })
      console.error('[Store] error:', errorMsg)
    }
  },
  
  clearCache: async () => {
    await clearPlaylistCache()
    localStorage.removeItem('ziiiTV_lastUrl')
    set({ 
      groups: {}, 
      normalizedGroups: { ...EMPTY_NORMALIZED },
      currentChannel: null, 
      status: 'idle', 
      bootStatus: 'cold',
      error: null,
      lastUrl: null
    })
  },
}))
