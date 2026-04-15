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
  { label: 'página principal', view: 'home' },
  { label: 'filmes', view: 'movies' },
  { label: 'séries', view: 'series' },
  { label: 'tv ao vivo', view: 'live' },
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

  // Dashboard View State
  const [activeView, setActiveView] = useState<DashboardView>('home')
  const [isLoadingContent, setIsLoadingContent] = useState(false)

  // Content from contentSelector + TMDB
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
        // Reset navigation on view change
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

  // Get TMDB data for preview or hero slide
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
    }, 8000)
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

      // ─── EXIT DIALOG ────────────────────────────────────────
      if (showExitRef.current) {
        if (e.key === 'ArrowLeft' || e.keyCode === 37) { e.preventDefault(); setExitFocus(0) }
        else if (e.key === 'ArrowRight' || e.keyCode === 39) { e.preventDefault(); setExitFocus(1) }
        else if (e.key === 'Enter' || e.keyCode === 13) {
          e.preventDefault()
          if (exitFocusRef.current === 1) {
            onBack()
          } else {
            setShowExit(false)
          }
        }
        else if (e.keyCode === 10009 || e.keyCode === 8 || e.key === 'Backspace') {
          e.preventDefault(); setShowExit(false)
        }
        return
      }

      const zone = focusZoneRef.current
      const rw = contentRowRef.current
      const cols = contentColsRef.current
      const allRows = rowsRef.current

      // ─── BACK ─────────────────────────────────────────────
      if (e.keyCode === 10009 || e.keyCode === 8 || e.key === 'Backspace') {
        e.preventDefault()
        if (zone === 'sidebar' || zone === 'topbar') { setShowExit(true); setExitFocus(0) }
        else if (zone === 'hero') { setFocusZone('topbar'); setHeroState('default') }
        else if (zone === 'content') { setFocusZone('hero'); setHeroState('focused') }
        return
      }

      // ─── ENTER ────────────────────────────────────────────
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
              // Click na categoria -> Muda view
              const cat = row.channels[cols[rw]]
              const viewMap: Record<string, DashboardView> = { 
                filmes: 'movies', series: 'series', 'tv ao vivo': 'live', 
                abertos: 'live', esportes: 'live' 
              }
              const target = viewMap[cat.name.toLowerCase()] || 'home'
              setActiveView(target)
            } else {
              const ch = row.channels[cols[rw]]
              if (ch) {
                recordPlay(ch.name, ch.group)
                onPlay(ch)
              }
            }
          }
        }
        return
      }

      // ─── ARROWS ───────────────────────────────────────────
      const isDown = e.key === 'ArrowDown' || e.keyCode === 40
      const isUp = e.key === 'ArrowUp' || e.keyCode === 38
      const isRight = e.key === 'ArrowRight' || e.keyCode === 39
      const isLeft = e.key === 'ArrowLeft' || e.keyCode === 37

      if (!(isDown || isUp || isRight || isLeft)) return
      e.preventDefault()

      // SIDEBAR
      if (zone === 'sidebar') {
        if (isDown) setSidebarIdx(i => Math.min(i + 1, SIDEBAR_ICONS.length - 1))
        else if (isUp) setSidebarIdx(i => Math.max(i - 1, 0))
        else if (isRight) { setFocusZone('topbar') }
        return
      }

      // TOPBAR
      if (zone === 'topbar') {
        if (isRight) setTopbarIdx(i => Math.min(i + 1, TOPBAR_LINKS.length - 1))
        else if (isLeft) {
          if (topbarRef.current === 0) setFocusZone('sidebar')
          else setTopbarIdx(i => Math.max(i - 1, 0))
        }
        else if (isDown) { setFocusZone('hero'); setHeroState('focused') }
        return
      }

      // HERO
      if (zone === 'hero') {
        if (isUp) { setFocusZone('topbar'); setHeroState('default') }
        else if (isDown) { setFocusZone('content'); setHeroState('collapsed'); setContentRow(0) }
        else if (isRight) setHeroSlide(s => (s + 1) % maxSlides)
        else if (isLeft) setHeroSlide(s => (s - 1 + maxSlides) % maxSlides)
        return
      }

      // CONTENT
      if (zone === 'content') {
        if (isDown) {
          if (rw < allRows.length - 1) setContentRow(rw + 1)
        }
        else if (isUp) {
          if (rw === 0) { setFocusZone('hero'); setHeroState('focused') }
          else setContentRow(rw - 1)
        }
        else if (isRight) {
          const maxCol = (allRows[rw]?.channels.length || 1) - 1
          if (cols[rw] < maxCol) {
            const next = [...cols]; next[rw]++; setContentCols(next)
          }
        }
        else if (isLeft) {
          if (cols[rw] > 0) {
            const next = [...cols]; next[rw]--; setContentCols(next)
          }
        }
        return
      }
    }

    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Hero height ──────────────────────────────────────────────────────
  const heroH = heroState === 'focused' ? '70vh'
    : heroState === 'collapsed' || heroState === 'locked' ? '50vh'
    : '44vh'

  // Content offset for translateY scrolling
  const ROW_HEIGHT = 320
  const contentOffset = focusZone === 'content' ? -(contentRow * ROW_HEIGHT) : 0

  // Current slide or preview — TMDB enriched
  const fallbackSlide = HERO_SLIDES[heroSlide % HERO_SLIDES.length]
  const activeTmdb = previewTmdb || heroSlideTmdb
  const heroTitle = previewChannel
    ? (previewTmdb?.title || previewChannel.name)
    : (heroSlideTmdb?.title || heroChForSlide?.name || fallbackSlide.title)
  const heroAccent = previewChannel
    ? previewChannel.group
    : (heroChForSlide ? heroChForSlide.group : fallbackSlide.accent)
  const heroDesc = activeTmdb?.overview || (previewChannel ? previewChannel.name : fallbackSlide.desc)
  const heroRating = activeTmdb?.rating || 0
  const heroYear = activeTmdb?.year || ''
  const heroBg = activeTmdb?.backdrop || ''

  // ═══════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: BG, color: '#fff', display: 'flex',
      fontFamily: "'Outfit', sans-serif", overflow: 'hidden',
    }}>

      {/* ─── SIDEBAR ──────────────────────────────────────────────────── */}
      <div style={{
        width: 70, height: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', padding: '30px 0',
        borderRight: '1px solid rgba(255,255,255,0.05)',
        zIndex: 100, transition: 'opacity 300ms',
        opacity: focusZone === 'sidebar' ? 1 : 0.3,
      }}>
        {/* Logo */}
        <div style={{
          fontWeight: 900, fontSize: 24, color: ACCENT, marginBottom: 60,
          textShadow: `0 0 20px ${GLOW}`,
        }}>z.</div>

        {/* Icons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
          {SIDEBAR_ICONS.map((icon, i) => {
            const active = focusZone === 'sidebar' && sidebarIdx === i
            return (
              <div key={i} style={{
                position: 'relative', width: 40, height: 40,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.2rem', 
                color: active ? '#fff' : (activeView === icon.view ? ACCENT : TEXT_MUTED),
                transition: 'all 200ms',
              }}>
                {active && <div style={{
                  position: 'absolute', left: -15, width: 4, height: 20,
                  background: ACCENT, borderRadius: '0 4px 4px 0',
                  boxShadow: `0 0 15px ${GLOW}`,
                }} />}
                {icon.emoji}
              </div>
            )
          })}
        </div>

        {/* Bottom */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          <div style={{ fontSize: '1.2rem', color: TEXT_MUTED }}>⚙️</div>
          <div style={{
            width: 32, height: 32, borderRadius: '50%',
            background: 'linear-gradient(135deg, #ff006e, #a855f7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14,
          }}>👽</div>
        </div>
      </div>

      {/* ─── VIEWPORT ─────────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>

        {/* ─── TOPBAR ───────────────────────────────────────────────── */}
        <div style={{
          height: 72, display: 'flex', alignItems: 'center', padding: '0 80px',
          background: 'rgba(0,0,0,0.1)',
          borderBottom: '1px solid rgba(255,255,255,0.04)',
          zIndex: 90, transition: 'opacity 400ms, transform 400ms',
          opacity: focusZone === 'content' ? 0 : 1,
          transform: focusZone === 'content' ? 'translateY(-100%)' : 'translateY(0)',
          pointerEvents: focusZone === 'content' ? 'none' : 'auto',
          flexShrink: 0,
        }}>
          {/* Brand */}
          <div style={{
            fontSize: '0.85rem', fontWeight: 900, letterSpacing: 1,
            textTransform: 'lowercase', marginRight: 40,
          }}>
            o melhor · <span style={{ color: ACCENT }}>ziiiTV!</span>
          </div>

          {/* Links */}
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {TOPBAR_LINKS.map((link, i) => {
              const active = focusZone === 'topbar' && topbarIdx === i
              const isCurrentView = activeView === link.view
              return (
                <div key={i} style={{
                  fontSize: '1.1rem', fontWeight: 700, textTransform: 'lowercase',
                  color: active ? '#fff' : (isCurrentView ? ACCENT : 'rgba(255,255,255,0.35)'),
                  padding: '6px 14px', borderRadius: 20,
                  background: active ? 'rgba(255,0,110,0.12)' : 'transparent',
                  transition: 'all 200ms', whiteSpace: 'nowrap',
                  borderBottom: isCurrentView && !active ? `2px solid ${ACCENT}` : '2px solid transparent',
                }}>
                  {link.label}
                </div>
              )
            })}
          </div>
        </div>

        {/* ─── HERO ─────────────────────────────────────────────────── */}
        <div style={{
          position: 'relative', width: '100%', height: heroH,
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          padding: '0 80px', overflow: 'hidden',
          transition: 'height 400ms ease', flexShrink: 0,
        }}>
          {/* BG image — TMDB ou alien fallback */}
          <img src={heroBg || 'hero-alien.png'} style={{
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
            objectFit: 'cover', zIndex: 0,
          }} />
          {/* BG overlays */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            background: 'linear-gradient(90deg, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.6) 35%, transparent 65%)',
            zIndex: 1,
          }} />
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            background: 'linear-gradient(0deg, rgba(0,0,0,0.8) 0%, transparent 40%)',
            zIndex: 2,
          }} />

          {/* Content */}
          <div style={{ position: 'relative', zIndex: 10, maxWidth: 800 }}>
            {/* Badge */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16,
            }}>
              <div style={{
                width: 8, height: 8, borderRadius: '50%', background: ACCENT,
                boxShadow: `0 0 10px ${ACCENT}`,
                animation: 'pulse-glow 1.5s infinite',
              }} />
              <span style={{
                fontSize: 12, fontWeight: 700, letterSpacing: 2,
                textTransform: 'uppercase', color: ACCENT,
              }}>
                {previewChannel ? 'ao vivo' : 'em destaque'}
              </span>
            </div>

            {/* Title */}
            <div style={{
              fontSize: 'clamp(40px, 4vw, 64px)', fontWeight: 900,
              lineHeight: 0.9, letterSpacing: '-0.05em', textTransform: 'lowercase',
              marginBottom: 16,
            }}>
              {heroTitle}<br />
              <span style={{
                color: ACCENT,
                textShadow: `0 0 30px ${GLOW}`,
              }}>{heroAccent}</span>
            </div>

            {/* Meta — only when focused */}
            {(heroState === 'focused' || previewChannel) && (
              <div style={{
                display: 'flex', gap: 20, marginBottom: 20,
                fontSize: 14, fontWeight: 600, color: TEXT_MUTED,
                opacity: 1, transition: 'opacity 300ms',
              }}>
                {heroRating > 0 && <span style={{
                  background: 'rgba(255,255,255,0.1)', padding: '4px 10px',
                  borderRadius: 6,
                }}>⭐ {heroRating.toFixed(1)}</span>}
                {heroYear && <span>{heroYear}</span>}
                <span>HD</span>
              </div>
            )}

            {/* Description */}
            <div style={{
              fontSize: 18, color: 'rgba(255,255,255,0.8)',
              lineHeight: 1.6, maxWidth: 600, marginBottom: 24,
              fontWeight: 400, textShadow: '0 2px 8px rgba(0,0,0,0.8)',
            }}>
              {heroDesc}
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: 16 }}>
              <div
                onClick={() => previewChannel && onPlay(previewChannel)}
                style={{
                  background: ACCENT, color: '#fff',
                  padding: '14px 36px', borderRadius: 100,
                  fontWeight: 800, fontSize: 15, textTransform: 'lowercase',
                  boxShadow: `0 10px 30px ${GLOW}`, cursor: 'pointer',
                  border: focusZone === 'hero' ? `2px solid ${ACCENT}` : '2px solid transparent',
                  transform: focusZone === 'hero' ? 'scale(1.05)' : 'scale(1)',
                  transition: 'all 200ms',
                }}
              >
                ▶ assistir agora
              </div>
              <div style={{
                background: 'rgba(255,255,255,0.05)', color: '#fff',
                padding: '14px 36px', borderRadius: 100,
                fontWeight: 800, fontSize: 15, textTransform: 'lowercase',
                border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer',
              }}>
                + minha lista
              </div>
            </div>
          </div>

          {/* Stats card */}
          <div style={{
            position: 'absolute', top: '15%', right: '10%',
            background: '#fff', color: '#000', padding: 30,
            borderRadius: 24, zIndex: 20,
            boxShadow: '0 30px 60px rgba(0,0,0,0.5)', maxWidth: 180,
            display: focusZone === 'content' ? 'none' : 'block',
          }}>
            <div style={{ fontSize: 36, fontWeight: 900, marginBottom: 4 }}>
              {Object.values(groups).reduce((a, c) => a + c.length, 0).toLocaleString()}
            </div>
            <div style={{ fontSize: 11, opacity: 0.6, marginBottom: 12 }}>canais disponíveis</div>
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: ACCENT, display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              fontSize: 16, color: '#fff',
            }}>→</div>
          </div>

          {/* Hero dots */}
          {!previewChannel && (
            <div style={{
              position: 'absolute', bottom: 28, left: 0, right: 0,
              display: 'flex', gap: 10, justifyContent: 'center', zIndex: 20,
            }}>
              {Array.from({ length: maxSlides }).map((_, i) => {
                const active = heroSlide === i
                const fallback = HERO_SLIDES[i % HERO_SLIDES.length]
                return (
                  <div key={i} style={{
                    width: 32, height: 32, borderRadius: '50%',
                    border: active ? `1px solid ${ACCENT}` : '1px solid rgba(255,255,255,0.15)',
                    background: active ? ACCENT : 'rgba(0,0,0,0.4)',
                    color: active ? '#fff' : 'rgba(255,255,255,0.3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 14,
                    transition: 'all 350ms cubic-bezier(0.34,1.56,0.64,1)',
                    transform: active ? 'scale(1.2)' : 'scale(1)',
                    boxShadow: active ? `0 0 16px ${GLOW}` : 'none',
                  }}>
                    {fallback?.icon || '●'}
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* ─── ROWS SLIDER ──────────────────────────────────────────── */}
        <div style={{
          transform: `translateY(${contentOffset}px)`,
          transition: 'transform 500ms cubic-bezier(0.4,0,0.2,1)',
          flexShrink: 0,
        }}>
          {rows.map((row, rowIdx) => (
            <div key={rowIdx} style={{ padding: '24px 0', overflow: 'visible' }}>
              {/* Section header */}
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

              {/* ─── GRID ROW ─────────────────────────────────────── */}
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
                        fontSize: '1.1rem', fontWeight: 700, textTransform: 'lowercase',
                        transform: focused ? 'translateY(-8px)' : 'translateY(0)',
                        boxShadow: focused ? `0 15px 30px ${GLOW}` : 'none',
                        transition: 'all 280ms cubic-bezier(0.34,1.56,0.64,1)',
                        cursor: 'pointer',
                      }}>
                        <span style={{ fontSize: 28 }}>{info.emoji}</span>
                        <span>{cat.name}</span>
                      </div>
                    )
                  })}
                </div>
              ) : (
                /* ─── CARD ROWS (wide / simple / portrait) ─────── */
                <div
                  ref={el => { rowRefs.current[rowIdx] = el }}
                  style={{
                    display: 'flex',
                    gap: row.type === 'portrait' ? 14 : 8,
                    overflowX: 'auto', overflowY: 'visible',
                    padding: row.type === 'portrait' ? '12px 0 20px 30px' : '12px 0 20px 80px',
                    paddingRight: 'calc(100vw - 480px)',
                    scrollbarWidth: 'none',
                    alignItems: 'flex-start',
                  }}
                >
                  {row.channels.map((ch, ci) => {
                    const focused = focusZone === 'content' && contentRow === rowIdx && contentCols[rowIdx] === ci

                    // ─── PORTRAIT CARD ────────────────────────────
                    if (row.type === 'portrait') {
                      return (
                        <div key={ci} onClick={() => onPlay(ch)} style={{
                          position: 'relative', width: 220, minWidth: 220, height: 330,
                          borderRadius: 12, overflow: 'hidden', cursor: 'pointer', flexShrink: 0,
                          transform: focused ? 'scale(1.05)' : 'scale(1)',
                          zIndex: focused ? 10 : 1,
                          transition: 'all 280ms cubic-bezier(0.34,1.56,0.64,1)',
                        }}>
                          <div style={{
                            width: '100%', height: '100%',
                            background: `linear-gradient(135deg, #1a1a2e, #16213e)`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 48, opacity: 0.85,
                            border: focused ? `3px solid ${ACCENT}` : '1px solid rgba(255,255,255,0.07)',
                            borderRadius: 12,
                            boxShadow: focused ? `0 0 0 2px ${ACCENT}, 0 0 28px ${GLOW}` : 'none',
                          }}>
                            {(() => { const t = row.tmdb?.get(ch.name); const src = t?.poster || ch.logo; return src ? <img src={src} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 12 }} /> : '📺' })()}
                          </div>
                          <div style={{
                            position: 'absolute', bottom: 0, left: 0, right: 0,
                            padding: '8px 4px 6px', background: 'linear-gradient(transparent, rgba(0,0,0,0.9))',
                          }}>
                            <div style={{
                              fontSize: '0.7rem', fontWeight: 700,
                              fontFamily: "'Barlow Condensed', sans-serif",
                              textTransform: 'uppercase', whiteSpace: 'nowrap',
                              overflow: 'hidden', textOverflow: 'ellipsis',
                            }}>{ch.name}</div>
                          </div>
                        </div>
                      )
                    }

                    // ─── WIDE / SIMPLE CARD ───────────────────────
                    const isWide = row.type === 'wide'
                    return (
                      <div key={ci} onClick={() => onPlay(ch)} style={{
                        position: 'relative', display: 'flex', alignItems: 'flex-end',
                        minWidth: isWide ? 420 : 300, flexShrink: 0, cursor: 'pointer',
                        transition: 'all 280ms cubic-bezier(0.34,1.56,0.64,1)',
                      }}>
                        {/* Number (wide only) */}
                        {isWide && (
                          <div style={{
                            fontSize: '8rem', fontWeight: 900, lineHeight: 1,
                            color: 'transparent',
                            WebkitTextStroke: focused ? `2px ${ACCENT}` : '2px rgba(255,255,255,0.15)',
                            fontFamily: "'Outfit'", width: 120, textAlign: 'right',
                            marginBottom: -20, marginRight: -3, zIndex: 2,
                            textShadow: focused ? `0 0 20px ${GLOW}` : 'none',
                            transition: 'all 200ms',
                          }}>
                            {ci + 1}
                          </div>
                        )}

                        {/* Image */}
                        <div style={{ position: 'relative' }}>
                          <div style={{
                            width: isWide ? 300 : 260, height: isWide ? 170 : 146,
                            borderRadius: 14, overflow: 'hidden',
                            background: `linear-gradient(135deg, #0f0f23, #1a1a2e)`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 36, opacity: focused ? 1 : 0.8,
                            border: focused ? `3px solid ${ACCENT}` : '1px solid rgba(255,255,255,0.07)',
                            boxShadow: focused ? `0 0 0 2px ${ACCENT}, 0 0 28px ${GLOW}, 0 0 40px ${GLOW}` : 'none',
                            transition: 'all 200ms',
                          }}>
                            {(() => { const t = row.tmdb?.get(ch.name); const src = t?.poster || ch.logo; return src ? <img src={src} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 14 }} /> : '📺' })()}
                          </div>

                          {/* Tag */}
                          {isWide && ci < 3 && (
                            <div style={{
                              position: 'absolute', top: 10, left: 10,
                              fontSize: '0.58rem', fontWeight: 900, letterSpacing: 1.5,
                              textTransform: 'uppercase', padding: '3px 8px',
                              borderRadius: 6,
                              background: ci === 0 ? 'rgba(255,0,110,0.85)' : ci === 1 ? 'rgba(77,124,254,0.85)' : 'rgba(251,191,36,0.85)',
                              color: ci === 2 ? '#000' : '#fff',
                            }}>
                              {ci === 0 ? '🔥 destaque' : ci === 1 ? '✨ novo' : '⭐ popular'}
                            </div>
                          )}

                          {/* Year badge */}
                          {(() => { const t = row.tmdb?.get(ch.name); const yr = t?.year || ''; return yr ? (
                          <div style={{
                            position: 'absolute', bottom: 8, right: 8,
                            background: 'rgba(0,0,0,0.75)', color: 'rgba(255,255,255,0.8)',
                            fontSize: '0.62rem', fontWeight: 700,
                            fontFamily: "'Barlow Condensed', sans-serif",
                            letterSpacing: 1, padding: '3px 7px', borderRadius: 6,
                            border: '1px solid rgba(255,255,255,0.15)',
                          }}>
                            {yr}
                          </div>) : null })()}

                          {/* Title */}
                          <div style={{
                            fontSize: '0.9rem', fontWeight: 700,
                            fontFamily: "'Barlow Condensed', sans-serif",
                            letterSpacing: 0.5, textTransform: 'uppercase',
                            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                            padding: '6px 4px 0', maxWidth: isWide ? 300 : 260,
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

        {/* ─── LOADING OVERLAY ──────────────────────────────────────────── */}
        {isLoadingContent && (
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 80, transition: 'opacity 300ms',
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                fontSize: 60, marginBottom: 20, animation: 'spin 2s linear infinite' 
              }}>🛸</div>
              <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase' }}>
                Abduzindo conteúdo...
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ─── EXIT DIALOG ──────────────────────────────────────────────── */}
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
            <div style={{ fontSize: 18, color: TEXT_MUTED, marginBottom: 40 }}>
              tem certeza que deseja sair?
            </div>
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
                  }}>
                    {label}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* ─── KEYFRAMES ────────────────────────────────────────────────── */}
      <style>{`
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 8px ${GLOW}; }
          50% { box-shadow: 0 0 20px ${ACCENT}; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        * { outline: none !important; scrollbar-width: none; }
        *::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  )
}
