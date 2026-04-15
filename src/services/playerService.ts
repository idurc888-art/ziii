// PlayerService — Orquestrador híbrido Shaka + AVPlay
// Responsabilidades:
//   1. Detectar backend correto por heurística da URL
//   2. Expor API unificada para PlayerScreen
//   3. Gerenciar cleanup cruzado entre backends

import { initShaka, playShaka, stopShaka, destroyShaka } from './shakaService'

export type BackendType = 'shaka' | 'avplay'
export type PlayerState = 'idle' | 'loading' | 'buffering' | 'playing' | 'error'

// ---------- Heurística de Roteamento ----------

export function selectPlayerBackend(url: string): BackendType {
  const lower = url.toLowerCase()

  // Manifestos adaptativos → Shaka
  if (lower.includes('.m3u8') || lower.includes('.mpd')) {
    const backend: BackendType = 'shaka'
    console.log(`[Router] backend=${backend} (manifest detectado)`)
    return backend
  }

  // Transport Stream explícito → AVPlay
  if (lower.includes('.ts')) {
    const backend: BackendType = 'avplay'
    console.log(`[Router] backend=${backend} (.ts detectado)`)
    return backend
  }

  // Heurística para streams XtreamCodes sem extensão
  if (lower.includes('output=ts') || lower.includes('/live/') || lower.includes('/movie/')) {
    const backend: BackendType = 'avplay'
    console.log(`[Router] backend=${backend} (xtream heuristic)`)
    return backend
  }

  // Default seguro: hardware nativo lida melhor com URLs opacas em TV
  const backend: BackendType = 'avplay'
  console.log(`[Router] backend=${backend} (default — url opaca)`)
  return backend
}

// ---------- API Unificada para PlayerScreen ----------

/**
 * Inicializa o backend Shaka e conecta ao <video> element.
 * Retorna o backend efetivo para que a PlayerScreen tome decisão de composição visual.
 */
export async function initPlayer(video: HTMLVideoElement): Promise<BackendType> {
  // AVPlay não usa <video> DOM — o roteamento final de chamadas fica na PlayerScreen
  // initPlayer aqui só é relevante quando o backend for Shaka
  await initShaka(video)
  return 'shaka'
}

/**
 * Carrega stream pelo Shaka Player.
 * Para AVPlay, a PlayerScreen chama avplayLoad() diretamente (composição separada).
 */
export async function loadStream(url: string): Promise<void> {
  // Stop cruzado antes de iniciar novo stream
  await stopShaka()
  await playShaka(url)
}

/**
 * Para e destroi o Shaka Player singleton.
 * Chamado no cleanup do PlayerScreen.
 */
export async function destroyPlayer(): Promise<void> {
  await destroyShaka()
}
