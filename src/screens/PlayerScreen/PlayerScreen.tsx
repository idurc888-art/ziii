import { useCallback, useEffect, useReducer, useRef } from 'react'
import { type Channel } from '../../types/channel'
import { initPlayer, loadStream, destroyPlayer, selectPlayerBackend } from '../../services/playerService'
import { avplayLoad, avplayStop, isAVPlayAvailable } from '../../services/avplayService'

const ACCENT      = '#E50914'
const OSD_TIMEOUT = 4000
const DEBUG_KEYS  = false  // ★ PRODUÇÃO: false

const KEYS = {
  UP: 38, DOWN: 40, LEFT: 37, RIGHT: 39,
  OK: 13, BACK: 10009,
  PLAY: 415, PAUSE: 19, PLAY_PAUSE: 10252, STOP: 413,
  FF: 417, RW: 412,
  CH_UP: 427, CH_DOWN: 428,
  VOL_UP: 447, VOL_DOWN: 448, MUTE: 449,
  INFO: 457, EXIT: 10182,
  RED: 403, GREEN: 404, YELLOW: 405, BLUE: 406,
} as const

const CTRL = { RW10: 0, RW: 1, PLAY: 2, FF: 3, FF10: 4, VOL: 5, SETTINGS: 6 } as const
const CTRL_COUNT = 7

type PlayerStatus = 'loading' | 'playing' | 'paused' | 'error'
type FocusZone   = 'controls' | 'none'

interface State {
  status:     PlayerStatus
  error:      string | null
  osdVisible: boolean
  focusZone:  FocusZone
  ctrlFocus:  number
  slowWarning: boolean
  debugKeys:  Array<{ code: number; key: string }>
}

type Action =
  | { type: 'SET_STATUS';   status: PlayerStatus; error?: string }
  | { type: 'SET_OSD';      visible: boolean }
  | { type: 'SET_FOCUS';    zone: FocusZone; ctrl?: number }
  | { type: 'CTRL_MOVE';    dir: 'left' | 'right' }
  | { type: 'SLOW_WARNING'; show: boolean }
  | { type: 'DEBUG_KEY';    code: number; key: string }

function reducer(s: State, a: Action): State {
  switch (a.type) {
    case 'SET_STATUS':   return { ...s, status: a.status, error: a.error ?? s.error, slowWarning: false }
    case 'SET_OSD':      return { ...s, osdVisible: a.visible }
    case 'SET_FOCUS':    return { ...s, focusZone: a.zone, ctrlFocus: a.ctrl ?? s.ctrlFocus }
    case 'CTRL_MOVE':    return { ...s, ctrlFocus: a.dir === 'left' ? Math.max(0, s.ctrlFocus - 1) : Math.min(CTRL_COUNT - 1, s.ctrlFocus + 1) }
    case 'SLOW_WARNING': return { ...s, slowWarning: a.show }
    case 'DEBUG_KEY':    return { ...s, debugKeys: [{ code: a.code, key: a.key }, ...s.debugKeys.slice(0, 7)] }
    default: return s
  }
}

const INITIAL: State = {
  status: 'loading', error: null,
  osdVisible: true, focusZone: 'none', ctrlFocus: CTRL.PLAY,
  slowWarning: false,
  debugKeys: [],
}

const RETRY_DELAYS = [1000, 3000, 5000, 8000, 12000]
const MAX_RETRIES  = RETRY_DELAYS.length
const SLOW_TIMEOUT = 12000

interface Props {
  channel:        Channel
  onBack:         () => void
  onNextChannel?: () => void
  onPrevChannel?: () => void
  onShakaReady?:  (player: any) => void
}

export default function PlayerScreen({ channel, onBack, onNextChannel, onPrevChannel, onShakaReady }: Props) {

  const [state, dispatch] = useReducer(reducer, INITIAL)
  const videoRef     = useRef<HTMLVideoElement>(null)
  const onBackRef    = useRef(onBack)
  const onNextRef    = useRef(onNextChannel)
  const onPrevRef    = useRef(onPrevChannel)
  onBackRef.current  = onBack
  onNextRef.current  = onNextChannel
  onPrevRef.current  = onPrevChannel

  const osdTimerRef   = useRef<ReturnType<typeof setTimeout> | null>(null)
  const slowTimerRef  = useRef<ReturnType<typeof setTimeout> | null>(null)
  const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const stateRef      = useRef(state)
  stateRef.current    = state

  // ★ inFlightRef — impede callbacks AVPlay de dispararem após channel change/unmount
  const inFlightRef   = useRef(false)
  const retryCountRef = useRef(0)

  const streamUrl = channel.activeStream.url
  const backend  = selectPlayerBackend(streamUrl)
  const isAVPlay = backend === 'avplay'

  // ─── OSD timer ─────────────────────────────────────────────────────────────
  const showOsd = useCallback(() => {
    dispatch({ type: 'SET_OSD', visible: true })
    if (osdTimerRef.current) clearTimeout(osdTimerRef.current)
    if (stateRef.current.status !== 'paused') {
      osdTimerRef.current = setTimeout(() => {
        dispatch({ type: 'SET_OSD', visible: false })
        dispatch({ type: 'SET_FOCUS', zone: 'none' })
      }, OSD_TIMEOUT)
    }
  }, [])

  useEffect(() => {
    if (state.status === 'playing') {
      retryCountRef.current = 0
      dispatch({ type: 'SET_FOCUS', zone: 'none' })
      showOsd()
    }
    return () => { if (osdTimerRef.current) clearTimeout(osdTimerRef.current) }
  }, [state.status])

  // ─── Slow warning 12s ──────────────────────────────────────────────────────
  const startSlowTimer = useCallback(() => {
    if (slowTimerRef.current) clearTimeout(slowTimerRef.current)
    dispatch({ type: 'SLOW_WARNING', show: false })
    slowTimerRef.current = setTimeout(() => {
      if (stateRef.current.status === 'loading') {
        dispatch({ type: 'SLOW_WARNING', show: true })
      }
    }, SLOW_TIMEOUT)
  }, [])

  // ─── Retry handler ─────────────────────────────────────────────────────────
  const attemptRetry = useCallback((errorMsg: string) => {
    if (!inFlightRef.current) return
    const attempt = retryCountRef.current
    if (attempt >= MAX_RETRIES) {
      dispatch({ type: 'SET_STATUS', status: 'error', error: errorMsg })
      return
    }
    const delay = RETRY_DELAYS[attempt]
    retryCountRef.current = attempt + 1
    console.log(`[PlayerRetry] Attempt ${attempt + 1}/${MAX_RETRIES} in ${delay}ms`)
    dispatch({ type: 'SET_STATUS', status: 'loading' })
    startSlowTimer()

    retryTimerRef.current = setTimeout(() => {
      if (!inFlightRef.current) return
      if (backend === 'avplay') {
        if (!isAVPlayAvailable()) { setTimeout(() => dispatch({ type: 'SET_STATUS', status: 'playing' }), 300); return }
        try { avplayStop() } catch (_) {}
        avplayLoad(
          streamUrl, 'av-player',
          () => { if (inFlightRef.current) dispatch({ type: 'SET_STATUS', status: 'playing' }) },
          (msg) => { if (inFlightRef.current) attemptRetry(msg) }
        )
      } else {
        const video = videoRef.current
        if (!video) return
        destroyPlayer()
        initPlayer(video)
          .then(async (player: any) => {
            if (!inFlightRef.current) return
            onShakaReady?.(player)
            await loadStream(streamUrl)
            if (inFlightRef.current) dispatch({ type: 'SET_STATUS', status: 'playing' })
          })
          .catch((e: Error) => { if (inFlightRef.current) attemptRetry(e.message) })
      }
    }, delay)
  }, [streamUrl, backend, startSlowTimer])

  // ─── Retry manual (botão na tela de erro) ──────────────────────────────────
  const retryManual = useCallback(() => {
    retryCountRef.current = 0
    inFlightRef.current   = true
    dispatch({ type: 'SET_STATUS', status: 'loading' })
    startSlowTimer()
    if (backend === 'avplay') {
      if (!isAVPlayAvailable()) { setTimeout(() => dispatch({ type: 'SET_STATUS', status: 'playing' }), 300); return }
      try { avplayStop() } catch (_) {}
      avplayLoad(
        streamUrl, 'av-player',
        () => { if (inFlightRef.current) dispatch({ type: 'SET_STATUS', status: 'playing' }) },
        (msg) => { if (inFlightRef.current) attemptRetry(msg) }
      )
    } else {
      const video = videoRef.current
      if (!video) return
      destroyPlayer()
      initPlayer(video)
        .then(async (player: any) => {
          if (!inFlightRef.current) return
          onShakaReady?.(player)
          await loadStream(streamUrl)
          if (inFlightRef.current) dispatch({ type: 'SET_STATUS', status: 'playing' })
        })
        .catch((e: Error) => { if (inFlightRef.current) attemptRetry(e.message) })
    }
  }, [streamUrl, backend, attemptRetry, startSlowTimer])

  // ─── Player lifecycle ──────────────────────────────────────────────────────
  useEffect(() => {
    inFlightRef.current   = true
    retryCountRef.current = 0
    dispatch({ type: 'SET_STATUS', status: 'loading' })
    startSlowTimer()

    if (backend === 'avplay') {
      if (!isAVPlayAvailable()) {
        setTimeout(() => { if (inFlightRef.current) dispatch({ type: 'SET_STATUS', status: 'playing' }) }, 300)
        return () => { inFlightRef.current = false; if (slowTimerRef.current) clearTimeout(slowTimerRef.current) }
      }
      avplayLoad(
        streamUrl, 'av-player',
        () => { if (inFlightRef.current) dispatch({ type: 'SET_STATUS', status: 'playing' }) },
        (msg) => { if (inFlightRef.current) attemptRetry(msg) }
      )
      return () => {
        inFlightRef.current = false
        if (retryTimerRef.current) clearTimeout(retryTimerRef.current)
        if (slowTimerRef.current)  clearTimeout(slowTimerRef.current)
        avplayStop()
      }
    }

    const video = videoRef.current
    if (!video) return
    initPlayer(video)
      .then(async (player: any) => {
        if (!inFlightRef.current) return
        onShakaReady?.(player)
        await loadStream(streamUrl)
        if (inFlightRef.current) dispatch({ type: 'SET_STATUS', status: 'playing' })
      })
      .catch((e: Error) => { if (inFlightRef.current) attemptRetry(e.message) })

    return () => {
      inFlightRef.current = false
      if (retryTimerRef.current) clearTimeout(retryTimerRef.current)
      if (slowTimerRef.current)  clearTimeout(slowTimerRef.current)
      onShakaReady?.(null)
      destroyPlayer()
    }
  }, [streamUrl, backend])

  // ─── Teclado ───────────────────────────────────────────────────────────────
  useEffect(() => {
    const avplay = (window as any).webapis?.avplay
    const tizen  = (window as any).tizen
    let lastT = 0

    const doToggle = () => {
      const s = stateRef.current
      if (s.status === 'playing') {
        try { avplay ? avplay.pause() : videoRef.current?.pause() } catch (_) {}
        dispatch({ type: 'SET_STATUS', status: 'paused' })
        if (osdTimerRef.current) clearTimeout(osdTimerRef.current)
        dispatch({ type: 'SET_OSD', visible: true })
      } else if (s.status === 'paused') {
        try { avplay ? avplay.play() : videoRef.current?.play() } catch (_) {}
        dispatch({ type: 'SET_STATUS', status: 'playing' })
        showOsd()
      }
    }

    const onKey = (e: KeyboardEvent) => {
      const now = Date.now()
      if (now - lastT < 100) return
      lastT = now
      if (DEBUG_KEYS) dispatch({ type: 'DEBUG_KEY', code: e.keyCode, key: e.key })
      showOsd()
      const s = stateRef.current
      switch (e.keyCode) {
        case KEYS.BACK: case 8:        e.preventDefault(); onBackRef.current(); return
        case KEYS.EXIT:                e.preventDefault(); try { tizen?.application?.getCurrentApplication().exit() } catch (_) {}; return
        case KEYS.CH_UP:               e.preventDefault(); onNextRef.current?.(); return
        case KEYS.CH_DOWN:             e.preventDefault(); onPrevRef.current?.(); return
        case KEYS.PLAY:                e.preventDefault(); try { avplay ? avplay.play()  : videoRef.current?.play()  } catch (_) {}; dispatch({ type: 'SET_STATUS', status: 'playing' }); return
        case KEYS.PAUSE:               e.preventDefault(); try { avplay ? avplay.pause() : videoRef.current?.pause() } catch (_) {}; dispatch({ type: 'SET_STATUS', status: 'paused' }); if (osdTimerRef.current) clearTimeout(osdTimerRef.current); dispatch({ type: 'SET_OSD', visible: true }); return
        case KEYS.PLAY_PAUSE: case KEYS.OK:
          e.preventDefault()
          if (s.osdVisible && s.focusZone === 'controls') { doToggle() }
          else { dispatch({ type: 'SET_FOCUS', zone: 'controls', ctrl: CTRL.PLAY }) }
          return
        case KEYS.FF: e.preventDefault(); try { avplay?.jumpForward(10000)  } catch (_) {}; return
        case KEYS.RW: e.preventDefault(); try { avplay?.jumpBackward(10000) } catch (_) {}; return
        case KEYS.DOWN: case KEYS.UP:
          e.preventDefault()
          if (!s.osdVisible || s.focusZone === 'none') dispatch({ type: 'SET_FOCUS', zone: 'controls', ctrl: CTRL.PLAY })
          return
        case KEYS.LEFT:
          e.preventDefault()
          if (s.focusZone === 'controls') dispatch({ type: 'CTRL_MOVE', dir: 'left' })
          else { try { avplay?.jumpBackward(10000) } catch (_) {} }
          return
        case KEYS.RIGHT:
          e.preventDefault()
          if (s.focusZone === 'controls') dispatch({ type: 'CTRL_MOVE', dir: 'right' })
          else { try { avplay?.jumpForward(10000) } catch (_) {} }
          return
        case KEYS.INFO:
          e.preventDefault()
          dispatch({ type: 'SET_OSD', visible: !s.osdVisible })
          return
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  const { status, osdVisible, focusZone, ctrlFocus, slowWarning, debugKeys } = state

  const CTRL_BTNS = [
    { icon: '⏮', label: '-10s',      idx: CTRL.RW10 },
    { icon: '⏪', label: 'Retroceder', idx: CTRL.RW },
    { icon: status === 'paused' ? '▶️' : '⏸️', label: status === 'paused' ? 'Play' : 'Pause', idx: CTRL.PLAY },
    { icon: '⏩', label: 'Avançar',    idx: CTRL.FF },
    { icon: '⏭', label: '+10s',       idx: CTRL.FF10 },
    { icon: '🔊', label: 'Volume',    idx: CTRL.VOL },
    { icon: '⚙️', label: 'Config',    idx: CTRL.SETTINGS },
  ]

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: '#000',
      color: '#fff',
      fontFamily: "'Outfit', 'Helvetica Neue', sans-serif",
      overflow: 'hidden',
    }}>

      {isAVPlay && (
        <object
          id="av-player"
          type="application/avplayer"
          style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', zIndex: 1 }}
        />
      )}

      {!isAVPlay && (
        <video
          ref={videoRef}
          id="shaka-player"
          autoPlay
          playsInline
          style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', display: 'block', zIndex: 1 }}
        />
      )}

      {/* OSD — visibility em vez de opacity (Tizen colapsa opacity:0) */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 10,
        pointerEvents: 'none',
        visibility: osdVisible ? 'visible' : 'hidden',
        transition: 'visibility 0ms',
      }}>
        {/* TOP BAR */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 160,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.92) 0%, transparent 100%)',
          display: 'flex', alignItems: 'flex-start',
          padding: '32px 56px 0', gap: 20, zIndex: 11,
          opacity: osdVisible ? 1 : 0,
          transition: 'opacity 300ms ease',
        }}>
          <div style={{
            width: 52, height: 52, borderRadius: '50%', flexShrink: 0,
            background: 'rgba(255,255,255,0.15)',
            border: '1px solid rgba(255,255,255,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22,
          }}>←</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 28, fontWeight: 800, lineHeight: 1.2, textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>
              {channel.name}
            </div>
            <div style={{ fontSize: 18, opacity: 0.55, marginTop: 4 }}>{channel.group}</div>
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8, alignSelf: 'center', flexShrink: 0,
            background: ACCENT, padding: '7px 18px', borderRadius: 6,
            fontSize: 18, fontWeight: 900, letterSpacing: 1.5,
          }}>
            <div style={{
              width: 8, height: 8, borderRadius: '50%', background: '#fff',
              animation: 'livePulse 1.5s ease-in-out infinite',
            }} />
            AO VIVO
          </div>
        </div>

        {/* PROGRESS BAR */}
        <div style={{
          position: 'absolute', bottom: 148, left: 56, right: 56,
          height: focusZone === 'controls' ? 8 : 4,
          background: 'rgba(255,255,255,0.2)', borderRadius: 4,
          transition: 'height 200ms ease-out',
          zIndex: 11, opacity: osdVisible ? 1 : 0,
          transitionProperty: 'height, opacity',
        }}>
          <div style={{ width: '35%', height: '100%', background: ACCENT, borderRadius: 4, position: 'relative' }}>
            <div style={{
              position: 'absolute', right: -7, top: '50%',
              transform: focusZone === 'controls' ? 'translateY(-50%) scale(1)' : 'translateY(-50%) scale(0)',
              width: 18, height: 18, borderRadius: '50%', background: '#fff',
              boxShadow: '0 0 8px rgba(255,255,255,0.6)',
              transition: 'transform 150ms ease-out',
            }} />
          </div>
        </div>

        {/* BOTTOM CONTROLS */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 300,
          background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, transparent 100%)',
          display: 'flex', flexDirection: 'column',
          justifyContent: 'flex-end', padding: '0 56px 40px',
          zIndex: 11, opacity: osdVisible ? 1 : 0,
          transition: 'opacity 300ms ease',
        }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 80, alignItems: 'center' }}>
            {CTRL_BTNS.map(({ icon, label, idx }) => {
              const focused = focusZone === 'controls' && ctrlFocus === idx
              const isPlay  = idx === CTRL.PLAY
              return (
                <div key={idx} style={{
                  width: isPlay ? 92 : 72, height: isPlay ? 92 : 72,
                  borderRadius: '50%', flexShrink: 0,
                  background: focused
                    ? (isPlay ? ACCENT : 'rgba(255,255,255,0.25)')
                    : (isPlay ? 'rgba(229,9,20,0.45)' : 'transparent'),
                  border: focused ? '2px solid rgba(255,255,255,0.6)' : '2px solid rgba(255,255,255,0.1)',
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                  fontSize: isPlay ? 34 : 26,
                  opacity: focused ? 1 : 0.65,
                  transform: focused ? 'scale(1.18) translateZ(0)' : 'scale(1) translateZ(0)',
                  transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: focused && isPlay ? '0 0 40px rgba(229,9,20,0.7)' : 'none',
                }}>
                  <span style={{ lineHeight: 1 }}>{icon}</span>
                  {focused && (
                    <span style={{ fontSize: 18, marginTop: 4, opacity: 0.85, whiteSpace: 'nowrap', fontWeight: 600 }}>
                      {label}
                    </span>
                  )}
                </div>
              )
            })}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 48, marginTop: 20, fontSize: 18, opacity: 0.4 }}>
            <span>←→ navegar</span>
            <span>OK selecionar</span>
            <span>BACK voltar</span>
            <span>CH+/− trocar canal</span>
          </div>
        </div>
      </div>

      {/* LOADING — spinner + slow warning */}
      {status === 'loading' && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 20,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: 20,
          background: 'rgba(0,0,0,0.6)',
        }}>
          <div style={{
            width: 60, height: 60, borderRadius: '50%',
            border: '4px solid rgba(255,255,255,0.15)',
            borderTop: `4px solid ${ACCENT}`,
            animation: 'spin 0.8s linear infinite',
          }} />
          <div style={{ fontSize: 20, opacity: 0.7 }}>Conectando...</div>
          {slowWarning && (
            <div style={{
              marginTop: 12, fontSize: 18, color: '#fbbf24',
              background: 'rgba(251,191,36,0.1)',
              border: '1px solid rgba(251,191,36,0.3)',
              borderRadius: 8, padding: '10px 24px', textAlign: 'center',
            }}>
              ⏳ Demorando mais que o esperado...
            </div>
          )}
        </div>
      )}

      {/* ERRO — com botão tentar novamente */}
      {status === 'error' && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 20,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          background: 'rgba(0,0,0,0.92)', gap: 20,
        }}>
          <div style={{ fontSize: 60 }}>❌</div>
          <div style={{ fontSize: 26, fontWeight: 700, color: '#ff6b6b' }}>
            {state.error ?? 'Erro ao carregar stream'}
          </div>
          <div style={{ fontSize: 18, opacity: 0.45, maxWidth: 800, textAlign: 'center' }}>
            {streamUrl}
          </div>
          <div style={{ fontSize: 18, opacity: 0.5, marginTop: 4 }}>
            Todas as {MAX_RETRIES} tentativas falharam
          </div>
          <div style={{ display: 'flex', gap: 20, marginTop: 24 }}>
            <div
              onClick={retryManual}
              style={{
                background: ACCENT, padding: '16px 48px', borderRadius: 8,
                fontSize: 20, fontWeight: 700, cursor: 'pointer',
              }}
            >
              🔄 Tentar Novamente
            </div>
            <div
              onClick={() => onBackRef.current()}
              style={{
                background: 'rgba(255,255,255,0.12)', padding: '16px 48px', borderRadius: 8,
                fontSize: 20, fontWeight: 700, cursor: 'pointer',
              }}
            >
              ← Voltar
            </div>
          </div>
          <div style={{ fontSize: 18, opacity: 0.35, marginTop: 8 }}>
            Pressione BACK para voltar
          </div>
        </div>
      )}

      {/* DEBUG HUD — apenas quando DEBUG_KEYS = true */}
      {DEBUG_KEYS && (
        <div style={{
          position: 'absolute', top: 24, right: 32, zIndex: 9999,
          background: 'rgba(0,0,0,0.88)', border: '2px solid rgba(255,220,0,0.6)',
          borderRadius: 12, padding: '14px 20px', minWidth: 250,
        }}>
          <div style={{ fontSize: 18, fontWeight: 900, color: '#ffd700', marginBottom: 10 }}>🔍 DEBUG KEYS</div>
          {debugKeys.length === 0
            ? <div style={{ fontSize: 18, opacity: 0.45 }}>aperte qualquer botão...</div>
            : debugKeys.map((k, i) => (
              <div key={i} style={{ fontSize: 18, opacity: i === 0 ? 1 : 0.35, fontFamily: 'monospace', lineHeight: 1.8 }}>
                <b style={{ color: '#00ff88' }}>{k.code}</b>
                {k.key && k.key !== 'Unidentified' && <span style={{ color: '#88ccff', marginLeft: 8 }}>({k.key})</span>}
              </div>
            ))
          }
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes livePulse { 0%,100% { opacity:1; } 50% { opacity:0.25; } }
        * { scrollbar-width: none; }
        *::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  )
}
