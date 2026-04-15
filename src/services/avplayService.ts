// AVPlay Service — API nativa Samsung Tizen
// Máquina de estados AVPlay: NONE → open() → IDLE → prepareAsync() → READY → play() → PLAYING
// Em DEV (PC), opera apenas em modo log (sem crash)

const DEBUG = false

// Resolução fixa Tizen para setDisplayRect
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
    console.log('[AVPlay DEV] Sandbox de PC. API nativa inacessível — emulando sucesso.')
    setTimeout(onSuccess, 300)
    return
  }

  const avplay = (window as any).webapis.avplay

  try {
    // 1. Limpar estado anterior (se houver)
    try {
      avplay.stop()
      avplay.close()
    } catch {
      // Ignorar — pode não ter nada aberto
    }

    // 2. NONE → IDLE
    avplay.open(url)
    console.log(`[AVPlay] open(${url.substring(0, 80)}...)`)

    // 3. Configurar display ANTES do prepare
    avplay.setDisplayRect(DISPLAY.x, DISPLAY.y, DISPLAY.w, DISPLAY.h)
    console.log(`[AVPlay] setDisplayRect(${DISPLAY.x},${DISPLAY.y},${DISPLAY.w},${DISPLAY.h})`)

    // 4. Registrar listeners ANTES do prepare
    avplay.setListener({
      onbufferingstart: () => {
        console.log('[AVPlay] buffering...')
      },
      onbufferingcomplete: () => {
        console.log('[AVPlay] buffering complete')
      },
      onstreamcompleted: () => {
        console.log('[AVPlay] stream completed')
      },
      oncurrentplaytime: (ms: number) => {
        if (DEBUG) console.log(`[AVPlay] time: ${ms}ms`)
      },
      onevent: (type: string, data: string) => {
        console.log(`[AVPlay] event: ${type} ${data}`)
      },
      onerror: (errMsg: string) => {
        console.error('[AVPlay] erro nativo:', errMsg)
        onError(errMsg)
      },
    })

    // 5. IDLE → READY (assíncrono)
    avplay.prepareAsync(
      () => {
        // Prepare concluído com sucesso → READY
        console.log('[AVPlay] prepare OK → playing')

        try {
          // 6. READY → PLAYING
          avplay.play()
          console.log('[AVPlay] play() acionado')
          onSuccess()
        } catch (playErr: any) {
          console.error('[AVPlay] erro no play():', playErr?.message ?? playErr)
          onError(playErr?.message ?? 'Erro ao iniciar play')
        }
      },
      (err: any) => {
        // Prepare falhou
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
  } catch {
    // Ignorar erros de stop quando nada estava tocando
  }
}
