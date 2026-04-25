/**
 * AVPlay Card Manager — Singleton com fila de tarefas
 *
 * Toda operação nativa (open/close/stop/play) entra numa Promise chain.
 * Garante que nenhum open() sobrepõe um close() em andamento — elimina InvalidState.
 */

class AVPlayCardManager {
  private taskQueue: Promise<void> = Promise.resolve()
  private currentUrl: string | null = null
  private isOpen = false  // rastreia se av.open() foi chamado
  private avplay: any = null

  private getAV(): any {
    if (!this.avplay) this.avplay = (window as any).webapis?.avplay || null
    return this.avplay
  }

  public isAvailable(): boolean { return !!this.getAV() }

  private enqueue(name: string, fn: () => Promise<void> | void): void {
    this.taskQueue = this.taskQueue.then(async () => {
      try { await fn() } catch (e) {
        console.warn(`[CardMgr] erro em '${name}':`, e)
        this.emergencyReset()
      }
    })
  }

  private emergencyReset(): void {
    const av = this.getAV()
    if (!av) return
    try { av.stop()  } catch (_) {}
    try { av.close() } catch (_) {}
    this.currentUrl = null
    this.isOpen = false
  }

  /**
   * Solicita play de uma URL no rect do card.
   * Entra na fila — executa só após qualquer stop/close anterior terminar.
   */
  public requestPlay(
    url: string,
    rect: { x: number; y: number; w: number; h: number },
    callbacks: {
      onPlaying: () => void
      onError: () => void
      onVolume?: (v: number) => void
    }
  ): void {
    this.enqueue(`play:${url}`, async () => {
      const av = this.getAV()
      if (!av) return

      // Para qualquer coisa que esteja rodando
      if (this.isOpen) {
        try { av.stop()  } catch (_) {}
        try { av.close() } catch (_) {}
        this.isOpen = false
      }

      this.currentUrl = url
      av.open(url)
      this.isOpen = true
      // Buffer mínimo = TTFF mais rápido no card
      try { av.setStreamingProperty('INITIAL_BUFFER', '1000') } catch (_) {}
      try { av.setStreamingProperty('PENDING_BUFFER',  '2000') } catch (_) {}
      try { av.setVolume(0) } catch (_) {} // sem áudio no preview = menos CPU
      av.setDisplayRect(rect.x, rect.y, rect.w, rect.h)
      try { av.setDisplayMethod('PLAYER_EXTERNAL_OUTPUT_MODE_NONE') } catch (_) {}

      return new Promise<void>((resolve) => {
        av.setListener({
          onbufferingstart:    () => {},
          onbufferingcomplete: () => {
            if (this.currentUrl !== url) { resolve(); return }
            try { av.setVolume(40) } catch (_) {}
            callbacks.onPlaying()
            resolve()
          },
          onstreamcompleted: () => { try { av.seekTo(0); av.play() } catch (_) {} },
          oncurrentplaytime: () => {},
          onevent:           () => {},
          onerror:           () => { callbacks.onError(); resolve() },
        })

        av.prepareAsync(
          () => {
            if (this.currentUrl !== url) {
              try { av.stop(); av.close() } catch (_) {}
              this.currentUrl = null
              resolve()
              return
            }
            try { 
              av.play()
              // Pula para 4 minutos do vídeo (240.000 ms) para pegar a "ação" da cena
              try { av.seekTo(240000) } catch (_) {}
            } catch (e) { callbacks.onError(); resolve() }
          },
          () => { callbacks.onError(); resolve() }
        )
      })
    })
  }

  /**
   * Para o player. Entra na fila — executa após qualquer play em andamento.
   */
  public requestStop(): void {
    this.enqueue('stop', () => {
      this.currentUrl = null
      const av = this.getAV()
      if (!av || !this.isOpen) return
      try { av.stop()  } catch (_) {}
      try { av.close() } catch (_) {}
      this.isOpen = false
    })
  }

  public getCurrentUrl(): string | null { return this.currentUrl }

  /** Compatibilidade com useSeamlessExpand */
  public isController(_cardId: string): boolean {
    return this.currentUrl !== null
  }
}

export const avplayCardManager = new AVPlayCardManager()
