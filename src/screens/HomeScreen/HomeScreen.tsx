import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useChannelsStore } from '../../store/channelsStore'
import type { Channel } from '../../app/App'
import styles from './HomeScreen.module.css'

interface Props {
  onPlay: (ch: Channel) => void
  onSettings?: () => void
}

// REGRA 1 — Mapa COMPLETO de keyCodes Samsung Tizen
const KEYS = {
  UP:         38,
  DOWN:       40,
  LEFT:       37,
  RIGHT:      39,
  ENTER:      13,
  BACK:       10009,
  EXIT:       10182,
  PLAY:       415,
  PAUSE:      19,
  PLAY_PAUSE: 10252,
  FF:         417,
  RW:         412,
  STOP:       413,
  CH_UP:      427,
  CH_DOWN:    428,
  RED:        403,
  GREEN:      404,
  YELLOW:     405,
  BLUE:       406,
}

// Conveyor belt
const CARD_W    = 220
const CARD_GAP  = 16
const RAIL_START = 48
const STEP = CARD_W + CARD_GAP  // 236px

const HomeScreen: React.FC<Props> = ({ onPlay, onSettings }) => {
  const groups            = useChannelsStore(s => s.groups)
  const setCurrentChannel = useChannelsStore(s => s.setCurrentChannel)
  const cats              = Object.keys(groups)

  const [catIdx, setCatIdx] = useState(0)
  const [chIdx,  setChIdx]  = useState(0)

  // REGRA 2 — foco nunca some: pressed state para feedback tátil
  const [pressed, setPressed] = useState(false)

  const rowMemory   = useRef<Record<number, number>>({})
  const rowElemRefs = useRef<Record<number, HTMLDivElement | null>>({})

  const currentCat = cats[catIdx] || ''
  const channels   = (groups[currentCat] || []).slice(0, 80)

  // Scroll vertical da row ativa
  const scrollToRow = useCallback((ci: number) => {
    rowElemRefs.current[ci]?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [])

  useEffect(() => { scrollToRow(catIdx) }, [catIdx, scrollToRow])

  const onKey = useCallback((e: KeyboardEvent) => {
    const k = e.keyCode

    // BACK e EXIT são gerenciados pelo App.tsx
    if (k === KEYS.BACK || k === KEYS.EXIT) return

    // Só navegação e enter
    if (![KEYS.UP, KEYS.DOWN, KEYS.LEFT, KEYS.RIGHT, KEYS.ENTER,
           KEYS.CH_UP, KEYS.CH_DOWN].includes(k)) return

    e.preventDefault()

    const chs = (groups[cats[catIdx]] || []).slice(0, 80)

    if (k === KEYS.DOWN || k === KEYS.CH_DOWN) {
      const next = Math.min(catIdx + 1, cats.length - 1)
      rowMemory.current[catIdx] = chIdx
      setCatIdx(next)
      setChIdx(rowMemory.current[next] ?? 0)

    } else if (k === KEYS.UP || k === KEYS.CH_UP) {
      const next = Math.max(catIdx - 1, 0)
      rowMemory.current[catIdx] = chIdx
      setCatIdx(next)
      setChIdx(rowMemory.current[next] ?? 0)

    } else if (k === KEYS.RIGHT) {
      setChIdx(prev => Math.min(prev + 1, chs.length - 1))

    } else if (k === KEYS.LEFT) {
      setChIdx(prev => Math.max(prev - 1, 0))

    } else if (k === KEYS.ENTER && chs[chIdx]) {
      setPressed(true)
      setTimeout(() => {
        setPressed(false)
        setCurrentChannel(chs[chIdx])
        onPlay(chs[chIdx])
      }, 80)
    }
  }, [catIdx, chIdx, cats, groups, onPlay, setCurrentChannel])

  useEffect(() => {
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onKey])

  if (cats.length === 0) return (
    <div className={styles.root}>
      <div className={styles.empty}>
        <span>Carregando canais...</span>
      </div>
    </div>
  )

  return (
    <div className={styles.root}>
      {/* Hero */}
      <div className={styles.hero}>
        <span className={styles.logo}>ziii<span className={styles.logoAccent}>TV</span></span>
        <span className={styles.heroSub}>{channels.length} canais · {cats.length} categorias</span>
        {onSettings && (
          <button className={styles.settingsBtn} onClick={onSettings}>⚙️</button>
        )}
      </div>

      {/* Rows */}
      <div className={styles.rows}>
        {cats.map((cat, ci) => {
          const chs         = (groups[cat] || []).slice(0, 80)
          const isActiveRow = ci === catIdx
          // translateX conveyor belt
          const offset = isActiveRow ? chIdx * STEP : 0

          return (
            <div
              key={cat}
              className={`${styles.row} ${isActiveRow ? styles.rowActive : ''}`}
              ref={el => { rowElemRefs.current[ci] = el }}
            >
              <h2 className={`${styles.rowTitle} ${isActiveRow ? styles.rowTitleActive : ''}`}>
                {cat}
                {isActiveRow && (
                  <span className={styles.rowCounter}>{chIdx + 1} / {chs.length}</span>
                )}
              </h2>

              {/* Janela do conveyor belt */}
              <div className={styles.cardsWindow}>
                <div
                  className={styles.cards}
                  style={{ transform: `translateX(-${offset}px)` }}
                >
                  {chs.map((ch, idx) => {
                    const focused  = isActiveRow && idx === chIdx
                    const neighbor = isActiveRow && !focused
                    // Top 10: só mostra para os primeiros 10 canais
                    const rankNum  = idx < 10 ? idx + 1 : null

                    return (
                      // REGRA 5 — wrapper relativo para o número ficar externo ao card
                      <div key={ch.url} className={styles.cardWrapper}>
                        {/* Número Top10 — FORA do card, à esquerda, superposto */}
                        {rankNum !== null && (
                          <span className={
                            `${styles.rankNum}` +
                            (focused ? ` ${styles.rankNumFocused}` : '')
                          }>
                            {rankNum}
                          </span>
                        )}

                        <div
                          className={
                            `${styles.card}` +
                            (focused  ? ` ${styles.cardFocused}`  : '') +
                            (focused && pressed ? ` ${styles.cardPressed}` : '') +
                            (neighbor ? ` ${styles.cardNeighbor}` : '')
                          }
                          onClick={() => {
                            setCurrentChannel(ch)
                            onPlay(ch)
                          }}
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
