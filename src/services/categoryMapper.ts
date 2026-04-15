// Category Mapper — Normalização de grupos M3U → categorias fixas da UI
// Camada pura: sem side effects, sem I/O, sem estado
// A UI NUNCA lê group-title da M3U diretamente

import type { Channel } from '../types/channel'

export type UICategory =
  | 'filmes'
  | 'series'
  | 'esportes'
  | 'infantil'
  | 'abertos'
  | 'documentarios'
  | 'noticias'
  | 'outros'

export const UI_CATEGORIES: UICategory[] = [
  'filmes', 'series', 'esportes', 'infantil',
  'abertos', 'documentarios', 'noticias', 'outros',
]

// Labels legíveis para a UI
export const CATEGORY_LABELS: Record<UICategory, string> = {
  filmes: 'filmes',
  series: 'séries',
  esportes: 'esportes',
  infantil: 'infantil',
  abertos: 'canais abertos',
  documentarios: 'documentários',
  noticias: 'notícias',
  outros: 'outros',
}

// Regras de classificação — ordem importa (primeira match ganha)
// Extensível: basta adicionar novos patterns sem mexer no resto
const CATEGORY_RULES: Array<{ category: UICategory; patterns: RegExp[] }> = [
  {
    category: 'filmes',
    patterns: [/film/i, /movie/i, /cinema/i, /vod.*film/i, /pelicul/i],
  },
  {
    category: 'series',
    patterns: [/seri/i, /series/i, /novela/i, /temporada/i, /season/i, /vod.*seri/i],
  },
  {
    category: 'esportes',
    patterns: [/sport/i, /esport/i, /futebol/i, /football/i, /soccer/i, /nba/i, /ufc/i, /luta/i, /boxing/i],
  },
  {
    category: 'infantil',
    patterns: [/infant/i, /kids/i, /child/i, /cartoon/i, /desenho/i, /anim/i, /disney/i, /nick/i],
  },
  {
    category: 'abertos',
    patterns: [/aberto/i, /aberta/i, /nacional/i, /tv brasil/i, /globo(?!.*news)/i, /sbt/i, /record/i, /band/i],
  },
  {
    category: 'documentarios',
    patterns: [/document/i, /doc[^k]/i, /discovery/i, /nat\s*geo/i, /national\s*geo/i, /history/i, /animal\s*planet/i],
  },
  {
    category: 'noticias',
    patterns: [/notic/i, /news/i, /jornal/i, /cnn/i, /bbc/i, /al\s*jazeera/i],
  },
]

/**
 * Classifica um nome de grupo M3U em uma UICategory.
 * Se nenhuma regra casar, retorna 'outros'.
 */
function classifyGroup(groupName: string): UICategory {
  // Limpa prefixos típicos de M3U (|||BR|||, [BR], etc.)
  const cleaned = groupName
    .replace(/\|{2,}[^|]*\|{2,}/g, '') // |||BR||| etc
    .replace(/\[[^\]]*\]/g, '')         // [BR] etc
    .replace(/^\s*[-–—]\s*/, '')        // traços iniciais
    .trim()

  for (const rule of CATEGORY_RULES) {
    for (const pattern of rule.patterns) {
      if (pattern.test(cleaned) || pattern.test(groupName)) {
        return rule.category
      }
    }
  }

  return 'outros'
}

/**
 * Transforma os grupos crus da M3U em categorias normalizadas da UI.
 * 
 * @param rawGroups - grupos vindos do parser (group-title → Channel[])
 * @returns categorias fixas da UI com todos os canais classificados
 */
export function normalizeGroups(
  rawGroups: Record<string, Channel[]>
): Record<UICategory, Channel[]> {
  // Inicializa todas as categorias vazias
  const result: Record<UICategory, Channel[]> = {
    filmes: [],
    series: [],
    esportes: [],
    infantil: [],
    abertos: [],
    documentarios: [],
    noticias: [],
    outros: [],
  }

  let classified = 0
  let unclassified = 0

  for (const [groupName, channels] of Object.entries(rawGroups)) {
    const category = classifyGroup(groupName)

    if (category === 'outros') {
      unclassified += channels.length
    } else {
      classified += channels.length
    }

    result[category].push(...channels)
  }

  const total = classified + unclassified
  console.log(
    `[CategoryMapper] ${total} canais normalizados: ` +
    `${classified} classificados, ${unclassified} em 'outros'`
  )

  // Log de distribuição por categoria
  for (const cat of UI_CATEGORIES) {
    if (result[cat].length > 0) {
      console.log(`  [${cat}] ${result[cat].length} canais`)
    }
  }

  return result
}
