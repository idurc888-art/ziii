// Script: reduz catálogo para 400 títulos mais relevantes
import fs from 'fs'

const content = fs.readFileSync('./src/data/catalog.ts', 'utf8')
const match = content.match(/export const CANONICAL_CATALOG.*?= (\[[\s\S]*\])/m)
const catalog = JSON.parse(match[1])

console.log(`📚 Total antes: ${catalog.length} títulos`)

// Priorizar por streaming e rating
const byStreaming = {
  netflix: catalog.filter(i => i.streaming === 'netflix').sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 60),
  amazon: catalog.filter(i => i.streaming === 'amazon').sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 60),
  hbo: catalog.filter(i => i.streaming === 'hbo').sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 60),
  disney: catalog.filter(i => i.streaming === 'disney').sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 80),
  paramount: catalog.filter(i => i.streaming === 'paramount').sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 50),
  apple: catalog.filter(i => i.streaming === 'apple').sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 50),
  globoplay: catalog.filter(i => i.streaming === 'globoplay').sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 40),
}

const reduced = [
  ...byStreaming.netflix,
  ...byStreaming.amazon,
  ...byStreaming.hbo,
  ...byStreaming.disney,
  ...byStreaming.paramount,
  ...byStreaming.apple,
  ...byStreaming.globoplay,
]

console.log(`✅ Total depois: ${reduced.length} títulos`)
console.log(`🗑️  Removidos: ${catalog.length - reduced.length} títulos`)

Object.entries(byStreaming).forEach(([key, items]) => {
  console.log(`   ${key}: ${items.length} títulos`)
})

// Salvar catalog.ts reduzido
const newContent = content.replace(
  /export const CANONICAL_CATALOG.*?= \[[\s\S]*\]/m,
  `export const CANONICAL_CATALOG: CanonicalTitle[] = ${JSON.stringify(reduced, null, 2)}`
)

fs.writeFileSync('./src/data/catalog.ts', newContent)
console.log('\n✅ Catalog.ts otimizado salvo!')
