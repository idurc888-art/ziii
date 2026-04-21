// tmdbCatalog.ts - Tipos para catálogo canônico TMDB

export type ProviderId =
  | 'netflix'
  | 'prime'
  | 'disney'
  | 'hbomax'
  | 'appletv'
  | 'globoplay'
  | 'paramount'
  | 'starplus'
  | 'outro'

export type CanonicalGenre =
  | 'acao'
  | 'aventura'
  | 'animacao'
  | 'comedia'
  | 'crime'
  | 'documentario'
  | 'drama'
  | 'familia'
  | 'fantasia'
  | 'historia'
  | 'terror'
  | 'musica'
  | 'misterio'
  | 'romance'
  | 'ficcao'
  | 'guerra'
  | 'faroeste'
  | 'reality'
  | 'scifi_fantasia'
  | 'outro'

export interface CanonicalContent {
  tmdbId: number
  title: string
  originalTitle: string
  overview: string
  posterPath: string | null
  backdropPath: string | null
  year: number | null
  mediaType: 'movie' | 'tv'
  provider: ProviderId
  rank: number
  popularity: number
  voteAverage: number
  voteCount: number
  genres: CanonicalGenre[]
}
