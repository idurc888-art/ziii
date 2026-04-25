/**
 * useCardAutoplay — Hook para gatilhos de PlayerManager
 */

import { useEffect, useRef, useCallback, useState } from 'react'
import { playerManager } from '../services/PlayerManager'
import type { Stream, StreamQuality } from '../types/channel'

export type CardPlayState = 'idle' | 'loading' | 'buffering' | 'playing' | 'error'

export interface CardAutoplayState {
  playState: CardPlayState
  thumbnailOpacity: number
  videoOpacity: number
}

interface UseCardAutoplayOptions {
  cardId: string
  streams: Stream[]
  focused: boolean
  cardRef: React.RefObject<HTMLElement | null>
  onStateChange?: (state: CardAutoplayState) => void
}

const QUALITY_WEIGHT: Record<StreamQuality, number> = {
  'SD': 1, 'HD': 2, 'FHD': 3, '4K': 4, 'UNKNOWN': 5
}

function pickLightestStream(streams: Stream[]): Stream | null {
  if (!streams?.length) return null
  return [...streams].sort((a, b) =>
    (QUALITY_WEIGHT[a.quality] || 5) - (QUALITY_WEIGHT[b.quality] || 5)
  )[0]
}

function pickHeaviestStream(streams: Stream[]): Stream | null {
  if (!streams?.length) return null
  return [...streams].sort((a, b) =>
    (QUALITY_WEIGHT[b.quality] || 0) - (QUALITY_WEIGHT[a.quality] || 0)
  )[0]
}

function getCardRect(el: HTMLElement): { x: number; y: number; w: number; h: number } {
  const rect = el.getBoundingClientRect()
  return {
    x: Math.round(rect.left),
    y: Math.round(rect.top),
    w: Math.round(rect.width),
    h: Math.round(rect.height),
  }
}

export function useCardAutoplay({
  cardId,
  streams,
  focused,
  cardRef,
  onStateChange,
}: UseCardAutoplayOptions): CardAutoplayState {

  const IDLE: CardAutoplayState = { playState: 'idle', thumbnailOpacity: 1, videoOpacity: 0 }
  const [state, setReactState] = useState<CardAutoplayState>(IDLE)
  const stateRef = useRef<CardAutoplayState>(IDLE)
  const mountedRef = useRef(true)

  const setState = useCallback((next: CardAutoplayState) => {
    if (stateRef.current.playState === next.playState &&
        stateRef.current.thumbnailOpacity === next.thumbnailOpacity &&
        stateRef.current.videoOpacity === next.videoOpacity) return
    stateRef.current = next
    setReactState(next)
    onStateChange?.(next)
  }, [onStateChange])

  useEffect(() => {
    if (!focused) {
      playerManager.cancelRequest()
      setState(IDLE)
      return
    }

    const previewStream = pickLightestStream(streams)
    if (!previewStream) return
    const mainStream = pickHeaviestStream(streams) || previewStream

    if (!playerManager.isAvailable()) {
      // Desktop Fallback
      const timer = setTimeout(() => {
        if (mountedRef.current) 
          setState({ playState: 'playing', thumbnailOpacity: 0, videoOpacity: 1 })
      }, 800)
      return () => clearTimeout(timer)
    }

    const rect = cardRef.current ? getCardRect(cardRef.current) : { x: 0, y: 0, w: 1920, h: 1080 }

    playerManager.requestPlay(previewStream.url, mainStream.url, rect, {
      onLoading: () => {
        if (mountedRef.current)
          setState({ playState: 'loading', thumbnailOpacity: 1, videoOpacity: 0 })
      },
      onPlaying: () => {
        // Disparado após `onbufferingcomplete`. Aguarda 150ms para o HW decoder
        // renderizar o primeiro frame antes de sumir com o thumb (evita flash preto).
        setTimeout(() => {
          if (mountedRef.current) {
            setState({ playState: 'playing', thumbnailOpacity: 0, videoOpacity: 1 })
          }
        }, 150)
      },
      onFirstFrameRendered: () => {
        // Obsoleto pela padronização do crossfade simultâneo no onPlaying
      },
      onError: () => {
        if (mountedRef.current)
          setState({ playState: 'error', thumbnailOpacity: 1, videoOpacity: 0 })
      }
    })

    return () => {
      playerManager.cancelRequest()
    }
  }, [focused, cardId]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    return () => {
      mountedRef.current = false
      playerManager.cancelRequest()
    }
  }, [])

  return state
}
