import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import type { Channel } from '../../types/channel';
import { useStreamPreview } from '../../hooks/useStreamPreview';
import './HeroBanner.css';

export interface HeroSlide {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  badge?: string;
  backgroundImage: string;
  videoUrl?: string;
  type: 'movie' | 'series' | 'live';
  tmdbId?: number; // Para conectar com TMDB/Youtube
  channel?: Channel; // Canal físico M3U para autoplay
}

interface HeroBannerProps {
  slides: HeroSlide[];
  autoPlayInterval?: number;
  onSelect?: (slide: HeroSlide) => void;
  onAddToList?: (slide: HeroSlide) => void;
  focused?: boolean;
}

export function HeroBanner({
  slides,
  autoPlayInterval = 7000,
  onSelect,
  onAddToList,
  focused = false,
}: HeroBannerProps) {
  const hasMultiple = slides.length > 1;
  const extendedSlides = useMemo(() => {
    if (!hasMultiple) return slides.map(s => ({ ...s, _key: s.id }));
    return [
      { ...slides[slides.length - 1], _key: 'clone-last' },
      ...slides.map((s, i) => ({ ...s, _key: `${s.id}-${i}` })),
      { ...slides[0], _key: 'clone-first' }
    ];
  }, [slides, hasMultiple]);

  const [internalIndex, setInternalIndex] = useState(hasMultiple ? 1 : 0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(autoPlayInterval > 0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const currentIndex = hasMultiple 
    ? (internalIndex === 0 ? slides.length - 1 : internalIndex === extendedSlides.length - 1 ? 0 : internalIndex - 1)
    : 0;

  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const autoPlayTimerRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const lastKeyPressRef = useRef<number>(0);

  // Hook nativo AVPlay para Background Video
  const currentSlideValid = extendedSlides[currentIndex];
  const { videoStyle, backdropStyle } = useStreamPreview(
    currentSlideValid?.channel || null,
    focused,
    {
      idleDelay: 1500,
      previewDuration: 15000,
      seekToMs: 270000,
      fadeDuration: 400,
    }
  );

  // Parallax no background
  const updateParallax = useCallback(() => {
    if (!trackRef.current) return;
    const track = trackRef.current;
    const screenCenter = window.innerWidth / 2;
    extendedSlides.forEach((_, index) => {
      const slide = track.children[index] as HTMLElement;
      if (!slide) return;
      const slideRect = slide.getBoundingClientRect();
      const slideCenter = slideRect.left + slideRect.width / 2;
      const offset = (slideCenter - screenCenter) / window.innerWidth;
      const bg = slide.querySelector('.hero-bg') as HTMLElement;
      if (bg) bg.style.transform = `translateX(${offset * 30}px)`;
    });
  }, [extendedSlides]);

  // Handle slide changing
  const goToSlide = useCallback((newInternal: number, animated = true) => {
    if (!hasMultiple) return;
    setInternalIndex(newInternal);
    setIsTransitioning(animated);

    if (trackRef.current) {
      const slideWidth = window.innerWidth - 120;
      const gap = 16;
      const position = -(newInternal * (slideWidth + gap));

      trackRef.current.style.transition = animated
        ? 'transform 1.1s cubic-bezier(0.16, 1, 0.3, 1)'
        : 'none';
      trackRef.current.style.transform = `translateX(${position}px)`;
    }

    // Logic to handle snapping back infinitely
    if (animated && (newInternal === 0 || newInternal === extendedSlides.length - 1)) {
      setTimeout(() => {
        if (!trackRef.current) return;
        const targetInternal = newInternal === 0 ? slides.length : 1;
        setInternalIndex(targetInternal);
        setIsTransitioning(false);
        const slideWidth = window.innerWidth - 120;
        const gap = 16;
        const position = -(targetInternal * (slideWidth + gap));
        trackRef.current.style.transition = 'none';
        trackRef.current.style.transform = `translateX(${position}px)`;
      }, 1100);
    } else {
      setTimeout(() => setIsTransitioning(false), 1100);
    }
  }, [hasMultiple, slides.length, extendedSlides.length]);

  // Auto-play interval handling
  useEffect(() => {
    if (!isAutoPlaying || autoPlayInterval <= 0) {
      clearTimeout(autoPlayTimerRef.current);
      if (progressRef.current) progressRef.current.style.width = '0%';
      return;
    }

    clearTimeout(autoPlayTimerRef.current);
    if (progressRef.current) {
      progressRef.current.style.transition = 'none';
      progressRef.current.style.width = '0%';
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (progressRef.current) {
            progressRef.current.style.transition = `width ${autoPlayInterval}ms linear`;
            progressRef.current.style.width = '100%';
          }
        });
      });
    }

    autoPlayTimerRef.current = setTimeout(() => {
      goToSlide(internalIndex + 1, true);
    }, autoPlayInterval);

    return () => clearTimeout(autoPlayTimerRef.current);
  }, [internalIndex, isAutoPlaying, autoPlayInterval, goToSlide]);

  // Initial layout and Parallax
  useEffect(() => {
    // Force a position layout on mount or slides change without animation
    if (slides.length > 0) goToSlide(hasMultiple ? 1 : 0, false);
    setIsAutoPlaying(autoPlayInterval > 0);
  }, [slides, hasMultiple, goToSlide, autoPlayInterval]);

  useEffect(() => {
    updateParallax();
  }, [internalIndex, updateParallax]);

  // D-pad
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const now = Date.now();
      if (now - lastKeyPressRef.current < 400) return;
      
      // se ainda estiver animando do snap
      if (isTransitioning) return;
      
      // A TV envia keys sempre para window. O controle de focus global fica no HomeScreen.
      // O HeroBanner só reage se ele tiver focused == true passado via props
      if (!focused) return;

      switch (e.key) {
        case 'ArrowLeft':  
          lastKeyPressRef.current = now;
          setIsAutoPlaying(false);
          goToSlide(internalIndex - 1); 
          break;
        case 'ArrowRight': 
          lastKeyPressRef.current = now;
          setIsAutoPlaying(false);
          goToSlide(internalIndex + 1); 
          break;
        case 'Enter':
          lastKeyPressRef.current = now;
          if (onSelect && slides[currentIndex]) onSelect(slides[currentIndex]);
          break;
        case 'F1':
          lastKeyPressRef.current = now;
          if (onAddToList && slides[currentIndex]) onAddToList(slides[currentIndex]);
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [internalIndex, isTransitioning, currentIndex, slides, goToSlide, onSelect, onAddToList, focused]);

  // Resize
  useEffect(() => {
    const handleResize = () => goToSlide(internalIndex, false);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [internalIndex, goToSlide]);

  if (slides.length === 0) {
    return <div className="hero-empty">Nenhum conteúdo disponível</div>;
  }

  return (
    <div className={`hero-viewport${focused ? ' hero-focused' : ''}`}>
      <object
        id="av-hero-player"
        type="application/avplayer"
        style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%',
          zIndex: 0, pointerEvents: 'none',
          ...videoStyle
        }}
      />
      <div
        ref={trackRef}
        className="hero-track"
        style={{ gap: '16px', padding: '0 60px' }}
      >
        {extendedSlides.map((slide, index) => {
          const isActive = hasMultiple 
            ? index === internalIndex
            : index === currentIndex;

          return (
            <div
              key={`${slide._key}-${index}`}
              className={`hero-slide ${isActive ? 'active' : ''}`}
              data-index={index}
            >
              <div
                className="hero-bg"
                style={{
                  backgroundImage: `url(${slide.backgroundImage})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  zIndex: 1,
                  ...(isActive ? backdropStyle : {})
                }}
              />
              <div className="hero-overlay" style={{ zIndex: 2 }} />
              <div className="hero-content" style={{ zIndex: 3 }}>
                {slide.badge && <span className="hero-badge">{slide.badge}</span>}
                <h1 className="hero-title">{slide.title}</h1>
                {slide.subtitle && <h2 className="hero-subtitle">{slide.subtitle}</h2>}
                <p className="hero-description">{slide.description}</p>
                <div className="hero-actions">
                  <button className="hero-btn hero-btn-primary" onClick={() => onSelect?.(slides[currentIndex])}>▶ Assistir</button>
                  <button className="hero-btn hero-btn-secondary" onClick={() => onAddToList?.(slides[currentIndex])}>+ Minha Lista</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="hero-progress-container">
        <div ref={progressRef} className="hero-progress" style={{ width: '0%' }} />
      </div>

      <div className="hero-dots">
        {slides.map((_, dotIndex) => (
          <button
            key={dotIndex}
            className={`hero-dot ${dotIndex === currentIndex ? 'active' : ''}`}
            onClick={() => { 
              setIsAutoPlaying(false); 
              clearTimeout(autoPlayTimerRef.current); 
              goToSlide(hasMultiple ? dotIndex + 1 : dotIndex); 
            }}
            aria-label={`Ir para slide ${dotIndex + 1}`}
          />
        ))}
      </div>

      <div className="hero-controls">
        <button
          className="hero-control-btn"
          onClick={() => {
            setIsAutoPlaying(!isAutoPlaying);
            if (!isAutoPlaying) goToSlide(internalIndex);
            else {
              clearTimeout(autoPlayTimerRef.current);
              if (progressRef.current) progressRef.current.style.width = '0%';
            }
          }}
        >
          {isAutoPlaying ? '⏸️' : '▶️'}
        </button>
      </div>
    </div>
  );
}
