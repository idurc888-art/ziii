import type { TMDBResult } from '../services/tmdbService'

export type StreamQuality = '4K' | 'FHD' | 'HD' | 'SD' | 'UNKNOWN'

export const QUALITY_ORDER: StreamQuality[] = ['4K', 'FHD', 'HD', 'SD', 'UNKNOWN']

export const QUALITY_BADGE_COLOR: Record<StreamQuality, string> = {
  '4K':      '#f5c518',  // dourado
  'FHD':     '#00b4d8',  // azul ciano
  'HD':      '#4caf50',  // verde
  'SD':      '#9e9e9e',  // cinza
  'UNKNOWN': '#616161',
}

export interface Stream {
  url: string
  quality: StreamQuality
  label: string          // "4K", "FHD", "HD", "SD"
  isWorking?: boolean    // resultado do health check em background
  latencyMs?: number     // ms para responder no probe
  lastChecked?: number   // timestamp unix do último probe
}

export interface Channel {
  // Identidade lógica — o canal "real", sem sufixos de qualidade
  id: string             // slug normalizado ex: "premiere-1", "espn"
  name: string           // nome limpo ex: "Premiere 1", "ESPN"
  logo: string           // URL do logo (tvg-logo do melhor stream)
  group: string          // categoria normalizada (ex: "esportes")

  // Multi-stream — ordenados do melhor para o pior
  streams: Stream[]      // [4K, FHD, HD, SD, ...]

  // Stream selecionado no momento (padrão = streams[0] = melhor)
  activeStream: Stream

  // Quantas variantes foram encontradas na M3U
  variantCount: number

  // Metadados enriquecidos (opcional — adicionado pelo contentCatalog)
  tmdb?: TMDBResult
  score?: number         // score 0-100 calculado pelo contentCatalog
  mediaType?: 'movie' | 'tv'
}

// Canal raw como vem do parser (antes de deduplicar)
export interface RawChannel {
  name: string    // nome bruto da M3U ex: "|||BR||| ESPN HD"
  url: string
  logo: string
  group: string
}
