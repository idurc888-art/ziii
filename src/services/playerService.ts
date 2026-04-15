import shaka from 'shaka-player/dist/shaka-player.compiled'

function hasMSE(): boolean {
  return !!(window.MediaSource || (window as unknown as Record<string, unknown>)['WebKitMediaSource'])
}

export function detectStreamType(url: string): 'hls' | 'dash' | 'unknown' {
  if (url.includes('.m3u8')) return 'hls'
  if (url.includes('.mpd')) return 'dash'
  return 'unknown'
}

export function selectPlayerBackend(url: string): 'shaka' | 'avplay' {
  if (url.includes('.m3u8') || url.includes('.mpd')) return 'shaka'
  return 'avplay'
}

let player: shaka.Player | null = null

export async function initPlayer(videoEl: HTMLVideoElement): Promise<'shaka' | 'avplay'> {
  if (!hasMSE()) return 'avplay'

  shaka.polyfill.installAll()
  if (!shaka.Player.isBrowserSupported()) return 'avplay'

  if (player) {
    await player.detach()
    await player.destroy()
  }

  player = new shaka.Player()
  await player.attach(videoEl)
  player.configure({
    streaming: { bufferingGoal: 30, rebufferingGoal: 2, bufferBehind: 10 },
    abr: { enabled: true, defaultBandwidthEstimate: 5_000_000 },
  })

  return 'shaka'
}

export async function loadStream(url: string): Promise<void> {
  if (!player) throw new Error('Player não inicializado')
  console.log('LOAD STREAM', url)
  try {
    await player.load(url)
  } catch (err) {
    console.error('SHAKA LOAD ERROR', err)
    throw err
  }
}

export async function destroyPlayer(): Promise<void> {
  if (!player) return
  await player.destroy()
  player = null
}
