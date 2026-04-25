import { useEffect, useRef, useState } from 'react'
import { useChannelsStore } from './store/channelsStore'
import DebugOverlay from './components/DebugOverlay'
// SHOW_DEBUG is now controlled by state within App
import PlayerScreen from './screens/PlayerScreen/PlayerScreen'
import SplashScreen from './screens/SplashScreen/SplashScreen'
import ProfileScreen from './screens/ProfileScreen/ProfileScreen'
import HomeScreen from './screens/HomeScreen/HomeScreen'
import TransitionOverlay from './components/TransitionOverlay'
import FullscreenOverlay from './components/FullscreenOverlay'
import { keyboardMaestro } from './services/keyboardManager'
import { expandManager } from './services/expandManager'
import { AuthService } from './services/authService'
import { Logger } from './services/LoggerService'

const TEST_M3U_URL = 'http://cdc55.cc/get.php?username=0357028521&password=82740&type=m3u_plus&output=ts'

type AppScreen = 'splash' | 'profiles' | 'home'

const SCREEN_KEY = 'ziiiTV_appScreen'

export default function App() {
  const normalizedGroups = useChannelsStore(s => s.normalizedGroups)
  const loadFromUrl      = useChannelsStore(s => s.loadFromUrl)
  const currentChannel   = useChannelsStore(s => s.currentChannel)
  const setCurrentChannel = useChannelsStore(s => s.setCurrentChannel)

  // Força SplashScreen -> ProfileScreen -> HomeScreen em toda inicialização
  const [appScreen, setAppScreen] = useState<AppScreen>('splash')
  const [showDebug, setShowDebug] = useState(true) // Ativo por padrão para debugar na TV

  useEffect(() => {
    keyboardMaestro.init()
    return () => keyboardMaestro.destroy()
  }, [])

  useEffect(() => {
    const view = currentChannel ? 'player' : appScreen === 'profiles' ? 'profiles' : 'main'
    keyboardMaestro.setActiveView(view)
  }, [appScreen, currentChannel])

  // ─── Teclas Globais e BACK Handling ────────────────────────────────────────
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      // 403 = Botão Vermelho (Red) na TV Samsung
      if (e.keyCode === 403 || e.key === 'r') {
        setShowDebug(prev => !prev)
      }

      // Interceptação global do BACK para Collapse de tela
      const isBack = e.keyCode === 10009 || e.keyCode === 8 || e.key === 'Backspace'
      if (isBack) {
        if (expandManager.isExpanded()) {
          // Impede a ação padrão de back (como sair do app ou fechar algo) e recolhe pra card
          e.preventDefault()
          e.stopPropagation()
          expandManager.triggerCollapse()
          // Limpa o channel atual para se certificar de tirar o "PlayerMode"
          setCurrentChannel(null)
        }
      }
    }
    keyboardMaestro.subscribe('global:app', handleKey)
    return () => keyboardMaestro.unsubscribe('global:app')
  }, [])

  // ref para o player Shaka ativo (preenchido pelo PlayerScreen via callback)
  const shakaRef = useRef<any>(null)

  // ─── Boot: inicia playlist em background durante splash ───────────────────
  useEffect(() => {
    const tStart = performance.now()
    const lastUrl = localStorage.getItem('ziiiTV_lastUrl') || TEST_M3U_URL
    
    // BOOT PROGRESSIVO: Dispara Auth e Playlist em paralelo
    Promise.all([
      AuthService.checkUserAuth(),
      loadFromUrl(lastUrl)
    ]).then(() => {
      const elapsed = performance.now() - tStart
      Logger.boot('SYSTEM_READY', `Sistema pronto para interação em ${elapsed.toFixed(0)}ms`)
    })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // TMDB warmup agora é disparado dentro do store (loadFromUrl) após status 'ready'
  // Removido daqui para evitar duplo-processamento

  // ─── Samsung: pause/resume ao sair/voltar para o app ─────────────────────
  useEffect(() => {
    const handleVisibility = () => {
      const avplay = (window as any).webapis?.avplay

      if (document.visibilityState === 'hidden') {
        // AVPlay (streams TS)
        try { avplay?.pause() } catch (_) {}
        // Shaka (streams HLS/DASH)
        try {
          if (shakaRef.current) {
            const video = shakaRef.current.getMediaElement?.() as HTMLVideoElement | null
            if (video && !video.paused) video.pause()
          }
        } catch (_) {}

      } else if (document.visibilityState === 'visible') {
        // AVPlay
        try { avplay?.play() } catch (_) {}
        // Shaka
        try {
          if (shakaRef.current) {
            const video = shakaRef.current.getMediaElement?.() as HTMLVideoElement | null
            if (video && video.paused) video.play().catch(() => {})
          }
        } catch (_) {}
      }
    }

    document.addEventListener('visibilitychange', handleVisibility)
    return () => document.removeEventListener('visibilitychange', handleVisibility)
  }, [])

  // ─── Persistir tela ativa para restore ─────────────────────────────────────
  useEffect(() => {
    try { localStorage.setItem(SCREEN_KEY, appScreen) } catch(_) {}
  }, [appScreen])


  // ─── Roteamento: App Container Rígido (1920x1080) ─────────────────────────
  return (
    <div className="app-root" style={{ position: 'relative', width: 1920, height: 1080, overflow: 'hidden' }}>
      
      {currentChannel ? (
        <>
          <TransitionOverlay />
          {showDebug && <DebugOverlay />}
          <PlayerScreen
            channel={currentChannel}
            onShakaReady={(player) => { shakaRef.current = player }}
            onBack={() => {
              if (expandManager.isSeamlessActive() && expandManager.getChannel()?.id === currentChannel.id) {
                 expandManager.triggerCollapse()
                 setCurrentChannel(null)
                 return
              }
              if (shakaRef.current) {
                try { shakaRef.current.destroy() } catch(_) {}
              }
              try {
                const av = (window as any).webapis?.avplay
                if (av) av.stop()
              } catch(_) {}
              shakaRef.current = null
              setCurrentChannel(null)
              document.body.focus()
            }}
          />
        </>
      ) : appScreen === 'splash' ? (
        <>
          {showDebug && <DebugOverlay />}
          <SplashScreen onDone={() => setAppScreen('profiles')} />
        </>
      ) : appScreen === 'profiles' ? (
        <>
          <TransitionOverlay />
          {showDebug && <DebugOverlay />}
          <ProfileScreen onSelect={() => setAppScreen('home')} />
        </>
      ) : (
        <>
          <FullscreenOverlay onEnterPlayerMode={(ch) => setCurrentChannel(ch)} />
          <TransitionOverlay />
          {showDebug && <DebugOverlay />}
          <HomeScreen
            groups={normalizedGroups}
            onPlay={(ch) => setCurrentChannel(ch)}
            onBack={() => {
              const tizen = (window as any).tizen
              if (tizen?.application) {
                tizen.application.getCurrentApplication().exit()
              }
            }}
          />
        </>
      )}

    </div>
  )
}
