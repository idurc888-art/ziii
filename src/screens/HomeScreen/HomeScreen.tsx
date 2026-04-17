import { useEffect, useRef, useState } from 'react'
import type { UICategory } from '../../services/categoryMapper'
import type { ContentRow, ScreenContent } from '../../services/contentSelector'
import type { TMDBResult } from '../../services/tmdbService'
import { enrichChannel } from '../../services/tmdbService'
import {
  buildHomeContent,
  buildFilmesContent,
  buildSeriesContent,
  buildTvContent
} from '../../services/contentSelector'
import { recordPlay } from '../../services/historyService'
import { useHeroTrailer } from '../../hooks/useHeroTrailer'
import { HeroBanner, mockHeroSlides } from '../../components/HeroBanner'

// ─── Types ──────────────────────────────────────────────────────────────────
interface Channel {
  name: string
  url: string
  logo: string
  group: string
}

interface Props {
  groups: Record<UICategory, Channel[]>
  onPlay: (ch: Channel) => void
  onBack: () => void
}

type FocusZone = 'sidebar' | 'topbar' | 'hero' | 'content'
type HeroState = 'default' | 'focused' | 'collapsed' | 'locked'
type DashboardView = 'home' | 'movies' | 'series' | 'live'

// ─── Constants ──────────────────────────────────────────────────────────────
const ACCENT = '#ff006e'
const GLOW   = 'rgba(255, 0, 110, 0.4)'
const BG     = '#000000'
const TEXT_MUTED = '#a0a0a0'

/** Altura do banner quando visível */
const HERO_H = '87vh'
/** Altura do banner colapsado (mantém espaço mínimo = 0 para dar scroll natural) */
const HERO_H_COLLAPSED = '0px'

const SIDEBAR_ICONS: Array<{ emoji: string; label: string; view?: DashboardView }> = [
  { emoji: '🏠', label: 'home',     view: 'home'   },
  { emoji: '🎬', label: 'filmes',   view: 'movies' },
  { emoji: '⊞',  label: 'séries',  view: 'series' },
  { emoji: '📺', label: 'live',     view: 'live'   },
  { emoji: '📈', label: 'esportes' },
  { emoji: '♡',  label: 'favoritos'},
]

const TOPBAR_LINKS: Array<{ label: string; view: DashboardView }> = [
  { label: 'página principal', view: 'home'   },
  { label: 'filmes',           view: 'movies' },
  { label: 'séries',           view: 'series' },
  { label: 'tv ao vivo',       view: 'live'   },
]

const CATEGORY_ICONS: Record<string, { emoji: string; color: string }> = {
  filmes:        { emoji: '🎬', color: '#a78bfa' },
  series:        { emoji: '📺', color: '#60a5fa' },
  esportes:      { emoji: '⚽', color: '#4ade80' },
  infantil:      { emoji: '🎮', color: '#f472b6' },
  abertos:       { emoji: '📡', color: '#60a5fa' },
  documentarios: { emoji: '🌍', color: '#34d399' },
  noticias:      { emoji: '📰', color: '#94a3b8' },
  outros:        { emoji: '🔥', color: '#ff6b35' },
}

const FOCUS_SCALE    = 1.05
const FOCUS_DURATION = 350
const FOCUS_EASING   = 'cubic-bezier(0.25, 1, 0.5, 1)'
const UNFOCUS_OPACITY = 1
const FOCUS_GLOW     = '0 0 24px rgba(255,0,110,0.6), 0 0 60px rgba(255,0,110,0.25)'
const FOCUS_BORDER   = `4px solid #ff006e`

// ─── State Persistence ──────────────────────────────────────────────────────
const STATE_KEY = 'ziiiTV_homeState'
function saveNavState(data: { focusZone: string; contentRow: number; contentCols: number[]; activeView: string }) {
  try { localStorage.setItem(STATE_KEY, JSON.stringify(data)) } catch (_) {}
}
function loadNavState(): { focusZone?: string; contentRow?: number; contentCols?: number[]; activeView?: string } | null {
  try { const raw = localStorage.getItem(STATE_KEY); return raw ? JSON.parse(raw) : null } catch (_) { return null }
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════
export default function HomeScreen({ groups, onPlay, onBack }: Props) {
  const saved = useRef(loadNavState()).current
  const [focusZone,   setFocusZone]   = useState<FocusZone>((saved?.focusZone as FocusZone) || 'hero')
  const [heroState,   setHeroState]   = useState<HeroState>(saved?.focusZone === 'content' ? 'collapsed' : 'default')
  const [sidebarIdx,  setSidebarIdx]  = useState(0)
  const [topbarIdx,   setTopbarIdx]   = useState(0)
  const [contentRow,  setContentRow]  = useState(saved?.contentRow ?? 0)
  const [contentCols, setContentCols] = useState<number[]>(saved?.contentCols ?? [0,0,0,0,0,0,0,0])
  const [showExit,    setShowExit]    = useState(false)
  const [exitFocus,   setExitFocus]   = useState(0)
  const [activeView,  setActiveView]  = useState<DashboardView>((saved?.activeView as DashboardView) || 'home')
  const [isLoadingContent, setIsLoadingContent] = useState(false)
  const [content, setContent] = useState<ScreenContent | null>(null)

  // ─── Load content ──────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false
    setIsLoadingContent(true)
    const load = async () => {
      let data: ScreenContent
      switch (activeView) {
        case 'movies': data = await buildFilmesContent(groups); break
        case 'series': data = await buildSeriesContent(groups); break
        case 'live':   data = await buildTvContent(groups);     break
        default:       data = await buildHomeContent(groups);   break
      }
      if (!cancelled) {
        setContent(data)
        setIsLoadingContent(false)
        setContentRow(0)
        setContentCols(new Array(data.rows.length).fill(0))
      }
    }
    load()
    return () => { cancelled = true }
  }, [groups, activeView])

  const rows: ContentRow[] = content?.rows || []

  const [liveTmdbData, setLiveTmdbData] = useState<Record<string, TMDBResult | null>>({})
  const [debouncedPreview, setDebouncedPreview] = useState<Channel | null>(null)

  const previewChannel = (focusZone === 'content' && rows[contentRow])
    ? rows[contentRow].channels[contentCols[contentRow]] || null
    : null

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedPreview(previewChannel), 250)
    return () => clearTimeout(timer)
  }, [previewChannel])

  useEffect(() => {
    if (debouncedPreview) {
      const name = debouncedPreview.name
      if (liveTmdbData[name] === undefined && !rows[contentRow]?.tmdb?.has(name)) {
        enrichChannel(name).then(res => setLiveTmdbData(prev => ({ ...prev, [name]: res })))
      }
    }
  }, [debouncedPreview, contentRow, rows, liveTmdbData])

  // ─── Hero Trailer ─────────────────────────────────────────────────────
  const currentHeroItem: TMDBResult | null = mockHeroSlides[0] ? {
    tmdbId: 1,
    title: mockHeroSlides[0].title,
    poster: mockHeroSlides[0].backgroundImage,
    backdrop: mockHeroSlides[0].backgroundImage,
    overview: mockHeroSlides[0].description,
    rating: 8.0, year: '2024', mediaType: 'movie', trailerKey: ''
  } : null

  useHeroTrailer(currentHeroItem, {
    idleDelay: 2500, fadeDuration: 800,
    isHeroVisible: focusZone !== 'content',
    focusZone,
  })

  // ─── Refs ─────────────────────────────────────────────────────────────
  const focusZoneRef   = useRef(focusZone)
  const heroStateRef   = useRef(heroState)
  const sidebarRef     = useRef(sidebarIdx)
  const topbarRef      = useRef(topbarIdx)
  const contentRowRef  = useRef(contentRow)
  const contentColsRef = useRef(contentCols)
  const rowsRef        = useRef(rows)
  const showExitRef    = useRef(showExit)
  const exitFocusRef   = useRef(exitFocus)

  focusZoneRef.current   = focusZone
  heroStateRef.current   = heroState
  sidebarRef.current     = sidebarIdx
  topbarRef.current      = topbarIdx
  contentRowRef.current  = contentRow
  contentColsRef.current = contentCols
  rowsRef.current        = rows
  showExitRef.current    = showExit
  exitFocusRef.current   = exitFocus

  // ─── Scroll: fix jump — mantém alinhamento Netflix-style ──────────────
  //
  // Em vez de colapsar o banner mudando height (que causa o jump),
  // o layout usa position:sticky no topbar e position:relative no wrapper.
  // O banner vai de 87vh → 0 com overflow:hidden + transition,
  // e o viewport NÃO faz scroll — as rows simplesmente sobem para o topo.
  const rowRefs    = useRef<(HTMLDivElement | null)[]>([])
  const rowsWrapRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    // Quando voltamos para hero/topbar, garante que as rows não estejam scrolladas
    if (focusZone !== 'content') return
    const row = rowRefs.current[contentRow]
    if (row && rowsWrapRef.current) {
      // Scroll suave só dentro do wrapper de rows
      const wrapper = rowsWrapRef.current
      const rowTop  = row.offsetTop
      wrapper.scrollTo({ top: rowTop - 16, behavior: 'smooth' })
    }
  }, [contentRow, focusZone])

  // Quando saímos do content, reseta scroll das rows para o topo
  useEffect(() => {
    if (focusZone !== 'content' && rowsWrapRef.current) {
      rowsWrapRef.current.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [focusZone])

  // ─── D-pad Navigation ────────────────────────────────────────────────
  useEffect(() => {
    let lastT = 0
    const onKey = (e: KeyboardEvent) => {
      const now = Date.now()
      if (now - lastT < 120) return
      lastT = now

      if (showExitRef.current) {
        if      (e.key === 'ArrowLeft'  || e.keyCode === 37) { e.preventDefault(); setExitFocus(0) }
        else if (e.key === 'ArrowRight' || e.keyCode === 39) { e.preventDefault(); setExitFocus(1) }
        else if (e.key === 'Enter'      || e.keyCode === 13) {
          e.preventDefault()
          if (exitFocusRef.current === 1) onBack()
          else setShowExit(false)
        }
        else if (e.keyCode === 10009 || e.keyCode === 8 || e.key === 'Backspace') {
          e.preventDefault(); setShowExit(false)
        }
        return
      }

      const zone  = focusZoneRef.current
      const rw    = contentRowRef.current
      const cols  = contentColsRef.current
      const allRows = rowsRef.current

      if (e.keyCode === 10009 || e.keyCode === 8 || e.key === 'Backspace') {
        e.preventDefault()
        if      (zone === 'sidebar' || zone === 'topbar') { setShowExit(true); setExitFocus(0) }
        else if (zone === 'hero')    { setFocusZone('topbar'); setHeroState('default') }
        else if (zone === 'content') { setFocusZone('hero'); setHeroState('focused') }
        return
      }

      if (e.key === 'Enter' || e.keyCode === 13) {
        e.preventDefault()
        if (zone === 'sidebar') {
          const item = SIDEBAR_ICONS[sidebarRef.current]
          if (item?.view) setActiveView(item.view)
          return
        }
        if (zone === 'topbar') {
          const item = TOPBAR_LINKS[topbarRef.current]
          if (item?.view) setActiveView(item.view)
          return
        }
        if (zone === 'content') {
          const row = allRows[rw]
          if (row) {
            if (row.type === 'grid') {
              const cat = row.channels[cols[rw]]
              const viewMap: Record<string, DashboardView> = {
                filmes: 'movies', series: 'series', 'tv ao vivo': 'live',
                abertos: 'live', esportes: 'live'
              }
              setActiveView(viewMap[cat.name.toLowerCase()] || 'home')
            } else {
              const ch = row.channels[cols[rw]]
              if (ch) { recordPlay(ch.name, ch.group); onPlay(ch) }
            }
          }
        }
        return
      }

      const isDown  = e.key === 'ArrowDown'  || e.keyCode === 40
      const isUp    = e.key === 'ArrowUp'    || e.keyCode === 38
      const isRight = e.key === 'ArrowRight' || e.keyCode === 39
      const isLeft  = e.key === 'ArrowLeft'  || e.keyCode === 37

      if (!(isDown || isUp || isRight || isLeft)) return
      e.preventDefault()

      if (zone === 'sidebar') {
        if      (isDown)  setSidebarIdx(i => Math.min(i + 1, SIDEBAR_ICONS.length - 1))
        else if (isUp)    setSidebarIdx(i => Math.max(i - 1, 0))
        else if (isRight) setFocusZone('topbar')
        return
      }

      if (zone === 'topbar') {
        if      (isRight) setTopbarIdx(i => Math.min(i + 1, TOPBAR_LINKS.length - 1))
        else if (isLeft)  setTopbarIdx(i => Math.max(i - 1, 0))
        else if (isDown)  { setFocusZone('hero'); setHeroState('focused') }
        return
      }

      if (zone === 'hero') {
        if      (isUp)   { setFocusZone('topbar'); setHeroState('default') }
        else if (isDown) { setFocusZone('content'); setHeroState('collapsed'); setContentRow(0) }
        return
      }

      if (zone === 'content') {
        if      (isDown)  { if (rw < allRows.length - 1) setContentRow(rw + 1) }
        else if (isUp)    {
          if (rw === 0) { setFocusZone('hero'); setHeroState('focused') }
          else setContentRow(rw - 1)
        }
        else if (isRight) {
          const maxCol = (allRows[rw]?.channels.length || 1) - 1
          if (cols[rw] < maxCol) { const next = [...cols]; next[rw]++; setContentCols(next) }
        }
        else if (isLeft) {
          if (cols[rw] > 0) { const next = [...cols]; next[rw]--; setContentCols(next) }
        }
        return
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Persist ─────────────────────────────────────────────────────────
  useEffect(() => {
    saveNavState({ focusZone, contentRow, contentCols, activeView })
  }, [focusZone, contentRow, contentCols, activeView])

  // Helpers de estilo
  const isHeroVisible = focusZone !== 'content'
  const topbarItemGlow = (active: boolean) => active
    ? {
        boxShadow: '0 0 0 2px #ff006e, 0 0 18px rgba(255,0,110,0.55), 0 0 40px rgba(255,0,110,0.2)',
        background: 'rgba(255,0,110,0.14)',
      }
    : {}

  // ═══════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: BG, color: '#fff',
      fontFamily: "'Outfit', sans-serif",
      overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
    }}>

      {/* ── TOPBAR (sticky ao topo, nunca sai da tela) ─────────────────── */}
      <div style={{
        flexShrink: 0,
        position: 'relative', zIndex: 90,
        height: 72, display: 'flex', alignItems: 'center', padding: '0 80px',
        background: isHeroVisible
          ? 'linear-gradient(to bottom, rgba(0,0,0,0.85), rgba(0,0,0,0.4), transparent)'
          : 'rgba(0,0,0,0.92)',
        transition: 'background 400ms ease',
      }}>
        <div style={{
          fontSize: 18, fontWeight: 900, letterSpacing: 1,
          textTransform: 'lowercase', marginRight: 40,
        }}>
          o melhor · <span style={{ color: ACCENT }}>ziiiTV!</span>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {TOPBAR_LINKS.map((link, i) => {
            const active        = focusZone === 'topbar' && topbarIdx === i
            const isCurrentView = activeView === link.view
            return (
              <div key={i} style={{
                fontSize: 18, fontWeight: 700, textTransform: 'lowercase',
                color: active ? '#fff' : (isCurrentView ? ACCENT : 'rgba(255,255,255,0.35)'),
                padding: '6px 14px', borderRadius: 20,
                transition: 'all 220ms',
                whiteSpace: 'nowrap',
                borderBottom: isCurrentView && !active ? `2px solid ${ACCENT}` : '2px solid transparent',
                // ★ glow blur pink quando item do topbar está selecionado
                ...topbarItemGlow(active),
              }}>
                {link.label}
              </div>
            )
          })}
        </div>
      </div>

      {/* ── CONTEÚDO SCROLLÁVEL (banner + rows num único flex-column) ─── */}
      {/*
          FIX SCROLL JUMP:
          O banner tem height que transiciona de 87vh → 0px.
          As rows ficam num wrapper com overflow:auto separado.
          Assim quando o banner colapsa, as rows não "saltam" —
          elas simplesmente ficam visíveis desde o topo.
      */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative',
      }}>

        {/* BANNER — colapsa suavemente sem afetar o scroll das rows */}
        <div style={{
          flexShrink: 0,
          width: '100%',
          height: isHeroVisible ? HERO_H : HERO_H_COLLAPSED,
          minHeight: isHeroVisible ? HERO_H : HERO_H_COLLAPSED,
          overflow: 'hidden',
          transition: 'height 520ms cubic-bezier(0.25,1,0.5,1), min-height 520ms cubic-bezier(0.25,1,0.5,1)',
        }}>
          <HeroBanner
            slides={mockHeroSlides}
            autoPlayInterval={0}
            focused={focusZone === 'hero'}
            onSelect={(slide) => {
              if (slide.type === 'live') {
                const channel = Object.values(groups).flat().find(ch =>
                  ch.name.includes(slide.title) || slide.title.includes(ch.name)
                )
                if (channel) onPlay(channel)
              }
            }}
            onAddToList={(_slide) => {}}
          />
        </div>

        {/* ROWS — scroll próprio, alinhadas sempre ao topo */}
        <div
          ref={rowsWrapRef}
          style={{
            flex: 1,
            overflowY: 'auto',
            overflowX: 'hidden',
            // Quando banner visível, rows ficam logo abaixo sem padding extra
            paddingTop: isHeroVisible ? 0 : 16,
            transition: 'padding-top 400ms ease',
            scrollBehavior: 'smooth',
          }}
        >
          {rows.map((row, rowIdx) => (
            <div
              ref={el => { rowRefs.current[rowIdx] = el }}
              key={rowIdx}
              style={{ padding: '24px 0', overflow: 'visible' }}
            >
              <div style={{
                padding: '0 80px', display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', marginBottom: 16,
              }}>
                <div style={{
                  fontSize: 22, fontWeight: 800, textTransform: 'lowercase',
                  color: focusZone === 'content' && contentRow === rowIdx ? '#fff' : 'rgba(255,255,255,0.5)',
                  transition: 'color 200ms',
                }}>
                  {row.title}<span style={{ color: ACCENT }}>{row.titleAccent}</span>
                </div>
              </div>

              {row.type === 'grid' ? (
                <div style={{
                  display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: 24, padding: '0 80px',
                }}>
                  {row.channels.slice(0, 8).map((cat, ci) => {
                    const focused = focusZone === 'content' && contentRow === rowIdx && contentCols[rowIdx] === ci
                    const info = CATEGORY_ICONS[cat.name] || { emoji: '📂', color: '#888' }
                    return (
                      <div key={ci} style={{
                        height: 140,
                        background: focused ? ACCENT : 'rgba(255,255,255,0.03)',
                        border: focused ? `1px solid ${ACCENT}` : '1px dashed rgba(255,255,255,0.1)',
                        borderRadius: 24,
                        display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'center', gap: 12,
                        fontSize: 18, fontWeight: 700, textTransform: 'lowercase',
                        transformOrigin: 'center center', willChange: 'transform',
                        transform: focused ? `scale(${FOCUS_SCALE}) translateY(-8px)` : 'scale(1) translateY(0)',
                        boxShadow: focused ? `0 8px 32px rgba(0,0,0,0.55)` : 'none',
                        zIndex: focused ? 10 : 0,
                        opacity: focused ? 1 : UNFOCUS_OPACITY,
                        transition: `transform ${FOCUS_DURATION}ms ${FOCUS_EASING}, box-shadow ${FOCUS_DURATION}ms ${FOCUS_EASING}, opacity ${FOCUS_DURATION}ms ${FOCUS_EASING}, border-color ${FOCUS_DURATION}ms ${FOCUS_EASING}, background-color ${FOCUS_DURATION}ms ${FOCUS_EASING}`,
                        cursor: 'pointer',
                      }}>
                        <span style={{ fontSize: 28 }}>{info.emoji}</span>
                        <span>{cat.name}</span>
                      </div>
                    )
                  })}
                </div>
              ) : (() => {
                const CARD_W = 317
                const CARD_H = 475
                const GAP    = 20
                const STEP   = CARD_W + GAP

                const isRowFocused  = focusZone === 'content' && contentRow === rowIdx
                const focusedIndex  = contentCols[rowIdx] || 0
                const isVirtualRow  = Math.abs(contentRow - rowIdx) <= 2

                if (!isVirtualRow) return <div style={{ height: 520 }} />

                const cameraShift = -(focusedIndex * STEP)
                const rowHeight   = CARD_H + (isRowFocused ? 140 : 40)

                return (
                  <div style={{
                    position: 'relative', width: '100%', height: rowHeight,
                    paddingTop: 12, overflow: 'hidden',
                    transition: `height ${FOCUS_DURATION}ms ${FOCUS_EASING}`,
                  }}>
                    <div style={{
                      position: 'absolute', left: 80, top: 12,
                      display: 'flex', flexDirection: 'row', gap: GAP,
                      alignItems: 'flex-start',
                      transform: `translate3d(${cameraShift}px, 0, 0)`,
                      transition: `transform ${FOCUS_DURATION}ms ${FOCUS_EASING}`,
                      willChange: 'transform',
                    }}>
                      {row.channels.map((ch, ci) => {
                        const diffCols = ci - focusedIndex
                        if (diffCols < -4 || diffCols > 6) {
                          return <div key={ci} style={{ flex: `0 0 ${CARD_W}px`, height: CARD_H }} />
                        }
                        const isFocused  = isRowFocused && ci === focusedIndex
                        const expandedW  = 840
                        const currentW   = isFocused ? expandedW : CARD_W
                        return (
                          <div key={ci} onClick={() => onPlay(ch)} style={{
                            position: 'relative',
                            flex: `0 0 ${currentW}px`, height: CARD_H,
                            willChange: 'flex-basis, opacity',
                            zIndex: isFocused ? 10 : 1,
                            opacity: (isRowFocused && !isFocused) ? UNFOCUS_OPACITY : 1,
                            borderRadius: 8, cursor: 'pointer', overflow: 'hidden',
                            boxShadow: isFocused ? FOCUS_GLOW : 'none',
                            transition: `flex ${FOCUS_DURATION}ms ${FOCUS_EASING}, opacity ${FOCUS_DURATION}ms ${FOCUS_EASING}, box-shadow ${FOCUS_DURATION}ms ${FOCUS_EASING}`,
                          }}>
                            <div style={{
                              position: 'absolute', left: 0, top: 0,
                              width: '100%', height: '100%',
                              background: '#111',
                              border: isFocused ? FOCUS_BORDER : `1px solid rgba(255,255,255,0.08)`,
                              transition: `border-color ${FOCUS_DURATION}ms ${FOCUS_EASING}`,
                              borderRadius: 8, zIndex: 3, overflow: 'hidden',
                            }}>
                              {(() => {
                                const t   = row.tmdb?.get(ch.name)
                                const src = t?.poster || ch.logo
                                return src
                                  ? <img src={src} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                  : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>📺</div>
                              })()}
                            </div>
                            <div style={{
                              position: 'absolute', bottom: 0, left: 0, right: 0, height: '55%',
                              background: 'linear-gradient(transparent, rgba(0,0,0,0.95))',
                              zIndex: 4, pointerEvents: 'none',
                            }} />
                            <div style={{
                              position: 'absolute', bottom: 0, left: 0, right: 0,
                              padding: isFocused ? '0 24px 24px' : '0 12px 14px',
                              zIndex: 5, pointerEvents: 'none',
                              transition: `padding ${FOCUS_DURATION}ms ${FOCUS_EASING}`,
                            }}>
                              <div style={{
                                fontSize: isFocused ? 24 : 18,
                                fontWeight: 800,
                                fontFamily: "'Barlow Condensed', sans-serif",
                                textTransform: 'uppercase',
                                overflow: 'hidden', textOverflow: 'ellipsis',
                                whiteSpace: isFocused ? 'normal' : 'nowrap',
                                lineHeight: 1.2,
                                maxHeight: isFocused ? '3.6rem' : '1.5rem',
                                textShadow: '0 2px 10px rgba(0,0,0,0.95)',
                                transition: `font-size ${FOCUS_DURATION}ms ${FOCUS_EASING}, max-height ${FOCUS_DURATION}ms ${FOCUS_EASING}`,
                              }}>{ch.name}</div>
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    {/* Metadata overlay */}
                    {isRowFocused && (() => {
                      const fch  = row.channels[focusedIndex]
                      if (!fch) return null
                      const tmdb = row.tmdb?.get(fch.name)
                      return (
                        <div key={fch.name} style={{
                          position: 'absolute', left: 80, top: CARD_H + 24,
                          width: 580, animation: 'fadeInHero 300ms ease-out',
                        }}>
                          <div style={{ display: 'flex', gap: 12, fontSize: 18, color: '#e5e5e5', fontWeight: 600, marginBottom: 8, alignItems: 'center' }}>
                            <span style={{ color: '#10b981', fontWeight: 800 }}>{Math.round((tmdb?.rating || 8) * 10)}% match</span>
                            <span>{tmdb?.year || '2024'}</span>
                            <span style={{ border: '1px solid rgba(255,255,255,0.4)', padding: '0 4px', borderRadius: 4, textTransform: 'uppercase' }}>TV-MA</span>
                            <span style={{ color: '#fff', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 300 }}>
                              {tmdb?.title || fch.name}
                            </span>
                          </div>
                          <div style={{
                            fontSize: 18, color: '#a3a3a3', lineHeight: 1.4,
                            display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                          }}>
                            {tmdb?.overview || `Sintonize ${fch.name}. Aproveite o melhor do entretenimento diretamente do cosmos.`}
                          </div>
                        </div>
                      )
                    })()}
                  </div>
                )
              })()}
            </div>
          ))}
        </div>
      </div>

      {/* SKELETON SHIMMER LOADING */}
      {isLoadingContent && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.92)', zIndex: 80, padding: '120px 80px 0',
        }}>
          {[0, 1, 2].map(r => (
            <div key={r} style={{ marginBottom: 48 }}>
              <div style={{
                width: 220, height: 22, borderRadius: 6,
                background: 'rgba(255,255,255,0.06)', marginBottom: 20,
                animation: 'shimmer 1.8s ease-in-out infinite',
              }} />
              <div style={{ display: 'flex', gap: 20 }}>
                {[0,1,2,3,4,5].map(c => (
                  <div key={c} style={{
                    width: 317, height: 475, borderRadius: 8, flexShrink: 0,
                    background: 'linear-gradient(110deg, rgba(255,255,255,0.04) 30%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 70%)',
                    backgroundSize: '300% 100%',
                    animation: 'shimmer 1.8s ease-in-out infinite',
                    animationDelay: `${c * 120}ms`,
                  }} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* EXIT DIALOG */}
      {showExit && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.85)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 9999,
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #1a1a1a 0%, #0f0f0f 100%)',
            border: `2px solid rgba(255,0,110,0.3)`, borderRadius: 16,
            padding: '60px 80px', textAlign: 'center', maxWidth: 600,
            boxShadow: `0 0 60px ${GLOW}`,
          }}>
            <div style={{ fontSize: 40, fontWeight: 700, marginBottom: 12 }}>
              sair do <span style={{ color: ACCENT }}>ziiiTV</span>?
            </div>
            <div style={{ fontSize: 18, color: TEXT_MUTED, marginBottom: 40 }}>tem certeza que deseja sair?</div>
            <div style={{ display: 'flex', gap: 20, justifyContent: 'center' }}>
              {['cancelar', 'sair'].map((label, i) => {
                const f = exitFocus === i
                return (
                  <div key={i} style={{
                    background: i === 1 ? (f ? ACCENT : 'rgba(255,0,110,0.3)') : (f ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)'),
                    padding: '16px 48px', borderRadius: 100, fontSize: 22,
                    fontWeight: 700, cursor: 'pointer', textTransform: 'lowercase',
                    border: f ? `3px solid ${ACCENT}` : '3px solid transparent',
                    transform: f ? 'scale(1.08)' : 'scale(1)',
                    boxShadow: f ? `0 0 24px ${GLOW}` : 'none',
                    transition: 'all 200ms',
                  }}>{label}</div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeInHero {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        @keyframes shimmer {
          0%   { background-position:  200% 0; }
          100% { background-position: -200% 0; }
        }
        *::-webkit-scrollbar { display: none; }
        * { scrollbar-width: none; }
      `}</style>
    </div>
  )
}
