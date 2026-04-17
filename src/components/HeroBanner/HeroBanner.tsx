import { useEffect, useRef, useState, useCallback } from 'react';
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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(autoPlayInterval > 0);

  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const autoPlayTimerRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const lastKeyPressRef = useRef<number>(0);

  // Hook nativo AVPlay para Background Video (double-buffer)
  const currentSlideValid = slides[currentIndex];
  const nextSlideValid    = slides[(currentIndex + 1) % Math.max(slides.length, 1)];
  const { videoStyle, backdropStyle, activePlayerId } = useStreamPreview(
    currentSlideValid?.channel || null,
    nextSlideValid?.channel || null,
    focused,
    {
      idleDelay: 800,
      previewDuration: 18000,
      seekToMs: 270000,
      fadeDuration: 350,
    }
  );

  // Parallax no background
  const updateParallax = useCallback(() => {
    if (!trackRef.current) return;
    const track = trackRef.current;
    const screenCenter = window.innerWidth / 2;
    slides.forEach((_, index) => {
      const slide = track.children[index] as HTMLElement;
      if (!slide) return;
      const slideRect = slide.getBoundingClientRect();
      const slideCenter = slideRect.left + slideRect.width / 2;
      const offset = (slideCenter - screenCenter) / window.innerWidth;
      const bg = slide.querySelector('.hero-bg') as HTMLElement;
      if (bg) bg.style.transform = `translateX(${offset * 30}px)`;
    });
  }, [slides]);

  // Handle slide changing
  const goToSlide = useCallback((newIndex: number) => {
    if (slides.length <= 1) return;
    let nextIdx = newIndex;
    if (nextIdx >= slides.length) nextIdx = 0;
    if (nextIdx < 0) nextIdx = slides.length - 1;
    setCurrentIndex(nextIdx);
  }, [slides.length]);

  // Auto-play interval handling
  useEffect(() => {
    if (!isAutoPlaying || autoPlayInterval <= 0 || slides.length <= 1) {
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
      goToSlide(currentIndex + 1);
    }, autoPlayInterval);

    return () => clearTimeout(autoPlayTimerRef.current);
  }, [currentIndex, isAutoPlaying, autoPlayInterval, goToSlide, slides.length]);

  // Initial layout and Parallax
  useEffect(() => {
    setIsAutoPlaying(autoPlayInterval > 0);
  }, [autoPlayInterval]);

  useEffect(() => {
    updateParallax();
  }, [currentIndex, updateParallax]);

  // D-pad
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const now = Date.now();
      if (now - lastKeyPressRef.current < 400) return;
      
      // Animando do snap?
      // if (isTransitioning) return;
      
      // A TV envia keys sempre para window. O controle de focus global fica no HomeScreen.
      // O HeroBanner só reage se ele tiver focused == true passado via props
      if (!focused) return;

      switch (e.key) {
        case 'ArrowLeft':  
          lastKeyPressRef.current = now;
          setIsAutoPlaying(false);
          goToSlide(currentIndex - 1); 
          break;
        case 'ArrowRight': 
          lastKeyPressRef.current = now;
          setIsAutoPlaying(false);
          goToSlide(currentIndex + 1); 
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
  }, [currentIndex, slides, goToSlide, onSelect, onAddToList, focused]);

  // Resize
  useEffect(() => {
    // Layout update not physically needed for absolute flash
  }, []);

  if (slides.length === 0) {
    return <div className="hero-empty">Nenhum conteúdo disponível</div>;
  }

  return (
    <div className={`hero-viewport${focused ? ' hero-focused' : ''}`}>
      <object
        id="av-hero-player-a"
        type="application/avplayer"
        style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%',
          zIndex: activePlayerId === 'av-hero-player-a' ? 0 : -1, pointerEvents: 'none',
          ...(activePlayerId === 'av-hero-player-a' ? videoStyle : { opacity: 0 })
        }}
      />
      <object
        id="av-hero-player-b"
        type="application/avplayer"
        style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%',
          zIndex: activePlayerId === 'av-hero-player-b' ? 0 : -1, pointerEvents: 'none',
          ...(activePlayerId === 'av-hero-player-b' ? videoStyle : { opacity: 0 })
        }}
      />
      <div
        ref={trackRef}
        className="hero-track-absolute"
      >
        {slides.map((slide, index) => {
          const isActive = index === currentIndex;

          return (
            <div
              key={`${slide.id}-${index}`}
              className={`hero-slide-absolute ${isActive ? 'active' : ''}`}
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
              goToSlide(dotIndex); 
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
            if (!isAutoPlaying) goToSlide(currentIndex);
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
