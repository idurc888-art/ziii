// Script: adiciona séries Disney+ ao catalog.ts
import fs from 'fs'

const newTitles = [
  // ── AÇÃO ────────────────────────────────────────────────
  { id: 'disney-xogum', slug: 'xogum', title: 'Xógum: A Gloriosa Saga do Japão', altTitles: ['shogun 2024'], type: 'series', streaming: 'disney', matchHints: ['xogum', 'shogun'] },
  { id: 'disney-o-mandaloriano', slug: 'o-mandaloriano', title: 'O Mandaloriano', altTitles: ['the mandalorian', 'mandalorian'], type: 'series', streaming: 'disney', matchHints: ['mandaloriano', 'mandalorian'] },
  { id: 'disney-andor', slug: 'andor', title: 'Andor', altTitles: ['star wars andor'], type: 'series', streaming: 'disney', matchHints: ['andor'] },
  { id: 'disney-24-horas', slug: '24-horas', title: '24 Horas', altTitles: ['24 hours', '24 jack bauer'], type: 'series', streaming: 'disney', matchHints: ['24', 'horas', 'bauer'] },
  { id: 'disney-prison-break', slug: 'prison-break', title: 'Prison Break', altTitles: ['fuga da prisao'], type: 'series', streaming: 'disney', matchHints: ['prison', 'break'] },
  { id: 'disney-sons-of-anarchy', slug: 'sons-of-anarchy', title: 'Sons of Anarchy', altTitles: ['filhos da anarquia'], type: 'series', streaming: 'disney', matchHints: ['sons', 'anarchy'] },
  { id: 'disney-the-punisher', slug: 'the-punisher', title: 'The Punisher', altTitles: ['punisher marvel'], type: 'series', streaming: 'disney', matchHints: ['punisher'] },
  { id: 'disney-daredevil', slug: 'daredevil', title: 'Daredevil', altTitles: ['demolidor disney'], type: 'series', streaming: 'disney', matchHints: ['daredevil', 'demolidor'] },
  // ── AVENTURA ────────────────────────────────────────────
  { id: 'disney-percy-jackson', slug: 'percy-jackson', title: 'Percy Jackson', altTitles: ['percy jackson and the olympians'], type: 'series', streaming: 'disney', matchHints: ['percy', 'jackson'] },
  { id: 'disney-ahsoka', slug: 'ahsoka', title: 'Ahsoka', altTitles: ['star wars ahsoka'], type: 'series', streaming: 'disney', matchHints: ['ahsoka'] },
  { id: 'disney-the-bad-batch', slug: 'the-bad-batch', title: 'The Bad Batch', altTitles: ['star wars bad batch'], type: 'series', streaming: 'disney', matchHints: ['bad', 'batch'] },
  { id: 'disney-lost', slug: 'lost', title: 'Lost', altTitles: ['perdidos'], type: 'series', streaming: 'disney', matchHints: ['lost', 'perdidos'] },
  { id: 'disney-star-wars-clone-wars', slug: 'star-wars-clone-wars', title: 'Star Wars: The Clone Wars', altTitles: ['clone wars'], type: 'series', streaming: 'disney', matchHints: ['clone', 'wars'] },
  { id: 'disney-star-wars-rebels', slug: 'star-wars-rebels', title: 'Star Wars Rebels', altTitles: ['rebels star wars'], type: 'series', streaming: 'disney', matchHints: ['rebels', 'star', 'wars'] },
  // ── COMÉDIA ─────────────────────────────────────────────
  { id: 'disney-os-simpsons', slug: 'os-simpsons', title: 'Os Simpsons', altTitles: ['the simpsons', 'simpsons'], type: 'series', streaming: 'disney', matchHints: ['simpsons'] },
  { id: 'disney-modern-family', slug: 'modern-family', title: 'Modern Family', altTitles: ['familia moderna'], type: 'series', streaming: 'disney', matchHints: ['modern', 'family'] },
  { id: 'disney-how-i-met-your-mother', slug: 'how-i-met-your-mother', title: 'How I Met Your Mother', altTitles: ['himym', 'como conheci sua mae'], type: 'series', streaming: 'disney', matchHints: ['how', 'met', 'mother', 'himym'] },
  { id: 'disney-only-murders', slug: 'only-murders', title: 'Only Murders in the Building', altTitles: ['only murders building'], type: 'series', streaming: 'disney', matchHints: ['only', 'murders', 'building'] },
  { id: 'disney-o-urso', slug: 'o-urso', title: 'O Urso', altTitles: ['the bear'], type: 'series', streaming: 'disney', matchHints: ['urso', 'bear'] },
  { id: 'disney-family-guy', slug: 'family-guy', title: 'Family Guy', altTitles: ['uma familia da pesada'], type: 'series', streaming: 'disney', matchHints: ['family', 'guy'] },
  // ── DRAMA ───────────────────────────────────────────────
  { id: 'disney-greys-anatomy', slug: 'greys-anatomy', title: "Grey's Anatomy", altTitles: ['greys anatomy', 'anatomia de grey'], type: 'series', streaming: 'disney', matchHints: ['grey', 'anatomy'] },
  { id: 'disney-the-dropout', slug: 'the-dropout', title: 'The Dropout', altTitles: ['a fraude'], type: 'series', streaming: 'disney', matchHints: ['dropout'] },
  { id: 'disney-dopesick', slug: 'dopesick', title: 'Dopesick', altTitles: ['dopesick america'], type: 'series', streaming: 'disney', matchHints: ['dopesick'] },
  { id: 'disney-the-old-man', slug: 'the-old-man', title: 'The Old Man', altTitles: ['o velho'], type: 'series', streaming: 'disney', matchHints: ['old', 'man'] },
  { id: 'disney-homeland', slug: 'homeland', title: 'Homeland', altTitles: ['homeland seguranca nacional'], type: 'series', streaming: 'disney', matchHints: ['homeland'] },
  { id: 'disney-scandal', slug: 'scandal', title: 'Scandal', altTitles: ['escandalo'], type: 'series', streaming: 'disney', matchHints: ['scandal', 'escandalo'] },
  { id: 'disney-criminal-minds', slug: 'criminal-minds', title: 'Criminal Minds', altTitles: ['mentes criminosas'], type: 'series', streaming: 'disney', matchHints: ['criminal', 'minds', 'mentes', 'criminosas'] },
  // ── FICÇÃO CIENTÍFICA ───────────────────────────────────
  { id: 'disney-arquivo-x', slug: 'arquivo-x', title: 'Arquivo X', altTitles: ['the x-files', 'x files'], type: 'series', streaming: 'disney', matchHints: ['arquivo', 'x', 'x-files'] },
  { id: 'disney-futurama', slug: 'futurama', title: 'Futurama', altTitles: [], type: 'series', streaming: 'disney', matchHints: ['futurama'] },
  { id: 'disney-legion', slug: 'legion', title: 'Legion', altTitles: ['legion marvel'], type: 'series', streaming: 'disney', matchHints: ['legion'] },
  { id: 'disney-the-strain', slug: 'the-strain', title: 'The Strain', altTitles: ['a praga'], type: 'series', streaming: 'disney', matchHints: ['strain', 'praga'] },
  // ── FANTASIA ────────────────────────────────────────────
  { id: 'disney-wandavision', slug: 'wandavision', title: 'WandaVision', altTitles: ['wanda vision'], type: 'series', streaming: 'disney', matchHints: ['wanda', 'vision', 'wandavision'] },
  { id: 'disney-loki', slug: 'loki', title: 'Loki', altTitles: ['loki marvel'], type: 'series', streaming: 'disney', matchHints: ['loki'] },
  { id: 'disney-cavaleiro-da-lua', slug: 'cavaleiro-da-lua', title: 'Cavaleiro da Lua', altTitles: ['moon knight'], type: 'series', streaming: 'disney', matchHints: ['cavaleiro', 'lua', 'moon', 'knight'] },
  { id: 'disney-agatha', slug: 'agatha', title: 'Agatha Desde Sempre', altTitles: ['agatha all along'], type: 'series', streaming: 'disney', matchHints: ['agatha'] },
  { id: 'disney-era-uma-vez', slug: 'era-uma-vez', title: 'Era Uma Vez', altTitles: ['once upon a time'], type: 'series', streaming: 'disney', matchHints: ['era', 'uma', 'vez', 'once', 'upon'] },
  { id: 'disney-gravity-falls', slug: 'gravity-falls', title: 'Gravity Falls', altTitles: [], type: 'series', streaming: 'disney', matchHints: ['gravity', 'falls'] },
  // ── TERROR ──────────────────────────────────────────────
  { id: 'disney-american-horror-story', slug: 'american-horror-story', title: 'American Horror Story', altTitles: ['ahs'], type: 'series', streaming: 'disney', matchHints: ['american', 'horror', 'story', 'ahs'] },
  { id: 'disney-the-walking-dead', slug: 'the-walking-dead', title: 'The Walking Dead', altTitles: ['walking dead'], type: 'series', streaming: 'disney', matchHints: ['walking', 'dead'] },
  { id: 'disney-o-que-fazemos-nas-sombras', slug: 'o-que-fazemos-nas-sombras', title: 'O Que Fazemos nas Sombras', altTitles: ['what we do in the shadows'], type: 'series', streaming: 'disney', matchHints: ['fazemos', 'sombras', 'shadows'] },
  { id: 'disney-chucky', slug: 'chucky', title: 'Chucky', altTitles: [], type: 'series', streaming: 'disney', matchHints: ['chucky'] },
  // ── THRILLER ────────────────────────────────────────────
  { id: 'disney-only-murders-building', slug: 'only-murders-building', title: 'Only Murders in the Building', altTitles: ['only murders'], type: 'series', streaming: 'disney', matchHints: ['only', 'murders'] },
  { id: 'disney-em-nome-do-ceu', slug: 'em-nome-do-ceu', title: 'Em Nome do Céu', altTitles: ['under the banner of heaven'], type: 'series', streaming: 'disney', matchHints: ['nome', 'ceu', 'banner', 'heaven'] },
  { id: 'disney-o-paciente', slug: 'o-paciente', title: 'O Paciente', altTitles: ['the patient'], type: 'series', streaming: 'disney', matchHints: ['paciente', 'patient'] },
  { id: 'disney-the-americans', slug: 'the-americans', title: 'The Americans', altTitles: ['os americanos'], type: 'series', streaming: 'disney', matchHints: ['americans', 'americanos'] },
  // ── ROMANCE ─────────────────────────────────────────────
  { id: 'disney-this-is-us-disney', slug: 'this-is-us-disney', title: 'This Is Us', altTitles: ['this is us disney'], type: 'series', streaming: 'disney', matchHints: ['this', 'is', 'us'] },
  { id: 'disney-love-victor', slug: 'love-victor', title: 'Love, Victor', altTitles: ['love victor'], type: 'series', streaming: 'disney', matchHints: ['love', 'victor'] },
  { id: 'disney-desperate-housewives', slug: 'desperate-housewives', title: 'Desperate Housewives', altTitles: ['esposas desesperadas'], type: 'series', streaming: 'disney', matchHints: ['desperate', 'housewives'] },
  // ── ANIMAÇÃO ────────────────────────────────────────────
  { id: 'disney-x-men-97', slug: 'x-men-97', title: "X-Men '97", altTitles: ['x-men 97', 'xmen 97'], type: 'series', streaming: 'disney', matchHints: ['x-men', 'xmen', '97'] },
  { id: 'disney-phineas-e-ferb', slug: 'phineas-e-ferb', title: 'Phineas e Ferb', altTitles: ['phineas and ferb'], type: 'series', streaming: 'disney', matchHints: ['phineas', 'ferb'] },
  { id: 'disney-a-casa-coruja', slug: 'a-casa-coruja', title: 'A Casa Coruja', altTitles: ['the owl house'], type: 'series', streaming: 'disney', matchHints: ['casa', 'coruja', 'owl', 'house'] },
  { id: 'disney-what-if', slug: 'what-if', title: 'What If...?', altTitles: ['what if marvel'], type: 'series', streaming: 'disney', matchHints: ['what', 'if'] },
  { id: 'disney-bluey', slug: 'bluey', title: 'Bluey', altTitles: [], type: 'series', streaming: 'disney', matchHints: ['bluey'] },
  // ── MISTÉRIO ────────────────────────────────────────────
  { id: 'disney-castle', slug: 'castle', title: 'Castle', altTitles: [], type: 'series', streaming: 'disney', matchHints: ['castle'] },
  { id: 'disney-white-collar', slug: 'white-collar', title: 'White Collar', altTitles: ['colarinho branco'], type: 'series', streaming: 'disney', matchHints: ['white', 'collar'] },
  { id: 'disney-bones', slug: 'bones', title: 'Bones', altTitles: ['bones investigadora'], type: 'series', streaming: 'disney', matchHints: ['bones'] },
  // ── MUSICAL ─────────────────────────────────────────────
  { id: 'disney-high-school-musical-serie', slug: 'high-school-musical-serie', title: 'High School Musical: A Série', altTitles: ['high school musical the musical the series', 'hsmtmts'], type: 'series', streaming: 'disney', matchHints: ['high', 'school', 'musical'] },
  // ── DOCUMENTÁRIO ────────────────────────────────────────
  { id: 'disney-bem-vindos-ao-wrexham', slug: 'bem-vindos-ao-wrexham', title: 'Bem-Vindos ao Wrexham', altTitles: ['welcome to wrexham'], type: 'series', streaming: 'disney', matchHints: ['wrexham', 'bem', 'vindos'] },
  { id: 'disney-o-mundo-segundo-jeff-goldblum', slug: 'o-mundo-segundo-jeff-goldblum', title: 'O Mundo Segundo Jeff Goldblum', altTitles: ['the world according to jeff goldblum'], type: 'series', streaming: 'disney', matchHints: ['jeff', 'goldblum'] },
  // ── INFANTIL ────────────────────────────────────────────
  { id: 'disney-hannah-montana', slug: 'hannah-montana', title: 'Hannah Montana', altTitles: [], type: 'series', streaming: 'disney', matchHints: ['hannah', 'montana'] },
  { id: 'disney-os-feiticeiros-de-waverly', slug: 'os-feiticeiros-de-waverly', title: 'Os Feiticeiros de Waverly Place', altTitles: ['wizards of waverly place'], type: 'series', streaming: 'disney', matchHints: ['feiticeiros', 'waverly'] },
  { id: 'disney-ducktales', slug: 'ducktales', title: 'DuckTales', altTitles: ['patoaventuras'], type: 'series', streaming: 'disney', matchHints: ['ducktales', 'patoaventuras'] },
]

const content = fs.readFileSync('./src/data/catalog.ts', 'utf8')
const insertPoint = content.lastIndexOf(']')
const newEntries = newTitles.map(t => `  ${JSON.stringify(t)}`).join(',\n')
const newContent = content.slice(0, insertPoint) + ',\n' + newEntries + '\n' + content.slice(insertPoint)
fs.writeFileSync('./src/data/catalog.ts', newContent)
console.log(`✅ Adicionadas ${newTitles.length} séries Disney+`)
console.log(`Total no arquivo: ${(newContent.match(/"id":/g) || []).length} títulos`)
