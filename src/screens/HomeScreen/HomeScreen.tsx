import { useEffect, useRef, useState } from 'react'
import type { UICategory } from '../../services/categoryMapper'
import type { ContentRow, ScreenContent } from '../../services/contentSelector'
import type { TMDBResult } from '../../services/tmdbService'
import {
  buildHomeContent,
  buildFilmesContent,
  buildSeriesContent,
  buildTvContent,
} from '../../services/contentSelector'
import { recordPlay } from '../../services/historyService'

// ─── Types ───────────────────────────────────────────────────────────────────
interface Channel { name: string; url: string; logo: string; group: string }
interface Props {
  groups: Record<UICategory, Channel[]>
  onPlay: (ch: Channel) => void
  onBack: () => void
}
type FocusZone = 'topbar' | 'hero' | 'content'
type DashboardView = 'home' | 'movies' | 'series' | 'live'

// ─── Design tokens ───────────────────────────────────────────────────────────
const ACCENT    = '#ff006e'
const GLOW      = 'rgba(255,0,110,0.45)'
const TOPBAR_H  = 56
const HERO_MINI = 190   // px quando conteúdo está focado

// ─── Nav links ───────────────────────────────────────────────────────────────
const NAV: Array<{ label: string; view: DashboardView }> = [
  { label: 'FILMES',     view: 'movies' },
  { label: 'SÉRIES',     view: 'series' },
  { label: 'TV AO VIVO', view: 'live'   },
  { label: 'MINHAS TVS', view: 'home'   },
]

// ─── Fallback slides ─────────────────────────────────────────────────────────
const FALLBACK_SLIDES = [
  { title: 'ziiiTV',    sub: 'o melhor player',       desc: 'Milhares de canais ao vivo, filmes e séries.' },
  { title: 'invasão',   sub: 'cerebral · ziiiTV',     desc: 'O melhor conteúdo de filmes e séries ao vivo.' },
  { title: 'domínio',   sub: 'digital · ziiiTV',      desc: 'Streaming de alta qualidade na sua Smart TV.' },
  { title: 'visão',     sub: 'infinita · ziiiTV',     desc: 'Navegação fluida. Categorias inteligentes.' },
  { title: 'universo',  sub: 'ziiiTV · é seu',        desc: 'O futuro do entretenimento já começou.' },
]

const CATEGORY_ICONS: Record<string, string> = {
  filmes: '🎬', series: '📺', esportes: '⚽', infantil: '🎮',
  abertos: '📡', documentarios: '🌍', noticias: '📰', outros: '🔥',
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
export default function HomeScreen({ groups, onPlay, onBack }: Props) {

  // ── State ─────────────────────────────────────────────────────────────────
  const [zone,        setZone]        = useState<FocusZone>('hero')
  const [slide,       setSlide]       = useState(0)
  const [navIdx,      setNavIdx]      = useState(0)
  const [contentRow,  setContentRow]  = useState(0)
  const [contentCols, setContentCols] = useState<number[]>(Array(12).fill(0))
  const [showExit,    setShowExit]    = useState(false)
  const [exitFocus,   setExitFocus]   = useState(0)
  const [activeView,  setActiveView]  = useState<DashboardView>('home')
  const [loading,     setLoading]     = useState(false)
  const [content,     setContent]     = useState<ScreenContent | null>(null)
  const [liveCache,   setLiveCache]   = useState<Record<string, TMDBResult | null>>({})

  // ── Load content ──────────────────────────────────────────────────────────
  useEffect(() => {
    let dead = false
    setLoading(true)
    const fn = async () => {
      const builders: Record<DashboardView, () => Promise<ScreenContent>> = {
        movies: () => buildFilmesContent(groups),
        series: () => buildSeriesContent(groups),
        live:   () => buildTvContent(groups),
        home:   () => buildHomeContent(groups),
      }
      const data = await builders[activeView]()
      if (!dead) {
        setContent(data)
        setLoading(false)
        setSlide(0)
        setContentRow(0)
        setContentCols(Array(data.rows.length).fill(0))
      }
    }
    fn()
    return () => { dead = true }
  }, [groups, activeView])

  const rows         = content?.rows         || []
  const heroTmdb     = content?.heroTmdb     || new Map()
  const heroChannels = content?.heroChannels || []
  const maxSlides    = heroChannels.length > 0 ? heroChannels.length : FALLBACK_SLIDES.length

  // ── Live preview enrich ───────────────────────────────────────────────────
  const previewCh = zone === 'content' && rows[contentRow]
    ? rows[contentRow].channels[contentCols[contentRow]] ?? null
    : null

  useEffect(() => {
    if (!previewCh) return
    const n = previewCh.name
    if (liveCache[n] !== undefined || rows[contentRow]?.tmdb?.has(n)) return
    import('../../services/tmdbService').then(({ enrichChannel }) =>
      enrichChannel(n).then(r => setLiveCache(p => ({ ...p, [n]: r })))
    )
  }, [previewCh, contentRow, rows, liveCache])

  // ── Refs ──────────────────────────────────────────────────────────────────
  const R = {
    zone:        useRef(zone),
    slide:       useRef(slide),
    navIdx:      useRef(navIdx),
    contentRow:  useRef(contentRow),
    contentCols: useRef(contentCols),
    rows:        useRef(rows),
    showExit:    useRef(showExit),
    exitFocus:   useRef(exitFocus),
    maxSlides:   useRef(maxSlides),
  }
  R.zone.current        = zone
  R.slide.current       = slide
  R.navIdx.current      = navIdx
  R.contentRow.current  = contentRow
  R.contentCols.current = contentCols
  R.rows.current        = rows
  R.showExit.current    = showExit
  R.exitFocus.current   = exitFocus
  R.maxSlides.current   = maxSlides

  // ── Auto-slide ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (zone === 'content' || previewCh) return
    const t = setInterval(() => setSlide(s => (s + 1) % maxSlides), 7000)
    return () => clearInterval(t)
  }, [zone, previewCh, maxSlides])

  // ── Scroll focused card into view ─────────────────────────────────────────
  const rowRefs = useRef<(HTMLDivElement | null)[]>([])
  useEffect(() => {
    if (zone !== 'content') return
    const rowEl = rowRefs.current[contentRow]
    if (!rowEl) return
    const card = rowEl.children[contentCols[contentRow]] as HTMLElement
    card?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' })
  }, [zone, contentRow, contentCols])

  // ── Keyboard ──────────────────────────────────────────────────────────────
  useEffect(() => {
    let last = 0
    const handle = (e: KeyboardEvent) => {
      const now = Date.now(); if (now - last < 120) return; last = now

      const BACK  = e.keyCode === 10009 || e.keyCode === 8 || e.key === 'Backspace'
      const OK    = e.key === 'Enter'      || e.keyCode === 13
      const UP    = e.key === 'ArrowUp'    || e.keyCode === 38
      const DOWN  = e.key === 'ArrowDown'  || e.keyCode === 40
      const LEFT  = e.key === 'ArrowLeft'  || e.keyCode === 37
      const RIGHT = e.key === 'ArrowRight' || e.keyCode === 39

      if (!(BACK || OK || UP || DOWN || LEFT || RIGHT)) return
      e.preventDefault()

      if (R.showExit.current) {
        if (LEFT)  setExitFocus(0)
        if (RIGHT) setExitFocus(1)
        if (OK)    R.exitFocus.current === 1 ? onBack() : setShowExit(false)
        if (BACK)  setShowExit(false)
        return
      }

      const z    = R.zone.current
      const rw   = R.contentRow.current
      const cols = R.contentCols.current
      const allR = R.rows.current
      const ms   = R.maxSlides.current

      if (BACK) {
        if (z === 'topbar')  { setShowExit(true); setExitFocus(0) }
        if (z === 'hero')    setZone('topbar')
        if (z === 'content') setZone('hero')
        return
      }

      if (z === 'topbar') {
        if (RIGHT) setNavIdx(i => Math.min(i + 1, NAV.length - 1))
        if (LEFT)  setNavIdx(i => Math.max(i - 1, 0))
        if (DOWN)  setZone('hero')
        if (OK)    { const v = NAV[R.navIdx.current]; if (v) setActiveView(v.view) }
        return
      }

      if (z === 'hero') {
        if (UP)    setZone('topbar')
        if (DOWN)  { setZone('content'); setContentRow(0) }
        if (RIGHT) setSlide(s => (s + 1) % ms)
        if (LEFT)  setSlide(s => (s - 1 + ms) % ms)
        if (OK) {
          const ch = heroChannels[R.slide.current % Math.max(heroChannels.length, 1)]
          if (ch) { recordPlay(ch.name, ch.group); onPlay(ch) }
        }
        return
      }

      if (z === 'content') {
        if (UP)   { rw === 0 ? setZone('hero') : setContentRow(rw - 1) }
        if (DOWN) { if (rw < allR.length - 1) setContentRow(rw + 1) }
        if (RIGHT) {
          const max = (allR[rw]?.channels.length || 1) - 1
          if (cols[rw] < max) { const n = [...cols]; n[rw]++; setContentCols(n) }
        }
        if (LEFT) {
          if (cols[rw] > 0) { const n = [...cols]; n[rw]--; setContentCols(n) }
        }
        if (OK) {
          const row = allR[rw]
          if (!row) return
          if (row.type === 'grid') {
            const map: Record<string, DashboardView> = { filmes:'movies', series:'series', 'tv ao vivo':'live', abertos:'live', esportes:'live' }
            setActiveView(map[row.channels[cols[rw]]?.name?.toLowerCase()] || 'home')
          } else {
            const ch = row.channels[cols[rw]]
            if (ch) { recordPlay(ch.name, ch.group); onPlay(ch) }
          }
        }
      }
    }
    document.addEventListener('keydown', handle)
    return () => document.removeEventListener('keydown', handle)
  }, []) // eslint-disable-line

  // ── Hero data ─────────────────────────────────────────────────────────────
  const getSlide = (idx: number) => {
    const norm = ((idx % maxSlides) + maxSlides) % maxSlides
    const ch   = heroChannels[norm]
    if (ch) {
      const t = heroTmdb.get(ch.name) || null
      return { backdrop: t?.backdrop || '', poster: t?.poster || ch.logo || '', title: t?.title || ch.name, sub: ch.group, rating: t?.rating || 0, year: t?.year || '', ch }
    }
    const fb = FALLBACK_SLIDES[norm % FALLBACK_SLIDES.length]
    return { backdrop: '', poster: '', title: fb.title, sub: fb.sub, rating: 0, year: '', ch: null }
  }

  const centerData   = getSlide(slide)
  const heroExpanded = zone !== 'content'

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: '#000', color: '#fff',
      fontFamily: "'Outfit', sans-serif",
      overflow: 'hidden',
    }}>

      {/* ══════════════════════════════════════════════════════════════════
          HERO — fullscreen, ocupa a tela toda quando expandido
      ══════════════════════════════════════════════════════════════════ */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0,
        height: heroExpanded ? '100vh' : HERO_MINI,
        transition: 'height 500ms cubic-bezier(0.4,0,0.2,1)',
        overflow: 'hidden',
        background: '#000',
      }}>

        {/* ── imagem de fundo fullscreen ─────────────────────────────── */}
        <img
          key={slide}
          src={centerData.backdrop || centerData.poster || 'hero-alien.png'}
          alt={centerData.title}
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover',
            objectPosition: 'center top',
            animation: 'fadeIn 600ms ease',
          }}
          onError={ev => { (ev.target as HTMLImageElement).src = 'hero-alien.png' }}
        />

        {/* ── gradientes sobre a imagem ──────────────────────────────── */}
        {/* topo → escurece para a topbar */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 160,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.72) 0%, transparent 100%)',
          zIndex: 2,
        }} />
        {/* fundo → escurece para os textos */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '60%',
          background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.45) 60%, transparent 100%)',
          zIndex: 2,
        }} />
        {/* lateral esquerda → degrade suave */}
        <div style={{
          position: 'absolute', top: 0, left: 0, bottom: 0, width: '50%',
          background: 'linear-gradient(to right, rgba(0,0,0,0.6) 0%, transparent 100%)',
          zIndex: 2,
        }} />

        {/* ── info do slide — canto inferior esquerdo ────────────────── */}
        {heroExpanded && (
          <div style={{
            position: 'absolute', bottom: 64, left: 72,
            zIndex: 10, maxWidth: 640,
          }}>
            {/* badge ao vivo */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 7,
              background: ACCENT, padding: '4px 14px 4px 10px',
              borderRadius: 5, marginBottom: 18,
              fontSize: 12, fontWeight: 900, letterSpacing: 2.5, textTransform: 'uppercase',
            }}>
              <div style={{
                width: 7, height: 7, borderRadius: '50%', background: '#fff',
                animation: 'pulse 1.5s ease-in-out infinite',
              }} />
              AO VIVO
            </div>

            {/* título grande */}
            <div style={{
              fontSize: 'clamp(32px, 4.5vw, 72px)',
              fontWeight: 900,
              lineHeight: 1.0,
              letterSpacing: '-0.03em',
              textShadow: '0 4px 24px rgba(0,0,0,0.85)',
              marginBottom: 14,
              textTransform: 'lowercase',
            }}>
              {centerData.title}
            </div>

            {/* meta */}
            <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 24 }}>
              {centerData.rating > 0 && (
                <span style={{ fontSize: 18, color: '#fbbf24', fontWeight: 700 }}>⭐ {centerData.rating.toFixed(1)}</span>
              )}
              {centerData.year && <span style={{ fontSize: 18, color: 'rgba(255,255,255,0.65)' }}>{centerData.year}</span>}
              {centerData.sub  && (
                <span style={{ fontSize: 15, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: 1.5 }}>
                  {centerData.sub}
                </span>
              )}
            </div>

            {/* botão play — só quando hero focado */}
            {zone === 'hero' && (
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 12,
                background: '#fff', color: '#000',
                padding: '14px 36px', borderRadius: 8,
                fontSize: 18, fontWeight: 900,
                boxShadow: `0 6px 32px rgba(0,0,0,0.7), 0 0 0 3px ${ACCENT}`,
              }}>
                ▶ Assistir agora
              </div>
            )}
          </div>
        )}

        {/* ── dots ───────────────────────────────────────────────────── */}
        {heroExpanded && maxSlides > 1 && (
          <div style={{
            position: 'absolute', bottom: 24, right: 72,
            display: 'flex', gap: 6, zIndex: 10,
          }}>
            {Array.from({ length: Math.min(maxSlides, 10) }).map((_, i) => (
              <div key={i} style={{
                width: slide === i ? 28 : 6, height: 6, borderRadius: 3,
                background: slide === i ? ACCENT : 'rgba(255,255,255,0.28)',
                transition: 'all 300ms ease',
              }} />
            ))}
          </div>
        )}

        {/* ── setas de navegação ─────────────────────────────────────── */}
        {zone === 'hero' && heroExpanded && (
          <>
            <div style={arrowStyle('left')}>‹</div>
            <div style={arrowStyle('right')}>›</div>
          </>
        )}

        {/* ── foco border quando hero está ativo ─────────────────────── */}
        {zone === 'hero' && heroExpanded && (
          <div style={{
            position: 'absolute', inset: 0, zIndex: 5,
            boxShadow: `inset 0 0 0 3px ${ACCENT}`,
            pointerEvents: 'none',
            borderRadius: 0,
          }} />
        )}
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          TOPBAR — flutua sobre o hero
      ══════════════════════════════════════════════════════════════════ */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        height: TOPBAR_H,
        display: 'flex', alignItems: 'center',
        padding: '0 72px', gap: 48,
        zIndex: 100,
        pointerEvents: 'none',
      }}>
        {/* logo */}
        <div style={{
          fontSize: 22, fontWeight: 900, letterSpacing: -0.5,
          color: '#fff', marginRight: 16,
        }}>
          ziii<span style={{ color: ACCENT }}>TV</span>
        </div>

        {NAV.map((link, i) => {
          const active  = zone === 'topbar' && navIdx === i
          const current = activeView === link.view
          return (
            <span key={i} style={{
              fontSize: 18, fontWeight: 800, letterSpacing: 1.5,
              color: active ? '#fff' : current ? ACCENT : 'rgba(255,255,255,0.55)',
              borderBottom: active ? `2px solid #fff` : current ? `2px solid ${ACCENT}` : '2px solid transparent',
              paddingBottom: 2,
              transition: 'all 200ms',
              textShadow: active ? `0 0 20px #fff` : 'none',
            }}>
              {link.label}
            </span>
          )
        })}
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          ROWS — surgem por baixo quando hero encolhe
      ══════════════════════════════════════════════════════════════════ */}
      <div style={{
        position: 'absolute',
        top: heroExpanded ? '100vh' : HERO_MINI,
        left: 0, right: 0, bottom: 0,
        overflowY: 'auto',
        overflowX: 'hidden',
        transition: 'top 500ms cubic-bezier(0.4,0,0.2,1)',
        background: 'linear-gradient(to bottom, #000 0%, #0a0a0a 100%)',
        scrollbarWidth: 'none',
      }}>
        {rows.map((row, ri) => {
          const rowFocused = zone === 'content' && contentRow === ri
          return (
            <div key={ri} style={{ paddingBottom: 28 }}>
              {/* row title */}
              <div style={{
                padding: '20px 60px 12px',
                fontSize: 20, fontWeight: 800, textTransform: 'lowercase',
                color: rowFocused ? '#fff' : 'rgba(255,255,255,0.38)',
                transition: 'color 200ms',
              }}>
                {row.title}
                <span style={{ color: ACCENT }}>{row.titleAccent}</span>
              </div>

              {/* grid */}
              {row.type === 'grid' ? (
                <div style={{
                  display: 'grid', gridTemplateColumns: 'repeat(4,1fr)',
                  gap: 16, padding: '0 60px',
                }}>
                  {row.channels.slice(0, 8).map((cat, ci) => {
                    const f = rowFocused && contentCols[ri] === ci
                    return (
                      <div key={ci} style={{
                        height: 110,
                        background: f ? ACCENT : 'rgba(255,255,255,0.04)',
                        border: f ? `none` : '1px dashed rgba(255,255,255,0.09)',
                        borderRadius: 18,
                        display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'center', gap: 8,
                        fontSize: 18, fontWeight: 700, textTransform: 'lowercase',
                        transform: f ? 'translateY(-5px)' : 'none',
                        boxShadow: f ? `0 14px 32px ${GLOW}` : 'none',
                        transition: 'all 260ms cubic-bezier(0.34,1.56,0.64,1)',
                      }}>
                        <span style={{ fontSize: 26 }}>{CATEGORY_ICONS[cat.name] || '📂'}</span>
                        <span>{cat.name}</span>
                      </div>
                    )
                  })}
                </div>

              ) : (
                <div
                  ref={el => { rowRefs.current[ri] = el }}
                  style={{
                    display: 'flex',
                    gap: row.type === 'portrait' ? 10 : 8,
                    overflowX: 'auto', overflowY: 'visible',
                    padding: '8px 0 16px 60px',
                    scrollbarWidth: 'none',
                  }}
                >
                  {row.channels.map((ch, ci) => {
                    const f   = rowFocused && contentCols[ri] === ci
                    const t   = row.tmdb?.get(ch.name)
                    const src = t?.poster || ch.logo

                    if (row.type === 'portrait') {
                      return (
                        <div key={ci} onClick={() => onPlay(ch)} style={{
                          position: 'relative',
                          width: 190, minWidth: 190, height: 285,
                          borderRadius: 10, overflow: 'hidden',
                          flexShrink: 0, cursor: 'pointer',
                          transform: f ? 'scale(1.07)' : 'scale(1)',
                          zIndex: f ? 10 : 1,
                          border: f ? `3px solid ${ACCENT}` : '1px solid rgba(255,255,255,0.06)',
                          boxShadow: f ? `0 0 32px ${GLOW}` : 'none',
                          transition: 'all 260ms cubic-bezier(0.34,1.56,0.64,1)',
                          background: 'linear-gradient(135deg,#1a1a2e,#16213e)',
                        }}>
                          {src && <img src={src} style={{ width:'100%',height:'100%',objectFit:'cover' }} />}
                          <div style={{
                            position:'absolute',bottom:0,left:0,right:0,
                            padding:'6px 8px 8px',
                            background:'linear-gradient(transparent,rgba(0,0,0,0.92))',
                            fontSize: 14, fontWeight: 700,
                            whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',
                          }}>{ch.name}</div>
                        </div>
                      )
                    }

                    const isWide = row.type === 'wide'
                    return (
                      <div key={ci} onClick={() => onPlay(ch)} style={{
                        position: 'relative', display:'flex', alignItems:'flex-end',
                        minWidth: isWide ? 380 : 260, flexShrink: 0, cursor:'pointer',
                        transition: 'all 260ms cubic-bezier(0.34,1.56,0.64,1)',
                      }}>
                        {isWide && (
                          <div style={{
                            fontSize:'6.5rem',fontWeight:900,lineHeight:1,
                            color:'transparent',
                            WebkitTextStroke: f ? `2px ${ACCENT}` : '2px rgba(255,255,255,0.1)',
                            width:100,textAlign:'right',
                            marginBottom:-16,marginRight:-2,zIndex:2,
                            transition:'all 200ms',
                          }}>{ci+1}</div>
                        )}
                        <div>
                          <div style={{
                            width: isWide?270:230, height: isWide?152:128,
                            borderRadius:11,overflow:'hidden',
                            background:'linear-gradient(135deg,#0f0f23,#1a1a2e)',
                            display:'flex',alignItems:'center',justifyContent:'center',
                            border: f ? `3px solid ${ACCENT}` : '1px solid rgba(255,255,255,0.06)',
                            boxShadow: f ? `0 0 28px ${GLOW}` : 'none',
                            transition:'all 200ms',
                            opacity: f ? 1 : 0.78,
                          }}>
                            {src
                              ? <img src={src} style={{width:'100%',height:'100%',objectFit:'cover'}} />
                              : <span style={{fontSize:28}}>📺</span>
                            }
                          </div>
                          <div style={{
                            fontSize:14,fontWeight:700,marginTop:6,
                            whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',
                            maxWidth: isWide?270:230,
                          }}>{ch.name}</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          LOADING
      ══════════════════════════════════════════════════════════════════ */}
      {loading && (
        <div style={{
          position:'fixed',inset:0,
          background:'rgba(0,0,0,0.88)',
          display:'flex',alignItems:'center',justifyContent:'center',
          zIndex:300,
        }}>
          <div style={{textAlign:'center'}}>
            <div style={{fontSize:52,marginBottom:18,animation:'spin 2s linear infinite'}}>🛸</div>
            <div style={{fontSize:18,fontWeight:700,letterSpacing:2,textTransform:'uppercase'}}>carregando...</div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          EXIT DIALOG
      ══════════════════════════════════════════════════════════════════ */}
      {showExit && (
        <div style={{
          position:'fixed',inset:0,background:'rgba(0,0,0,0.88)',
          display:'flex',alignItems:'center',justifyContent:'center',zIndex:9999,
        }}>
          <div style={{
            background:'#111',border:`2px solid rgba(255,0,110,0.35)`,
            borderRadius:16,padding:'56px 80px',textAlign:'center',
            boxShadow:`0 0 60px ${GLOW}`,
          }}>
            <div style={{fontSize:34,fontWeight:700,marginBottom:10}}>
              sair do <span style={{color:ACCENT}}>ziiiTV</span>?
            </div>
            <div style={{fontSize:17,color:'#888',marginBottom:36}}>tem certeza?</div>
            <div style={{display:'flex',gap:18,justifyContent:'center'}}>
              {['cancelar','sair'].map((lb,i) => {
                const f = exitFocus === i
                return (
                  <div key={i} style={{
                    background: i===1 ? (f?ACCENT:'rgba(255,0,110,0.25)') : (f?'rgba(255,255,255,0.18)':'rgba(255,255,255,0.08)'),
                    padding:'14px 48px',borderRadius:100,fontSize:19,fontWeight:700,
                    border: f?`3px solid ${ACCENT}`:'3px solid transparent',
                    transform: f?'scale(1.07)':'scale(1)',
                    boxShadow: f?`0 0 22px ${GLOW}`:'none',
                    transition:'all 180ms', cursor:'pointer',
                  }}>{lb}</div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse   { 0%,100%{opacity:1} 50%{opacity:0.25} }
        @keyframes spin    { to{transform:rotate(360deg)} }
        @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
        *::-webkit-scrollbar { display:none }
        * { scrollbar-width:none }
      `}</style>
    </div>
  )
}

// ─── helpers ─────────────────────────────────────────────────────────────────
function arrowStyle(side: 'left' | 'right'): React.CSSProperties {
  return {
    position: 'absolute', [side]: 24, top: '50%',
    transform: 'translateY(-50%)',
    zIndex: 30, fontSize: 44,
    color: 'rgba(255,255,255,0.7)',
    background: 'rgba(0,0,0,0.5)',
    width: 52, height: 52, borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    pointerEvents: 'none',
  }
}
