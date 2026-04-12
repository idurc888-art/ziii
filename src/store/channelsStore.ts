import { create } from 'zustand'
import type { Channel } from '../app/App'
import { createM3UWorker } from '../services/m3uWorker'

interface ChannelsState {
  channels: Channel[]
  groups: Record<string, Channel[]>
  m3uUrl: string
  loading: boolean
  parseProgress: number
  error: string | null
  currentChannel: Channel | null
  setM3uUrl: (url: string) => void
  parseM3U: (raw: string, maxChannels?: number) => Promise<void>
  setCurrentChannel: (channel: Channel | null) => void
}

const HISTORY_KEY = 'ziiitv_history'

function saveHistory(ch: Channel) {
  try {
    const prev: Channel[] = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]')
    const next = [ch, ...prev.filter(c => c.url !== ch.url)].slice(0, 20)
    localStorage.setItem(HISTORY_KEY, JSON.stringify(next))
  } catch (_) {}
}

export function getHistory(): Channel[] {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]') } catch (_) { return [] }
}

export const useChannelsStore = create<ChannelsState>((set) => ({
  channels: [],
  groups: {},
  m3uUrl: localStorage.getItem('m3u_url') || '',
  loading: false,
  parseProgress: 0,
  error: null,
  currentChannel: null,

  setM3uUrl: (url) => { localStorage.setItem('m3u_url', url); set({ m3uUrl: url }) },

  parseM3U: (raw, maxChannels = 10000) => new Promise((resolve, reject) => {
    set({ loading: true, parseProgress: 0, error: null })
    const worker = createM3UWorker()
    worker.onmessage = (e) => {
      const { type, payload, percent, error } = e.data
      if (type === 'PROGRESS') set({ parseProgress: percent })
      else if (type === 'DONE') {
        set({ channels: payload.channels, groups: payload.grouped, loading: false, parseProgress: 100 })
        worker.terminate(); resolve()
      } else if (type === 'ERROR') {
        set({ loading: false, error }); worker.terminate(); reject(new Error(error))
      }
    }
    worker.onerror = (err) => { set({ loading: false, error: 'Worker error' }); worker.terminate(); reject(err) }
    worker.postMessage({ type: 'PARSE', payload: raw, maxChannels })
  }),

  setCurrentChannel: (channel) => {
    set({ currentChannel: channel })
    if (channel) saveHistory(channel)
  }
}))
