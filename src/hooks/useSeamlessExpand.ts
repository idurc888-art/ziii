import { useCallback } from 'react'
import { expandManager, type Rect } from '../services/expandManager'
import { playerManager } from '../services/PlayerManager'
import type { Channel } from '../types/channel'

interface ExpandOptions {
  cardId: string
  objectId: string
}

export function useSeamlessExpand({ cardId, objectId }: ExpandOptions) {

  const collapse = useCallback(() => {
    // 1. Volta estado React e CSS (fade-in da HUD)
    expandManager.markCollapsing()
    
    // 2. Comanda o PlayerManager para devolver a tag <object> à caixa original
    playerManager.collapseToCard()

    // 3. Aguarda pequenos milissegundos para estabilizar DOM e marca idle
    setTimeout(() => {
      expandManager.markIdle()
    }, 50)
  }, [])

  const expand = useCallback((channel: Channel, cardDOM: HTMLElement) => {
    // Só pode expandir se estiver no hardware real (AVPlay disponivel) e com player vivo
    if (!playerManager.isAvailable()) return

    const r = cardDOM.getBoundingClientRect()
    const startRect: Rect = { x: r.left, y: r.top, w: r.width, h: r.height }

    // Registra globalmente e aciona o Hide do React (opacity 0)
    expandManager.triggerExpand(channel, startRect, objectId, collapse)
    expandManager.markFullscreen() // Vai ativar o callback para opacity: 0 na HomeScreen imediatamente

    // Comanda a Placa de Vídeo para estourar o display rect
    playerManager.expandToFullscreen()
  }, [cardId, objectId, collapse])

  return { expand, collapse }
}
