import { parseM3U } from '@iptv/playlist'
import type { Channel } from '../types/channel'

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

    const groups: Record<string, Channel[]> = {}
    for (const item of playlist.channels) {
      const group = item.groupTitle ?? 'Sem categoria'
      const ch: Channel = {
        name: item.name ?? '',
        url: item.url ?? '',
        logo: item.tvgLogo ?? '',
        group,
      }
      if (!groups[group]) groups[group] = []
      groups[group].push(ch)
    }

    self.postMessage({ type: 'SUCCESS', groups } satisfies OutMessage)
  } catch (err) {
    self.postMessage({ type: 'ERROR', message: String(err) } satisfies OutMessage)
  }
}
