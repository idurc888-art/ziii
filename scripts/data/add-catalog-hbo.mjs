// Script: adiciona títulos HBO ao catalog.ts
import fs from 'fs'

const newTitles = [
  // ══ FILMES HBO ══════════════════════════════════════
  // ── AÇÃO ────────────────────────────────────────────────
  { id: 'hbo-the-batman', slug: 'the-batman', title: 'The Batman', altTitles: ['batman 2022'], type: 'movie', streaming: 'hbo', matchHints: ['batman'] },
  { id: 'hbo-mad-max-estrada-da-furia', slug: 'mad-max-estrada-da-furia', title: 'Mad Max: Estrada da Fúria', altTitles: ['mad max fury road'], type: 'movie', streaming: 'hbo', matchHints: ['mad', 'max', 'fury', 'road'] },
  { id: 'hbo-batman-cavaleiro-das-trevas', slug: 'batman-cavaleiro-das-trevas', title: 'Batman: O Cavaleiro das Trevas', altTitles: ['the dark knight'], type: 'movie', streaming: 'hbo', matchHints: ['batman', 'cavaleiro', 'trevas', 'dark', 'knight'] },
  { id: 'hbo-mulher-maravilha', slug: 'mulher-maravilha', title: 'Mulher-Maravilha', altTitles: ['wonder woman'], type: 'movie', streaming: 'hbo', matchHints: ['mulher', 'maravilha', 'wonder', 'woman'] },
  { id: 'hbo-matrix', slug: 'matrix', title: 'Matrix', altTitles: ['the matrix'], type: 'movie', streaming: 'hbo', matchHints: ['matrix'] },
  { id: 'hbo-o-esquadrao-suicida', slug: 'o-esquadrao-suicida', title: 'O Esquadrão Suicida', altTitles: ['the suicide squad'], type: 'movie', streaming: 'hbo', matchHints: ['esquadrao', 'suicida', 'suicide', 'squad'] },
  { id: 'hbo-black-adam', slug: 'black-adam', title: 'Black Adam', altTitles: [], type: 'movie', streaming: 'hbo', matchHints: ['black', 'adam'] },
  { id: 'hbo-mortal-kombat-2021', slug: 'mortal-kombat-2021', title: 'Mortal Kombat', altTitles: ['mortal kombat 2021'], type: 'movie', streaming: 'hbo', matchHints: ['mortal', 'kombat'] },
  { id: 'hbo-aquaman', slug: 'aquaman', title: 'Aquaman', altTitles: [], type: 'movie', streaming: 'hbo', matchHints: ['aquaman'] },
  { id: 'hbo-300', slug: '300', title: '300', altTitles: ['trezentos'], type: 'movie', streaming: 'hbo', matchHints: ['300'] },
  { id: 'hbo-man-of-steel', slug: 'man-of-steel', title: 'Man of Steel', altTitles: ['homem de aco'], type: 'movie', streaming: 'hbo', matchHints: ['man', 'steel', 'homem', 'aco'] },
  { id: 'hbo-dunkirk', slug: 'dunkirk', title: 'Dunkirk', altTitles: ['dunquerque'], type: 'movie', streaming: 'hbo', matchHints: ['dunkirk', 'dunquerque'] },
  { id: 'hbo-tenet', slug: 'tenet', title: 'Tenet', altTitles: [], type: 'movie', streaming: 'hbo', matchHints: ['tenet'] },
  { id: 'hbo-godzilla-vs-kong', slug: 'godzilla-vs-kong', title: 'Godzilla vs Kong', altTitles: [], type: 'movie', streaming: 'hbo', matchHints: ['godzilla', 'kong'] },
  // ── AVENTURA ────────────────────────────────────────────
  { id: 'hbo-harry-potter-1', slug: 'harry-potter-1', title: 'Harry Potter e a Pedra Filosofal', altTitles: ['harry potter sorcerers stone', 'harry potter 1'], type: 'movie', streaming: 'hbo', matchHints: ['harry', 'potter'] },
  { id: 'hbo-senhor-dos-aneis-1', slug: 'senhor-dos-aneis-1', title: 'O Senhor dos Anéis: A Sociedade do Anel', altTitles: ['lord of the rings fellowship'], type: 'movie', streaming: 'hbo', matchHints: ['senhor', 'aneis', 'lord', 'rings'] },
  { id: 'hbo-animais-fantasticos', slug: 'animais-fantasticos', title: 'Animais Fantásticos', altTitles: ['fantastic beasts'], type: 'movie', streaming: 'hbo', matchHints: ['animais', 'fantasticos', 'fantastic', 'beasts'] },
  { id: 'hbo-wonka', slug: 'wonka', title: 'Wonka', altTitles: [], type: 'movie', streaming: 'hbo', matchHints: ['wonka'] },
  // ── COMÉDIA ─────────────────────────────────────────────
  { id: 'hbo-se-beber-nao-case', slug: 'se-beber-nao-case', title: 'Se Beber, Não Case!', altTitles: ['the hangover'], type: 'movie', streaming: 'hbo', matchHints: ['beber', 'case', 'hangover'] },
  { id: 'hbo-barbie', slug: 'barbie', title: 'Barbie', altTitles: [], type: 'movie', streaming: 'hbo', matchHints: ['barbie'] },
  { id: 'hbo-super-mario-bros', slug: 'super-mario-bros', title: 'Super Mario Bros', altTitles: ['the super mario bros movie'], type: 'movie', streaming: 'hbo', matchHints: ['mario', 'bros'] },
  // ── DRAMA ───────────────────────────────────────────────
  { id: 'hbo-coringa', slug: 'coringa', title: 'Coringa', altTitles: ['joker'], type: 'movie', streaming: 'hbo', matchHints: ['coringa', 'joker'] },
  { id: 'hbo-elvis', slug: 'elvis', title: 'Elvis', altTitles: [], type: 'movie', streaming: 'hbo', matchHints: ['elvis'] },
  { id: 'hbo-duna-parte-1', slug: 'duna-parte-1', title: 'Duna: Parte 1', altTitles: ['dune part one', 'dune 2021'], type: 'movie', streaming: 'hbo', matchHints: ['duna', 'dune'] },
  { id: 'hbo-um-sonho-de-liberdade', slug: 'um-sonho-de-liberdade', title: 'Um Sonho de Liberdade', altTitles: ['the shawshank redemption'], type: 'movie', streaming: 'hbo', matchHints: ['sonho', 'liberdade', 'shawshank'] },
  { id: 'hbo-king-richard', slug: 'king-richard', title: 'King Richard', altTitles: ['rei richard'], type: 'movie', streaming: 'hbo', matchHints: ['king', 'richard'] },
  // ── FICÇÃO CIENTÍFICA ───────────────────────────────────
  { id: 'hbo-a-origem', slug: 'a-origem', title: 'A Origem', altTitles: ['inception'], type: 'movie', streaming: 'hbo', matchHints: ['origem', 'inception'] },
  { id: 'hbo-2001-odisseia', slug: '2001-odisseia', title: '2001: Uma Odisseia no Espaço', altTitles: ['2001 a space odyssey'], type: 'movie', streaming: 'hbo', matchHints: ['2001', 'odisseia', 'odyssey'] },
  { id: 'hbo-duna-parte-2', slug: 'duna-parte-2', title: 'Duna: Parte 2', altTitles: ['dune part two', 'dune 2'], type: 'movie', streaming: 'hbo', matchHints: ['duna', 'dune', '2'] },
  { id: 'hbo-ex-machina', slug: 'ex-machina', title: 'Ex Machina', altTitles: [], type: 'movie', streaming: 'hbo', matchHints: ['ex', 'machina'] },
  { id: 'hbo-children-of-men', slug: 'children-of-men', title: 'Children of Men', altTitles: ['filhos dos homens'], type: 'movie', streaming: 'hbo', matchHints: ['children', 'men'] },
  // ── FANTASIA ────────────────────────────────────────────
  { id: 'hbo-o-hobbit-1', slug: 'o-hobbit-1', title: 'O Hobbit: Uma Jornada Inesperada', altTitles: ['the hobbit an unexpected journey', 'hobbit 1'], type: 'movie', streaming: 'hbo', matchHints: ['hobbit'] },
  { id: 'hbo-shazam', slug: 'shazam', title: 'Shazam!', altTitles: ['shazam fury of the gods'], type: 'movie', streaming: 'hbo', matchHints: ['shazam'] },
  { id: 'hbo-constantine', slug: 'constantine', title: 'Constantine', altTitles: [], type: 'movie', streaming: 'hbo', matchHints: ['constantine'] },
  // ── TERROR ──────────────────────────────────────────────
  { id: 'hbo-invocacao-do-mal', slug: 'invocacao-do-mal', title: 'Invocação do Mal', altTitles: ['the conjuring'], type: 'movie', streaming: 'hbo', matchHints: ['invocacao', 'conjuring'] },
  { id: 'hbo-it-a-coisa', slug: 'it-a-coisa', title: 'IT: A Coisa', altTitles: ['it chapter one', 'it 2017'], type: 'movie', streaming: 'hbo', matchHints: ['it', 'coisa'] },
  { id: 'hbo-o-iluminado', slug: 'o-iluminado', title: 'O Iluminado', altTitles: ['the shining'], type: 'movie', streaming: 'hbo', matchHints: ['iluminado', 'shining'] },
  { id: 'hbo-maligno', slug: 'maligno', title: 'Maligno', altTitles: ['malignant'], type: 'movie', streaming: 'hbo', matchHints: ['maligno', 'malignant'] },
  { id: 'hbo-evil-dead-rise', slug: 'evil-dead-rise', title: 'Evil Dead Rise', altTitles: [], type: 'movie', streaming: 'hbo', matchHints: ['evil', 'dead', 'rise'] },
  // ── THRILLER ────────────────────────────────────────────
  { id: 'hbo-os-infiltrados', slug: 'os-infiltrados', title: 'Os Infiltrados', altTitles: ['the departed'], type: 'movie', streaming: 'hbo', matchHints: ['infiltrados', 'departed'] },
  { id: 'hbo-se7en', slug: 'se7en', title: 'Se7en', altTitles: ['seven', 'sete'], type: 'movie', streaming: 'hbo', matchHints: ['seven', 'se7en', 'sete'] },
  { id: 'hbo-ilha-do-medo', slug: 'ilha-do-medo', title: 'Ilha do Medo', altTitles: ['shutter island'], type: 'movie', streaming: 'hbo', matchHints: ['ilha', 'medo', 'shutter', 'island'] },
  { id: 'hbo-prisoners', slug: 'prisoners', title: 'Prisoners', altTitles: ['prisioneiros'], type: 'movie', streaming: 'hbo', matchHints: ['prisoners', 'prisioneiros'] },
  // ── ROMANCE ─────────────────────────────────────────────
  { id: 'hbo-antes-do-amanhecer', slug: 'antes-do-amanhecer', title: 'Antes do Amanhecer', altTitles: ['before sunrise'], type: 'movie', streaming: 'hbo', matchHints: ['antes', 'amanhecer', 'before', 'sunrise'] },
  { id: 'hbo-la-la-land', slug: 'la-la-land', title: 'La La Land', altTitles: ['cantando estacoes'], type: 'movie', streaming: 'hbo', matchHints: ['la', 'land'] },
  { id: 'hbo-crazy-rich-asians', slug: 'crazy-rich-asians', title: 'Crazy Rich Asians', altTitles: ['podres de ricos'], type: 'movie', streaming: 'hbo', matchHints: ['crazy', 'rich', 'asians'] },
  // ── ANIMAÇÃO ────────────────────────────────────────────
  { id: 'hbo-lego-batman', slug: 'lego-batman', title: 'Lego Batman', altTitles: ['the lego batman movie'], type: 'movie', streaming: 'hbo', matchHints: ['lego', 'batman'] },
  { id: 'hbo-viagem-de-chihiro', slug: 'viagem-de-chihiro', title: 'A Viagem de Chihiro', altTitles: ['spirited away'], type: 'movie', streaming: 'hbo', matchHints: ['chihiro', 'spirited', 'away'] },
  { id: 'hbo-spider-verse', slug: 'spider-verse', title: 'Homem-Aranha: Através do Aranhaverso', altTitles: ['spider-man across the spider-verse'], type: 'movie', streaming: 'hbo', matchHints: ['spider', 'verse', 'aranhaverso'] },
  // ── INFANTIL ────────────────────────────────────────────
  { id: 'hbo-os-goonies', slug: 'os-goonies', title: 'Os Goonies', altTitles: ['the goonies'], type: 'movie', streaming: 'hbo', matchHints: ['goonies'] },
  { id: 'hbo-gremlins', slug: 'gremlins', title: 'Gremlins', altTitles: [], type: 'movie', streaming: 'hbo', matchHints: ['gremlins'] },
  // ── DOCUMENTÁRIO ────────────────────────────────────────
  { id: 'hbo-leaving-neverland', slug: 'leaving-neverland', title: 'Leaving Neverland', altTitles: [], type: 'movie', streaming: 'hbo', matchHints: ['leaving', 'neverland'] },
  { id: 'hbo-navalny', slug: 'navalny', title: 'Navalny', altTitles: [], type: 'movie', streaming: 'hbo', matchHints: ['navalny'] },

  // ══ SÉRIES HBO ══════════════════════════════════════
  // ── AÇÃO ────────────────────────────────────────────────
  { id: 'hbo-pacificador', slug: 'pacificador', title: 'Pacificador', altTitles: ['peacemaker'], type: 'series', streaming: 'hbo', matchHints: ['pacificador', 'peacemaker'] },
  { id: 'hbo-irmaos-de-sangue', slug: 'irmaos-de-sangue', title: 'Irmãos de Sangue', altTitles: ['band of brothers'], type: 'series', streaming: 'hbo', matchHints: ['irmaos', 'sangue', 'band', 'brothers'] },
  { id: 'hbo-warrior', slug: 'warrior', title: 'Warrior', altTitles: [], type: 'series', streaming: 'hbo', matchHints: ['warrior'] },
  { id: 'hbo-banshee', slug: 'banshee', title: 'Banshee', altTitles: [], type: 'series', streaming: 'hbo', matchHints: ['banshee'] },
  { id: 'hbo-strike-back', slug: 'strike-back', title: 'Strike Back', altTitles: [], type: 'series', streaming: 'hbo', matchHints: ['strike', 'back'] },
  { id: 'hbo-the-pacific', slug: 'the-pacific', title: 'The Pacific', altTitles: ['pacifico'], type: 'series', streaming: 'hbo', matchHints: ['pacific', 'pacifico'] },
  // ── AVENTURA ────────────────────────────────────────────
  { id: 'hbo-a-casa-do-dragao', slug: 'a-casa-do-dragao', title: 'A Casa do Dragão', altTitles: ['house of the dragon'], type: 'series', streaming: 'hbo', matchHints: ['casa', 'dragao', 'house', 'dragon'] },
  { id: 'hbo-his-dark-materials', slug: 'his-dark-materials', title: 'His Dark Materials', altTitles: ['a bussola de ouro serie'], type: 'series', streaming: 'hbo', matchHints: ['dark', 'materials'] },
  { id: 'hbo-westworld', slug: 'westworld', title: 'Westworld', altTitles: [], type: 'series', streaming: 'hbo', matchHints: ['westworld'] },
  { id: 'hbo-doctor-who', slug: 'doctor-who', title: 'Doctor Who', altTitles: ['dr who'], type: 'series', streaming: 'hbo', matchHints: ['doctor', 'who'] },
  // ── COMÉDIA ─────────────────────────────────────────────
  { id: 'hbo-friends', slug: 'friends', title: 'Friends', altTitles: [], type: 'series', streaming: 'hbo', matchHints: ['friends'] },
  { id: 'hbo-the-big-bang-theory', slug: 'the-big-bang-theory', title: 'The Big Bang Theory', altTitles: ['big bang theory'], type: 'series', streaming: 'hbo', matchHints: ['big', 'bang', 'theory'] },
  { id: 'hbo-veep', slug: 'veep', title: 'Veep', altTitles: [], type: 'series', streaming: 'hbo', matchHints: ['veep'] },
  { id: 'hbo-hacks', slug: 'hacks', title: 'Hacks', altTitles: [], type: 'series', streaming: 'hbo', matchHints: ['hacks'] },
  { id: 'hbo-barry', slug: 'barry', title: 'Barry', altTitles: [], type: 'series', streaming: 'hbo', matchHints: ['barry'] },
  { id: 'hbo-silicon-valley', slug: 'silicon-valley', title: 'Silicon Valley', altTitles: [], type: 'series', streaming: 'hbo', matchHints: ['silicon', 'valley'] },
  // ── DRAMA ───────────────────────────────────────────────
  { id: 'hbo-succession', slug: 'succession', title: 'Succession', altTitles: ['sucessao'], type: 'series', streaming: 'hbo', matchHints: ['succession', 'sucessao'] },
  { id: 'hbo-familia-soprano', slug: 'familia-soprano', title: 'Família Soprano', altTitles: ['the sopranos'], type: 'series', streaming: 'hbo', matchHints: ['soprano', 'sopranos'] },
  { id: 'hbo-chernobyl', slug: 'chernobyl', title: 'Chernobyl', altTitles: [], type: 'series', streaming: 'hbo', matchHints: ['chernobyl'] },
  { id: 'hbo-euphoria', slug: 'euphoria', title: 'Euphoria', altTitles: ['euforia'], type: 'series', streaming: 'hbo', matchHints: ['euphoria', 'euforia'] },
  { id: 'hbo-the-white-lotus', slug: 'the-white-lotus', title: 'The White Lotus', altTitles: ['white lotus'], type: 'series', streaming: 'hbo', matchHints: ['white', 'lotus'] },
  { id: 'hbo-big-little-lies', slug: 'big-little-lies', title: 'Big Little Lies', altTitles: [], type: 'series', streaming: 'hbo', matchHints: ['big', 'little', 'lies'] },
  { id: 'hbo-game-of-thrones', slug: 'game-of-thrones', title: 'Game of Thrones', altTitles: ['got', 'guerra dos tronos'], type: 'series', streaming: 'hbo', matchHints: ['game', 'thrones'] },
  // ── FICÇÃO CIENTÍFICA ───────────────────────────────────
  { id: 'hbo-raised-by-wolves', slug: 'raised-by-wolves', title: 'Raised by Wolves', altTitles: ['criados por lobos'], type: 'series', streaming: 'hbo', matchHints: ['raised', 'wolves'] },
  { id: 'hbo-fringe', slug: 'fringe', title: 'Fringe', altTitles: ['fringe divisao'], type: 'series', streaming: 'hbo', matchHints: ['fringe'] },
  { id: 'hbo-station-eleven', slug: 'station-eleven', title: 'Station Eleven', altTitles: ['estacao onze'], type: 'series', streaming: 'hbo', matchHints: ['station', 'eleven'] },
  // ── FANTASIA ────────────────────────────────────────────
  { id: 'hbo-true-blood', slug: 'true-blood', title: 'True Blood', altTitles: ['sangue fresco'], type: 'series', streaming: 'hbo', matchHints: ['true', 'blood'] },
  { id: 'hbo-penny-dreadful', slug: 'penny-dreadful', title: 'Penny Dreadful', altTitles: [], type: 'series', streaming: 'hbo', matchHints: ['penny', 'dreadful'] },
  { id: 'hbo-lovecraft-country', slug: 'lovecraft-country', title: 'Lovecraft Country', altTitles: [], type: 'series', streaming: 'hbo', matchHints: ['lovecraft', 'country'] },
  // ── TERROR ──────────────────────────────────────────────
  { id: 'hbo-the-last-of-us', slug: 'the-last-of-us', title: 'The Last of Us', altTitles: ['last of us'], type: 'series', streaming: 'hbo', matchHints: ['last', 'of', 'us'] },
  { id: 'hbo-the-outsider', slug: 'the-outsider', title: 'The Outsider', altTitles: ['o estranho'], type: 'series', streaming: 'hbo', matchHints: ['outsider', 'estranho'] },
  { id: 'hbo-chapelwaite', slug: 'chapelwaite', title: 'Chapelwaite', altTitles: [], type: 'series', streaming: 'hbo', matchHints: ['chapelwaite'] },
  // ── THRILLER ────────────────────────────────────────────
  { id: 'hbo-true-detective', slug: 'true-detective', title: 'True Detective', altTitles: ['detetive verdadeiro'], type: 'series', streaming: 'hbo', matchHints: ['true', 'detective'] },
  { id: 'hbo-mare-of-easttown', slug: 'mare-of-easttown', title: 'Mare of Easttown', altTitles: [], type: 'series', streaming: 'hbo', matchHints: ['mare', 'easttown'] },
  { id: 'hbo-the-undoing', slug: 'the-undoing', title: 'The Undoing', altTitles: ['o desfecho'], type: 'series', streaming: 'hbo', matchHints: ['undoing'] },
  { id: 'hbo-the-wire', slug: 'the-wire', title: 'The Wire', altTitles: ['sob escuta'], type: 'series', streaming: 'hbo', matchHints: ['wire'] },
  { id: 'hbo-sharp-objects', slug: 'sharp-objects', title: 'Sharp Objects', altTitles: ['objetos cortantes'], type: 'series', streaming: 'hbo', matchHints: ['sharp', 'objects'] },
  // ── ROMANCE ─────────────────────────────────────────────
  { id: 'hbo-sex-and-the-city', slug: 'sex-and-the-city', title: 'Sex and the City', altTitles: ['satc'], type: 'series', streaming: 'hbo', matchHints: ['sex', 'city'] },
  { id: 'hbo-and-just-like-that', slug: 'and-just-like-that', title: 'And Just Like That', altTitles: ['sex and the city 3'], type: 'series', streaming: 'hbo', matchHints: ['just', 'like', 'that'] },
  { id: 'hbo-gossip-girl', slug: 'gossip-girl', title: 'Gossip Girl', altTitles: [], type: 'series', streaming: 'hbo', matchHints: ['gossip', 'girl'] },
  // ── ANIMAÇÃO ────────────────────────────────────────────
  { id: 'hbo-rick-and-morty', slug: 'rick-and-morty', title: 'Rick and Morty', altTitles: ['rick e morty'], type: 'series', streaming: 'hbo', matchHints: ['rick', 'morty'] },
  { id: 'hbo-hora-de-aventura', slug: 'hora-de-aventura', title: 'Hora de Aventura', altTitles: ['adventure time'], type: 'series', streaming: 'hbo', matchHints: ['hora', 'aventura', 'adventure', 'time'] },
  { id: 'hbo-primal', slug: 'primal', title: 'Primal', altTitles: [], type: 'series', streaming: 'hbo', matchHints: ['primal'] },
  { id: 'hbo-harley-quinn', slug: 'harley-quinn', title: 'Harley Quinn', altTitles: [], type: 'series', streaming: 'hbo', matchHints: ['harley', 'quinn'] },
  // ── MISTÉRIO ────────────────────────────────────────────
  { id: 'hbo-boardwalk-empire', slug: 'boardwalk-empire', title: 'Boardwalk Empire', altTitles: ['imperio do crime'], type: 'series', streaming: 'hbo', matchHints: ['boardwalk', 'empire'] },
  { id: 'hbo-tokyo-vice', slug: 'tokyo-vice', title: 'Tokyo Vice', altTitles: [], type: 'series', streaming: 'hbo', matchHints: ['tokyo', 'vice'] },
  // ── DOCUMENTÁRIO ────────────────────────────────────────
  { id: 'hbo-the-jinx', slug: 'the-jinx', title: 'The Jinx', altTitles: ['jinx'], type: 'series', streaming: 'hbo', matchHints: ['jinx'] },
  { id: 'hbo-the-vow', slug: 'the-vow', title: 'The Vow', altTitles: ['o voto'], type: 'series', streaming: 'hbo', matchHints: ['vow'] },
]

const content = fs.readFileSync('./src/data/catalog.ts', 'utf8')
const insertPoint = content.lastIndexOf(']')
const newEntries = newTitles.map(t => `  ${JSON.stringify(t)}`).join(',\n')
const newContent = content.slice(0, insertPoint) + ',\n' + newEntries + '\n' + content.slice(insertPoint)
fs.writeFileSync('./src/data/catalog.ts', newContent)
console.log(`✅ Adicionados ${newTitles.length} títulos HBO`)
console.log(`Total no arquivo: ${(newContent.match(/"id":/g) || []).length} títulos`)
