import { create } from 'zustand'
import { type Channel, mockGroups } from '../data/mockChannels'

interface ChannelsState {
  groups: Record<string, Channel[]>
  currentChannel: Channel | null
  setCurrentChannel: (ch: Channel) => void
  loadMock: () => void
}

export const useChannelsStore = create<ChannelsState>((set) => ({
  groups: {},
  currentChannel: null,
  setCurrentChannel: (ch) => set({ currentChannel: ch }),
  loadMock: () => set({ groups: mockGroups }),
}))
