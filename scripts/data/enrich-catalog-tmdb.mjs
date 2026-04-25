// enrich-catalog-tmdb.mjs
import fs from 'fs'

const TMDB_KEY = 'b68afbadedebf0889f00a0cf577d3e5a' 
const DELAY = 30 // ms entre requests

async function searchTMDB(title, type) {
  const url = `https://api.themoviedb.org/3/search/${type}?api_key=${TMDB_KEY}&query=${encodeURIComponent(title)}&language=pt-BR`
  const res = await fetch(url)
  const data = await res.json()
  return data.results?.[0] || null
}

async function enrichCatalog() {
  // 1. Ler catalog.ts atual
  const content = fs.readFileSync('./src/data/catalog.ts', 'utf8')
  const match = content.match(/export const CANONICAL_CATALOG.*?= (\[[\s\S]*\])/m)
  const catalog = JSON.parse(match[1])
  
  console.log(`📚 ${catalog.length} títulos para enriquecer`)
  
  // 2. Enriquecer cada título
  for (let i = 0; i < catalog.length; i++) {
    const item = catalog[i]
    
    // Pular se já tem tmdbId
    if (item.tmdbId) {
      console.log(`⏭️  [${i+1}/${catalog.length}] ${item.title} - já tem TMDB`)
      continue
    }
    
    // Buscar no TMDB
    const searchTitle = item.altTitles?.[0] || item.title
    const tmdbType = item.type === 'series' ? 'tv' : 'movie'
    
    try {
      const result = await searchTMDB(searchTitle, tmdbType)
      
      if (result) {
        item.tmdbId = result.id
        item.year = typeof result.release_date === 'string' ? result.release_date.slice(0, 4) : 
                    typeof result.first_air_date === 'string' ? result.first_air_date.slice(0, 4) : ''
        item.rating = result.vote_average || 0
        item.overview = result.overview || ''
        item.poster = result.poster_path ? `https://image.tmdb.org/t/p/w342${result.poster_path}` : ''
        item.backdrop = result.backdrop_path ? `https://image.tmdb.org/t/p/w780${result.backdrop_path}` : ''
        
        console.log(`✅ [${i+1}/${catalog.length}] ${item.title} → TMDB ${result.id}`)
      } else {
        console.log(`❌ [${i+1}/${catalog.length}] ${item.title} → NÃO ENCONTRADO`)
      }
      
      await new Promise(r => setTimeout(r, DELAY))
    } catch (err) {
      console.error(`⚠️  [${i+1}/${catalog.length}] ${item.title} → ERRO:`, err.message)
    }
  }
  
  // 3. Salvar catalog.ts enriquecido
  const newContent = content.replace(
    /export const CANONICAL_CATALOG.*?= \[[\s\S]*\]/m,
    `export const CANONICAL_CATALOG: CanonicalTitle[] = ${JSON.stringify(catalog, null, 2)}`
  )
  
  fs.writeFileSync('./src/data/catalog.ts', newContent)
  console.log(`\n✅ Catalog.ts enriquecido salvo!`)
}

enrichCatalog()
