import React, { useEffect, useRef, useState, useCallback } from 'react'
import { useChannelsStore } from '../../store/channelsStore'
import styles from './PlayerScreen.module.css'

interface Props { onBack: () => void }

const KEYS = { BACK: 10009, OK: 13, LEFT: 37, RIGHT: 39, UP: 38, DOWN: 40, PLAY: 415, PAUSE: 19, PLAY_PAUSE: 10252, FF: 417, RW: 412 }
const HIDE_DELAY = 3000
const SEEK_STEP = 10

const PlayerScreen: React.FC<Props> = ({ onBack }) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const hideTimer = useRef<ReturnType<typeof setTimeout>>()
  const retryRef = useRef(0)
  const currentChannel = useChannelsStore(s => s.currentChannel)
  const setCurrentChannel = useChannelsStore(s => s.setCurrentChannel)

  const [visible, setVisible] = useState(true)
  const [playing, setPlaying] = useState(false)
  const [buffering, setBuffering] = useState(true)
  const [error, setError] = useState('')
  const [progress, setProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState('00:00')
  const [duration, setDuration] = useState('AO VIVO')
  const [focusIdx, setFocusIdx] = useState(2) // play button

  const isLive = !videoRef.current?.duration || !isFinite(videoRef.current.duration)

  const showControls = useCallback(() => {
    setVisible(true)
    clearTimeout(hideTimer.current)
    if (playing) hideTimer.current = setTimeout(() => setVisible(false), HIDE_DELAY)
  }, [playing])

  const fmt = (s: number) => {
    if (!isFinite(s)) return '00:00'
    const m = Math.floor(s / 60), sec = Math.floor(s % 60)
    return `${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`
  }

  // Init player
  useEffect(() => {
    if (!currentChannel) { onBack(); return }
    const video = videoRef.current!
    retryRef.current = 0

    const tryLoad = async () => {
      setError(''); setBuffering(true)
      try {
        // Tenta HLS.js primeiro
        const Hls = (window as any).Hls
        if (Hls && Hls.isSupported()) {
          const hls = new Hls({ enableWorker: false, lowLatencyMode: true })
          hls.loadSource(currentChannel.url)
          hls.attachMedia(video)
          hls.on(Hls.Events.MANIFEST_PARSED, () => video.play().catch(() => {}))
          hls.on(Hls.Events.ERROR, (_: any, d: any) => { if (d.fatal) setError('Erro no stream') })
          return () => hls.destroy()
        }
        // Fallback nativo
        video.src = currentChannel.url
        await video.play()
      } catch {
        if (retryRef.current < 2) { retryRef.current++; setTimeout(tryLoad, 2000) }
        else setError('Não foi possível reproduzir')
      }
    }

    const cleanup = tryLoad()
    video.addEventListener('playing', () => { setPlaying(true); setBuffering(false) })
    video.addEventListener('pause', () => setPlaying(false))
    video.addEventListener('waiting', () => setBuffering(true))
    video.addEventListener('timeupdate', () => {
      const d = video.duration, t = video.currentTime
      setCurrentTime(fmt(t))
      setDuration(isFinite(d) ? fmt(d) : 'AO VIVO')
      setProgress(isFinite(d) && d > 0 ? (t / d) * 100 : 100)
    })

    return () => { cleanup?.then?.(fn => fn?.()); video.src = ''; setCurrentChannel(null) }
  }, [currentChannel, onBack, setCurrentChannel])

  // Auto-hide quando começa a tocar
  useEffect(() => {
    if (playing) hideTimer.current = setTimeout(() => setVisible(false), HIDE_DELAY)
    else { clearTimeout(hideTimer.current); setVisible(true) }
    return () => clearTimeout(hideTimer.current)
  }, [playing])

  // Teclado
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      showControls()
      const k = e.keyCode
      if (k === KEYS.BACK) { setCurrentChannel(null); onBack(); return }
      if (!visible) return // primeiro toque só mostra controles
      e.preventDefault()
      const video = videoRef.current!
      if (k === KEYS.LEFT || k === KEYS.RW) {
        if (!isLive) video.currentTime = Math.max(0, video.currentTime - SEEK_STEP)
        else setFocusIdx(i => Math.max(0, i - 1))
      } else if (k === KEYS.RIGHT || k === KEYS.FF) {
        if (!isLive) video.currentTime = Math.min(video.duration, video.currentTime + SEEK_STEP)
        else setFocusIdx(i => Math.min(4, i + 1))
      } else if (k === KEYS.UP) setFocusIdx(i => Math.max(0, i - 1))
      else if (k === KEYS.DOWN) setFocusIdx(i => Math.min(4, i + 1))
      else if (k === KEYS.OK || k === KEYS.PLAY_PAUSE || k === KEYS.PLAY || k === KEYS.PAUSE) {
        if (video.paused) video.play().catch(() => {})
        else video.pause()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [visible, isLive, showControls, onBack, setCurrentChannel])

  if (!currentChannel) return null

  const btns = [
    { icon: '⏮', label: '-10s' },
    { icon: '⏪', label: 'Lento' },
    { icon: playing ? '⏸' : '▶', label: playing ? 'Pausar' : 'Play' },
    { icon: '⏩', label: 'Rápido' },
    { icon: '⏭', label: '+10s' },
  ]

  return (
    <div className={styles.root}>
      <video ref={videoRef} className={styles.video} autoPlay playsInline />

      {/* Buffering */}
      {buffering && !error && <div className={styles.spinner} />}

      {/* Error */}
      {error && (
        <div className={styles.errorOverlay}>
          <div className={styles.errorIcon}>⚠</div>
          <p>{error}</p>
          <p className={styles.hint}>Pressione BACK para voltar</p>
        </div>
      )}

      {/* Controls overlay */}
      <div className={`${styles.overlay} ${visible ? styles.overlayVisible : ''}`}>
        {/* Top bar */}
        <div className={styles.topBar}>
          <button className={styles.backBtn} onClick={() => { setCurrentChannel(null); onBack() }}>←</button>
          <span className={styles.title}>{currentChannel.name}</span>
          {isLive && <span className={styles.liveBadge}>● AO VIVO</span>}
        </div>

        {/* Bottom bar */}
        <div className={styles.bottomBar}>
          {/* Progress */}
          <div className={styles.progressWrap}>
            <div className={styles.progressTrack}>
              <div className={styles.progressFill} style={{ width: `${progress}%` }} />
              <div className={styles.progressDot} style={{ left: `${progress}%` }} />
            </div>
            <div className={styles.timeRow}>
              <span>{currentTime}</span>
              <span>{duration}</span>
            </div>
          </div>

          {/* Buttons */}
          <div className={styles.controls}>
            {btns.map((b, i) => (
              <button
                key={i}
                className={`${styles.btn} ${focusIdx === i ? styles.btnFocused : ''}`}
              >
                <span className={styles.btnIcon}>{b.icon}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlayerScreen
