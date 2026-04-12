import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useChannelsStore } from '../../store/channelsStore'
import type { Channel } from '../../app/App'
import styles from './HomeScreen.module.css'

interface Props {
  onPlay: (ch: Channel) => void
  onSettings?: () => void
}

// Mapa completo de keyCodes Samsung Tizen
const KEYS = {
  UP:         38,
  DOWN:       40,
  LEFT:       37,
  RIGHT:      39,
  ENTER:      13,
  BACK:       10009,
  EXIT:       10182,
  CH_UP:      427,
  CH_DOWN:    428,
}

// Conveyor belt
const CARD_W     = 220
const CARD_GAP   = 16
const STEP       = CARD_W + CARD_GAP  // 236px

// Throttle: 200ms — confiável no Tizen (e.repeat NÃO é confiável na TV)
// Segurar o botão: ~5 cards/s — lento o suficiente para controlar
const THROTTLE_MS = 200

const HomeScreen: React.FC<Props> = ({ onPlay, onSettings }) => {
  const groups            = useChannelsStore(s => s.groups)
  const setCurrentChannel = useChannelsStore(s => s.setCurrentChannel)
  const cats              = Object.keys(groups)

  const [catIdx, setCatIdx] = useState(0)
  const [chIdx,  setChIdx]  = useState(0)
  const [pressed, setPressed] = useState(false)

  // PADRÃO TIZEN — useRef para valores de navegação dentro do listener
  // Evita recriar o useCallback (e o listener) a cada tecla pressionada
  const catIdxRef   = useRef(0)
  const chIdxRef    = useRef(0)
  const catsRef     = useRef<string[]>([])
  const groupsRef   = useRef<Record<string, Channel[]>>({})
  const rowMemory   = useRef<Record<number, number>>({})
  const rowElemRefs = useRef<Record<number, HTMLDivElement | null>>({})
  const lastKeyMs   = useRef(0)  // throttle via Date.now() — confiável no Tizen

  // Sincroniza refs com state — sem recriar listener
  useEffect(() => { catIdxRef.current = catIdx }, [catIdx])
  useEffect(() => { chIdxRef.current  = chIdx  }, [chIdx])
  useEffect(() => { catsRef.current   = cats   }, [cats])
  useEffect(() => { groupsRef.current = groups }, [groups])

  // Scroll vertical para a row ativa — INSTANT (smooth trava CPU no Tizen)
  const scrollToRow = useCallback((ci: number) => {
    rowElemRefs.current[ci]?.scrollIntoView({ behavior: 'instant' as ScrollBehavior, block: 'nearest' })
  }, [])

  useEffect(() => { scrollToRow(catIdx) }, [catIdx, scrollToRow])

  // PADRÃO TIZEN — useCallback com [] fixo: listener NUNCA é recriado
  // Todos os valores lidos via ref, não via closure
  const onKey = useCallback((e: KeyboardEvent) => {
    const k = e.keyCode

    // Back/Exit gerenciados pelo App.tsx
    if (k === KEYS.BACK || k === KEYS.EXIT) return

    // Só teclas de navegação
    if (![KEYS.UP, KEYS.DOWN, KEYS.LEFT, KEYS.RIGHT,
          KEYS.ENTER, KEYS.CH_UP, KEYS.CH_DOWN].includes(k)) return

    e.preventDefault()

    // Throttle via Date.now() — e.repeat NÃO funciona no Tizen
    const now = Date.now()
    if (now - lastKeyMs.current < THROTTLE_MS) return
    lastKeyMs.current = now

    const ci   = catIdxRef.current
    const chi  = chIdxRef.current
    const cats = catsRef.current
    const grps = groupsRef.current
    const chs  = (grps[cats[ci]] || []).slice(0, 80)

    if (k === KEYS.DOWN || k === KEYS.CH_DOWN) {
      const next = Math.min(ci + 1, cats.length - 1)
      if (next === ci) return
      rowMemory.current[ci] = chi
      setCatIdx(next)
      setChIdx(rowMemory.current[next] ?? 0)

    } else if (k === KEYS.UP || k === KEYS.CH_UP) {
      const next = Math.max(ci - 1, 0)
      if (next === ci) return
      rowMemory.current[ci] = chi
      setCatIdx(next)
      setChIdx(rowMemory.current[next] ?? 0)

    } else if (k === KEYS.RIGHT) {
      const next = Math.min(chi + 1, chs.length - 1)
      if (next === chi) return
      rowMemory.current[ci] = next
      setChIdx(next)

    } else if (k === KEYS.LEFT) {
      const next = Math.max(chi - 1, 0)
      if (next === chi) return
      rowMemory.current[ci] = next
      setChIdx(next)

    } else if (k === KEYS.ENTER && chs[chi]) {
      setPressed(true)
      setTimeout(() => {
        setPressed(false)
        setCurrentChannel(chs[chi])
        onPlay(chs[chi])
      }, 80)
    }
  }, [])  // [] — nunca recria o listener

  // PADRÃO TIZEN — document em vez de window
  // Tizen coloca foco no document; window pode não receber em alguns modelos
  useEffect(() => {
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onKey])

  // Atualiza setCurrentChannel e onPlay via ref para não recriar onKey
  const onPlayRef           = useRef(onPlay)
  const setCurrentChannelRef = useRef(setCurrentChannel)
  useEffect(() => { onPlayRef.current = onPlay }, [onPlay])
  useEffect(() => { setCurrentChannelRef.current = setCurrentChannel }, [setCurrentChannel])

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
        <span className={styles.heroSub}>{(groups[cats[catIdx]] || []).length} canais · {cats.length} categorias</span>
        {onSettings && (
          <button className={styles.settingsBtn} onClick={onSettings}>⚙️</button>
        )}
      </div>

      {/* Rows */}
      <div className={styles.rows}>
        {cats.map((cat, ci) => {
          const chs         = (groups[cat] || []).slice(0, 80)
          const isActiveRow = ci === catIdx
          const offset      = isActiveRow ? chIdx * STEP : 0

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
                    const rankNum  = idx < 10 ? idx + 1 : null

                    return (
                      <div key={ch.url} className={styles.cardWrapper}>
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
                            (focused ? ` ${styles.cardFocused}` : '') +
                            (focused && pressed ? ` ${styles.cardPressed}` : '')
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
