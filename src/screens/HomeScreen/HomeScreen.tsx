import { useEffect, useRef, useState } from 'react'
import { useChannelsStore } from '../../store/channelsStore'

export default function HomeScreen() {
  const groups = useChannelsStore(s => s.groups)
  const cats = Object.keys(groups)

  const [catIdx, setCatIdx] = useState(0)
  const [chIdx, setChIdx] = useState(0)

  const catIdxRef  = useRef(catIdx)
  const chIdxRef   = useRef(chIdx)
  const groupsRef  = useRef(groups)
  catIdxRef.current  = catIdx
  chIdxRef.current   = chIdx
  groupsRef.current  = groups

  const lastKey = useRef(0)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const now = Date.now()
      if (now - lastKey.current < 200) return
      lastKey.current = now

      const ci  = catIdxRef.current
      const chi = chIdxRef.current
      const g   = groupsRef.current
      const chs = Object.values(g)[ci] || []

      if (e.keyCode === 38) { // UP
        setCatIdx(Math.max(ci - 1, 0))
        setChIdx(0)
      } else if (e.keyCode === 40) { // DOWN
        setCatIdx(Math.min(ci + 1, Object.keys(g).length - 1))
        setChIdx(0)
      } else if (e.keyCode === 37) { // LEFT
        setChIdx(Math.max(chi - 1, 0))
      } else if (e.keyCode === 39) { // RIGHT
        setChIdx(Math.min(chi + 1, chs.length - 1))
      } else if (e.keyCode === 13) { // ENTER
        console.log('Canal selecionado:', chs[chi])
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div>
      {cats.map((cat, ci) => (
        <div key={cat}>
          <strong>{cat}{ci === catIdx ? ' [FOCADO]' : ''}</strong>
          <div style={{ display: 'flex', gap: 8 }}>
            {(groups[cat] || []).map((ch, chi) => (
              <div key={ch.url}>
                {ch.name}
                {ci === catIdx && chi === chIdx ? ' [FOCADO]' : ''}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
