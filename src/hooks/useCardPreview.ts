import { getHeroOffset, saveHeroOffset } from '../services/historyService'
import { useStreamPreview } from './useStreamPreview'
import type { Channel } from '../types/channel'

interface UseCardPreviewOptions {
  focused: boolean
  previewDuration?: number // default 10s
}

export function useCardPreview(channel: Channel | null, opts: UseCardPreviewOptions) {
  const { focused, previewDuration = 10_000 } = opts

  return useStreamPreview(channel, null, focused, {
    idleDelay: 300, // cards devem responder rápido
    previewDuration: focused ? previewDuration : 0, // 0 = infinito enquanto focado
    seekToMs: getHeroOffset(channel?.name || ''),
    onStopped: (offsetMs) => {
      if (channel) saveHeroOffset(channel.name, offsetMs)
    },
  })
}
