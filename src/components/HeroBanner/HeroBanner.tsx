import { useEffect, useRef, useState, useCallback } from 'react';
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
}

interface HeroBannerProps {
  slides: HeroSlide[];
  autoPlayInterval?: number;
  onSelect?: (slide: HeroSlide) => void;
  onAddToList?: (slide: HeroSlide) => void;
}

export function HeroBanner({ 
  slides, 
  autoPlayInterval = 7000,
  onSelect,
  onAddToList 
}: HeroBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(autoPlayInterval > 0);
  
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const autoPlayTimerRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const lastKeyPressRef = useRef<number>(0);
  
  // Efeito de parallax para backgrounds
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
      if (bg) {
        bg.style.transform = `translateX(${offset * 30}px)`;
      }
    });
  }, [slides]);
  
  // Navegação D-pad
  const goToSlide = useCallback((index: number, animated = true) => {
    const newIndex = (index + slides.length) % slides.length;
    setCurrentIndex(newIndex);
    
    if (trackRef.current) {
      const slideWidth = window.innerWidth - 120; // 60px peek de cada lado
      const gap = 16;
      const position = -(newIndex * (slideWidth + gap));
      
      trackRef.current.style.transition = animated 
        ? 'transform 0.62s cubic-bezier(0.22, 1, 0.36, 1)'
        : 'none';
      trackRef.current.style.transform = `translateX(${position}px)`;
    }
    
    // Reset auto-play (só quando autoPlayInterval > 0)
    if (isAutoPlaying && autoPlayInterval > 0) {
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
        goToSlide(newIndex + 1);
      }, autoPlayInterval);
    }
    
    updateParallax();
  }, [slides.length, isAutoPlaying, autoPlayInterval, updateParallax]);
  
  // Navegação por teclas (D-pad)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const now = Date.now();
      if (now - lastKeyPressRef.current < 300) return; // Debounce
      lastKeyPressRef.current = now;
      
      setIsAutoPlaying(false);
      clearTimeout(autoPlayTimerRef.current);
      
      switch (e.key) {
        case 'ArrowLeft':
          goToSlide(currentIndex - 1);
          break;
        case 'ArrowRight':
          goToSlide(currentIndex + 1);
          break;
        case 'Enter':
          if (onSelect && slides[currentIndex]) {
            onSelect(slides[currentIndex]);
          }
          break;
        case 'F1':
          if (onAddToList && slides[currentIndex]) {
            onAddToList(slides[currentIndex]);
          }
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, slides, goToSlide, onSelect, onAddToList]);
  
  // Auto-play inicial
  useEffect(() => {
    if (slides.length > 0 && isAutoPlaying) {
      goToSlide(0, false);
    }
    
    return () => {
      clearTimeout(autoPlayTimerRef.current);
    };
  }, [slides.length, isAutoPlaying, goToSlide]);
  
  // Atualizar parallax no resize
  useEffect(() => {
    const handleResize = () => {
      goToSlide(currentIndex, false);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [currentIndex, goToSlide]);
  
  // Dots de navegação
  const renderDots = () => {
    return slides.map((_, index) => (
      <button
        key={index}
        className={`hero-dot ${index === currentIndex ? 'active' : ''}`}
        onClick={() => {
          setIsAutoPlaying(false);
          clearTimeout(autoPlayTimerRef.current);
          goToSlide(index);
        }}
        aria-label={`Ir para slide ${index + 1}`}
      />
    ));
  };
  
  if (slides.length === 0) {
    return <div className="hero-empty">Nenhum conteúdo disponível</div>;
  }
  
  return (
    <div className="hero-viewport">
      <div 
        ref={trackRef}
        className="hero-track"
        style={{ 
          gap: '16px',
          padding: '0 60px'
        }}
      >
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`hero-slide ${index === currentIndex ? 'active' : ''}`}
            data-index={index}
          >
            {/* Background com parallax */}
            <div 
              className="hero-bg"
              style={{
                backgroundImage: `url(${slide.backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            />
            
            {/* Overlay gradiente (substituto para backdrop-filter) */}
            <div className="hero-overlay" />
            
            {/* Conteúdo do slide */}
            <div className="hero-content">
              {slide.badge && (
                <span className="hero-badge">{slide.badge}</span>
              )}
              
              <h1 className="hero-title">{slide.title}</h1>
              
              {slide.subtitle && (
                <h2 className="hero-subtitle">{slide.subtitle}</h2>
              )}
              
              <p className="hero-description">{slide.description}</p>
              
              <div className="hero-actions">
                <button 
                  className="hero-btn hero-btn-primary"
                  onClick={() => onSelect?.(slide)}
                >
                  ▶ Assistir
                </button>
                <button 
                  className="hero-btn hero-btn-secondary"
                  onClick={() => onAddToList?.(slide)}
                >
                  + Minha Lista
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Progress bar */}
      <div className="hero-progress-container">
        <div 
          ref={progressRef}
          className="hero-progress"
          style={{ width: '0%' }}
        />
      </div>
      
      {/* Dots de navegação */}
      <div className="hero-dots">
        {renderDots()}
      </div>
      
      {/* Controles de auto-play */}
      <div className="hero-controls">
        <button
          className="hero-control-btn"
          onClick={() => {
            setIsAutoPlaying(!isAutoPlaying);
            if (!isAutoPlaying) {
              goToSlide(currentIndex);
            } else {
              clearTimeout(autoPlayTimerRef.current);
              if (progressRef.current) {
                progressRef.current.style.width = '0%';
              }
            }
          }}
        >
          {isAutoPlaying ? '⏸️' : '▶️'}
        </button>
      </div>
    </div>
  );
}
