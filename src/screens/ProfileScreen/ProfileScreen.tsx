import { useEffect, useRef, useState } from 'react'

const USERS = [
  { id: 1, name: 'Zikualdo',  icon: '👽', color: '#ff006e' },
  { id: 2, name: 'Carneiro',  icon: '🛸', color: '#a855f7' },
  { id: 3, name: 'Convidado', icon: '👾', color: '#3b82f6' },
]

interface Props {
  onSelect: (userId: number) => void
}

export default function ProfileScreen({ onSelect }: Props) {
  const [focused, setFocused] = useState(0)
  const [selecting, setSelecting] = useState(false)
  const focusedRef = useRef(focused)
  const selectingRef = useRef(selecting)
  focusedRef.current = focused
  selectingRef.current = selecting

  function handleSelect(idx: number) {
    if (selectingRef.current) return
    setSelecting(true)
    setFocused(idx)
    setTimeout(() => onSelect(USERS[idx].id), 500)
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (selectingRef.current) return
      if (e.key === 'ArrowDown' || e.keyCode === 40) {
        e.preventDefault()
        setFocused(f => Math.min(f + 1, USERS.length - 1))
      } else if (e.key === 'ArrowUp' || e.keyCode === 38) {
        e.preventDefault()
        setFocused(f => Math.max(f - 1, 0))
      } else if (e.key === 'Enter' || e.keyCode === 13) {
        e.preventDefault()
        handleSelect(focusedRef.current)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div style={{
      position: 'fixed', inset: 0,
      width: '100vw', height: '100vh',
      background: '#000',
      display: 'flex',
      overflow: 'hidden',
    }}>
      {/* Imagem alien à direita */}
      <img
        src="hero-alien.png"
        alt=""
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          objectFit: 'cover',
          objectPosition: 'center top',
          opacity: 0.25,
        }}
      />

      {/* Overlay gradiente — escurece à esquerda para o painel */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(90deg, rgba(0,0,0,0.97) 0%, rgba(0,0,0,0.85) 40%, rgba(0,0,0,0.2) 100%)',
      }} />

      {/* Painel esquerdo com perfis */}
      <div style={{
        position: 'relative', zIndex: 10,
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center',
        padding: '0 80px',
        gap: 12,
        minWidth: 480,
      }}>

        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <div style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: 13,
            fontWeight: 400,
            letterSpacing: 4,
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.3)',
            marginBottom: 8,
          }}>
            quem está assistindo?
          </div>
          <div style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: 40,
            fontWeight: 900,
            color: '#ff006e',
            textShadow: '0 0 30px rgba(255,0,110,0.5)',
            letterSpacing: '-0.03em',
            textTransform: 'lowercase',
          }}>
            ziiiTV
          </div>
        </div>

        {/* Lista de perfis */}
        {USERS.map((user, idx) => {
          const isFocused = focused === idx
          return (
            <div
              key={user.id}
              onClick={() => handleSelect(idx)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 20,
                padding: '16px 24px',
                borderRadius: 16,
                cursor: 'pointer',
                background: isFocused ? `${user.color}18` : 'rgba(255,255,255,0.03)',
                border: isFocused ? `2px solid ${user.color}` : '2px solid rgba(255,255,255,0.06)',
                boxShadow: isFocused ? `0 0 30px ${user.color}33` : 'none',
                transform: isFocused ? 'translateX(8px)' : 'translateX(0)',
                transition: 'all 250ms cubic-bezier(0.34,1.56,0.64,1)',
              }}
            >
              {/* Avatar */}
              <div style={{
                width: 64, height: 64,
                borderRadius: 14,
                background: isFocused ? `${user.color}22` : 'rgba(255,255,255,0.05)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 32,
                flexShrink: 0,
              }}>
                {user.icon}
              </div>

              {/* Info */}
              <div>
                <div style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: 22,
                  fontWeight: isFocused ? 700 : 400,
                  color: isFocused ? '#fff' : 'rgba(255,255,255,0.5)',
                  transition: 'all 200ms ease',
                }}>
                  {user.name}
                </div>
                {isFocused && (
                  <div style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: 12,
                    color: user.color,
                    letterSpacing: 2,
                    textTransform: 'uppercase',
                    marginTop: 2,
                  }}>
                    pressione enter
                  </div>
                )}
              </div>

              {/* Seta */}
              {isFocused && (
                <div style={{
                  marginLeft: 'auto',
                  color: user.color,
                  fontSize: 20,
                  fontWeight: 900,
                }}>
                  →
                </div>
              )}
            </div>
          )
        })}

        {/* Hint */}
        <div style={{
          marginTop: 32,
          fontFamily: "'Outfit', sans-serif",
          fontSize: 12,
          color: 'rgba(255,255,255,0.15)',
          letterSpacing: 2,
          textTransform: 'uppercase',
        }}>
          ↑ ↓ navegar · enter selecionar
        </div>
      </div>
    </div>
  )
}
