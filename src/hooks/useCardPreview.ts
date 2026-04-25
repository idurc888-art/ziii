import { getHeroOffset, saveHeroOffset } from '../services/historyService'
import { useStreamPreview } from './useStreamPreview'
import type { Channel } from '../types/channel'

interface DisplayRect { x: number; y: number; w: number; h: number }

interface UseCardPreviewOptions {
  focused: boolean
  previewDuration?: number // default: infinito enquanto focado
  playerIdPrefix?: string
  /** Rect em coordenadas de tela. Se omitido, o hook cai em fullscreen. */
  displayRect?: DisplayRect
}

export function useCardPreview(channel: Channel | null, opts: UseCardPreviewOptions) {
  const {
    focused,
    previewDuration = 0, // 0 = infinito — para enquanto o card está focado
    playerIdPrefix  = 'carousel-player',
    displayRect,
  } = opts

  return useStreamPreview(channel, null, focused, {
    idleDelay: 500,           // aguarda 500ms de inatividade antes de buffer
    previewDuration,
    seekToMs: getHeroOffset(channel?.name || ''),
    playerIdPrefix,
    displayRect,              // ← repassado ao setDisplayRect do hardware
    onStopped: (offsetMs) => {
      if (channel) saveHeroOffset(channel.name, offsetMs)
    },
  })
}
