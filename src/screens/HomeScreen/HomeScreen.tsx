import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useChannelsStore } from '../../store/channelsStore'
import type { Channel } from '../../app/App'
import styles from './HomeScreen.module.css'

interface Props {
  onPlay: (ch: Channel) => void
  onSettings?: () => void
}

// Conveyor belt: o card fica fixo, a lista desliza
// O primeiro card focado sempre começa em x=RAIL_START
const CARD_W   = 220
const CARD_GAP = 16
const RAIL_START = 48        // distância da borda esquerda até o 1º card visível
const STEP = CARD_W + CARD_GAP // 236px por card

// Throttle: impede que segurar ← → pule muitos cards de uma vez
const KEY_REPEAT_MS = 130    // ms mínimo entre cada movimento de foco

const HomeScreen: React.FC<Props> = ({ onPlay }) => {
  const groups           = useChannelsStore(s => s.groups)
  const setCurrentChannel = useChannelsStore(s => s.setCurrentChannel)
  const cats             = Object.keys(groups)

  const [catIdx, setCatIdx] = useState(0)
  const [chIdx,  setChIdx]  = useState(0)

  const rowMemory      = useRef<Record<number, number>>({})
  const rowElemRefs    = useRef<Record<number, HTMLDivElement | null>>({})
  const rowsContainerRef = useRef<HTMLDivElement | null>(null)
  const lastKeyTime    = useRef(0)   // throttle

  const currentCat = cats[catIdx] || ''
  const channels   = (groups[currentCat] || []).slice(0, 80)

  // Scroll vertical da row ativa para view
  const scrollToRow = useCallback((ci: number) => {
    rowElemRefs.current[ci]?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [])

  useEffect(() => { scrollToRow(catIdx) }, [catIdx, scrollToRow])

  const onKey = useCallback((e: KeyboardEvent) => {
    const k    = e.keyCode
    const isNav = k === 37 || k === 38 || k === 39 || k === 40
    if (!isNav && k !== 13) return

    // Throttle — ignora repetições muito rápidas
    const now = performance.now()
    if (now - lastKeyTime.current < KEY_REPEAT_MS) return
    lastKeyTime.current = now

    e.preventDefault()
    const chs = (groups[cats[catIdx]] || []).slice(0, 80)

    if (k === 40) {                                   // DOWN
      const next = Math.min(catIdx + 1, cats.length - 1)
      rowMemory.current[catIdx] = chIdx
      setCatIdx(next)
      setChIdx(rowMemory.current[next] ?? 0)
    } else if (k === 38) {                            // UP
      const next = Math.max(catIdx - 1, 0)
      rowMemory.current[catIdx] = chIdx
      setCatIdx(next)
      setChIdx(rowMemory.current[next] ?? 0)
    } else if (k === 39) {                            // RIGHT
      const next = Math.min(chIdx + 1, chs.length - 1)
      rowMemory.current[catIdx] = next
      setChIdx(next)
    } else if (k === 37) {                            // LEFT
      const next = Math.max(chIdx - 1, 0)
      rowMemory.current[catIdx] = next
      setChIdx(next)
    } else if (k === 13 && chs[chIdx]) {              // OK / Enter
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
          const chs        = (groups[cat] || []).slice(0, 80)
          const isActiveRow = ci === catIdx
          // translateX que mantém o card focado sempre na posição RAIL_START
          const offset     = isActiveRow ? chIdx * STEP : 0

          return (
            <div
              key={cat}
              className={`${styles.row} ${isActiveRow ? styles.rowActive : ''}`}
              ref={el => { rowElemRefs.current[ci] = el }}
            >
              <h2 className={`${styles.rowTitle} ${isActiveRow ? styles.rowTitleActive : ''}`}>{cat}</h2>

              {/* Janela com overflow hidden — só isso garante o conveyor */}
              <div className={styles.cardsWindow}>
                <div
                  className={styles.cards}
                  style={{ transform: `translateX(-${offset}px)` }}
                >
                  {chs.map((ch, idx) => {
                    const focused  = isActiveRow && idx === chIdx
                    const neighbor = isActiveRow && !focused
                    return (
                      <div
                        key={ch.url}
                        className={
                          `${styles.card}` +
                          (focused  ? ` ${styles.cardFocused}`  : '') +
                          (neighbor ? ` ${styles.cardNeighbor}` : '')
                        }
                        onClick={() => { setCurrentChannel(ch); onPlay(ch) }}
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
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default HomeScreen
