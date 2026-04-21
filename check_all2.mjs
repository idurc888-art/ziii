const API_KEY = 'b68afbadedebf0889f00a0cf577d3e5a'
const BASE = 'https://api.themoviedb.org/3'

const titles = [
// AMAZON — FICÇÃO CIENTÍFICA
{s:'Amazon',cat:'Ficção Científica',name:'A Chegada'},
{s:'Amazon',cat:'Ficção Científica',name:'Interestelar'},
{s:'Amazon',cat:'Ficção Científica',name:'The Creator'},
{s:'Amazon',cat:'Ficção Científica',name:'O Exterminador do Futuro 2'},
{s:'Amazon',cat:'Ficção Científica',name:'Crimes do Futuro'},
{s:'Amazon',cat:'Ficção Científica',name:'Duna'},
{s:'Amazon',cat:'Ficção Científica',name:'No Limite do Amanhã'},
{s:'Amazon',cat:'Ficção Científica',name:'Contatos Imediatos do Terceiro Grau'},
{s:'Amazon',cat:'Ficção Científica',name:'Coerência'},
{s:'Amazon',cat:'Ficção Científica',name:'O Vingador do Futuro'},
// MAX — FICÇÃO CIENTÍFICA
{s:'Max',cat:'Ficção Científica',name:'Blade Runner 2049'},
{s:'Max',cat:'Ficção Científica',name:'A Origem'},
{s:'Max',cat:'Ficção Científica',name:'Tenet'},
{s:'Max',cat:'Ficção Científica',name:'Gravidade'},
{s:'Max',cat:'Ficção Científica',name:'2001 Uma Odisseia no Espaço'},
{s:'Max',cat:'Ficção Científica',name:'Contato'},
{s:'Max',cat:'Ficção Científica',name:'Jogador Nº 1'},
{s:'Max',cat:'Ficção Científica',name:'Elysium'},
// DISNEY — FICÇÃO CIENTÍFICA
{s:'Disney+',cat:'Ficção Científica',name:'Guardiões da Galáxia'},
{s:'Disney+',cat:'Ficção Científica',name:'Rogue One'},
{s:'Disney+',cat:'Ficção Científica',name:'Tron O Legado'},
{s:'Disney+',cat:'Ficção Científica',name:'Perdido em Marte'},
{s:'Disney+',cat:'Ficção Científica',name:'Prometheus'},
{s:'Disney+',cat:'Ficção Científica',name:'Eternos'},
{s:'Disney+',cat:'Ficção Científica',name:'Wall-E'},
{s:'Disney+',cat:'Ficção Científica',name:'Planeta dos Macacos O Confronto'},
{s:'Disney+',cat:'Ficção Científica',name:'Gigantes de Aço'},
// AMAZON — FANTASIA
{s:'Amazon',cat:'Fantasia',name:'A Lenda do Cavaleiro Verde'},
{s:'Amazon',cat:'Fantasia',name:'A Bússola de Ouro'},
{s:'Amazon',cat:'Fantasia',name:'Constantine'},
{s:'Amazon',cat:'Fantasia',name:'Mortal Kombat'},
{s:'Amazon',cat:'Fantasia',name:'O Labirinto do Fauno'},
{s:'Amazon',cat:'Fantasia',name:'Willy Wonka e a Fábrica de Chocolate'},
{s:'Amazon',cat:'Fantasia',name:'A Vida Secreta de Walter Mitty'},
{s:'Amazon',cat:'Fantasia',name:'Hook'},
// MAX — FANTASIA
{s:'Max',cat:'Fantasia',name:'Shazam Fúria dos Deuses'},
{s:'Max',cat:'Fantasia',name:'Aquaman'},
{s:'Max',cat:'Fantasia',name:'300'},
{s:'Max',cat:'Fantasia',name:'Fúria de Titãs'},
{s:'Max',cat:'Fantasia',name:'Sucker Punch'},
// DISNEY — FANTASIA
{s:'Disney+',cat:'Fantasia',name:'Doutor Estranho no Multiverso da Loucura'},
{s:'Disney+',cat:'Fantasia',name:'Thor Ragnarok'},
{s:'Disney+',cat:'Fantasia',name:'Abracadabra'},
{s:'Disney+',cat:'Fantasia',name:'O Retorno de Mary Poppins'},
{s:'Disney+',cat:'Fantasia',name:'Cinderela'},
{s:'Disney+',cat:'Fantasia',name:'A Bela e a Fera'},
{s:'Disney+',cat:'Fantasia',name:'Christopher Robin'},
{s:'Disney+',cat:'Fantasia',name:'Encantada'},
{s:'Disney+',cat:'Fantasia',name:'Artemis Fowl'},
// AMAZON — TERROR
{s:'Amazon',cat:'Terror',name:'Hereditário'},
{s:'Amazon',cat:'Terror',name:'Midsommar'},
{s:'Amazon',cat:'Terror',name:'Fale Comigo'},
{s:'Amazon',cat:'Terror',name:'Pearl'},
{s:'Amazon',cat:'Terror',name:'X A Marca da Morte'},
{s:'Amazon',cat:'Terror',name:'Sorria'},
{s:'Amazon',cat:'Terror',name:'O Telefone Preto'},
{s:'Amazon',cat:'Terror',name:'Suspiria'},
{s:'Amazon',cat:'Terror',name:'Corra'},
{s:'Amazon',cat:'Terror',name:'A Bruxa'},
// MAX — TERROR
{s:'Max',cat:'Terror',name:'Invocação do Mal'},
{s:'Max',cat:'Terror',name:'IT A Coisa'},
{s:'Max',cat:'Terror',name:'O Iluminado'},
{s:'Max',cat:'Terror',name:'Maligno'},
{s:'Max',cat:'Terror',name:'A Freira'},
{s:'Max',cat:'Terror',name:'Annabelle'},
{s:'Max',cat:'Terror',name:'O Exorcista'},
{s:'Max',cat:'Terror',name:'Doutor Sono'},
{s:'Max',cat:'Terror',name:'Evil Dead Rise'},
{s:'Max',cat:'Terror',name:'Poltergeist'},
// DISNEY — TERROR
{s:'Disney+',cat:'Terror',name:'Barbarian'},
{s:'Disney+',cat:'Terror',name:'O Menu'},
{s:'Disney+',cat:'Terror',name:'Prey'},
{s:'Disney+',cat:'Terror',name:'Antlers'},
{s:'Disney+',cat:'Terror',name:'Fresh'},
{s:'Disney+',cat:'Terror',name:'Alien O Oitavo Passageiro'},
{s:'Disney+',cat:'Terror',name:'O Sexto Sentido'},
{s:'Disney+',cat:'Terror',name:'Sinais'},
// AMAZON — SUSPENSE
{s:'Amazon',cat:'Suspense',name:'Saltburn'},
{s:'Amazon',cat:'Suspense',name:'Garota Exemplar'},
{s:'Amazon',cat:'Suspense',name:'Prisioneiros'},
{s:'Amazon',cat:'Suspense',name:'Ilha do Medo'},
{s:'Amazon',cat:'Suspense',name:'O Silêncio dos Inocentes'},
{s:'Amazon',cat:'Suspense',name:'Zodíaco'},
{s:'Amazon',cat:'Suspense',name:'Fragmentado'},
{s:'Amazon',cat:'Suspense',name:'O Homem nas Trevas'},
{s:'Amazon',cat:'Suspense',name:'Animais Noturnos'},
{s:'Amazon',cat:'Suspense',name:'O Abutre'},
// MAX — SUSPENSE
{s:'Max',cat:'Suspense',name:'Os Infiltrados'},
{s:'Max',cat:'Suspense',name:'Se7en'},
{s:'Max',cat:'Suspense',name:'Observadora'},
{s:'Max',cat:'Suspense',name:'Buscando'},
{s:'Max',cat:'Suspense',name:'Não Se Preocupe Querida'},
{s:'Max',cat:'Suspense',name:'Contágio'},
// DISNEY — SUSPENSE
{s:'Disney+',cat:'Suspense',name:'Corpo Fechado'},
{s:'Disney+',cat:'Suspense',name:'Amsterdam'},
{s:'Disney+',cat:'Suspense',name:'O Estrangulador de Boston'},
{s:'Disney+',cat:'Suspense',name:'Sem Saída'},
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
