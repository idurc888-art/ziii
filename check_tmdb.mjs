const API_KEY = 'b68afbadedebf0889f00a0cf577d3e5a'
const BASE = 'https://api.themoviedb.org/3'

const titles = [
  // AÇÃO
  { name: 'Resgate', cat: 'Ação' },
  { name: 'Resgate 2', cat: 'Ação' },
  { name: 'Agente Oculto', cat: 'Ação' },
  { name: 'Alerta Vermelho', cat: 'Ação' },
  { name: 'A Mãe', cat: 'Ação' },
  { name: 'Esquadrão 6', cat: 'Ação' },
  { name: 'The Old Guard', cat: 'Ação' },
  { name: 'Kate', cat: 'Ação' },
  { name: 'Power', cat: 'Ação' },
  { name: 'Beckett', cat: 'Ação' },
  { name: 'Polar', cat: 'Ação' },
  // AVENTURA
  { name: 'Enola Holmes', cat: 'Aventura' },
  { name: 'Enola Holmes 2', cat: 'Aventura' },
  { name: 'O Projeto Adam', cat: 'Aventura' },
  { name: 'Donzela', cat: 'Aventura' },
  { name: 'Okja', cat: 'Aventura' },
  { name: 'Mowgli Entre Dois Mundos', cat: 'Aventura' },
  { name: 'A Fera do Mar', cat: 'Aventura' },
  { name: 'Crônicas de Natal', cat: 'Aventura' },
  { name: 'O Despertar das Tartarugas Ninja', cat: 'Aventura' },
  { name: 'A Caminho da Lua', cat: 'Aventura' },
  // COMÉDIA
  { name: 'Mistério no Mediterrâneo', cat: 'Comédia' },
  { name: 'Não Olhe Para Cima', cat: 'Comédia' },
  { name: 'Glass Onion', cat: 'Comédia' },
  { name: 'Cabras da Peste', cat: 'Comédia' },
  { name: 'Meu Nome é Dolemite', cat: 'Comédia' },
  { name: 'A Gente se Vê Ontem', cat: 'Comédia' },
  { name: 'Troco em Dobro', cat: 'Comédia' },
  { name: 'Eurovision A Saga de Sigrit e Lars', cat: 'Comédia' },
  // DRAMA
  { name: 'A Sociedade da Neve', cat: 'Drama' },
  { name: 'História de um Casamento', cat: 'Drama' },
  { name: 'O Irlandês', cat: 'Drama' },
  { name: 'Roma', cat: 'Drama' },
  { name: 'O Menino que Descobriu o Vento', cat: 'Drama' },
  { name: 'Os Sete de Chicago', cat: 'Drama' },
  { name: 'Nada de Novo no Front', cat: 'Drama' },
  { name: 'A Voz Suprema do Blues', cat: 'Drama' },
  { name: 'Dois Papas', cat: 'Drama' },
  { name: 'Mank', cat: 'Drama' },
  // FICÇÃO CIENTÍFICA
  { name: 'Rebel Moon', cat: 'Ficção Científica' },
  { name: 'Aniquilação', cat: 'Ficção Científica' },
  { name: 'O Poço', cat: 'Ficção Científica' },
  { name: 'Bird Box', cat: 'Ficção Científica' },
  { name: 'O Céu da Meia-Noite', cat: 'Ficção Científica' },
  { name: 'Oxigênio', cat: 'Ficção Científica' },
  { name: 'Stowaway', cat: 'Ficção Científica' },
  { name: 'Sombra Lunar', cat: 'Ficção Científica' },
  { name: 'Beyond Skyline', cat: 'Ficção Científica' },
  // FANTASIA
  { name: 'A Escola do Bem e do Mal', cat: 'Fantasia' },
  { name: 'Troll', cat: 'Fantasia' },
  { name: 'Terra dos Sonhos', cat: 'Fantasia' },
  { name: 'Bright', cat: 'Fantasia' },
  { name: 'O Caçador de Trolls', cat: 'Fantasia' },
  { name: 'Pinóquio Guillermo del Toro', cat: 'Fantasia' },
  // TERROR
  { name: 'Rua do Medo Parte 1', cat: 'Terror' },
  { name: 'O Ritual', cat: 'Terror' },
  { name: 'Apóstolo', cat: 'Terror' },
  { name: 'Eli', cat: 'Terror' },
  { name: 'Wounds', cat: 'Terror' },
  { name: 'Ninguém Sai Vivo', cat: 'Terror' },
  // SUSPENSE
  { name: 'O Mundo Depois de Nós', cat: 'Suspense' },
  { name: 'Fuja', cat: 'Suspense' },
  { name: 'O Culpado', cat: 'Suspense' },
  { name: 'A Mulher na Janela', cat: 'Suspense' },
  { name: 'Fratura', cat: 'Suspense' },
  { name: 'Jaula', cat: 'Suspense' },
  { name: 'I Care a Lot', cat: 'Suspense' },
  { name: 'Abaixo de Zero', cat: 'Suspense' },
  { name: 'Calibre', cat: 'Suspense' },
  // ROMANCE
  { name: 'Para Todos os Garotos que Já Amei', cat: 'Romance' },
  { name: 'Continência ao Amor', cat: 'Romance' },
  { name: 'Através da Minha Janela', cat: 'Romance' },
  { name: 'Ricos de Amor', cat: 'Romance' },
  { name: 'Amor à Primeira Vista', cat: 'Romance' },
  { name: 'Um Amor Mil Receitas', cat: 'Romance' },
  { name: 'Alguém Especial', cat: 'Romance' },
  { name: 'Combinação Perfeita', cat: 'Romance' },
  { name: 'Guia de Viagem para o Amor', cat: 'Romance' },
  // DOCUMENTÁRIO
  { name: 'O Golpista do Tinder', cat: 'Documentário' },
  { name: 'O Dilema das Redes', cat: 'Documentário' },
  { name: 'Professor Polvo', cat: 'Documentário' },
  { name: 'A Noite que Mudou o Pop', cat: 'Documentário' },
  { name: 'Ícaro', cat: 'Documentário' },
  { name: 'Wild Wild Country', cat: 'Documentário' },
  { name: 'Crip Camp', cat: 'Documentário' },
  { name: 'O que o Polvo me Ensinou', cat: 'Documentário' },
  // ANIMAÇÃO
  { name: 'Klaus', cat: 'Animação' },
  { name: 'A Família Mitchell e a Revolta das Máquinas', cat: 'Animação' },
  { name: 'Nimona', cat: 'Animação' },
  { name: 'Leo', cat: 'Animação' },
  { name: 'Arlo o Menino Jacaré', cat: 'Animação' },
  { name: 'Wendell e Wild', cat: 'Animação' },
  { name: 'Entergalactic', cat: 'Animação' },
  // INFANTIL
  { name: 'Matilda O Musical', cat: 'Infantil' },
  { name: 'Pequenos Grandes Heróis', cat: 'Infantil' },
  { name: 'Dia do Sim', cat: 'Infantil' },
  { name: 'Pequenos Espiões Apocalipse', cat: 'Infantil' },
  { name: 'A Elefanta do Mágico', cat: 'Infantil' },
  // MISTÉRIO
  { name: 'O Pálido Olho Azul', cat: 'Mistério' },
  { name: 'O Enfermeiro da Noite', cat: 'Mistério' },
  { name: 'Luther O Cair da Noite', cat: 'Mistério' },
  { name: 'Origens Secretas', cat: 'Mistério' },
  { name: 'Lost Girls', cat: 'Mistério' },
  { name: 'Infiesto', cat: 'Mistério' },
  // MUSICAL
  { name: 'Tick Tick Boom', cat: 'Musical' },
  { name: 'Vivo Um Amigo com Música', cat: 'Musical' },
  { name: 'Beats', cat: 'Musical' },
  { name: 'Wham', cat: 'Musical' },
  { name: 'Homecoming Um Filme de Beyoncé', cat: 'Musical' },
]

async function search(name, type) {
  const ep = type === 'movie' ? '/search/movie' : '/search/tv'
  const url = `${BASE}${ep}?api_key=${API_KEY}&query=${encodeURIComponent(name)}&language=pt-BR`
  const r = await fetch(url)
  const d = await r.json()
  return d.results?.[0] || null
}

async function check(entry) {
  let hit = await search(entry.name, 'movie')
  let type = 'movie'
  if (!hit) { hit = await search(entry.name, 'tv'); type = 'tv' }
  return { ...entry, found: !!hit, type: hit ? type : null, id: hit?.id, title: hit?.title || hit?.name, year: (hit?.release_date || hit?.first_air_date || '').slice(0,4) }
}

const results = []
// processa em batches de 10 com 300ms de pausa (rate limit)
for (let i = 0; i < titles.length; i += 10) {
  const batch = titles.slice(i, i + 10)
  const res = await Promise.all(batch.map(check))
  results.push(...res)
  if (i + 10 < titles.length) await new Promise(r => setTimeout(r, 350))
}

const found = results.filter(r => r.found)
const notFound = results.filter(r => !r.found)

console.log(`\n✅ ENCONTRADOS (${found.length}/${results.length}):`)
let lastCat = ''
for (const r of found) {
  if (r.cat !== lastCat) { console.log(`\n  [${r.cat}]`); lastCat = r.cat }
  console.log(`    ✓ "${r.name}" → "${r.title}" (${r.year}) [${r.type} id:${r.id}]`)
}

console.log(`\n❌ NÃO ENCONTRADOS (${notFound.length}):`)
for (const r of notFound) {
  console.log(`    ✗ "${r.name}" [${r.cat}]`)
}
