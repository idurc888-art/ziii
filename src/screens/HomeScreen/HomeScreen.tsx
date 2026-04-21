import { useEffect, useMemo, useRef, useState } from 'react'
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
import { recordPlay, getHeroOffset, saveHeroOffset } from '../../services/historyService'
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
  infantil:      { emoji: '🧸', color: '#f472b6' },
  abertos:       { emoji: '📡', color: '#60a5fa' },
  documentarios: { emoji: '🌍', color: '#34d399' },
  noticias:      { emoji: '📰', color: '#94a3b8' },
  outros:        { emoji: '🔥', color: '#ff6b35' },
  'Top Filmes':  { emoji: '⭐', color: '#fbbf24' },
  'Top Séries':  { emoji: '🏆', color: '#fbbf24' },
  'Lançamentos': { emoji: '🆕', color: '#fb7185' },
  'Comédias':    { emoji: '😂', color: '#fcd34d' },
  'Variados':    { emoji: '🍕', color: '#a78bfa' },
  '4K & UHD':    { emoji: '🖥️', color: '#818cf8' },
  'Ação':        { emoji: '💥', color: '#f87171' },
  'Terror':      { emoji: '👻', color: '#9ca3af' },
  'Nacionais':   { emoji: '🇧🇷', color: '#4ade80' },
  'Drama':       { emoji: '🎭', color: '#a78bfa' },
  'Animes':      { emoji: '👺', color: '#f472b6' },
  'Infantil':    { emoji: '🧸', color: '#f472b6' },
}

const FOCUS_SCALE    = 1.05
const FOCUS_DURATION = 350
const FOCUS_EASING   = 'cubic-bezier(0.25, 1, 0.5, 1)'
const UNFOCUS_OPACITY = 1
const FOCUS_GLOW = '0 0 20px rgba(255,0,110,0.5), 0 0 40px rgba(255,0,110,0.2), 0 0 60px rgba(255,0,110,0.1), inset 0 0 0 3px #000'
const FOCUS_BORDER = `3px solid #ff006e`

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
// VW is now a reactive state inside the component — see `vw` below

export default function HomeScreen({ groups, onPlay, onBack }: Props) {
  const saved = useRef(loadNavState()).current
  const [focusZone,   setFocusZone]   = useState<FocusZone>((saved?.focusZone as FocusZone) || 'hero')
  const [heroState,   setHeroState]   = useState<HeroState>(saved?.focusZone === 'content' ? 'collapsed' : 'default')
  const [sidebarIdx,  setSidebarIdx]  = useState(0)
  const [topbarIdx,   setTopbarIdx]   = useState(0)
  const [contentRow,  setContentRow]  = useState(saved?.contentRow ?? 0)
  const [contentCols, setContentCols] = useState<number[]>(saved?.contentCols ?? [])
  const [showExit,    setShowExit]    = useState(false)
  const [exitFocus,   setExitFocus]   = useState(0)
  const [activeView,  setActiveView]  = useState<DashboardView>((saved?.activeView as DashboardView) || 'home')
  const [isLoadingContent, setIsLoadingContent] = useState(false)
  const [content, setContent] = useState<ScreenContent | null>(null)
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(mockHeroSlides)
  const [heroAutoplayReady, setHeroAutoplayReady] = useState(false)
  
  // ─── Block Rendering Progressivo (Tizen-safe) ──────────────────────
  // Bloco 1: Hero + primeiras 3 rows (instantâneo)
  // Bloco 2: Rows 4-8 (após 500ms de idle)
  // Bloco 3: Restante (on-demand conforme usuário navega)
  const [maxRenderedRow, setMaxRenderedRow] = useState(3)

  // Bloco 2: carrega automaticamente após UI estabilizar
  useEffect(() => {
    if (!isLoadingContent && content && content.rows.length > 3 && maxRenderedRow <= 3) {
      const timer = setTimeout(() => {
        setMaxRenderedRow(Math.min(8, content.rows.length))
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [isLoadingContent, content, maxRenderedRow])

  // Bloco 3: carrega restante após 3s ou se o usuário chegar perto
  useEffect(() => {
    if (!isLoadingContent && content && content.rows.length > 8 && maxRenderedRow >= 4 && maxRenderedRow < content.rows.length) {
      const timer = setTimeout(() => {
        setMaxRenderedRow(content.rows.length)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [isLoadingContent, content, maxRenderedRow])

  // ─── Responsive viewport scale (base 1920px) ───────────────────────
  const [vw, setVw] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth / 1920 : 1
  )
  useEffect(() => {
    const onResize = () => setVw(window.innerWidth / 1920)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // ─── Content cache per view (troca de aba instantânea) ──────────────
  const contentCache = useRef<Partial<Record<DashboardView, ScreenContent>>>({})

  // ─── Load content ──────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false

    // Cache hit: retorna instantâneo
    const cached = contentCache.current[activeView]
    if (cached) {
      setContent(cached)
      setIsLoadingContent(false)
      setContentRow(0)
      setMaxRenderedRow(3) // ★ Reset lazy loading
      setContentCols(prev => {
        if (prev.length === cached.rows.length) return prev
        return new Array(cached.rows.length).fill(0)
      })
      // Rebuild hero slides from cache
      setHeroSlides(buildHeroSlidesFromData(cached, activeView))
      return
    }

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
        contentCache.current[activeView] = data  // Salva no cache
        setContent(data)
        setIsLoadingContent(false)
        setContentRow(0)
        setMaxRenderedRow(3) // ★ Reset lazy loading
        setContentCols(prev => {
          if (prev.length === data.rows.length) return prev
          return new Array(data.rows.length).fill(0)
        })
        setHeroSlides(buildHeroSlidesFromData(data, activeView))
      }
    }
    load()
    return () => { cancelled = true }
  }, [groups, activeView])

  // ─── Helper: build hero slides from ScreenContent ─────────────────────
  function buildHeroSlidesFromData(data: ScreenContent, view: DashboardView): HeroSlide[] {
    if (view === 'home') {
      return data.heroChannels.map((ch, idx) => {
        const tmdb = data.heroTmdb.get(ch.name)
        return {
          id: `home-${idx}`,
          title: tmdb?.title || ch.name,
          subtitle: ch.group || 'destaque',
          description: tmdb?.overview || `Assista ${ch.name} com a melhor qualidade na ziiiTV.`,
          badge: 'Em destaque',
          backgroundImage: tmdb?.backdrop
            ? `https://image.tmdb.org/t/p/w1280${tmdb.backdrop}`
            : (ch.logo || `https://picsum.photos/1920/1080?random=${idx + 300}`),
          type: 'channel' as const,
          channel: ch,
        }
      })
    } else if (view === 'live') {
      return data.heroChannels.map((ch, idx) => ({
        id: `slide-${idx}`,
        title: ch.name,
        subtitle: ch.group,
        description: `Assista ${ch.name} ao vivo na ziiiTV.`,
        badge: 'Ao Vivo',
        backgroundImage: ch.logo || `https://picsum.photos/1920/1080?random=${idx + 100}`,
        type: 'live' as const,
        channel: ch
      }))
    } else {
      return data.heroChannels.map((ch, idx) => {
        const tmdb = data.heroTmdb.get(ch.name)
        return {
          id: `slide-${idx}`,
          title: tmdb?.title || ch.name,
          subtitle: view === 'movies' ? 'Filme' : 'Série',
          description: tmdb?.overview || `Assista ${ch.name} com a melhor qualidade.`,
          badge: 'Destaque',
          backgroundImage: tmdb?.backdrop
            ? `https://image.tmdb.org/t/p/w1280${tmdb.backdrop}`
            : `https://picsum.photos/1920/1080?random=${idx + 200}`,
          type: view === 'movies' ? 'movie' as const : 'series' as const,
          tmdbId: tmdb?.tmdbId || undefined,
          channel: ch
        }
      })
    }
  }

  // ─── Delay heroAutoplay (não compete com boot da TV) ──────────────────
  useEffect(() => {
    if (!isLoadingContent && rows.length > 0) {
      const t = setTimeout(() => setHeroAutoplayReady(true), 8000)
      return () => clearTimeout(t)
    } else {
      setHeroAutoplayReady(false)
    }
  }, [isLoadingContent])

  const rows: ContentRow[] = content?.rows || []
  
  console.log('[HomeScreen] Render:', { 
    contentExists: !!content, 
    rowsCount: rows.length,
    heroSlidesCount: heroSlides.length,
    focusZone,
    activeView
  })

  // Netflix-style hero autoplay configs
  const heroAutoplayConfig = useMemo(() => ({
    previewDuration: 30_000,
    getSeekOffset: (ch: Channel) => getHeroOffset(ch.name),
    onStopped: (ch: Channel, offsetMs: number) => {
      saveHeroOffset(ch.name, offsetMs)
    },
  }), [])

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
        const rowTop = row.offsetTop
        const wrapperHeight = wrapper.clientHeight
        const rowHeight = row.clientHeight
        
        // Centraliza a row focada, deixando espaço para ver a próxima
        const targetScroll = rowTop - (wrapperHeight - rowHeight) / 2 + 100
        wrapper.scrollTo({ top: targetScroll, behavior: 'smooth' })
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
        const rowData = allRows[rw]
        const isGrid = rowData?.type === 'grid'
        const c = cols[rw]

        if (isDown) {
          if (isGrid && c < 4 && rowData.channels.length > c + 4) {
            const next = [...cols]; next[rw] = c + 4; setContentCols(next)
          } else if (rw < allRows.length - 1) {
            const nextRow = rw + 1
            setContentRow(nextRow)
            // ★ Lazy loading: expande buffer quando usuário desce
            if (nextRow >= maxRenderedRow - 1) {
              setMaxRenderedRow(prev => Math.min(prev + 2, allRows.length))
            }
          }
        } else if (isUp) {
          if (isGrid && c >= 4) {
            const next = [...cols]; next[rw] = c - 4; setContentCols(next)
          } else if (rw === 0) {
            setFocusZone('hero'); setHeroState('focused')
          } else {
            setContentRow(rw - 1)
          }
        } else if (isRight) {
          if (isGrid && (c === 3 || c === 7)) return // stay in grid
          const maxCol = (rowData?.channels.length || 1) - 1
          if (c < maxCol) { const next = [...cols]; next[rw]++; setContentCols(next) }
        } else if (isLeft) {
          if (isGrid && (c === 0 || c === 4)) { setFocusZone('sidebar') }
          else if (c > 0) { const next = [...cols]; next[rw]--; setContentCols(next) }
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
        width: focusZone === 'sidebar' ? 320 : 16,
        height: focusZone === 'sidebar' ? '100%' : 16,
        borderRadius: focusZone === 'sidebar' ? 0 : 8,
        background: focusZone === 'sidebar' ? 'rgba(10,10,10,0.97)' : '#ff006e',
        backdropFilter: 'blur(20px)',
        border: focusZone === 'sidebar' ? '1px solid rgba(255,0,110,0.3)' : 'none',
        boxShadow: focusZone === 'sidebar'
          ? '0 0 60px rgba(255,0,110,0.5), inset 0 0 30px rgba(255,0,110,0.05)'
          : '0 0 24px rgba(255,0,110,0.8), 0 0 8px rgba(255,0,110,1)',
        zIndex: 999,
        display: 'flex', flexDirection: 'column',
        alignItems: focusZone === 'sidebar' ? 'flex-start' : 'center',
        justifyContent: focusZone === 'sidebar' ? 'flex-start' : 'center',
        paddingTop: focusZone === 'sidebar' ? 120 : 0,
        transition: 'all 520ms cubic-bezier(0.25,1,0.5,1)',
        overflow: 'hidden',
      }}>
        {/* Quando fechado não tem mais "z", é apenas a bolinha que editamos acima */}

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

      {/* ── CORPO PRINCIPAL (tela inteira) ───────────────────────────────── */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        overflow: 'hidden',
      }}>

        {/* ── TOPBAR (flutuante sobre banner — Netflix style) ───────────── */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        zIndex: 90,
        height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '0 80px',
        background: focusZone === 'hero'
          ? 'linear-gradient(to bottom, rgba(0,0,0,0.5), transparent)'
          : isHeroVisible
            ? 'linear-gradient(to bottom, rgba(0,0,0,0.85), rgba(0,0,0,0.4), transparent)'
            : 'rgba(0,0,0,0.92)',
        borderBottom: focusZone === 'topbar' ? '2px solid #ff006e' : '2px solid transparent',
        boxShadow: focusZone === 'topbar' ? '0 4px 24px rgba(255,0,110,0.4)' : 'none',
        transition: 'all 520ms cubic-bezier(0.25,1,0.5,1)',
      }}>
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

        {/* BANNER — Banner Principal e Background de Vídeo Global */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          overflow: 'hidden',
          transition: 'all 520ms cubic-bezier(0.25,1,0.5,1)',
          zIndex: focusZone === 'content' ? 0 : 10,
          border: focusZone === 'hero' ? '2px solid #ff006e' : '2px solid transparent',
          boxShadow: focusZone === 'hero' ? '0 0 32px rgba(255,0,110,0.55), 0 0 80px rgba(255,0,110,0.25)' : 'none',
        }}>
          <HeroBanner
            slides={heroSlides}
            autoPlayInterval={0}
            focused={focusZone === 'hero'}
            hideUI={focusZone === 'content'}
            heroAutoplay={activeView === 'home' && heroAutoplayReady ? heroAutoplayConfig : undefined}
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

        {/* ROWS — scroll próprio, por cima do background */}
        {rows.length === 0 ? (
          <div style={{
            position: 'absolute',
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            color: '#fff',
            fontSize: 24,
            textAlign: 'center',
            zIndex: 100
          }}>
            <div>Carregando conteúdo...</div>
            <div style={{ fontSize: 16, color: '#888', marginTop: 12 }}>
              {Object.keys(groups).length === 0 ? 'Aguardando playlist...' : 'Processando canais...'}
            </div>
          </div>
        ) : null}
        <div
          ref={rowsWrapRef}
          style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            overflowY: 'auto',
            overflowX: 'hidden',
            paddingTop: focusZone === 'content' ? '100px' : 'calc(100vh - 220px)',
            transition: 'padding-top 520ms cubic-bezier(0.25,1,0.5,1)',
            scrollBehavior: 'smooth',
            zIndex: 15,
            background: focusZone === 'content' ? 'linear-gradient(to bottom, rgba(20,20,20,0.95) 0%, rgba(10,10,10,1) 20%, #000 100%)' : 'transparent',
          }}
        >
          {rows.map((row, rowIdx) => {
            // ★ Block Rendering: placeholder skeleton para rows pendentes
            if (rowIdx > maxRenderedRow) {
              return (
                <div key={rowIdx} style={{ height: 260, padding: '24px 80px', opacity: 0.3 }}>
                  <div style={{ 
                    fontSize: 22, fontWeight: 800, color: 'rgba(255,255,255,0.3)',
                    marginBottom: 16
                  }}>
                    {row.title}<span style={{ color: ACCENT }}>{row.titleAccent}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 12 }}>
                    {[0,1,2,3,4].map(i => (
                      <div key={i} style={{
                        width: 160, height: 200, borderRadius: 10,
                        background: 'rgba(255,255,255,0.04)',
                      }} />
                    ))}
                  </div>
                </div>
              )
            }
            
            const isRowFocused = focusZone === 'content' && contentRow === rowIdx
            // Espaço mínimo para descrição + máxima prévia da próxima row
            const extraPadding = isRowFocused ? 0 : 0
            
            return (
              <div
                ref={el => { rowRefs.current[rowIdx] = el }}
                key={rowIdx}
                style={{
                  padding: '24px 0',
                  paddingBottom: `${24 + extraPadding}px`,
                  overflow: 'visible',
                  // Primeira row: padding mínimo para ficar mais perto do topo
                  // Demais rows: padding normal para quando scrollarem para o topo
                  paddingTop: rowIdx === 0 ? '0px' : '100px'
                }}
              >
                <div style={{
                  padding: '0 80px', display: 'flex', justifyContent: 'space-between',
                  alignItems: 'center', marginBottom: 6,
                }}>
                  <div style={{
                    fontSize: 22, fontWeight: 800, textTransform: 'lowercase',
                    color: isRowFocused ? '#fff' : 'rgba(255,255,255,0.5)',
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
                const CARD_W   = Math.round(317 * vw)   // portrait
                const CARD_H   = Math.round(475 * vw)   // altura fixa
                const WIDE_W   = Math.round(840 * vw)   // wide no foco
                const GAP      = Math.round(16  * vw)
                const LEFT_PAD = Math.round(80  * vw)

                const isRowFocused = focusZone === 'content' && contentRow === rowIdx
                const focusedIndex = contentCols[rowIdx] || 0
                const isVirtualRow = Math.abs(contentRow - rowIdx) <= 2

                if (!isVirtualRow) return <div style={{ height: CARD_H + 40 }} />
                const cameraShift = -(focusedIndex * (CARD_W + GAP))

                return (
                  <div style={{
                    position: 'relative', width: '100%',
                    height: CARD_H + 80,
                    paddingTop: Math.round(40 * vw), overflow: 'visible',
                  }}>
                    <div style={{
                      position: 'absolute', left: LEFT_PAD, top: Math.round(40 * vw),
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
                            borderRadius: Math.round(8 * vw), cursor: 'pointer', overflow: 'hidden',
                            boxShadow: isFocused ? FOCUS_GLOW : 'none',
                            border: isFocused ? FOCUS_BORDER : '1px solid rgba(255,255,255,0.08)',
                            background: '#111',
                          }}>
                            {/* Video preview — toca quando focado */}
                            {isFocused && ch.activeStream?.url && (
                              <video
                                src={ch.activeStream.url}
                                autoPlay
                                loop
                                playsInline
                                onCanPlay={(e) => {
                                  const video = e.currentTarget
                                  // Só faz seek se for VOD e seekable
                                  if (video.seekable.length > 0 && video.duration > 240) {
                                    video.currentTime = 240
                                    console.log(`[VideoPreview] ${ch.name} → Seek para 240s (duration: ${Math.round(video.duration)}s)`)
                                  } else {
                                    console.log(`[VideoPreview] ${ch.name} → Sem seek (seekable: ${video.seekable.length}, duration: ${Math.round(video.duration)}s)`)
                                  }
                                }}
                                onPlay={(e) => {
                                  const video = e.currentTarget
                                  console.log(`[VideoPreview] ${ch.name} → PLAYING at ${Math.round(video.currentTime)}s`)
                                }}
                                style={{
                                  position: 'absolute', left: 0, top: 0,
                                  width: WIDE_W, height: CARD_H, objectFit: 'cover',
                                  zIndex: 5, display: 'block',
                                }}
                              />
                            )}
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
                            
                            {/* Título dentro do card (parte inferior) */}
                            <div style={{
                              position: 'absolute', bottom: 12, left: 12, right: 12,
                              zIndex: 4,
                              fontFamily: (() => {
                                const fonts = [
                                  'Inter, sans-serif',
                                  'Outfit, sans-serif',
                                  'Barlow Condensed, sans-serif',
                                  'Georgia, serif',
                                  'Courier New, monospace',
                                ]
                                return fonts[ci % fonts.length]
                              })(),
                              fontSize: isFocused ? 72 : 14,
                              fontWeight: 700,
                              color: '#fff',
                              textShadow: '0 4px 12px rgba(0,0,0,0.9)',
                              lineHeight: 1.1,
                              wordWrap: 'break-word',
                              whiteSpace: 'normal',
                            }}>
                              {ch.name.replace(/[\[\]\{\}\(\)]/g, '').trim()}
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

                  </div>
                )
              })()}

              {/* Descrição EMBAIXO dos cards */}
              {isRowFocused && (() => {
                const focusedIdx = contentCols[rowIdx] || 0
                const fch = row.channels[focusedIdx]
                if (!fch) return null
                const tmdb = row.tmdb?.get(fch.name) || liveTmdbData[fch.name]
                const year = tmdb?.year || ''
                const overview = tmdb?.overview || ''
                const genres = (tmdb as any)?.genres?.slice(0, 2).join(' • ') || ''
                
                // Divide overview em 3 linhas (aproximado)
                const words = (overview || 'Descrição não disponível.').split(' ')
                const wordsPerLine = Math.ceil(words.length / 3)
                const line1 = words.slice(0, wordsPerLine).join(' ')
                const line2 = words.slice(wordsPerLine, wordsPerLine * 2).join(' ')
                const line3 = words.slice(wordsPerLine * 2).join(' ')
                
                return (
                  <div 
                    key={fch.id}
                    style={{
                      padding: '0 80px 0',
                      minHeight: '100px',
                      marginTop: '-10px',
                    }}>
                    <style>{`
                      @keyframes typewriter {
                        from { width: 0; }
                        to { width: 100%; }
                      }
                      @keyframes fadeIn {
                        to { opacity: 1; }
                      }
                      .typewriter-line {
                        overflow: hidden;
                        white-space: nowrap;
                        opacity: 0;
                      }
                      .typewriter-line-1 {
                        animation: typewriter 0.6s steps(30) forwards, fadeIn 0.1s forwards;
                        animation-delay: 0s, 0s;
                      }
                      .typewriter-line-2 {
                        animation: typewriter 0.6s steps(30) forwards, fadeIn 0.1s forwards;
                        animation-delay: 0.6s, 0.6s;
                      }
                      .typewriter-line-3 {
                        animation: typewriter 0.6s steps(30) forwards, fadeIn 0.1s forwards;
                        animation-delay: 1.2s, 1.2s;
                      }
                    `}</style>
                    
                    {/* Tags minimalistas com cores */}
                    <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                      {genres && genres.split(' • ').map((g: string, i: number) => {
                        const colors = [
                          { bg: 'rgba(255, 107, 107, 0.15)', border: 'rgba(255, 107, 107, 0.4)', text: '#ff6b6b' }, // vermelho
                          { bg: 'rgba(255, 179, 217, 0.15)', border: 'rgba(255, 179, 217, 0.4)', text: '#ffb3d9' }, // rosa
                          { bg: 'rgba(138, 201, 255, 0.15)', border: 'rgba(138, 201, 255, 0.4)', text: '#8ac9ff' }, // azul
                          { bg: 'rgba(255, 214, 102, 0.15)', border: 'rgba(255, 214, 102, 0.4)', text: '#ffd666' }, // amarelo
                          { bg: 'rgba(129, 236, 236, 0.15)', border: 'rgba(129, 236, 236, 0.4)', text: '#81ecec' }, // ciano
                        ]
                        const color = colors[i % colors.length]
                        return (
                          <div key={i} style={{
                            background: color.bg,
                            border: `1px solid ${color.border}`,
                            borderRadius: 6,
                            padding: '4px 12px',
                            fontSize: 13,
                            fontWeight: 600,
                            color: color.text,
                            fontFamily: 'Inter, sans-serif',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                          }}>
                            {g}
                          </div>
                        )
                      })}
                      {year && (
                        <div style={{
                          background: 'rgba(168, 85, 247, 0.15)',
                          border: '1px solid rgba(168, 85, 247, 0.4)',
                          borderRadius: 6,
                          padding: '4px 12px',
                          fontSize: 13,
                          fontWeight: 600,
                          color: '#a855f7',
                          fontFamily: 'Inter, sans-serif',
                        }}>
                          {year}
                        </div>
                      )}
                    </div>
                    
                    <div style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: 23,
                      color: '#ffb3d9',
                      lineHeight: 1.5,
                      fontWeight: 300,
                      maxWidth: '55%',
                      textShadow: '0 0 20px rgba(255, 179, 217, 0.4)',
                    }}>
                      <div className="typewriter-line typewriter-line-1">{line1}</div>
                      <div className="typewriter-line typewriter-line-2">{line2}</div>
                      <div className="typewriter-line typewriter-line-3">{line3}</div>
                    </div>
                  </div>
                )
              })()}
            </div>
          )})}
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
