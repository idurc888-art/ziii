const API_KEY = 'b68afbadedebf0889f00a0cf577d3e5a'
const BASE = 'https://api.themoviedb.org/3'

async function getById(id, type) {
  const r = await fetch(`${BASE}/${type}/${id}?api_key=${API_KEY}&language=pt-BR`)
  return r.json()
}

async function search(name, type) {
  const ep = type === 'movie' ? '/search/movie' : '/search/tv'
  const r = await fetch(`${BASE}${ep}?api_key=${API_KEY}&query=${encodeURIComponent(name)}&language=pt-BR`)
  const d = await r.json()
  return d.results || []
}

// Busca os corretos
const fixes = await Promise.all([
  // 4 não encontrados — nomes corretos
  search('My Octopus Teacher', 'movie'),
  search('Vivo', 'movie'),
  search('Homecoming A Film by Beyonce', 'movie'),
  search('Salt Fat Acid Heat', 'tv'),
  // 6 suspeitos — buscar pelo ID correto ou nome certo
  getById(841, 'movie'),          // Power (2023 Netflix) — vamos buscar
  search('Os Sete de Chicago', 'movie'),
  search('O Culpado', 'movie'),   // dinamarquês 2021
  getById(458723, 'movie'),       // O Ritual (2017 Netflix)
  search('Wild Wild Country', 'tv'),
  search('Abaixo de Zero', 'movie'), // espanhol 2021
])

const [myOctopus, vivo, homecoming, saltFat, , seteChicago, culpado, ritual, wildWild, abaixoZero] = fixes

console.log('=== NÃO ENCONTRADOS — CORREÇÕES ===\n')

// My Octopus Teacher
const oct = myOctopus.find(r => r.release_date?.startsWith('2020'))
console.log(`"O que o Polvo me Ensinou" → id:${oct?.id} "${oct?.title}" (${oct?.release_date?.slice(0,4)})`)

// Vivo
const v = vivo.find(r => r.release_date?.startsWith('2021'))
console.log(`"Vivo" → id:${v?.id} "${v?.title}" (${v?.release_date?.slice(0,4)})`)

// Homecoming
const hc = homecoming[0]
console.log(`"Homecoming" → id:${hc?.id} "${hc?.title}" (${hc?.release_date?.slice(0,4)})`)

// Salt Fat Acid Heat (série)
const sf = saltFat[0]
console.log(`"Um Amor Mil Receitas" (era série) → id:${sf?.id} "${sf?.name}" (${sf?.first_air_date?.slice(0,4)}) [tv]`)

console.log('\n=== SUSPEITOS — CORREÇÕES ===\n')

// Power Netflix 2023
const power = await search('Power', 'movie')
const powerNetflix = power.find(r => r.release_date?.startsWith('2023') || r.release_date?.startsWith('2022'))
console.log(`"Power" (Netflix) → id:${powerNetflix?.id} "${powerNetflix?.title}" (${powerNetflix?.release_date?.slice(0,4)})`)

// Os Sete de Chicago
const s7 = seteChicago.find(r => r.release_date?.startsWith('2020'))
console.log(`"Os Sete de Chicago" → id:${s7?.id} "${s7?.title}" (${s7?.release_date?.slice(0,4)})`)

// O Culpado dinamarquês 2021
const cul = culpado.find(r => r.release_date?.startsWith('2021'))
console.log(`"O Culpado" (2021) → id:${cul?.id} "${cul?.title}" (${cul?.release_date?.slice(0,4)})`)

// O Ritual Netflix 2017
console.log(`"O Ritual" (Netflix 2017) → id:${ritual?.id} "${ritual?.title}" (${ritual?.release_date?.slice(0,4)})`)

// Wild Wild Country (série)
const ww = wildWild[0]
console.log(`"Wild Wild Country" (série) → id:${ww?.id} "${ww?.name}" (${ww?.first_air_date?.slice(0,4)}) [tv]`)

// Abaixo de Zero espanhol 2021
const az = abaixoZero.find(r => r.release_date?.startsWith('2021'))
console.log(`"Abaixo de Zero" (2021) → id:${az?.id} "${az?.title}" (${az?.release_date?.slice(0,4)})`)
