// streamNormalizer.ts
// Responsabilidade única: recebe RawChannel[] e retorna Channel[]
// deduplucados, com múltiplos streams por canal lógico, ordenados
// do melhor para o pior.

import type { RawChannel, Channel, Stream, StreamQuality } from '../types/channel'
import { QUALITY_ORDER } from '../types/channel'

// ─── Detectar qualidade pelo nome ───────────────────
export function detectQuality(name: string): StreamQuality {
  const n = name.toUpperCase()
  if (/\b4K\b|\bUHD\b|\b2160P?\b/.test(n))         return '4K'
  if (/\bFHD\b|\bFULL[\s.-]?HD\b|\b1080P?\b/.test(n)) return 'FHD'
  if (/\bHD\b|\b720P?\b/.test(n))                    return 'HD'
  if (/\bSD\b|\b480P?\b|\b360P?\b/.test(n))          return 'SD'
  return 'UNKNOWN'
}

export function cleanChannelName(raw: string): string {
  return raw
    .replace(/\|{2,}[^|]+\|{2,}/g, '')
    .replace(/\[[^\]]*\]/g, '')
    .replace(/\{[^}]*\}/g, '')
    .replace(/\([^)]*\)/g, '')
    .replace(/\b(4K|UHD|2160[Pp]?|FHD|FULL[\s.-]?HD|1080[Pp]?|HD|720[Pp]?|SD|480[Pp]?|360[Pp]?|H\.?265|H\.?264|HEVC|AVC|VOD|LEG|DUB|DUBLADO|LEGENDADO|PT-BR|BR|VIP|PREMIUM|PLUS)\b/gi, '')
    .replace(/\b(CH|CANAL)?\s*\d{1,4}\b/gi, '')
    .replace(/\b(19|20)\d{2}\b/g, '')
    .replace(/\b(O|A|THE|EL|LA)\s+(FILME|MOVIE|SERIE|SERIES?|TEMPORADA|SEASON|EPISODIO|EPISODE)\b/gi, '')
    .replace(/\b(S|T|EP|PARTE|PART|VOL)\s*\d+\b/gi, '')
    .replace(/[|_.\-–—:]+/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim()
    .replace(/\b\w/g, c => c.toUpperCase())
}

// ─── Gerar ID slug do canal lógico ──────────────────
export function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove acentos
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

// ─── Função principal: agrupar RawChannel[] em Channel[] ─
export function normalizeStreams(rawChannels: RawChannel[]): Channel[] {
  const map = new Map<string, Channel>()

  for (const raw of rawChannels) {
    const cleanName = cleanChannelName(raw.name)
    if (!cleanName || cleanName.length < 2) continue

    const quality = detectQuality(raw.name)
    const id = slugify(cleanName)

    const stream: Stream = {
      url: raw.url,
      quality,
      label: quality === 'UNKNOWN' ? 'Padrão' : quality,
    }

    if (map.has(id)) {
      const existing = map.get(id)!
      // Só adiciona se URL for diferente (evita duplicata exata)
      const urlExists = existing.streams.some(s => s.url === raw.url)
      if (!urlExists) {
        existing.streams.push(stream)
        existing.variantCount++
        // Atualiza logo se o novo stream tem logo e o atual não
        if (!existing.logo && raw.logo) {
          existing.logo = raw.logo
        }
      }
    } else {
      map.set(id, {
        id,
        name: cleanName,
        logo: raw.logo || '',
        group: raw.group,
        streams: [stream],
        activeStream: stream,
        variantCount: 1,
      })
    }
  }

  // Ordenar streams de cada canal: melhor → pior
  for (const ch of map.values()) {
    ch.streams.sort((a, b) =>
      QUALITY_ORDER.indexOf(a.quality) - QUALITY_ORDER.indexOf(b.quality)
    )
    ch.activeStream = ch.streams[0]
  }

  const result = [...map.values()]

  console.log(
    `[StreamNormalizer] ${rawChannels.length} entradas M3U → ` +
    `${result.length} canais únicos ` +
    `(${rawChannels.length - result.length} duplicatas removidas)`
  )

  return result
}

// ─── Selecionar melhor stream disponível ─────────────
// Usa health check se disponível, senão usa ordem de qualidade
export function selectBestStream(ch: Channel): Stream {
  // Se temos dados de health check, prioriza streams funcionando
  const working = ch.streams.filter(s => s.isWorking !== false)
  if (working.length > 0) return working[0]
  // Sem health check: retorna o de maior qualidade
  return ch.streams[0]
}

// ─── Trocar stream ativo ─────────────────────────────
export function setActiveStream(ch: Channel, stream: Stream): Channel {
  return { ...ch, activeStream: stream }
}
