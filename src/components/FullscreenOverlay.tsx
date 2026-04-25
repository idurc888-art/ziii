import { useEffect, useState, useRef } from 'react'
import { expandManager, type ExpandState } from '../services/expandManager'
import { keyboardMaestro } from '../services/keyboardManager'
import type { Channel } from '../types/channel'

const THEME_HIDE_SECS = 4000

export default function FullscreenOverlay({ onEnterPlayerMode }: { onEnterPlayerMode: (channel: Channel | null) => void }) {
  const [expandState, setExpandState] = useState<ExpandState>('idle')
  const [channel, setChannel] = useState<Channel | null>(null)
  const [visible, setVisible] = useState(false)
  const [showMoreInfo, setShowMoreInfo] = useState(false)
  
  // Focus: 0=Assistir, 1=Mais Informações
  const [focusIdx, setFocusIdx] = useState(0) 

  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const channelRef = useRef(channel)
  channelRef.current = channel

  // Atualiza estado local vindo do singleton
  useEffect(() => {
    const unsub = expandManager.subscribe((st, ch) => {
      setExpandState(st)
      setChannel(ch)

      if (st === 'expanding') {
        setVisible(true)
        setFocusIdx(0)
        setShowMoreInfo(false)
        resetTimer()
      } else if (st === 'collapsing' || st === 'idle') {
        setVisible(false)
        setShowMoreInfo(false)
        if (hideTimerRef.current) clearTimeout(hideTimerRef.current)
      }
    })
    return () => { unsub() }
  }, [])

  const resetTimer = () => {
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current)
    hideTimerRef.current = setTimeout(() => {
      setVisible(false)
      setShowMoreInfo(false)
    }, THEME_HIDE_SECS)
  }

  // Interações de teclado exclusivas deste overlay
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (expandState !== 'fullscreen' && expandState !== 'expanding') return

      const isUp = e.keyCode === 38 || e.key === 'ArrowUp'
      const isDown = e.keyCode === 40 || e.key === 'ArrowDown'
      const isLeft = e.keyCode === 37 || e.key === 'ArrowLeft'
      const isRight = e.keyCode === 39 || e.key === 'ArrowRight'
      const isEnter = e.keyCode === 13 || e.key === 'Enter'
      const isBack = e.keyCode === 10009 || e.keyCode === 8 || e.key === 'Backspace'

      // Se estivesse escondido, qualquer seta/tecla (menos Back e Enter agressivo) reativa
      if (!visible && (isUp || isDown || isLeft || isRight || isEnter)) {
        e.preventDefault()
        setVisible(true)
        resetTimer()
        return
      }

      resetTimer()

      if (isBack) {
        // Se estivermos mostrando "Mais Infos", fecha o popup. Senão o Maestro global pega o Back.
        if (showMoreInfo) {
          e.preventDefault()
          setShowMoreInfo(false)
        }
        return // O App.tsx / Maestro global vai interceptar back pra fazer collapse() se apropriado
      }

      if (visible) {
        e.preventDefault()

        // Sem navegação vertical estrita se tivéssemos mais botões, mas só há 2 botões na horizontal
        if (isLeft) setFocusIdx(0)
        if (isRight) setFocusIdx(1)

        if (isEnter) {
          if (focusIdx === 0) {
            // Oculta e notifica o pai que entrou "full modo player"
            setVisible(false)
            onEnterPlayerMode(channelRef.current)
          } else if (focusIdx === 1) {
            setShowMoreInfo(!showMoreInfo)
            resetTimer()
          }
        }
      }
    }

    keyboardMaestro.subscribe('fullscreen_overlay', handleKey)
    return () => keyboardMaestro.unsubscribe('fullscreen_overlay')
  }, [expandState, visible, focusIdx, showMoreInfo, onEnterPlayerMode])

  if (expandState === 'idle') return null

  // Omitindo extração de propriedades não utilizadas temporariamente (HUD limpo)


  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9997,
      pointerEvents: 'none',
    }}>
      {/* HUD desativada temporariamente para focar na aceleração de hardware e clean video */}
    </div>
  )
}
