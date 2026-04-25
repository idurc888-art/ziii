// Script: adiciona filmes Disney+ ao catalog.ts
import fs from 'fs'

const newTitles = [
  // ── AÇÃO ────────────────────────────────────────────────
  { id: 'disney-vingadores-ultimato', slug: 'vingadores-ultimato', title: 'Vingadores: Ultimato', altTitles: ['avengers endgame'], type: 'movie', streaming: 'disney', matchHints: ['vingadores', 'ultimato', 'avengers', 'endgame'] },
  { id: 'disney-pantera-negra', slug: 'pantera-negra', title: 'Pantera Negra', altTitles: ['black panther'], type: 'movie', streaming: 'disney', matchHints: ['pantera', 'negra', 'black', 'panther'] },
  { id: 'disney-deadpool-wolverine', slug: 'deadpool-wolverine', title: 'Deadpool & Wolverine', altTitles: ['deadpool 3'], type: 'movie', streaming: 'disney', matchHints: ['deadpool', 'wolverine'] },
  { id: 'disney-shang-chi', slug: 'shang-chi', title: 'Shang-Chi', altTitles: ['shang chi legend of the ten rings'], type: 'movie', streaming: 'disney', matchHints: ['shang', 'chi'] },
  { id: 'disney-capitao-america-soldado', slug: 'capitao-america-soldado', title: 'Capitão América: O Soldado Invernal', altTitles: ['captain america winter soldier'], type: 'movie', streaming: 'disney', matchHints: ['capitao', 'america', 'soldado', 'invernal'] },
  { id: 'disney-homem-de-ferro', slug: 'homem-de-ferro', title: 'Homem de Ferro', altTitles: ['iron man'], type: 'movie', streaming: 'disney', matchHints: ['homem', 'ferro', 'iron', 'man'] },
  { id: 'disney-logan', slug: 'logan', title: 'Logan', altTitles: [], type: 'movie', streaming: 'disney', matchHints: ['logan'] },
  { id: 'disney-viuva-negra', slug: 'viuva-negra', title: 'Viúva Negra', altTitles: ['black widow'], type: 'movie', streaming: 'disney', matchHints: ['viuva', 'negra', 'black', 'widow'] },
  { id: 'disney-thor-ragnarok', slug: 'thor-ragnarok', title: 'Thor: Ragnarok', altTitles: ['thor ragnarok'], type: 'movie', streaming: 'disney', matchHints: ['thor', 'ragnarok'] },
  { id: 'disney-kingsman', slug: 'kingsman', title: 'Kingsman: Serviço Secreto', altTitles: ['the kingsman secret service'], type: 'movie', streaming: 'disney', matchHints: ['kingsman'] },
  { id: 'disney-duro-de-matar', slug: 'duro-de-matar', title: 'Duro de Matar', altTitles: ['die hard'], type: 'movie', streaming: 'disney', matchHints: ['duro', 'matar', 'die', 'hard'] },
  { id: 'disney-guardioes-galaxia-3', slug: 'guardioes-galaxia-3', title: 'Guardiões da Galáxia Vol. 3', altTitles: ['guardians of the galaxy vol 3'], type: 'movie', streaming: 'disney', matchHints: ['guardioes', 'galaxia', '3'] },
  { id: 'disney-x-men-dias', slug: 'x-men-dias', title: 'X-Men: Dias de um Futuro Esquecido', altTitles: ['x-men days of future past'], type: 'movie', streaming: 'disney', matchHints: ['x-men', 'xmen', 'futuro'] },
  // ── AVENTURA ────────────────────────────────────────────
  { id: 'disney-star-wars-rogue-one', slug: 'star-wars-rogue-one', title: 'Rogue One: Uma História Star Wars', altTitles: ['rogue one'], type: 'movie', streaming: 'disney', matchHints: ['rogue', 'one', 'star', 'wars'] },
  { id: 'disney-avatar', slug: 'avatar', title: 'Avatar', altTitles: ['avatar 2009'], type: 'movie', streaming: 'disney', matchHints: ['avatar'] },
  { id: 'disney-avatar-caminho-da-agua', slug: 'avatar-caminho-da-agua', title: 'Avatar: O Caminho da Água', altTitles: ['avatar the way of water', 'avatar 2'], type: 'movie', streaming: 'disney', matchHints: ['avatar', 'caminho', 'agua'] },
  { id: 'disney-jungle-cruise', slug: 'jungle-cruise', title: 'Jungle Cruise', altTitles: ['cruzeiro na selva'], type: 'movie', streaming: 'disney', matchHints: ['jungle', 'cruise'] },
  { id: 'disney-indiana-jones-5', slug: 'indiana-jones-5', title: 'Indiana Jones e a Relíquia do Destino', altTitles: ['indiana jones dial of destiny'], type: 'movie', streaming: 'disney', matchHints: ['indiana', 'jones'] },
  { id: 'disney-piratas-do-caribe', slug: 'piratas-do-caribe', title: 'Piratas do Caribe: A Maldição do Pérola Negra', altTitles: ['pirates of the caribbean'], type: 'movie', streaming: 'disney', matchHints: ['piratas', 'caribe', 'pirates', 'caribbean'] },
  // ── COMÉDIA ─────────────────────────────────────────────
  { id: 'disney-free-guy', slug: 'free-guy', title: 'Free Guy', altTitles: ['jogador numero 1 free guy'], type: 'movie', streaming: 'disney', matchHints: ['free', 'guy'] },
  { id: 'disney-thor-love-thunder', slug: 'thor-love-thunder', title: 'Thor: Love and Thunder', altTitles: ['thor 4'], type: 'movie', streaming: 'disney', matchHints: ['thor', 'love', 'thunder'] },
  { id: 'disney-hocus-pocus-2', slug: 'hocus-pocus-2', title: 'Hocus Pocus 2', altTitles: [], type: 'movie', streaming: 'disney', matchHints: ['hocus', 'pocus', '2'] },
  // ── DRAMA ───────────────────────────────────────────────
  { id: 'disney-ford-vs-ferrari', slug: 'ford-vs-ferrari', title: 'Ford vs Ferrari', altTitles: ['le mans 66'], type: 'movie', streaming: 'disney', matchHints: ['ford', 'ferrari'] },
  { id: 'disney-o-grande-showman', slug: 'o-grande-showman', title: 'O Grande Showman', altTitles: ['the greatest showman'], type: 'movie', streaming: 'disney', matchHints: ['grande', 'showman', 'greatest'] },
  { id: 'disney-nomadland', slug: 'nomadland', title: 'Nomadland', altTitles: [], type: 'movie', streaming: 'disney', matchHints: ['nomadland'] },
  { id: 'disney-hamilton', slug: 'hamilton', title: 'Hamilton', altTitles: [], type: 'movie', streaming: 'disney', matchHints: ['hamilton'] },
  // ── FICÇÃO CIENTÍFICA ───────────────────────────────────
  { id: 'disney-guardioes-galaxia-1', slug: 'guardioes-galaxia-1', title: 'Guardiões da Galáxia', altTitles: ['guardians of the galaxy'], type: 'movie', streaming: 'disney', matchHints: ['guardioes', 'galaxia', 'guardians'] },
  { id: 'disney-eternos', slug: 'eternos', title: 'Eternos', altTitles: ['eternals'], type: 'movie', streaming: 'disney', matchHints: ['eternos', 'eternals'] },
  { id: 'disney-alien-romulus', slug: 'alien-romulus', title: 'Alien: Romulus', altTitles: [], type: 'movie', streaming: 'disney', matchHints: ['alien', 'romulus'] },
  { id: 'disney-alien-1979', slug: 'alien-1979', title: 'Alien', altTitles: ['alien 1979'], type: 'movie', streaming: 'disney', matchHints: ['alien'] },
  { id: 'disney-planeta-dos-macacos-reinado', slug: 'planeta-dos-macacos-reinado', title: 'Planeta dos Macacos: O Reinado', altTitles: ['kingdom of the planet of the apes'], type: 'movie', streaming: 'disney', matchHints: ['planeta', 'macacos', 'reinado'] },
  { id: 'disney-prey', slug: 'prey', title: 'Prey', altTitles: ['predator prey'], type: 'movie', streaming: 'disney', matchHints: ['prey'] },
  // ── FANTASIA ────────────────────────────────────────────
  { id: 'disney-doutor-estranho-multiverso', slug: 'doutor-estranho-multiverso', title: 'Doutor Estranho no Multiverso da Loucura', altTitles: ['doctor strange multiverse of madness'], type: 'movie', streaming: 'disney', matchHints: ['doutor', 'estranho', 'multiverso'] },
  { id: 'disney-abracadabra-2', slug: 'abracadabra-2', title: 'Abracadabra 2', altTitles: ['hocus pocus 2'], type: 'movie', streaming: 'disney', matchHints: ['abracadabra', '2'] },
  { id: 'disney-malevola', slug: 'malevola', title: 'Malévola', altTitles: ['maleficent'], type: 'movie', streaming: 'disney', matchHints: ['malevola', 'maleficent'] },
  { id: 'disney-frozen', slug: 'frozen', title: 'Frozen', altTitles: ['frozen uma aventura congelante'], type: 'movie', streaming: 'disney', matchHints: ['frozen'] },
  { id: 'disney-encanto', slug: 'encanto', title: 'Encanto', altTitles: [], type: 'movie', streaming: 'disney', matchHints: ['encanto'] },
  // ── TERROR ──────────────────────────────────────────────
  { id: 'disney-o-menu', slug: 'o-menu', title: 'O Menu', altTitles: ['the menu'], type: 'movie', streaming: 'disney', matchHints: ['menu'] },
  { id: 'disney-antlers', slug: 'antlers', title: 'Antlers', altTitles: ['chifres'], type: 'movie', streaming: 'disney', matchHints: ['antlers'] },
  // ── THRILLER ────────────────────────────────────────────
  { id: 'disney-o-sexto-sentido', slug: 'o-sexto-sentido', title: 'O Sexto Sentido', altTitles: ['the sixth sense'], type: 'movie', streaming: 'disney', matchHints: ['sexto', 'sentido', 'sixth', 'sense'] },
  { id: 'disney-assassinato-expresso-oriente', slug: 'assassinato-expresso-oriente', title: 'Assassinato no Expresso do Oriente', altTitles: ['murder on the orient express'], type: 'movie', streaming: 'disney', matchHints: ['assassinato', 'expresso', 'oriente', 'orient', 'express'] },
  { id: 'disney-morte-no-nilo', slug: 'morte-no-nilo', title: 'Morte no Nilo', altTitles: ['death on the nile'], type: 'movie', streaming: 'disney', matchHints: ['morte', 'nilo', 'death', 'nile'] },
  // ── ROMANCE ─────────────────────────────────────────────
  { id: 'disney-a-culpa-e-das-estrelas', slug: 'a-culpa-e-das-estrelas', title: 'A Culpa é das Estrelas', altTitles: ['the fault in our stars'], type: 'movie', streaming: 'disney', matchHints: ['culpa', 'estrelas', 'fault', 'stars'] },
  { id: 'disney-titanic', slug: 'titanic', title: 'Titanic', altTitles: [], type: 'movie', streaming: 'disney', matchHints: ['titanic'] },
  { id: 'disney-west-side-story', slug: 'west-side-story', title: 'West Side Story', altTitles: ['amor sublime amor'], type: 'movie', streaming: 'disney', matchHints: ['west', 'side', 'story'] },
  // ── ANIMAÇÃO ────────────────────────────────────────────
  { id: 'disney-toy-story', slug: 'toy-story', title: 'Toy Story', altTitles: [], type: 'movie', streaming: 'disney', matchHints: ['toy', 'story'] },
  { id: 'disney-divertida-mente', slug: 'divertida-mente', title: 'Divertida Mente', altTitles: ['inside out'], type: 'movie', streaming: 'disney', matchHints: ['divertida', 'mente', 'inside', 'out'] },
  { id: 'disney-divertida-mente-2', slug: 'divertida-mente-2', title: 'Divertida Mente 2', altTitles: ['inside out 2'], type: 'movie', streaming: 'disney', matchHints: ['divertida', 'mente', '2', 'inside', 'out'] },
  { id: 'disney-moana', slug: 'moana', title: 'Moana', altTitles: ['moana um mar de aventuras'], type: 'movie', streaming: 'disney', matchHints: ['moana'] },
  { id: 'disney-soul', slug: 'soul', title: 'Soul', altTitles: ['soul pixar'], type: 'movie', streaming: 'disney', matchHints: ['soul'] },
  { id: 'disney-luca', slug: 'luca', title: 'Luca', altTitles: [], type: 'movie', streaming: 'disney', matchHints: ['luca'] },
  { id: 'disney-viva-a-vida-e-uma-festa', slug: 'viva-a-vida-e-uma-festa', title: 'Viva: A Vida é uma Festa', altTitles: ['coco pixar'], type: 'movie', streaming: 'disney', matchHints: ['viva', 'coco'] },
  { id: 'disney-ratatouille', slug: 'ratatouille', title: 'Ratatouille', altTitles: [], type: 'movie', streaming: 'disney', matchHints: ['ratatouille'] },
  { id: 'disney-wall-e', slug: 'wall-e', title: 'Wall-E', altTitles: ['walle'], type: 'movie', streaming: 'disney', matchHints: ['wall', 'e', 'walle'] },
  { id: 'disney-up', slug: 'up', title: 'Up: Altas Aventuras', altTitles: ['up pixar'], type: 'movie', streaming: 'disney', matchHints: ['up'] },
  // ── INFANTIL ────────────────────────────────────────────
  { id: 'disney-lilo-stitch', slug: 'lilo-stitch', title: 'Lilo & Stitch', altTitles: ['lilo and stitch'], type: 'movie', streaming: 'disney', matchHints: ['lilo', 'stitch'] },
  { id: 'disney-o-rei-leao', slug: 'o-rei-leao', title: 'O Rei Leão', altTitles: ['the lion king'], type: 'movie', streaming: 'disney', matchHints: ['rei', 'leao', 'lion', 'king'] },
  { id: 'disney-mary-poppins', slug: 'mary-poppins', title: 'Mary Poppins', altTitles: [], type: 'movie', streaming: 'disney', matchHints: ['mary', 'poppins'] },
  // ── DOCUMENTÁRIO ────────────────────────────────────────
  { id: 'disney-beatles-get-back', slug: 'beatles-get-back', title: 'The Beatles: Get Back', altTitles: ['beatles get back'], type: 'movie', streaming: 'disney', matchHints: ['beatles', 'get', 'back'] },
]

const content = fs.readFileSync('./src/data/catalog.ts', 'utf8')
const insertPoint = content.lastIndexOf(']')
const newEntries = newTitles.map(t => `  ${JSON.stringify(t)}`).join(',\n')
const newContent = content.slice(0, insertPoint) + ',\n' + newEntries + '\n' + content.slice(insertPoint)
fs.writeFileSync('./src/data/catalog.ts', newContent)
console.log(`✅ Adicionados ${newTitles.length} filmes Disney+`)
console.log(`Total no arquivo: ${(newContent.match(/"id":/g) || []).length} títulos`)
