// streamHealthCheck.ts
// Faz probe HTTP HEAD nos streams em background para saber quais
// estão funcionando e medir latência. Não bloqueia a UI.

import type { Channel, Stream } from '../types/channel'
import { QUALITY_ORDER } from '../types/channel'

const PROBE_TIMEOUT_MS = 4000
const MAX_CONCURRENT_PROBES = 6  // Tizen tem limite de conexões simultâneas

// ─── Probe de um stream único ────────────────────────
async function probeStream(stream: Stream): Promise<Stream> {
  const t0 = Date.now()
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), PROBE_TIMEOUT_MS)

    const res = await fetch(stream.url, {
      method: 'HEAD',
      signal: controller.signal,
      cache: 'no-store',
    })
    clearTimeout(timeout)

    return {
      ...stream,
      isWorking: res.ok || res.status === 405, // 405 = Method Not Allowed (servidor não suporta HEAD mas está vivo)
      latencyMs: Date.now() - t0,
      lastChecked: Date.now(),
    }
  } catch {
    return {
      ...stream,
      isWorking: false,
      latencyMs: PROBE_TIMEOUT_MS,
      lastChecked: Date.now(),
    }
  }
}

// ─── Probe em batch com concorrência limitada ────────
async function probeBatch(streams: Stream[]): Promise<Stream[]> {
  const results: Stream[] = []

  for (let i = 0; i < streams.length; i += MAX_CONCURRENT_PROBES) {
    const batch = streams.slice(i, i + MAX_CONCURRENT_PROBES)
    const batchResults = await Promise.all(batch.map(probeStream))
    results.push(...batchResults)
  }

  return results
}

// ─── Score de um stream (qualidade + latência + disponibilidade) ─
function streamScore(s: Stream): number {
  const qualityScore = (QUALITY_ORDER.length - QUALITY_ORDER.indexOf(s.quality)) * 30
  const workingScore = s.isWorking === true ? 40 : s.isWorking === false ? -999 : 0
  const latencyScore = s.latencyMs ? Math.max(0, 20 - Math.floor((s.latencyMs / 200))) : 10
  return qualityScore + workingScore + latencyScore
}

// ─── Health check completo de uma lista de canais ───
// Callback chamado a cada canal checado (para atualizar UI progressivamente)
export async function runHealthCheck(
  channels: Channel[],
  onChannelChecked?: (updated: Channel) => void
): Promise<Channel[]> {
  const updated: Channel[] = []

  for (const ch of channels) {
    if (ch.streams.length <= 1) {
      // Canal com único stream: probe rápido
      const [checkedStream] = await probeBatch(ch.streams)
      const updatedCh: Channel = {
        ...ch,
        streams: [checkedStream],
        activeStream: checkedStream,
      }
      updated.push(updatedCh)
      onChannelChecked?.(updatedCh)
      continue
    }

    // Canal com múltiplos streams: probe todos e re-ordena
    const checkedStreams = await probeBatch(ch.streams)
    const sortedStreams = [...checkedStreams].sort(
      (a, b) => streamScore(b) - streamScore(a)
    )

    const bestWorking = sortedStreams.find(s => s.isWorking !== false)
    const updatedCh: Channel = {
      ...ch,
      streams: sortedStreams,
      activeStream: bestWorking ?? sortedStreams[0],
    }

    updated.push(updatedCh)
    onChannelChecked?.(updatedCh)
  }

  const working = updated.filter(ch => ch.activeStream.isWorking !== false).length
  console.log(`[HealthCheck] ${working}/${updated.length} canais funcionando`)

  return updated
}

// ─── Health check leve: só o stream ativo ──────────
// Mais rápido, usado antes de dar play
export async function quickProbeActive(ch: Channel): Promise<boolean> {
  const result = await probeStream(ch.activeStream)
  return result.isWorking === true || result.isWorking === undefined
}
