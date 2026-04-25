import { useEffect, useState } from 'react'
import { transitionStore } from '../services/transitionStore'

export default function TransitionOverlay() {
  const [state, setState] = useState(() => transitionStore.getState())

  useEffect(() => {
    const unsub = transitionStore.subscribe(setState)
    return () => { unsub() }
  }, [])

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9998,
      pointerEvents: 'none', // Nunca bloqueia cliques
      opacity: state.visible ? 1 : 0,
      transition: `opacity ${state.visible ? '100ms' : '200ms'} ease`,
    }}>
      {/* Imagem de Fundo (Poster/Backdrop do canal alvo) */}
      {state.backgroundImage && (
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${state.backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(8px)',
          transform: 'scale(1.05)', // Evitar bordas brancas do blur
          opacity: 0.6, // Escurecer imagem para dar foco ao spinner
        }} />
      )}

      {/* Gradiente escurecedor fixo */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'rgba(0, 0, 0, 0.85)',
      }} />

      {/* Spinner centralizado */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
      }}>
        {/* CSS puro para animação no Chromium 63 (transform apenas) */}
        <div className="ziii-spinner" />
        
        {state.message && (
          <div style={{
            marginTop: 24, fontSize: 20, fontWeight: 600,
            color: '#fff', letterSpacing: 1,
            textShadow: '0 2px 8px rgba(0,0,0,0.8)',
          }}>
            {state.message}
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .ziii-spinner {
          width: 60px;
          height: 60px;
          border: 4px solid rgba(255,255,255,0.15);
          border-top-color: #E50914;  /* Cor base ZiiiTV / Netflix */
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  )
}
