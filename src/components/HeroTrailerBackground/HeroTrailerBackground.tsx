import { useEffect, useRef } from 'react';
import './HeroTrailerBackground.css';

interface HeroTrailerBackgroundProps {
  trailerIframeUrl: string;
  backdropUrl: string;
  isTrailerVisible: boolean;
  isTrailerLoading?: boolean;
  fadeDuration?: number;
}

export function HeroTrailerBackground({
  trailerIframeUrl,
  backdropUrl,
  isTrailerVisible,
  isTrailerLoading = false,
  fadeDuration = 800
}: HeroTrailerBackgroundProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Pausar/play iframe baseado na visibilidade
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe || !trailerIframeUrl) return;

    // Tizen pode ter problemas com iframes, então usamos abordagem conservadora
    try {
      // Tentar pausar quando não visível
      if (!isTrailerVisible) {
        // No Tizen, podemos apenas ocultar o iframe
        // Pausar programaticamente pode não funcionar bem
        iframe.style.display = 'none';
      } else {
        iframe.style.display = 'block';
      }
    } catch (error) {
      console.warn('[HeroTrailerBackground] Erro ao controlar iframe:', error);
    }
  }, [isTrailerVisible, trailerIframeUrl]);

  // Limpar iframe quando URL mudar
  useEffect(() => {
    return () => {
      // Tentar limpar iframe anterior
      if (iframeRef.current) {
        try {
          iframeRef.current.src = '';
        } catch (error) {
          // Ignorar erros de CORS/segurança
        }
      }
    };
  }, [trailerIframeUrl]);

  return (
    <div className="hero-trailer-container">
      {/* Backdrop estático (fallback principal) */}
      <div 
        className="hero-backdrop"
        style={{
          backgroundImage: `url(${backdropUrl})`,
          opacity: isTrailerVisible ? 0 : 1,
          transition: `opacity ${fadeDuration}ms ease-in-out`
        }}
      />
      
      {/* Gradiente overlay (mantém legibilidade) */}
      <div className="hero-trailer-overlay" />
      
      {/* Iframe do YouTube (só mostra quando tem trailer) */}
      {trailerIframeUrl && (
        <div 
          className="hero-trailer-iframe-container"
          style={{
            opacity: isTrailerVisible ? 1 : 0,
            transition: `opacity ${fadeDuration}ms ease-in-out`
          }}
        >
          <iframe
            ref={iframeRef}
            className="hero-trailer-iframe"
            src={trailerIframeUrl}
            title="Trailer"
            allow="autoplay; encrypted-media"
            allowFullScreen={false}
            frameBorder="0"
            loading="lazy"
            style={{
              display: isTrailerVisible ? 'block' : 'none'
            }}
          />
          
          {/* Loading indicator */}
          {isTrailerLoading && (
            <div className="hero-trailer-loading">
              <div className="hero-trailer-spinner" />
              <span>Carregando trailer...</span>
            </div>
          )}
        </div>
      )}
      
      {/* Fallback para Tizen (se iframe não funcionar bem) */}
      <div className="hero-trailer-fallback">
        {/* Podemos adicionar uma imagem de fallback aqui se necessário */}
      </div>
    </div>
  );
}
