import { useEffect, useRef, useState } from 'react'
import type { UICategory } from '../../services/categoryMapper'
import type { ContentRow, ScreenContent } from '../../services/contentSelector'
import type { TMDBResult } from '../../services/tmdbService'
import {
  buildHomeContent,
  buildFilmesContent,
  buildSeriesContent,
  buildTvContent
} from '../../services/contentSelector'
import { recordPlay } from '../../services/historyService'

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

// FIX #1 — sidebar agora é uma FocusZone válida
type FocusZone = 'sidebar' | 'topbar' | 'hero' | 'content'
type HeroState = 'default' | 'focused' | 'collapsed'
type DashboardView = 'home' | 'movies' | 'series' | 'live'

const ACCENT    = '#ff006e'
const GLOW      = 'rgba(255, 0, 110, 0.4)'
const BG        = '#000000'
const TEXT_MUTED = '#a0a0a0'

// FIX #2 — mapa view→topbarIdx para sincronizar topbar quando view muda de outro lugar
const VIEW_TO_TOPBAR: Record<DashboardView, number> = {
  home: 0, movies: 1, series: 2, live: 3,
}

const SIDEBAR_ICONS: Array<{ emoji: string; label: string; view?: DashboardView }> = [
  { emoji: '🏠', label: 'home',     view: 'home'   },
  { emoji: '🎬', label: 'filmes',   view: 'movies' },
  { emoji: '⊞',  label: 'séries',  view: 'series' },
  { emoji: '📺', label: 'live',     view: 'live'   },
  { emoji: '📈', label: 'esportes'                 },
  { emoji: '♡',  label: 'favoritos'               },
]

const TOPBAR_LINKS: Array<{ label: string; view: DashboardView }> = [
  { label: 'página principal', view: 'home'   },
  { label: 'filmes',           view: 'movies' },
  { label: 'séries',           view: 'series' },
  { label: 'tv ao vivo',       view: 'live'   },
]

const HERO_SLIDES = [
  { accent: 'o melhor', title: 'ziiiTV',   icon: '📺', desc: 'Seu universo de entretenimento alienígena. Milhares de canais ao vivo.' },
  { accent: 'cerebral', title: 'invasão',  icon: '👾', desc: 'O melhor conteúdo de filmes, séries e esportes ao vivo.' },
  { accent: 'digital',  title: 'domínio',  icon: '📺', desc: 'Streaming de alta qualidade direto na sua Smart TV.' },
  { accent: 'infinita', title: 'visão',    icon: '♾️', desc: 'Navegação fluida. Categorias inteligentes. Controle total.' },
  { accent: 'ziiiTV',   title: 'universo', icon: '🚀', desc: 'O futuro do entretenimento já começou.' },
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

// Banner Apple TV
const CARD_W = 160
const CARD_H = 240
const PEEK   = 64
const GAP    = 14

// Helper: muda view e sincroniza topbarIdx de uma vez
function useChangeView(
  setActiveView: React.Dispatch<React.SetStateAction<DashboardView>>,
  setTopbarIdx:  React.Dispatch<React.SetStateAction<number>>
) {
  return (view: DashboardView) => {
    setActiveView(view)
    // FIX #2 — topbarIdx sempre reflete a view ativa
    setTopbarIdx(VIEW_TO_TOPBAR[view] ?? 0)
  }
}

export default function HomeScreen({ groups, onPlay, onBack }: Props) {

  // FIX #1 — focusZone começa em 'hero', sidebar acessível via ← no topbar
  const [focusZone,   setFocusZone]   = useState<FocusZone>('hero')
  const [heroState,   setHeroState]   = useState<HeroState>('default')
  const [heroSlide,   setHeroSlide]   = useState(0)
  const [sidebarIdx,  setSidebarIdx]  = useState(0)
  const [topbarIdx,   setTopbarIdx]   = useState(0)
  const [contentRow,  setContentRow]  = useState(0)
  // FIX #3 — array dinâmico, recriado quando rows mudam
  const [contentCols, setContentCols] = useState<number[]>([])
  const [showExit,    setShowExit]    = useState(false)
  const [exitFocus,   setExitFocus]   = useState(0)
  const [activeView,  setActiveView]  = useState<DashboardView>('home')
  const [isLoading,   setIsLoading]   = useState(false)
  const [content,     setContent]     = useState<ScreenContent | null>(null)

  const changeView = useChangeView(setActiveView, setTopbarIdx)

  // ─── Carrega conteúdo ao trocar de view ──────────────────────────────────
  useEffect(() => {
    let cancelled = false
    setIsLoading(true)
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
        setIsLoading(false)
        setContentRow(0)
        // FIX #3 — tamanho exato de rows, sem hardcode em 8
        setContentCols(new Array(data.rows.length).fill(0))
        // FIX #4 — resetar heroSlide ao trocar de view
        setHeroSlide(0)
      }
    }
    load()
    return () => { cancelled = true }
  }, [groups, activeView])

  const rows         = content?.rows         || []
  const heroTmdb     = content?.heroTmdb     || new Map<string, TMDBResult | null>()
  const heroChannels = content?.heroChannels || []

  // TMDB lazy para card em foco no content
  const [liveTmdb, setLiveTmdb] = useState<Record<string, TMDBResult | null>>({})

  const previewChannel = (focusZone === 'content' && rows[contentRow])
    ? rows[contentRow].channels[contentCols[contentRow] ?? 0] || null
    : null

  useEffect(() => {
    if (!previewChannel) return
    const name = previewChannel.name
    if (liveTmdb[name] !== undefined) return
    if (rows[contentRow]?.tmdb?.has(name)) return
    import('../../services/tmdbService').then(({ enrichChannel }) => {
      enrichChannel(name).then(res => setLiveTmdb(prev => ({ ...prev, [name]: res })))
    })
  }, [previewChannel?.name]) // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Refs para o handler de teclado (evita closure stale) ────────────────
  const focusZoneRef   = useRef(focusZone)
  const sidebarRef     = useRef(sidebarIdx)
  const topbarRef      = useRef(topbarIdx)
  const contentRowRef  = useRef(contentRow)
  const contentColsRef = useRef(contentCols)
  const rowsRef        = useRef(rows)
  const showExitRef    = useRef(showExit)
  const exitFocusRef   = useRef(exitFocus)
  const heroSlideRef   = useRef(heroSlide)
  const activeViewRef  = useRef(activeView)

  focusZoneRef.current   = focusZone
  sidebarRef.current     = sidebarIdx
  topbarRef.current      = topbarIdx
  contentRowRef.current  = contentRow
  contentColsRef.current = contentCols
  rowsRef.current        = rows
  showExitRef.current    = showExit
  exitFocusRef.current   = exitFocus
  heroSlideRef.current   = heroSlide
  activeViewRef.current  = activeView

  const maxSlides = heroChannels.length > 0 ? heroChannels.length : HERO_SLIDES.length

  // ─── Auto-slide hero ─────────────────────────────────────────────────────
  useEffect(() => {
    if (focusZone === 'content') return
    const iv = setInterval(() => setHeroSlide(s => (s + 1) % maxSlides), 8000)
    return () => clearInterval(iv)
  }, [focusZone, maxSlides])

  // ─── Scroll card focado para a tela ─────────────────────────────────────
  const rowRefs = useRef<(HTMLDivElement | null)[]>([])
  useEffect(() => {
    if (focusZone !== 'content') return
    const row  = rowRefs.current[contentRow]
    if (!row) return
    const col  = contentCols[contentRow] ?? 0
    const card = row.children[col] as HTMLElement
    card?.scrollIntoView({ behavior: 'smooth' as ScrollBehavior, block: 'nearest', inline: 'nearest' })
  }, [contentRow, contentCols, focusZone])

  // ─── Teclado ─────────────────────────────────────────────────────────────
  useEffect(() => {
    let lastT = 0
    const onKey = (e: KeyboardEvent) => {
      const now = Date.now()
      if (now - lastT < 120) return
      lastT = now

      // ── Diálogo de saída ───────────────────────────────────────────────
      if (showExitRef.current) {
        const kc = e.keyCode
        if (kc === 37) { e.preventDefault(); setExitFocus(0) }
        else if (kc === 39) { e.preventDefault(); setExitFocus(1) }
        else if (kc === 13) {
          e.preventDefault()
          exitFocusRef.current === 1 ? onBack() : setShowExit(false)
        }
        else if (kc === 10009 || kc === 8) { e.preventDefault(); setShowExit(false) }
        return
      }

      const zone    = focusZoneRef.current
      const rw      = contentRowRef.current
      const cols    = contentColsRef.current
      const allRows = rowsRef.current
      const slides  = maxSlides

      // ── BACK ──────────────────────────────────────────────────────────
      if (e.keyCode === 10009 || e.keyCode === 8) {
        e.preventDefault()
        if (zone === 'sidebar' || zone === 'topbar') { setShowExit(true); setExitFocus(0) }
        else if (zone === 'hero')    { setFocusZone('topbar'); setHeroState('default') }
        else if (zone === 'content') { setFocusZone('hero');   setHeroState('focused') }
        return
      }

      // ── OK / ENTER ────────────────────────────────────────────────────
      if (e.keyCode === 13) {
        e.preventDefault()
        if (zone === 'sidebar') {
          const item = SIDEBAR_ICONS[sidebarRef.current]
          if (item?.view) { changeView(item.view); setFocusZone('hero') }
          return
        }
        if (zone === 'topbar') {
          const item = TOPBAR_LINKS[topbarRef.current]
          if (item?.view) { changeView(item.view); setFocusZone('hero') }
          return
        }
        if (zone === 'hero') {
          // OK no hero toca o canal do slide atual
          const ch = heroChannels[heroSlideRef.current]
          if (ch?.url) { recordPlay(ch.name, ch.group); onPlay(ch) }
          return
        }
        if (zone === 'content') {
          const row = allRows[rw]
          if (!row) return
          if (row.type === 'grid') {
            const cat = row.channels[cols[rw] ?? 0]
            const viewMap: Record<string, DashboardView> = {
              filmes: 'movies', series: 'series',
              'tv ao vivo': 'live', abertos: 'live', esportes: 'live',
            }
            changeView(viewMap[cat?.name?.toLowerCase()] || 'home')
          } else {
            const ch = row.channels[cols[rw] ?? 0]
            if (ch) { recordPlay(ch.name, ch.group); onPlay(ch) }
          }
        }
        return
      }

      // ── SETAS ─────────────────────────────────────────────────────────
      const isDown  = e.keyCode === 40
      const isUp    = e.keyCode === 38
      const isRight = e.keyCode === 39
      const isLeft  = e.keyCode === 37
      if (!(isDown || isUp || isRight || isLeft)) return
      e.preventDefault()

      // FIX #1 — SIDEBAR totalmente navegável
      if (zone === 'sidebar') {
        if (isDown)  setSidebarIdx(i => Math.min(i + 1, SIDEBAR_ICONS.length - 1))
        else if (isUp)    setSidebarIdx(i => Math.max(i - 1, 0))
        else if (isRight) { setFocusZone('topbar') }
        return
      }

      if (zone === 'topbar') {
        if (isRight) setTopbarIdx(i => Math.min(i + 1, TOPBAR_LINKS.length - 1))
        else if (isLeft) {
          // FIX #1 — ← no primeiro item do topbar vai para sidebar
          if (topbarRef.current === 0) setFocusZone('sidebar')
          else setTopbarIdx(i => Math.max(i - 1, 0))
        }
        else if (isDown) { setFocusZone('hero'); setHeroState('focused') }
        else if (isUp)   { setFocusZone('sidebar') }
        return
      }

      if (zone === 'hero') {
        if (isUp)         { setFocusZone('topbar'); setHeroState('default') }
        else if (isDown)  { setFocusZone('content'); setHeroState('collapsed'); setContentRow(0) }
        else if (isRight) setHeroSlide(s => (s + 1) % slides)
        else if (isLeft)  setHeroSlide(s => (s - 1 + slides) % slides)
        return
      }

      if (zone === 'content') {
        if (isDown) {
          if (rw < allRows.length - 1) setContentRow(rw + 1)
        } else if (isUp) {
          if (rw === 0) { setFocusZone('hero'); setHeroState('focused') }
          else setContentRow(rw - 1)
        } else if (isRight) {
          const maxCol = (allRows[rw]?.channels.length || 1) - 1
          const cur = cols[rw] ?? 0
          if (cur < maxCol) {
            // FIX #3 — cols é dinâmico, usa spread seguro
            const next = [...cols]
            next[rw] = cur + 1
            setContentCols(next)
          }
        } else if (isLeft) {
          const cur = cols[rw] ?? 0
          if (cur > 0) {
            const next = [...cols]
            next[rw] = cur - 1
            setContentCols(next)
          }
        }
        return
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Layout ──────────────────────────────────────────────────────────────
  const heroH         = focusZone === 'content' ? '180px' : '100vh'
  const ROW_HEIGHT    = 320
  const contentOffset = focusZone === 'content' ? -(contentRow * ROW_HEIGHT) : 0

  // Backdrop hero
  const heroCh       = heroChannels[heroSlide] || null
  const heroTmdbData = heroCh ? (heroTmdb.get(heroCh.name) || null) : null
  const heroBgUrl    = heroTmdbData?.backdrop || 'hero-alien.png'

  // ══════════════════════════════════════════════════════════════════════════
  // RENDER
  // ══════════════════════════════════════════════════════════════════════════
  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: BG, color: '#fff',
      fontFamily: "'Outfit', sans-serif", overflow: 'hidden',
    }}>
      <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>

        {/* ══ SIDEBAR ═══════════════════════════════════════════════════════ */}
        {/* FIX #1 — sidebar visível e recebe destaque quando em foco */}
        <div style={{
          position: 'absolute', left: 0, top: 0, bottom: 0,
          width: focusZone === 'sidebar' ? 180 : 64,
          background: focusZone === 'sidebar'
            ? 'linear-gradient(to right, rgba(0,0,0,0.97), rgba(0,0,0,0.85))'
            : 'transparent',
          zIndex: 95,
          display: 'flex', flexDirection: 'column',
          alignItems: focusZone === 'sidebar' ? 'flex-start' : 'center',
          justifyContent: 'center', gap: 8,
          padding: focusZone === 'sidebar' ? '0 0 0 16px' : '0',
          transition: 'width 250ms ease, background 250ms ease',
          pointerEvents: focusZone === 'sidebar' ? 'auto' : 'none',
        }}>
          {SIDEBAR_ICONS.map((item, i) => {
            const focused = focusZone === 'sidebar' && sidebarIdx === i
            const isActive = item.view === activeView
            return (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: focusZone === 'sidebar' ? '10px 16px' : '10px',
                borderRadius: 12,
                background: focused ? `rgba(255,0,110,0.2)` : 'transparent',
                border: focused ? `2px solid ${ACCENT}` : '2px solid transparent',
                width: focusZone === 'sidebar' ? '100%' : 'auto',
                transition: 'all 200ms',
              }}>
                <span style={{ fontSize: 22, opacity: isActive ? 1 : 0.5 }}>{item.emoji}</span>
                {focusZone === 'sidebar' && (
                  <span style={{
                    fontSize: 18, fontWeight: 700,
                    color: focused ? '#fff' : 'rgba(255,255,255,0.5)',
                    textTransform: 'lowercase',
                  }}>{item.label}</span>
                )}
              </div>
            )
          })}
        </div>

        {/* ══ TOPBAR ════════════════════════════════════════════════════════ */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 72,
          display: 'flex', alignItems: 'center', padding: '0 80px',
          background: focusZone === 'content'
            ? 'rgba(0,0,0,0.97)'
            : 'linear-gradient(to bottom, rgba(0,0,0,0.85), transparent)',
          zIndex: 90,
          transition: 'background 300ms ease',
          borderBottom: focusZone === 'content' ? '1px solid rgba(255,255,255,0.07)' : 'none',
        }}>
          <div style={{ fontSize: 18, fontWeight: 900, letterSpacing: 1, textTransform: 'lowercase', marginRight: 40 }}>
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
                  background: active ? 'rgba(255,0,110,0.15)' : 'transparent',
                  transition: 'all 200ms', whiteSpace: 'nowrap',
                  // FIX #2 — sublinhado reflete activeView corretamente
                  borderBottom: isCurrentView && !active ? `2px solid ${ACCENT}` : '2px solid transparent',
                  outline: active ? `2px solid ${ACCENT}` : 'none',
                  outlineOffset: 2,
                }}>{link.label}</div>
              )
            })}
          </div>
        </div>

        {/* ══ HERO ══════════════════════════════════════════════════════════ */}
        <div style={{
          position: 'relative', width: '100%', height: heroH,
          display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
          overflow: 'hidden', transition: 'height 400ms ease',
        }}>
          {/* Backdrop */}
          <img
            key={heroBgUrl}
            src={heroBgUrl}
            style={{
              position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
              objectFit: 'cover', zIndex: 0,
              transition: 'opacity 600ms ease',
            }}
            onError={(e) => { e.currentTarget.src = 'hero-alien.png' }}
          />

          {/* Gradiente inferior */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: '55%',
            background: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.5) 60%, transparent 100%)',
            zIndex: 1,
          }} />

          {/* Carrossel Apple TV */}
          {focusZone !== 'content' && (() => {
            const channels = heroChannels.length > 0
              ? heroChannels
              : Object.values(groups).flat().slice(0, 20)
            if (channels.length === 0) return null

            const WINDOW_W = PEEK + GAP + CARD_W + GAP + PEEK

            return (
              <div style={{
                position: 'relative', zIndex: 10,
                width: WINDOW_W,
                margin: '0 auto',
                overflow: 'hidden',
                paddingBottom: 40,
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-end',
                  gap: GAP,
                  transform: `translateX(${PEEK - heroSlide * (CARD_W + GAP)}px)`,
                  transition: 'transform 380ms cubic-bezier(0.4, 0, 0.2, 1)',
                  willChange: 'transform',
                }}>
                  {channels.map((ch, idx) => {
                    const tmdb       = heroTmdb.get(ch.name)
                    const poster     = tmdb?.poster || ch.logo || ''
                    const isCentral  = idx === heroSlide
                    const isAdjacent = Math.abs(idx - heroSlide) === 1

                    return (
                      <div key={idx} style={{
                        width: CARD_W,
                        height: isCentral ? CARD_H : CARD_H - 28,
                        borderRadius: 10,
                        overflow: 'hidden',
                        flexShrink: 0,
                        border: isCentral
                          ? `3px solid ${ACCENT}`
                          : '2px solid rgba(255,255,255,0.10)',
                        boxShadow: isCentral
                          ? `0 8px 40px ${GLOW}, 0 2px 8px rgba(0,0,0,0.8)`
                          : '0 4px 16px rgba(0,0,0,0.5)',
                        opacity: isCentral ? 1 : isAdjacent ? 0.5 : 0.2,
                        background: '#1a1a2e',
                        transition: 'all 350ms cubic-bezier(0.4, 0, 0.2, 1)',
                        alignSelf: 'flex-end',
                      }}>
                        {poster ? (
                          <img
                            src={poster}
                            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                            onError={(e) => {
                              e.currentTarget.style.display = 'none'
                              const p = e.currentTarget.parentElement
                              if (p) p.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;height:100%;font-size:11px;color:rgba(255,255,255,0.5);text-align:center;padding:8px">${ch.name}</div>`
                            }}
                          />
                        ) : (
                          <div style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            height: '100%', fontSize: 11, color: 'rgba(255,255,255,0.4)',
                            textAlign: 'center', padding: 8,
                          }}>{ch.name}</div>
                        )}
                      </div>
                    )
                  })}
                </div>

                {/* Dots */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: 6, paddingTop: 10 }}>
                  {channels.slice(0, Math.min(channels.length, 10)).map((_, i) => (
                    <div key={i} style={{
                      width: i === heroSlide ? 20 : 6, height: 4, borderRadius: 4,
                      background: i === heroSlide ? ACCENT : 'rgba(255,255,255,0.2)',
                      transition: 'all 300ms ease',
                    }} />
                  ))}
                </div>
              </div>
            )
          })()}
        </div>

        {/* ══ ROWS ══════════════════════════════════════════════════════════ */}
        <div style={{
          transform: `translateY(${contentOffset}px)`,
          transition: 'transform 500ms cubic-bezier(0.4,0,0.2,1)',
        }}>
          {rows.map((row, rowIdx) => (
            <div key={rowIdx} style={{ padding: '24px 0', overflow: 'visible' }}>
              <div style={{ padding: '0 80px', marginBottom: 16 }}>
                <div style={{
                  fontSize: 22, fontWeight: 800, textTransform: 'lowercase',
                  color: focusZone === 'content' && contentRow === rowIdx ? '#fff' : 'rgba(255,255,255,0.5)',
                  transition: 'color 200ms',
                }}>
                  {row.title}<span style={{ color: ACCENT }}>{row.titleAccent}</span>
                </div>
              </div>

              {row.type === 'grid' ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, padding: '0 80px' }}>
                  {row.channels.slice(0, 8).map((cat, ci) => {
                    const focused = focusZone === 'content' && contentRow === rowIdx && (contentCols[rowIdx] ?? 0) === ci
                    const info    = CATEGORY_ICONS[cat.name] || { emoji: '📂', color: '#888' }
                    return (
                      <div key={ci} style={{
                        height: 140, borderRadius: 24,
                        background: focused ? ACCENT : 'rgba(255,255,255,0.03)',
                        border: focused ? `1px solid ${ACCENT}` : '1px dashed rgba(255,255,255,0.1)',
                        display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'center', gap: 12,
                        fontSize: 18, fontWeight: 700, textTransform: 'lowercase',
                        transform: focused ? 'translateY(-8px)' : 'translateY(0)',
                        boxShadow: focused ? `0 15px 30px ${GLOW}` : 'none',
                        transition: 'all 280ms cubic-bezier(0.34,1.56,0.64,1)',
                      }}>
                        <span style={{ fontSize: 28 }}>{info.emoji}</span>
                        <span>{cat.name}</span>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div
                  ref={el => { rowRefs.current[rowIdx] = el }}
                  style={{
                    display: 'flex',
                    gap: row.type === 'portrait' ? 14 : 8,
                    overflowX: 'auto', overflowY: 'visible',
                    padding: row.type === 'portrait' ? '12px 0 20px 80px' : '12px 0 20px 80px',
                    scrollbarWidth: 'none', alignItems: 'flex-start',
                  }}
                >
                  {row.channels.map((ch, ci) => {
                    const focused = focusZone === 'content' && contentRow === rowIdx && (contentCols[rowIdx] ?? 0) === ci

                    if (row.type === 'portrait') {
                      const tmdb = row.tmdb?.get(ch.name)
                      const src  = tmdb?.poster || ch.logo
                      return (
                        <div key={ci} onClick={() => onPlay(ch)} style={{
                          position: 'relative', width: 220, minWidth: 220, height: 330,
                          borderRadius: 12, overflow: 'hidden', cursor: 'pointer', flexShrink: 0,
                          transform: focused ? 'scale(1.05)' : 'scale(1)',
                          zIndex: focused ? 10 : 1,
                          border: focused ? `3px solid ${ACCENT}` : '1px solid rgba(255,255,255,0.07)',
                          boxShadow: focused ? `0 0 28px ${GLOW}` : 'none',
                          background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
                          transition: 'all 280ms cubic-bezier(0.34,1.56,0.64,1)',
                        }}>
                          {src
                            ? <img src={src} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: 48, opacity: 0.4 }}>📺</div>
                          }
                          <div style={{
                            position: 'absolute', bottom: 0, left: 0, right: 0,
                            padding: '8px 8px 8px',
                            background: 'linear-gradient(transparent, rgba(0,0,0,0.9))',
                          }}>
                            <div style={{
                              fontSize: 18, fontWeight: 700,
                              fontFamily: "'Barlow Condensed', sans-serif",
                              textTransform: 'uppercase',
                              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                            }}>{ch.name}</div>
                          </div>
                        </div>
                      )
                    }

                    // wide / simple
                    const isWide = row.type === 'wide'
                    const tmdb   = row.tmdb?.get(ch.name)
                    const src    = tmdb?.poster || ch.logo
                    return (
                      <div key={ci} onClick={() => onPlay(ch)} style={{
                        position: 'relative', display: 'flex', alignItems: 'flex-end',
                        minWidth: isWide ? 420 : 300, flexShrink: 0, cursor: 'pointer',
                        transition: 'all 280ms cubic-bezier(0.34,1.56,0.64,1)',
                      }}>
                        {isWide && (
                          <div style={{
                            fontSize: '8rem', fontWeight: 900, lineHeight: 1,
                            color: 'transparent',
                            WebkitTextStroke: focused ? `2px ${ACCENT}` : '2px rgba(255,255,255,0.15)',
                            fontFamily: "'Outfit'", width: 120, textAlign: 'right',
                            marginBottom: -20, marginRight: -3, zIndex: 2,
                            transition: 'all 200ms',
                          }}>{ci + 1}</div>
                        )}
                        <div style={{ position: 'relative' }}>
                          <div style={{
                            width: isWide ? 300 : 260, height: isWide ? 170 : 146,
                            borderRadius: 14, overflow: 'hidden',
                            background: 'linear-gradient(135deg, #0f0f23, #1a1a2e)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 36, opacity: focused ? 1 : 0.8,
                            border: focused ? `3px solid ${ACCENT}` : '1px solid rgba(255,255,255,0.07)',
                            boxShadow: focused ? `0 0 28px ${GLOW}` : 'none',
                            transition: 'all 200ms',
                          }}>
                            {src
                              ? <img src={src} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              : '📺'
                            }
                          </div>
                          {isWide && ci < 3 && (
                            <div style={{
                              position: 'absolute', top: 10, left: 10,
                              fontSize: 18, fontWeight: 900, letterSpacing: 1.5,
                              textTransform: 'uppercase', padding: '3px 8px', borderRadius: 6,
                              background: ci === 0 ? 'rgba(255,0,110,0.85)' : ci === 1 ? 'rgba(77,124,254,0.85)' : 'rgba(251,191,36,0.85)',
                              color: ci === 2 ? '#000' : '#fff',
                            }}>
                              {ci === 0 ? '🔥 destaque' : ci === 1 ? '✨ novo' : '⭐ popular'}
                            </div>
                          )}
                          {tmdb?.year && (
                            <div style={{
                              position: 'absolute', bottom: 8, right: 8,
                              background: 'rgba(0,0,0,0.75)', color: 'rgba(255,255,255,0.8)',
                              fontSize: 18, fontWeight: 700,
                              fontFamily: "'Barlow Condensed', sans-serif",
                              letterSpacing: 1, padding: '3px 7px', borderRadius: 6,
                              border: '1px solid rgba(255,255,255,0.15)',
                            }}>{tmdb.year}</div>
                          )}
                          <div style={{
                            fontSize: 18, fontWeight: 700,
                            fontFamily: "'Barlow Condensed', sans-serif",
                            letterSpacing: 0.5, textTransform: 'uppercase',
                            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                            padding: '6px 4px 0', maxWidth: isWide ? 300 : 260,
                          }}>{ch.name}</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* LOADING */}
        {isLoading && (
          <div style={{
            position: 'absolute', inset: 0,
            background: 'rgba(0,0,0,0.85)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 80,
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 60, marginBottom: 20, animation: 'spin 2s linear infinite' }}>🛸</div>
              <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase' }}>
                Abduzindo conteúdo...
              </div>
            </div>
          </div>
        )}
      </div>

      {/* EXIT DIALOG */}
      {showExit && (
        <div style={{
          position: 'fixed', inset: 0,
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
                    padding: '16px 48px', borderRadius: 100, fontSize: 22, fontWeight: 700,
                    cursor: 'pointer', textTransform: 'lowercase',
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
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        *::-webkit-scrollbar { display: none; }
        * { scrollbar-width: none; }
      `}</style>
    </div>
  )
}
