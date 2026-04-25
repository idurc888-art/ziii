// Script: adiciona Apple TV+ ao catalog.ts
import fs from 'fs'

const newTitles = [
  // ── SÉRIES ──────────────────────────────────────────────
  { id: 'apple-severance', slug: 'severance', title: 'Ruptura', altTitles: ['severance'], type: 'series', streaming: 'apple', matchHints: ['ruptura', 'severance'] },
  { id: 'apple-ted-lasso', slug: 'ted-lasso', title: 'Ted Lasso', altTitles: [], type: 'series', streaming: 'apple', matchHints: ['ted', 'lasso'] },
  { id: 'apple-silo', slug: 'silo', title: 'Silo', altTitles: [], type: 'series', streaming: 'apple', matchHints: ['silo'] },
  { id: 'apple-foundation', slug: 'foundation', title: 'Fundação', altTitles: ['foundation'], type: 'series', streaming: 'apple', matchHints: ['fundacao', 'foundation'] },
  { id: 'apple-morning-show', slug: 'morning-show', title: 'The Morning Show', altTitles: [], type: 'series', streaming: 'apple', matchHints: ['morning', 'show'] },
  { id: 'apple-for-all-mankind', slug: 'for-all-mankind', title: 'For All Mankind', altTitles: [], type: 'series', streaming: 'apple', matchHints: ['for', 'all', 'mankind'] },
  { id: 'apple-shrinking', slug: 'shrinking', title: 'Falando a Real', altTitles: ['shrinking'], type: 'series', streaming: 'apple', matchHints: ['falando', 'real', 'shrinking'] },
  { id: 'apple-slow-horses', slug: 'slow-horses', title: 'Slow Horses', altTitles: [], type: 'series', streaming: 'apple', matchHints: ['slow', 'horses'] },
  { id: 'apple-masters-of-the-air', slug: 'masters-of-the-air', title: 'Mestres do Ar', altTitles: ['masters of the air'], type: 'series', streaming: 'apple', matchHints: ['mestres', 'ar', 'masters'] },
  { id: 'apple-defending-jacob', slug: 'defending-jacob', title: 'Em Defesa de Jacob', altTitles: ['defending jacob'], type: 'series', streaming: 'apple', matchHints: ['defesa', 'jacob', 'defending'] },
  { id: 'apple-dark-matter', slug: 'dark-matter', title: 'Matéria Escura', altTitles: ['dark matter'], type: 'series', streaming: 'apple', matchHints: ['materia', 'escura', 'dark', 'matter'] },
  { id: 'apple-monarch', slug: 'monarch', title: 'Monarch: Legado de Monstros', altTitles: ['monarch legacy of monsters'], type: 'series', streaming: 'apple', matchHints: ['monarch', 'monstros'] },
  { id: 'apple-crowded-room', slug: 'crowded-room', title: 'Entre Estranhos', altTitles: ['the crowded room'], type: 'series', streaming: 'apple', matchHints: ['entre', 'estranhos', 'crowded'] },
  { id: 'apple-black-bird', slug: 'black-bird', title: 'Black Bird', altTitles: [], type: 'series', streaming: 'apple', matchHints: ['black', 'bird'] },
  { id: 'apple-see', slug: 'see', title: 'See', altTitles: [], type: 'series', streaming: 'apple', matchHints: ['see'] },
  { id: 'apple-invasion', slug: 'invasion', title: 'Invasão', altTitles: ['invasion'], type: 'series', streaming: 'apple', matchHints: ['invasao', 'invasion'] },
  { id: 'apple-bad-sisters', slug: 'bad-sisters', title: 'Mal de Família', altTitles: ['bad sisters'], type: 'series', streaming: 'apple', matchHints: ['mal', 'familia', 'bad', 'sisters'] },
  { id: 'apple-servant', slug: 'servant', title: 'Servant', altTitles: [], type: 'series', streaming: 'apple', matchHints: ['servant'] },
  { id: 'apple-pachinko', slug: 'pachinko', title: 'Pachinko', altTitles: [], type: 'series', streaming: 'apple', matchHints: ['pachinko'] },
  { id: 'apple-dickinson', slug: 'dickinson', title: 'Dickinson', altTitles: [], type: 'series', streaming: 'apple', matchHints: ['dickinson'] },
  { id: 'apple-physical', slug: 'physical', title: 'Physical', altTitles: [], type: 'series', streaming: 'apple', matchHints: ['physical'] },
  { id: 'apple-presumed-innocent', slug: 'presumed-innocent', title: 'Acima de Qualquer Suspeita', altTitles: ['presumed innocent'], type: 'series', streaming: 'apple', matchHints: ['acima', 'suspeita', 'presumed'] },
  { id: 'apple-truth-be-told', slug: 'truth-be-told', title: 'Truth Be Told', altTitles: [], type: 'series', streaming: 'apple', matchHints: ['truth', 'be', 'told'] },
  { id: 'apple-tehran', slug: 'tehran', title: 'Teerã', altTitles: ['tehran'], type: 'series', streaming: 'apple', matchHints: ['teeran', 'tehran'] },
  { id: 'apple-big-door-prize', slug: 'big-door-prize', title: 'A Máquina do Destino', altTitles: ['the big door prize'], type: 'series', streaming: 'apple', matchHints: ['maquina', 'destino', 'big', 'door'] },
  { id: 'apple-sugar', slug: 'sugar', title: 'Sugar', altTitles: [], type: 'series', streaming: 'apple', matchHints: ['sugar'] },
  { id: 'apple-palm-royale', slug: 'palm-royale', title: 'Palm Royale', altTitles: [], type: 'series', streaming: 'apple', matchHints: ['palm', 'royale'] },
  { id: 'apple-echo-3', slug: 'echo-3', title: 'Falcão Negro na Veia', altTitles: ['echo 3'], type: 'series', streaming: 'apple', matchHints: ['falcao', 'negro', 'echo'] },
  { id: 'apple-lessons-chemistry', slug: 'lessons-chemistry', title: 'Lições de Química', altTitles: ['lessons in chemistry'], type: 'series', streaming: 'apple', matchHints: ['licoes', 'quimica', 'lessons'] },
  { id: 'apple-drops-of-god', slug: 'drops-of-god', title: 'Gotas de Deus', altTitles: ['drops of god'], type: 'series', streaming: 'apple', matchHints: ['gotas', 'deus', 'drops'] },
  { id: 'apple-planeta-pre-historico', slug: 'planeta-pre-historico', title: 'Planeta Pré-Histórico', altTitles: ['prehistoric planet'], type: 'series', streaming: 'apple', matchHints: ['planeta', 'pre', 'historico'] },
  { id: 'apple-snoopy-espaco', slug: 'snoopy-espaco', title: 'Snoopy no Espaço', altTitles: ['snoopy in space'], type: 'series', streaming: 'apple', matchHints: ['snoopy', 'espaco'] },
  // ── FILMES ──────────────────────────────────────────────
  { id: 'apple-killers-flower-moon', slug: 'killers-flower-moon', title: 'Assassinos da Lua das Flores', altTitles: ['killers of the flower moon'], type: 'movie', streaming: 'apple', matchHints: ['assassinos', 'lua', 'flores', 'killers'] },
  { id: 'apple-coda', slug: 'coda', title: 'No Ritmo do Coração', altTitles: ['coda'], type: 'movie', streaming: 'apple', matchHints: ['ritmo', 'coracao', 'coda'] },
  { id: 'apple-napoleao', slug: 'napoleao', title: 'Napoleão', altTitles: ['napoleon'], type: 'movie', streaming: 'apple', matchHints: ['napoleao', 'napoleon'] },
  { id: 'apple-argylle', slug: 'argylle', title: 'Argylle: O Superespião', altTitles: ['argylle'], type: 'movie', streaming: 'apple', matchHints: ['argylle', 'superespiao'] },
  { id: 'apple-family-plan', slug: 'family-plan', title: 'Plano em Família', altTitles: ['the family plan'], type: 'movie', streaming: 'apple', matchHints: ['plano', 'familia', 'family', 'plan'] },
  { id: 'apple-ghosted', slug: 'ghosted', title: 'Ghosted: Sem Resposta', altTitles: ['ghosted'], type: 'movie', streaming: 'apple', matchHints: ['ghosted', 'sem', 'resposta'] },
  { id: 'apple-tetris', slug: 'tetris', title: 'Tetris', altTitles: [], type: 'movie', streaming: 'apple', matchHints: ['tetris'] },
  { id: 'apple-greyhound', slug: 'greyhound', title: 'Greyhound: Na Mira do Inimigo', altTitles: ['greyhound'], type: 'movie', streaming: 'apple', matchHints: ['greyhound', 'mira', 'inimigo'] },
  { id: 'apple-finch', slug: 'finch', title: 'Finch', altTitles: [], type: 'movie', streaming: 'apple', matchHints: ['finch'] },
  { id: 'apple-cherry', slug: 'cherry', title: 'Cherry: Inocência Perdida', altTitles: ['cherry'], type: 'movie', streaming: 'apple', matchHints: ['cherry', 'inocencia'] },
  { id: 'apple-macbeth', slug: 'macbeth', title: 'A Tragédia de Macbeth', altTitles: ['the tragedy of macbeth'], type: 'movie', streaming: 'apple', matchHints: ['tragedia', 'macbeth'] },
  { id: 'apple-emancipation', slug: 'emancipation', title: 'Emancipação', altTitles: ['emancipation'], type: 'movie', streaming: 'apple', matchHints: ['emancipacao', 'emancipation'] },
  { id: 'apple-causeway', slug: 'causeway', title: 'Passagem', altTitles: ['causeway'], type: 'movie', streaming: 'apple', matchHints: ['passagem', 'causeway'] },
  { id: 'apple-passos-gigante', slug: 'passos-gigante', title: 'Passos de Gigante', altTitles: ['the greatest beer run ever'], type: 'movie', streaming: 'apple', matchHints: ['passos', 'gigante', 'beer'] },
  { id: 'apple-wolfwalkers', slug: 'wolfwalkers', title: 'Wolfwalkers', altTitles: [], type: 'movie', streaming: 'apple', matchHints: ['wolfwalkers'] },
  { id: 'apple-luck', slug: 'luck', title: 'Luck', altTitles: ['sorte'], type: 'movie', streaming: 'apple', matchHints: ['luck', 'sorte'] },
  { id: 'apple-the-banker', slug: 'the-banker', title: 'O Banqueiro', altTitles: ['the banker'], type: 'movie', streaming: 'apple', matchHints: ['banqueiro', 'banker'] },
  { id: 'apple-palmer', slug: 'palmer', title: 'Palmer', altTitles: [], type: 'movie', streaming: 'apple', matchHints: ['palmer'] },
]

const content = fs.readFileSync('./src/data/catalog.ts', 'utf8')
const insertPoint = content.lastIndexOf(']')
const newEntries = newTitles.map(t => `  ${JSON.stringify(t)}`).join(',\n')
const newContent = content.slice(0, insertPoint) + ',\n' + newEntries + '\n' + content.slice(insertPoint)
fs.writeFileSync('./src/data/catalog.ts', newContent)
console.log(`✅ Adicionados ${newTitles.length} títulos Apple TV+`)
console.log(`Total no arquivo: ${(newContent.match(/"id":/g) || []).length} títulos`)
