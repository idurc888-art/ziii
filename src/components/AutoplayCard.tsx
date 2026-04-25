import React, { useRef } from 'react'
import { useCardAutoplay } from '../hooks/useCardAutoplay'
import { useSeamlessExpand } from '../hooks/useSeamlessExpand'
import type { Channel } from '../types/channel'
import { playerManager } from '../services/PlayerManager'

interface Props {
  channel: Channel
  isFocused: boolean
  onClick?: () => void
  width: number
  height: number
  left: number
  top: number
  zIndex: number
  borderRadius: number
  focusBorder: string
  backdropSrc: string | null
  children?: React.ReactNode
}

const FOCUS_DURATION = 300
const FOCUS_EASING = 'cubic-bezier(0.4, 0, 0.2, 1)'

export default function AutoplayCard({
  channel, isFocused, onClick,
  width, height, left, top, zIndex,
  borderRadius, focusBorder, backdropSrc, children
}: Props) {

  const cardRef = useRef<HTMLDivElement>(null)

  const { thumbnailOpacity } = useCardAutoplay({
    cardId: channel.id,
    streams: channel.streams || [],
    focused: isFocused,
    cardRef,
  })

  // Para o SeamlessExpand, usamos o ID global injetado pelo PlayerManager
  const { expand } = useSeamlessExpand({ 
    cardId: channel.id, 
    objectId: playerManager.getGlobalObjectId() 
  })

  // NOTA: O listener de Enter foi REMOVIDO daqui.
  // O controle do D-pad é 100% centralizado via keyboardMaestro (Vanilla JS puro).
  // Zero listeners React duplicados = Zero Input Lag.

  // Expõe handleAction via ref para que o HomeScreen possa invocar a expansão
  const handleAction = () => {
    if (onClick) onClick()
    if (cardRef.current && isFocused) {
      expand(channel, cardRef.current)
    }
  }

  return (
    <div
      ref={cardRef}
      onClick={handleAction}
      style={{
        position: 'absolute',
        left, top,
        width, height, zIndex,
        borderRadius,
        cursor: 'pointer',
        // Tizen Hardware: quando focado e tocando, NAO usar overflow:hidden!
        // O AVPlay renderiza como layer de hardware ATRAS do HTML.
        // overflow:hidden cortaria o hole punch e o video ficaria invisivel.
        overflow: isFocused && thumbnailOpacity < 1 ? 'visible' : 'hidden',
        // Borda sempre via outline (não afetada por overflow:hidden)
        outline: isFocused ? focusBorder : '2px solid transparent',
        outlineOffset: '0px',
        border: 'none',
        opacity: isFocused ? 1 : 0,
        pointerEvents: isFocused ? 'auto' : 'none',
        transition: `opacity ${FOCUS_DURATION}ms ${FOCUS_EASING}`,
        // boxShadow inset mantém o efeito visual interno
        boxShadow: isFocused ? 'inset 0 0 0 3px rgba(0,0,0,0.9)' : 'none',
        transform: 'none',
      }}
    >
      {/* Fundo: preto por padrão. Transparent quando AVPlay toca (hole-punch).
          REGRA: Se thumbnailOpacity < 1 E AVPlay existe → transparent.
          Sem AVPlay (desktop) → preto para não expor fundo do browser. */}
      <div 
        id="autoplay-punch-hole"
        style={{
          position: 'absolute', left: 8, top: 8,
          width: 'calc(100% - 16px)', height: 'calc(100% - 16px)',
          backgroundColor: thumbnailOpacity < 1 ? 'transparent' : '#000',
          transition: 'none',
          zIndex: 0,
          pointerEvents: 'none',
          borderRadius: borderRadius, // manter cantos arredondados caso vaze
      }} />

      {/* Camada 1: O AVPlay <object> */}

      <img
        id="autoplay-punch-img"
        src={backdropSrc || undefined}
        style={{
          position: 'absolute', left: 8, top: 8,
          width: 'calc(100% - 16px)', height: 'calc(100% - 16px)',
          objectFit: 'cover',
          zIndex: 1,
          display: 'block',
          opacity: thumbnailOpacity,
          visibility: thumbnailOpacity === 0 ? 'hidden' : 'visible',
          // Transição SEMPRE instantânea - o fade suave é feito via delay no setState
          transition: 'none',
        }}
        onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
      />

      {/* Camada 3: Gradiente — some quando vídeo está tocando para não tampar hole-punch */}
      <div style={{
        position: 'absolute', bottom: 8, left: 8, 
        width: 'calc(100% - 16px)', height: '50%',
        background: 'linear-gradient(transparent, rgba(0,0,0,0.92))',
        zIndex: 2,
        opacity: thumbnailOpacity,
        transition: 'none',
        pointerEvents: 'none',
      }} />

      {/* Camada 4: Title / Logo / Badge (repassados pelo HomeScreen) */}
      {children}
    </div>
  )
}
