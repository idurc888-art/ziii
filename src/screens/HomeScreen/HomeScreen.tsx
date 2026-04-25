import React, { useEffect, useRef, useState } from 'react'
import type { UICategory } from '../../services/categoryMapper'
import type { ContentRow, ScreenContent } from '../../services/contentSelector'
import type { TMDBResult } from '../../services/tmdbService'
import { enrichChannel } from '../../services/tmdbService'
import { expandManager } from '../../services/expandManager'
import { playerManager } from '../../services/PlayerManager'
import { Logger } from '../../services/LoggerService'
import { loadingObserver } from '../../services/loadingObserver'
import { debugStore } from '../../components/DebugOverlay'
import AutoplayCard from '../../components/AutoplayCard'
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
// ACCENT e GLOW são dinâmicos dentro do componente (verde=live, rosa=default)
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

const FOCUS_SCALE    = 1.08
const FOCUS_DURATION = 0 // DIRETO E RETO (0ms), também conserta o bug do getBoundingClientRect no AVPlay
const FOCUS_EASING   = 'linear'
const UNFOCUS_OPACITY = 0.85
// ACCENT e FOCUS_BORDER são dinâmicos agora (ver dentro do componente)

// Constrói URL de imagem TMDB. Aceita paths relativos (/abc.jpg) ou URLs completas
// (catalog.ts armazena URLs completas com tamanho já embutido)
function tmdbImg(path: string | undefined | null, size = 'w342'): string | null {
  if (!path) return null
  if (path.startsWith('http')) return path
  if (path.startsWith('/')) return `https://image.tmdb.org/t/p/${size}${path}`
  return null
}

// ─── State Persistence ──────────────────────────────────────────────────────
const STATE_KEY = 'ziiiTV_homeState'
function saveNavState(data: { focusZone: string; contentRow: number; contentCols: number[]; activeView: string }) {
  try { localStorage.setItem(STATE_KEY, JSON.stringify(data)) } catch (_) {}
}
function loadNavState(): { focusZone?: string; contentRow?: number; contentCols?: number[]; activeView?: string } | null {
  try { return JSON.parse(localStorage.getItem(STATE_KEY) || 'null') } catch (_) { return null }
}

// ─── Netflix Architecture: React.memo + Component Pooling + Surface Cache Shielding ───
const MemoizedSideCard = React.memo<{
  ci: number; ch: Channel; offset: number;
  translateX: number; topOffset: number;
  width: number; height: number;
  borderRadius: number; border: string;
  isFocused: boolean; isUnderCenter: boolean;
  posterSrc: string; onPlay: (ch: Channel) => void;
}>(({ ch, offset, translateX, topOffset, width, height, borderRadius, border, isFocused, isUnderCenter, posterSrc, onPlay }) => {
  // Surface Cache Shielding: apenas os cards contíguos (-2 a +2) renderizam a imagem
  // Os das bordas mantêm o DOM, mas eliminam a imagem da GPU.
  const isFarEdge = offset <= -3 || offset >= 3
  const isEdge = offset <= -3 || offset >= 4

  return (
    <div onClick={() => onPlay(ch)} style={{
      position: 'absolute', 
      top: topOffset,
      width, height,
      zIndex: isUnderCenter ? 0 : 1,
      borderRadius,
      cursor: 'pointer', overflow: 'hidden',
      border,
      background: '#111',
      transform: `translate3d(${translateX}px, 0px, 0px)`,
      // O side card no centro agora CONTINUA VISÍVEL durante o "idle" do preview!
      // Ele só é encoberto pelo AutoplayCard (que ganha opacidade 1) quando o delay de 1.5s acaba!
      opacity: isFocused ? 1 : 0.6,
      // Tizen Bug Fix: 'visibility: hidden' para os fora de vista (se houver),
      // mas os side cards vizinhos ficam visible
      visibility: 'visible',
      // NETFLIX SLIDE: a chave agora é baseada no canal (ci), não no slot (offset)
      // Isso garante que cada canal tenha seu próprio DOM element que REALMENTE se move
      // quando o translateX muda. A CSS transition aqui ANIMA esse movimento.
      transition: isFocused && !isEdge
        ? 'transform 380ms cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 300ms ease-out, visibility 300ms step-end'
        : 'none',
      willChange: 'transform, opacity',
      WebkitBackfaceVisibility: 'hidden' as any,
    }}>
      <img src={isFarEdge ? undefined : (posterSrc || undefined)} style={{
        position: 'absolute', left: 0, top: 0,
        width: '100%', height: '100%', objectFit: 'cover',
        zIndex: 1, display: isFarEdge ? 'none' : 'block',
      }} />
      {offset === -1 && !isFarEdge && (
        <div style={{
          position: 'absolute', inset: 0,
          background: 'rgba(0, 0, 0, 0.25)',
          zIndex: 2, pointerEvents: 'none'
        }} />
      )}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '45%',
        background: 'linear-gradient(transparent, rgba(0,0,0,0.85))',
        zIndex: 3,
      }} />
      <div style={{
        position: 'absolute', bottom: 12, left: 14, right: 14,
        zIndex: 4, fontSize: 16, fontWeight: 800, color: '#fff',
        textShadow: '0 2px 6px rgba(0,0,0,1)', lineHeight: 1.2,
        overflow: 'hidden', textOverflow: 'ellipsis',
        display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
      }}>
        {ch.name.replace(/[\[\]\{\}\(\)]/g, '').trim()}
      </div>
    </div>
  )
}, (prev, next) => {
  // Netflix sliding: re-render quando o translateX muda (canal se moveu) ou identidade do canal mudou
  return prev.ch.id === next.ch.id &&
         prev.translateX === next.translateX &&
         prev.topOffset === next.topOffset &&
         prev.isFocused === next.isFocused &&
         prev.isUnderCenter === next.isUnderCenter
})

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

// Escala proporcional ao viewport — garante visual idêntico em 1280, 1366 e 1920px
// Base de design: 1920px. Cards de 317px nessa base.
// VW is now a reactive state inside the component — see `vw` below

export default function HomeScreen({ groups, onPlay, onBack }: Props) {
  const saved = useRef(loadNavState()).current
  const [focusZone,   setFocusZone]   = useState<FocusZone>((saved?.focusZone as FocusZone) === 'topbar' ? 'topbar' : 'content')
  const [heroState,   setHeroState]   = useState<HeroState>('collapsed')
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
  const [heroAutoplayReady] = useState(false)

  // Derivado de content (precisa estar antes dos useEffect que o usam)
  const rows: ContentRow[] = content?.rows || []

  // Cor dinâmica: verde para TV ao vivo, rosa para o resto
  const ACCENT = activeView === 'live' ? '#10b981' : '#ff006e'
  const GLOW   = activeView === 'live' ? 'rgba(16, 185, 129, 0.4)' : 'rgba(255, 0, 110, 0.4)'
  const FOCUS_BORDER = `3px solid ${ACCENT}`

  // ─── Video Preview Inteligente (Netflix-style) ─────────────────────
  const videoPreviewTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)

  // ─── Display toggle para liberar RAM durante o fullscreen ────────────
  const [homeVisible, setHomeVisible] = useState(true)
  useEffect(() => {
    const unsub = expandManager.registerDisplayCallback((visible) => {
      setHomeVisible(visible)
    })
    return () => { unsub() }
  }, [])
  
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

  // ─── Video Preview: cancela debounce ao navegar ────────────────────
  useEffect(() => {
    if (videoPreviewTimer.current) {
      clearTimeout(videoPreviewTimer.current)
      videoPreviewTimer.current = null
    }
    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.src = ''
    }
  }, [contentRow, contentCols])

  // ─── Preload de imagens adjacentes (±3 cards) ─────────────────────
  // Garante que os posters já estejam no cache do browser antes do usuário chegar
  useEffect(() => {
    if (focusZone !== 'content' || !rows[contentRow]) return
    const row = rows[contentRow]
    const col = contentCols[contentRow] || 0
    const total = row.channels.length
    if (total === 0) return

    for (let offset = -3; offset <= 3; offset++) {
      if (offset === 0) continue
      const idx = ((col + offset) % total + total) % total
      const ch = row.channels[idx]
      if (!ch) continue
      const t = row.tmdb?.get(ch.name) || ch.tmdb
      const sart = getSportsArtwork(ch.name)
      const src = sart?.poster || tmdbImg(t?.poster, 'w342') || tmdbImg(t?.backdrop, 'w342') || ch.logo
      if (src) { const img = new Image(); img.src = src }

      // PRELOAD ADICIONAL (Prevenção de Quadrado Preto no AutoPlayCard)
      // O central usa w780 nas imagens do TMDB, então pre-loadamos isso ativamente 
      // para os 3 canais irmãos mais próximos!
      if (Math.abs(offset) <= 2) {
        const backSrc = sart?.backdrop || tmdbImg(t?.backdrop, 'w780') || src
        if (backSrc) { const bimg = new Image(); bimg.src = backSrc }
      }
    }
  }, [contentRow, contentCols, focusZone, rows])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (videoPreviewTimer.current) clearTimeout(videoPreviewTimer.current)
    }
  }, [])

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
      loadingObserver.lock() // ★ Bloqueia input do controle durante o processamento
      try {
        let data: ScreenContent
        const t0 = performance.now()
        switch (activeView) {
          case 'movies': data = await buildFilmesContent(groups); break
          case 'series': data = await buildSeriesContent(groups); break
          case 'live':   data = await buildTvContent(groups);     break
          default:       data = await buildHomeContent(groups);   break
        }
        Logger.boot('BUILD_CONTENT', `${activeView} em ${(performance.now() - t0).toFixed(1)}ms, ${data.rows.length} rows`)
        if (!cancelled) {
          playerManager.init() // ★ Motor de vídeo desperta apenas agora
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
      } finally {
        // ★ GARANTE que a TV nunca fique travada esperando o fim do load
        loadingObserver.unlock()
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
          backgroundImage: tmdbImg(tmdb?.backdrop, 'w1280') || ch.logo || `https://picsum.photos/1920/1080?random=${idx + 300}`,
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
          backgroundImage: tmdbImg(tmdb?.backdrop, 'w1280') || `https://picsum.photos/1920/1080?random=${idx + 200}`,
          type: view === 'movies' ? 'movie' as const : 'series' as const,
          tmdbId: tmdb?.tmdbId || undefined,
          channel: ch
        }
      })
    }
  }

  const heroAutoplayConfig = {
    previewDuration: 30_000,
    getSeekOffset: (_ch: Channel) => 0,
    onStopped: (_ch: Channel, _offsetMs: number) => {},
  }

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
    let cancelled = false
    if (debouncedPreview) {
      const name = debouncedPreview.name
      if (liveTmdbData[name] === undefined && !rows[contentRow]?.tmdb?.has(name)) {
        enrichChannel(name).then(res => {
          if (!cancelled) setLiveTmdbData(prev => ({ ...prev, [name]: res }))
        })
      }
    }
    return () => { cancelled = true }
  }, [debouncedPreview, contentRow, rows, liveTmdbData])

  // ─── Manifest Pre-Warming (Hardware Shielding) ──────────────────────────
  useEffect(() => {
    if (focusZone !== 'content' || !rows[contentRow]) return

    const col = contentCols[contentRow]
    const channels = rows[contentRow].channels

    // Encontra a stream SD
    const getSDStream = (ch: Channel) => {
      if (!ch?.streams?.length) return null
      return [...ch.streams].sort((a,b) => {
        const Q: Record<string, number> = { 'SD': 1, 'HD': 2, 'FHD': 3, '4K': 4 }
        return (Q[a.quality] || 5) - (Q[b.quality] || 5)
      })[0]?.url
    }

    const prevUrl = getSDStream(channels[col - 1])
    const nextUrl = getSDStream(channels[col + 1])

    if (prevUrl) playerManager.prefetchManifest(prevUrl)
    if (nextUrl) playerManager.prefetchManifest(nextUrl)
  }, [focusZone, contentRow, contentCols, rows])

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

  // ─── Navegação Vertical Estática (Zero Layout Shift via GPU + Vanilla JS Bypass) ───
  // O translateY é aplicado DIRETAMENTE no DOM via Vanilla JS.
  // Isso evita que o React re-renderize 1300 linhas de código a cada toque no D-pad.
  const rowRefs    = useRef<(HTMLDivElement | null)[]>([])
  const rowsWrapRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!rowsWrapRef.current) return
    const vh = window.innerHeight
    
    if (focusZone !== 'content') {
      // Volta para baixo confiavelmente (fora da tela visual)
      rowsWrapRef.current.style.transform = `translate3d(0, ${vh * 0.7}px, 0)`
      return
    }
    const row = rowRefs.current[contentRow]
    if (row) {
      const rowTop = row.offsetTop
      const rowHeight = row.clientHeight
      const targetScroll = rowTop - (vh - rowHeight) / 2
      // Vanilla JS Bypass: aplica direto no DOM
      rowsWrapRef.current.style.transform = `translate3d(0, -${targetScroll}px, 0)`
    }
  }, [contentRow, focusZone])

  // LEVEZA E LIMPEZA: Log de Memory Flush ao sair da Home
  useEffect(() => {
    return () => {
      Logger.mem('FLUSH', 'HomeScreen unmounted - RAM liberada forçadamente pelo React')
    }
  }, [])

  // ─── D-pad Navigation ────────────────────────────────────────────────
  const lastTRef = useRef(0)
  
  const onKey = (e: KeyboardEvent) => {
    const now = Date.now()
    if (now - lastTRef.current < 200) return
    lastTRef.current = now

    // BUG 1 FIX: Navegação cancela autoplay, mas Enter NÃO cancela (ele expande para fullscreen).
    // O cancelamento é fire-and-forget: limpa o debounce mas não para o vídeo se já estiver tocando.
    const isNavKey = e.keyCode === 37 || e.keyCode === 38 || e.keyCode === 39 || e.keyCode === 40
    if (focusZoneRef.current === 'content' && isNavKey) {
      playerManager.cancelRequest()
    }

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
      // Leitura atômica via Zustand fora do ciclo de renderização
      // Instante milissegundos bypass React (usamos o Zustand via dispatch se necessário)
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
              if (ch) {
                // Se o PlayerManager está tocando, dispara expansão fullscreen diretamente
                if (playerManager.isPlaying()) {
                  playerManager.expandToFullscreen()
                  expandManager.triggerExpand(ch, { x: 0, y: 0, w: 1920, h: 1080 }, 'avplay-global-preview', () => {
                    playerManager.collapseToCard()
                    expandManager.markCollapsing()
                    setTimeout(() => expandManager.markIdle(), 50)
                  })
                  expandManager.markFullscreen()
                  return
                }
                // Caso contrário, navega para DetailScreen
                recordPlay(ch.name, ch.group)
                onPlay(ch)
              }
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
        if (isRight) {
          if (topbarRef.current >= TOPBAR_LINKS.length - 1) {
            debugStore.toggle()
          } else {
            setTopbarIdx(i => Math.min(i + 1, TOPBAR_LINKS.length - 1))
          }
        } else if (isLeft) {
          if (topbarRef.current <= 0) setFocusZone('sidebar')
          else setTopbarIdx(i => Math.max(i - 1, 0))
        }
        else if (isDown)  { setFocusZone('content'); setContentRow(0) }
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
            setFocusZone('topbar')
          } else {
            setContentRow(rw - 1)
          }
        } else if (isRight) {
          if (isGrid && (c === 3 || c === 7)) return // stay in grid
          const maxCol = (rowData?.channels.length || 1) - 1
          // Lista infinita circular: passar do fim volta ao início
          const next = [...cols]
          next[rw] = c >= maxCol ? 0 : c + 1
          setContentCols(next)
        } else if (isLeft) {
          if (isGrid && (c === 0 || c === 4)) { /* Bloqueado: ir pro menu topo primeiro */ }
          else {
            // Lista infinita circular: passar do início volta ao fim
            const maxCol = (rowData?.channels.length || 1) - 1
            const next = [...cols]
            next[rw] = c <= 0 ? maxCol : c - 1
            setContentCols(next)
          }
        }
        return
      }
    }
    
  const handlerRef = useRef(onKey)
  handlerRef.current = onKey

  useEffect(() => {
    // ★ Bypass Global Key Listener Vanilla JS 
    const wrapper = (e: KeyboardEvent) => handlerRef.current(e)
    window.addEventListener('keydown', wrapper)
    return () => window.removeEventListener('keydown', wrapper)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Persist ─────────────────────────────────────────────────────────
  useEffect(() => {
    saveNavState({ focusZone, contentRow, contentCols, activeView })
  }, [focusZone, contentRow, contentCols, activeView])

  // Helpers de estilo
  const topbarItemGlow = (active: boolean) => active
    ? {
        boxShadow: '0 0 0 2px #ff006e, 0 0 18px rgba(255,0,110,0.55), 0 0 40px rgba(255,0,110,0.2)',
        background: 'rgba(255,0,110,0.14)',
      }
    : {}

  // ═══════════════════════════════════════════════════════════════════════
  // RENDER
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      // TIZEN HOLE PUNCH: O container raiz DEVE ser transparent.
      // O AVPlay renderiza como layer de hardware ABAIXO do HTML.
      // Qualquer background sólido aqui tamparia 100% do vídeo.
      // Cada seção que precisar de fundo preto tem seu próprio background localizado.
      background: 'transparent',
      color: '#fff',
      fontFamily: "'Outfit', sans-serif",
      overflow: 'hidden',
      opacity: homeVisible ? 1 : 0, 
      pointerEvents: homeVisible ? 'auto' : 'none',
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
        border: focusZone === 'sidebar' ? '1px solid rgba(255,0,110,0.3)' : 'none',
        boxShadow: focusZone === 'sidebar'
          ? '0 0 20px rgba(255,0,110,0.3)'
          : '0 0 8px rgba(255,0,110,0.6)',
        zIndex: 999,
        display: 'flex', flexDirection: 'column' as const,
        alignItems: focusZone === 'sidebar' ? 'flex-start' : 'center',
        justifyContent: focusZone === 'sidebar' ? 'flex-start' : 'center',
        paddingTop: focusZone === 'sidebar' ? 120 : 0,
        transition: 'width 350ms ease-out, height 350ms ease-out, top 350ms ease-out, left 350ms ease-out, background 350ms ease-out, border-radius 350ms ease-out, opacity 350ms ease-out',
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
                boxShadow: isActive ? `0 0 0 2px ${ACCENT}` : 'none',
                transition: 'background 200ms ease, color 200ms ease, box-shadow 200ms ease',
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
        background: 'rgba(0,0,0,0.92)',
        borderBottom: focusZone === 'topbar' ? '2px solid #ff006e' : '2px solid transparent',
        boxShadow: focusZone === 'topbar' ? '0 2px 12px rgba(255,0,110,0.3)' : 'none',
        transition: 'background 350ms ease, border-color 200ms ease, box-shadow 200ms ease, opacity 350ms ease, transform 350ms ease',
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {TOPBAR_LINKS.map((link, i) => {
            const active        = focusZone === 'topbar' && topbarIdx === i
            const isCurrentView = activeView === link.view
            return (
              <div key={i} style={{
                fontSize: 18, fontWeight: 700, textTransform: 'lowercase',
                color: active ? '#fff' : (isCurrentView ? ACCENT : 'rgba(255,255,255,0.35)'),
                padding: '6px 14px', borderRadius: 4,
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
          transition: 'border-color 200ms ease, opacity 350ms ease-out',
          zIndex: focusZone === 'content' ? 0 : 10,
          opacity: focusZone === 'hero' ? 1 : 0,
          pointerEvents: focusZone === 'hero' ? 'auto' : 'none',
          border: focusZone === 'hero' ? '2px solid #ff006e' : '2px solid transparent',
        }}>
          <HeroBanner
            slides={heroSlides}
            autoPlayInterval={0}
            focused={focusZone === 'hero'}
            hideUI={focusZone === 'content'}
            heroAutoplay={activeView === 'home' && heroAutoplayReady ? heroAutoplayConfig : undefined}
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
            <div style={{
              width: 36,
              height: 36,
              margin: '0 auto 18px',
              borderRadius: '50%',
              border: '3px solid rgba(255,255,255,0.22)',
              borderTopColor: ACCENT,
              animation: 'spin 800ms linear infinite',
            }} />
            <div>Carregando conteúdo...</div>
            <div style={{ fontSize: 16, color: '#888', marginTop: 12 }}>
              {Object.keys(groups).length === 0 ? 'Aguardando playlist...' : 'Processando canais...'}
            </div>
          </div>
        ) : null}
        <div
          id="scroll-viewport"
          style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            overflow: 'hidden', // Tizen Hardware Otimization: ZERO NATIVE SCROLL
            zIndex: 15,
            pointerEvents: focusZone === 'content' ? 'auto' : 'none',
          }}
        >
          <div
            ref={rowsWrapRef}
            style={{
              paddingTop: '50vh', // Espaço estático; o JS calcula o offset a partir daqui
              transition: 'transform 350ms ease-out, opacity 350ms ease-out',
              // O transform é controlado via Vanilla JS Bypass (useEffect acima)
              willChange: 'transform',
              
            // Banner ativo = full screen, esconde rows completamente
            opacity: focusZone === 'content' ? 1 : 0,
            // Fundo transparente para o vídeo de hardware <object> aparecer!
            background: 'transparent',
          }}
        >
          {/* Gradiente apenas nas bordas - NAO cobre a area central onde o card fica */}
          <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, height: '15%', pointerEvents: 'none', zIndex: 200,
            background: 'linear-gradient(to bottom, #000 0%, transparent 100%)',
            opacity: focusZone === 'content' ? 0.7 : 0,
            transition: 'opacity 350ms ease-out'
          }} />
          <div style={{
            position: 'fixed', bottom: 0, left: 0, right: 0, height: '15%', pointerEvents: 'none', zIndex: 200,
            background: 'linear-gradient(to top, #000 0%, transparent 100%)',
            opacity: focusZone === 'content' ? 0.7 : 0,
            transition: 'opacity 350ms ease-out'
          }} />

          {/* ESPAÇADOR VIRTUAL ESTÁTICO: Mantém o eixo Y inabalável 
              Isso garante que TODA a home tenha o efeito "Preso" (slot machine instantâneo)
              que antes só acontecia após a linha 4. */}
          {(() => {
            const missingTopRows = Math.max(0, 3 - contentRow)
            if (missingTopRows > 0) {
              const vw = window.innerWidth / 1920
              const unFocusedRowHeight = Math.round(475 * 1.10 * vw) + 60
              return <div style={{ height: missingTopRows * unFocusedRowHeight }} />
            }
            return null
          })()}

          {rows.map((row, rowIdx) => {
            // ★ Virtualização Real de DOM: libera RAM agressivamente
            if (Math.abs(contentRow - rowIdx) > 3) {
              return null
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
                  // Extrema compactação vertical pedida
                  paddingTop: rowIdx === 0 ? '0px' : '20px'
                }}
              >
                <div style={{
                  padding: '0 80px', display: 'flex', justifyContent: 'space-between',
                  alignItems: 'flex-end', marginBottom: 0,
                }}>
                  <div style={{
                    fontSize: 20, fontWeight: 800,
                    color: isRowFocused ? '#fff' : 'rgba(255,255,255,0.4)',
                    transition: 'color 200ms', display: 'flex', alignItems: 'center', gap: 10
                  }}>
                    {(() => {
                      const lower = row.title.toLowerCase()
                      const accentSpan = <span style={{ color: ACCENT, fontSize: 18, marginTop: 2 }}>{row.titleAccent}</span>
                      
                      if (lower.includes('netflix')) return <><img src="https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg" style={{ height: 44, opacity: isRowFocused ? 1 : 0.6 }} /> {accentSpan}</>
                      if (lower.includes('max') || lower.includes('hbo')) return <><img src="https://upload.wikimedia.org/wikipedia/commons/c/ce/Max_logo.svg" style={{ height: 36, margin: '2px 0 0', opacity: isRowFocused ? 1 : 0.6 }} /> {accentSpan}</>
                      if (lower.includes('disney')) return <><img src="https://upload.wikimedia.org/wikipedia/commons/3/3e/Disney%2B_logo.svg" style={{ height: 64, margin: '-6px 0 -4px', opacity: isRowFocused ? 1 : 0.6 }} /> {accentSpan}</>
                      if (lower.includes('apple')) return <><img src="https://upload.wikimedia.org/wikipedia/commons/2/28/Apple_TV_Plus_Logo.svg" style={{ height: 40, opacity: isRowFocused ? 1 : 0.6 }} /> {accentSpan}</>
                      if (lower.includes('amazon') || lower.includes('prime')) return <><img src="https://upload.wikimedia.org/wikipedia/commons/f/f1/Prime_Video.png" style={{ height: 36, opacity: isRowFocused ? 1 : 0.6 }} /> {accentSpan}</>
                      if (lower.includes('paramount')) return <><img src="https://upload.wikimedia.org/wikipedia/commons/7/79/Paramount%2B_logo.svg" style={{ height: 36, opacity: isRowFocused ? 1 : 0.6 }} /> {accentSpan}</>
                      
                      return <>{row.title}{accentSpan}</>
                    })()}
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
                        transformOrigin: 'center center',
                        willChange: focused ? 'transform' : 'auto',
                        transform: focused ? `scale(${FOCUS_SCALE}) translateY(-8px)` : 'scale(1) translateY(0)',
                        boxShadow: focused ? `0 8px 32px rgba(0,0,0,0.55)` : 'none',
                        zIndex: focused ? 10 : 0,
                        opacity: focused ? 1 : UNFOCUS_OPACITY,
                        transition: `transform ${FOCUS_DURATION}ms ${FOCUS_EASING}, box-shadow ${FOCUS_DURATION}ms ${FOCUS_EASING}, opacity ${FOCUS_DURATION}ms ${FOCUS_EASING}`,
                        cursor: 'pointer',
                      }}>
                        <span style={{ fontSize: 28 }}>{info.emoji}</span>
                        <span>{cat.name}</span>
                      </div>
                    )
                  })}
                </div>
              ) : (() => {
                // ═══════════════════════════════════════════════════════════════
                // LAYOUT TELVIX — Card Central FIXO + Laterais deslizam por trás
                // ═══════════════════════════════════════════════════════════════
                // REGRA DE OURO: O Card Central NUNCA muda de posição.
                // Ele é ancorado em left:50%, translateX(-50%) — INABALÁVEL.
                // Os cards laterais é que se movem via translate3d passando
                // POR TRÁS do central (z-index inferior).
                // ═══════════════════════════════════════════════════════════════
                // CARDS LATERAIS (Retrato)
                const CARD_W     = Math.round(317 * 1.10 * vw)
                const CARD_H     = Math.round(475 * 1.10 * vw)
                // CARD CENTRAL (Cinema 16:9 - Maior por Inteira)
                // Usando uma base de altura maior que os laterais (+15%), e largura mantendo a proporção de cinema (~16:9)
                const CENTRAL_H  = Math.round(CARD_H * 1.15)
                const CENTRAL_W  = Math.round(CENTRAL_H * 1.77) // 16:9 widescreen ratio
                
                const GAP        = Math.round(16  * vw)
                const SIDE_GAP   = Math.round(24  * vw)
                const TOP_PAD    = Math.round(40  * vw)
                
                // Offset vertical para centralizar os cards laterais menores junto ao centro vertical do cartão gigante
                const LATERAL_TOP_OFFSET = TOP_PAD + Math.round((CENTRAL_H - CARD_H) / 2)

                const isRowFocused = focusZone === 'content' && contentRow === rowIdx
                const focusedIndex = contentCols[rowIdx] || 0
                const isVirtualRow = Math.abs(contentRow - rowIdx) <= 2

                if (!isVirtualRow) return <div style={{ height: CENTRAL_H + 40 }} />

                // ── Dados do card central ────────────────────────
                const fch = row.channels[focusedIndex]
                const fT = row.tmdb?.get(fch?.name || '') || fch?.tmdb
                const fSportsArt = getSportsArtwork(fch?.name || '')
                const fPosterSrc = fSportsArt?.poster || tmdbImg(fT?.poster, 'w342') || fch?.logo || null
                const fBackdropSrc = fSportsArt?.backdrop || tmdbImg(fT?.backdrop, 'w780') || fPosterSrc
                const fQuality = fch?.activeStream?.quality
                const fBadgeColor = fQuality && fQuality !== 'UNKNOWN' ? QUALITY_BADGE_COLOR[fQuality] : null
                const fTextColor = fQuality === 'HD' ? '#fff' : '#000'

                const centralLeft = Math.floor((window.innerWidth - CENTRAL_W) / 2)
                const uniformCenterLeft = Math.floor((window.innerWidth - CARD_W) / 2)

                return (
                  <div style={{
                    position: 'relative', width: '100%',
                    height: isRowFocused ? CENTRAL_H + 80 : CARD_H + 60,
                    overflow: 'visible',
                    // ZERO ANIMAÇÃO NO HEIGHT DA FILEIRA. Muda de fileira = estica/encolhe IMEDIATAMENTE (Zero Layout Shift)
                    transition: 'none',
                  }}>

                    {(() => {
                      const total = row.channels.length
                      const slots: Array<{ ch: typeof row.channels[0]; ci: number; offset: number }> = []
                      for (let offset = -4; offset <= 5; offset++) {
                        const ci = ((focusedIndex + offset) % total + total) % total
                        if (offset !== 0 && slots.some(s => s.ci === ci)) continue
                        slots.push({ ch: row.channels[ci], ci, offset })
                      }
                      return slots.map(({ ch, ci, offset }) => {
                      const isUnderCenter = isRowFocused && offset === 0

                      let translateX: number
                      if (isRowFocused) {
                        if (offset < 0) {
                          translateX = centralLeft - SIDE_GAP - (-offset) * (CARD_W + GAP) + GAP
                        } else if (offset > 0) {
                          translateX = centralLeft + CENTRAL_W + SIDE_GAP + (offset - 1) * (CARD_W + GAP)
                        } else {
                          // Center of the big card slot
                          translateX = centralLeft + Math.floor((CENTRAL_W - CARD_W) / 2)
                        }
                      } else {
                        translateX = uniformCenterLeft + (offset * (CARD_W + GAP))
                      }
                      const activeTopOffset = isRowFocused ? LATERAL_TOP_OFFSET : TOP_PAD


                      const t         = row.tmdb?.get(ch.name) || ch.tmdb
                      const sportsArt = getSportsArtwork(ch.name)
                      const posterSrc = sportsArt?.poster || tmdbImg(t?.poster, 'w342') || ch.logo || ''

                      return (
                        <MemoizedSideCard
                          /* NETFLIX SLIDE: key baseada no CANAL (ci), não no slot (offset).
                             Isso dá a cada canal seu próprio DOM persistente.
                             Quando focusedIndex muda, o translateX de cada canal muda,
                             e a CSS transition anima o deslize real — exatamente como Netflix. */
                          key={`pool-${rowIdx}-${ci}`}
                          ci={ci}
                          ch={ch}
                          offset={offset}
                          translateX={translateX}
                          topOffset={activeTopOffset}
                          width={CARD_W}
                          height={CARD_H}
                          borderRadius={Math.round(8 * vw)}
                          border="1px solid rgba(255,255,255,0.08)"
                          isFocused={isRowFocused}
                          isUnderCenter={isUnderCenter}
                          posterSrc={posterSrc}
                          onPlay={onPlay}
                        />
                      )
                    }) })()}

                    {/* ════════════════════════════════════════════════
                        CARD CENTRAL — FIXO, INABALÁVEL, NUNCA MOVE
                        left: centralizado via cálculo estático
                        z-index: 10 (SEMPRE na frente dos laterais)
                        ════════════════════════════════════════════════ */}
                    {/* CARD CENTRAL — Apenas visível na linha focada */}
                    {fch && isRowFocused && (
                      <AutoplayCard
                        channel={fch}
                        isFocused={true}
                        onClick={() => { recordPlay(fch.name, fch.group); onPlay(fch) }}
                        width={CENTRAL_W}
                        height={CENTRAL_H}
                        left={centralLeft}
                        top={TOP_PAD}
                        zIndex={10}
                        borderRadius={Math.round(8 * vw)}
                        focusBorder={FOCUS_BORDER}
                        backdropSrc={fBackdropSrc || null}
                      >
                        <div style={{
                          position: 'absolute', bottom: 16, left: 16, right: 16,
                          zIndex: 4, fontSize: 38, fontWeight: 800, color: '#fff',
                          textShadow: '0 4px 12px rgba(0,0,0,0.9), 0 2px 4px rgba(0,0,0,1)', lineHeight: 1.1,
                          wordWrap: 'break-word', whiteSpace: 'normal',
                        }}>
                          {fch.name.replace(/[\[\]\{\}\(\)]/g, '').trim()}
                        </div>
                        {fBadgeColor && (
                          <div style={{
                            position: 'absolute', top: 8, right: 8, background: fBadgeColor, color: fTextColor,
                            fontSize: 11, fontWeight: 800, padding: '2px 7px', borderRadius: 4,
                            letterSpacing: 0.8, zIndex: 6,
                          }}>{fQuality}</div>
                        )}
                      </AutoplayCard>
                    )}

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
                const overview = tmdb?.overview || 'Descrição não disponível.'
                const genres = (tmdb as any)?.genres?.slice(0, 2).join(' • ') || ''
                
                return (
                  <div 
                    key={fch.id}
                    style={{
                      // ALTURA FIXA: nunca empurra a row de baixo
                      height: 120,
                      padding: '0 80px',
                      marginTop: '-50px',
                      zIndex: 20,
                      position: 'relative',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textAlign: 'center',
                    }}>
                    {/* Tags centralizadas */}
                    <div style={{ display: 'flex', gap: 8, marginBottom: 8, justifyContent: 'center' }}>
                      {genres && genres.split(' • ').map((g: string, i: number) => {
                        const colors = [
                          { bg: 'rgba(255, 255, 255, 0.08)', border: 'rgba(255, 255, 255, 0.2)', text: '#fff' },
                          { bg: 'rgba(255, 255, 255, 0.08)', border: 'rgba(255, 255, 255, 0.2)', text: '#fff' },
                        ]
                        const color = colors[i % colors.length]
                        return (
                          <div key={i} style={{
                            background: color.bg,
                            border: `1px solid ${color.border}`,
                            borderRadius: 6,
                            padding: '3px 10px',
                            fontSize: 12,
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
                          background: 'rgba(255, 255, 255, 0.08)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          borderRadius: 6,
                          padding: '3px 10px',
                          fontSize: 12,
                          fontWeight: 600,
                          color: '#fff',
                          fontFamily: 'Inter, sans-serif',
                        }}>
                          {year}
                        </div>
                      )}
                    </div>
                    
                    <div style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: 20,
                      color: 'rgba(255, 255, 255, 0.75)',
                      lineHeight: 1.4,
                      fontWeight: 300,
                      maxWidth: '60%',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}>
                      {overview}
                    </div>
                  </div>
                )
              })()}
            </div>
          )})}
        {/* Espaço morto para o footer de paginação */}
        <div style={{ height: 400 }} />
        {/* Fechamento do bloco `rowsWrapRef` manipulado via GPU */}
        </div>
      </div>

      {/* SKELETON SHIMMER LOADING */}
      {isLoadingContent && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.92)', zIndex: 80, padding: '120px 80px 0',
        }}>
          <div style={{
            width: 42,
            height: 42,
            margin: '0 auto 26px',
            borderRadius: '50%',
            border: '3px solid rgba(255,255,255,0.2)',
            borderTopColor: ACCENT,
            animation: 'spin 800ms linear infinite',
          }} />
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
        @keyframes spin {
          to { transform: rotate(360deg); }
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
