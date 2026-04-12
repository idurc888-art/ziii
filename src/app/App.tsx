import React, { useState, useEffect, useCallback, useRef } from 'react'
import HomeScreen from '../screens/HomeScreen/HomeScreen'
import PlayerScreen from '../screens/PlayerScreen/PlayerScreen'
import SettingsScreen from '../screens/SettingsScreen/SettingsScreen'
import { useChannelsStore } from '../store/channelsStore'

export type Screen = 'home' | 'player' | 'settings'

export interface Channel {
  id: string
  name: string
  url: string
  group: string
  logo: string
}

// Pilha de navegação — padrão Samsung
const backStack: Screen[] = ['home']

const KEYS = {
  BACK: 10009,
  EXIT: 10182,
}

const App: React.FC = () => {
  const [screen,    setScreen]    = useState<Screen>('settings')
  const [showExit,  setShowExit]  = useState(false)
  const [exitFocus, setExitFocus] = useState<'yes'|'no'>('no')
  const setCurrentChannel = useChannelsStore(state => state.setCurrentChannel)

  // Registrar teclas extras do controle Samsung (além das mandatory)
  // Setas e Enter são mandatory keys — NÃO precisam de registerKey
  useEffect(() => {
    try {
      const tizen = (window as any).tizen
      if (tizen?.tvinputdevice) {
        const extraKeys = [
          'MediaPlay', 'MediaPause', 'MediaPlayPause', 'MediaStop',
          'MediaRewind', 'MediaFastForward',
          'ChannelUp', 'ChannelDown',
          'ColorF0Red', 'ColorF1Green', 'ColorF2Yellow', 'ColorF3Blue',
        ]
        extraKeys.forEach(k => { try { tizen.tvinputdevice.registerKey(k) } catch {} })
      }
    } catch {}
  }, [])

  const navigate = useCallback((s: Screen, ch?: Channel) => {
    if (ch) setCurrentChannel(ch)
    backStack.push(s)
    setScreen(s)
  }, [setCurrentChannel])

  const exitApp = () => {
    try { (window as any).tizen?.application?.getCurrentApplication()?.exit() }
    catch { window.close() }
  }

  // Refs para evitar stale closure no handler de teclado
  const showExitRef  = useRef(showExit)
  const exitFocusRef = useRef(exitFocus)
  useEffect(() => { showExitRef.current  = showExit  }, [showExit])
  useEffect(() => { exitFocusRef.current = exitFocus }, [exitFocus])

  const goBack = useCallback(() => {
    if (showExitRef.current) { setShowExit(false); return }
    if (backStack.length <= 1) {
      setShowExit(true)
      setExitFocus('no')
      return
    }
    backStack.pop()
    setScreen(backStack[backStack.length - 1])
  }, [])

  // PADRÃO SAMSUNG — tizenhwkey é o evento oficial para Back/Exit
  // keydown com keyCode 10009 como fallback (funciona em alguns modelos)
  useEffect(() => {
    // Handler principal: tizenhwkey (padrão oficial Tizen)
    const onHwKey = (e: any) => {
      if (e.keyName === 'back') { e.preventDefault?.(); goBack() }
      if (e.keyName === 'menu') { /* opcional: abrir settings */ }
    }

    // Handler fallback: keydown (funciona no simulador e em alguns modelos)
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.keyCode === KEYS.BACK) { e.preventDefault(); goBack() }
      if (e.keyCode === KEYS.EXIT) { e.preventDefault(); exitApp() }

      // Diálogo de saída aberto — navega entre Sair / Cancelar
      if (showExitRef.current) {
        if (e.keyCode === 37 || e.keyCode === 39) {
          e.preventDefault()
          setExitFocus(f => f === 'yes' ? 'no' : 'yes')
        }
        if (e.keyCode === 13) {
          e.preventDefault()
          if (exitFocusRef.current === 'yes') exitApp()
          else setShowExit(false)
        }
      }
    }

    document.addEventListener('tizenhwkey', onHwKey)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('tizenhwkey', onHwKey)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [goBack])

  // Salva screen ao ir para background
  useEffect(() => {
    const onVisibility = () => {
      if (document.hidden) {
        try { sessionStorage.setItem('ziiiTV_screen', screen) } catch {}
      }
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [screen])

  return (
    <>
      {screen === 'settings' && <SettingsScreen onDone={() => navigate('home')} />}
      {screen === 'home'     && <HomeScreen onPlay={(ch) => navigate('player', ch)} onSettings={() => navigate('settings')} />}
      {screen === 'player'   && <PlayerScreen onBack={() => { backStack.pop(); setScreen('home') }} />}

      {/* Diálogo obrigatório de saída — padrão Samsung */}
      {showExit && (
        <div style={exitOverlayStyle}>
          <div style={exitBoxStyle}>
            <p style={exitTitleStyle}>Sair do ziiiTV?</p>
            <div style={{ display:'flex', gap: 24, marginTop: 32 }}>
              <button style={{ ...exitBtnStyle, ...(exitFocus==='yes' ? exitBtnFocusStyle : {}) }}>Sair</button>
              <button style={{ ...exitBtnStyle, ...(exitFocus==='no'  ? exitBtnFocusStyle : {}) }}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

const exitOverlayStyle: React.CSSProperties = {
  position:'fixed', inset:0, background:'rgba(0,0,0,0.85)',
  display:'flex', alignItems:'center', justifyContent:'center', zIndex:9999
}
const exitBoxStyle: React.CSSProperties = {
  background:'#1a1a1a', borderRadius:20, padding:'48px 64px',
  textAlign:'center', border:'1px solid rgba(255,255,255,0.1)'
}
const exitTitleStyle: React.CSSProperties = {
  fontSize:36, fontWeight:700, color:'#fff', fontFamily:'Outfit,sans-serif'
}
const exitBtnStyle: React.CSSProperties = {
  fontSize:28, fontWeight:600, padding:'16px 48px', borderRadius:12,
  background:'#2a2a2a', color:'#fff', border:'2px solid transparent',
  fontFamily:'Outfit,sans-serif', cursor:'pointer', transition:'all 150ms ease'
}
const exitBtnFocusStyle: React.CSSProperties = {
  borderColor:'#e91e8c', background:'#3a1a2a',
  boxShadow:'0 0 24px rgba(233,30,140,0.5)', transform:'scale(1.05)'
}

export default App
