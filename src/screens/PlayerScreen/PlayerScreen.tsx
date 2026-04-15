import { useCallback, useEffect, useReducer, useRef } from 'react'
import { type Channel } from '../../types/channel'
import { initPlayer, loadStream, destroyPlayer, selectPlayerBackend } from '../../services/playerService'
import { avplayLoad, avplayStop, isAVPlayAvailable } from '../../services/avplayService'

// ───────────────────────────────────────────────────────────────────────────
// CONSTANTES
// ───────────────────────────────────────────────────────────────────────────
const ACCENT   = '#E50914'   // vermelho Netflix
const OSD_TIMEOUT = 3000     // ms sem input → esconde OSD
const DEBUG_KEYS  = true     // HUD de keyCodes — false após mapear controle

// Keycodes Samsung Tizen
const KEYS = {
  UP: 38, DOWN: 40, LEFT: 37, RIGHT: 39,
  OK: 13,
  BACK: 10009,
  PLAY: 415, PAUSE: 19, PLAY_PAUSE: 10252, STOP: 413,
  FF: 417, RW: 412,
  CH_UP: 427, CH_DOWN: 428,
  VOL_UP: 447, VOL_DOWN: 448, MUTE: 449,
  INFO: 457,
  EXIT: 10182,
  RED: 403, GREEN: 404, YELLOW: 405, BLUE: 406,
} as const

// índices dos botões da ControlsBar
const CTRL = { RW10: 0, RW: 1, PLAY: 2, FF: 3, FF10: 4, VOL: 5, SETTINGS: 6 } as const
const CTRL_COUNT = 7

// ───────────────────────────────────────────────────────────────────────────
// ESTADO (useReducer — Netflix pattern)
// ───────────────────────────────────────────────────────────────────────────
type PlayerStatus = 'loading' | 'playing' | 'paused' | 'error'
type FocusZone   = 'controls' | 'none'

interface State {
  status:      PlayerStatus
  error:       string | null
  osdVisible:  boolean
  focusZone:   FocusZone
  ctrlFocus:   number          // índice 0–6 na ControlsBar
  isLive:      boolean
  debugKeys:   Array<{ code: number; key: string }>
}

type Action =
  | { type: 'SET_STATUS';   status: PlayerStatus; error?: string }
  | { type: 'SET_OSD';      visible: boolean }
  | { type: 'SET_FOCUS';    zone: FocusZone; ctrl?: number }
  | { type: 'CTRL_MOVE';   dir: 'left' | 'right' }
  | { type: 'DEBUG_KEY';    code: number; key: string }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_STATUS':
      return { ...state, status: action.status, error: action.error ?? state.error }
    case 'SET_OSD':
      return { ...state, osdVisible: action.visible }
    case 'SET_FOCUS':
      return { ...state, focusZone: action.zone, ctrlFocus: action.ctrl ?? state.ctrlFocus }
    case 'CTRL_MOVE': {
      const next = action.dir === 'left'
        ? Math.max(0, state.ctrlFocus - 1)
        : Math.min(CTRL_COUNT - 1, state.ctrlFocus + 1)
      return { ...state, ctrlFocus: next }
    }
    case 'DEBUG_KEY':
      return { ...state, debugKeys: [{ code: action.code, key: action.key }, ...state.debugKeys.slice(0, 7)] }
    default:
      return state
  }
}

const INITIAL: State = {
  status: 'loading', error: null,
  osdVisible: true, focusZone: 'none', ctrlFocus: CTRL.PLAY,
  isLive: true, debugKeys: [],
}

// ───────────────────────────────────────────────────────────────────────────
// PROPS
// ───────────────────────────────────────────────────────────────────────────
interface Props {
  channel:       Channel
  onBack:        () => void
  onNextChannel?: () => void
  onPrevChannel?: () => void
  onShakaReady?: (player: any) => void
}

// ───────────────────────────────────────────────────────────────────────────
// COMPONENT
// ───────────────────────────────────────────────────────────────────────────
export default function PlayerScreen({
  channel, onBack, onNextChannel, onPrevChannel, onShakaReady
}: Props) {

  const [state, dispatch] = useReducer(reducer, INITIAL)
  const videoRef    = useRef<HTMLVideoElement>(null)
  const onBackRef   = useRef(onBack)
  const onNextRef   = useRef(onNextChannel)
  const onPrevRef   = useRef(onPrevChannel)
  onBackRef.current = onBack
  onNextRef.current = onNextChannel
  onPrevRef.current = onPrevChannel

  const osdTimerRef  = useRef<ReturnType<typeof setTimeout> | null>(null)
  const stateRef     = useRef(state)
  stateRef.current   = state

  const backend             = selectPlayerBackend(channel.url)
  const isNativeComposition = backend === 'avplay'

  // ─── OSD helper ─────────────────────────────────────────────────────────────────
  const showOsd = useCallback(() => {
    dispatch({ type: 'SET_OSD', visible: true })
    if (osdTimerRef.current) clearTimeout(osdTimerRef.current)
    // não esconde se pausado
    if (stateRef.current.status !== 'paused') {
      osdTimerRef.current = setTimeout(() => {
        dispatch({ type: 'SET_OSD', visible: false })
        dispatch({ type: 'SET_FOCUS', zone: 'none' })
      }, OSD_TIMEOUT)
    }
  }, [])

  useEffect(() => {
    if (state.status === 'playing') {
      dispatch({ type: 'SET_FOCUS', zone: 'none' })
      showOsd()
    }
    return () => { if (osdTimerRef.current) clearTimeout(osdTimerRef.current) }
  }, [state.status])

  // ─── Player lifecycle ──────────────────────────────────────────────────────────
  useEffect(() => {
    dispatch({ type: 'SET_STATUS', status: 'loading' })

    if (backend === 'avplay') {
      if (!isAVPlayAvailable()) {
        dispatch({ type: 'SET_STATUS', status: 'playing' })
        return
      }
      avplayLoad(
        channel.url,
        () => dispatch({ type: 'SET_STATUS', status: 'playing' }),
        (msg) => dispatch({ type: 'SET_STATUS', status: 'error', error: msg })
      )
      return () => avplayStop()
    }

    // Shaka
    const video = videoRef.current
    if (!video) return
    initPlayer(video)
      .then(async (player: any) => {
        onShakaReady?.(player)
        await loadStream(channel.url)
        dispatch({ type: 'SET_STATUS', status: 'playing' })
      })
      .catch((e: Error) => {
        dispatch({ type: 'SET_STATUS', status: 'error', error: e.message })
      })
    return () => { onShakaReady?.(null); destroyPlayer() }
  }, [channel.url, backend])

  // ─── Controle remoto ────────────────────────────────────────────────────────────
  useEffect(() => {
    const avplay = (window as any).webapis?.avplay
    const tizen  = (window as any).tizen
    let lastT    = 0

    const togglePlay = () => {
      const s = stateRef.current
      if (s.status === 'playing') {
        try { avplay ? avplay.pause() : videoRef.current?.pause() } catch (_) {}
        dispatch({ type: 'SET_STATUS', status: 'paused' })
        // pausado: OSD permanece visível, cancela timer
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

      // debug HUD
      if (DEBUG_KEYS) dispatch({ type: 'DEBUG_KEY', code: e.keyCode, key: e.key })

      // qualquer tecla → exibe OSD
      showOsd()

      const s = stateRef.current

      switch (e.keyCode) {

        // ─ BACK / EXIT ────────────────────────────────────────────
        case KEYS.BACK:
        case 8:
          e.preventDefault()
          onBackRef.current()
          return

        case KEYS.EXIT:
          e.preventDefault()
          try { tizen?.application?.getCurrentApplication().exit() } catch (_) {}
          return

        // ─ CH UP/DOWN — troca canal sem sair do player ──────────────
        case KEYS.CH_UP:
          e.preventDefault()
          onNextRef.current?.()
          return

        case KEYS.CH_DOWN:
          e.preventDefault()
          onPrevRef.current?.()
          return

        // ─ PLAY / PAUSE / STOP ─────────────────────────────────
        case KEYS.PLAY:
          e.preventDefault()
          try { avplay ? avplay.play() : videoRef.current?.play() } catch (_) {}
          dispatch({ type: 'SET_STATUS', status: 'playing' })
          return

        case KEYS.PAUSE:
          e.preventDefault()
          try { avplay ? avplay.pause() : videoRef.current?.pause() } catch (_) {}
          dispatch({ type: 'SET_STATUS', status: 'paused' })
          if (osdTimerRef.current) clearTimeout(osdTimerRef.current)
          dispatch({ type: 'SET_OSD', visible: true })
          return

        case KEYS.PLAY_PAUSE:
        case KEYS.OK:
          e.preventDefault()
          // OK só faz toggle se os controles já estão visíveis com foco no play
          if (s.osdVisible && s.focusZone === 'controls' && s.ctrlFocus === CTRL.PLAY) {
            togglePlay()
          } else if (s.osdVisible && s.focusZone === 'controls') {
            // OK em outro botão executa ação do botão
            handleCtrlAction(s.ctrlFocus, avplay)
          } else {
            // OSD não visível ou sem foco → mostra controles e foca no play
            dispatch({ type: 'SET_FOCUS', zone: 'controls', ctrl: CTRL.PLAY })
          }
          return

        // ─ FF / RW ──────────────────────────────────────────────
        case KEYS.FF:
          e.preventDefault()
          try { avplay?.jumpForward(10000) } catch (_) {}
          return

        case KEYS.RW:
          e.preventDefault()
          try { avplay?.jumpBackward(10000) } catch (_) {}
          return

        // ─ SETAS ───────────────────────────────────────────────
        case KEYS.DOWN:
        case KEYS.UP:
          e.preventDefault()
          // seta para baixo abre controles
          if (!s.osdVisible || s.focusZone === 'none') {
            dispatch({ type: 'SET_FOCUS', zone: 'controls', ctrl: CTRL.PLAY })
          }
          return

        case KEYS.LEFT:
          e.preventDefault()
          if (s.focusZone === 'controls') {
            dispatch({ type: 'CTRL_MOVE', dir: 'left' })
          } else {
            // sem foco nos controles: seek -10s
            try { avplay?.jumpBackward(10000) } catch (_) {}
          }
          return

        case KEYS.RIGHT:
          e.preventDefault()
          if (s.focusZone === 'controls') {
            dispatch({ type: 'CTRL_MOVE', dir: 'right' })
          } else {
            // sem foco nos controles: seek +10s
            try { avplay?.jumpForward(10000) } catch (_) {}
          }
          return

        // ─ INFO ────────────────────────────────────────────────
        case KEYS.INFO:
          e.preventDefault()
          dispatch({ type: 'SET_OSD', visible: !s.osdVisible })
          return
      }
    }

    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  // ─── Ações dos botões da ControlsBar ────────────────────────────────────────────
  const handleCtrlAction = (idx: number, avplay: any) => {
    switch (idx) {
      case CTRL.RW10:  try { avplay?.jumpBackward(10000) } catch (_) {}; break
      case CTRL.FF10:  try { avplay?.jumpForward(10000)  } catch (_) {}; break
      case CTRL.PLAY:  togglePlayDispatch(avplay); break
      default: break
    }
  }

  const togglePlayDispatch = (avplay: any) => {
    const s = stateRef.current
    if (s.status === 'playing') {
      try { avplay ? avplay.pause() : videoRef.current?.pause() } catch (_) {}
      dispatch({ type: 'SET_STATUS', status: 'paused' })
      if (osdTimerRef.current) clearTimeout(osdTimerRef.current)
      dispatch({ type: 'SET_OSD', visible: true })
    } else {
      try { avplay ? avplay.play() : videoRef.current?.play() } catch (_) {}
      dispatch({ type: 'SET_STATUS', status: 'playing' })
      showOsd()
    }
  }

  // ─── RENDER ───────────────────────────────────────────────────────────────────
  const { status, osdVisible, focusZone, ctrlFocus, debugKeys } = state
  const osdY = osdVisible ? '0px' : '20px'
  const osdO = osdVisible ? 1 : 0

  const CTRL_BTNS = [
    { icon: '⏮', label: '-10s',      idx: CTRL.RW10     },
    { icon: '⏪', label: 'Retroceder', idx: CTRL.RW       },
    { icon: status === 'paused' ? '▶️' : '⏸️', label: status === 'paused' ? 'Play' : 'Pausar', idx: CTRL.PLAY },
    { icon: '⏩', label: 'Avançar',    idx: CTRL.FF       },
    { icon: '⏭', label: '+10s',       idx: CTRL.FF10     },
    { icon: '🔊', label: 'Volume',    idx: CTRL.VOL      },
    { icon: '⚙️', label: 'Config',    idx: CTRL.SETTINGS },
  ]

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: isNativeComposition ? 'transparent' : '#000',
      color: '#fff', fontFamily: "'Outfit', sans-serif",
      willChange: 'transform', transform: 'translateZ(0)',
    }}>

      {/* ─ Vídeo (Shaka) */}
      {!isNativeComposition && (
        <video ref={videoRef} id="av-player" autoPlay playsInline
          style={{ width: '100%', height: '100%', display: 'block',
            willChange: 'transform', transform: 'translateZ(0)' }} />
      )}

      {/* ─ ANCHOR para AVPlay */}
      {isNativeComposition && (
        <div id="av-player" style={{ position: 'absolute', inset: 0 }} />
      )}

      {/* ═══ OSD WRAPPER ─ entra/sai com opacity + translateY ═══ */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        transition: 'opacity 300ms ease, transform 300ms ease',
        opacity: osdO, transform: `translateY(${osdY})`,
        willChange: 'opacity, transform',
      }}>

        {/* ── TOP BAR ─────────────────────────────────────────────── */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 140,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.85) 0%, transparent 100%)',
          display: 'flex', alignItems: 'flex-start', padding: '28px 48px 0',
          gap: 24,
        }}>
          {/* Botão BACK */}
          <div style={{
            width: 52, height: 52, borderRadius: '50%',
            background: 'rgba(255,255,255,0.12)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22, flexShrink: 0,
            border: '1px solid rgba(255,255,255,0.2)',
          }}>←</div>

          {/* Título */}
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 26, fontWeight: 800, lineHeight: 1.2 }}>
              {channel.name}
            </div>
            <div style={{ fontSize: 18, opacity: 0.6, marginTop: 4 }}>
              {channel.group}
            </div>
          </div>

          {/* Badge AO VIVO */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: ACCENT, padding: '6px 16px', borderRadius: 6,
            fontSize: 16, fontWeight: 800, letterSpacing: 1,
            alignSelf: 'center', flexShrink: 0,
          }}>
            <div style={{
              width: 8, height: 8, borderRadius: '50%', background: '#fff',
              animation: 'live-pulse 1.5s ease-in-out infinite',
            }} />
            AO VIVO
          </div>
        </div>

        {/* ── LOADING SPINNER (no centro) ────────────────────────── */}
        {status === 'loading' && (
          <div style={{
            position: 'absolute', inset: 0, display: 'flex',
            alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 20,
          }}>
            <div style={{
              width: 56, height: 56, borderRadius: '50%',
              border: `4px solid rgba(255,255,255,0.15)`,
              borderTop: `4px solid ${ACCENT}`,
              animation: 'spin 0.8s linear infinite',
            }} />
            <div style={{ fontSize: 18, opacity: 0.7 }}>Conectando...</div>
          </div>
        )}

        {/* ── PROGRESS BAR (ao vivo: estática) ────────────────────── */}
        <div style={{
          position: 'absolute', bottom: 140, left: 48, right: 48,
          height: focusZone === 'controls' ? 8 : 4,
          background: 'rgba(255,255,255,0.2)',
          borderRadius: 4,
          transition: 'height 200ms ease-out',
        }}>
          {/* faixa assistida (ao vivo: simula progresso do programa) */}
          <div style={{
            width: '35%', height: '100%',
            background: ACCENT, borderRadius: 4,
            position: 'relative',
          }}>
            {/* bolinha */}
            <div style={{
              position: 'absolute', right: -6, top: '50%',
              transform: focusZone === 'controls' ? 'translateY(-50%) scale(1)' : 'translateY(-50%) scale(0)',
              width: 16, height: 16, borderRadius: '50%', background: '#fff',
              transition: 'transform 150ms ease-out',
            }} />
          </div>
        </div>

        {/* ── BOTTOM ZONE ──────────────────────────────────────────── */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 280,
          background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)',
          display: 'flex', flexDirection: 'column',
          justifyContent: 'flex-end', padding: '0 48px 36px',
          gap: 0,
        }}>

          {/* CONTROLS BAR — 7 botões */}
          <div style={{
            display: 'flex', justifyContent: 'center',
            gap: 80, alignItems: 'center',
          }}>
            {CTRL_BTNS.map(({ icon, label, idx }) => {
              const focused = focusZone === 'controls' && ctrlFocus === idx
              const isPlay  = idx === CTRL.PLAY
              return (
                <div key={idx} style={{
                  width: isPlay ? 88 : 72, height: isPlay ? 88 : 72,
                  borderRadius: '50%',
                  background: focused
                    ? (isPlay ? ACCENT : 'rgba(255,255,255,0.22)')
                    : (isPlay ? 'rgba(229,9,20,0.5)' : 'transparent'),
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                  fontSize: isPlay ? 32 : 26,
                  opacity: focused ? 1 : 0.7,
                  transform: focused ? 'scale(1.15) translateZ(0)' : 'scale(1) translateZ(0)',
                  transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
                  willChange: 'transform',
                  boxShadow: focused && isPlay ? `0 0 32px rgba(229,9,20,0.6)` : 'none',
                  border: focused ? '2px solid rgba(255,255,255,0.5)' : '2px solid transparent',
                  cursor: 'pointer',
                  flexShrink: 0,
                }}>
                  <span>{icon}</span>
                  {focused && (
                    <span style={{ fontSize: 11, marginTop: 2, opacity: 0.8, whiteSpace: 'nowrap' }}>
                      {label}
                    </span>
                  )}
                </div>
              )
            })}
          </div>

          {/* Hint teclas */}
          <div style={{
            display: 'flex', justifyContent: 'center', gap: 40,
            marginTop: 18, fontSize: 16, opacity: 0.45,
          }}>
            <span>←→ navegar</span>
            <span>OK selecionar</span>
            <span>BACK voltar</span>
            <span>CH+/- trocar canal</span>
          </div>
        </div>
      </div>

      {/* ═══ ERRO ═══ */}
      {status === 'error' && (
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          background: 'rgba(0,0,0,0.9)', gap: 20,
        }}>
          <div style={{ fontSize: 56 }}>❌</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: '#f66' }}>
            {state.error ?? 'Erro ao carregar stream'}
          </div>
          <div style={{ fontSize: 18, opacity: 0.5, maxWidth: 800, textAlign: 'center' }}>
            {channel.url}
          </div>
          <div style={{
            marginTop: 12, background: ACCENT,
            padding: '14px 40px', borderRadius: 8,
            fontSize: 18, fontWeight: 700,
          }}>
            Pressione BACK para voltar
          </div>
        </div>
      )}

      {/* ═══ DEBUG HUD ═══ */}
      {DEBUG_KEYS && (
        <div style={{
          position: 'absolute', top: 20, right: 28,
          background: 'rgba(0,0,0,0.85)', border: '1px solid rgba(255,255,0,0.5)',
          borderRadius: 10, padding: '12px 18px', zIndex: 9999, minWidth: 240,
        }}>
          <div style={{ fontSize: 16, fontWeight: 900, color: '#ff0', marginBottom: 8 }}>
            🔍 DEBUG KEYS
          </div>
          {debugKeys.length === 0
            ? <div style={{ fontSize: 16, opacity: 0.5 }}>aperte qualquer botão...</div>
            : debugKeys.map((k, i) => (
              <div key={i} style={{
                fontSize: 16, opacity: i === 0 ? 1 : 0.4,
                fontFamily: 'monospace', lineHeight: 1.7,
              }}>
                <b style={{ color: '#0f0' }}>{k.code}</b>
                {k.key && k.key !== 'Unidentified' &&
                  <span style={{ color: '#8cf', marginLeft: 8 }}>({k.key})</span>}
              </div>
            ))
          }
        </div>
      )}

      {/* ═══ KEYFRAMES ═══ */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes live-pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.3; }
        }
        *::-webkit-scrollbar { display: none; }
        * { scrollbar-width: none; }
      `}</style>
    </div>
  )
}
