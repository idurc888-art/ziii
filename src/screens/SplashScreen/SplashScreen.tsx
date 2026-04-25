import { useEffect, useRef, useState } from 'react'
import { useChannelsStore } from '../../store/channelsStore'

interface Props {
  onDone: () => void
}

const ALIEN_MESSAGES: Record<string, string[]> = {
  idle:      ['🛸 ORGANIZAÇÃO ALIEN INICIANDO...', '👽 Conectando com a nave-mãe...'],
  fetching:  ['📡 CAPTANDO DADOS PLANETÁRIOS...', '🌍 Escaneando transmissões terrestres...', '📶 Interceptando sinais de TV...'],
  parsing:   ['🔍 QUANTA BAGUNÇA, TERRÁQUEOS!', '📊 Catalogando caos humano...', '🗂️ Organizando desordem terrestre...'],
  matching:  ['🎯 CLASSIFICANDO CONTEÚDO...', '🧬 Analisando padrões culturais...', '🔬 Decodificando entretenimento...'],
  done:      ['✨ MISSÃO CONCLUÍDA!', '🎉 Dados organizados com sucesso!', '🚀 Pronto para decolar!'],
  error:     ['⚠️ INTERFERÊNCIA DETECTADA', '❌ Falha na transmissão...'],
}

function getAlienMessage(status: string): string {
  const messages = ALIEN_MESSAGES[status] || ALIEN_MESSAGES.idle
  return messages[Math.floor(Math.random() * messages.length)]
}

const MIN_DISPLAY_MS = 3000 // Mínimo 3s de splash para animação suave

export default function SplashScreen({ onDone }: Props) {
  const status = useChannelsStore(s => s.status)
  const bootStatus = useChannelsStore(s => s.bootStatus)
  const progressMessage = useChannelsStore(s => s.progressMessage)
  const [phase, setPhase] = useState<'in' | 'hold' | 'out'>('in')
  const [imgFailed, setImgFailed] = useState(false)
  const [progress, setProgress] = useState(0)
  const [alienMsg, setAlienMsg] = useState(getAlienMessage('idle'))
  const onDoneRef = useRef(onDone)
  onDoneRef.current = onDone
  const startTime = useRef(Date.now())
  const hasTriggeredExit = useRef(false)

  // ★ Timeout máximo de segurança — nunca fica preso para sempre na TV
  useEffect(() => {
    const MAX_WAIT = 90000 // 90s máximo
    const t = setTimeout(() => {
      if (!hasTriggeredExit.current) {
        console.warn('[Splash] Timeout máximo atingido — forçando saída')
        hasTriggeredExit.current = true
        setPhase('out')
        setTimeout(() => onDoneRef.current(), 600)
      }
    }, MAX_WAIT)
    return () => clearTimeout(t)
  }, [])

  // Fase visual de entrada
  useEffect(() => {
    const t1 = setTimeout(() => setPhase('hold'), 300)
    return () => clearTimeout(t1)
  }, [])

  // Atualiza mensagem alienígena quando status muda
  useEffect(() => {
    setAlienMsg(getAlienMessage(status))
  }, [status])

  // Progresso baseado no status real do store
  useEffect(() => {
    switch (status) {
      case 'idle':      setProgress(0);  break
      case 'fetching':  setProgress(25); break
      case 'parsing':   setProgress(55); break
      case 'matching':  setProgress(75); break
      case 'done':      setProgress(100); break
      case 'error':     setProgress(100); break
    }
  }, [status])

  // Transição de saída quando dados estão prontos
  useEffect(() => {
    if ((status === 'done' || status === 'error') && bootStatus !== 'cold' && !hasTriggeredExit.current) {
      hasTriggeredExit.current = true
      
      const elapsed = Date.now() - startTime.current
      const remaining = Math.max(0, MIN_DISPLAY_MS - elapsed)

      // Espera o mínimo e faz fade-out
      setTimeout(() => {
        setPhase('out')
        setTimeout(() => onDoneRef.current(), 600)
      }, remaining)
    }
  }, [status, bootStatus])

  return (
    <div style={{
      position: 'fixed', inset: 0,
      width: '100vw', height: '100vh',
      background: '#000',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      gap: 24,
      opacity: phase === 'out' ? 0 : 1,
      transition: 'opacity 600ms ease',
      overflow: 'hidden',
    }}>

      {/* ★ Background hero-alien.png */}
      {imgFailed ? (
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(160deg, #0a0014 0%, #1a0030 50%, #000 100%)',
        }} />
      ) : (
        <img
          src="hero-alien-opt.jpg"
          alt=""
          onError={() => setImgFailed(true)}
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover',
            objectPosition: 'center top',
            opacity: phase === 'in' ? 0 : 0.6,
            transition: 'opacity 900ms ease',
          }}
        />
      )}

      {/* Overlay escuro sutil */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.7) 100%)',
      }} />

      {/* Conteúdo centralizado — por cima */}
      <div style={{
        position: 'relative', zIndex: 10,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', gap: 28,
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

        {/* ★ Tagline */}
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

        {/* ★ Barra de progresso premium */}
        <div style={{
          width: 280,
          height: 4,
          borderRadius: 2,
          background: 'rgba(255,255,255,0.1)',
          overflow: 'hidden',
          opacity: phase === 'hold' ? 1 : 0,
          transition: 'opacity 400ms ease 400ms',
        }}>
          <div style={{
            width: `${progress}%`,
            height: '100%',
            borderRadius: 2,
            background: 'linear-gradient(90deg, #ff006e, #ff4d94)',
            boxShadow: '0 0 12px rgba(255,0,110,0.6)',
            transition: 'width 500ms ease-out',
          }} />
        </div>

        {/* ★ Mensagem Alienígena */}
        <div style={{
          fontFamily: "'Outfit', sans-serif",
          fontSize: 16,
          fontWeight: 500,
          letterSpacing: 1,
          textTransform: 'uppercase',
          color: '#00ff88',
          textShadow: '0 0 20px rgba(0,255,136,0.6)',
          opacity: phase === 'hold' ? 1 : 0,
          transition: 'opacity 300ms ease 500ms',
          minHeight: 24,
          textAlign: 'center',
        }}>
          {alienMsg}
        </div>

        {/* ★ Detalhes técnicos (progressMessage do Worker) */}
        {progressMessage && (
          <div style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: 12,
            fontWeight: 300,
            letterSpacing: 1,
            color: 'rgba(255,255,255,0.4)',
            opacity: phase === 'hold' ? 1 : 0,
            transition: 'opacity 300ms ease 500ms',
            minHeight: 16,
          }}>
            {progressMessage}
          </div>
        )}

        {/* Spinner */}
        <div style={{
          width: 28, height: 28,
          borderRadius: '50%',
          border: '2px solid rgba(255,0,110,0.2)',
          borderTopColor: '#ff006e',
          animation: 'spin 700ms linear infinite',
          opacity: phase === 'hold' && status !== 'ready' ? 1 : 0,
          transition: 'opacity 300ms ease',
        }} />
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
