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
const GLOW = 'rgba(255, 0, 110, 0.4)'
const BG = '#000000'
const TEXT_MUTED = '#a0a0a0'

const SIDEBAR_ICONS: Array<{ emoji: string; label: string; view?: DashboardView }> = [
  { emoji: '🏠', label: 'home', view: 'home' },
  { emoji: '🎬', label: 'filmes', view: 'movies' },
  { emoji: '⊞', label: 'séries', view: 'series' },
  { emoji: '📺', label: 'live', view: 'live' },
  { emoji: '📈', label: 'esportes' },
  { emoji: '♡', label: 'favoritos' },
]

const TOPBAR_LINKS: Array<{ label: string; view: DashboardView }> = [
  { label: 'FILMES', view: 'movies' },
  { label: 'SERIES', view: 'series' },
  { label: 'TV', view: 'live' },
  { label: 'MINHAS TVS', view: 'home' },
]

const HERO_SLIDES = [
  { title: 'ziiiTV', accent: 'o melhor', rest: 'player', icon: '📺', desc: 'Seu universo de entretenimento alienígena. Milhares de canais ao vivo.' },
  { title: 'invasão', accent: 'cerebral', rest: 'ziiiTV', icon: '👾', desc: 'O melhor conteúdo de filmes, séries e esportes ao vivo.' },
  { title: 'domínio', accent: 'digital', rest: 'ziiiTV', icon: '📺', desc: 'Streaming de alta qualidade direto na sua Smart TV.' },
  { title: 'visão', accent: 'infinita', rest: 'ziiiTV', icon: '♾️', desc: 'Navegação fluida. Categorias inteligentes. Controle total.' },
  { title: 'universo', accent: 'ziiiTV', rest: 'é seu', icon: '🚀', desc: 'O futuro do entretenimento já começou.' },
]

const CATEGORY_ICONS: Record<string, { emoji: string; color: string }> = {
  filmes: { emoji: '🎬', color: '#a78bfa' },
  series: { emoji: '📺', color: '#60a5fa' },
  esportes: { emoji: '⚽', color: '#4ade80' },
  infantil: { emoji: '🎮', color: '#f472b6' },
  abertos: { emoji: '📡', color: '#60a5fa' },
  documentarios: { emoji: '🌍', color: '#34d399' },
  noticias: { emoji: '📰', color: '#94a3b8' },
  outros: { emoji: '🔥', color: '#ff6b35' },
}

// ─── Hero Carousel Item ───────────────────────────────────────────────────
function HeroCarouselItem({
  offset, // -2 -1 0 1 2 (0 = center)
  backdrop,
  poster,
  title,
  group,
  totalChannels,
  focused,
  isFocusZone,
  rating,
  year,
  onSelect,
}: {
  offset: number
  backdrop: string
  poster: string
  title: string
  group: string
  totalChannels: number
  focused: boolean
  isFocusZone: boolean
  rating: number
  year: string
  onSelect: () => void
}) {
  const isCenter = offset === 0
  const absOffset = Math.abs(offset)

  // Layout:
  // center: width=860, height=480, scale=1, opacity=1
  // ±1:     width=680, height=380, scale=0.88, opacity=0.55
  // ±2:     partial visible on edges, scale=0.75, opacity=0.3
  const CARD_W = 860
  const CARD_H = 480
  const GAP = 24

  const scale = isCenter ? 1 : absOffset === 1 ? 0.88 : 0.75
  const opacity = isCenter ? 1 : absOffset === 1 ? 0.55 : 0.28
  const zIdx = isCenter ? 10 : absOffset === 1 ? 6 : 2

  // X position: center at 0, neighbors step outward
  const xStep = CARD_W * 0.72 + GAP
  const x = offset * xStep

  return (
    <div
      onClick={isCenter ? onSelect : undefined}
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        width: CARD_W,
        height: CARD_H,
        transform: `translateX(calc(-50% + ${x}px)) translateY(-50%) scale(${scale})`,
        transformOrigin: 'center center',
        opacity,
        zIndex: zIdx,
        transition: 'all 420ms cubic-bezier(0.34, 1.3, 0.64, 1)',
        borderRadius: 16,
        overflow: 'hidden',
        cursor: isCenter ? 'pointer' : 'default',
        boxShadow: isCenter && isFocusZone
          ? `0 0 0 3px ${ACCENT}, 0 30px 80px rgba(0,0,0,0.9), 0 0 60px ${GLOW}`
          : isCenter
          ? '0 20px 60px rgba(0,0,0,0.8)'
          : '0 8px 24px rgba(0,0,0,0.6)',
      }}
    >
      {/* Backdrop image */}
      <img
        src={backdrop || poster || 'hero-alien.png'}
        alt={title}
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          objectFit: 'cover',
        }}
        onError={(e) => { (e.target as HTMLImageElement).src = 'hero-alien.png' }}
      />

      {/* Dark overlay gradient */}
      <div style={{
        position: 'absolute', inset: 0,
        background: isCenter
          ? 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)'
          : 'rgba(0,0,0,0.5)',
        transition: 'background 400ms',
      }} />

      {/* Info overlay — only on center */}
      {isCenter && (
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          padding: '20px 28px 24px',
          display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
        }}>
          <div>
            {/* Live badge */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: ACCENT, padding: '3px 10px', borderRadius: 4,
              fontSize: 11, fontWeight: 900, letterSpacing: 2,
              textTransform: 'uppercase', marginBottom: 8,
            }}>
              <div style={{
                width: 6, height: 6, borderRadius: '50%', background: '#fff',
                animation: 'livePulse 1.5s ease-in-out infinite',
              }} />
              AO VIVO
            </div>

            <div style={{
              fontSize: 26, fontWeight: 900, lineHeight: 1.1,
              textShadow: '0 2px 12px rgba(0,0,0,0.9)',
              marginBottom: 4, maxWidth: 500,
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>
              {title}
            </div>

            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              {rating > 0 && (
                <span style={{ fontSize: 13, color: '#fbbf24', fontWeight: 700 }}>
                  ⭐ {rating.toFixed(1)}
                </span>
              )}
              {year && <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>{year}</span>}
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>{group}</span>
            </div>
          </div>

          {/* Play button */}
          {isFocusZone && (
            <div style={{
              background: '#fff', color: '#000',
              padding: '10px 24px', borderRadius: 6,
              fontSize: 14, fontWeight: 900,
              display: 'flex', alignItems: 'center', gap: 8,
              boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
              flexShrink: 0,
            }}>
              ▶ Assistir
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════
export default function HomeScreen({ groups, onPlay, onBack }: Props) {
  // ─── State ──────────────────────────────────────────────────────────────
  const [focusZone, setFocusZone] = useState<FocusZone>('hero')
  const [heroState, setHeroState] = useState<HeroState>('default')
  const [heroSlide, setHeroSlide] = useState(0)
  const [sidebarIdx, setSidebarIdx] = useState(0)
  const [topbarIdx, setTopbarIdx] = useState(0)
  const [contentRow, setContentRow] = useState(0)
  const [contentCols, setContentCols] = useState<number[]>([0, 0, 0, 0, 0, 0, 0, 0])
  const [showExit, setShowExit] = useState(false)
  const [exitFocus, setExitFocus] = useState(0)

  const [activeView, setActiveView] = useState<DashboardView>('home')
  const [isLoadingContent, setIsLoadingContent] = useState(false)
  const [content, setContent] = useState<ScreenContent | null>(null)

  useEffect(() => {
    let cancelled = false
    setIsLoadingContent(true)
    const load = async () => {
      let data: ScreenContent
      switch (activeView) {
        case 'movies': data = await buildFilmesContent(groups); break
        case 'series': data = await buildSeriesContent(groups); break
        case 'live':   data = await buildTvContent(groups); break
        default:       data = await buildHomeContent(groups); break
      }
      if (!cancelled) {
        setContent(data)
        setIsLoadingContent(false)
        setContentRow(0)
        setContentCols(new Array(data.rows.length).fill(0))
        setHeroSlide(0)
      }
    }
    load()
    return () => { cancelled = true }
  }, [groups, activeView])

  const rows: ContentRow[] = content?.rows || []
  const heroTmdb = content?.heroTmdb || new Map()
  const heroChannels = content?.heroChannels || []

  const [liveTmdbData, setLiveTmdbData] = useState<Record<string, TMDBResult | null>>({})

  const previewChannel = (focusZone === 'content' && rows[contentRow])
    ? rows[contentRow].channels[contentCols[contentRow]] || null
    : null

  useEffect(() => {
    if (previewChannel) {
      const name = previewChannel.name
      if (liveTmdbData[name] === undefined && !rows[contentRow]?.tmdb?.has(name)) {
        import('../../services/tmdbService').then(({ enrichChannel }) => {
          enrichChannel(name).then(res => {
            setLiveTmdbData(prev => ({ ...prev, [name]: res }))
          })
        })
      }
    }
  }, [previewChannel, contentRow, rows, liveTmdbData])

  const previewTmdb: TMDBResult | null = previewChannel
    ? (liveTmdbData[previewChannel.name] !== undefined
        ? liveTmdbData[previewChannel.name]
        : (rows[contentRow]?.tmdb?.get(previewChannel.name) || null))
    : null

  const heroChForSlide = heroChannels[heroSlide % Math.max(heroChannels.length, 1)] || null
  const heroSlideTmdb = heroChForSlide ? (heroTmdb.get(heroChForSlide.name) || null) : null

  // ─── Refs ─────────────────────────────────────────────────────────────
  const focusZoneRef = useRef(focusZone)
  const heroStateRef = useRef(heroState)
  const sidebarRef = useRef(sidebarIdx)
  const topbarRef = useRef(topbarIdx)
  const contentRowRef = useRef(contentRow)
  const contentColsRef = useRef(contentCols)
  const rowsRef = useRef(rows)
  const showExitRef = useRef(showExit)
  const exitFocusRef = useRef(exitFocus)
  const heroSlideRef = useRef(heroSlide)

  focusZoneRef.current = focusZone
  heroStateRef.current = heroState
  sidebarRef.current = sidebarIdx
  topbarRef.current = topbarIdx
  contentRowRef.current = contentRow
  contentColsRef.current = contentCols
  rowsRef.current = rows
  showExitRef.current = showExit
  exitFocusRef.current = exitFocus
  heroSlideRef.current = heroSlide

  // ─── Hero auto-slide ──────────────────────────────────────────────────
  const maxSlides = heroChannels.length > 0 ? heroChannels.length : HERO_SLIDES.length
  useEffect(() => {
    if (focusZone !== 'hero' && focusZone !== 'topbar' && focusZone !== 'sidebar') return
    if (previewChannel) return
    const iv = setInterval(() => {
      setHeroSlide(s => (s + 1) % maxSlides)
    }, 7000)
    return () => clearInterval(iv)
  }, [focusZone, previewChannel, maxSlides])

  // ─── Scroll cards into view ───────────────────────────────────────────
  const rowRefs = useRef<(HTMLDivElement | null)[]>([])
  useEffect(() => {
    if (focusZone !== 'content') return
    const row = rowRefs.current[contentRow]
    if (!row) return
    const col = contentCols[contentRow]
    const card = row.children[col] as HTMLElement
    if (card) {
      card.scrollIntoView({ behavior: 'smooth' as ScrollBehavior, block: 'nearest', inline: 'nearest' })
    }
  }, [contentRow, contentCols, focusZone])

  // ─── D-pad Navigation ────────────────────────────────────────────────
  useEffect(() => {
    let lastT = 0
    const onKey = (e: KeyboardEvent) => {
      const now = Date.now()
      if (now - lastT < 120) return
      lastT = now

      if (showExitRef.current) {
        if (e.key === 'ArrowLeft'  || e.keyCode === 37) { e.preventDefault(); setExitFocus(0) }
        else if (e.key === 'ArrowRight' || e.keyCode === 39) { e.preventDefault(); setExitFocus(1) }
        else if (e.key === 'Enter' || e.keyCode === 13) {
          e.preventDefault()
          if (exitFocusRef.current === 1) onBack()
          else setShowExit(false)
        }
        else if (e.keyCode === 10009 || e.keyCode === 8) { e.preventDefault(); setShowExit(false) }
        return
      }

      const zone = focusZoneRef.current
      const rw = contentRowRef.current
      const cols = contentColsRef.current
      const allRows = rowsRef.current

      if (e.keyCode === 10009 || e.keyCode === 8 || e.key === 'Backspace') {
        e.preventDefault()
        if (zone === 'sidebar' || zone === 'topbar') { setShowExit(true); setExitFocus(0) }
        else if (zone === 'hero') { setFocusZone('topbar'); setHeroState('default') }
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
        if (zone === 'hero') {
          const ch = heroChannels[heroSlideRef.current % Math.max(heroChannels.length, 1)]
          if (ch) { recordPlay(ch.name, ch.group); onPlay(ch) }
          return
        }
        if (zone === 'content') {
          const row = allRows[rw]
          if (row) {
            if (row.type === 'grid') {
              const cat = row.channels[cols[rw]]
              const viewMap: Record<string, DashboardView> = {
                filmes: 'movies', series: 'series', 'tv ao vivo': 'live',
                abertos: 'live', esportes: 'live',
              }
              const target = viewMap[cat.name.toLowerCase()] || 'home'
              setActiveView(target)
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
        if (isDown)  setSidebarIdx(i => Math.min(i + 1, SIDEBAR_ICONS.length - 1))
        else if (isUp)   setSidebarIdx(i => Math.max(i - 1, 0))
        else if (isRight) setFocusZone('topbar')
        return
      }

      if (zone === 'topbar') {
        if (isRight) setTopbarIdx(i => Math.min(i + 1, TOPBAR_LINKS.length - 1))
        else if (isLeft) {
          if (topbarRef.current === 0) setFocusZone('sidebar')
          else setTopbarIdx(i => Math.max(i - 1, 0))
        }
        else if (isDown) { setFocusZone('hero'); setHeroState('focused') }
        return
      }

      if (zone === 'hero') {
        if (isUp)    { setFocusZone('topbar'); setHeroState('default') }
        else if (isDown)  { setFocusZone('content'); setHeroState('collapsed'); setContentRow(0) }
        else if (isRight) setHeroSlide(s => (s + 1) % maxSlides)
        else if (isLeft)  setHeroSlide(s => (s - 1 + maxSlides) % maxSlides)
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
          if (cols[rw] < maxCol) { const next = [...cols]; next[rw]++; setContentCols(next) }
        } else if (isLeft) {
          if (cols[rw] > 0) { const next = [...cols]; next[rw]--; setContentCols(next) }
        }
        return
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Hero collapsed height ────────────────────────────────────────────
  const heroH = heroState === 'collapsed' || heroState === 'locked' ? 160 : 520
  const ROW_HEIGHT = 320
  const contentOffset = focusZone === 'content' ? -(contentRow * ROW_HEIGHT) : 0

  // Build carousel slides from heroChannels or fallback
  const slideCount = maxSlides
  // Pre-compute TMDB for all hero slides (map)
  const getSlideData = (idx: number) => {
    const ch = heroChannels[idx % Math.max(heroChannels.length, 1)]
    if (ch) {
      const tmdb = heroTmdb.get(ch.name) || null
      return {
        backdrop: tmdb?.backdrop || '',
        poster:   tmdb?.poster   || ch.logo || '',
        title:    tmdb?.title    || ch.name,
        group:    ch.group,
        rating:   tmdb?.rating   || 0,
        year:     tmdb?.year     || '',
        ch,
      }
    }
    const fb = HERO_SLIDES[idx % HERO_SLIDES.length]
    return { backdrop: '', poster: '', title: fb.title, group: fb.accent, rating: 0, year: '', ch: null }
  }

  // Render offsets: center=0, ±1, ±2 (for peek effect)
  const offsets = [-2, -1, 0, 1, 2]

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: BG, color: '#fff', display: 'flex',
      fontFamily: "'Outfit', sans-serif", overflow: 'hidden',
    }}>

      {/* ─── TOPBAR (sem sidebar) — estilo da referência ─────────────── */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 56,
        display: 'flex', alignItems: 'center', padding: '0 48px',
        background: focusZone === 'content'
          ? 'rgba(0,0,0,0.98)'
          : 'linear-gradient(to bottom, rgba(0,0,0,0.85) 0%, transparent 100%)',
        zIndex: 90,
        transition: 'background 400ms',
        gap: 32,
      }}>
        {TOPBAR_LINKS.map((link, i) => {
          const active = focusZone === 'topbar' && topbarIdx === i
          const isCurrent = activeView === link.view
          return (
            <div key={i} style={{
              fontSize: 18, fontWeight: 900, letterSpacing: 1.5,
              color: active ? '#fff' : (isCurrent ? ACCENT : 'rgba(255,255,255,0.55)'),
              padding: '6px 0',
              borderBottom: isCurrent && !active ? `2px solid ${ACCENT}` : active ? `2px solid #fff` : '2px solid transparent',
              transition: 'all 200ms',
              textShadow: active ? '0 0 20px rgba(255,255,255,0.5)' : 'none',
            }}>
              {link.label}
            </div>
          )
        })}
      </div>

      {/* ─── HERO CAROUSEL ───────────────────────────────────────────── */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        height: heroH,
        overflow: 'hidden',
        transition: 'height 450ms cubic-bezier(0.4,0,0.2,1)',
        flexShrink: 0,
        // Escurece suavemente quando foco vai pro content
        filter: focusZone === 'content' ? 'brightness(0.3)' : 'brightness(1)',
        transitionProperty: 'height, filter',
      }}>
        {/* Fundo preto atrás do carrossel */}
        <div style={{ position: 'absolute', inset: 0, background: '#0a0a0a' }} />

        {/* Cards do carrossel */}
        {offsets.map(offset => {
          const slideIdx = ((heroSlide + offset) % slideCount + slideCount) % slideCount
          const data = getSlideData(slideIdx)
          return (
            <HeroCarouselItem
              key={`${heroSlide}-${offset}`}
              offset={offset}
              backdrop={data.backdrop}
              poster={data.poster}
              title={data.title}
              group={data.group}
              totalChannels={Object.values(groups).reduce((a, c) => a + c.length, 0)}
              focused={offset === 0 && focusZone === 'hero'}
              isFocusZone={focusZone === 'hero'}
              rating={data.rating}
              year={data.year}
              onSelect={() => { if (data.ch) { recordPlay(data.ch.name, data.ch.group); onPlay(data.ch) } }}
            />
          )
        })}

        {/* Setas de navegação — aparecem quando hero focado */}
        {focusZone === 'hero' && (
          <>
            <div style={{
              position: 'absolute', left: 12, top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 30, fontSize: 32, color: 'rgba(255,255,255,0.6)',
              background: 'rgba(0,0,0,0.4)', width: 44, height: 44,
              borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>‹</div>
            <div style={{
              position: 'absolute', right: 12, top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 30, fontSize: 32, color: 'rgba(255,255,255,0.6)',
              background: 'rgba(0,0,0,0.4)', width: 44, height: 44,
              borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>›</div>
          </>
        )}

        {/* Dots */}
        {focusZone !== 'content' && slideCount > 1 && (
          <div style={{
            position: 'absolute', bottom: 14, left: 0, right: 0,
            display: 'flex', gap: 6, justifyContent: 'center', zIndex: 20,
          }}>
            {Array.from({ length: Math.min(slideCount, 8) }).map((_, i) => (
              <div key={i} style={{
                width: heroSlide === i ? 24 : 6,
                height: 6, borderRadius: 3,
                background: heroSlide === i ? ACCENT : 'rgba(255,255,255,0.3)',
                transition: 'all 300ms ease',
              }} />
            ))}
          </div>
        )}
      </div>

      {/* ─── ROWS CONTENT ─────────────────────────────────────────────── */}
      <div style={{
        position: 'absolute', top: heroH, left: 0, right: 0, bottom: 0,
        overflow: 'hidden',
        transition: 'top 450ms cubic-bezier(0.4,0,0.2,1)',
      }}>
        <div style={{
          transform: `translateY(${contentOffset}px)`,
          transition: 'transform 500ms cubic-bezier(0.4,0,0.2,1)',
        }}>
          {rows.map((row, rowIdx) => (
            <div key={rowIdx} style={{ padding: '20px 0', overflow: 'visible' }}>
              <div style={{
                padding: '0 48px', display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', marginBottom: 14,
              }}>
                <div style={{
                  fontSize: 20, fontWeight: 800, textTransform: 'lowercase',
                  color: focusZone === 'content' && contentRow === rowIdx ? '#fff' : 'rgba(255,255,255,0.45)',
                  transition: 'color 200ms',
                }}>
                  {row.title}<span style={{ color: ACCENT }}>{row.titleAccent}</span>
                </div>
              </div>

              {row.type === 'grid' ? (
                <div style={{
                  display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: 20, padding: '0 48px',
                }}>
                  {row.channels.slice(0, 8).map((cat, ci) => {
                    const focused = focusZone === 'content' && contentRow === rowIdx && contentCols[rowIdx] === ci
                    const info = CATEGORY_ICONS[cat.name] || { emoji: '📂', color: '#888' }
                    return (
                      <div key={ci} style={{
                        height: 120,
                        background: focused ? ACCENT : 'rgba(255,255,255,0.03)',
                        border: focused ? `1px solid ${ACCENT}` : '1px dashed rgba(255,255,255,0.1)',
                        borderRadius: 20,
                        display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'center', gap: 10,
                        fontSize: 18, fontWeight: 700, textTransform: 'lowercase',
                        transform: focused ? 'translateY(-6px)' : 'translateY(0)',
                        boxShadow: focused ? `0 12px 28px ${GLOW}` : 'none',
                        transition: 'all 280ms cubic-bezier(0.34,1.56,0.64,1)',
                        cursor: 'pointer',
                      }}>
                        <span style={{ fontSize: 26 }}>{info.emoji}</span>
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
                    gap: row.type === 'portrait' ? 12 : 8,
                    overflowX: 'auto', overflowY: 'visible',
                    padding: row.type === 'portrait' ? '10px 0 18px 24px' : '10px 0 18px 48px',
                    paddingRight: 'calc(100vw - 480px)',
                    scrollbarWidth: 'none',
                    alignItems: 'flex-start',
                  }}
                >
                  {row.channels.map((ch, ci) => {
                    const focused = focusZone === 'content' && contentRow === rowIdx && contentCols[rowIdx] === ci

                    if (row.type === 'portrait') {
                      return (
                        <div key={ci} onClick={() => onPlay(ch)} style={{
                          position: 'relative', width: 200, minWidth: 200, height: 300,
                          borderRadius: 10, overflow: 'hidden', cursor: 'pointer', flexShrink: 0,
                          transform: focused ? 'scale(1.06)' : 'scale(1)',
                          zIndex: focused ? 10 : 1,
                          transition: 'all 280ms cubic-bezier(0.34,1.56,0.64,1)',
                          border: focused ? `3px solid ${ACCENT}` : '1px solid rgba(255,255,255,0.07)',
                          boxShadow: focused ? `0 0 28px ${GLOW}` : 'none',
                        }}>
                          <div style={{
                            width: '100%', height: '100%',
                            background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}>
                            {(() => {
                              const t = row.tmdb?.get(ch.name)
                              const src = t?.poster || ch.logo
                              return src
                                ? <img src={src} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                : <span style={{ fontSize: 40 }}>📺</span>
                            })()}
                          </div>
                          <div style={{
                            position: 'absolute', bottom: 0, left: 0, right: 0,
                            padding: '6px 8px 8px',
                            background: 'linear-gradient(transparent, rgba(0,0,0,0.9))',
                          }}>
                            <div style={{
                              fontSize: 13, fontWeight: 700,
                              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                            }}>{ch.name}</div>
                          </div>
                        </div>
                      )
                    }

                    const isWide = row.type === 'wide'
                    return (
                      <div key={ci} onClick={() => onPlay(ch)} style={{
                        position: 'relative', display: 'flex', alignItems: 'flex-end',
                        minWidth: isWide ? 400 : 280, flexShrink: 0, cursor: 'pointer',
                        transition: 'all 280ms cubic-bezier(0.34,1.56,0.64,1)',
                      }}>
                        {isWide && (
                          <div style={{
                            fontSize: '7rem', fontWeight: 900, lineHeight: 1,
                            color: 'transparent',
                            WebkitTextStroke: focused ? `2px ${ACCENT}` : '2px rgba(255,255,255,0.12)',
                            width: 110, textAlign: 'right',
                            marginBottom: -18, marginRight: -3, zIndex: 2,
                            transition: 'all 200ms',
                          }}>
                            {ci + 1}
                          </div>
                        )}
                        <div style={{ position: 'relative' }}>
                          <div style={{
                            width: isWide ? 280 : 240, height: isWide ? 160 : 135,
                            borderRadius: 12, overflow: 'hidden',
                            background: 'linear-gradient(135deg, #0f0f23, #1a1a2e)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            opacity: focused ? 1 : 0.8,
                            border: focused ? `3px solid ${ACCENT}` : '1px solid rgba(255,255,255,0.07)',
                            boxShadow: focused ? `0 0 28px ${GLOW}` : 'none',
                            transition: 'all 200ms',
                          }}>
                            {(() => {
                              const t = row.tmdb?.get(ch.name)
                              const src = t?.poster || ch.logo
                              return src
                                ? <img src={src} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                : <span style={{ fontSize: 30 }}>📺</span>
                            })()}
                          </div>
                          {isWide && ci < 3 && (
                            <div style={{
                              position: 'absolute', top: 8, left: 8,
                              fontSize: 11, fontWeight: 900, letterSpacing: 1.5,
                              textTransform: 'uppercase', padding: '3px 8px', borderRadius: 4,
                              background: ci === 0 ? 'rgba(255,0,110,0.85)' : ci === 1 ? 'rgba(77,124,254,0.85)' : 'rgba(251,191,36,0.85)',
                              color: ci === 2 ? '#000' : '#fff',
                            }}>
                              {ci === 0 ? '🔥 destaque' : ci === 1 ? '✨ novo' : '⭐ popular'}
                            </div>
                          )}
                          <div style={{
                            fontSize: 14, fontWeight: 700,
                            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                            padding: '6px 2px 0', maxWidth: isWide ? 280 : 240,
                          }}>
                            {ch.name}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ─── LOADING OVERLAY ──────────────────────────────────────────── */}
      {isLoadingContent && (
        <div style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.85)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 200,
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 56, marginBottom: 20, animation: 'spin 2s linear infinite' }}>🛸</div>
            <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase' }}>
              Abduzindo conteúdo...
            </div>
          </div>
        </div>
      )}

      {/* ─── EXIT DIALOG ──────────────────────────────────────────────── */}
      {showExit && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999,
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #1a1a1a 0%, #0f0f0f 100%)',
            border: `2px solid rgba(255,0,110,0.3)`, borderRadius: 16,
            padding: '60px 80px', textAlign: 'center', maxWidth: 600,
            boxShadow: `0 0 60px ${GLOW}`,
          }}>
            <div style={{ fontSize: 36, fontWeight: 700, marginBottom: 12 }}>
              sair do <span style={{ color: ACCENT }}>ziiiTV</span>?
            </div>
            <div style={{ fontSize: 18, color: TEXT_MUTED, marginBottom: 40 }}>tem certeza que deseja sair?</div>
            <div style={{ display: 'flex', gap: 20, justifyContent: 'center' }}>
              {['cancelar', 'sair'].map((label, i) => {
                const f = exitFocus === i
                return (
                  <div key={i} style={{
                    background: i === 1 ? (f ? ACCENT : 'rgba(255,0,110,0.3)') : (f ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)'),
                    padding: '16px 48px', borderRadius: 100, fontSize: 20,
                    fontWeight: 700, cursor: 'pointer', textTransform: 'lowercase',
                    border: f ? `3px solid ${ACCENT}` : '3px solid transparent',
                    transform: f ? 'scale(1.08)' : 'scale(1)',
                    boxShadow: f ? `0 0 24px ${GLOW}` : 'none',
                    transition: 'all 200ms',
                  }}>
                    {label}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes livePulse { 0%,100% { opacity:1; } 50% { opacity:0.3; } }
        @keyframes spin { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }
        *::-webkit-scrollbar { display: none; }
        * { scrollbar-width: none; }
      `}</style>
    </div>
  )
}
