import { useEffect, useRef, useState } from 'react'
import { keyboardMaestro } from '../../services/keyboardManager'
import type { Channel } from '../../types/channel'

interface Props {
  channel: Channel
  onPlay: (ch: Channel) => void
  onBack: () => void
}

export default function DetailScreen({ channel, onPlay, onBack }: Props) {
  const onBackRef = useRef(onBack)
  const onPlayRef = useRef(onPlay)
  const channelRef = useRef(channel)
  onBackRef.current = onBack
  onPlayRef.current = onPlay
  channelRef.current = channel

  const [focusIdx, setFocusIdx] = useState(0) // 0=Assistir, 1=Mais Info, 2=Voltar
  const focusIdxRef = useRef(0)
  focusIdxRef.current = focusIdx

  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 30)
    return () => clearTimeout(t)
  }, [])

  const tmdb = channel.tmdb
  const poster = tmdb?.poster || channel.logo || ''
  const backdrop = tmdb?.backdrop || poster
  const title = tmdb?.title || channel.name
  const year = tmdb?.year || ''
  const rating = tmdb?.rating ? tmdb.rating.toFixed(1) : ''
  const overview = tmdb?.overview || ''
  const mediaType = channel.mediaType || tmdb?.mediaType || 'movie'
  const typeLabel = mediaType === 'tv' ? '📺 Série' : '🎬 Filme'

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const isLeft  = e.keyCode === 37 || e.key === 'ArrowLeft'
      const isRight = e.keyCode === 39 || e.key === 'ArrowRight'
      const isEnter = e.keyCode === 13 || e.key === 'Enter'
      const isBack  = e.keyCode === 10009 || e.keyCode === 8 || e.key === 'Backspace'

      e.preventDefault()

      if (isBack) { onBackRef.current(); return }
      if (isLeft)  { setFocusIdx(i => Math.max(0, i - 1)); return }
      if (isRight) { setFocusIdx(i => Math.min(2, i + 1)); return }
      if (isEnter) {
        const idx = focusIdxRef.current
        if (idx === 0) onPlayRef.current(channelRef.current)
        else if (idx === 2) onBackRef.current()
      }
    }
    keyboardMaestro.subscribe('details:main', onKey)
    return () => keyboardMaestro.unsubscribe('details:main')
  }, [])

  const BTNS = [
    { label: '▶  Assistir',   key: 0, accent: true },
    { label: '+ Minha Lista', key: 1, accent: false },
    { label: '← Voltar',      key: 2, accent: false },
  ]

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: '#000',
      color: '#fff',
      fontFamily: "'Outfit', 'Helvetica Neue', sans-serif",
      overflow: 'hidden',
    }}>

      {/* Background Backdrop */}
      {backdrop && (
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${backdrop})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
          opacity: mounted ? 0.35 : 0,
          transition: 'opacity 600ms ease',
          filter: 'blur(2px)',
          transform: 'scale(1.05)',
        }} />
      )}

      {/* Gradiente esquerda para escurecer backdrop */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(90deg, rgba(0,0,0,0.97) 0%, rgba(0,0,0,0.7) 55%, rgba(0,0,0,0.15) 100%)',
      }} />
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 40%)',
      }} />

      {/* Layout principal */}
      <div style={{
        position: 'relative', zIndex: 2,
        display: 'flex',
        alignItems: 'center',
        height: '100%',
        padding: '0 80px',
        gap: 60,
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateX(0)' : 'translateX(-30px)',
        transition: 'opacity 400ms ease, transform 400ms ease',
      }}>

        {/* Coluna Esquerda: Infos */}
        <div style={{ flex: '0 0 560px', maxWidth: 560 }}>
          {/* Tipo */}
          <div style={{
            fontSize: 18, fontWeight: 600,
            color: '#e50914', letterSpacing: 2,
            textTransform: 'uppercase', marginBottom: 16,
          }}>
            {typeLabel}
          </div>

          {/* Título */}
          <h1 style={{
            fontSize: 56, fontWeight: 900,
            lineHeight: 1.1, marginBottom: 16,
            textShadow: '0 4px 20px rgba(0,0,0,0.8)',
          }}>
            {title}
          </h1>

          {/* Badges */}
          <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 24 }}>
            {year && (
              <span style={{ fontSize: 18, opacity: 0.7 }}>{year}</span>
            )}
            {rating && (
              <span style={{
                fontSize: 18, fontWeight: 700, color: '#f5c518',
              }}>★ {rating}</span>
            )}
            {channel.streams?.length > 1 && (
              <span style={{
                fontSize: 14, fontWeight: 700,
                background: '#1a6b3c', color: '#fff',
                padding: '3px 10px', borderRadius: 4,
                letterSpacing: 1,
              }}>
                {channel.streams.length} qualidades
              </span>
            )}
            {(channel.streams?.[0]?.quality || channel.activeStream?.quality) && (
              <span style={{
                fontSize: 14, fontWeight: 700,
                background: 'rgba(255,255,255,0.15)',
                padding: '3px 10px', borderRadius: 4,
                letterSpacing: 1,
              }}>
                {channel.streams?.[0]?.quality || channel.activeStream?.quality}
              </span>
            )}
          </div>

          {/* Overview */}
          {overview && (
            <p style={{
              fontSize: 20, lineHeight: 1.6,
              color: 'rgba(255,255,255,0.80)',
              marginBottom: 40,
              display: '-webkit-box',
              WebkitLineClamp: 4,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}>
              {overview}
            </p>
          )}
          {!overview && (
            <p style={{
              fontSize: 20, lineHeight: 1.6,
              color: 'rgba(255,255,255,0.45)',
              marginBottom: 40,
              fontStyle: 'italic',
            }}>
              Canal: {channel.group}
            </p>
          )}

          {/* Botões */}
          <div style={{ display: 'flex', gap: 16 }}>
            {BTNS.map(btn => {
              const isFocused = focusIdx === btn.key
              return (
                <button
                  key={btn.key}
                  onClick={() => {
                    setFocusIdx(btn.key)
                    if (btn.key === 0) onPlay(channel)
                    else if (btn.key === 2) onBack()
                  }}
                  style={{
                    padding: '16px 36px',
                    fontSize: 20, fontWeight: 700,
                    borderRadius: 6,
                    border: isFocused ? '2px solid #fff' : '2px solid rgba(255,255,255,0.2)',
                    cursor: 'pointer',
                    transition: 'all 150ms ease',
                    background: isFocused
                      ? (btn.accent ? '#e50914' : 'rgba(255,255,255,0.25)')
                      : (btn.accent ? 'rgba(229,9,20,0.6)' : 'rgba(255,255,255,0.08)'),
                    color: '#fff',
                    transform: isFocused ? 'scale(1.06) translateZ(0)' : 'scale(1) translateZ(0)',
                    boxShadow: isFocused && btn.accent ? '0 0 40px rgba(229,9,20,0.6)' : 'none',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {btn.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Coluna Direita: Poster */}
        {poster && (
          <div style={{
            flex: '0 0 auto',
            marginLeft: 'auto',
          }}>
            <div style={{
              width: 280, height: 420,
              borderRadius: 12,
              overflow: 'hidden',
              boxShadow: '0 20px 60px rgba(0,0,0,0.8)',
              border: '1px solid rgba(255,255,255,0.1)',
              transform: mounted ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.96)',
              transition: 'transform 500ms 100ms ease',
            }}>
              <img
                src={poster}
                alt={title}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Dica de navegação */}
      <div style={{
        position: 'absolute', bottom: 30, right: 40,
        fontSize: 14, opacity: 0.4, letterSpacing: 1,
        color: '#fff',
      }}>
        ← → Navegar &nbsp;·&nbsp; OK Confirmar &nbsp;·&nbsp; ← Voltar
      </div>
    </div>
  )
}
