// AVPlay Service — API nativa Samsung Tizen
// Máquina de estados: NONE → open() → IDLE → prepareAsync() → READY → play() → PLAYING

const DEBUG = false
const DISPLAY = { x: 0, y: 0, w: 1920, h: 1080 }

export function isAVPlayAvailable(): boolean {
  const webapis = (window as any).webapis
  return !!(webapis && webapis.avplay)
}

export function avplayLoad(
  url: string,
  onSuccess: () => void,
  onError: (msg: string) => void
): void {
  if (!isAVPlayAvailable()) {
    console.log('[AVPlay DEV] PC — emulando sucesso.')
    setTimeout(onSuccess, 300)
    return
  }

  const avplay = (window as any).webapis.avplay

  try {
    // 1. Limpar estado anterior
    try { avplay.stop() } catch (_) {}
    try { avplay.close() } catch (_) {}

    // 2. NONE → IDLE
    avplay.open(url)
    console.log(`[AVPlay] open(${url.substring(0, 80)})`)

    // 3. ★ setDisplay ANTES do prepare — obrigtório para o hardware renderizar
    //    'PLAYER' = renderiza dentro do elemento de vídeo nativo (z-index abaixo do HTML)
    avplay.setDisplayMethod('PLAYER_EXTERNAL_OUTPUT')
    avplay.setDisplay('OVERLAY', document.getElementById('av-player') ?? document.body)
    avplay.setDisplayRect(DISPLAY.x, DISPLAY.y, DISPLAY.w, DISPLAY.h)
    console.log('[AVPlay] display configurado')

    // 4. Listeners
    avplay.setListener({
      onbufferingstart:    () => console.log('[AVPlay] buffering...'),
      onbufferingcomplete: () => console.log('[AVPlay] buffering ok'),
      onstreamcompleted:   () => console.log('[AVPlay] stream fim'),
      oncurrentplaytime:   (ms: number) => { if (DEBUG) console.log(`[AVPlay] ${ms}ms`) },
      onevent: (type: string, data: string) => console.log(`[AVPlay] event ${type} ${data}`),
      onerror: (errMsg: string) => {
        console.error('[AVPlay] erro nativo:', errMsg)
        onError(errMsg)
      },
    })

    // 5. IDLE → READY (assíncrono)
    avplay.prepareAsync(
      () => {
        console.log('[AVPlay] prepare OK')
        try {
          avplay.play()
          console.log('[AVPlay] play()')
          onSuccess()
        } catch (e: any) {
          onError(e?.message ?? 'Erro no play()')
        }
      },
      (err: any) => {
        console.error('[AVPlay] prepareAsync falhou:', err)
        onError(typeof err === 'string' ? err : 'Erro no prepareAsync')
      }
    )

  } catch (e: any) {
    const msg = e?.message ?? String(e)
    console.error('[AVPlay] exceção:', msg)
    onError(msg)
  }
}

export function avplayStop(): void {
  if (!isAVPlayAvailable()) return
  try {
    const avplay = (window as any).webapis.avplay
    avplay.stop()
    avplay.close()
    console.log('[AVPlay] stopped & closed')
  } catch (_) {}
}
