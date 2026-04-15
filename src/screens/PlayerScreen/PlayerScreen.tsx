import { useEffect, useRef, useState } from 'react'
import { type Channel } from '../../types/channel'
import { initPlayer, loadStream, destroyPlayer, selectPlayerBackend } from '../../services/playerService'
import { avplayLoad, avplayStop, isAVPlayAvailable } from '../../services/avplayService'

// ─ DEBUG: mude para false quando os keyCodes estiverem mapeados ───────────
const DEBUG_KEYS = true

interface Props {
  channel: Channel
  onBack: () => void
  onShakaReady?: (player: any) => void
}

export default function PlayerScreen({ channel, onBack, onShakaReady }: Props) {
  const videoRef     = useRef<HTMLVideoElement>(null)
  const onBackRef    = useRef(onBack)
  onBackRef.current  = onBack

  const [status, setStatus]       = useState<'loading' | 'playing' | 'error'>('loading')
  const [error, setError]         = useState<string | null>(null)
  const [osdVisible, setOsdVisible] = useState(true)
  const [debugKeys, setDebugKeys]   = useState<Array<{code: number; key: string}>>([])  // HUD debug

  const lastKey     = useRef(0)
  const osdTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const osdVisRef   = useRef(true)   // espelho do state para o listener

  const backend             = selectPlayerBackend(channel.url)
  const isNativeComposition = backend === 'avplay'

  // ─── helper OSD ──────────────────────────────────────────────────────────
  const showOsdRef = useRef(() => {
    osdVisRef.current = true
    setOsdVisible(true)
    if (osdTimerRef.current) clearTimeout(osdTimerRef.current)
    osdTimerRef.current = setTimeout(() => {
      osdVisRef.current = false
      setOsdVisible(false)
    }, 4000)
  })

  // dispara auto-hide quando começa a tocar
  useEffect(() => {
    if (status === 'playing') showOsdRef.current()
    return () => { if (osdTimerRef.current) clearTimeout(osdTimerRef.current) }
  }, [status])

  // ─── Lifecycle do Player ───────────────────────────────────────────────
  useEffect(() => {
    if (backend === 'avplay') {
      if (!isAVPlayAvailable()) {
        console.log('[PlayerScreen] AVPlay indisponível — modo DEV')
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

    const video = videoRef.current
    if (!video) return

    initPlayer(video)
      .then(async (player: any) => {
        onShakaReady?.(player)
        await loadStream(channel.url)
        setStatus('playing')
      })
      .catch((e: Error) => {
        setError(e.message ?? 'Stream incompatível')
        setStatus('error')
      })

    return () => {
      onShakaReady?.(null)
      destroyPlayer()
    }
  }, [channel.url, backend])

  // ─── Controle Remoto ──────────────────────────────────────────────────
  useEffect(() => {
    const avplay = (window as any).webapis?.avplay
    const tizen  = (window as any).tizen

    const onKey = (e: KeyboardEvent) => {
      const now = Date.now()
      if (now - lastKey.current < 100) return
      lastKey.current = now

      // sempre mostra OSD
      showOsdRef.current()

      // registra no HUD de debug
      if (DEBUG_KEYS) {
        setDebugKeys(prev => [
          { code: e.keyCode, key: e.key },
          ...prev.slice(0, 7),   // guarda últimas 8 teclas
        ])
      }

      switch (e.keyCode) {
        case 10009: // BACK Samsung
        case 8:     // Backspace browser
          e.preventDefault()
          onBackRef.current()
          break

        case 10182: // EXIT Samsung
          e.preventDefault()
          try { tizen?.application?.getCurrentApplication().exit() } catch (_) {}
          break

        case 415:   // PLAY
          e.preventDefault()
          try { avplay ? avplay.play()  : videoRef.current?.play()  } catch (_) {}
          break

        case 19:    // PAUSE
          e.preventDefault()
          try { avplay ? avplay.pause() : videoRef.current?.pause() } catch (_) {}
          break

        case 417:   // FF
          e.preventDefault()
          try { avplay?.jumpForward(10000)  } catch (_) {}
          break

        case 412:   // RW
          e.preventDefault()
          try { avplay?.jumpBackward(10000) } catch (_) {}
          break

        default: break
      }
    }

    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: isNativeComposition ? 'transparent' : '#000',
      color: '#fff',
    }}>

      {/* Video — só Shaka */}
      {!isNativeComposition && (
        <video ref={videoRef} autoPlay playsInline
          style={{ width: '100%', height: '100%', display: 'block' }} />
      )}

      {/* OSD */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        opacity: osdVisible ? 1 : 0,
        transition: 'opacity 600ms ease',
      }}>
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 140,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.85), transparent)',
        }} />

        <div style={{ position: 'absolute', top: 28, left: 36 }}>
          <div style={{ fontSize: 22, fontWeight: 800 }}>{channel.name}</div>
          <div style={{ fontSize: 18, opacity: 0.6, marginTop: 6 }}>
            {backend.toUpperCase()}
            {status === 'loading' && '  ⏳ Conectando...'}
            {status === 'playing' && '  ● AO VIVO'}
          </div>
        </div>

        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 120,
          background: 'linear-gradient(to top, rgba(0,0,0,0.85), transparent)',
        }} />

        {status === 'playing' && (
          <div style={{
            position: 'absolute', bottom: 28, left: 36,
            fontSize: 18, opacity: 0.7,
          }}>
            ← Voltar
          </div>
        )}
      </div>

      {/* ── DEBUG HUD — aparece no canto direito quando DEBUG_KEYS=true ── */}
      {DEBUG_KEYS && (
        <div style={{
          position: 'absolute', top: 20, right: 28,
          background: 'rgba(0,0,0,0.82)', border: '1px solid rgba(255,255,0,0.4)',
          borderRadius: 10, padding: '12px 18px', zIndex: 9999, minWidth: 220,
        }}>
          <div style={{ fontSize: 16, fontWeight: 900, color: '#ff0', marginBottom: 8 }}>
            🔍 DEBUG KEYS
          </div>
          {debugKeys.length === 0 && (
            <div style={{ fontSize: 16, opacity: 0.5 }}>aperte qualquer botão...</div>
          )}
          {debugKeys.map((k, i) => (
            <div key={i} style={{
              fontSize: 16, opacity: i === 0 ? 1 : 0.45,
              fontFamily: 'monospace', lineHeight: 1.6,
            }}>
              keyCode: <b style={{ color: '#0f0' }}>{k.code}</b>
              {k.key && k.key !== 'Unidentified' && (
                <span style={{ color: '#8cf', marginLeft: 8 }}>({k.key})</span>
              )}
            </div>
          ))}
        </div>
      )}

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
