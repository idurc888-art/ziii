import React, { useState } from 'react'
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

const App: React.FC = () => {
  const [screen, setScreen] = useState<Screen>('settings')
  const setCurrentChannel = useChannelsStore(state => state.setCurrentChannel)

  const navigate = (s: Screen, ch?: Channel) => {
    if (ch) setCurrentChannel(ch)
    setScreen(s)
  }

  return (
    <>
      {screen === 'settings' && <SettingsScreen onDone={() => navigate('home')} />}
      {screen === 'home' && <HomeScreen onPlay={(ch) => navigate('player', ch)} onSettings={() => navigate('settings')} />}
      {screen === 'player' && <PlayerScreen onBack={() => navigate('home')} />}
    </>
  )
}

export default App
