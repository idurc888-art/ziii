import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useChannelsStore } from '../../store/channelsStore'
import type { Channel } from '../../app/App'
import styles from './HomeScreen.module.css'

interface Props {
  onPlay: (ch: Channel) => void
  onSettings?: () => void
}

const CARD_W = 220
const CARD_GAP = 16
const ROW_PADDING = 48

const HomeScreen: React.FC<Props> = ({ onPlay }) => {
  const groups = useChannelsStore(s => s.groups)
  const setCurrentChannel = useChannelsStore(s => s.setCurrentChannel)
  const cats = Object.keys(groups)

  const [catIdx, setCatIdx] = useState(0)
  const [chIdx, setChIdx] = useState(0)
  const rowMemory = useRef<Record<number, number>>({})
  const rowRefs = useRef<Record<number, HTMLDivElement | null>>({})
  const rowsContainerRef = useRef<HTMLDivElement | null>(null)
  const rowElemRefs = useRef<Record<number, HTMLDivElement | null>>({})

  const currentCat = cats[catIdx] || ''
  const channels = groups[currentCat] || []

  // Scroll horizontal suave para o card ativo
  const scrollToCard = useCallback((ci: number, idx: number) => {
    const row = rowRefs.current[ci]
    if (!row) return
    const offset = idx * (CARD_W + CARD_GAP) - ROW_PADDING
    row.scrollTo({ left: Math.max(0, offset), behavior: 'smooth' })
  }, [])

  // Scroll vertical suave para a row ativa
  const scrollToRow = useCallback((ci: number) => {
    const rowElem = rowElemRefs.current[ci]
    if (rowElem) {
      rowElem.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }, [])

  useEffect(() => {
    scrollToCard(catIdx, chIdx)
    scrollToRow(catIdx)
  }, [catIdx, chIdx, scrollToCard, scrollToRow])

  const onKey = useCallback((e: KeyboardEvent) => {
    const chs = groups[cats[catIdx]] || []
    if (e.key === 'ArrowDown' || e.keyCode === 40) {
      e.preventDefault()
      const next = Math.min(catIdx + 1, cats.length - 1)
      rowMemory.current[catIdx] = chIdx
      const nextCh = rowMemory.current[next] ?? 0
      setCatIdx(next)
      setChIdx(nextCh)
    } else if (e.key === 'ArrowUp' || e.keyCode === 38) {
      e.preventDefault()
      const next = Math.max(catIdx - 1, 0)
      rowMemory.current[catIdx] = chIdx
      const nextCh = rowMemory.current[next] ?? 0
      setCatIdx(next)
      setChIdx(nextCh)
    } else if (e.key === 'ArrowRight' || e.keyCode === 39) {
      e.preventDefault()
      const next = Math.min(chIdx + 1, chs.length - 1)
      rowMemory.current[catIdx] = next
      setChIdx(next)
    } else if (e.key === 'ArrowLeft' || e.keyCode === 37) {
      e.preventDefault()
      const next = Math.max(chIdx - 1, 0)
      rowMemory.current[catIdx] = next
      setChIdx(next)
    } else if ((e.key === 'Enter' || e.keyCode === 13) && chs[chIdx]) {
      setCurrentChannel(chs[chIdx])
      onPlay(chs[chIdx])
    }
  }, [catIdx, chIdx, cats, groups, onPlay, setCurrentChannel])

  useEffect(() => {
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onKey])

  if (cats.length === 0) return (
    <div className={styles.root}>
      <div className={styles.empty}>Carregando canais...</div>
    </div>
  )

  return (
    <div className={styles.root}>
      <div className={styles.hero}>
        <span className={styles.logo}>ziii<span className={styles.logoAccent}>TV</span></span>
        <span className={styles.heroSub}>{channels.length} canais · {cats.length} categorias</span>
      </div>

      <div className={styles.rows} ref={rowsContainerRef}>
        {cats.map((cat, ci) => {
          const chs = groups[cat] || []
          const isActiveRow = ci === catIdx
          return (
            <div
              key={cat}
              className={`${styles.row} ${isActiveRow ? styles.rowActive : ''}`}
              ref={el => { rowElemRefs.current[ci] = el }}
            >
              <h2 className={`${styles.rowTitle} ${isActiveRow ? styles.rowTitleActive : ''}`}>{cat}</h2>
              <div
                className={styles.cards}
                ref={el => { rowRefs.current[ci] = el }}
              >
                {chs.slice(0, 80).map((ch, idx) => {
                  const focused = isActiveRow && idx === chIdx
                  return (
                    <div
                      key={ch.url}
                      className={`${styles.card} ${focused ? styles.cardFocused : isActiveRow ? styles.cardNeighbor : ''}`}
                    >
                      <div className={styles.cardImg}>
                        {ch.logo
                          ? <img src={ch.logo} alt={ch.name} loading="lazy" />
                          : <div className={styles.cardPlaceholder}>{ch.name[0]}</div>
                        }
                        {focused && <div className={styles.cardGlow} />}
                      </div>
                      <span className={styles.cardName}>{ch.name}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default HomeScreen
