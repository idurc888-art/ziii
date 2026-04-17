import { useEffect, useRef, useState } from 'react'
import { useChannelsStore } from './store/channelsStore'
import DebugOverlay from './components/DebugOverlay'
const SHOW_DEBUG = false
import PlayerScreen from './screens/PlayerScreen/PlayerScreen'
import SplashScreen from './screens/SplashScreen/SplashScreen'
import ProfileScreen from './screens/ProfileScreen/ProfileScreen'
import HomeScreen from './screens/HomeScreen/HomeScreen'
import { ContentCatalog } from './services/contentCatalog'

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

  // ref para o player Shaka ativo (preenchido pelo PlayerScreen via callback)
  const shakaRef = useRef<any>(null)

  // ─── Boot: inicia playlist em background durante splash ───────────────────
  useEffect(() => {
    const lastUrl = localStorage.getItem('ziiiTV_lastUrl') || TEST_M3U_URL
    loadFromUrl(lastUrl)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Inicializar Catálogo Enterprise ────────────────────────────────────────
  useEffect(() => {
    if (Object.keys(normalizedGroups).length > 0) {
      ContentCatalog.init(normalizedGroups)
      ContentCatalog.warmup()
    }
  }, [normalizedGroups])

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


  // ─── Roteamento: PlayerScreen ──────────────────────────────────────────────
  if (currentChannel) {
    return (
      <>
        {SHOW_DEBUG && <DebugOverlay />}
        <PlayerScreen
          channel={currentChannel}
          onShakaReady={(player) => { shakaRef.current = player }}
          onBack={() => {
            shakaRef.current = null
            setCurrentChannel(null)
            document.body.focus()
          }}
        />
      </>
    )
  }

  // ─── Roteamento: Splash ───────────────────────────────────────────────────
  if (appScreen === 'splash') {
    return (
      <>
        {SHOW_DEBUG && <DebugOverlay />}
        <SplashScreen onDone={() => setAppScreen('profiles')} />
      </>
    )
  }

  // ─── Roteamento: Profiles ─────────────────────────────────────────────────
  if (appScreen === 'profiles') {
    return (
      <>
        {SHOW_DEBUG && <DebugOverlay />}
        <ProfileScreen onSelect={() => setAppScreen('home')} />
      </>
    )
  }

  // ─── Roteamento: Home ─────────────────────────────────────────────────────
  return (
    <>
      {SHOW_DEBUG && <DebugOverlay />}
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
  )
}
