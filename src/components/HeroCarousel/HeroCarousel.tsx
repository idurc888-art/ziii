/**
 * HeroCarousel — Layout Telvix (Fase 3)
 * 
 * Carrossel principal de cards com centralização do item ativo.
 * 
 * PRINCÍPIOS DE PERFORMANCE (Tizen 5.0 / Chromium 63):
 * ─────────────────────────────────────────────────────
 * 1. ZERO animação de propriedades geométricas (width/height/left/right/margin)
 * 2. Exclusivamente `transform: translate3d() scale()` + `opacity`
 * 3. translate3d() força hardware-accelerated compositing layer
 * 4. Sliding Window de 5 elementos no DOM (ativo ± 2)
 * 5. D-pad controla apenas `activeIndex` — CSS cuida da transição
 */

import { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import type { Channel } from '../../types/channel'
import { QUALITY_BADGE_COLOR } from '../../types/channel'
import { keyboardMaestro } from '../../services/keyboardManager'
import { useCardPreview } from '../../hooks/useCardPreview'
import './HeroCarousel.css'

// ─── Types ──────────────────────────────────────────────────────────────────

export interface CarouselItem {
  id: string
  title: string
  subtitle?: string
  description?: string
  badge?: string
  /** URL completa da imagem de fundo (backdrop/poster) */
  backgroundImage: string
  /** Canal M3U vinculado (para autoplay, qualidade, logo) */
  channel?: Channel
}

interface HeroCarouselProps {
  /** Lista de itens para exibir no carrossel */
  items: CarouselItem[]
  /** Callback ao confirmar (Enter) no item ativo */
  onSelect?: (item: CarouselItem, index: number) => void
  /** Se este componente deve capturar D-pad (Left/Right/Enter) */
  focused?: boolean
  /** Cor de destaque (borda do card ativo) */
  accentColor?: string
  /** ID do handler no keyboardMaestro (default: 'main:heroCarousel') */
  keyId?: string
  /** Largura em vw do card central (default: 60) */
  activeWidthVw?: number
  /** Largura em vw dos cards laterais (default: 20) */
  sideWidthVw?: number
  /** Altura em vh do carrossel (default: 75) */
  heightVh?: number
}

// ─── Helpers ────────────────────────────────────────────────────────────────

/**
 * Sliding Window: retorna apenas os índices [-2..+2] ao redor de `center`,
 * com wrapping circular para listas pequenas.
 */
function getSlidingWindow(total: number, center: number): number[] {
  if (total === 0) return []
  const indices: number[] = []
  for (let offset = -2; offset <= 2; offset++) {
    const idx = ((center + offset) % total + total) % total
    // Evita duplicatas em listas < 5
    if (!indices.includes(idx)) {
      indices.push(idx)
    }
  }
  return indices
}

/**
 * Calcula o CSS transform translate3d X offset para cada posição
 * relativa ao card ativo (centro da tela).
 *  
 * offset = 0  → centralizado (-50% do próprio card, pois left=50%)
 * offset < 0  → empurra para a esquerda
 * offset > 0  → empurra para a direita
 */
function computeTranslateX(
  offset: number,     // posição relativa ao ativo: -2, -1, 0, 1, 2
  activeWidthPx: number,
  sideWidthPx: number,
  gapPx: number,
): string {
  if (offset === 0) {
    // Card ativo: centraliza exatamente no meio da tela
    // Como left=50%, translate -50% do próprio tamanho centraliza
    return `${-activeWidthPx / 2}px`
  }

  // Distância do centro da tela até a borda do card ativo
  const halfActive = activeWidthPx / 2

  if (offset > 0) {
    // Cards à DIREITA do ativo
    // Primeiro lateral começa na borda direita do ativo + gap
    const baseX = halfActive + gapPx + (offset - 1) * (sideWidthPx + gapPx)
    return `${baseX - sideWidthPx / 2}px`
  } else {
    // Cards à ESQUERDA do ativo
    // Primeiro lateral termina na borda esquerda do ativo - gap
    const baseX = -halfActive - gapPx + (offset + 1) * (sideWidthPx + gapPx)
    return `${baseX - sideWidthPx / 2}px`
  }
}

// ─── Component ──────────────────────────────────────────────────────────────

export function HeroCarousel({
  items,
  onSelect,
  focused = false,
  accentColor = '#ff006e',
  keyId = 'main:heroCarousel',
  activeWidthVw = 60,
  sideWidthVw = 20,
  heightVh = 75,
}: HeroCarouselProps) {

  const [activeIndex, setActiveIndex] = useState(0)
  const lastKeyRef    = useRef(0)
  // Ref do container do carousel para calcular coords de tela
  const carouselRef  = useRef<HTMLDivElement | null>(null)
  // displayRect do card ativo em coordenadas absolutas de tela
  const [cardRect, setCardRect] = useState<{ x: number; y: number; w: number; h: number } | null>(null)

  // ─── Dimensões em px (derivadas de vw/vh) ──────────────────────────
  const dims = useMemo(() => {
    const vw = typeof window !== 'undefined' ? window.innerWidth : 1920
    const vh = typeof window !== 'undefined' ? window.innerHeight : 1080
    return {
      activeW: Math.round(vw * activeWidthVw / 100),
      sideW:   Math.round(vw * sideWidthVw  / 100),
      height:  Math.round(vh * heightVh / 100),
      gap:     Math.round(vw * 0.02), // 2vw gap
    }
  }, [activeWidthVw, sideWidthVw, heightVh])

  // ─── Recalcula displayRect quando o carousel muda de dimensão ou de índice ─
  useEffect(() => {
    const el = carouselRef.current
    if (!el) return

    const compute = () => {
      const bounds = el.getBoundingClientRect()
      // O card ativo é sempre centralizado: left=50%, translateX=-activeW/2
      const cardLeft  = bounds.left + (bounds.width - dims.activeW) / 2
      const cardHeight = dims.height - 60
      const cardTop   = bounds.top  + (bounds.height - cardHeight) / 2
      setCardRect({
        x: Math.round(cardLeft),
        y: Math.round(cardTop),
        w: dims.activeW,
        h: cardHeight,
      })
    }

    compute()
    window.addEventListener('resize', compute)
    return () => window.removeEventListener('resize', compute)
  }, [dims.activeW, dims.height, activeIndex])
  // ─── Navegação ─────────────────────────────────────────────────────
  const goTo = useCallback((direction: 1 | -1) => {
    setActiveIndex(prev => {
      const next = prev + direction
      if (next < 0) return items.length - 1
      if (next >= items.length) return 0
      return next
    })
  }, [items.length])

  // ─── D-pad Handler (integrado ao keyboardMaestro) ──────────────────
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!focused) return

      const now = Date.now()
      // Debounce de 250ms — Tizen D-pad é rápido
      if (now - lastKeyRef.current < 250) return
      lastKeyRef.current = now

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault()
          goTo(-1)
          break
        case 'ArrowRight':
          e.preventDefault()
          goTo(1)
          break
        case 'Enter':
          e.preventDefault()
          if (onSelect && items[activeIndex]) {
            onSelect(items[activeIndex], activeIndex)
          }
          break
      }
    }

    keyboardMaestro.subscribe(keyId, handleKey)
    return () => keyboardMaestro.unsubscribe(keyId)
  }, [focused, activeIndex, items, goTo, onSelect, keyId])

  // ─── Sliding Window (5 elements max in DOM) ────────────────────────
  const windowIndices = useMemo(
    () => getSlidingWindow(items.length, activeIndex),
    [items.length, activeIndex]
  )

  // ─── Preview Ativo — passa displayRect para o hardware renderizar dentro do card ─
  const activeItem    = items[activeIndex]
  const activeChannel = activeItem?.channel || null
  const { videoStyle, backdropStyle, activePlayerId } = useCardPreview(activeChannel, {
    focused,
    playerIdPrefix: 'carousel-player',
    displayRect: cardRect ?? undefined,
  })

  // ─── Render ────────────────────────────────────────────────────────
  if (items.length === 0) {
    return (
      <div className="hero-carousel" style={{ height: dims.height }}>
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          color: 'rgba(255,255,255,0.3)',
          fontSize: 22,
          fontFamily: "'Outfit', sans-serif",
        }}>
          Nenhum conteúdo disponível
        </div>
      </div>
    )
  }

  return (
    <div
      ref={carouselRef}
      className="hero-carousel"
      style={{
        height: dims.height,
        ['--accent-color' as string]: accentColor,
      }}
    >
      {/* ─── Hardware Players estáticos (Double-Buffer) ──────────────────── */}
      {/* Posicionados rigidamente no centro absoluto - Tizen hardware-safe */}
      <object
        id="carousel-player-a"
        type="application/avplayer"
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: `${dims.activeW}px`,
          height: `${dims.height - 60}px`,
          transform: 'translate(-50%, -50%)',
          zIndex: activePlayerId === 'carousel-player-a' ? 5 : -1,
          pointerEvents: 'none',
          ...(activePlayerId === 'carousel-player-a' ? videoStyle : { opacity: 0 })
        }}
      />
      <object
        id="carousel-player-b"
        type="application/avplayer"
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: `${dims.activeW}px`,
          height: `${dims.height - 60}px`,
          transform: 'translate(-50%, -50%)',
          zIndex: activePlayerId === 'carousel-player-b' ? 5 : -1,
          pointerEvents: 'none',
          ...(activePlayerId === 'carousel-player-b' ? videoStyle : { opacity: 0 })
        }}
      />

      {/* ─── Track: contém apenas os 5 cards do sliding window ───── */}
      <div className="hero-carousel__track">
        {windowIndices.map(idx => {
          const item = items[idx]
          const isActive = idx === activeIndex

          // Calcula offset relativo circular
          let rawOffset = idx - activeIndex
          // Ajuste de offset circular pra listas que wrappam
          if (rawOffset > items.length / 2) rawOffset -= items.length
          if (rawOffset < -items.length / 2) rawOffset += items.length

          const tx = computeTranslateX(
            rawOffset,
            dims.activeW,
            dims.sideW,
            dims.gap,
          )

          const cardWidth = isActive ? dims.activeW : dims.sideW
          const cardHeight = dims.height - 60 // margem inferior para dots

          // Dados de qualidade do canal
          const quality = item.channel?.activeStream?.quality
          const badgeColor = quality && quality !== 'UNKNOWN'
            ? QUALITY_BADGE_COLOR[quality]
            : null
          const badgeTextColor = quality === 'HD' ? '#fff' : '#000'

          return (
            <div
              key={`carousel-${item.id}-${idx}`}
              className={`hero-carousel__card ${
                isActive ? 'hero-carousel__card--active' : 'hero-carousel__card--side'
              }`}
              style={{
                ['--card-w' as string]: `${cardWidth}px`,
                ['--card-h' as string]: `${cardHeight}px`,
                ['--tx' as string]: tx,
                ['--card-scale' as string]: isActive ? 1 : 0.72,
                ['--card-opacity' as string]: isActive ? 1 : 0.45,
                ['--card-z' as string]: isActive ? 10 : 2,
              }}
              onClick={() => {
                if (isActive && onSelect) {
                  onSelect(item, idx)
                } else {
                  setActiveIndex(idx)
                }
              }}
            >
              {/* ── Background Image & Overlay  ────────────────────── */}
              <div
                className="hero-carousel__card-bg-solid"
                style={{
                  position: 'absolute', inset: 0, background: '#111', zIndex: -1,
                  ...(isActive ? backdropStyle : {})
                }}
              />
              <img
                className="hero-carousel__card-img"
                src={item.backgroundImage}
                alt=""
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = 'none'
                }}
                style={isActive ? backdropStyle : {}}
              />

              {/* ── Gradient ──────────────────────────────────── */}
              <div className="hero-carousel__gradient" />

              {/* ── Quality Badge ─────────────────────────────── */}
              {badgeColor && (
                <div
                  className="hero-carousel__quality"
                  style={{ background: badgeColor, color: badgeTextColor }}
                >
                  {quality}
                </div>
              )}

              {/* ── Channel Logo ──────────────────────────────── */}
              {item.channel?.logo && (
                <img
                  className="hero-carousel__logo"
                  src={item.channel.logo}
                  alt=""
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = 'none'
                  }}
                />
              )}

              {/* ── Text Metadata (only on active) ────────────── */}
              <div
                className="hero-carousel__meta"
                style={{ opacity: isActive ? 1 : 0 }}
              >
                {item.badge && (
                  <span className="hero-carousel__badge">{item.badge}</span>
                )}
                <h3 className="hero-carousel__title">{item.title}</h3>
                {item.subtitle && (
                  <p className="hero-carousel__subtitle">{item.subtitle}</p>
                )}
                {item.description && (
                  <p className="hero-carousel__description">
                    {item.description}
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* ─── Dots Indicator ──────────────────────────────────────────── */}
      {items.length > 1 && (
        <div className="hero-carousel__dots">
          {items.map((_, i) => (
            <button
              key={i}
              className={`hero-carousel__dot ${
                i === activeIndex ? 'hero-carousel__dot--active' : ''
              }`}
              onClick={() => setActiveIndex(i)}
              aria-label={`Item ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default HeroCarousel
