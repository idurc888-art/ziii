/**
 * PlayerManager — Singleton Player externo (estilo Netflix)
 * Gerencia a instância global do AVPlay fora do ciclo de vida do React.
 * 
 * ARQUITETURA:
 * - isAVPlayBusy (Booleano Síncrono) para prevenir PLAYER_ERROR_INVALID_STATE (code: 11)
 * - Cancelamento fire-and-forget: sem promises bloqueando o event-loop!
 * - O <object> AVPlay NUNCA é movido no DOM (zero recomposição Chromium)
 */

import { Logger } from './LoggerService'

type PlayerState = 'IDLE' | 'OPENING' | 'PREPARING' | 'READY' | 'PLAYING' | 'STOPPING'

let isAVPlayBusy = false

export function safeRelease(avplay: any) {
  if (!avplay) return
  try { avplay.stop() } catch (_) {}
  try { avplay.close() } catch (_) {}
  isAVPlayBusy = false
}

class PlayerManager {
  private currentUrl: string | null = null
  // private mainUrl: string | null = null // Guardando histórico no código, removido hot-swap
  private state: PlayerState = 'IDLE'
  private debounceTimer: ReturnType<typeof setTimeout> | null = null
  private FOCUS_DELAY = 1500 // 1.5s após usuário parar na seta
  private avObject: HTMLObjectElement | null = null
  private GLOBAL_OBJECT_ID = 'avplay-global-preview'
  private manifestCache = new Map<string, Promise<any>>()

  constructor() {}

  public init(): void {
    if (this.avObject || typeof window === 'undefined') return
    
    this.avObject = document.createElement('object')
    this.avObject.id = this.GLOBAL_OBJECT_ID
    this.avObject.type = 'application/avplayer'
    // Âncora fixa no body: o setDisplayRect() posiciona a layer de hardware em cima disso.
    // NÃO mover este elemento — qualquer reflow pode dessincronizar o chip de vídeo.
    this.avObject.style.position = 'fixed'
    this.avObject.style.left = '0px'
    this.avObject.style.top = '0px'
    this.avObject.style.width = '1px'
    this.avObject.style.height = '1px'
    this.avObject.style.zIndex = '0'
    this.avObject.style.background = 'transparent'
    this.avObject.style.pointerEvents = 'none'
    document.body.appendChild(this.avObject)
    
    Logger.hw('INIT', 'Motor de vídeo inicializado (DOM Object criado)')
  }

  private getAV(): any {
    return (window as any).webapis?.avplay || null
  }

  public isAvailable(): boolean { return !!this.getAV() }
  public isPlaying(): boolean { return this.state === 'PLAYING' }
  public getCurrentUrl(): string | null { return this.currentUrl }
  public getGlobalObjectId(): string { return this.GLOBAL_OBJECT_ID }

  public prefetchManifest(url: string): void {
    if (!url || this.manifestCache.has(url)) return
    const p = fetch(url).then(() => {}).catch(() => { this.manifestCache.delete(url) })
    this.manifestCache.set(url, p)
  }

  // ─── Interface Pública Fire-and-Forget ────────────────────────────────

  public requestPlay(
    previewUrl: string,
    _mainUrl: string,
    // Aceita função para calcular rect DENTRO do debounce
    // Isso garante que getBoundingClientRect() é chamado DEPOIS da animação do card terminar
    getRectFn: () => { x: number; y: number; w: number; h: number },
    callbacks: {
      onPlaying: () => void
      onFirstFrameRendered: () => void
      onLoading: () => void
      onError: () => void
    }
  ): void {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer)
      this.debounceTimer = null
    }

    this.currentUrl = previewUrl

    this.debounceTimer = setTimeout(() => {
      // Calcula rect AGORA (após debounce de 1500ms, card já estabilizou)
      const rect = getRectFn()
      callbacks.onLoading()
      this.executePlay(previewUrl, rect, callbacks)
    }, this.FOCUS_DELAY)
  }

  private executePlay(
    url: string,
    rect: { x: number; y: number; w: number; h: number },
    callbacks: {
      onPlaying: () => void
      onFirstFrameRendered: () => void
      onError: () => void
    }
  ): void {
    const av = this.getAV()
    if (!av) return
    if (this.currentUrl !== url) return

    if (isAVPlayBusy) {
      Logger.hw('QUEUE', 'Player ocupado, abortando silenciosamente.')
      callbacks.onError()
      return
    }

    this.state = 'OPENING'
    isAVPlayBusy = true
    
    // Assegura estado limpo atômico (Sem async/await que trave CPU)
    try { av.stop() } catch (_) {}
    try { av.close() } catch (_) {}

    Logger.hw('STATE', `OPENING url=${url.substring(0, 60)}...`)
    
    try {
      av.open(url)
    } catch (e: any) {
      isAVPlayBusy = false
      this.state = 'IDLE'
      callbacks.onError()
      return
    }

    try { av.setStreamingProperty('INITIAL_BUFFER', '1000') } catch (_) {}
    try { av.setStreamingProperty('PENDING_BUFFER', '2000') } catch (_) {}
    try { av.setVolume(0) } catch (_) {}

    this.state = 'PREPARING'
    let isFirstFrameFired = false
    let lastTimeUpdate = 0

    try {
      av.setListener({
        onbufferingstart: () => {},
        onbufferingcomplete: () => {
          if (this.currentUrl !== url) return
          try { av.setVolume(40) } catch (_) {}
          callbacks.onPlaying()
        },
        onstreamcompleted: () => { 
          // Preview terminou — para naturalmente (sem loop)
          // Loop infinito causa crash no decoder da TV
          this.state = 'IDLE'
          isAVPlayBusy = false
        },
        oncurrentplaytime: (time: number) => {
          // Limita callbacks: só processa a cada 1 segundo
          // (dispara 60x/seg = sobrecarga de CPU)
          if (time - lastTimeUpdate < 1000) return
          lastTimeUpdate = time
          
          if (time > 100 && !isFirstFrameFired && this.state === 'PLAYING') {
            isFirstFrameFired = true
            callbacks.onFirstFrameRendered()
          }
        },
        onevent: () => {},
        onerror: () => {
          safeRelease(av)
          this.state = 'IDLE'
          callbacks.onError()
        },
      })
    } catch (_) {}

    try {
      av.prepareAsync(
        () => {
          if (this.currentUrl !== url) {
            safeRelease(av)
            this.state = 'IDLE'
            return
          }
          this.state = 'READY'
          
          try {
            // TIZEN: setDisplayRect() posiciona a layer de hardware.
            // Para não sofrer Webkit clipping em TVs antigas, o DOM object deve acompanhar os bounds também.
            if (this.avObject) {
              this.avObject.style.left = `${rect.x}px`
              this.avObject.style.top = `${rect.y}px`
              this.avObject.style.width = `${rect.w}px`
              this.avObject.style.height = `${rect.h}px`
            }
            av.setDisplayRect(rect.x, rect.y, rect.w, rect.h)
            this.lastPlayRect = { ...rect }
            try { av.setDisplayMethod('PLAYER_EXTERNAL_OUTPUT_MODE_NONE') } catch (_) {}
          } catch (e) {
            safeRelease(av)
            this.state = 'IDLE'
            return
          }

          try {
            av.play()
            this.state = 'PLAYING'
            isAVPlayBusy = false // hardware está reproduzindo; libera flag de open para não bloquear expand
            setTimeout(() => {
              if (this.state === 'PLAYING' && !isFirstFrameFired) {
                isFirstFrameFired = true
                callbacks.onFirstFrameRendered()
              }
            }, 500)
          } catch (e) {
            safeRelease(av)
            this.state = 'IDLE'
            callbacks.onError()
          }
        },
        () => {
          safeRelease(av)
          this.state = 'IDLE'
          callbacks.onError()
        }
      )
    } catch (e) {
      safeRelease(av)
      this.state = 'IDLE'
      callbacks.onError()
    }
  }

  // ─── Hardware-Accelerated Seamless Fullscreen ────────────────────────────

  private savedRect: { x: number; y: number; w: number; h: number } | null = null
  private lastPlayRect: { x: number; y: number; w: number; h: number } | null = null

  public expandToFullscreen(): void {
    const av = this.getAV()
    if (!av || (this.state !== 'READY' && this.state !== 'PLAYING')) return
    // Removido check isAVPlayBusy — se state é READY/PLAYING, pode expandir

    this.savedRect = this.lastPlayRect ? { ...this.lastPlayRect } : null
    try { av.setVolume(100) } catch (_) {}
    try {
      if (this.avObject) {
        this.avObject.style.left = '0px'
        this.avObject.style.top = '0px'
        this.avObject.style.width = '1920px'
        this.avObject.style.height = '1080px'
      }
      av.setDisplayRect(0, 0, 1920, 1080)
    } catch (_) {}

    // ESTRATÉGIA SD-TO-FHD (Hot-Swap) - APAGADO
    // Se o usuário quer que "volte e vá para tela cheia sem parar NENHUMA VEZ",
    // não podemos MATAR O CORPO PRINCIPAL DO Player (fechando SD pra trocar pra HD/4K)
    // Assim o preview engata em SD suave, e cresce na tela fluido sem pause de rede!
  }

  public collapseToCard(): void {
    const av = this.getAV()
    if (!av || this.state !== 'PLAYING' || !this.savedRect) return

    try { av.setVolume(40) } catch (_) {}
    try {
      if (this.avObject) {
        this.avObject.style.left = `${this.savedRect.x}px`
        this.avObject.style.top = `${this.savedRect.y}px`
        this.avObject.style.width = `${this.savedRect.w}px`
        this.avObject.style.height = `${this.savedRect.h}px`
      }
      av.setDisplayRect(this.savedRect.x, this.savedRect.y, this.savedRect.w, this.savedRect.h)
    } catch (_) {}
    this.savedRect = null
  }

  public cancelRequest(): void {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer)
      this.debounceTimer = null
    }
    this.currentUrl = null
    const av = this.getAV()
    
    if (av) {
      // Fire and forget - Libera Imediatamente o hardware!
      safeRelease(av)
      this.state = 'IDLE'
      
      // 1. Manda a camada de hardware do Tizen pro limbo absoluto
      try {
        av.setDisplayRect(-1000, -1000, 1, 1)
      } catch (_) {}
    }

    // 2. Tira o buraco negro da frente do React IMEDIATAMENTE
    if (this.avObject) {
      this.avObject.style.left = '-1000px'
      this.avObject.style.top = '-1000px'
      this.avObject.style.width = '1px'
      this.avObject.style.height = '1px'
    }
  }
}

export const playerManager = new PlayerManager()
