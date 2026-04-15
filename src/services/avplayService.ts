// Tipos da API nativa Samsung AVPlay
// Referência: https://developer.samsung.com/smarttv/develop/api-references/samsung-product-api-references/avplay-api.html

interface AVPlayManager {
  open(url: string): void
  close(): void
  prepare(): void
  play(): void
  stop(): void
  pause(): void
  setDisplayRect(x: number, y: number, width: number, height: number): void
  setListener(listener: Partial<AVPlayListener>): void
  getState(): AVPlayState
}

interface AVPlayListener {
  onbufferingstart(): void
  onbufferingprogress(percent: number): void
  onbufferingcomplete(): void
  oncurrentplaytime(time: number): void
  onevent(eventType: string, eventData: string): void
  onerror(eventType: string): void
}

type AVPlayState = 'NONE' | 'IDLE' | 'READY' | 'PLAYING' | 'PAUSED'

interface WebAPIs {
  avplay: AVPlayManager
}

declare global {
  interface Window {
    webapis?: WebAPIs
  }
}

export function isAVPlayAvailable(): boolean {
  return !!(window.webapis?.avplay)
}

export function avplayLoad(
  url: string,
  onReady: () => void,
  onError: (msg: string) => void
): void {
  const avplay = window.webapis?.avplay
  if (!avplay) {
    onError('AVPlay não disponível neste dispositivo')
    return
  }

  try {
    avplay.open(url)
    avplay.setDisplayRect(0, 0, 1920, 1080)
    avplay.setListener({
      onbufferingcomplete: () => {
        avplay.play()
        onReady()
      },
      onerror: (eventType) => onError(`AVPlay error: ${eventType}`),
    })
    avplay.prepare()
  } catch (err) {
    onError(String(err))
  }
}

export function avplayStop(): void {
  try {
    window.webapis?.avplay.stop()
    window.webapis?.avplay.close()
  } catch {
    // ignora erros ao fechar
  }
}
