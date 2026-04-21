// Script: adiciona títulos Amazon ao catalog.ts
import fs from 'fs'

const newTitles = [
  // ══ FILMES AMAZON ══════════════════════════════════════
  // ── AÇÃO ────────────────────────────────────────────────
  { id: 'amazon-a-guerra-do-amanha', slug: 'a-guerra-do-amanha', title: 'A Guerra do Amanhã', altTitles: ['the tomorrow war'], type: 'movie', streaming: 'amazon', matchHints: ['guerra', 'amanha'] },
  { id: 'amazon-sem-remorso', slug: 'sem-remorso', title: 'Sem Remorso', altTitles: ['without remorse'], type: 'movie', streaming: 'amazon', matchHints: ['sem', 'remorso'] },
  { id: 'amazon-beekeeper', slug: 'beekeeper', title: 'Beekeeper', altTitles: ['o apicultor'], type: 'movie', streaming: 'amazon', matchHints: ['beekeeper', 'apicultor'] },
  { id: 'amazon-john-wick-4', slug: 'john-wick-4', title: 'John Wick 4', altTitles: ['john wick chapter 4'], type: 'movie', streaming: 'amazon', matchHints: ['john', 'wick', '4'] },
  { id: 'amazon-operacao-fortune', slug: 'operacao-fortune', title: 'Operação Fortune', altTitles: ['operation fortune'], type: 'movie', streaming: 'amazon', matchHints: ['operacao', 'fortune'] },
  { id: 'amazon-samaritano', slug: 'samaritano', title: 'Samaritano', altTitles: ['samaritan'], type: 'movie', streaming: 'amazon', matchHints: ['samaritano', 'samaritan'] },
  { id: 'amazon-jolt', slug: 'jolt', title: 'Jolt', altTitles: [], type: 'movie', streaming: 'amazon', matchHints: ['jolt'] },
  { id: 'amazon-top-gun-maverick', slug: 'top-gun-maverick', title: 'Top Gun: Maverick', altTitles: ['top gun 2'], type: 'movie', streaming: 'amazon', matchHints: ['top', 'gun', 'maverick'] },
  { id: 'amazon-trem-bala', slug: 'trem-bala', title: 'Trem-Bala', altTitles: ['bullet train'], type: 'movie', streaming: 'amazon', matchHints: ['trem', 'bala', 'bullet', 'train'] },
  { id: 'amazon-o-protetor-3', slug: 'o-protetor-3', title: 'O Protetor 3', altTitles: ['the equalizer 3'], type: 'movie', streaming: 'amazon', matchHints: ['protetor', 'equalizer', '3'] },
  // ── AVENTURA ────────────────────────────────────────────
  { id: 'amazon-dungeons-dragons', slug: 'dungeons-dragons', title: 'Dungeons & Dragons', altTitles: ['dungeons and dragons'], type: 'movie', streaming: 'amazon', matchHints: ['dungeons', 'dragons'] },
  { id: 'amazon-jumanji', slug: 'jumanji', title: 'Jumanji: Bem-Vindo à Selva', altTitles: ['jumanji welcome to the jungle'], type: 'movie', streaming: 'amazon', matchHints: ['jumanji'] },
  { id: 'amazon-uncharted', slug: 'uncharted', title: 'Uncharted: Fora do Mapa', altTitles: ['uncharted'], type: 'movie', streaming: 'amazon', matchHints: ['uncharted'] },
  { id: 'amazon-tudo-em-todo-lugar', slug: 'tudo-em-todo-lugar', title: 'Tudo em Todo o Lugar ao Mesmo Tempo', altTitles: ['everything everywhere all at once'], type: 'movie', streaming: 'amazon', matchHints: ['tudo', 'todo', 'lugar'] },
  // ── COMÉDIA ─────────────────────────────────────────────
  { id: 'amazon-borat-2', slug: 'borat-2', title: 'Borat 2', altTitles: ['borat subsequent moviefilm'], type: 'movie', streaming: 'amazon', matchHints: ['borat', '2'] },
  { id: 'amazon-um-principe-em-nova-york-2', slug: 'um-principe-em-nova-york-2', title: 'Um Príncipe em Nova York 2', altTitles: ['coming 2 america'], type: 'movie', streaming: 'amazon', matchHints: ['principe', 'nova', 'york', '2'] },
  { id: 'amazon-palm-springs', slug: 'palm-springs', title: 'Palm Springs', altTitles: [], type: 'movie', streaming: 'amazon', matchHints: ['palm', 'springs'] },
  // ── DRAMA ───────────────────────────────────────────────
  { id: 'amazon-manchester-a-beira-mar', slug: 'manchester-a-beira-mar', title: 'Manchester à Beira-Mar', altTitles: ['manchester by the sea'], type: 'movie', streaming: 'amazon', matchHints: ['manchester', 'beira', 'mar'] },
  { id: 'amazon-oppenheimer', slug: 'oppenheimer', title: 'Oppenheimer', altTitles: [], type: 'movie', streaming: 'amazon', matchHints: ['oppenheimer'] },
  { id: 'amazon-sound-of-metal', slug: 'sound-of-metal', title: 'Sound of Metal', altTitles: ['som do metal'], type: 'movie', streaming: 'amazon', matchHints: ['sound', 'metal'] },
  { id: 'amazon-past-lives', slug: 'past-lives', title: 'Past Lives', altTitles: ['vidas passadas'], type: 'movie', streaming: 'amazon', matchHints: ['past', 'lives'] },
  // ── FICÇÃO CIENTÍFICA ───────────────────────────────────
  { id: 'amazon-a-chegada', slug: 'a-chegada', title: 'A Chegada', altTitles: ['arrival'], type: 'movie', streaming: 'amazon', matchHints: ['chegada', 'arrival'] },
  { id: 'amazon-interestelar', slug: 'interestelar', title: 'Interestelar', altTitles: ['interstellar'], type: 'movie', streaming: 'amazon', matchHints: ['interestelar', 'interstellar'] },
  { id: 'amazon-duna', slug: 'duna', title: 'Duna', altTitles: ['dune'], type: 'movie', streaming: 'amazon', matchHints: ['duna', 'dune'] },
  { id: 'amazon-blade-runner-2049', slug: 'blade-runner-2049', title: 'Blade Runner 2049', altTitles: [], type: 'movie', streaming: 'amazon', matchHints: ['blade', 'runner', '2049'] },
  { id: 'amazon-district-9', slug: 'district-9', title: 'District 9', altTitles: ['distrito 9'], type: 'movie', streaming: 'amazon', matchHints: ['district', '9'] },
  // ── FANTASIA ────────────────────────────────────────────
  { id: 'amazon-a-lenda-do-cavaleiro-verde', slug: 'a-lenda-do-cavaleiro-verde', title: 'A Lenda do Cavaleiro Verde', altTitles: ['the green knight'], type: 'movie', streaming: 'amazon', matchHints: ['cavaleiro', 'verde', 'green', 'knight'] },
  { id: 'amazon-o-labirinto-do-fauno', slug: 'o-labirinto-do-fauno', title: 'O Labirinto do Fauno', altTitles: ["pan's labyrinth"], type: 'movie', streaming: 'amazon', matchHints: ['labirinto', 'fauno'] },
  // ── TERROR ──────────────────────────────────────────────
  { id: 'amazon-hereditario', slug: 'hereditario', title: 'Hereditário', altTitles: ['hereditary'], type: 'movie', streaming: 'amazon', matchHints: ['hereditario', 'hereditary'] },
  { id: 'amazon-midsommar', slug: 'midsommar', title: 'Midsommar', altTitles: ['midsommar o mal nao tem estacao'], type: 'movie', streaming: 'amazon', matchHints: ['midsommar'] },
  { id: 'amazon-fale-comigo', slug: 'fale-comigo', title: 'Fale Comigo', altTitles: ['talk to me'], type: 'movie', streaming: 'amazon', matchHints: ['fale', 'comigo', 'talk', 'to', 'me'] },
  { id: 'amazon-sorria', slug: 'sorria', title: 'Sorria', altTitles: ['smile'], type: 'movie', streaming: 'amazon', matchHints: ['sorria', 'smile'] },
  { id: 'amazon-a-bruxa', slug: 'a-bruxa', title: 'A Bruxa', altTitles: ['the witch', 'the vvitch'], type: 'movie', streaming: 'amazon', matchHints: ['bruxa', 'witch'] },
  // ── THRILLER ────────────────────────────────────────────
  { id: 'amazon-saltburn', slug: 'saltburn', title: 'Saltburn', altTitles: [], type: 'movie', streaming: 'amazon', matchHints: ['saltburn'] },
  { id: 'amazon-garota-exemplar', slug: 'garota-exemplar', title: 'Garota Exemplar', altTitles: ['gone girl'], type: 'movie', streaming: 'amazon', matchHints: ['garota', 'exemplar', 'gone', 'girl'] },
  { id: 'amazon-anatomy-of-a-fall', slug: 'anatomy-of-a-fall', title: 'Anatomy of a Fall', altTitles: ['anatomia de uma queda'], type: 'movie', streaming: 'amazon', matchHints: ['anatomy', 'fall'] },
  // ── ROMANCE ─────────────────────────────────────────────
  { id: 'amazon-vermelho-branco-azul', slug: 'vermelho-branco-azul', title: 'Vermelho Branco e Sangue Azul', altTitles: ['red white and royal blue'], type: 'movie', streaming: 'amazon', matchHints: ['vermelho', 'branco', 'azul'] },
  { id: 'amazon-uma-ideia-de-voce', slug: 'uma-ideia-de-voce', title: 'Uma Ideia de Você', altTitles: ['the idea of you'], type: 'movie', streaming: 'amazon', matchHints: ['ideia', 'voce'] },
  // ── ANIMAÇÃO ────────────────────────────────────────────
  { id: 'amazon-homem-aranha-aranhaverso', slug: 'homem-aranha-aranhaverso', title: 'Homem-Aranha no Aranhaverso', altTitles: ['spider-man into the spider-verse', 'spider man spider verse'], type: 'movie', streaming: 'amazon', matchHints: ['homem', 'aranha', 'aranhaverso', 'spider', 'verse'] },
  { id: 'amazon-shrek', slug: 'shrek', title: 'Shrek', altTitles: [], type: 'movie', streaming: 'amazon', matchHints: ['shrek'] },
  { id: 'amazon-gato-de-botas-2', slug: 'gato-de-botas-2', title: 'Gato de Botas 2', altTitles: ['puss in boots the last wish'], type: 'movie', streaming: 'amazon', matchHints: ['gato', 'botas', '2'] },
  // ── DOCUMENTÁRIO ────────────────────────────────────────
  { id: 'amazon-good-night-oppy', slug: 'good-night-oppy', title: 'Good Night Oppy', altTitles: [], type: 'movie', streaming: 'amazon', matchHints: ['good', 'night', 'oppy'] },

  // ══ SÉRIES AMAZON ══════════════════════════════════════
  // ── AÇÃO ────────────────────────────────────────────────
  { id: 'amazon-the-boys', slug: 'the-boys', title: 'The Boys', altTitles: ['os rapazes'], type: 'series', streaming: 'amazon', matchHints: ['boys'] },
  { id: 'amazon-reacher', slug: 'reacher', title: 'Reacher', altTitles: [], type: 'series', streaming: 'amazon', matchHints: ['reacher'] },
  { id: 'amazon-jack-ryan', slug: 'jack-ryan', title: 'Jack Ryan', altTitles: ['tom clancy jack ryan'], type: 'series', streaming: 'amazon', matchHints: ['jack', 'ryan'] },
  { id: 'amazon-citadel', slug: 'citadel', title: 'Citadel', altTitles: [], type: 'series', streaming: 'amazon', matchHints: ['citadel'] },
  { id: 'amazon-hanna', slug: 'hanna', title: 'Hanna', altTitles: [], type: 'series', streaming: 'amazon', matchHints: ['hanna'] },
  { id: 'amazon-fallout', slug: 'fallout', title: 'Fallout', altTitles: [], type: 'series', streaming: 'amazon', matchHints: ['fallout'] },
  { id: 'amazon-invencivel', slug: 'invencivel', title: 'Invencível', altTitles: ['invincible'], type: 'series', streaming: 'amazon', matchHints: ['invencivel', 'invincible'] },
  // ── AVENTURA ────────────────────────────────────────────
  { id: 'amazon-a-roda-do-tempo', slug: 'a-roda-do-tempo', title: 'A Roda do Tempo', altTitles: ['wheel of time'], type: 'series', streaming: 'amazon', matchHints: ['roda', 'tempo', 'wheel', 'time'] },
  { id: 'amazon-good-omens', slug: 'good-omens', title: 'Good Omens', altTitles: ['bons presagios'], type: 'series', streaming: 'amazon', matchHints: ['good', 'omens'] },
  { id: 'amazon-aneis-de-poder', slug: 'aneis-de-poder', title: 'O Senhor dos Anéis: Os Anéis de Poder', altTitles: ['rings of power', 'lord of the rings rings of power'], type: 'series', streaming: 'amazon', matchHints: ['aneis', 'poder', 'rings', 'power'] },
  { id: 'amazon-black-sails', slug: 'black-sails', title: 'Black Sails', altTitles: [], type: 'series', streaming: 'amazon', matchHints: ['black', 'sails'] },
  // ── COMÉDIA ─────────────────────────────────────────────
  { id: 'amazon-the-office', slug: 'the-office', title: 'The Office', altTitles: ['office us'], type: 'series', streaming: 'amazon', matchHints: ['office'] },
  { id: 'amazon-fleabag', slug: 'fleabag', title: 'Fleabag', altTitles: [], type: 'series', streaming: 'amazon', matchHints: ['fleabag'] },
  { id: 'amazon-mrs-maisel', slug: 'mrs-maisel', title: 'The Marvelous Mrs. Maisel', altTitles: ['maravilhosa sra maisel'], type: 'series', streaming: 'amazon', matchHints: ['maisel', 'marvelous'] },
  { id: 'amazon-parks-recreation', slug: 'parks-recreation', title: 'Parks and Recreation', altTitles: ['parks rec'], type: 'series', streaming: 'amazon', matchHints: ['parks', 'recreation'] },
  // ── DRAMA ───────────────────────────────────────────────
  { id: 'amazon-this-is-us', slug: 'this-is-us', title: 'This Is Us', altTitles: [], type: 'series', streaming: 'amazon', matchHints: ['this', 'is', 'us'] },
  { id: 'amazon-the-handmaids-tale', slug: 'the-handmaids-tale', title: "The Handmaid's Tale", altTitles: ['conto da aia'], type: 'series', streaming: 'amazon', matchHints: ['handmaid', 'tale'] },
  { id: 'amazon-mr-robot', slug: 'mr-robot', title: 'Mr. Robot', altTitles: [], type: 'series', streaming: 'amazon', matchHints: ['mr', 'robot'] },
  { id: 'amazon-bosch', slug: 'bosch', title: 'Bosch', altTitles: [], type: 'series', streaming: 'amazon', matchHints: ['bosch'] },
  // ── FICÇÃO CIENTÍFICA ───────────────────────────────────
  { id: 'amazon-the-expanse', slug: 'the-expanse', title: 'The Expanse', altTitles: ['expanse'], type: 'series', streaming: 'amazon', matchHints: ['expanse'] },
  { id: 'amazon-perifericos', slug: 'perifericos', title: 'Periféricos', altTitles: ['the peripheral'], type: 'series', streaming: 'amazon', matchHints: ['perifericos', 'peripheral'] },
  { id: 'amazon-upload', slug: 'upload', title: 'Upload', altTitles: [], type: 'series', streaming: 'amazon', matchHints: ['upload'] },
  // ── FANTASIA ────────────────────────────────────────────
  { id: 'amazon-american-gods', slug: 'american-gods', title: 'American Gods', altTitles: ['deuses americanos'], type: 'series', streaming: 'amazon', matchHints: ['american', 'gods'] },
  { id: 'amazon-carnival-row', slug: 'carnival-row', title: 'Carnival Row', altTitles: [], type: 'series', streaming: 'amazon', matchHints: ['carnival', 'row'] },
  { id: 'amazon-as-bruxas-de-mayfair', slug: 'as-bruxas-de-mayfair', title: 'As Bruxas de Mayfair', altTitles: ['mayfair witches'], type: 'series', streaming: 'amazon', matchHints: ['bruxas', 'mayfair'] },
  { id: 'amazon-entrevista-com-vampiro', slug: 'entrevista-com-vampiro', title: 'Entrevista com o Vampiro', altTitles: ['interview with the vampire'], type: 'series', streaming: 'amazon', matchHints: ['entrevista', 'vampiro'] },
  // ── TERROR ──────────────────────────────────────────────
  { id: 'amazon-them', slug: 'them', title: 'Them', altTitles: [], type: 'series', streaming: 'amazon', matchHints: ['them'] },
  { id: 'amazon-the-terror', slug: 'the-terror', title: 'The Terror', altTitles: ['terror'], type: 'series', streaming: 'amazon', matchHints: ['terror'] },
  // ── THRILLER ────────────────────────────────────────────
  { id: 'amazon-homecoming', slug: 'homecoming', title: 'Homecoming', altTitles: [], type: 'series', streaming: 'amazon', matchHints: ['homecoming'] },
  { id: 'amazon-fargo', slug: 'fargo', title: 'Fargo', altTitles: [], type: 'series', streaming: 'amazon', matchHints: ['fargo'] },
  { id: 'amazon-goliath', slug: 'goliath', title: 'Goliath', altTitles: [], type: 'series', streaming: 'amazon', matchHints: ['goliath'] },
  // ── ROMANCE ─────────────────────────────────────────────
  { id: 'amazon-modern-love', slug: 'modern-love', title: 'Modern Love', altTitles: [], type: 'series', streaming: 'amazon', matchHints: ['modern', 'love'] },
  { id: 'amazon-the-summer-i-turned-pretty', slug: 'the-summer-i-turned-pretty', title: 'The Summer I Turned Pretty', altTitles: ['o verao que mudou minha vida'], type: 'series', streaming: 'amazon', matchHints: ['summer', 'turned', 'pretty'] },
  // ── ANIMAÇÃO ────────────────────────────────────────────
  { id: 'amazon-a-lenda-de-vox-machina', slug: 'a-lenda-de-vox-machina', title: 'A Lenda de Vox Machina', altTitles: ['legend of vox machina'], type: 'series', streaming: 'amazon', matchHints: ['vox', 'machina'] },
  { id: 'amazon-hazbin-hotel', slug: 'hazbin-hotel', title: 'Hazbin Hotel', altTitles: [], type: 'series', streaming: 'amazon', matchHints: ['hazbin', 'hotel'] },
  // ── MISTÉRIO ────────────────────────────────────────────
  { id: 'amazon-dexter', slug: 'dexter', title: 'Dexter', altTitles: [], type: 'series', streaming: 'amazon', matchHints: ['dexter'] },
  { id: 'amazon-o-consultor', slug: 'o-consultor', title: 'O Consultor', altTitles: ['the consultant'], type: 'series', streaming: 'amazon', matchHints: ['consultor', 'consultant'] },
  // ── DOCUMENTÁRIO ────────────────────────────────────────
  { id: 'amazon-all-or-nothing', slug: 'all-or-nothing', title: 'All or Nothing', altTitles: ['tudo ou nada'], type: 'series', streaming: 'amazon', matchHints: ['all', 'nothing', 'tudo', 'nada'] },
  { id: 'amazon-clarksons-farm', slug: 'clarksons-farm', title: "Clarkson's Farm", altTitles: ['fazenda clarkson'], type: 'series', streaming: 'amazon', matchHints: ['clarkson', 'farm'] },
]

const content = fs.readFileSync('./src/data/catalog.ts', 'utf8')
const insertPoint = content.lastIndexOf(']')
const newEntries = newTitles.map(t => `  ${JSON.stringify(t)}`).join(',\n')
const newContent = content.slice(0, insertPoint) + ',\n' + newEntries + '\n' + content.slice(insertPoint)
fs.writeFileSync('./src/data/catalog.ts', newContent)
console.log(`✅ Adicionados ${newTitles.length} títulos Amazon`)
console.log(`Total no arquivo: ${(newContent.match(/"id":/g) || []).length} títulos`)
