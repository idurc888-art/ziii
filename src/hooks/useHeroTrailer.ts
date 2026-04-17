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
  allItems: TMDBResult[],
  currentItem: TMDBResult | null,
  options: UseHeroTrailerOptions = {}
) {
  const {
    idleDelay = 500, // 500ms Netflix-style
    fadeDuration = 300, // 300ms fade
    isHeroVisible = true,
    focusZone = 'hero'
  } = options;

  const [trailerKeys, setTrailerKeys] = useState<Record<number, string>>({});
  const [trailerKey, setTrailerKey] = useState<string>('');
  const [isTrailerLoading, setIsTrailerLoading] = useState<boolean>(false);
  const [isTrailerVisible, setIsTrailerVisible] = useState<boolean>(false);
  const [trailerError, setTrailerError] = useState<boolean>(false);

  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const fadeTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const prefetchedRef = useRef<Set<number>>(new Set());

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

  // Resetar trailer state
  const resetTrailer = () => {
    clearTimers();
    setIsTrailerVisible(false);
    setIsTrailerLoading(false);
    setTrailerKey('');
    setTrailerError(false);
  };

  // 1. Prefetch all trailers as requested
  useEffect(() => {
    let mounted = true;
    const prefetchTrailers = async (items: TMDBResult[]) => {
      const fetchPromises = items.map(async (slide) => {
        if (!slide.tmdbId || prefetchedRef.current.has(slide.tmdbId)) return null;
        prefetchedRef.current.add(slide.tmdbId);

        try {
          const key = await fetchTrailerKey(slide.tmdbId, slide.mediaType);
          if (key) return { id: slide.tmdbId, key };
        } catch (e) {
          console.warn('[useHeroTrailer] Erro prefetch:', e);
        }
        return null;
      });

      const results = await Promise.all(fetchPromises);
      if (!mounted) return;

      const newKeys: Record<number, string> = {};
      let hasNew = false;
      results.forEach(res => {
        if (res) {
          newKeys[res.id] = res.key;
          hasNew = true;
        }
      });

      if (hasNew) {
        setTrailerKeys(prev => ({ ...prev, ...newKeys }));
      }
    };

    if (allItems.length > 0) {
      prefetchTrailers(allItems);
    }
    return () => { mounted = false; };
  }, [allItems]);

  // Efeito principal: controlar idle timer
  useEffect(() => {
    resetTrailer();

    if (!currentItem || !isHeroVisible || !['hero', 'topbar'].includes(focusZone) || !currentItem.tmdbId) {
      return;
    }

    const tmdbId = currentItem.tmdbId;

    idleTimerRef.current = setTimeout(() => {
      // 3. Quando o slide muda, a key já está no Map (se prefetch teve sucesso)
      const cachedKey = trailerKeys[tmdbId];
      if (cachedKey) {
        setTrailerKey(cachedKey);
        fadeTimerRef.current = setTimeout(() => setIsTrailerVisible(true), 100);
      } else {
        // Fallback caso prefetch não tenha terminado
        setTrailerError(true);
      }
    }, idleDelay);

    return () => clearTimers();
  }, [currentItem, isHeroVisible, focusZone, idleDelay, trailerKeys]);

  // Efeito para pausar baseado na visibilidade
  useEffect(() => {
    if (!isHeroVisible || !['hero', 'topbar'].includes(focusZone)) {
      resetTrailer();
    }
  }, [isHeroVisible, focusZone]);

  const getIframeUrl = (key: string) => key
    ? `https://www.youtube.com/embed/${key}?autoplay=1&mute=1&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&loop=1&playlist=${key}&origin=https://localhost`
    : '';

  return {
    trailerKeysMap: trailerKeys,
    trailerKey,
    isTrailerLoading,
    isTrailerVisible,
    trailerError,
    hasTrailer: !!trailerKey,
    resetTrailer,
    
    // URL pro active (código legado caso use)
    trailerIframeUrl: getIframeUrl(trailerKey),
    
    // Função helper para múltiplos iframes
    getIframeUrl,
    
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
