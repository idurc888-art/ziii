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

  const backend = selectPlayerBackend(channel.url)

  useEffect(() => {
    if (backend === 'avplay') {
      if (!isAVPlayAvailable()) {
        setStatus('error')
        setError('AVPlay não disponível (browser). Teste na TV Samsung.')
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
      .then(async (mode) => {
        if (mode === 'avplay') {
          setError('AVPlay selecionado — implementação nativa Samsung no próximo passo')
          setStatus('error')
          return
        }
        await loadStream(channel.url)
        setStatus('playing')
      })
      .catch(() => {
        setError('Stream não compatível com Shaka ou manifesto inválido')
        setStatus('error')
      })

    return () => { destroyPlayer() }
  }, [channel.url, backend])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const now = Date.now()
      if (now - lastKey.current < 100) return
      lastKey.current = now
      if (e.keyCode === 10009 || e.keyCode === 8) onBackRef.current()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#000', color: '#fff' }}>
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        style={{ width: '100%', height: '100%' }}
      />
      <div style={{ position: 'absolute', top: 16, left: 16 }}>
        <div style={{ fontSize: 11, opacity: 0.5, marginBottom: 4 }}>
          Backend: {backend.toUpperCase()}
        </div>
        {status === 'loading' && <div>Carregando {channel.name}...</div>}
        {status === 'error' && (
          <>
            <div style={{ color: '#f66' }}>{error}</div>
            <div style={{ fontSize: 11, marginTop: 4, opacity: 0.6 }}>{channel.url}</div>
          </>
        )}
      </div>
    </div>
  )
}
