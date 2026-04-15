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
const TOPBAR_H  = 56          // px
const HERO_FULL = '100vh'     // banner ocupa tela toda
const HERO_MINI = 180         // px quando conteúdo está focado

// ─── Nav links ───────────────────────────────────────────────────────────────
const NAV: Array<{ label: string; view: DashboardView }> = [
  { label: 'FILMES',     view: 'movies' },
  { label: 'SÉRIES',     view: 'series' },
  { label: 'TV AO VIVO', view: 'live'   },
  { label: 'MINHAS TVS', view: 'home'   },
]

// ─── Fallback slides (antes do TMDB carregar) ────────────────────────────────
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

  // ── Refs for closure-safe keydown ─────────────────────────────────────────
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

      // ── exit dialog ────────────────────────────────────────────────────────
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

      // ── back ────────────────────────────────────────────────────────────
      if (BACK) {
        if (z === 'topbar') { setShowExit(true); setExitFocus(0) }
        if (z === 'hero')   setZone('topbar')
        if (z === 'content') setZone('hero')
        return
      }

      // ── topbar ──────────────────────────────────────────────────────────
      if (z === 'topbar') {
        if (RIGHT) setNavIdx(i => Math.min(i + 1, NAV.length - 1))
        if (LEFT)  setNavIdx(i => Math.max(i - 1, 0))
        if (DOWN)  setZone('hero')
        if (OK) { const v = NAV[R.navIdx.current]; if (v) setActiveView(v.view) }
        return
      }

      // ── hero ─────────────────────────────────────────────────────────────
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

      // ── content ──────────────────────────────────────────────────────────
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

  const centerData = getSlide(slide)

  // ── Hero height ───────────────────────────────────────────────────────────
  const heroExpanded = zone !== 'content'
  const heroH        = heroExpanded ? HERO_FULL : `${HERO_MINI}px`

  // ── Content scroll ────────────────────────────────────────────────────────
  const ROW_H         = 280
  const contentOffset = zone === 'content' ? -(contentRow * ROW_H) : 0

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
          TOPBAR — flutua sobre o banner
      ══════════════════════════════════════════════════════════════════ */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        height: TOPBAR_H,
        display: 'flex', alignItems: 'center',
        padding: '0 60px', gap: 40,
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.75) 0%, transparent 100%)',
        zIndex: 100,
        pointerEvents: 'none',
      }}>
        {NAV.map((link, i) => {
          const active  = zone === 'topbar' && navIdx === i
          const current = activeView === link.view
          return (
            <span key={i} style={{
              fontSize: 20, fontWeight: 900, letterSpacing: 1.5,
              color: active ? '#fff' : current ? ACCENT : 'rgba(255,255,255,0.5)',
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
          HERO — ocupa a tela TODA quando expandido
      ══════════════════════════════════════════════════════════════════ */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        height: heroH,
        transition: 'height 500ms cubic-bezier(0.4,0,0.2,1)',
        overflow: 'hidden',
        background: '#000',
      }}>

        {/* ── carrossel de cards ─────────────────────────────────────── */}
        <div style={{ position: 'absolute', inset: 0 }}>
          {[-2, -1, 0, 1, 2].map(offset => {
            const d        = getSlide(slide + offset)
            const isCenter = offset === 0
            const abs      = Math.abs(offset)
            const scale    = isCenter ? 1 : abs === 1 ? 0.87 : 0.74
            const opacity  = isCenter ? 1 : abs === 1 ? 0.55 : 0.25
            const zIdx     = isCenter ? 10 : abs === 1 ? 5 : 2

            // Largura do card central = 72% da tela → deixa ~14% de cada lado visível
            const CW   = 72   // % da largura total para o card central
            const STEP = CW * 0.78 // passo lateral em %
            const xPct = offset * STEP

            return (
              <div
                key={`${slide}-${offset}`}
                style={{
                  position: 'absolute',
                  top: '50%', left: '50%',
                  width: `${CW}%`,
                  // altura proporcional 16/9 ou fixo ~75vh
                  height: heroExpanded ? '75vh' : '100%',
                  transform: `translate(calc(-50% + ${xPct}vw), -50%) scale(${scale})`,
                  transformOrigin: 'center center',
                  opacity,
                  zIndex: zIdx,
                  borderRadius: 14,
                  overflow: 'hidden',
                  transition: 'all 450ms cubic-bezier(0.34,1.2,0.64,1)',
                  boxShadow: isCenter && zone === 'hero'
                    ? `0 0 0 3px ${ACCENT}, 0 40px 100px rgba(0,0,0,0.9), 0 0 80px ${GLOW}`
                    : isCenter
                    ? '0 20px 80px rgba(0,0,0,0.8)'
                    : 'none',
                  cursor: isCenter ? 'pointer' : 'default',
                }}
                onClick={() => {
                  if (!isCenter) return
                  const ch = d.ch
                  if (ch) { recordPlay(ch.name, ch.group); onPlay(ch) }
                }}
              >
                {/* imagem de fundo */}
                <img
                  src={d.backdrop || d.poster || 'hero-alien.png'}
                  alt={d.title}
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={ev => { (ev.target as HTMLImageElement).src = 'hero-alien.png' }}
                />

                {/* overlay escurecimento */}
                <div style={{
                  position: 'absolute', inset: 0,
                  background: isCenter
                    ? 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.15) 55%, transparent 100%)'
                    : 'rgba(0,0,0,0.52)',
                  transition: 'background 400ms',
                }} />

                {/* info — só no card central e quando hero expandido */}
                {isCenter && heroExpanded && (
                  <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0,
                    padding: '32px 40px',
                    display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
                    gap: 24,
                  }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      {/* badge */}
                      <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: 7,
                        background: ACCENT, padding: '4px 12px 4px 10px',
                        borderRadius: 5, marginBottom: 14,
                        fontSize: 12, fontWeight: 900, letterSpacing: 2.5, textTransform: 'uppercase',
                      }}>
                        <div style={{
                          width: 7, height: 7, borderRadius: '50%', background: '#fff',
                          animation: 'pulse 1.5s ease-in-out infinite',
                        }} />
                        AO VIVO
                      </div>

                      {/* título */}
                      <div style={{
                        fontSize: 'clamp(28px,3.2vw,52px)', fontWeight: 900,
                        lineHeight: 1.05, letterSpacing: '-0.03em',
                        textShadow: '0 3px 16px rgba(0,0,0,0.9)',
                        marginBottom: 10,
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                        maxWidth: '100%',
                      }}>
                        {centerData.title}
                      </div>

                      {/* meta */}
                      <div style={{ display: 'flex', gap: 14, alignItems: 'center', fontSize: 15 }}>
                        {centerData.rating > 0 && (
                          <span style={{ color: '#fbbf24', fontWeight: 700 }}>⭐ {centerData.rating.toFixed(1)}</span>
                        )}
                        {centerData.year && <span style={{ color: 'rgba(255,255,255,0.6)' }}>{centerData.year}</span>}
                        {centerData.sub  && <span style={{ color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', fontSize: 13, letterSpacing: 1 }}>{centerData.sub}</span>}
                      </div>
                    </div>

                    {/* botão play */}
                    {zone === 'hero' && (
                      <div style={{
                        background: '#fff', color: '#000',
                        padding: '14px 32px', borderRadius: 8,
                        fontSize: 16, fontWeight: 900,
                        display: 'flex', alignItems: 'center', gap: 10,
                        boxShadow: '0 6px 24px rgba(0,0,0,0.6)',
                        flexShrink: 0, whiteSpace: 'nowrap',
                      }}>
                        ▶ Assistir agora
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* ── setas ──────────────────────────────────────────────────── */}
        {zone === 'hero' && heroExpanded && (
          <>
            <div style={arrowStyle('left')}>‹</div>
            <div style={arrowStyle('right')}>›</div>
          </>
        )}

        {/* ── dots ───────────────────────────────────────────────────── */}
        {heroExpanded && maxSlides > 1 && (
          <div style={{
            position: 'absolute', bottom: 22, left: 0, right: 0,
            display: 'flex', justifyContent: 'center', gap: 6, zIndex: 20,
          }}>
            {Array.from({ length: Math.min(maxSlides, 10) }).map((_, i) => (
              <div key={i} style={{
                width: slide === i ? 26 : 6, height: 6, borderRadius: 3,
                background: slide === i ? ACCENT : 'rgba(255,255,255,0.28)',
                transition: 'all 300ms ease',
              }} />
            ))}
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          ROWS — surgem por baixo quando hero encolhe
      ══════════════════════════════════════════════════════════════════ */}
      <div style={{
        position: 'absolute',
        top: heroExpanded ? '100vh' : HERO_MINI,
        left: 0, right: 0, bottom: 0,
        overflow: 'hidden',
        transition: 'top 500ms cubic-bezier(0.4,0,0.2,1)',
        background: '#000',
      }}>
        <div style={{
          transform: `translateY(${contentOffset}px)`,
          transition: 'transform 500ms cubic-bezier(0.4,0,0.2,1)',
        }}>
          {rows.map((row, ri) => {
            const rowFocused = zone === 'content' && contentRow === ri
            return (
              <div key={ri} style={{ paddingBottom: 24 }}>
                {/* row title */}
                <div style={{
                  padding: '18px 56px 10px',
                  fontSize: 19, fontWeight: 800, textTransform: 'lowercase',
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
                    gap: 16, padding: '0 56px',
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
                          fontSize: 17, fontWeight: 700, textTransform: 'lowercase',
                          transform: f ? 'translateY(-5px)' : 'none',
                          boxShadow: f ? `0 14px 32px ${GLOW}` : 'none',
                          transition: 'all 260ms cubic-bezier(0.34,1.56,0.64,1)',
                        }}>
                          <span style={{ fontSize: 24 }}>{CATEGORY_ICONS[cat.name] || '📂'}</span>
                          <span>{cat.name}</span>
                        </div>
                      )
                    })}
                  </div>

                ) : (
                  // horizontal scroll
                  <div
                    ref={el => { rowRefs.current[ri] = el }}
                    style={{
                      display: 'flex',
                      gap: row.type === 'portrait' ? 10 : 8,
                      overflowX: 'auto', overflowY: 'visible',
                      padding: '8px 0 16px 56px',
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
                              fontSize: 13, fontWeight: 700,
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
                              fontSize:13,fontWeight:700,marginTop:6,
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
        @keyframes pulse { 0%,100%{opacity:1}50%{opacity:0.25} }
        @keyframes spin  { to{transform:rotate(360deg)} }
        *::-webkit-scrollbar { display:none }
        *  { scrollbar-width:none }
      `}</style>
    </div>
  )
}

// ─── helpers ─────────────────────────────────────────────────────────────────
function arrowStyle(side: 'left' | 'right'): React.CSSProperties {
  return {
    position: 'absolute', [side]: 16, top: '50%',
    transform: 'translateY(-50%)',
    zIndex: 30, fontSize: 38,
    color: 'rgba(255,255,255,0.65)',
    background: 'rgba(0,0,0,0.45)',
    width: 48, height: 48, borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    pointerEvents: 'none',
  }
}
