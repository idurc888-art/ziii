import { create } from 'zustand'
import type { Channel } from '../types/channel'
import { mockGroups } from '../data/mockChannels'
import { CatalogMatcher, type MatchStatus, type MatchedChannel } from '../services/catalogMatcher'
import { normalizeGroups, type UICategory } from '../services/categoryMapper'
import { ContentCatalog } from '../services/contentCatalog'
import * as db from '../services/dbClient'

type LoadStatus = MatchStatus | 'idle' | 'ready'
type BootStatus = 'cold' | 'warming' | 'warm'

interface ChannelsState {
  // Dados do novo pipeline (CatalogMatcher)
  matchedChannels: MatchedChannel[]
  unmatchedChannels: Channel[]
  
  // Dados normalizados (pipeline nível 2 — UI consome isto)
  normalizedGroups: Record<UICategory, Channel[]>

  currentChannel: Channel | null
  status: LoadStatus
  bootStatus: BootStatus
  progress: number
  progressMessage: string
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
  matchedChannels: [],
  unmatchedChannels: [],
  normalizedGroups: { ...EMPTY_NORMALIZED },
  currentChannel: null,
  status: 'idle',
  bootStatus: 'cold',
  progress: 0,
  progressMessage: '',
  error: null,
  lastUrl: null,
  
  setCurrentChannel: (ch) => set({ currentChannel: ch }),
  
  loadMock: () => set({ 
    normalizedGroups: normalizeGroups(mockGroups),
    status: 'ready', 
    bootStatus: 'warm',
    progress: 100,
    progressMessage: 'Mock carregado',
    error: null,
    lastUrl: null
  }),
  
  loadFromUrl: async (url) => {
    const state = get()
    
    // Previne reprocessamento da mesma URL na memória
    if (state.lastUrl === url && state.status === 'done') {
      console.log('[Store] memory_hit - URL já carregada')
      return
    }
    
    // Previne execução simultânea (in-flight)
    if (state.status === 'fetching' || state.status === 'parsing' || state.status === 'matching') {
      console.log('[Store] in_flight_reuse')
      return
    }
    
    set({ 
      status: 'fetching', 
      bootStatus: 'warming',
      progress: 0, 
      progressMessage: 'Iniciando...', 
      error: null,
      lastUrl: url 
    })
    
    try {
      // Pluga o callback de progresso para atualizar o Zustand em tempo real
      CatalogMatcher.onProgress = (status, progress, message) => {
        set({ status, progress, progressMessage: message })
      }
      
      // Dispara o motor de match (Worker faz tudo: fetch + parse + match)
      const { matched, unmatched } = await CatalogMatcher.loadAndMatch(url)
      
      console.log(`[Store] Match concluído: ${matched.length} matched, ${unmatched.length} unmatched`)
      
      // Converte matched[] para formato que a UI espera (grupos por categoria)
      // Temporariamente usa o group original até refatorarmos o ContentSelector
      const groupsByCategory: Record<string, Channel[]> = {}
      
      for (const ch of matched) {
        const cat = ch.canonical.streaming // ou ch.group
        if (!groupsByCategory[cat]) groupsByCategory[cat] = []
        groupsByCategory[cat].push(ch)
      }
      
      // Adiciona unmatched também (vão para 'outros')
      for (const ch of unmatched) {
        if (!groupsByCategory[ch.group]) groupsByCategory[ch.group] = []
        groupsByCategory[ch.group].push(ch)
      }
      
      // Normaliza para as 8 categorias da UI
      const normalizedGroups = normalizeGroups(groupsByCategory)
      
      // Inicializa catálogo ANTES de atualizar estado React
      ContentCatalog.init(normalizedGroups)
      
      // Persiste a URL para a próxima sessão
      localStorage.setItem('ziiiTV_lastUrl', url)
      
      // Finaliza o estado com sucesso
      set({ 
        matchedChannels: matched,
        unmatchedChannels: unmatched,
        normalizedGroups,
        status: 'done', 
        bootStatus: 'warm',
        progress: 100, 
        progressMessage: 'Concluído',
        error: null
      })
      
      // TMDB warmup em background (NÃO bloqueante) — só para unmatched
      ContentCatalog.warmup().catch(err => {
        console.warn('[Store] TMDB warmup error (non-fatal):', err)
      })
      
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error)
      console.error('[Store] Falha crítica no pipeline M3U:', error)
      set({ 
        status: 'error', 
        progress: 0, 
        progressMessage: errorMsg,
        error: errorMsg
      })
    }
  },
  
  clearCache: async () => {
    CatalogMatcher.reset()
    await db.clear()
    localStorage.removeItem('ziiiTV_lastUrl')
    set({ 
      matchedChannels: [],
      unmatchedChannels: [],
      normalizedGroups: { ...EMPTY_NORMALIZED },
      currentChannel: null, 
      status: 'idle', 
      bootStatus: 'cold',
      progress: 0,
      progressMessage: '',
      error: null,
      lastUrl: null
    })
  },
}))
