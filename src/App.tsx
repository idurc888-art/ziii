import { useEffect, useState } from 'react'
import { useChannelsStore } from './store/channelsStore'
import DebugOverlay from './components/DebugOverlay'
const SHOW_DEBUG = false
import PlayerScreen from './screens/PlayerScreen/PlayerScreen'
import SplashScreen from './screens/SplashScreen/SplashScreen'
import ProfileScreen from './screens/ProfileScreen/ProfileScreen'
import HomeScreen from './screens/HomeScreen/HomeScreen'

const TEST_M3U_URL = 'http://cdc55.cc/get.php?username=0357028521&password=82740&type=m3u_plus&output=ts'

type AppScreen = 'splash' | 'profiles' | 'home'

export default function App() {
  const normalizedGroups = useChannelsStore(s => s.normalizedGroups)
  const loadFromUrl = useChannelsStore(s => s.loadFromUrl)
  const currentChannel = useChannelsStore(s => s.currentChannel)
  const setCurrentChannel = useChannelsStore(s => s.setCurrentChannel)

  const [appScreen, setAppScreen] = useState<AppScreen>('splash')

  // ─── Boot: inicia playlist em background durante splash ───────────────────
  useEffect(() => {
    const lastUrl = localStorage.getItem('ziiiTV_lastUrl') || TEST_M3U_URL
    loadFromUrl(lastUrl)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Roteamento: PlayerScreen ──────────────────────────────────────────────
  if (currentChannel) {
    return (
      <>
        {SHOW_DEBUG && <DebugOverlay />}
        <PlayerScreen
          channel={currentChannel}
          onBack={() => {
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
