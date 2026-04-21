// Script para gerar catalog.ts a partir dos títulos mapeados
// Uso: node generate-catalog.mjs

import fs from 'fs'

// Dados dos filmes (do CATALOGO_TMDB.md)
const movies = {
  netflix: [
    { title: 'Resgate', tmdbId: 616819, altTitles: ['extraction', 'resgate 1'] },
    { title: 'Resgate 2', tmdbId: 697843, altTitles: ['extraction 2'] },
    { title: 'Agente Oculto', tmdbId: 725201, altTitles: ['the gray man'] },
    // ... adicionar os outros 347 filmes
  ],
  amazon: [],
  hbo: [],
  disney: [],
  paramount: [],
  apple: []
}

// Dados das séries (da lista que você passou)
const series = {
  netflix: [
    { title: 'O Agente Noturno', altTitles: ['the night agent'] },
    { title: 'Cobra Kai', altTitles: [] },
    { title: 'Irmãos Sun', altTitles: ['the brothers sun'] },
    // ... adicionar as outras 397 séries
  ],
  amazon: [],
  hbo: [],
  disney: [],
  paramount: [],
  apple: []
}

function slugify(text) {
  return text.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function generateMatchHints(title) {
  // Extrai palavras-chave importantes (>3 letras)
  return title.toLowerCase()
    .split(/\s+/)
    .filter(w => w.length > 3)
    .slice(0, 3) // máximo 3 hints
}

function generateCatalog() {
  const catalog = []
  
  // Processa filmes
  for (const [streaming, items] of Object.entries(movies)) {
    for (const item of items) {
      catalog.push({
        id: `${streaming}-${slugify(item.title)}`,
        slug: slugify(item.title),
        title: item.title,
        altTitles: item.altTitles || [],
        type: 'movie',
        streaming,
        matchHints: generateMatchHints(item.title)
      })
    }
  }
  
  // Processa séries
  for (const [streaming, items] of Object.entries(series)) {
    for (const item of items) {
      catalog.push({
        id: `${streaming}-${slugify(item.title)}`,
        slug: slugify(item.title),
        title: item.title,
        altTitles: item.altTitles || [],
        type: 'series',
        streaming,
        matchHints: generateMatchHints(item.title)
      })
    }
  }
  
  return catalog
}

const catalog = generateCatalog()

const output = `export type Streaming = 'netflix' | 'amazon' | 'hbo' | 'disney' | 'paramount' | 'apple'

export interface CanonicalTitle {
  id: string
  slug: string
  title: string
  altTitles: string[]
  type: 'movie' | 'series'
  streaming: Streaming
  matchHints: string[]
}

export const CANONICAL_CATALOG: CanonicalTitle[] = ${JSON.stringify(catalog, null, 2)}
`

fs.writeFileSync('src/data/catalog.ts', output)
console.log(`✅ Catálogo gerado com ${catalog.length} títulos`)
