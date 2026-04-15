import { create } from 'zustand'
import type { Channel } from '../types/channel'
import { mockGroups } from '../data/mockChannels'
import { loadPlaylist, clearPlaylistCache } from '../services/playlistService'

interface ChannelsState {
  groups: Record<string, Channel[]>
  currentChannel: Channel | null
  status: 'idle' | 'loading' | 'success' | 'error'
  error: string | null
  setCurrentChannel: (ch: Channel) => void
  loadMock: () => void
  loadFromUrl: (url: string) => Promise<void>
  clearCache: () => Promise<void>
}

export const useChannelsStore = create<ChannelsState>((set) => ({
  groups: {},
  currentChannel: null,
  status: 'idle',
  error: null,
  setCurrentChannel: (ch) => set({ currentChannel: ch }),
  loadMock: () => set({ groups: mockGroups, status: 'success', error: null }),
  loadFromUrl: async (url) => {
    set({ status: 'loading', error: null })
    try {
      const groups = await loadPlaylist(url)
      set({ groups, status: 'success' })
    } catch (err) {
      set({ status: 'error', error: String(err) })
    }
  },
  clearCache: async () => {
    await clearPlaylistCache()
    set({ groups: {}, currentChannel: null, status: 'idle', error: null })
  },
}))
