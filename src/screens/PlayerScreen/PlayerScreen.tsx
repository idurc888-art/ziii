import { useEffect, useRef, useState } from 'react'
import { type Channel } from '../../types/channel'
import { initPlayer, loadStream, destroyPlayer, selectPlayerBackend } from '../../services/playerService'
import { avplayLoad, avplayStop, isAVPlayAvailable } from '../../services/avplayService'

interface Props {
  channel: Channel
  onBack: () => void
  onShakaReady?: (player: any) => void
}

export default function PlayerScreen({ channel, onBack, onShakaReady }: Props) {
  const videoRef    = useRef<HTMLVideoElement>(null)
  const onBackRef   = useRef(onBack)
  onBackRef.current = onBack

  const [status, setStatus]   = useState<'loading' | 'playing' | 'error'>('loading')
  const [error, setError]     = useState<string | null>(null)
  const [osdVisible, setOsdVisible] = useState(true)   // OSD visível ao entrar
  const lastKey  = useRef(0)
  const osdTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const backend            = selectPlayerBackend(channel.url)
  const isNativeComposition = backend === 'avplay'

  // ─── helper: mostra OSD e agenda auto-hide em 4s ────────────────────────
  const showOsd = () => {
    setOsdVisible(true)
    if (osdTimer.current) clearTimeout(osdTimer.current)
    osdTimer.current = setTimeout(() => setOsdVisible(false), 4000)
  }

  // auto-hide assim que entrar em estado playing
  useEffect(() => {
    if (status === 'playing') showOsd()
    return () => { if (osdTimer.current) clearTimeout(osdTimer.current) }
  }, [status])

  // ─── Lifecycle do Player ────────────────────────────────────────────────
  useEffect(() => {
    if (backend === 'avplay') {
      if (!isAVPlayAvailable()) {
        console.log('[PlayerScreen] AVPlay indisponível em PC — modo DEV emulado')
        setStatus('playing')
        return
      }
      avplayLoad(
        channel.url,
        () => setStatus('playing'),
        (msg) => { setError(msg); setStatus('error') }
      )
      return () => avplayStop()
    }

    // Shaka
    const video = videoRef.current
    if (!video) return

    let shakaInstance: any = null

    initPlayer(video)
      .then(async (player: any) => {
        shakaInstance = player
        onShakaReady?.(player)           // ← informa App.tsx
        await loadStream(channel.url)
        setStatus('playing')
      })
      .catch((e: Error) => {
        console.error('[PlayerScreen] Shaka error:', e.message)
        setError(e.message ?? 'Stream incompatível com Shaka')
        setStatus('error')
      })

    return () => {
      onShakaReady?.(null)              // limpa ref no App ao destruir
      destroyPlayer()
    }
  }, [channel.url, backend])

  // ─── Controle Remoto ─────────────────────────────────────────────────────
  useEffect(() => {
    const avplay  = (window as any).webapis?.avplay
    const tizen   = (window as any).tizen

    const onKey = (e: KeyboardEvent) => {
      const now = Date.now()
      if (now - lastKey.current < 100) return
      lastKey.current = now

      // qualquer tecla reexibe o OSD
      showOsd()

      switch (e.keyCode) {

        // BACK
        case 10009:
        case 8:
          e.preventDefault()
          onBackRef.current()
          break

        // EXIT
        case 10182:
          e.preventDefault()
          try { tizen?.application?.getCurrentApplication().exit() } catch (_) {}
          break

        // PLAY (415)
        case 415:
          e.preventDefault()
          try {
            avplay ? avplay.play() : videoRef.current?.play()
          } catch (_) {}
          break

        // PAUSE (19)
        case 19:
          e.preventDefault()
          try {
            avplay ? avplay.pause() : videoRef.current?.pause()
          } catch (_) {}
          break

        // FF (417)
        case 417:
          e.preventDefault()
          try { avplay?.jumpForward(10000) } catch (_) {}
          break

        // RW (412)
        case 412:
          e.preventDefault()
          try { avplay?.jumpBackward(10000) } catch (_) {}
          break

        default:
          break
      }
    }

    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: isNativeComposition ? 'transparent' : '#000',
      color: '#fff',
    }}>

      {/* Video element — só Shaka */}
      {!isNativeComposition && (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          style={{ width: '100%', height: '100%', display: 'block' }}
        />
      )}

      {/* OSD — aparece ao entrar + qualquer tecla, some após 4s */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        opacity: osdVisible ? 1 : 0,
        transition: 'opacity 500ms ease',
      }}>
        {/* Gradiente superior */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 120,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.75), transparent)',
        }} />

        {/* Info do canal — topo esquerda */}
        <div style={{ position: 'absolute', top: 24, left: 32 }}>
          <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>
            {channel.name}
          </div>
          <div style={{ fontSize: 18, opacity: 0.6 }}>
            [{backend.toUpperCase()}]
            {status === 'loading' && '  ⏳ Conectando...'}
            {status === 'playing' && '  ● AO VIVO'}
          </div>
        </div>

        {/* Gradiente inferior */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 100,
          background: 'linear-gradient(to top, rgba(0,0,0,0.75), transparent)',
        }} />

        {/* Hint de teclas — rodapé */}
        {status === 'playing' && (
          <div style={{
            position: 'absolute', bottom: 24, left: 32,
            display: 'flex', gap: 28,
            fontSize: 18, opacity: 0.7,
          }}>
            <span>⏮⏯ Reproduzir/Pausar</span>
            <span>⏩⏪ 10s</span>
            <span>← Voltar</span>
          </div>
        )}
      </div>

      {/* Erro */}
      {status === 'error' && (
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          background: 'rgba(0,0,0,0.85)', gap: 16,
        }}>
          <div style={{ fontSize: 48 }}>❌</div>
          <div style={{ fontSize: 22, color: '#f66', fontWeight: 700 }}>
            {error ?? 'Erro ao carregar stream'}
          </div>
          <div style={{ fontSize: 18, opacity: 0.5 }}>{channel.url}</div>
          <div style={{ fontSize: 18, opacity: 0.6, marginTop: 8 }}>
            Pressione BACK para voltar
          </div>
        </div>
      )}
    </div>
  )
}
