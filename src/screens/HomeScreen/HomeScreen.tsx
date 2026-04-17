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
import { HeroBanner, mockHeroSlides, type HeroSlide } from '../../components/HeroBanner'

// ─── Types ──────────────────────────────────────────────────────────────────
import type { Channel } from '../../types/channel'
import { QUALITY_BADGE_COLOR } from '../../types/channel'
import { getSportsArtwork } from '../../services/sportsArtwork'

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

const SIDEBAR_ICONS = [
  { 
    svg: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>, 
    label: 'painel' 
  },
  { 
    svg: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>, 
    label: 'novidades' 
  },
  { 
    svg: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>, 
    label: 'usuários' 
  },
  { 
    svg: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>, 
    label: 'configurações' 
  },
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

// Escala proporcional ao viewport — garante visual idêntico em 1280, 1366 e 1920px
// Base de design: 1920px. Cards de 317px nessa base.
const VW = typeof window !== 'undefined' ? window.innerWidth / 1920 : 1

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
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(mockHeroSlides)

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

        if (activeView === 'home') {
          setHeroSlides(mockHeroSlides)
        } else if (activeView === 'live') {
          setHeroSlides(data.heroChannels.map((ch, idx) => ({
            id: `slide-${idx}`,
            title: ch.name,
            subtitle: ch.group,
            description: `Assista ${ch.name} ao vivo na ziiiTV.`,
            badge: 'Ao Vivo',
            backgroundImage: ch.logo || `https://picsum.photos/1920/1080?random=${idx + 100}`,
            type: 'live',
            channel: ch
          })))
        } else {
          setHeroSlides(data.heroChannels.map((ch, idx) => {
            const tmdb = data.heroTmdb.get(ch.name)
            return {
              id: `slide-${idx}`,
              title: tmdb?.title || ch.name,
              subtitle: activeView === 'movies' ? 'Filme' : 'Série',
              description: tmdb?.overview || `Assista ${ch.name} com a melhor qualidade.`,
              badge: 'Destaque',
              backgroundImage: tmdb?.backdrop
                ? `https://image.tmdb.org/t/p/w1280${tmdb.backdrop}`
                : `https://picsum.photos/1920/1080?random=${idx + 200}`,
              type: activeView === 'movies' ? 'movie' : 'series',
              tmdbId: tmdb?.tmdbId || undefined,
              channel: ch
            }
          }))
        }
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
      if (contentRow === 0) {
        // A primeira linha nunca precisa de offset, e evita bug por conta do paddingTop animando
        wrapper.scrollTo({ top: 0, behavior: 'smooth' })
      } else {
        const rowTop  = row.offsetTop
        // subtraindo 8 para igualar perfeitamente os 8px de padding-top que a primeira linha tem
        wrapper.scrollTo({ top: rowTop - 8, behavior: 'smooth' })
      }
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
          // Apenas placeholder visual para Enterprise settings por enquanto
          // Ao apertar enter, não muda navegação, mas podemos piscar a UI.
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
        else if (isLeft) {
          if (topbarRef.current <= 0) setFocusZone('sidebar')
          else setTopbarIdx(i => Math.max(i - 1, 0))
        }
        else if (isDown)  { setFocusZone('hero'); setHeroState('focused') }
        return
      }

      if (zone === 'hero') {
        if      (isUp)   { setFocusZone('topbar'); setHeroState('default') }
        else if (isDown) { setFocusZone('content'); setHeroState('collapsed'); setContentRow(0) }
        else if (isLeft) { setFocusZone('sidebar') }
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
          else { setFocusZone('sidebar') }
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
    }}>

      {/* ── SIDEBAR (Minimalista Enterprise) — Sobreposição Absoluta ─── */}
      <div style={{
        position: 'absolute',
        top: focusZone === 'sidebar' ? 0 : 32,
        left: focusZone === 'sidebar' ? 0 : 32,
        bottom: focusZone === 'sidebar' ? 0 : 'auto',
        width: focusZone === 'sidebar' ? 320 : 54,
        height: focusZone === 'sidebar' ? '100%' : 54,
        borderRadius: focusZone === 'sidebar' ? 0 : 27,
        background: focusZone === 'sidebar' ? 'rgba(10,10,10,0.95)' : 'rgba(255,255,255,0.08)',
        backdropFilter: 'blur(20px)',
        borderRight: focusZone === 'sidebar' ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(255,255,255,0.15)',
        boxShadow: focusZone === 'sidebar' ? '0 0 60px rgba(255,0,110,0.45)' : '0 4px 12px rgba(0,0,0,0.5)',
        zIndex: 999,
        display: 'flex', flexDirection: 'column',
        alignItems: focusZone === 'sidebar' ? 'flex-start' : 'center',
        justifyContent: focusZone === 'sidebar' ? 'flex-start' : 'center',
        paddingTop: focusZone === 'sidebar' ? 120 : 0,
        transition: 'all 520ms cubic-bezier(0.25,1,0.5,1)',
        overflow: 'hidden',
      }}>
        {/* Quando fechado mostra o "z" */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, width: '100%', height: '100%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 24, fontWeight: 900, color: '#fff', fontStyle: 'italic',
          opacity: focusZone === 'sidebar' ? 0 : 1,
          pointerEvents: 'none',
          transition: 'opacity 300ms ease',
        }}>
          z
        </div>

        {/* Itens do Menu Lateral (escondidos quando fechado) */}
        <div style={{
          opacity: focusZone === 'sidebar' ? 1 : 0,
          pointerEvents: focusZone === 'sidebar' ? 'auto' : 'none',
          transition: 'opacity 300ms ease',
          width: '100%',
          display: 'flex', flexDirection: 'column',
        }}>
          {SIDEBAR_ICONS.map((item, i) => {
            const isActive = focusZone === 'sidebar' && sidebarIdx === i
            return (
              <div key={i} style={{
                display: 'flex', alignItems: 'center',
                width: 'calc(100% - 40px)',
                height: 48,
                margin: '0 20px 16px 20px',
                padding: '0 20px',
                justifyContent: 'flex-start',
                borderRadius: 24,
                color: isActive ? '#fff' : 'rgba(255,255,255,0.4)',
                background: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
                boxShadow: isActive ? `0 0 0 2px ${ACCENT}, 0 0 16px ${GLOW}` : 'none',
                transition: 'all 300ms cubic-bezier(0.25,1,0.5,1)',
              }}>
                <div style={{
                  width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                  transform: isActive ? 'scale(1.15)' : 'scale(1)',
                  transition: 'transform 300ms ease'
                }}>
                  {item.svg}
                </div>
                
                <div style={{
                  marginLeft: 16,
                  fontSize: 18,
                  fontWeight: 600,
                  textTransform: 'lowercase',
                }}>
                  {item.label}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── CORPO PRINCIPAL ──────────────────────────────────────────────── */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
      }}>

        {/* ── TOPBAR (sticky ao topo) ─────────────────────────────────────── */}
      <div style={{
        flexShrink: 0,
        position: 'relative', zIndex: 90,
        height: 72, display: 'flex', alignItems: 'center', padding: '0 80px',
        background: focusZone === 'hero'
          ? 'rgba(0,0,0,0.1)'
          : isHeroVisible
            ? 'linear-gradient(to bottom, rgba(0,0,0,0.85), rgba(0,0,0,0.4), transparent)'
            : 'rgba(0,0,0,0.92)',
        borderBottom: focusZone === 'topbar' ? '2px solid #ff006e' : '2px solid transparent',
        boxShadow: focusZone === 'topbar' ? '0 4px 24px rgba(255,0,110,0.4)' : 'none',
        transition: 'all 520ms cubic-bezier(0.25,1,0.5,1)',
      }}>
        <div style={{
          fontSize: 18, fontWeight: 900, letterSpacing: 1,
          textTransform: 'lowercase', marginRight: 40,
        }}>
          o melhor · <span style={{ color: ACCENT }}>ziiiTV!</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
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
      <div style={{
        flex: 1,
        position: 'relative',
        overflow: 'hidden',
      }}>

        {/* BANNER — Banner Principal e Background de Vídeo Global */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0,
          height: focusZone === 'hero' ? '100%' : (focusZone === 'content' ? '100%' : HERO_H),
          overflow: 'hidden',
          transition: 'all 520ms cubic-bezier(0.25,1,0.5,1)',
          zIndex: focusZone === 'content' ? 0 : 10,
          borderRadius: focusZone === 'hero' ? 0 : 16,
          border: focusZone === 'hero' ? '2px solid #ff006e' : '2px solid transparent',
          boxShadow: focusZone === 'hero' ? '0 0 32px rgba(255,0,110,0.55), 0 0 80px rgba(255,0,110,0.25)' : 'none',
        }}>
          <HeroBanner
            slides={heroSlides}
            autoPlayInterval={0}
            focused={focusZone === 'hero'}
            hideUI={focusZone === 'content'}
            previewOverrideChannel={focusZone === 'content' ? debouncedPreview : undefined}
            previewOverrideImage={focusZone === 'content' && debouncedPreview && liveTmdbData[debouncedPreview.name]?.backdrop ? `https://image.tmdb.org/t/p/w1280${liveTmdbData[debouncedPreview.name]?.backdrop}` : undefined}
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

        {/* ROWS — scroll próprio, por cima do background de vídeo quando em content mode */}
        <div
          ref={rowsWrapRef}
          style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            overflowY: 'auto',
            overflowX: 'hidden',
            paddingTop: focusZone === 'content' ? '8px' : (focusZone === 'hero' ? '100%' : HERO_H),
            transition: 'padding-top 520ms cubic-bezier(0.25,1,0.5,1)',
            scrollBehavior: 'smooth',
            zIndex: 15,
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
                // ─── Layout Netflix: card focado wide, demais portrait ───
                // Dimensões em px escaladas pelo viewport (base 1920px)
                const CARD_W   = Math.round(317 * VW)   // portrait
                const CARD_H   = Math.round(475 * VW)   // altura fixa
                const WIDE_W   = Math.round(840 * VW)   // wide no foco
                const GAP      = Math.round(16  * VW)
                const LEFT_PAD = Math.round(80  * VW)

                const isRowFocused = focusZone === 'content' && contentRow === rowIdx
                const focusedIndex = contentCols[rowIdx] || 0
                const isVirtualRow = Math.abs(contentRow - rowIdx) <= 2

                if (!isVirtualRow) return <div style={{ height: CARD_H + 40 }} />
                const cameraShift = -(focusedIndex * (CARD_W + GAP))

                return (
                  <div style={{
                    position: 'relative', width: '100%',
                    height: CARD_H + 40,
                    paddingTop: Math.round(12 * VW), overflow: 'hidden',
                  }}>
                    <div style={{
                      position: 'absolute', left: LEFT_PAD, top: Math.round(12 * VW),
                      display: 'flex', flexDirection: 'row',
                      alignItems: 'flex-start',
                      transform: `translate3d(${cameraShift}px, 0, 0)`,
                      transition: `transform ${FOCUS_DURATION}ms ${FOCUS_EASING}`,
                      willChange: 'transform',
                    }}>
                      {row.channels.map((ch, ci) => {
                        const diffCols = ci - focusedIndex
                        if (diffCols < -3 || diffCols > 6) {
                          return <div key={ci} style={{ width: CARD_W, height: CARD_H, flexShrink: 0, marginRight: GAP }} />
                        }
                        const isFocused  = isRowFocused && ci === focusedIndex
                        const cardW      = isFocused ? WIDE_W : CARD_W

                        const t          = row.tmdb?.get(ch.name) || ch.tmdb
                        const sportsArt  = getSportsArtwork(ch.name)
                        const posterSrc  = sportsArt?.poster || (t?.poster ? `https://image.tmdb.org/t/p/w342${t.poster}` : (ch.logo || ''))
                        const backdropSrc = sportsArt?.backdrop || (t?.backdrop ? `https://image.tmdb.org/t/p/w780${t.backdrop}` : posterSrc)
                        const quality    = ch.activeStream?.quality
                        const badgeColor = quality && quality !== 'UNKNOWN' ? QUALITY_BADGE_COLOR[quality] : null
                        const textColor  = quality === 'HD' ? '#fff' : '#000'

                        return (
                          <div key={ci} onClick={() => onPlay(ch)} style={{
                            position: 'relative',
                            width: cardW, height: CARD_H, flexShrink: 0,
                            marginRight: GAP,
                            zIndex: isFocused ? 10 : 1,
                            borderRadius: Math.round(8 * VW), cursor: 'pointer', overflow: 'hidden',
                            boxShadow: isFocused ? FOCUS_GLOW : 'none',
                            border: isFocused ? FOCUS_BORDER : '1px solid rgba(255,255,255,0.08)',
                            background: '#111',
                          }}>
                            {/* Backdrop wide — sempre presente (carregado, estático) */}
                            <img src={backdropSrc || undefined} style={{
                              position: 'absolute', left: 0, top: 0,
                              width: WIDE_W, height: CARD_H, objectFit: 'cover',
                              zIndex: 1, display: 'block',
                            }} />
                            {/* Poster portrait — some INSTANTANEAMENTE quando focado (sem transition) */}
                            <img src={posterSrc || undefined} style={{
                              position: 'absolute', left: 0, top: 0,
                              width: CARD_W, height: CARD_H, objectFit: 'cover',
                              zIndex: 2, display: 'block',
                              visibility: isFocused ? 'hidden' : 'visible',
                            }} />
                            {/* Gradiente inferior */}
                            <div style={{
                              position: 'absolute', bottom: 0, left: 0, right: 0, height: '50%',
                              background: 'linear-gradient(transparent, rgba(0,0,0,0.92))',
                              zIndex: 3,
                            }} />
                            {/* T\u00edtulo */}
                            <div style={{
                              position: 'absolute', bottom: 14, left: 14, right: 14,
                              zIndex: 4,
                            }}>
                              <div style={{
                                fontSize: 17, fontWeight: 800,
                                fontFamily: "'Barlow Condensed', 'Outfit', sans-serif",
                                textTransform: 'uppercase',
                                overflow: 'hidden', textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                textShadow: '0 2px 10px rgba(0,0,0,0.99)',
                                color: '#fff',
                                paddingRight: isFocused && ch.logo ? 64 : 0,
                              }}>{ch.name}</div>
                            </div>
                            {/* Logo do Canal/Streaming (visivel apenas no card Wide) */}
                            {isFocused && ch.logo && (
                              <img src={ch.logo} style={{
                                position: 'absolute', bottom: 8, right: 14,
                                maxWidth: 56, maxHeight: 34,
                                objectFit: 'contain', zIndex: 5,
                                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.9))',
                                opacity: 0.95
                              }} onError={(e) => (e.currentTarget.style.display = 'none')} />
                            )}
                            {/* Badge de Qualidade */}
                            {badgeColor && (
                              <div style={{
                                position: 'absolute', top: 8, right: 8,
                                background: badgeColor, color: textColor,
                                fontSize: 11, fontWeight: 800,
                                padding: '2px 7px', borderRadius: 4,
                                letterSpacing: 0.8, zIndex: 6,
                                boxShadow: '0 2px 6px rgba(0,0,0,0.5)',
                              }}>{quality}</div>
                            )}
                            {/* Indicador de m\u00faltiplas qualidades */}
                            {ch.variantCount > 1 && (
                              <div style={{
                                position: 'absolute', bottom: 40, right: 8,
                                background: 'rgba(0,0,0,0.65)', color: '#aaa',
                                fontSize: 10, fontWeight: 600,
                                padding: '2px 6px', borderRadius: 4, zIndex: 6,
                              }}>{ch.variantCount} op\u00e7\u00f5es</div>
                            )}
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
                          <div style={{ display: 'flex', fontSize: 18, color: '#e5e5e5', fontWeight: 600, marginBottom: 8, alignItems: 'center' }}>
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
              <div style={{ display: 'flex' }}>
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
            <div style={{ display: 'flex', justifyContent: 'center' }}>
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
      </div>
  )
}
