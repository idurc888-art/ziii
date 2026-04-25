/**
 * Transition Loading Store — Estado global simples (sem Context React)
 * 
 * Controla o TransitionOverlay de forma sincronizada e de baixa latência.
 * Aparece em <16ms após chamada (sem ciclo de render React entre clique e overlay).
 */

interface OverlayState {
  visible: boolean
  backgroundImage: string
  message: string
}

type Listener = (state: OverlayState) => void

const state: OverlayState = {
  visible: false,
  backgroundImage: '',
  message: '',
}

const listeners: Set<Listener> = new Set()

function notify() {
  const snap = { ...state }
  listeners.forEach(fn => fn(snap))
}

export const transitionStore = {
  show(backgroundImage = '', message = '') {
    state.visible = true
    state.backgroundImage = backgroundImage
    state.message = message
    notify()
  },

  hide() {
    state.visible = false
    notify()
  },

  subscribe(fn: Listener) {
    listeners.add(fn)
    fn({ ...state }) // chama imediatamente com estado atual
    return () => listeners.delete(fn)
  },

  getState(): OverlayState {
    return { ...state }
  },
}
