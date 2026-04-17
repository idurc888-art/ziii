import { parseM3U } from '@iptv/playlist'
import type { Channel, RawChannel } from '../types/channel'
import { normalizeStreams } from '../services/streamNormalizer'

type InMessage = { type: 'LOAD'; url: string }
type OutMessage =
  | { type: 'SUCCESS'; groups: Record<string, Channel[]> }
  | { type: 'ERROR'; message: string }

self.onmessage = async (e: MessageEvent<InMessage>) => {
  if (e.data.type !== 'LOAD') return

  try {
    const res = await fetch(e.data.url)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const playlist = parseM3U(await res.text())

    // Converte para RawChannel[] e deduplica com normalizeStreams
    const rawChannels: RawChannel[] = playlist.channels.map(item => ({
      name: item.name ?? '',
      url: item.url ?? '',
      logo: item.tvgLogo ?? '',
      group: item.groupTitle ?? 'Sem categoria',
    }))

    const channels = normalizeStreams(rawChannels)

    const groups: Record<string, Channel[]> = {}
    for (const ch of channels) {
      if (!groups[ch.group]) groups[ch.group] = []
      groups[ch.group].push(ch)
    }

    self.postMessage({ type: 'SUCCESS', groups } satisfies OutMessage)
  } catch (err) {
    self.postMessage({ type: 'ERROR', message: String(err) } satisfies OutMessage)
  }
}
