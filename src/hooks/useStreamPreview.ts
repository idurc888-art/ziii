// src/hooks/useStreamPreview.ts
// Preview do stream real do canal — sem YouTube, funciona 100% no Tizen

import { useEffect, useRef, useState } from 'react'
import type { Channel } from '../types/channel'

interface PreviewOptions {
  idleDelay?: number      // ms até iniciar preview (default: 1500)
  previewDuration?: number // ms de duração do preview (default: 15000)
  seekToMs?: number        // onde fazer seek no VOD (default: 270000 = 4min30s)
  fadeDuration?: number    // ms do fade in/out (default: 400)
}

export type PreviewState = 'idle' | 'loading' | 'playing' | 'error'

export function useStreamPreview(
  channel: Channel | null,
  isVisible: boolean,
  opts: PreviewOptions = {}
) {
  const {
    idleDelay     = 1500,
    previewDuration = 15000,
    seekToMs      = 270000,  // 4min30s
    fadeDuration  = 400,
  } = opts

  const [state, setState]         = useState<PreviewState>('idle')
  const [isVideoVisible, setIsVideoVisible] = useState(false)

  const idleTimer    = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const previewTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const avplayRef    = useRef<any>(null)     // webapis.avplay
  const objectRef    = useRef<HTMLObjectElement | null>(null)
  const activeIdRef  = useRef<string>('')

  // ─── Limpar tudo ──────────────────────────────────
  const cleanup = () => {
    clearTimeout(idleTimer.current)
    clearTimeout(previewTimer.current)
    setIsVideoVisible(false)
    setState('idle')

    try {
      if (avplayRef.current) {
        avplayRef.current.stop()
        avplayRef.current.close()
      }
    } catch {}
    avplayRef.current = null
  }

  // ─── Detectar se é VOD ou LIVE ────────────────────
  const isVOD = (ch: Channel): boolean => {
    if (!ch.activeStream?.url) return false;
    const url = ch.activeStream.url.toLowerCase()
    return (
      url.includes('/vod/') ||
      url.includes('/movie/') ||
      url.includes('/series/') ||
      url.includes('/episode/') ||
      url.endsWith('.mp4') ||
      url.endsWith('.mkv')
    )
  }

  // ─── Selecionar stream mais leve para preview (SD > HD > melhor) ──
  const pickPreviewStream = (ch: Channel): string => {
    const order: Array<Channel['activeStream']['quality']> = ['SD', 'UNKNOWN', 'HD', 'FHD', '4K']
    for (const q of order) {
      const s = ch.streams.find(s => s.quality === q)
      if (s) return s.url
    }
    return ch.activeStream.url
  }

  // ─── Iniciar preview ──────────────────────────────
  const startPreview = async (ch: Channel) => {
    const previewUrl = pickPreviewStream(ch)
    if (!previewUrl) return;
    const channelId = ch.id
    activeIdRef.current = channelId
    setState('loading')

    try {
      // Obtém AVPlay do Tizen
      const avplay = (window as any).webapis?.avplay
      if (!avplay) {
        // Fora do Tizen (dev local) — simula sucesso
        setState('playing')
        setIsVideoVisible(true)
        previewTimer.current = setTimeout(cleanup, previewDuration)
        return
      }

      avplayRef.current = avplay

      // Prepara o elemento object do AVPlay
      avplay.open(previewUrl)

      avplay.setListener({
        onbufferingcomplete: () => {
          if (activeIdRef.current !== channelId) return

          const duration = avplay.getDuration()
          const isLive = duration === 0 || duration === -1

          if (!isLive && isVOD(ch)) {
            // VOD: seek para 4min30s
            try { avplay.seekTo(seekToMs) } catch {}
          }
          // Fade in
          setIsVideoVisible(true)
          setState('playing')

          // Timer para encerrar preview
          previewTimer.current = setTimeout(() => {
            if (activeIdRef.current !== channelId) return
            setIsVideoVisible(false)
            setTimeout(cleanup, fadeDuration)
          }, previewDuration)
        },

        onerror: () => {
          if (activeIdRef.current !== channelId) return
          setState('error')
          cleanup()
        },
      })

      // Set display rect based on global window size or container size.
      avplay.setDisplayRect(0, 0, window.screen.width, window.screen.height)
      avplay.play()

    } catch (err) {
      console.warn('[StreamPreview] erro:', err)
      setState('error')
    }
  }

  // ─── Efeito principal ─────────────────────────────
  useEffect(() => {
    cleanup()

    if (!channel || !isVisible) return

    idleTimer.current = setTimeout(() => {
      startPreview(channel)
    }, idleDelay)

    return cleanup
  }, [channel?.id, isVisible])

  return {
    state,
    isVideoVisible,
    objectRef,         // attach no <object> element do AVPlay
    isPlaying: state === 'playing',
    isLoading: state === 'loading',

    // Estilos de fade
    videoStyle: {
      opacity: isVideoVisible ? 1 : 0,
      transition: `opacity ${fadeDuration}ms ease-in-out`,
    },
    backdropStyle: {
      opacity: isVideoVisible ? 0 : 1,
      transition: `opacity ${fadeDuration}ms ease-in-out`,
    },
  }
}
