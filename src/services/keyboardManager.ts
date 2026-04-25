/**
 * Keyboard Manager (Maestro)
 * 
 * Substitui múltiplos `window.addEventListener('keydown')` disparados
 * simultaneamente no React por um Singleton genérico, reduzindo overhead 
 * de CPU no Chromium 63 no Tizen.
 */

type KeyHandler = (e: KeyboardEvent) => void;

import { loadingObserver } from './loadingObserver'

class KeyboardManager {
  private handlers: Map<string, KeyHandler> = new Map();
  private isListening = false;

  private activeView: string | null = null;

  public setActiveView(viewPath: string) {
    this.activeView = viewPath;
  }

  private handleKeyDown = (e: KeyboardEvent) => {
    // Input Lock: se o sistema estiver operando algo pesado (ex: boot/build), ignora entrada.
    if (loadingObserver.isLocked()) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    this.handlers.forEach((handler, id) => {
      // Repassa o evento se for um handler global (começa com 'global:')
      // Ou se o handler_id iniciar com a activeView atual (ex: 'home' aciona 'home:main' e 'home:hero')
      if (id.startsWith('global:') || (this.activeView && id.startsWith(this.activeView))) {
        handler(e);
      }
    });
  };

  /**
   * Ativa a escuta global no Document. Deve ser chamado no App.tsx.
   */
  public init() {
    if (!this.isListening) {
      document.addEventListener('keydown', this.handleKeyDown);
      this.isListening = true;
    }
  }

  /**
   * Destrói a escuta.
   */
  public destroy() {
    if (this.isListening) {
      document.removeEventListener('keydown', this.handleKeyDown);
      this.isListening = false;
    }
  }

  /**
   * Inscreve um componente para receber os eventos.
   * @param id Identificador único (ex: 'global:app', 'home:main', 'home:hero', 'player')
   * @param handler Função que receberá o KeyboardEvent
   */
  public subscribe(id: string, handler: KeyHandler) {
    this.handlers.set(id, handler);
  }

  /**
   * Remove a inscrição de um componente.
   */
  public unsubscribe(id: string) {
    this.handlers.delete(id);
  }
}

export const keyboardMaestro = new KeyboardManager();
