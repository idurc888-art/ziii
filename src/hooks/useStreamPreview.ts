// src/hooks/useStreamPreview.ts
// Double-buffer AVPlay: próximo slide já carrega em background enquanto atual toca.
// Quando slide muda → swap instantâneo, sem esperar buffer.

import { useEffect, useRef, useState } from 'react'
import type { Channel } from '../types/channel'

interface PreviewOptions {
  idleDelay?: number
  previewDuration?: number
  seekToMs?: number
  fadeDuration?: number
}

export type PreviewState = 'idle' | 'loading' | 'playing' | 'error'

// IDs dos dois elementos <object> AVPlay no DOM
const PLAYER_IDS = ['av-hero-player-a', 'av-hero-player-b']

function pickPreviewUrl(ch: Channel): string {
  const order: Array<Channel['activeStream']['quality']> = ['SD', 'UNKNOWN', 'HD', 'FHD', '4K']
  for (const q of order) {
    const s = ch.streams.find(s => s.quality === q)
    if (s) return s.url
  }
  return ch.activeStream.url
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
  } = opts

  const [state, setState]           = useState<PreviewState>('idle')
  const [isVideoVisible, setIsVideoVisible] = useState(false)
  const [activeSlot] = useState(0)   // 0 = player-a, 1 = player-b

  const slotRef      = useRef(0)          // slot ativo
  const players      = useRef<any[]>([null, null])  // instâncias avplay por slot
  const buffered     = useRef<Set<string>>(new Set()) // IDs já em buffer
  const activeIdRef  = useRef('')
  const idleTimer    = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const previewTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const getAvplay = () => (window as any).webapis?.avplay

  // ─── Para e fecha um slot ──────────────────────────
  const closeSlot = (slot: number) => {
    try { players.current[slot]?.stop?.() } catch {}
    try { players.current[slot]?.close?.() } catch {}
    players.current[slot] = null
  }

  // ─── Pré-carrega canal em background no slot inativo ──
  const prefetch = (ch: Channel) => {
    const avplay = getAvplay()
    if (!avplay || buffered.current.has(ch.id)) return
    const inactiveSlot = slotRef.current === 0 ? 1 : 0
    closeSlot(inactiveSlot)

    const url = pickPreviewUrl(ch)
    try {
      avplay.open(url)
      avplay.setDisplayRect(0, 0, 1, 1) // invisível

      avplay.setListener({
        onbufferingcomplete: () => {
          buffered.current.add(ch.id)
          if (isVOD(ch)) {
            try { avplay.seekTo(seekToMs) } catch {}
          }
          try { avplay.pause() } catch {}
        },
        onerror: () => { closeSlot(inactiveSlot) }
      })

      avplay.prepareAsync(() => {
        try {
          avplay.play()
          players.current[inactiveSlot] = avplay
        } catch {}
      }, () => {
        closeSlot(inactiveSlot)
      })
    } catch {}
  }

  // ─── Cleanup geral ────────────────────────────────
  const cleanup = () => {
    clearTimeout(idleTimer.current)
    clearTimeout(previewTimer.current)
    setIsVideoVisible(false)
    setState('idle')
    closeSlot(0)
    closeSlot(1)
    buffered.current.clear()
    activeIdRef.current = ''
  }

  // ─── Iniciar preview do canal atual ───────────────
  const startPreview = (ch: Channel) => {
    const avplay = getAvplay()
    const channelId = ch.id
    activeIdRef.current = channelId
    setState('loading')

    if (!avplay) {
      // Dev local — simula
      setState('playing')
      setIsVideoVisible(true)
      previewTimer.current = setTimeout(cleanup, previewDuration)
      return
    }

    const slot = slotRef.current
    const alreadyBuffered = buffered.current.has(channelId)

    const onReady = () => {
      if (activeIdRef.current !== channelId) return
      if (!alreadyBuffered && isVOD(ch)) {
        try { avplay.seekTo(seekToMs) } catch {}
      }
      avplay.setDisplayRect(0, 0, window.screen.width, window.screen.height)
      setIsVideoVisible(true)
      setState('playing')

      // Apenas seta timeout se for configurado (maior que zero)
      if (previewDuration > 0) {
        previewTimer.current = setTimeout(() => {
          if (activeIdRef.current !== channelId) return
          setIsVideoVisible(false)
          setTimeout(cleanup, fadeDuration)
        }, previewDuration)
      }
    }

    if (alreadyBuffered && players.current[slot]) {
      // Swap instantâneo — já estava em buffer
      try {
        avplay.setDisplayRect(0, 0, window.screen.width, window.screen.height)
        avplay.resume()
      } catch {}
      onReady()
    } else {
      closeSlot(slot)
      const url = pickPreviewUrl(ch)
      try {
        avplay.open(url)
        avplay.setDisplayRect(0, 0, window.screen.width, window.screen.height)
        
        avplay.setListener({
          onbufferingcomplete: onReady,
          onerror: () => { if (activeIdRef.current === channelId) setState('error') }
        })

        avplay.prepareAsync(() => {
          try {
            avplay.play()
            players.current[slot] = avplay
          } catch (e) {
            console.warn('[StreamPreview play]', e)
            setState('error')
          }
        }, () => {
          setState('error')
        })
      } catch (e) {
        console.warn('[StreamPreview open]', e)
        setState('error')
      }
    }
  }

  // ─── Efeito: canal atual mudou ────────────────────
  useEffect(() => {
    clearTimeout(idleTimer.current)
    clearTimeout(previewTimer.current)
    setIsVideoVisible(false)

    // Fecha apenas o slot ativo (mantém o prefetch do inativo)
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

  // ─── Efeito: pré-carrega próximo slide ────────────
  useEffect(() => {
    if (!nextChannel || !isVisible) return
    // Só prefetch depois que o atual já começou a tocar
    const t = setTimeout(() => prefetch(nextChannel), 3000)
    return () => clearTimeout(t)
  }, [nextChannel?.id, isVisible])

  // ─── Cleanup ao desmontar ─────────────────────────
  useEffect(() => () => cleanup(), [])

  return {
    state,
    isVideoVisible,
    activePlayerId: PLAYER_IDS[activeSlot],
    isPlaying: state === 'playing',
    isLoading: state === 'loading',
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
