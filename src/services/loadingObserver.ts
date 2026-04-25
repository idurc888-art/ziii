import { create } from 'zustand'
import { Logger } from './LoggerService'

interface LoadingState {
  isLoading: boolean
  setLoading: (loading: boolean) => void
}

export const useLoadingStore = create<LoadingState>((set) => ({
  isLoading: false,
  setLoading: (loading) => {
    set({ isLoading: loading })
    Logger.boot('LOADING_OBSERVER', loading ? 'Bloqueando interface...' : 'Interface liberada')
  }
}))

/**
 * Singleton para controle de trava de input global
 */
export const loadingObserver = {
  isLocked: () => useLoadingStore.getState().isLoading,
  lock: () => useLoadingStore.getState().setLoading(true),
  unlock: () => useLoadingStore.getState().setLoading(false)
}
