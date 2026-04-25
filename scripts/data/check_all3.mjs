const API_KEY = 'b68afbadedebf0889f00a0cf577d3e5a'
const BASE = 'https://api.themoviedb.org/3'

const titles = [
// AMAZON — ROMANCE
{s:'Amazon',cat:'Romance',name:'Vermelho Branco e Sangue Azul'},
{s:'Amazon',cat:'Romance',name:'Uma Ideia de Você'},
{s:'Amazon',cat:'Romance',name:'Questão de Tempo'},
{s:'Amazon',cat:'Romance',name:'Me Chame Pelo Seu Nome'},
{s:'Amazon',cat:'Romance',name:'O Lado Bom da Vida'},
{s:'Amazon',cat:'Romance',name:'Como Eu Era Antes de Você'},
{s:'Amazon',cat:'Romance',name:'Simplesmente Acontece'},
{s:'Amazon',cat:'Romance',name:'Podres de Ricos'},
{s:'Amazon',cat:'Romance',name:'Diário de uma Paixão'},
{s:'Amazon',cat:'Romance',name:'Orgulho e Preconceito'},
// MAX — ROMANCE
{s:'Max',cat:'Romance',name:'Antes do Amanhecer'},
{s:'Max',cat:'Romance',name:'Antes do Pôr do Sol'},
{s:'Max',cat:'Romance',name:'Como Perder um Homem em 10 Dias'},
{s:'Max',cat:'Romance',name:'A Escolha'},
{s:'Max',cat:'Romance',name:'Letras e Música'},
{s:'Max',cat:'Romance',name:'P.S. Eu Te Amo'},
{s:'Max',cat:'Romance',name:'Amor a Toda Prova'},
// DISNEY — ROMANCE
{s:'Disney+',cat:'Romance',name:'A Culpa é das Estrelas'},
{s:'Disney+',cat:'Romance',name:'Cidades de Papel'},
{s:'Disney+',cat:'Romance',name:'10 Coisas que Eu Odeio em Você'},
{s:'Disney+',cat:'Romance',name:'Enquanto Você Dormia'},
{s:'Disney+',cat:'Romance',name:'Titanic'},
{s:'Disney+',cat:'Romance',name:'Amor Simon'},
{s:'Disney+',cat:'Romance',name:'O Casamento do Meu Melhor Amigo'},
{s:'Disney+',cat:'Romance',name:'Uma Linda Mulher'},
// AMAZON — DOCUMENTÁRIO
{s:'Amazon',cat:'Documentário',name:'Good Night Oppy'},
{s:'Amazon',cat:'Documentário',name:'Val'},
{s:'Amazon',cat:'Documentário',name:'Eu Sou Céline Dion'},
{s:'Amazon',cat:'Documentário',name:'Fahrenheit 9/11'},
{s:'Amazon',cat:'Documentário',name:'Super Size Me'},
{s:'Amazon',cat:'Documentário',name:'Citizenfour'},
// MAX — DOCUMENTÁRIO
{s:'Max',cat:'Documentário',name:'Leaving Neverland'},
{s:'Max',cat:'Documentário',name:'Navalny'},
{s:'Max',cat:'Documentário',name:'Fake Famous'},
{s:'Max',cat:'Documentário',name:'Tina'},
{s:'Max',cat:'Documentário',name:'Spielberg'},
// DISNEY — DOCUMENTÁRIO
{s:'Disney+',cat:'Documentário',name:'The Beatles Get Back'},
{s:'Disney+',cat:'Documentário',name:'Free Solo'},
{s:'Disney+',cat:'Documentário',name:'Fire of Love'},
{s:'Disney+',cat:'Documentário',name:'Howard'},
// AMAZON — ANIMAÇÃO
{s:'Amazon',cat:'Animação',name:'Homem-Aranha no Aranhaverso'},
{s:'Amazon',cat:'Animação',name:'Shrek'},
{s:'Amazon',cat:'Animação',name:'Gato de Botas 2'},
{s:'Amazon',cat:'Animação',name:'Festa da Salsicha'},
{s:'Amazon',cat:'Animação',name:'O Gigante de Ferro'},
{s:'Amazon',cat:'Animação',name:'Kung Fu Panda'},
{s:'Amazon',cat:'Animação',name:'A Fuga das Galinhas'},
{s:'Amazon',cat:'Animação',name:'Meu Malvado Favorito'},
// MAX — ANIMAÇÃO
{s:'Max',cat:'Animação',name:'Lego Batman'},
{s:'Max',cat:'Animação',name:'A Viagem de Chihiro'},
{s:'Max',cat:'Animação',name:'Meu Vizinho Totoro'},
{s:'Max',cat:'Animação',name:'Princesa Mononoke'},
{s:'Max',cat:'Animação',name:'O Castelo Animado'},
// DISNEY — ANIMAÇÃO
{s:'Disney+',cat:'Animação',name:'Toy Story'},
{s:'Disney+',cat:'Animação',name:'Divertida Mente'},
{s:'Disney+',cat:'Animação',name:'Encanto'},
{s:'Disney+',cat:'Animação',name:'Soul'},
{s:'Disney+',cat:'Animação',name:'Luca'},
{s:'Disney+',cat:'Animação',name:'Moana'},
{s:'Disney+',cat:'Animação',name:'Frozen'},
{s:'Disney+',cat:'Animação',name:'Viva A Vida é uma Festa'},
{s:'Disney+',cat:'Animação',name:'Ratatouille'},
{s:'Disney+',cat:'Animação',name:'Zootopia'},
// AMAZON — INFANTIL
{s:'Amazon',cat:'Infantil',name:'Paddington 2'},
{s:'Amazon',cat:'Infantil',name:'O Grinch'},
{s:'Amazon',cat:'Infantil',name:'Patrulha Canina O Filme'},
{s:'Amazon',cat:'Infantil',name:'Sonic 2'},
{s:'Amazon',cat:'Infantil',name:'E.T. O Extraterrestre'},
{s:'Amazon',cat:'Infantil',name:'A Família Addams'},
{s:'Amazon',cat:'Infantil',name:'O Lorax'},
{s:'Amazon',cat:'Infantil',name:'Matilda'},
{s:'Amazon',cat:'Infantil',name:'Nanny McPhee'},
// MAX — INFANTIL
{s:'Max',cat:'Infantil',name:'O Mágico de Oz'},
{s:'Max',cat:'Infantil',name:'Wonka'},
{s:'Max',cat:'Infantil',name:'Tom e Jerry'},
{s:'Max',cat:'Infantil',name:'A Fantástica Fábrica de Chocolate'},
{s:'Max',cat:'Infantil',name:'Happy Feet'},
{s:'Max',cat:'Infantil',name:'Os Goonies'},
{s:'Max',cat:'Infantil',name:'Gremlins'},
// DISNEY — INFANTIL
{s:'Disney+',cat:'Infantil',name:'Lilo e Stitch'},
{s:'Disney+',cat:'Infantil',name:'O Rei Leão'},
{s:'Disney+',cat:'Infantil',name:'Peter Pan e Wendy'},
{s:'Disney+',cat:'Infantil',name:'Pinóquio'},
{s:'Disney+',cat:'Infantil',name:'Sexta-Feira Muito Louca'},
{s:'Disney+',cat:'Infantil',name:'Super Escola de Heróis'},
{s:'Disney+',cat:'Infantil',name:'Querida Encolhi as Crianças'},
// AMAZON — MISTÉRIO
{s:'Amazon',cat:'Mistério',name:'Assassinato no Expresso do Oriente'},
{s:'Amazon',cat:'Mistério',name:'Os Homens que Não Amavam as Mulheres'},
{s:'Amazon',cat:'Mistério',name:'Amnésia'},
{s:'Amazon',cat:'Mistério',name:'Chinatown'},
// MAX — MISTÉRIO
{s:'Max',cat:'Mistério',name:'Sherlock Holmes'},
{s:'Max',cat:'Mistério',name:'Sobre Meninos e Lobos'},
{s:'Max',cat:'Mistério',name:'Dia de Treinamento'},
{s:'Max',cat:'Mistério',name:'Minority Report'},
// DISNEY — MISTÉRIO
{s:'Disney+',cat:'Mistério',name:'Veja Como Eles Correm'},
{s:'Disney+',cat:'Mistério',name:'O Mistério de Veneza'},
{s:'Disney+',cat:'Mistério',name:'Dick Tracy'},
{s:'Disney+',cat:'Mistério',name:'Bad Times at the El Royale'},
{s:'Disney+',cat:'Mistério',name:'O Grande Hotel Budapeste'},
// AMAZON — MUSICAL
{s:'Amazon',cat:'Musical',name:'La La Land'},
{s:'Amazon',cat:'Musical',name:'O Rei do Show'},
{s:'Amazon',cat:'Musical',name:'Rocketman'},
{s:'Amazon',cat:'Musical',name:'Mamma Mia'},
{s:'Amazon',cat:'Musical',name:'Os Miseráveis'},
{s:'Amazon',cat:'Musical',name:'Em Ritmo de Fuga'},
{s:'Amazon',cat:'Musical',name:'Cantando na Chuva'},
{s:'Amazon',cat:'Musical',name:'Bohemian Rhapsody'},
// MAX — MUSICAL
{s:'Max',cat:'Musical',name:'In the Heights'},
{s:'Max',cat:'Musical',name:'Cantar'},
{s:'Max',cat:'Musical',name:'Rock of Ages'},
{s:'Max',cat:'Musical',name:'Hairspray'},
{s:'Max',cat:'Musical',name:'Across the Universe'},
{s:'Max',cat:'Musical',name:'Sweeney Todd'},
// DISNEY — MUSICAL
{s:'Disney+',cat:'Musical',name:'Hamilton'},
{s:'Disney+',cat:'Musical',name:'A Noviça Rebelde'},
{s:'Disney+',cat:'Musical',name:'Amor Sublime Amor'},
{s:'Disney+',cat:'Musical',name:'A Pequena Sereia'},
{s:'Disney+',cat:'Musical',name:'Aladdin'},
{s:'Disney+',cat:'Musical',name:'Black is King'},
{s:'Disney+',cat:'Musical',name:'Camp Rock'},
{s:'Disney+',cat:'Musical',name:'High School Musical'},
]

async function search(name, type) {
  const ep = type === 'movie' ? '/search/movie' : '/search/tv'
  const r = await fetch(`${BASE}${ep}?api_key=${API_KEY}&query=${encodeURIComponent(name)}&language=pt-BR`)
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
for (let i = 0; i < titles.length; i += 10) {
  const batch = titles.slice(i, i + 10)
  const res = await Promise.all(batch.map(check))
  results.push(...res)
  if (i + 10 < titles.length) await new Promise(r => setTimeout(r, 350))
}

const found = results.filter(r => r.found)
const notFound = results.filter(r => !r.found)

let lastKey = ''
console.log(`\n✅ ENCONTRADOS (${found.length}/${results.length}):\n`)
for (const r of found) {
  const key = `${r.s}|${r.cat}`
  if (key !== lastKey) { console.log(`\n  [${r.s} — ${r.cat}]`); lastKey = key }
  console.log(`    ✓ "${r.name}" → "${r.title}" (${r.year}) [${r.type} id:${r.id}]`)
}

if (notFound.length) {
  console.log(`\n❌ NÃO ENCONTRADOS (${notFound.length}):`)
  for (const r of notFound) console.log(`    ✗ "${r.name}" [${r.s} — ${r.cat}]`)
}
