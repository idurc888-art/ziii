import React, { useEffect, useRef, useState, useCallback } from 'react'
import { useChannelsStore } from '../../store/channelsStore'
import styles from './PlayerScreen.module.css'

interface Props { onBack: () => void }

const KEYS = {
  BACK: 10009, OK: 13,
  LEFT: 37, RIGHT: 39, UP: 38, DOWN: 40,
  PLAY: 415, PAUSE: 19, PLAY_PAUSE: 10252,
  FF: 417, RW: 412,
  CH_UP: 427, CH_DOWN: 428,
  INFO: 457
}
const HIDE_DELAY = 3000
const SEEK_STEP = 10
const SEEK_FAST = 30

const PlayerScreen: React.FC<Props> = ({ onBack }) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const hideTimer = useRef<ReturnType<typeof setTimeout>>()
  const retryRef = useRef(0)

  const currentChannel = useChannelsStore(s => s.currentChannel)
  const channels = useChannelsStore(s => s.channels)
  const setCurrentChannel = useChannelsStore(s => s.setCurrentChannel)

  const [visible, setVisible] = useState(true)
  const [playing, setPlaying] = useState(false)
  const [buffering, setBuffering] = useState(true)
  const [error, setError] = useState('')
  const [progress, setProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState('00:00')
  const [duration, setDuration] = useState('AO VIVO')
  const [focusIdx, setFocusIdx] = useState(2)
  const [showInfo, setShowInfo] = useState(false)

  const isLive = !videoRef.current?.duration || !isFinite(videoRef.current.duration)

  const showControls = useCallback(() => {
    setVisible(true)
    clearTimeout(hideTimer.current)
    if (playing) hideTimer.current = setTimeout(() => setVisible(false), HIDE_DELAY)
  }, [playing])

  const fmt = (s: number) => {
    if (!isFinite(s)) return '00:00'
    const m = Math.floor(s / 60), sec = Math.floor(s % 60)
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
  }

  const changeChannel = useCallback((dir: 1 | -1) => {
    if (!currentChannel || !channels.length) return
    const idx = channels.findIndex(c => c.url === currentChannel.url)
    const next = channels[Math.max(0, Math.min(channels.length - 1, idx + dir))]
    if (next) setCurrentChannel(next)
  }, [currentChannel, channels, setCurrentChannel])

  useEffect(() => {
    if (!currentChannel) { onBack(); return }
    const video = videoRef.current!
    retryRef.current = 0
    let hlsInstance: any = null

    const tryLoad = async () => {
      setError(''); setBuffering(true)
      try {
        const Hls = (window as any).Hls
        if (Hls && Hls.isSupported()) {
          hlsInstance = new Hls({ enableWorker: false, lowLatencyMode: true })
          hlsInstance.loadSource(currentChannel.url)
          hlsInstance.attachMedia(video)
          hlsInstance.on(Hls.Events.MANIFEST_PARSED, () => video.play().catch(() => {}))
          hlsInstance.on(Hls.Events.ERROR, (_: any, d: any) => { if (d.fatal) setError('Erro no stream') })
          return
        }
        video.src = currentChannel.url
        await video.play()
      } catch {
        if (retryRef.current < 2) { retryRef.current++; setTimeout(tryLoad, 2000) }
        else setError('Não foi possível reproduzir')
      }
    }

    tryLoad()
    video.addEventListener('playing', () => { setPlaying(true); setBuffering(false) })
    video.addEventListener('pause', () => setPlaying(false))
    video.addEventListener('waiting', () => setBuffering(true))
    video.addEventListener('timeupdate', () => {
      const d = video.duration, t = video.currentTime
      setCurrentTime(fmt(t))
      setDuration(isFinite(d) ? fmt(d) : 'AO VIVO')
      setProgress(isFinite(d) && d > 0 ? (t / d) * 100 : 100)
    })

    return () => {
      hlsInstance?.destroy()
      video.src = ''
      setCurrentChannel(null)
    }
  }, [currentChannel, onBack, setCurrentChannel])

  useEffect(() => {
    if (playing) hideTimer.current = setTimeout(() => setVisible(false), HIDE_DELAY)
    else { clearTimeout(hideTimer.current); setVisible(true) }
    return () => clearTimeout(hideTimer.current)
  }, [playing])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const k = e.keyCode
      if (k === KEYS.BACK) { setCurrentChannel(null); onBack(); return }
      if (k === KEYS.CH_UP) { changeChannel(1); return }
      if (k === KEYS.CH_DOWN) { changeChannel(-1); return }
      if (k === KEYS.INFO) { setShowInfo(v => !v); return }

      showControls()
      if (!visible) return

      e.preventDefault()
      const video = videoRef.current!

      if (k === KEYS.LEFT || k === KEYS.RW) {
        if (!isLive) video.currentTime = Math.max(0, video.currentTime - SEEK_STEP)
        else setFocusIdx(i => Math.max(0, i - 1))
      } else if (k === KEYS.RIGHT || k === KEYS.FF) {
        if (!isLive) video.currentTime = Math.min(video.duration, video.currentTime + SEEK_STEP)
        else setFocusIdx(i => Math.min(4, i + 1))
      } else if (k === KEYS.FF && !isLive) {
        video.currentTime = Math.min(video.duration, video.currentTime + SEEK_FAST)
      } else if (k === KEYS.RW && !isLive) {
        video.currentTime = Math.max(0, video.currentTime - SEEK_FAST)
      } else if (k === KEYS.UP) {
        setFocusIdx(i => Math.max(0, i - 1))
      } else if (k === KEYS.DOWN) {
        setFocusIdx(i => Math.min(4, i + 1))
      } else if (k === KEYS.OK || k === KEYS.PLAY_PAUSE || k === KEYS.PLAY || k === KEYS.PAUSE) {
        if (video.paused) video.play().catch(() => {})
        else video.pause()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [visible, isLive, showControls, onBack, setCurrentChannel, changeChannel])

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

      {buffering && !error && <div className={styles.spinner} />}

      {error && (
        <div className={styles.errorOverlay}>
          <div className={styles.errorIcon}>⚠</div>
          <p>{error}</p>
          <p className={styles.hint}>Pressione BACK para voltar</p>
        </div>
      )}

      {showInfo && (
        <div className={styles.infoOverlay}>
          <span className={styles.infoChannel}>{currentChannel.name}</span>
          <span className={styles.infoGroup}>{currentChannel.group}</span>
        </div>
      )}

      <div className={`${styles.overlay} ${visible ? styles.overlayVisible : styles.overlayHidden}`}>
        <div className={`${styles.topBar} ${visible ? styles.topBarVisible : styles.topBarHidden}`}>
          <button className={styles.backBtn} onClick={() => { setCurrentChannel(null); onBack() }}>←</button>
          <span className={styles.title}>{currentChannel.name}</span>
          {isLive && <span className={styles.liveBadge}>● AO VIVO</span>}
        </div>

        <div className={`${styles.bottomBar} ${visible ? styles.bottomBarVisible : styles.bottomBarHidden}`}>
          <div className={styles.progressWrap}>
            <div className={`${styles.progressTrack} ${visible ? styles.progressTrackActive : ''}`}>
              <div className={styles.progressFill} style={{ width: `${progress}%` }} />
              <div className={`${styles.progressDot} ${visible ? styles.progressDotVisible : ''}`} style={{ left: `${progress}%` }} />
            </div>
            <div className={styles.timeRow}>
              <span>{currentTime}</span>
              <span>{duration}</span>
            </div>
          </div>

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
