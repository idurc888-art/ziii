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
// import { TopMoviesBanner, mockTopMovies } from '../../components/TopMoviesBanner'

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

// ─── Tizen Focus Constants ───────────────────────────────────────────────────
const FOCUS_SCALE = 1.05;
const FOCUS_DURATION = 350;
const FOCUS_EASING = 'cubic-bezier(0.25, 1, 0.5, 1)';
const UNFOCUS_OPACITY = 0.88;

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════
export default function HomeScreen({ groups, onPlay, onBack }: Props) {
  // ─── State ──────────────────────────────────────────────────────────────
  const [focusZone, setFocusZone] = useState<FocusZone>('hero')
  const [heroState, setHeroState] = useState<HeroState>('default')
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

  // ─── Debounce navigation for heavy hero data ──────────────────────────
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedPreview(previewChannel)
    }, 250)
    return () => clearTimeout(timer)
  }, [previewChannel])

  useEffect(() => {
    if (debouncedPreview) {
      const name = debouncedPreview.name
      if (liveTmdbData[name] === undefined && !rows[contentRow]?.tmdb?.has(name)) {
        enrichChannel(name).then(res => {
          setLiveTmdbData(prev => ({ ...prev, [name]: res }))
        })
      }
    }
  }, [debouncedPreview, contentRow, rows, liveTmdbData])

  // ─── Hero Trailer System ─────────────────────────────────────────────
  // Determinar qual item está em destaque no hero
  // Por enquanto, usamos o primeiro slide do HeroBanner
  const currentHeroItem: TMDBResult | null = mockHeroSlides[0] ? {
    tmdbId: 1, // Mock ID - na implementação real viria do TMDB
    title: mockHeroSlides[0].title,
    poster: mockHeroSlides[0].backgroundImage,
    backdrop: mockHeroSlides[0].backgroundImage,
    overview: mockHeroSlides[0].description,
    rating: 8.0, // Mock rating
    year: '2024', // Mock year
    mediaType: 'movie', // Mock type
    trailerKey: '' // Será preenchido pelo hook
  } : null;

  // Hook para controlar autoplay de trailer
  useHeroTrailer(currentHeroItem, {
    idleDelay: 2500, // 2.5 segundos
    fadeDuration: 800, // 0.8 segundos para fade
    isHeroVisible: focusZone !== 'content', // Hero visível quando não está no content
    focusZone: focusZone
  });

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

  focusZoneRef.current = focusZone
  heroStateRef.current = heroState
  sidebarRef.current = sidebarIdx
  topbarRef.current = topbarIdx
  contentRowRef.current = contentRow
  contentColsRef.current = contentCols
  rowsRef.current = rows
  showExitRef.current = showExit
  exitFocusRef.current = exitFocus

  // ─── Scroll Container Vertical ─────────────────────────────────────────
  const rowRefs = useRef<(HTMLDivElement | null)[]>([])
  useEffect(() => {
    if (focusZone !== 'content') return
    const row = rowRefs.current[contentRow]
    if (row) {
      row.scrollIntoView({ behavior: 'smooth' as ScrollBehavior, block: 'center' })
    }
  }, [contentRow, focusZone, contentCols])

  // ─── D-pad Navigation ────────────────────────────────────────────────
  useEffect(() => {
    let lastT = 0
    const onKey = (e: KeyboardEvent) => {
      const now = Date.now()
      if (now - lastT < 120) return
      lastT = now

      if (showExitRef.current) {
        if (e.key === 'ArrowLeft' || e.keyCode === 37) { e.preventDefault(); setExitFocus(0) }
        else if (e.key === 'ArrowRight' || e.keyCode === 39) { e.preventDefault(); setExitFocus(1) }
        else if (e.key === 'Enter' || e.keyCode === 13) {
          e.preventDefault()
          if (exitFocusRef.current === 1) onBack()
          else setShowExit(false)
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
        if (isDown) setSidebarIdx(i => Math.min(i + 1, SIDEBAR_ICONS.length - 1))
        else if (isUp) setSidebarIdx(i => Math.max(i - 1, 0))
        else if (isRight) setFocusZone('topbar')
        return
      }

      if (zone === 'topbar') {
        if (isRight) setTopbarIdx(i => Math.min(i + 1, TOPBAR_LINKS.length - 1))
        else if (isLeft) setTopbarIdx(i => Math.max(i - 1, 0))
        else if (isDown) { setFocusZone('hero'); setHeroState('focused') }
        return
      }

      if (zone === 'hero') {
        if (isUp) { setFocusZone('topbar'); setHeroState('default') }
        else if (isDown) { setFocusZone('content'); setHeroState('collapsed'); setContentRow(0) }
        // As setas esquerda/direita são tratadas pelo próprio HeroBanner
        return
      }

      if (zone === 'content') {
        if (isDown) { if (rw < allRows.length - 1) setContentRow(rw + 1) }
        else if (isUp) {
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



  // ═══════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: BG, color: '#fff',
      fontFamily: "'Outfit', sans-serif", overflow: 'hidden',
    }}>

      {/* VIEWPORT */}
      <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>

        {/* TOPBAR — flutuante */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, zIndex: 90,
          height: 72, display: 'flex', alignItems: 'center', padding: '0 80px',
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)',
          transition: 'opacity 400ms, transform 400ms',
          opacity: focusZone === 'content' ? 0 : 1,
          transform: focusZone === 'content' ? 'translateY(-100%)' : 'translateY(0)',
          pointerEvents: focusZone === 'content' ? 'none' : 'auto',
          flexShrink: 0,
        }}>
          <div style={{
            fontSize: '0.85rem', fontWeight: 900, letterSpacing: 1,
            textTransform: 'lowercase', marginRight: 40,
          }}>
            o melhor · <span style={{ color: ACCENT }}>ziiiTV!</span>
          </div>
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

        {/* HERO BANNER Netflix Style */}
        <div style={{
          position: 'relative',
          width: '100%',
          height: '80vh',
          minHeight: '80vh',
          overflow: 'hidden',
        }}>
          <HeroBanner
            slides={mockHeroSlides}
            autoPlayInterval={0}
            onSelect={(slide) => {
              console.log('HeroBanner: selecionado', slide.title);
              // Aqui você pode implementar a lógica para reproduzir o conteúdo
              if (slide.type === 'live') {
                // Buscar canal correspondente
                const channel = Object.values(groups).flat().find(ch => 
                  ch.name.includes(slide.title) || slide.title.includes(ch.name)
                );
                if (channel) {
                  onPlay(channel);
                }
              }
            }}
            onAddToList={(slide) => {
              console.log('HeroBanner: adicionar à lista', slide.title);
              // Implementar lógica para adicionar aos favoritos
            }}
          />
        </div>

        {/* TOP MOVIES BANNER - Comentado pois estava quebrando o layout ao deslizar as linhas por cima dele 
        <TopMoviesBanner
          movies={mockTopMovies}
          autoPlayInterval={5000}
          onSelect={(movie) => {
            console.log('TopMoviesBanner: filme selecionado', movie.title);
          }}
          onAddToList={(movie) => {
            console.log('TopMoviesBanner: adicionar à lista', movie.title);
          }}
        />
        */}
        {/* ROWS — ficam logo abaixo do hero */}
        <div style={{
          position: 'relative',
          top: 0,
          width: '100%',
        }}>
          {rows.map((row, rowIdx) => (
            <div ref={el => { rowRefs.current[rowIdx] = el }} key={rowIdx} style={{ padding: '24px 0', overflow: 'visible' }}>
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
                        fontSize: '1.1rem', fontWeight: 700, textTransform: 'lowercase',
                        transformOrigin: 'center center',
                        willChange: 'transform',
                        transform: focused ? `scale(${FOCUS_SCALE}) translateY(-8px)` : 'scale(1) translateY(0)',
                        boxShadow: focused ? `0 8px 32px rgba(0, 0, 0, 0.55)` : 'none',
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
                const CARD_W = 264;
                const CARD_H = 396;
                const GAP = 20;
                const STEP = CARD_W + GAP;
                
                const isRowFocused = focusZone === 'content' && contentRow === rowIdx
                const focusedIndex = contentCols[rowIdx] || 0
                const isVirtualRow = Math.abs(contentRow - rowIdx) <= 2

                if (!isVirtualRow) {
                  return <div style={{ height: 440 }} />
                }

                // Cálculo da Câmera (Foco Ancorado na Esquerda)
                const cameraShift = -(focusedIndex * STEP)

                // Altura da row expande se estiver focada (espaço para o texto)
                const rowHeight = CARD_H + (isRowFocused ? 140 : 40)

                return (
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    height: rowHeight,
                    paddingTop: 12, overflow: 'hidden',
                    transition: `height ${FOCUS_DURATION}ms ${FOCUS_EASING}`
                  }}
                >
                  <div style={{
                    position: 'absolute',
                    left: 80, top: 12,
                    display: 'flex', flexDirection: 'row', gap: GAP,
                    alignItems: 'flex-start',
                    transform: `translate3d(${cameraShift}px, 0, 0)`,
                    transition: `transform ${FOCUS_DURATION}ms ${FOCUS_EASING}`,
                    willChange: 'transform'
                  }}>
                  {row.channels.map((ch, ci) => {
                    const diffCols = ci - focusedIndex

                    // Virtual DOM - mantém o espaço mas destrói o conteúdo
                    if (diffCols < -4 || diffCols > 6) {
                      return <div key={ci} style={{ flex: `0 0 ${CARD_W}px`, height: CARD_H }} />
                    }

                    const isFocused = isRowFocused && ci === focusedIndex;
                    const expandedW = 696;
                    const currentW = isFocused ? expandedW : CARD_W;
                    
                    return (
                      <div key={ci} onClick={() => onPlay(ch)} style={{
                        position: 'relative',
                        flex: `0 0 ${currentW}px`, height: CARD_H,
                        willChange: 'flex-basis, opacity, transform',
                        zIndex: isFocused ? 10 : 1,
                        opacity: (isRowFocused && !isFocused) ? UNFOCUS_OPACITY : 1,
                        borderRadius: 8, cursor: 'pointer', overflow: 'hidden',
                        boxShadow: isFocused ? '0 10px 40px rgba(0,0,0,0.8)' : 'none',
                        transition: `flex ${FOCUS_DURATION}ms ${FOCUS_EASING}, opacity ${FOCUS_DURATION}ms ${FOCUS_EASING}, box-shadow ${FOCUS_DURATION}ms ${FOCUS_EASING}`,
                      }}>
                        {/* Container fixo para o Poster ancorado à esquerda, impede que o Flex distorça a imagem durante o slide */}
                        <div style={{
                          position: 'absolute', left: 0, top: 0,
                          width: CARD_W, height: '100%',
                          background: '#111', border: isFocused ? `3px solid ${ACCENT}` : `1px solid transparent`,
                          transition: `border-color ${FOCUS_DURATION}ms ${FOCUS_EASING}`,
                          borderRadius: 8, zIndex: 3, overflow: 'hidden'
                        }}>
                          {(() => { 
                             const t = row.tmdb?.get(ch.name); 
                             const src = t?.poster || ch.logo; 
                             return src ? <img src={src} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center'}}>📺</div>;
                          })()}
                        </div>

                        {/* Expansion Area (Backdrop + Fallback Title) */}
                        <div style={{
                          position: 'absolute', left: CARD_W - 8, top: 0,
                          width: expandedW - CARD_W + 8, height: '100%',
                          background: '#111',
                          border: `3px solid ${ACCENT}`, borderLeft: 'none',
                          borderRadius: '0 8px 8px 0',
                          opacity: isFocused ? 1 : 0, overflow: 'hidden',
                          transition: `opacity ${FOCUS_DURATION}ms ${FOCUS_EASING}`,
                          zIndex: 2,
                        }}>
                           {(() => { 
                             const bk = row.tmdb?.get(ch.name)?.backdrop; 
                             if (!bk && !ch.logo) return null;
                             return <img src={bk || ch.logo} style={{
                               width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6,
                             }}/> 
                           })()}
                           <div style={{
                             position: 'absolute', bottom: 0, left: 0, right: 0, height: '60%',
                             background: 'linear-gradient(transparent, rgba(0,0,0,0.95))'
                           }}/>
                           <div style={{
                             position: 'absolute', bottom: 20, left: 24, right: 24,
                             fontSize: 28, fontWeight: 900, textTransform: 'uppercase', textShadow: '0 4px 12px rgba(0,0,0,0.9)'
                           }}>
                             {ch.name}
                           </div>
                        </div>

                        {/* Fallback título no Poster Inativo */}
                        <div style={{
                          position: 'absolute', bottom: 0, left: 0, width: CARD_W, height: '40%',
                          background: 'linear-gradient(transparent, rgba(0,0,0,0.9))',
                          zIndex: 4, opacity: isFocused ? 0 : 1, transition: `opacity ${FOCUS_DURATION}ms ${FOCUS_EASING}`, pointerEvents: 'none'
                        }}>
                           <div style={{
                             position: 'absolute', bottom: 12, left: 12, right: 12,
                             fontSize: '0.8rem', fontWeight: 700, fontFamily: "'Barlow Condensed', sans-serif",
                             textTransform: 'uppercase', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                           }}>{ch.name}</div>
                        </div>
                      </div>
                    )
                  })}
                  </div>

                  {/* Meta Data Overlay - Só na row focada e estilo portrait */}
                  {isRowFocused && (() => {
                    const fch = row.channels[focusedIndex];
                    if (!fch) return null;
                    const tmdb = row.tmdb?.get(fch.name);
                    return (
                      <div 
                        key={fch.name} 
                        style={{
                          position: 'absolute', left: 80, top: CARD_H + 24,
                          width: 580, 
                          animation: `fadeInHero 300ms ease-out`,
                        }}
                      >
                        <div style={{ display: 'flex', gap: 12, fontSize: 14, color: '#e5e5e5', fontWeight: 600, marginBottom: 8, alignItems: 'center' }}>
                          <span style={{ color: '#10b981', fontWeight: 800 }}>{Math.round((tmdb?.rating || 8)*10)}% match</span>
                          <span>{tmdb?.year || '2024'}</span>
                          <span style={{ border: '1px solid rgba(255,255,255,0.4)', padding: '0 4px', borderRadius: 4, textTransform: 'uppercase' }}>TV-MA</span>
                          <span style={{ color: '#fff', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 300 }}>{tmdb?.title || fch.name}</span>
                        </div>
                        <div style={{
                           fontSize: 15, color: '#a3a3a3', lineHeight: 1.4,
                           display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden'
                        }}>
                          {tmdb?.overview || `Sintonize ${fch.name}. Aproveite o melhor do entretenimento diretamente do cosmos com nossa infraestrutura de hipervelocidade.`}
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

        {/* LOADING */}
        {isLoadingContent && (
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
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
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes kenBurnsHero {
          0% { transform: scale(1.0) translate3d(0, 0, 0); }
          100% { transform: scale(1.08) translate3d(-15px, -8px, 0); }
        }
        @keyframes slideUpHero {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 8px ${GLOW}; }
          50% { box-shadow: 0 0 20px ${ACCENT}; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        *::-webkit-scrollbar { display: none; }
        * { scrollbar-width: none; }
      `}</style>
    </div>
  )
}

