// Script: adiciona títulos Netflix ao catalog.ts
// Roda com: node add-catalog-netflix.mjs

import fs from 'fs'

const newTitles = [
  // ── AÇÃO ────────────────────────────────────────────────
  { id: 'netflix-alerta-vermelho', slug: 'alerta-vermelho', title: 'Alerta Vermelho', altTitles: ['red notice'], type: 'movie', streaming: 'netflix', matchHints: ['alerta', 'vermelho'] },
  { id: 'netflix-a-mae', slug: 'a-mae', title: 'A Mãe', altTitles: ['the mother'], type: 'movie', streaming: 'netflix', matchHints: ['mae', 'mother'] },
  { id: 'netflix-esquadrao-6', slug: 'esquadrao-6', title: 'Esquadrão 6', altTitles: ['the union', '6 underground'], type: 'movie', streaming: 'netflix', matchHints: ['esquadrao', '6'] },
  { id: 'netflix-the-old-guard', slug: 'the-old-guard', title: 'The Old Guard', altTitles: ['old guard'], type: 'movie', streaming: 'netflix', matchHints: ['old', 'guard'] },
  { id: 'netflix-kate', slug: 'kate', title: 'Kate', altTitles: [], type: 'movie', streaming: 'netflix', matchHints: ['kate'] },
  { id: 'netflix-lift', slug: 'lift', title: 'Lift: Roubo nas Alturas', altTitles: ['lift'], type: 'movie', streaming: 'netflix', matchHints: ['lift', 'roubo'] },
  { id: 'netflix-o-homem-de-toronto', slug: 'o-homem-de-toronto', title: 'O Homem de Toronto', altTitles: ['the man from toronto'], type: 'movie', streaming: 'netflix', matchHints: ['toronto'] },
  { id: 'netflix-triple-frontier', slug: 'triple-frontier', title: 'Triple Frontier', altTitles: ['fronteira tripla'], type: 'movie', streaming: 'netflix', matchHints: ['triple', 'frontier'] },
  { id: 'netflix-black-crab', slug: 'black-crab', title: 'Black Crab', altTitles: [], type: 'movie', streaming: 'netflix', matchHints: ['black', 'crab'] },
  { id: 'netflix-point-blank', slug: 'point-blank', title: 'Point Blank', altTitles: ['ponto cego'], type: 'movie', streaming: 'netflix', matchHints: ['point', 'blank'] },
  // ── AVENTURA ────────────────────────────────────────────
  { id: 'netflix-enola-holmes', slug: 'enola-holmes', title: 'Enola Holmes', altTitles: [], type: 'movie', streaming: 'netflix', matchHints: ['enola', 'holmes'] },
  { id: 'netflix-enola-holmes-2', slug: 'enola-holmes-2', title: 'Enola Holmes 2', altTitles: [], type: 'movie', streaming: 'netflix', matchHints: ['enola', 'holmes', '2'] },
  { id: 'netflix-o-projeto-adam', slug: 'o-projeto-adam', title: 'O Projeto Adam', altTitles: ['the adam project'], type: 'movie', streaming: 'netflix', matchHints: ['projeto', 'adam'] },
  { id: 'netflix-a-fera-do-mar', slug: 'a-fera-do-mar', title: 'A Fera do Mar', altTitles: ['the sea beast'], type: 'movie', streaming: 'netflix', matchHints: ['fera', 'mar'] },
  { id: 'netflix-bright', slug: 'bright', title: 'Bright', altTitles: [], type: 'movie', streaming: 'netflix', matchHints: ['bright'] },
  // ── COMÉDIA ─────────────────────────────────────────────
  { id: 'netflix-misterio-mediterraneo', slug: 'misterio-mediterraneo', title: 'Mistério no Mediterrâneo', altTitles: ['murder mystery', 'murder mystery 2'], type: 'movie', streaming: 'netflix', matchHints: ['misterio', 'mediterraneo'] },
  { id: 'netflix-nao-olhe-para-cima', slug: 'nao-olhe-para-cima', title: 'Não Olhe Para Cima', altTitles: ["don't look up"], type: 'movie', streaming: 'netflix', matchHints: ['nao', 'olhe', 'cima'] },
  { id: 'netflix-glass-onion', slug: 'glass-onion', title: 'Glass Onion', altTitles: ['glass onion knives out'], type: 'movie', streaming: 'netflix', matchHints: ['glass', 'onion'] },
  // ── DRAMA ───────────────────────────────────────────────
  { id: 'netflix-a-sociedade-da-neve', slug: 'a-sociedade-da-neve', title: 'A Sociedade da Neve', altTitles: ['society of the snow'], type: 'movie', streaming: 'netflix', matchHints: ['sociedade', 'neve'] },
  { id: 'netflix-historia-de-um-casamento', slug: 'historia-de-um-casamento', title: 'História de um Casamento', altTitles: ['marriage story'], type: 'movie', streaming: 'netflix', matchHints: ['casamento'] },
  { id: 'netflix-o-irlandes', slug: 'o-irlandes', title: 'O Irlandês', altTitles: ['the irishman'], type: 'movie', streaming: 'netflix', matchHints: ['irlandes', 'irishman'] },
  { id: 'netflix-roma', slug: 'roma', title: 'Roma', altTitles: [], type: 'movie', streaming: 'netflix', matchHints: ['roma'] },
  { id: 'netflix-os-sete-de-chicago', slug: 'os-sete-de-chicago', title: 'Os Sete de Chicago', altTitles: ['the trial of the chicago 7'], type: 'movie', streaming: 'netflix', matchHints: ['sete', 'chicago'] },
  // ── FICÇÃO CIENTÍFICA ───────────────────────────────────
  { id: 'netflix-rebel-moon-1', slug: 'rebel-moon-1', title: 'Rebel Moon - Parte 1', altTitles: ['rebel moon'], type: 'movie', streaming: 'netflix', matchHints: ['rebel', 'moon'] },
  { id: 'netflix-rebel-moon-2', slug: 'rebel-moon-2', title: 'Rebel Moon - Parte 2', altTitles: ['rebel moon part 2'], type: 'movie', streaming: 'netflix', matchHints: ['rebel', 'moon', '2'] },
  { id: 'netflix-aniquilacao', slug: 'aniquilacao', title: 'Aniquilação', altTitles: ['annihilation'], type: 'movie', streaming: 'netflix', matchHints: ['aniquilacao', 'annihilation'] },
  { id: 'netflix-bird-box', slug: 'bird-box', title: 'Bird Box', altTitles: ['caixa de pássaros'], type: 'movie', streaming: 'netflix', matchHints: ['bird', 'box'] },
  // ── FANTASIA ────────────────────────────────────────────
  { id: 'netflix-a-escola-do-bem-e-do-mal', slug: 'a-escola-do-bem-e-do-mal', title: 'A Escola do Bem e do Mal', altTitles: ['the school for good and evil'], type: 'movie', streaming: 'netflix', matchHints: ['escola', 'bem', 'mal'] },
  { id: 'netflix-damsel', slug: 'damsel', title: 'Damsel', altTitles: ['donzela'], type: 'movie', streaming: 'netflix', matchHints: ['damsel', 'donzela'] },
  // ── TERROR ──────────────────────────────────────────────
  { id: 'netflix-rua-do-medo-1', slug: 'rua-do-medo-1', title: 'Rua do Medo - Parte 1', altTitles: ['fear street part 1'], type: 'movie', streaming: 'netflix', matchHints: ['rua', 'medo'] },
  { id: 'netflix-o-ritual', slug: 'o-ritual', title: 'O Ritual', altTitles: ['the ritual'], type: 'movie', streaming: 'netflix', matchHints: ['ritual'] },
  // ── THRILLER ────────────────────────────────────────────
  { id: 'netflix-o-mundo-depois-de-nos', slug: 'o-mundo-depois-de-nos', title: 'O Mundo Depois de Nós', altTitles: ['leave the world behind'], type: 'movie', streaming: 'netflix', matchHints: ['mundo', 'depois'] },
  { id: 'netflix-the-killer', slug: 'the-killer', title: 'The Killer', altTitles: ['o assassino'], type: 'movie', streaming: 'netflix', matchHints: ['killer', 'assassino'] },
  { id: 'netflix-fair-play', slug: 'fair-play', title: 'Fair Play', altTitles: [], type: 'movie', streaming: 'netflix', matchHints: ['fair', 'play'] },
  // ── ROMANCE ─────────────────────────────────────────────
  { id: 'netflix-para-todos-os-garotos', slug: 'para-todos-os-garotos', title: 'Para Todos os Garotos que Já Amei', altTitles: ['to all the boys'], type: 'movie', streaming: 'netflix', matchHints: ['garotos', 'amei'] },
  { id: 'netflix-amor-a-primeira-vista', slug: 'amor-a-primeira-vista', title: 'Amor à Primeira Vista', altTitles: ['love at first sight'], type: 'movie', streaming: 'netflix', matchHints: ['amor', 'primeira', 'vista'] },
  // ── ANIMAÇÃO ────────────────────────────────────────────
  { id: 'netflix-pinoquio-del-toro', slug: 'pinoquio-del-toro', title: 'Pinóquio', altTitles: ['pinocchio del toro', "guillermo del toro's pinocchio"], type: 'movie', streaming: 'netflix', matchHints: ['pinoquio', 'pinocchio'] },
  { id: 'netflix-klaus', slug: 'klaus', title: 'Klaus', altTitles: [], type: 'movie', streaming: 'netflix', matchHints: ['klaus'] },
  { id: 'netflix-a-familia-mitchell', slug: 'a-familia-mitchell', title: 'A Família Mitchell', altTitles: ['the mitchells vs the machines'], type: 'movie', streaming: 'netflix', matchHints: ['familia', 'mitchell'] },
  { id: 'netflix-nimona', slug: 'nimona', title: 'Nimona', altTitles: [], type: 'movie', streaming: 'netflix', matchHints: ['nimona'] },
  // ── INFANTIL ────────────────────────────────────────────
  { id: 'netflix-matilda-musical', slug: 'matilda-musical', title: 'Matilda: O Musical', altTitles: ['matilda the musical'], type: 'movie', streaming: 'netflix', matchHints: ['matilda', 'musical'] },
  // ── DOCUMENTÁRIO ────────────────────────────────────────
  { id: 'netflix-o-golpista-do-tinder', slug: 'o-golpista-do-tinder', title: 'O Golpista do Tinder', altTitles: ['the tinder swindler'], type: 'movie', streaming: 'netflix', matchHints: ['golpista', 'tinder'] },
  { id: 'netflix-o-dilema-das-redes', slug: 'o-dilema-das-redes', title: 'O Dilema das Redes', altTitles: ['the social dilemma'], type: 'movie', streaming: 'netflix', matchHints: ['dilema', 'redes'] },

  // ══ SÉRIES NETFLIX ══════════════════════════════════════
  // ── AÇÃO ────────────────────────────────────────────────
  { id: 'netflix-o-agente-noturno', slug: 'o-agente-noturno', title: 'O Agente Noturno', altTitles: ['night agent'], type: 'series', streaming: 'netflix', matchHints: ['agente', 'noturno'] },
  { id: 'netflix-cobra-kai', slug: 'cobra-kai', title: 'Cobra Kai', altTitles: [], type: 'series', streaming: 'netflix', matchHints: ['cobra', 'kai'] },
  { id: 'netflix-swat', slug: 'swat', title: 'S.W.A.T.', altTitles: ['swat'], type: 'series', streaming: 'netflix', matchHints: ['swat'] },
  { id: 'netflix-fubar', slug: 'fubar', title: 'FUBAR', altTitles: [], type: 'series', streaming: 'netflix', matchHints: ['fubar'] },
  { id: 'netflix-o-justiceiro', slug: 'o-justiceiro', title: 'O Justiceiro', altTitles: ['the punisher', 'punisher'], type: 'series', streaming: 'netflix', matchHints: ['justiceiro', 'punisher'] },
  { id: 'netflix-demolidor', slug: 'demolidor', title: 'Demolidor', altTitles: ['daredevil'], type: 'series', streaming: 'netflix', matchHints: ['demolidor', 'daredevil'] },
  { id: 'netflix-the-last-kingdom', slug: 'the-last-kingdom', title: 'The Last Kingdom', altTitles: ['ultimo reino'], type: 'series', streaming: 'netflix', matchHints: ['last', 'kingdom'] },
  { id: 'netflix-lupin', slug: 'lupin', title: 'Lupin', altTitles: [], type: 'series', streaming: 'netflix', matchHints: ['lupin'] },
  // ── AVENTURA ────────────────────────────────────────────
  { id: 'netflix-one-piece', slug: 'one-piece', title: 'One Piece', altTitles: [], type: 'series', streaming: 'netflix', matchHints: ['one', 'piece'] },
  { id: 'netflix-avatar-ultimo-mestre', slug: 'avatar-ultimo-mestre', title: 'Avatar: O Último Mestre do Ar', altTitles: ['avatar the last airbender'], type: 'series', streaming: 'netflix', matchHints: ['avatar', 'airbender'] },
  { id: 'netflix-stranger-things', slug: 'stranger-things', title: 'Stranger Things', altTitles: [], type: 'series', streaming: 'netflix', matchHints: ['stranger', 'things'] },
  { id: 'netflix-the-witcher', slug: 'the-witcher', title: 'The Witcher', altTitles: ['witcher'], type: 'series', streaming: 'netflix', matchHints: ['witcher'] },
  { id: 'netflix-outer-banks', slug: 'outer-banks', title: 'Outer Banks', altTitles: [], type: 'series', streaming: 'netflix', matchHints: ['outer', 'banks'] },
  // ── COMÉDIA ─────────────────────────────────────────────
  { id: 'netflix-brooklyn-nine-nine', slug: 'brooklyn-nine-nine', title: 'Brooklyn Nine-Nine', altTitles: ['brooklyn 99'], type: 'series', streaming: 'netflix', matchHints: ['brooklyn', 'nine'] },
  { id: 'netflix-sex-education', slug: 'sex-education', title: 'Sex Education', altTitles: [], type: 'series', streaming: 'netflix', matchHints: ['sex', 'education'] },
  { id: 'netflix-the-good-place', slug: 'the-good-place', title: 'The Good Place', altTitles: [], type: 'series', streaming: 'netflix', matchHints: ['good', 'place'] },
  // ── DRAMA ───────────────────────────────────────────────
  { id: 'netflix-the-crown', slug: 'the-crown', title: 'The Crown', altTitles: [], type: 'series', streaming: 'netflix', matchHints: ['crown'] },
  { id: 'netflix-ozark', slug: 'ozark', title: 'Ozark', altTitles: [], type: 'series', streaming: 'netflix', matchHints: ['ozark'] },
  { id: 'netflix-bridgerton', slug: 'bridgerton', title: 'Bridgerton', altTitles: [], type: 'series', streaming: 'netflix', matchHints: ['bridgerton'] },
  { id: 'netflix-narcos', slug: 'narcos', title: 'Narcos', altTitles: [], type: 'series', streaming: 'netflix', matchHints: ['narcos'] },
  { id: 'netflix-peaky-blinders', slug: 'peaky-blinders', title: 'Peaky Blinders', altTitles: [], type: 'series', streaming: 'netflix', matchHints: ['peaky', 'blinders'] },
  { id: 'netflix-black-mirror', slug: 'black-mirror', title: 'Black Mirror', altTitles: [], type: 'series', streaming: 'netflix', matchHints: ['black', 'mirror'] },
  { id: 'netflix-o-gambito-da-rainha', slug: 'o-gambito-da-rainha', title: 'O Gambito da Rainha', altTitles: ["queen's gambit"], type: 'series', streaming: 'netflix', matchHints: ['gambito', 'rainha'] },
  // ── FICÇÃO CIENTÍFICA ───────────────────────────────────
  { id: 'netflix-o-problema-dos-3-corpos', slug: 'o-problema-dos-3-corpos', title: 'O Problema dos 3 Corpos', altTitles: ['3 body problem'], type: 'series', streaming: 'netflix', matchHints: ['problema', '3', 'corpos'] },
  { id: 'netflix-dark', slug: 'dark', title: 'Dark', altTitles: [], type: 'series', streaming: 'netflix', matchHints: ['dark'] },
  { id: 'netflix-altered-carbon', slug: 'altered-carbon', title: 'Altered Carbon', altTitles: [], type: 'series', streaming: 'netflix', matchHints: ['altered', 'carbon'] },
  { id: 'netflix-love-death-robots', slug: 'love-death-robots', title: 'Love Death + Robots', altTitles: ['love death and robots'], type: 'series', streaming: 'netflix', matchHints: ['love', 'death', 'robots'] },
  // ── FANTASIA ────────────────────────────────────────────
  { id: 'netflix-the-witcher-serie', slug: 'the-witcher-serie', title: 'The Witcher', altTitles: ['witcher serie'], type: 'series', streaming: 'netflix', matchHints: ['witcher'] },
  { id: 'netflix-sandman', slug: 'sandman', title: 'Sandman', altTitles: ['the sandman'], type: 'series', streaming: 'netflix', matchHints: ['sandman'] },
  { id: 'netflix-lucifer', slug: 'lucifer', title: 'Lúcifer', altTitles: ['lucifer'], type: 'series', streaming: 'netflix', matchHints: ['lucifer'] },
  // ── TERROR ──────────────────────────────────────────────
  { id: 'netflix-a-maldicao-da-residencia-hill', slug: 'a-maldicao-da-residencia-hill', title: 'A Maldição da Residência Hill', altTitles: ['haunting of hill house'], type: 'series', streaming: 'netflix', matchHints: ['maldicao', 'hill', 'house'] },
  { id: 'netflix-missa-maldita', slug: 'missa-maldita', title: 'Missa Maldita', altTitles: ['midnight mass'], type: 'series', streaming: 'netflix', matchHints: ['missa', 'maldita', 'midnight', 'mass'] },
  { id: 'netflix-a-queda-da-casa-de-usher', slug: 'a-queda-da-casa-de-usher', title: 'A Queda da Casa de Usher', altTitles: ['fall of the house of usher'], type: 'series', streaming: 'netflix', matchHints: ['usher', 'queda'] },
  // ── THRILLER ────────────────────────────────────────────
  { id: 'netflix-you', slug: 'you', title: 'You', altTitles: ['voce'], type: 'series', streaming: 'netflix', matchHints: ['you'] },
  { id: 'netflix-mindhunter', slug: 'mindhunter', title: 'Mindhunter', altTitles: [], type: 'series', streaming: 'netflix', matchHints: ['mindhunter'] },
  { id: 'netflix-ripley', slug: 'ripley', title: 'Ripley', altTitles: [], type: 'series', streaming: 'netflix', matchHints: ['ripley'] },
  // ── ROMANCE ─────────────────────────────────────────────
  { id: 'netflix-virgin-river', slug: 'virgin-river', title: 'Virgin River', altTitles: [], type: 'series', streaming: 'netflix', matchHints: ['virgin', 'river'] },
  { id: 'netflix-emily-em-paris', slug: 'emily-em-paris', title: 'Emily em Paris', altTitles: ['emily in paris'], type: 'series', streaming: 'netflix', matchHints: ['emily', 'paris'] },
  // ── ANIMAÇÃO ────────────────────────────────────────────
  { id: 'netflix-arcane', slug: 'arcane', title: 'Arcane', altTitles: [], type: 'series', streaming: 'netflix', matchHints: ['arcane'] },
  { id: 'netflix-cyberpunk-edgerunners', slug: 'cyberpunk-edgerunners', title: 'Cyberpunk: Edgerunners', altTitles: ['cyberpunk edgerunners'], type: 'series', streaming: 'netflix', matchHints: ['cyberpunk', 'edgerunners'] },
  { id: 'netflix-castlevania', slug: 'castlevania', title: 'Castlevania', altTitles: [], type: 'series', streaming: 'netflix', matchHints: ['castlevania'] },
  // ── MISTÉRIO ────────────────────────────────────────────
  { id: 'netflix-la-casa-de-papel', slug: 'la-casa-de-papel', title: 'La Casa de Papel', altTitles: ['money heist', 'casa de papel'], type: 'series', streaming: 'netflix', matchHints: ['casa', 'papel', 'money', 'heist'] },
  { id: 'netflix-round-6', slug: 'round-6', title: 'Round 6', altTitles: ['squid game'], type: 'series', streaming: 'netflix', matchHints: ['round', 'squid', 'game'] },
  { id: 'netflix-alice-in-borderland', slug: 'alice-in-borderland', title: 'Alice in Borderland', altTitles: [], type: 'series', streaming: 'netflix', matchHints: ['alice', 'borderland'] },
]

// Lê o arquivo atual
const content = fs.readFileSync('./src/data/catalog.ts', 'utf8')

// Encontra o fechamento do array
const insertPoint = content.lastIndexOf(']')

// Gera as novas entradas
const newEntries = newTitles.map(t => `  ${JSON.stringify(t)}`).join(',\n')

// Insere antes do fechamento
const newContent = content.slice(0, insertPoint) + ',\n' + newEntries + '\n' + content.slice(insertPoint)

fs.writeFileSync('./src/data/catalog.ts', newContent)

console.log(`✅ Adicionados ${newTitles.length} títulos Netflix`)
console.log(`Total no arquivo: ${(newContent.match(/"id":/g) || []).length} títulos`)
