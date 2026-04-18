import { useEffect, useRef, useState } from 'react'

interface Props {
  onDone: () => void
}

export default function SplashScreen({ onDone }: Props) {
  const [phase, setPhase] = useState<'in' | 'hold' | 'out'>('in')
  const [imgFailed, setImgFailed] = useState(false)
  const onDoneRef = useRef(onDone)
  onDoneRef.current = onDone

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('hold'), 200)
    const t2 = setTimeout(() => setPhase('out'),  800)
    const t3 = setTimeout(() => onDoneRef.current(), 1000)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [])

  return (
    <div style={{
      position: 'fixed', inset: 0,
      width: '100vw', height: '100vh',
      background: '#000',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      gap: 24,
      opacity: phase === 'out' ? 0 : 1,
      transition: 'opacity 500ms ease',
      overflow: 'hidden',
    }}>

      {/* ★ Fallback gradiente caso hero-alien.png falhe */}
      {imgFailed ? (
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(160deg, #0a0014 0%, #1a0030 50%, #000 100%)',
        }} />
      ) : (
        <img
          src="hero-alien.png"
          alt=""
          onError={() => setImgFailed(true)}
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover',
            objectPosition: 'center top',
            opacity: phase === 'in' ? 0 : 1,
            transition: 'opacity 900ms ease',
          }}
        />
      )}

      {/* Conteúdo centralizado — por cima */}
      <div style={{
        position: 'relative', zIndex: 10,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', gap: 20,
      }}>

        {/* Logo */}
        <div style={{
          fontFamily: "'Outfit', sans-serif",
          fontSize: 88,
          fontWeight: 900,
          letterSpacing: '-0.05em',
          textTransform: 'lowercase',
          color: '#ff006e',
          textShadow: '0 0 40px rgba(255,0,110,0.9), 0 0 80px rgba(255,0,110,0.4)',
          opacity: phase === 'in' ? 0 : 1,
          transform: phase === 'in' ? 'scale(0.85)' : 'scale(1)',
          transition: 'all 600ms cubic-bezier(0.34,1.56,0.64,1)',
        }}>
          ziiiTV
        </div>

        {/* ★ Tagline: era 13px → agora 18px */}
        <div style={{
          fontFamily: "'Outfit', sans-serif",
          fontSize: 18,
          fontWeight: 400,
          letterSpacing: 5,
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.9)',
          opacity: phase === 'hold' ? 1 : 0,
          transition: 'opacity 500ms ease 300ms',
        }}>
          o universo do entretenimento
        </div>

        {/* Spinner */}
        <div style={{
          width: 28, height: 28,
          borderRadius: '50%',
          border: '2px solid rgba(255,0,110,0.2)',
          borderTopColor: '#ff006e',
          animation: 'spin 700ms linear infinite',
          opacity: phase === 'hold' ? 1 : 0,
          transition: 'opacity 300ms ease',
        }} />
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
