import { useEffect, useRef, useState } from 'react'
import { useChannelsStore } from './store/channelsStore'
import { type Channel } from './types/channel'
import HomeScreen from './screens/HomeScreen/HomeScreen'
import PlayerScreen from './screens/PlayerScreen/PlayerScreen'
import SettingsScreen from './screens/SettingsScreen/SettingsScreen'

type Screen = 'home' | 'player' | 'settings'

export default function App() {
  const loadMock = useChannelsStore(s => s.loadMock)
  const loadFromUrl = useChannelsStore(s => s.loadFromUrl)
  const [screen, setScreen] = useState<Screen>('home')
  const [currentChannel, setCurrentChannel] = useState<Channel | null>(null)

  const screenRef = useRef(screen)
  screenRef.current = screen

  useEffect(() => {
    // temporariamente desabilitado para diagnóstico
    // const saved = localStorage.getItem('ziiiTV-m3u-url')
    // if (saved) loadFromUrl(saved)
    // else loadMock()
    loadMock()
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).tagName === 'INPUT') return
      if (e.keyCode === 10009 || e.keyCode === 8) {
        if (screenRef.current !== 'home') setScreen('home')
      }
      if ((e.keyCode === 83 || e.keyCode === 77 || e.keyCode === 457) && screenRef.current === 'home') {
        setScreen('settings')
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  const handlePlay = (ch: Channel) => {
    setCurrentChannel(ch)
    setScreen('player')
  }

  if (screen === 'player' && currentChannel) return <PlayerScreen channel={currentChannel} onBack={() => { setScreen('home'); document.body.focus() }} />
  if (screen === 'settings') return <SettingsScreen onBack={() => { setScreen('home'); document.body.focus() }} />
  return <HomeScreen onPlay={handlePlay} />
}
