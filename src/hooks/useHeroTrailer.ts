import { useEffect, useRef, useState } from 'react';
import type { TMDBResult } from '../services/tmdbService';
import { fetchTrailerKey } from '../services/tmdbService';

interface UseHeroTrailerOptions {
  idleDelay?: number; // ms para iniciar busca do trailer
  fadeDuration?: number; // ms para fade do trailer
  isHeroVisible?: boolean; // se o hero está visível na tela
  focusZone?: string; // zona de foco atual
}

export function useHeroTrailer(
  currentItem: TMDBResult | null,
  options: UseHeroTrailerOptions = {}
) {
  const {
    idleDelay = 2500, // 2.5 segundos
    fadeDuration = 800, // 0.8 segundos para fade
    isHeroVisible = true,
    focusZone = 'hero'
  } = options;

  const [trailerKey, setTrailerKey] = useState<string>('');
  const [isTrailerLoading, setIsTrailerLoading] = useState<boolean>(false);
  const [isTrailerVisible, setIsTrailerVisible] = useState<boolean>(false);
  const [trailerError, setTrailerError] = useState<boolean>(false);

  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const fadeTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const lastTmdbIdRef = useRef<number>(0);

  // Limpar timers
  const clearTimers = () => {
    if (idleTimerRef.current !== undefined) {
      clearTimeout(idleTimerRef.current);
      idleTimerRef.current = undefined;
    }
    if (fadeTimerRef.current !== undefined) {
      clearTimeout(fadeTimerRef.current);
      fadeTimerRef.current = undefined;
    }
  };

  // Resetar trailer
  const resetTrailer = () => {
    clearTimers();
    setIsTrailerVisible(false);
    setIsTrailerLoading(false);
    setTrailerKey('');
    setTrailerError(false);
  };

  // Buscar trailer do TMDB
  const fetchTrailer = async (tmdbId: number, mediaType: 'movie' | 'tv') => {
    if (!tmdbId || lastTmdbIdRef.current === tmdbId) return;
    
    setIsTrailerLoading(true);
    setTrailerError(false);
    lastTmdbIdRef.current = tmdbId;

    try {
      const key = await fetchTrailerKey(tmdbId, mediaType);
      
      if (key && lastTmdbIdRef.current === tmdbId) {
        setTrailerKey(key);
        
        // Aguardar um pouco para o iframe carregar antes do fade
        fadeTimerRef.current = setTimeout(() => {
          if (lastTmdbIdRef.current === tmdbId) {
            setIsTrailerVisible(true);
          }
        }, 500);
      } else {
        setTrailerError(true);
      }
    } catch (error) {
      console.warn('[useHeroTrailer] Erro ao buscar trailer:', error);
      setTrailerError(true);
    } finally {
      setIsTrailerLoading(false);
    }
  };

  // Efeito principal: controlar idle timer e buscar trailer
  useEffect(() => {
    // Resetar sempre que o item mudar
    resetTrailer();

    // Condições para não buscar trailer:
    // 1. Não há item atual
    // 2. Hero não está visível
    // 3. Foco não está no hero/topbar
    // 4. Não tem tmdbId
    if (!currentItem || !isHeroVisible || !['hero', 'topbar'].includes(focusZone) || !currentItem.tmdbId) {
      return;
    }

    // Iniciar timer de idle
    idleTimerRef.current = setTimeout(() => {
      fetchTrailer(currentItem.tmdbId, currentItem.mediaType);
    }, idleDelay);

    return () => {
      clearTimers();
    };
  }, [currentItem, isHeroVisible, focusZone, idleDelay]);

  // Efeito para pausar/retomar baseado na visibilidade
  useEffect(() => {
    if (!isHeroVisible || !['hero', 'topbar'].includes(focusZone)) {
      resetTrailer();
    }
  }, [isHeroVisible, focusZone]);

  return {
    trailerKey,
    isTrailerLoading,
    isTrailerVisible,
    trailerError,
    hasTrailer: !!trailerKey,
    resetTrailer,
    
    // URL do iframe do YouTube
    trailerIframeUrl: trailerKey 
      ? `https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=1&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&loop=1&playlist=${trailerKey}`
      : '',
    
    // Estilos para fade
    trailerStyle: {
      opacity: isTrailerVisible ? 1 : 0,
      transition: `opacity ${fadeDuration}ms ease-in-out`,
      pointerEvents: 'none' as const,
    },
    
    backdropStyle: {
      opacity: isTrailerVisible ? 0 : 1,
      transition: `opacity ${fadeDuration}ms ease-in-out`,
    }
  };
}
