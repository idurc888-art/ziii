// Script: adiciona Paramount+ ao catalog.ts
import fs from 'fs'

const newTitles = [
  // ── SÉRIES ──────────────────────────────────────────────
  { id: 'paramount-yellowstone', slug: 'yellowstone', title: 'Yellowstone', altTitles: ['yellowstone s01', 'yellowstone s02'], type: 'series', streaming: 'paramount', matchHints: ['yellowstone'] },
  { id: 'paramount-1883', slug: '1883', title: '1883', altTitles: [], type: 'series', streaming: 'paramount', matchHints: ['1883'] },
  { id: 'paramount-1923', slug: '1923', title: '1923', altTitles: [], type: 'series', streaming: 'paramount', matchHints: ['1923'] },
  { id: 'paramount-tulsa-king', slug: 'tulsa-king', title: 'Tulsa King', altTitles: [], type: 'series', streaming: 'paramount', matchHints: ['tulsa', 'king'] },
  { id: 'paramount-mayor-of-kingstown', slug: 'mayor-of-kingstown', title: 'Mayor of Kingstown', altTitles: ['prefeito de kingstown'], type: 'series', streaming: 'paramount', matchHints: ['mayor', 'kingstown'] },
  { id: 'paramount-halo', slug: 'halo', title: 'Halo', altTitles: [], type: 'series', streaming: 'paramount', matchHints: ['halo'] },
  { id: 'paramount-lioness', slug: 'lioness', title: 'Operação Lioness', altTitles: ['special ops lioness'], type: 'series', streaming: 'paramount', matchHints: ['lioness', 'operacao'] },
  { id: 'paramount-yellowjackets', slug: 'yellowjackets', title: 'Yellowjackets', altTitles: [], type: 'series', streaming: 'paramount', matchHints: ['yellowjackets'] },
  { id: 'paramount-star-trek-discovery', slug: 'star-trek-discovery', title: 'Star Trek: Discovery', altTitles: [], type: 'series', streaming: 'paramount', matchHints: ['star', 'trek', 'discovery'] },
  { id: 'paramount-star-trek-picard', slug: 'star-trek-picard', title: 'Star Trek: Picard', altTitles: [], type: 'series', streaming: 'paramount', matchHints: ['star', 'trek', 'picard'] },
  { id: 'paramount-star-trek-strange', slug: 'star-trek-strange', title: 'Star Trek: Strange New Worlds', altTitles: [], type: 'series', streaming: 'paramount', matchHints: ['star', 'trek', 'strange'] },
  { id: 'paramount-dexter', slug: 'dexter', title: 'Dexter', altTitles: [], type: 'series', streaming: 'paramount', matchHints: ['dexter'] },
  { id: 'paramount-dexter-new-blood', slug: 'dexter-new-blood', title: 'Dexter: New Blood', altTitles: [], type: 'series', streaming: 'paramount', matchHints: ['dexter', 'new', 'blood'] },
  { id: 'paramount-south-park', slug: 'south-park', title: 'South Park', altTitles: [], type: 'series', streaming: 'paramount', matchHints: ['south', 'park'] },
  { id: 'paramount-billions', slug: 'billions', title: 'Billions', altTitles: [], type: 'series', streaming: 'paramount', matchHints: ['billions'] },
  { id: 'paramount-ray-donovan', slug: 'ray-donovan', title: 'Ray Donovan', altTitles: [], type: 'series', streaming: 'paramount', matchHints: ['ray', 'donovan'] },
  { id: 'paramount-californication', slug: 'californication', title: 'Californication', altTitles: [], type: 'series', streaming: 'paramount', matchHints: ['californication'] },
  { id: 'paramount-your-honor', slug: 'your-honor', title: 'Your Honor', altTitles: [], type: 'series', streaming: 'paramount', matchHints: ['your', 'honor'] },
  { id: 'paramount-homeland', slug: 'homeland', title: 'Homeland', altTitles: [], type: 'series', streaming: 'paramount', matchHints: ['homeland'] },
  { id: 'paramount-twin-peaks', slug: 'twin-peaks', title: 'Twin Peaks', altTitles: [], type: 'series', streaming: 'paramount', matchHints: ['twin', 'peaks'] },
  { id: 'paramount-rei-da-tv', slug: 'rei-da-tv', title: 'O Rei da TV', altTitles: ['the loudest voice'], type: 'series', streaming: 'paramount', matchHints: ['rei', 'tv', 'loudest'] },
  { id: 'paramount-the-curse', slug: 'the-curse', title: 'The Curse', altTitles: ['a maldicao'], type: 'series', streaming: 'paramount', matchHints: ['curse', 'maldicao'] },
  { id: 'paramount-the-borgias', slug: 'the-borgias', title: 'The Borgias', altTitles: ['os borgias'], type: 'series', streaming: 'paramount', matchHints: ['borgias'] },
  { id: 'paramount-penny-dreadful', slug: 'penny-dreadful', title: 'Penny Dreadful', altTitles: [], type: 'series', streaming: 'paramount', matchHints: ['penny', 'dreadful'] },
  { id: 'paramount-frasier', slug: 'frasier', title: 'Frasier', altTitles: [], type: 'series', streaming: 'paramount', matchHints: ['frasier'] },
  { id: 'paramount-icarly', slug: 'icarly', title: 'iCarly', altTitles: [], type: 'series', streaming: 'paramount', matchHints: ['icarly'] },
  { id: 'paramount-todo-mundo-odeia-chris', slug: 'todo-mundo-odeia-chris', title: 'Todo Mundo Odeia o Chris', altTitles: ['everybody hates chris'], type: 'series', streaming: 'paramount', matchHints: ['todo', 'mundo', 'odeia', 'chris'] },
  { id: 'paramount-patrulha-canina', slug: 'patrulha-canina', title: 'Patrulha Canina', altTitles: ['paw patrol'], type: 'series', streaming: 'paramount', matchHints: ['patrulha', 'canina', 'paw', 'patrol'] },
  { id: 'paramount-bob-esponja', slug: 'bob-esponja', title: 'Bob Esponja', altTitles: ['spongebob'], type: 'series', streaming: 'paramount', matchHints: ['bob', 'esponja', 'spongebob'] },
  // ── FILMES ──────────────────────────────────────────────
  { id: 'paramount-top-gun-maverick', slug: 'top-gun-maverick', title: 'Top Gun: Maverick', altTitles: [], type: 'movie', streaming: 'paramount', matchHints: ['top', 'gun', 'maverick'] },
  { id: 'paramount-missao-impossivel-7', slug: 'missao-impossivel-7', title: 'Missão: Impossível - Acerto de Contas', altTitles: ['dead reckoning'], type: 'movie', streaming: 'paramount', matchHints: ['missao', 'impossivel', 'dead', 'reckoning'] },
  { id: 'paramount-transformers-despertar', slug: 'transformers-despertar', title: 'Transformers: O Despertar das Feras', altTitles: ['rise of the beasts'], type: 'movie', streaming: 'paramount', matchHints: ['transformers', 'despertar', 'feras'] },
  { id: 'paramount-sonic-2', slug: 'sonic-2', title: 'Sonic 2: O Filme', altTitles: ['sonic the hedgehog 2'], type: 'movie', streaming: 'paramount', matchHints: ['sonic', '2'] },
  { id: 'paramount-panico-6', slug: 'panico-6', title: 'Pânico VI', altTitles: ['scream vi'], type: 'movie', streaming: 'paramount', matchHints: ['panico', 'scream', 'vi'] },
  { id: 'paramount-dungeons-dragons', slug: 'dungeons-dragons', title: 'Dungeons & Dragons: Honra Entre Rebeldes', altTitles: ['honor among thieves'], type: 'movie', streaming: 'paramount', matchHints: ['dungeons', 'dragons'] },
  { id: 'paramount-babilonia', slug: 'babilonia', title: 'Babilônia', altTitles: ['babylon'], type: 'movie', streaming: 'paramount', matchHints: ['babilonia', 'babylon'] },
  { id: 'paramount-sorria', slug: 'sorria', title: 'Sorria', altTitles: ['smile'], type: 'movie', streaming: 'paramount', matchHints: ['sorria', 'smile'] },
  { id: 'paramount-bob-marley', slug: 'bob-marley', title: 'Bob Marley: One Love', altTitles: [], type: 'movie', streaming: 'paramount', matchHints: ['bob', 'marley'] },
  { id: 'paramount-meninas-malvadas-2024', slug: 'meninas-malvadas-2024', title: 'Meninas Malvadas', altTitles: ['mean girls 2024'], type: 'movie', streaming: 'paramount', matchHints: ['meninas', 'malvadas', 'mean', 'girls'] },
  { id: 'paramount-tartarugas-ninja', slug: 'tartarugas-ninja', title: 'Tartarugas Ninja: Caos Mutante', altTitles: ['mutant mayhem'], type: 'movie', streaming: 'paramount', matchHints: ['tartarugas', 'ninja', 'mutante'] },
  { id: 'paramount-poderoso-chefao', slug: 'poderoso-chefao', title: 'O Poderoso Chefão', altTitles: ['the godfather'], type: 'movie', streaming: 'paramount', matchHints: ['poderoso', 'chefao', 'godfather'] },
  { id: 'paramount-gladiador', slug: 'gladiador', title: 'Gladiador', altTitles: ['gladiator'], type: 'movie', streaming: 'paramount', matchHints: ['gladiador', 'gladiator'] },
  { id: 'paramount-interestelar', slug: 'interestelar', title: 'Interestelar', altTitles: ['interstellar'], type: 'movie', streaming: 'paramount', matchHints: ['interestelar', 'interstellar'] },
  { id: 'paramount-forrest-gump', slug: 'forrest-gump', title: 'Forrest Gump', altTitles: [], type: 'movie', streaming: 'paramount', matchHints: ['forrest', 'gump'] },
  { id: 'paramount-lobo-wall-street', slug: 'lobo-wall-street', title: 'O Lobo de Wall Street', altTitles: ['the wolf of wall street'], type: 'movie', streaming: 'paramount', matchHints: ['lobo', 'wall', 'street'] },
  { id: 'paramount-clube-da-luta', slug: 'clube-da-luta', title: 'Clube da Luta', altTitles: ['fight club'], type: 'movie', streaming: 'paramount', matchHints: ['clube', 'luta', 'fight', 'club'] },
  { id: 'paramount-pulp-fiction', slug: 'pulp-fiction', title: 'Pulp Fiction', altTitles: ['tempo de violencia'], type: 'movie', streaming: 'paramount', matchHints: ['pulp', 'fiction'] },
  { id: 'paramount-prenda-me', slug: 'prenda-me', title: 'Prenda-Me Se For Capaz', altTitles: ['catch me if you can'], type: 'movie', streaming: 'paramount', matchHints: ['prenda', 'catch'] },
  { id: 'paramount-resgate-soldado-ryan', slug: 'resgate-soldado-ryan', title: 'O Resgate do Soldado Ryan', altTitles: ['saving private ryan'], type: 'movie', streaming: 'paramount', matchHints: ['resgate', 'soldado', 'ryan'] },
  { id: 'paramount-meninas-malvadas-classico', slug: 'meninas-malvadas-classico', title: 'Meninas Malvadas', altTitles: ['mean girls 2004'], type: 'movie', streaming: 'paramount', matchHints: ['meninas', 'malvadas', '2004'] },
]

const content = fs.readFileSync('./src/data/catalog.ts', 'utf8')
const insertPoint = content.lastIndexOf(']')
const newEntries = newTitles.map(t => `  ${JSON.stringify(t)}`).join(',\n')
const newContent = content.slice(0, insertPoint) + ',\n' + newEntries + '\n' + content.slice(insertPoint)
fs.writeFileSync('./src/data/catalog.ts', newContent)
console.log(`✅ Adicionados ${newTitles.length} títulos Paramount+`)
console.log(`Total no arquivo: ${(newContent.match(/"id":/g) || []).length} títulos`)
