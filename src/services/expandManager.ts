/**
 * Expand Manager — Singleton
 * 
 * Gerencia o estado global de expansão do AVPlay.
 * Permite que componentes (App, HomeScreen, Overlay) saibam se ocorreu fullscreen.
 */

import type { Channel } from '../types/channel'

export type ExpandState = 'idle' | 'expanding' | 'fullscreen' | 'collapsing'

export interface Rect {
  x: number; y: number; w: number; h: number
}

type Listener = (state: ExpandState, channel: Channel | null) => void
type DisplayToggle = (visible: boolean) => void

class ExpandManager {
  private state: ExpandState = 'idle'
  private channel: Channel | null = null
  private originRect: Rect | null = null
  private objectId: string | null = null
  
  private listeners: Set<Listener> = new Set()
  private displayCallbacks: Set<DisplayToggle> = new Set() // Para HomeScreen display:none

  // Reference for the useSeamlessExpand hook's collapse function
  private collapseHandler: (() => void) | null = null

  public getState() { return this.state }
  public getChannel() { return this.channel }
  public getOriginRect() { return this.originRect }
  public getObjectId() { return this.objectId }
  public isExpanded() { return this.state === 'fullscreen' || this.state === 'expanding' }
  public isSeamlessActive() { return this.state !== 'idle' }

  public subscribe(fn: Listener) {
    this.listeners.add(fn)
    fn(this.state, this.channel)
    return () => this.listeners.delete(fn)
  }

  public registerDisplayCallback(fn: DisplayToggle) {
    this.displayCallbacks.add(fn)
    return () => this.displayCallbacks.delete(fn)
  }

  private notify() {
    this.listeners.forEach(fn => fn(this.state, this.channel))
  }

  /**
   * Chamado unicamente pelo useSeamlessExpand quando o usuário aperta Enter no Card.
   */
  public triggerExpand(channel: Channel, rect: Rect, objectId: string, collapseFn: () => void) {
    this.channel = channel
    this.originRect = rect
    this.objectId = objectId
    this.collapseHandler = collapseFn
    this.state = 'expanding'
    this.notify()
  }

  /**
   * Chamado globalmente no App.tsx ao pressionar BACK.
   * Aciona a função de callback real armazenada pelo useSeamlessExpand.
   */
  public triggerCollapse() {
    if (this.collapseHandler) {
      this.collapseHandler()
    }
  }

  /**
   * Chamados pelo useSeamlessExpand para sinalizar progressos da animação.
   */
  public markFullscreen() {
    this.state = 'fullscreen'
    this.notify()
    // Liberar RAM: display none nos componentes pesados
    this.displayCallbacks.forEach(fn => fn(false))
  }

  public markCollapsing() {
    this.state = 'collapsing'
    this.notify()
    // Retornar DOM: display block antes de iniciar tween
    this.displayCallbacks.forEach(fn => fn(true))
  }

  public markIdle() {
    this.state = 'idle'
    this.channel = null
    this.originRect = null
    this.objectId = null
    this.collapseHandler = null
    this.notify()
  }
}

export const expandManager = new ExpandManager()
