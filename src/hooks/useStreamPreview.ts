// src/hooks/useStreamPreview.ts
// Double-buffer AVPlay: próximo slide já carrega em background enquanto atual toca.
// Quando slide muda → swap instantâneo, sem esperar buffer.

import { useEffect, useRef, useState } from 'react'
import type { Channel } from '../types/channel'

interface DisplayRect { x: number; y: number; w: number; h: number }

interface PreviewOptions {
  idleDelay?: number
  previewDuration?: number
  seekToMs?: number
  fadeDuration?: number
  onStopped?: (currentTimeMs: number) => void  // chamado quando preview para (para salvar offset)
  playerIdPrefix?: string // prefixo para os IDs (ex: 'carousel-player')
  /** Rect em coordenadas de tela (px) onde o hardware player deve renderizar.
   *  Default: fullscreen (comportamento do HeroBanner).
   *  Para o HeroCarousel passe as coordenadas exatas do card ativo. */
  displayRect?: DisplayRect
}

export type PreviewState = 'idle' | 'loading' | 'playing' | 'error'

let isAVPlayBusy = false

function pickPreviewUrl(ch: Channel): string {
  const sd = ch.streams?.find(s => 
    (s.quality && s.quality.toUpperCase() === 'SD') ||
    (s.label && s.label.toUpperCase().includes('SD'))
  )
  const stream = sd || ch.activeStream || ch.streams?.[0]
  return stream?.url || ''
}

function isVOD(ch: Channel): boolean {
  const url = (ch.activeStream?.url || '').toLowerCase()
  return /\/(vod|movie|series|episode)\/|\.mp4$|\.mkv$/.test(url)
}

export function useStreamPreview(
  channel: Channel | null,
  nextChannel: Channel | null,   // próximo slide — para pré-carregar
  isVisible: boolean,
  opts: PreviewOptions = {}
) {
  const {
    idleDelay       = 800,
    previewDuration = 0, // 0 = infinito
    seekToMs        = 270000,
    fadeDuration    = 350,
    playerIdPrefix  = 'av-hero-player',
    displayRect,
  } = opts

  // Rect final: usa o customizado ou full-screen como fallback (HeroBanner)
  const getRealRect = (): DisplayRect =>
    displayRect ?? {
      x: 0,
      y: 0,
      w: typeof window !== 'undefined' ? window.screen.width : 1920,
      h: typeof window !== 'undefined' ? window.screen.height : 1080,
    }

  const PLAYER_IDS = [`${playerIdPrefix}-a`, `${playerIdPrefix}-b`]

  const [state, setState]           = useState<PreviewState>('idle')
  const [isVideoVisible, setIsVideoVisible] = useState(false)
  const [activeSlot] = useState(0)   // 0 = player-a, 1 = player-b

  const slotRef      = useRef(0)          // slot ativo
  const players      = useRef<any[]>([null, null])  // instâncias avplay por slot
  const buffered     = useRef<Set<string>>(new Set()) // IDs já em buffer
  const activeIdRef  = useRef('')
  const idleTimer    = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const previewTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const optsRef      = useRef(opts)
  optsRef.current    = opts  // sempre atualizado para cleanup acessar onStopped

  const getAvplay = () => (window as any).webapis?.avplay

  // ─── Para e fecha um slot ──────────────────────────
  const closeSlot = (slot: number) => {
    try { players.current[slot]?.stop?.() } catch {}
    try { players.current[slot]?.close?.() } catch {}
    players.current[slot] = null
    isAVPlayBusy = false
  }

  // ─── Pré-carrega canal em background no slot inativo ──
  const prefetch = (ch: Channel) => {
    const avplay = getAvplay()
    if (!avplay || buffered.current.has(ch.id) || isAVPlayBusy) return
    const inactiveSlot = slotRef.current === 0 ? 1 : 0
    closeSlot(inactiveSlot)

    const url = pickPreviewUrl(ch)
    if (!url) return
    
    isAVPlayBusy = true
    try {
      avplay.open(url)
      try { avplay.setDisplayMethod('PLAYER_EXTERNAL_OUTPUT_MODE_NONE') } catch (_) {}
      avplay.setDisplayRect(0, 0, 1, 1) // invisível

      avplay.setListener({
        onbufferingcomplete: () => {
          buffered.current.add(ch.id)
          if (isVOD(ch)) {
            try { avplay.seekTo(seekToMs) } catch {}
          }
          try { avplay.pause() } catch {}
          isAVPlayBusy = false
        },
        onerror: () => { 
          closeSlot(inactiveSlot)
          isAVPlayBusy = false
        }
      })

      avplay.prepareAsync(() => {
        try {
          avplay.play()
          players.current[inactiveSlot] = avplay
        } catch {
          isAVPlayBusy = false
        }
      }, () => {
        closeSlot(inactiveSlot)
        isAVPlayBusy = false
      })
    } catch (e) {
      isAVPlayBusy = false
    }
  }

  // ─── Parar tudo e zerar estado ────────────────────
  const cleanup = (saveOffset = true) => {
    clearTimeout(idleTimer.current)
    clearTimeout(previewTimer.current)
    
    if (saveOffset && optsRef.current.onStopped) {
      const avplay = getAvplay()
      if (avplay) {
        try {
          const currentMs = avplay.getCurrentTime()
          if (currentMs > 0) optsRef.current.onStopped(currentMs)
        } catch {}
      }
    }
    setIsVideoVisible(false)
    setState('idle')
    closeSlot(0)
    closeSlot(1)
    buffered.current.clear()
    activeIdRef.current = ''
    isAVPlayBusy = false
  }

  // ─── Iniciar preview do canal atual ───────────────
  const startPreview = (ch: Channel) => {
    const avplay = getAvplay()
    const channelId = ch.id
    activeIdRef.current = channelId
    setState('loading')

    if (!avplay) {
      setState('playing')
      setIsVideoVisible(true)
      previewTimer.current = setTimeout(cleanup, previewDuration)
      return
    }

    if (isAVPlayBusy) {
      setState('error')
      return
    }

    const slot = slotRef.current
    const alreadyBuffered = buffered.current.has(channelId)

    const onReady = () => {
      if (activeIdRef.current !== channelId) return
      if (!alreadyBuffered && isVOD(ch)) {
        try { avplay.seekTo(seekToMs) } catch {}
      }
      const r = getRealRect()
      avplay.setDisplayRect(r.x, r.y, r.w, r.h)
      setIsVideoVisible(true)
      setState('playing')

      if (previewDuration > 0) {
        previewTimer.current = setTimeout(() => {
          if (activeIdRef.current !== channelId) return
          if (optsRef.current.onStopped) {
            const av = getAvplay()
            if (av) {
              try {
                const currentMs = av.getCurrentTime()
                if (currentMs > 0) optsRef.current.onStopped(currentMs)
              } catch {}
            }
          }
          setIsVideoVisible(false)
          setTimeout(() => cleanup(false), fadeDuration)
        }, previewDuration)
      }
    }

    if (alreadyBuffered && players.current[slot]) {
      try {
        const r = getRealRect()
        avplay.setDisplayRect(r.x, r.y, r.w, r.h)
        avplay.resume()
      } catch {}
      onReady()
    } else {
      closeSlot(slot)
      const url = pickPreviewUrl(ch)
      if (!url) {
        setState('error')
        return
      }
      
      isAVPlayBusy = true
      try {
        avplay.open(url)
        try { avplay.setDisplayMethod('PLAYER_EXTERNAL_OUTPUT_MODE_NONE') } catch (_) {}
        const r = getRealRect()
        avplay.setDisplayRect(r.x, r.y, r.w, r.h)
        
        avplay.setListener({
          onbufferingcomplete: onReady,
          onerror: () => { 
            if (activeIdRef.current === channelId) setState('error')
            isAVPlayBusy = false
          }
        })

        avplay.prepareAsync(() => {
          try {
            avplay.play()
            players.current[slot] = avplay
          } catch (e) {
            setState('error')
            isAVPlayBusy = false
          }
        }, () => {
          setState('error')
          isAVPlayBusy = false
        })
      } catch (e) {
        setState('error')
        isAVPlayBusy = false
      }
    }
  }

  useEffect(() => {
    clearTimeout(idleTimer.current)
    clearTimeout(previewTimer.current)
    setIsVideoVisible(false)

    closeSlot(slotRef.current)
    setState('idle')
    activeIdRef.current = ''

    if (!channel || !isVisible) return

    idleTimer.current = setTimeout(() => startPreview(channel), idleDelay)
    return () => {
      clearTimeout(idleTimer.current)
      clearTimeout(previewTimer.current)
    }
  }, [channel?.id, isVisible])

  useEffect(() => {
    if (!nextChannel || !isVisible) return
    const t = setTimeout(() => prefetch(nextChannel), 3000)
    return () => clearTimeout(t)
  }, [nextChannel?.id, isVisible])

  useEffect(() => () => cleanup(), [])

  return {
    state,
    isVideoVisible,
    activePlayerId: PLAYER_IDS[activeSlot],
    isPlaying: state === 'playing',
    videoStyle: {
      opacity: isVideoVisible ? 1 : 0,
      transition: `opacity ${fadeDuration}ms ease-out`,
      pointerEvents: 'none' as const
    },
    backdropStyle: {
      opacity: isVideoVisible ? 0 : 1,
      transition: `opacity ${fadeDuration}ms ease-in-out`
    }
  }
}
