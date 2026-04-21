// contentMatcher.ts - Match TMDB ↔ M3U

import type { CanonicalContent } from '../types/tmdbCatalog'
import type { Channel } from '../types/channel'

function buildChannelIndex(channels: Channel[]) {
  const byTmdbId = new Map<number, Channel[]>()
  const byName = new Map<string, Channel[]>()

  const normalize = (s: string) =>
    s.normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()

  for (const ch of channels) {
    const tmdbId = (ch.tmdb as any)?.id as number | undefined
    if (tmdbId) {
      const list = byTmdbId.get(tmdbId) ?? []
      list.push(ch)
      byTmdbId.set(tmdbId, list)
    }
    const key = normalize(ch.tmdb?.title || ch.name)
    const list2 = byName.get(key) ?? []
    list2.push(ch)
    byName.set(key, list2)
  }

  return { byTmdbId, byName, normalize }
}

export function matchCanonicalToChannels(
  canonicalList: CanonicalContent[],
  channels: Channel[]
): { matchedChannels: Channel[]; tmdbMap: Map<string, CanonicalContent> } {
  const { byTmdbId, byName, normalize } = buildChannelIndex(channels)
  const usedChannelIds = new Set<string>()
  const usedTmdbIds = new Set<number>()
  const result: Channel[] = []
  const tmdbMap = new Map<string, CanonicalContent>()

  for (const item of canonicalList) {
    if (usedTmdbIds.has(item.tmdbId)) continue

    let candidates = byTmdbId.get(item.tmdbId) ?? []
    if (!candidates.length) {
      const key = normalize(item.title)
      candidates = byName.get(key) ?? []
    }

    const ch = candidates.find(c => !usedChannelIds.has(c.id))
    if (!ch) continue

    usedChannelIds.add(ch.id)
    usedTmdbIds.add(item.tmdbId)
    result.push(ch)
    tmdbMap.set(ch.name, item)
  }

  return { matchedChannels: result, tmdbMap }
}
