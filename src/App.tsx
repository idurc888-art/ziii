import { useEffect, useRef, useState } from 'react'
import { useChannelsStore } from './store/channelsStore'

type Screen = 'home' | 'player' | 'settings'

export default function App() {
  const loadMock = useChannelsStore(s => s.loadMock)
  const [screen, setScreen] = useState<Screen>('home')
  const screenRef = useRef(screen)
  screenRef.current = screen

  useEffect(() => { loadMock() }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.keyCode === 10009 || e.keyCode === 8) {
        if (screenRef.current !== 'home') setScreen('home')
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  return <div>{screen}</div>
}
