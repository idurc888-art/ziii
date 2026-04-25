// Script: adiciona Globoplay ao catalog.ts
import fs from 'fs'

const newTitles = [
  // ── NOVELAS ─────────────────────────────────────────────
  { id: 'globo-avenida-brasil', slug: 'avenida-brasil', title: 'Avenida Brasil', altTitles: [], type: 'series', streaming: 'globoplay', matchHints: ['avenida', 'brasil'] },
  { id: 'globo-o-clone', slug: 'o-clone', title: 'O Clone', altTitles: [], type: 'series', streaming: 'globoplay', matchHints: ['clone'] },
  { id: 'globo-senhora-destino', slug: 'senhora-destino', title: 'Senhora do Destino', altTitles: [], type: 'series', streaming: 'globoplay', matchHints: ['senhora', 'destino'] },
  { id: 'globo-pantanal-2022', slug: 'pantanal-2022', title: 'Pantanal', altTitles: ['pantanal 2022'], type: 'series', streaming: 'globoplay', matchHints: ['pantanal', '2022'] },
  { id: 'globo-renascer-2024', slug: 'renascer-2024', title: 'Renascer', altTitles: ['renascer 2024'], type: 'series', streaming: 'globoplay', matchHints: ['renascer', '2024'] },
  { id: 'globo-a-favorita', slug: 'a-favorita', title: 'A Favorita', altTitles: [], type: 'series', streaming: 'globoplay', matchHints: ['favorita'] },
  { id: 'globo-mulheres-areia', slug: 'mulheres-areia', title: 'Mulheres de Areia', altTitles: [], type: 'series', streaming: 'globoplay', matchHints: ['mulheres', 'areia'] },
  { id: 'globo-rei-do-gado', slug: 'rei-do-gado', title: 'O Rei do Gado', altTitles: [], type: 'series', streaming: 'globoplay', matchHints: ['rei', 'gado'] },
  { id: 'globo-todas-flores', slug: 'todas-flores', title: 'Todas as Flores', altTitles: [], type: 'series', streaming: 'globoplay', matchHints: ['todas', 'flores'] },
  { id: 'globo-verdades-secretas', slug: 'verdades-secretas', title: 'Verdades Secretas', altTitles: [], type: 'series', streaming: 'globoplay', matchHints: ['verdades', 'secretas'] },
  { id: 'globo-vale-tudo', slug: 'vale-tudo', title: 'Vale Tudo', altTitles: [], type: 'series', streaming: 'globoplay', matchHints: ['vale', 'tudo'] },
  { id: 'globo-lacos-familia', slug: 'lacos-familia', title: 'Laços de Família', altTitles: [], type: 'series', streaming: 'globoplay', matchHints: ['lacos', 'familia'] },
  { id: 'globo-por-amor', slug: 'por-amor', title: 'Por Amor', altTitles: [], type: 'series', streaming: 'globoplay', matchHints: ['por', 'amor'] },
  { id: 'globo-caminho-indias', slug: 'caminho-indias', title: 'Caminho das Índias', altTitles: [], type: 'series', streaming: 'globoplay', matchHints: ['caminho', 'indias'] },
  { id: 'globo-chocolate-pimenta', slug: 'chocolate-pimenta', title: 'Chocolate com Pimenta', altTitles: [], type: 'series', streaming: 'globoplay', matchHints: ['chocolate', 'pimenta'] },
  { id: 'globo-alma-gemea', slug: 'alma-gemea', title: 'Alma Gêmea', altTitles: [], type: 'series', streaming: 'globoplay', matchHints: ['alma', 'gemea'] },
  { id: 'globo-a-viagem', slug: 'a-viagem', title: 'A Viagem', altTitles: [], type: 'series', streaming: 'globoplay', matchHints: ['viagem'] },
  { id: 'globo-cravo-rosa', slug: 'cravo-rosa', title: 'O Cravo e a Rosa', altTitles: [], type: 'series', streaming: 'globoplay', matchHints: ['cravo', 'rosa'] },
  { id: 'globo-celebridade', slug: 'celebridade', title: 'Celebridade', altTitles: [], type: 'series', streaming: 'globoplay', matchHints: ['celebridade'] },
  { id: 'globo-tititi', slug: 'tititi', title: 'Tititi', altTitles: [], type: 'series', streaming: 'globoplay', matchHints: ['tititi'] },
  // ── SÉRIES / ORIGINAIS ──────────────────────────────────
  { id: 'globo-os-outros', slug: 'os-outros', title: 'Os Outros', altTitles: [], type: 'series', streaming: 'globoplay', matchHints: ['os', 'outros'] },
  { id: 'globo-sob-pressao', slug: 'sob-pressao', title: 'Sob Pressão', altTitles: [], type: 'series', streaming: 'globoplay', matchHints: ['sob', 'pressao'] },
  { id: 'globo-arcanjo-renegado', slug: 'arcanjo-renegado', title: 'Arcanjo Renegado', altTitles: [], type: 'series', streaming: 'globoplay', matchHints: ['arcanjo', 'renegado'] },
  { id: 'globo-as-five', slug: 'as-five', title: 'As Five', altTitles: [], type: 'series', streaming: 'globoplay', matchHints: ['as', 'five'] },
  { id: 'globo-a-divisao', slug: 'a-divisao', title: 'A Divisão', altTitles: [], type: 'series', streaming: 'globoplay', matchHints: ['divisao'] },
  { id: 'globo-rensga-hits', slug: 'rensga-hits', title: 'Rensga Hits!', altTitles: [], type: 'series', streaming: 'globoplay', matchHints: ['rensga', 'hits'] },
  { id: 'globo-justica', slug: 'justica', title: 'Justiça', altTitles: [], type: 'series', streaming: 'globoplay', matchHints: ['justica'] },
  { id: 'globo-fim', slug: 'fim', title: 'Fim', altTitles: [], type: 'series', streaming: 'globoplay', matchHints: ['fim'] },
  { id: 'globo-onde-esta-coracao', slug: 'onde-esta-coracao', title: 'Onde Está Meu Coração', altTitles: [], type: 'series', streaming: 'globoplay', matchHints: ['onde', 'esta', 'coracao'] },
  { id: 'globo-sessao-terapia', slug: 'sessao-terapia', title: 'Sessão de Terapia', altTitles: [], type: 'series', streaming: 'globoplay', matchHints: ['sessao', 'terapia'] },
  { id: 'globo-desalma', slug: 'desalma', title: 'Desalma', altTitles: [], type: 'series', streaming: 'globoplay', matchHints: ['desalma'] },
  { id: 'globo-ilha-ferro', slug: 'ilha-ferro', title: 'Ilha de Ferro', altTitles: [], type: 'series', streaming: 'globoplay', matchHints: ['ilha', 'ferro'] },
  { id: 'globo-carcereiros', slug: 'carcereiros', title: 'Carcereiros', altTitles: [], type: 'series', streaming: 'globoplay', matchHints: ['carcereiros'] },
  { id: 'globo-cilada', slug: 'cilada', title: 'Cilada', altTitles: [], type: 'series', streaming: 'globoplay', matchHints: ['cilada'] },
  { id: 'globo-os-normais', slug: 'os-normais', title: 'Os Normais', altTitles: [], type: 'series', streaming: 'globoplay', matchHints: ['os', 'normais'] },
  { id: 'globo-grande-familia', slug: 'grande-familia', title: 'A Grande Família', altTitles: [], type: 'series', streaming: 'globoplay', matchHints: ['grande', 'familia'] },
  { id: 'globo-tapas-beijos', slug: 'tapas-beijos', title: 'Tapas e Beijos', altTitles: [], type: 'series', streaming: 'globoplay', matchHints: ['tapas', 'beijos'] },
  { id: 'globo-toma-la-da-ca', slug: 'toma-la-da-ca', title: 'Toma Lá, Dá Cá', altTitles: [], type: 'series', streaming: 'globoplay', matchHints: ['toma', 'la', 'da', 'ca'] },
  { id: 'globo-sai-de-baixo', slug: 'sai-de-baixo', title: 'Sai de Baixo', altTitles: [], type: 'series', streaming: 'globoplay', matchHints: ['sai', 'de', 'baixo'] },
  { id: 'globo-dpa', slug: 'dpa', title: 'DPA - Detetives do Prédio Azul', altTitles: [], type: 'series', streaming: 'globoplay', matchHints: ['dpa', 'detetives', 'predio', 'azul'] },
  // ── REALITIES / DOCUMENTÁRIOS ──────────────────────────
  { id: 'globo-linha-direta', slug: 'linha-direta', title: 'Linha Direta', altTitles: [], type: 'series', streaming: 'globoplay', matchHints: ['linha', 'direta'] },
  { id: 'globo-caso-evandro', slug: 'caso-evandro', title: 'O Caso Evandro', altTitles: [], type: 'series', streaming: 'globoplay', matchHints: ['caso', 'evandro'] },
  { id: 'globo-boate-kiss', slug: 'boate-kiss', title: 'Boate Kiss: A Tragédia de Santa Maria', altTitles: [], type: 'series', streaming: 'globoplay', matchHints: ['boate', 'kiss', 'santa', 'maria'] },
  { id: 'globo-flordelis', slug: 'flordelis', title: 'Flordelis: Questiona ou Adora', altTitles: [], type: 'series', streaming: 'globoplay', matchHints: ['flordelis'] },
  { id: 'globo-vale-escrito', slug: 'vale-escrito', title: 'Vale o Escrito - A Guerra do Jogo do Bicho', altTitles: [], type: 'series', streaming: 'globoplay', matchHints: ['vale', 'escrito', 'jogo', 'bicho'] },
  { id: 'globo-xuxa-doc', slug: 'xuxa-doc', title: 'Xuxa, o Documentário', altTitles: [], type: 'series', streaming: 'globoplay', matchHints: ['xuxa', 'documentario'] },
  { id: 'globo-pcc', slug: 'pcc', title: 'PCC: Poder Secreto', altTitles: [], type: 'series', streaming: 'globoplay', matchHints: ['pcc', 'poder', 'secreto'] },
  { id: 'globo-daniella-perez', slug: 'daniella-perez', title: 'Daniella Perez: Pacto Brutal', altTitles: [], type: 'series', streaming: 'globoplay', matchHints: ['daniella', 'perez', 'pacto'] },
  { id: 'globo-vida-depois-tombo', slug: 'vida-depois-tombo', title: 'A Vida Depois do Tombo', altTitles: [], type: 'series', streaming: 'globoplay', matchHints: ['vida', 'depois', 'tombo'] },
  { id: 'globo-castelo-ra-tim-bum', slug: 'castelo-ra-tim-bum', title: 'Castelo Rá-Tim-Bum', altTitles: [], type: 'series', streaming: 'globoplay', matchHints: ['castelo', 'ra', 'tim', 'bum'] },
]

const content = fs.readFileSync('./src/data/catalog.ts', 'utf8')
const insertPoint = content.lastIndexOf(']')
const newEntries = newTitles.map(t => `  ${JSON.stringify(t)}`).join(',\n')
const newContent = content.slice(0, insertPoint) + ',\n' + newEntries + '\n' + content.slice(insertPoint)
fs.writeFileSync('./src/data/catalog.ts', newContent)
console.log(`✅ Adicionados ${newTitles.length} títulos Globoplay`)
console.log(`Total no arquivo: ${(newContent.match(/"id":/g) || []).length} títulos`)
