// Script: remove duplicatas do catalog.ts
import fs from 'fs'

const content = fs.readFileSync('./src/data/catalog.ts', 'utf8')
const match = content.match(/export const CANONICAL_CATALOG.*?= (\[[\s\S]*\])/m)
const catalog = JSON.parse(match[1])

console.log(`📚 Total antes: ${catalog.length} títulos`)

// Remove duplicatas mantendo o primeiro (que tem mais dados TMDB)
const seen = new Set()
const unique = catalog.filter(item => {
  const key = `${item.streaming}-${item.title.toLowerCase().trim()}`
  if (seen.has(key)) {
    console.log(`❌ Removendo duplicata: ${item.title} [${item.streaming}]`)
    return false
  }
  seen.add(key)
  return true
})

console.log(`\n✅ Total depois: ${unique.length} títulos`)
console.log(`🗑️  Removidos: ${catalog.length - unique.length} duplicatas`)

// Salvar catalog.ts limpo
const newContent = content.replace(
  /export const CANONICAL_CATALOG.*?= \[[\s\S]*\]/m,
  `export const CANONICAL_CATALOG: CanonicalTitle[] = ${JSON.stringify(unique, null, 2)}`
)

fs.writeFileSync('./src/data/catalog.ts', newContent)
console.log('\n✅ Catalog.ts limpo salvo!')
