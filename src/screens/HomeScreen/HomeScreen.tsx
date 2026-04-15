import { useEffect, useRef, useState } from 'react'
import { useChannelsStore } from '../../store/channelsStore'
import { type Channel } from '../../types/channel'

const THROTTLE = 100
const WIN = 5 // canais visíveis de cada lado do focado

interface Props {
  onPlay: (ch: Channel) => void
}

export default function HomeScreen({ onPlay }: Props) {
  const groups = useChannelsStore(s => s.groups)
  const cats = Object.keys(groups)

  const [catIdx, setCatIdx] = useState(0)
  const [chIdx, setChIdx] = useState(0)

  const catIdxRef = useRef(catIdx)
  const chIdxRef  = useRef(chIdx)
  const groupsRef = useRef(groups)
  const onPlayRef = useRef(onPlay)
  catIdxRef.current = catIdx
  chIdxRef.current  = chIdx
  groupsRef.current = groups
  onPlayRef.current = onPlay

  const lastKey = useRef(0)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const now = Date.now()
      if (now - lastKey.current < THROTTLE) return
      lastKey.current = now

      const ci  = catIdxRef.current
      const chi = chIdxRef.current
      const g   = groupsRef.current
      const chs = Object.values(g)[ci] || []

      if (e.keyCode === 38) {
        setCatIdx(Math.max(ci - 1, 0))
        setChIdx(0)
      } else if (e.keyCode === 40) {
        setCatIdx(Math.min(ci + 1, Object.keys(g).length - 1))
        setChIdx(0)
      } else if (e.keyCode === 37) {
        setChIdx(Math.max(chi - 1, 0))
      } else if (e.keyCode === 39) {
        setChIdx(Math.min(chi + 1, chs.length - 1))
      } else if (e.keyCode === 13 && chs[chi]) {
        onPlayRef.current(chs[chi])
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div>
      {cats.map((cat, ci) => {
        const chs = groups[cat] || []
        // janela de renderização: só canais visíveis ao redor do focado
        const focused = ci === catIdx
        const start = focused ? Math.max(chIdx - WIN, 0) : 0
        const end   = focused ? Math.min(chIdx + WIN + 1, chs.length) : Math.min(WIN, chs.length)
        const visible = chs.slice(start, end)

        return (
          <div key={cat} style={{ marginBottom: 12 }}>
            <strong style={focused ? { textDecoration: 'underline' } : undefined}>
              {cat} ({chs.length})
            </strong>
            <div style={{ display: 'flex', gap: 8 }}>
              {visible.map((ch, i) => {
                const realIdx = start + i
                const isFocused = focused && realIdx === chIdx
                return (
                  <div
                    key={ch.url}
                    style={isFocused
                      ? { fontWeight: 'bold', background: '#ff69b4', padding: '2px 6px', borderRadius: 4 }
                      : { padding: '2px 6px' }}
                  >
                    {ch.name}
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
