// Shaka Player Service — Singleton real com buffer tuning enterprise
// Shaka 5.x é UMD global → acessado via window.shaka (injetado pelo vite.config)
// Tizen 5.0 / Chromium 69 — polyfills obrigatórios

const DEBUG = false

const BUFFER_CONFIG = {
  streaming: {
    bufferingGoal: 30,
    rebufferingGoal: 5,
    bufferBehind: 10,
  },
  abr: {
    defaultBandwidthEstimate: 5_000_000, // 5 Mbps — começa alto, desce se rede fraqueja
  },
}

// Shaka é exposto como global UMD pela build compilada
function getShakaGlobal(): any {
  return (window as any).shaka
}

let player: any = null
let videoEl: HTMLVideoElement | null = null

export async function initShaka(video: HTMLVideoElement): Promise<void> {
  if (player) {
    console.log('[Shaka] attached to #video-layer (singleton reutilizado)')
    return
  }

  const shaka = getShakaGlobal()

  if (!shaka) {
    throw new Error('[Shaka] window.shaka não encontrado — script não carregado?')
  }

  shaka.polyfill.installAll()

  if (!shaka.Player.isBrowserSupported()) {
    throw new Error('[Shaka] MSE não suportado neste browser/TV')
  }

  videoEl = video
  player = new shaka.Player(video)
  player.configure(BUFFER_CONFIG)

  player.addEventListener('error', (e: any) => {
    console.error('[Shaka] Erro de playback:', e.detail?.code, e.detail?.message)
  })

  console.log('[Shaka] attached to #video-layer')
  if (DEBUG) console.log('[Shaka] buffer config:', JSON.stringify(BUFFER_CONFIG))
}

export async function playShaka(url: string): Promise<void> {
  if (!player || !videoEl) throw new Error('[Shaka] initShaka() não foi chamado')

  if (DEBUG) console.log('[Shaka] load:', url)
  await player.load(url)
  await videoEl.play()
  console.log('[Shaka] playing')
}

export async function stopShaka(): Promise<void> {
  if (!player) return
  try {
    await player.unload()
    if (DEBUG) console.log('[Shaka] unloaded')
  } catch { /* unload pode falhar se não havia stream ativo */ }
}

export async function destroyShaka(): Promise<void> {
  if (!player) return
  await player.destroy()
  player = null
  videoEl = null
  console.log('[Shaka] destroyed')
}
