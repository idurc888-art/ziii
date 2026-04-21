const API_KEY = 'b68afbadedebf0889f00a0cf577d3e5a'
const BASE = 'https://api.themoviedb.org/3'

const titles = [
// AMAZON — AÇÃO
{s:'Amazon',cat:'Ação',name:'Matador de Aluguel'},
{s:'Amazon',cat:'Ação',name:'A Guerra do Amanhã'},
{s:'Amazon',cat:'Ação',name:'O Pacto'},
{s:'Amazon',cat:'Ação',name:'Sem Remorso'},
{s:'Amazon',cat:'Ação',name:'Beekeeper: Rede de Vingança'},
{s:'Amazon',cat:'Ação',name:'John Wick 4'},
{s:'Amazon',cat:'Ação',name:'Infiltrado'},
{s:'Amazon',cat:'Ação',name:'Samaritano'},
{s:'Amazon',cat:'Ação',name:'Operação Fortune'},
{s:'Amazon',cat:'Ação',name:'Covil de Ladrões'},
// MAX — AÇÃO
{s:'Max',cat:'Ação',name:'The Batman'},
{s:'Max',cat:'Ação',name:'Mad Max Estrada da Fúria'},
{s:'Max',cat:'Ação',name:'Batman O Cavaleiro das Trevas'},
{s:'Max',cat:'Ação',name:'Mulher-Maravilha'},
{s:'Max',cat:'Ação',name:'Matrix'},
{s:'Max',cat:'Ação',name:'O Esquadrão Suicida'},
{s:'Max',cat:'Ação',name:'Trem-Bala'},
{s:'Max',cat:'Ação',name:'Círculo de Fogo'},
{s:'Max',cat:'Ação',name:'Snake Eyes'},
{s:'Max',cat:'Ação',name:'Aves de Rapina'},
// DISNEY — AÇÃO
{s:'Disney+',cat:'Ação',name:'Vingadores Ultimato'},
{s:'Disney+',cat:'Ação',name:'Pantera Negra'},
{s:'Disney+',cat:'Ação',name:'Deadpool e Wolverine'},
{s:'Disney+',cat:'Ação',name:'Indiana Jones e a Relíquia do Destino'},
{s:'Disney+',cat:'Ação',name:'Shang-Chi'},
{s:'Disney+',cat:'Ação',name:'Capitão América O Soldado Invernal'},
{s:'Disney+',cat:'Ação',name:'Piratas do Caribe'},
{s:'Disney+',cat:'Ação',name:'Homem de Ferro'},
{s:'Disney+',cat:'Ação',name:'X-Men Dias de um Futuro Esquecido'},
{s:'Disney+',cat:'Ação',name:'Logan'},
// AMAZON — AVENTURA
{s:'Amazon',cat:'Aventura',name:'O Senhor dos Anéis A Sociedade do Anel'},
{s:'Amazon',cat:'Aventura',name:'Dungeons e Dragons'},
{s:'Amazon',cat:'Aventura',name:'Jumanji Bem-Vindo à Selva'},
{s:'Amazon',cat:'Aventura',name:'O Hobbit'},
{s:'Amazon',cat:'Aventura',name:'Uncharted Fora do Mapa'},
{s:'Amazon',cat:'Aventura',name:'O Homem do Norte'},
{s:'Amazon',cat:'Aventura',name:'Tudo em Todo o Lugar ao Mesmo Tempo'},
{s:'Amazon',cat:'Aventura',name:'King Kong'},
{s:'Amazon',cat:'Aventura',name:'Jurassic Park'},
{s:'Amazon',cat:'Aventura',name:'A Lenda do Tesouro Perdido'},
// MAX — AVENTURA
{s:'Max',cat:'Aventura',name:'Harry Potter e a Pedra Filosofal'},
{s:'Max',cat:'Aventura',name:'Animais Fantásticos e Onde Habitam'},
{s:'Max',cat:'Aventura',name:'Godzilla vs Kong'},
{s:'Max',cat:'Aventura',name:'A Lenda de Tarzan'},
{s:'Max',cat:'Aventura',name:'Rampage'},
{s:'Max',cat:'Aventura',name:'O Homem de Aço'},
{s:'Max',cat:'Aventura',name:'Black Adam'},
{s:'Max',cat:'Aventura',name:'Pokémon Detetive Pikachu'},
// DISNEY — AVENTURA
{s:'Disney+',cat:'Aventura',name:'Star Wars Uma Nova Esperança'},
{s:'Disney+',cat:'Aventura',name:'Avatar'},
{s:'Disney+',cat:'Aventura',name:'Avatar O Caminho da Água'},
{s:'Disney+',cat:'Aventura',name:'Cruella'},
{s:'Disney+',cat:'Aventura',name:'Jungle Cruise'},
{s:'Disney+',cat:'Aventura',name:'Malévola'},
{s:'Disney+',cat:'Aventura',name:'Alice no País das Maravilhas'},
{s:'Disney+',cat:'Aventura',name:'As Crônicas de Nárnia'},
// AMAZON — COMÉDIA
{s:'Amazon',cat:'Comédia',name:'Borat 2'},
{s:'Amazon',cat:'Comédia',name:'Um Príncipe em Nova York 2'},
{s:'Amazon',cat:'Comédia',name:'Palm Springs'},
{s:'Amazon',cat:'Comédia',name:'Casamento Armado'},
{s:'Amazon',cat:'Comédia',name:'Ricky Stanicky'},
{s:'Amazon',cat:'Comédia',name:'Triângulo da Tristeza'},
{s:'Amazon',cat:'Comédia',name:'Vizinhos'},
{s:'Amazon',cat:'Comédia',name:'O Virgem de 40 Anos'},
{s:'Amazon',cat:'Comédia',name:'Gente Grande'},
// MAX — COMÉDIA
{s:'Max',cat:'Comédia',name:'Se Beber Não Case'},
{s:'Max',cat:'Comédia',name:'Família do Bagulho'},
{s:'Max',cat:'Comédia',name:'Sim Senhor'},
{s:'Max',cat:'Comédia',name:'O Pai da Noiva'},
{s:'Max',cat:'Comédia',name:'Space Jam Um Novo Legado'},
{s:'Max',cat:'Comédia',name:'Ted'},
{s:'Max',cat:'Comédia',name:'Um Parto de Viagem'},
{s:'Max',cat:'Comédia',name:'Quero Matar Meu Chefe'},
// DISNEY — COMÉDIA
{s:'Disney+',cat:'Comédia',name:'Esqueceram de Mim'},
{s:'Disney+',cat:'Comédia',name:'Free Guy'},
{s:'Disney+',cat:'Comédia',name:'Diário de um Banana'},
{s:'Disney+',cat:'Comédia',name:'Uma Noite no Museu'},
{s:'Disney+',cat:'Comédia',name:'Dr. Dolittle'},
// AMAZON — DRAMA
{s:'Amazon',cat:'Drama',name:'O Som do Silêncio'},
{s:'Amazon',cat:'Drama',name:'Manchester à Beira-Mar'},
{s:'Amazon',cat:'Drama',name:'Air A História por Trás do Logo'},
{s:'Amazon',cat:'Drama',name:'A Baleia'},
{s:'Amazon',cat:'Drama',name:'Argentina 1985'},
{s:'Amazon',cat:'Drama',name:'Ficção Americana'},
{s:'Amazon',cat:'Drama',name:'Clube da Luta'},
{s:'Amazon',cat:'Drama',name:'Oppenheimer'},
{s:'Amazon',cat:'Drama',name:'Treze Vidas'},
{s:'Amazon',cat:'Drama',name:'Querido Menino'},
// MAX — DRAMA
{s:'Max',cat:'Drama',name:'Coringa'},
{s:'Max',cat:'Drama',name:'Elvis'},
{s:'Max',cat:'Drama',name:'Duna'},
{s:'Max',cat:'Drama',name:'Nasce Uma Estrela'},
{s:'Max',cat:'Drama',name:'Sniper Americano'},
{s:'Max',cat:'Drama',name:'O Grande Gatsby'},
{s:'Max',cat:'Drama',name:'Judas e o Messias Negro'},
{s:'Max',cat:'Drama',name:'King Richard'},
{s:'Max',cat:'Drama',name:'Belfast'},
{s:'Max',cat:'Drama',name:'Um Sonho de Liberdade'},
// DISNEY — DRAMA
{s:'Disney+',cat:'Drama',name:'O Menino do Pijama Listrado'},
{s:'Disney+',cat:'Drama',name:'Sociedade dos Poetas Mortos'},
{s:'Disney+',cat:'Drama',name:'Nomadland'},
{s:'Disney+',cat:'Drama',name:'A Menina que Roubava Livros'},
{s:'Disney+',cat:'Drama',name:'Ford vs Ferrari'},
{s:'Disney+',cat:'Drama',name:'O Grande Showman'},
{s:'Disney+',cat:'Drama',name:'Morte no Nilo'},
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
