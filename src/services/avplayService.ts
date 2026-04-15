// AVPlay Service — API nativa Samsung Tizen
// Máquina de estados: NONE → open() → IDLE → prepareAsync() → READY → play() → PLAYING
// Em DEV (PC), opera apenas em modo log (sem crash)

const DEBUG = false

export function isAVPlayAvailable(): boolean {
  const webapis = (window as any).webapis
  return !!(webapis && webapis.avplay)
}

// ★ objectId: id do <object type="application/avplayer"> no DOM
//   O AVPlay precisa de um elemento DOM como âncora para renderizar o vídeo.
//   Sem isso o vídeo vai para fullscreen nativo SEM composição com o HTML.
export function avplayLoad(
  url: string,
  objectId: string,
  onSuccess: () => void,
  onError: (msg: string) => void
): void {
  if (!isAVPlayAvailable()) {
    console.log('[AVPlay DEV] PC — API nativa indisponível, simulando sucesso.')
    setTimeout(onSuccess, 300)
    return
  }

  const avplay = (window as any).webapis.avplay

  try {
    // 1. Parar qualquer reprodução anterior
    try { avplay.stop(); avplay.close() } catch { /* ignorar */ }

    // 2. NONE → IDLE
    avplay.open(url)
    console.log(`[AVPlay] open OK — ${url.substring(0, 80)}`)

    // 3. ★ Vincular ao elemento <object> no DOM ANTES do prepare
    //    setDisplayRect(x, y, w, h) define a área de renderização
    //    correspondente à posição do <object> na tela (0,0,1920,1080 = fullscreen)
    avplay.setDisplayRect(0, 0, 1920, 1080)
    console.log('[AVPlay] setDisplayRect(0,0,1920,1080)')

    // 4. ★ setDisplayMethod DEVE ser chamado antes do prepare
    //    'PLAYER_EXTERNAL_OUTPUT_MODE_NONE' = renderiza dentro do elemento âncora
    //    sem ocupar toda a tela nativa — isso permite que HTML fique por cima
    try {
      avplay.setDisplayMethod('PLAYER_EXTERNAL_OUTPUT_MODE_NONE')
      console.log('[AVPlay] setDisplayMethod: PLAYER_EXTERNAL_OUTPUT_MODE_NONE')
    } catch (e) {
      // Alguns modelos não suportam esse modo — ignora e continua
      console.warn('[AVPlay] setDisplayMethod falhou (ignorado):', e)
    }

    // 5. Registrar listeners
    avplay.setListener({
      onbufferingstart:    () => console.log('[AVPlay] buffering...'),
      onbufferingcomplete: () => console.log('[AVPlay] buffering OK'),
      onstreamcompleted:   () => console.log('[AVPlay] stream ended'),
      oncurrentplaytime:   (ms: number) => { if (DEBUG) console.log(`[AVPlay] ${ms}ms`) },
      onevent:             (type: string, data: string) => console.log(`[AVPlay] event: ${type} ${data}`),
      onerror:             (errMsg: string) => { console.error('[AVPlay] erro:', errMsg); onError(errMsg) },
    })

    // 6. IDLE → READY (assíncrono)
    avplay.prepareAsync(
      () => {
        console.log('[AVPlay] prepareAsync OK → play()')
        try {
          avplay.play()
          onSuccess()
        } catch (playErr: any) {
          console.error('[AVPlay] play() falhou:', playErr?.message ?? playErr)
          onError(playErr?.message ?? 'Erro ao iniciar play')
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
  } catch { /* ignorar */ }
}
