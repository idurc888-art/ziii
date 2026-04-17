import { useEffect, useRef, useState } from 'react';
import './TopMoviesBanner.css';
import type { TMDBResult } from '../../services/tmdbService';

interface TopMoviesBannerProps {
  movies: TMDBResult[];
  autoPlayInterval?: number;
  onSelect?: (movie: TMDBResult) => void;
  onAddToList?: (movie: TMDBResult) => void;
}

export function TopMoviesBanner({ 
  movies, 
  autoPlayInterval = 5000,
  onSelect,
  onAddToList 
}: TopMoviesBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const autoPlayTimerRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const lastKeyPressRef = useRef<number>(0);
  
  // Navegação
  const goToSlide = (index: number, animated = true) => {
    const newIndex = (index + movies.length) % movies.length;
    setCurrentIndex(newIndex);
    
    if (trackRef.current) {
      const slideWidth = 320; // largura fixa dos slides
      const gap = 20;
      const position = -(newIndex * (slideWidth + gap));
      
      trackRef.current.style.transition = animated 
        ? 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)'
        : 'none';
      trackRef.current.style.transform = `translateX(${position}px)`;
    }
    
    // Reset auto-play
    if (isAutoPlaying) {
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
  };
  
  // Navegação por teclas (D-pad)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const now = Date.now();
      if (now - lastKeyPressRef.current < 300) return;
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
          if (onSelect && movies[currentIndex]) {
            onSelect(movies[currentIndex]);
          }
          break;
        case 'F1':
          if (onAddToList && movies[currentIndex]) {
            onAddToList(movies[currentIndex]);
          }
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, movies, goToSlide, onSelect, onAddToList]);
  
  // Auto-play inicial
  useEffect(() => {
    if (movies.length > 0 && isAutoPlaying) {
      goToSlide(0, false);
    }
    
    return () => {
      clearTimeout(autoPlayTimerRef.current);
    };
  }, [movies.length, isAutoPlaying]);
  
  if (movies.length === 0) {
    return <div className="top-movies-empty">Nenhum filme disponível</div>;
  }
  
  return (
    <div className="top-movies-container">
      <div className="top-movies-header">
        <h2 className="top-movies-title">Top Filmes</h2>
        <div className="top-movies-controls">
          <button
            className="top-movies-control-btn"
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
      
      <div className="top-movies-viewport">
        <div 
          ref={trackRef}
          className="top-movies-track"
          style={{ gap: '20px' }}
        >
          {movies.map((movie, index) => (
            <div
              key={movie.tmdbId}
              className={`top-movies-slide ${index === currentIndex ? 'active' : ''}`}
              data-index={index}
            >
              {/* Poster do filme */}
              <div 
                className="top-movies-poster"
                style={{
                  backgroundImage: `url(${movie.poster})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              />
              
              {/* Overlay gradiente */}
              <div className="top-movies-overlay" />
              
              {/* Informações do filme */}
              <div className="top-movies-info">
                <div className="top-movies-rating">
                  ★ {movie.rating.toFixed(1)}
                </div>
                <h3 className="top-movies-movie-title">{movie.title}</h3>
                <p className="top-movies-year">{movie.year}</p>
                <p className="top-movies-overview">{movie.overview.slice(0, 100)}...</p>
                
                <div className="top-movies-actions">
                  <button 
                    className="top-movies-btn top-movies-btn-primary"
                    onClick={() => onSelect?.(movie)}
                  >
                    ▶ Assistir
                  </button>
                  <button 
                    className="top-movies-btn top-movies-btn-secondary"
                    onClick={() => onAddToList?.(movie)}
                  >
                    + Lista
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="top-movies-progress-container">
        <div 
          ref={progressRef}
          className="top-movies-progress"
          style={{ width: '0%' }}
        />
      </div>
      
      {/* Dots de navegação */}
      <div className="top-movies-dots">
        {movies.map((_, index) => (
          <button
            key={index}
            className={`top-movies-dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => {
              setIsAutoPlaying(false);
              clearTimeout(autoPlayTimerRef.current);
              goToSlide(index);
            }}
            aria-label={`Ir para filme ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
