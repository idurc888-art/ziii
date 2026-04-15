import { useEffect, useRef, useState } from 'react'
import { type Channel } from '../../types/channel'
import { initPlayer, loadStream, destroyPlayer, selectPlayerBackend } from '../../services/playerService'
import { avplayLoad, avplayStop, isAVPlayAvailable } from '../../services/avplayService'

interface Props {
  channel: Channel
  onBack: () => void
}

export default function PlayerScreen({ channel, onBack }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const onBackRef = useRef(onBack)
  onBackRef.current = onBack

  const [status, setStatus] = useState<'loading' | 'playing' | 'error'>('loading')
  const [error, setError] = useState<string | null>(null)
  const lastKey = useRef(0)

  // Decisão de backend: determina também a composição visual
  const backend = selectPlayerBackend(channel.url)

  // ─── Composição Visual (separada da navegação, conforme arquitetura) ──────────
  // backend shaka  → DOM normal, <video> no DOM, sem transparência estrutural
  // backend avplay → composição nativa Samsung, fundo da PlayerScreen transparente
  const isNativeComposition = backend === 'avplay'

  console.log(`[PlayerScreen] composition=${isNativeComposition ? 'native-transparent' : 'dom'}`)

  // ─── Lifecycle do Player ──────────────────────────────────────────────────────
  useEffect(() => {
    if (backend === 'avplay') {
      // AVPlay: composição nativa — PlayerScreen não usa <video> element
      if (!isAVPlayAvailable()) {
        // Ambiente DEV/PC: AVPlay inexistente, log e emulação
        console.log('[PlayerScreen] AVPlay indisponível em PC — modo DEV emulado')
        setStatus('playing') // Em DEV simula sucesso para não bloquear testes
        return
      }

      avplayLoad(
        channel.url,
        () => setStatus('playing'),
        (msg) => { setError(msg); setStatus('error') }
      )
      return () => avplayStop()
    }

    // Shaka: DOM normal
    const video = videoRef.current
    if (!video) return

    initPlayer(video)
      .then(async () => {
        await loadStream(channel.url)
        setStatus('playing')
      })
      .catch((e: Error) => {
        console.error('[PlayerScreen] Shaka error:', e.message)
        setError(e.message ?? 'Stream incompatível com Shaka')
        setStatus('error')
      })

    return () => { destroyPlayer() }
  }, [channel.url, backend])

  // ─── Controle Remoto (1 listener, throttle 100ms, ref para evitar stale closure)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const now = Date.now()
      if (now - lastKey.current < 100) return
      lastKey.current = now
      if (e.keyCode === 10009 || e.keyCode === 8 || e.key === 'Backspace') {
        e.preventDefault()
        onBackRef.current()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  // ─── Render ────────────────────────────────────────────────────────────────────
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      // Composição visual separada por backend:
      // shaka  → fundo preto (DOM normal, <video> preenche tela)
      // avplay → fundo transparente (hardware Tizen renderiza por trás do HTML)
      background: isNativeComposition ? 'transparent' : '#000',
      color: '#fff',
    }}>

      {/* Video element — só ativo quando Shaka é o backend */}
      {!isNativeComposition && (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          style={{ width: '100%', height: '100%', display: 'block' }}
        />
      )}

      {/* Overlay de status — fica acima do vídeo via position absolute */}
      <div style={{ position: 'absolute', top: 16, left: 16 }}>
        <div style={{ fontSize: 11, opacity: 0.5, marginBottom: 4 }}>
          [{backend.toUpperCase()}] {channel.name}
        </div>

        {status === 'loading' && (
          <div style={{ fontSize: 18 }}>⏳ Conectando canal...</div>
        )}

        {status === 'playing' && !isNativeComposition && (
          // Em Shaka, overlay leve com nome do canal
          <div style={{ fontSize: 14, opacity: 0.7 }}>{channel.name}</div>
        )}

        {status === 'error' && (
          <>
            <div style={{ color: '#f66', fontSize: 16 }}>❌ {error ?? 'Erro ao carregar stream'}</div>
            <div style={{ fontSize: 11, marginTop: 4, opacity: 0.6 }}>{channel.url}</div>
            <div style={{ fontSize: 11, marginTop: 8, opacity: 0.5 }}>Pressione BACK para voltar</div>
          </>
        )}
      </div>
    </div>
  )
}
