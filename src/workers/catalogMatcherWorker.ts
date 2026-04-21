import { parseM3U } from '@iptv/playlist'
import type { RawChannel } from '../types/channel'
import { normalizeStreams } from '../services/streamNormalizer'
import { CANONICAL_CATALOG } from '../data/catalog'

function slugify(text: string): string {
  return text.toLowerCase()
    .replace(/\[.*?\]|\(.*?\)|\{.*?\}/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

self.onmessage = async (e: MessageEvent<{ url: string }>) => {
  try {
    self.postMessage({ status: 'fetching', progress: 5, message: 'Baixando M3U...' })
    
    const res = await fetch(e.data.url)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    
    self.postMessage({ status: 'parsing', progress: 15, message: 'Lendo playlist...' })
    
    const text = await res.text()
    const playlist = parseM3U(text)
    
    // Converte para RawChannel[] e normaliza (deduplicação)
    const rawChannels: RawChannel[] = playlist.channels.map(item => ({
      name: item.name ?? '',
      url: item.url ?? '',
      logo: item.tvgLogo ?? '',
      group: item.groupTitle ?? 'Sem categoria',
    }))
    
    const channels = normalizeStreams(rawChannels)
    const total = channels.length
    
    self.postMessage({ status: 'matching', progress: 30, message: `Processando ${total} canais...` })

    const matched = []
    const unmatched = []

    for (let i = 0; i < total; i++) {
      const ch = channels[i]
      const chSlug = slugify(ch.name)
      let bestMatch = null
      let score = 0

      // Exact Match (Score 100)
      bestMatch = CANONICAL_CATALOG.find(c => c.slug === chSlug)
      if (bestMatch) score = 100
      
      // AltTitle Match (Score 92)
      if (!bestMatch) {
        bestMatch = CANONICAL_CATALOG.find(c => c.altTitles.some(a => slugify(a) === chSlug))
        if (bestMatch) score = 92
      }

      // Prefix Match (Score 80)
      if (!bestMatch) {
        bestMatch = CANONICAL_CATALOG.find(c => chSlug.startsWith(c.slug) || c.slug.startsWith(chSlug))
        if (bestMatch) score = 80
      }

      if (score >= 80) {
        matched.push({ ...ch, canonical: bestMatch, matchScore: score })
      } else {
        unmatched.push(ch)
      }

      // Progress a cada 1000 canais
      if (i % 1000 === 0) {
        const prog = 30 + Math.floor((i / total) * 65)
        self.postMessage({ status: 'matching', progress: prog, message: `${i}/${total} processados` })
      }
    }

    self.postMessage({ 
      status: 'done', 
      progress: 100, 
      message: `${matched.length} matches, ${unmatched.length} sem match`,
      matched, 
      unmatched 
    })
    
  } catch (err) {
    self.postMessage({ 
      status: 'error', 
      progress: 0, 
      message: err instanceof Error ? err.message : String(err) 
    })
  }
}

