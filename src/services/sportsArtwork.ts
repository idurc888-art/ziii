// sportsArtwork.ts
// Fallback inteligente para capas de esportes e campeonatos
// Substitui a base do TMDB por visuais otimizados esportivos

export interface Artwork {
  poster: string
  backdrop: string
}

const DEFAULT_SPORTS_BACKDROP = 'https://images.unsplash.com/photo-1508344928928-7165b67de128?q=80&w=1920&h=1080&fit=crop'
const DEFAULT_PREMIERE_BACKDROP = 'https://images.unsplash.com/photo-1518605368461-1e129623b123?q=80&w=1920&h=1080&fit=crop'
const DEFAULT_CHAMPIONS_BACKDROP = 'https://images.unsplash.com/photo-1551958670-410a5e5a25e2?q=80&w=1920&h=1080&fit=crop'
const DEFAULT_COMBATE_BACKDROP = 'https://images.unsplash.com/photo-1564862413123-0182c6dcf0b1?q=80&w=1920&h=1080&fit=crop'
const DEFAULT_BASKETBALL_BACKDROP = 'https://images.unsplash.com/photo-1504450758481-7338eba7524a?q=80&w=1920&h=1080&fit=crop'

export function getSportsArtwork(channelName: string): Artwork | null {
  const name = channelName.toLowerCase()

  if (/champions|uefa/i.test(name)) {
    return {
      poster: 'https://images.unsplash.com/photo-1518091043644-c1d44570a2c1?q=80&w=500&h=750&fit=crop',
      backdrop: DEFAULT_CHAMPIONS_BACKDROP
    }
  }

  if (/premiere/i.test(name)) {
    return {
      poster: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=500&h=750&fit=crop',
      backdrop: DEFAULT_PREMIERE_BACKDROP
    }
  }

  if (/espn/i.test(name)) {
    return {
      poster: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=500&h=750&fit=crop',
      backdrop: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=1920&h=1080&fit=crop'
    }
  }

  if (/sportv/i.test(name)) {
    return {
      poster: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=500&h=750&fit=crop', // torcida
      backdrop: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=1920&h=1080&fit=crop'
    }
  }

  if (/ufc|combate/i.test(name)) {
    return {
      poster: 'https://images.unsplash.com/photo-1599569764510-4c330c6a85f4?q=80&w=500&h=750&fit=crop',
      backdrop: DEFAULT_COMBATE_BACKDROP
    }
  }

  if (/nba/i.test(name)) {
    return {
      poster: 'https://images.unsplash.com/photo-1519861531473-9200262188bf?q=80&w=500&h=750&fit=crop',
      backdrop: DEFAULT_BASKETBALL_BACKDROP
    }
  }

  if (/brasileir|libertadores|sulamericana|copa|futebol|sports/i.test(name)) {
    return {
      poster: 'https://images.unsplash.com/photo-1536551829285-d3ec41581e18?q=80&w=500&h=750&fit=crop',
      backdrop: DEFAULT_SPORTS_BACKDROP
    }
  }

  return null
}
