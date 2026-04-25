/**
 * Image Preloader Otimizado (Tizen / Chromium 63)
 * Evita engasgar a Main Thread não usando fetchPriority='high' (que sequer é suportado no Chrome 63).
 * Distribui a carga através de instâncias nativas de Image() e requestIdleCallback.
 */

// Polyfill seguro para requestIdleCallback
const requestIdleCallbackShim = 
  (window as any).requestIdleCallback || 
  function(cb: (deadline: { timeRemaining: () => number }) => void) {
    const start = Date.now()
    return setTimeout(() => {
      cb({
        timeRemaining: () => Math.max(0, 50 - (Date.now() - start))
      })
    }, 1)
  }

/**
 * Pré-carrega uma única imagem retornando Promise.
 */
export const preloadImage = (url: string): Promise<void> => {
  return new Promise((resolve) => {
    if (!url) {
      resolve()
      return
    }
    const img = new Image()
    img.onload = () => resolve()
    img.onerror = () => {
      console.warn(`[PRELOAD] Falha ao carregar imagem: ${url}`)
      resolve() // resolvemos para não travar Promise.all de imagens não-críticas
    }
    img.src = url
  })
}

/**
 * Carrega a bateria crítica de imagens simultaneamente e aguarda conclusão.
 * Utilizado ANTES de remover a Splash Screen.
 */
export const preloadCritical = async (urls: string[]): Promise<void> => {
  const validUrls = urls.filter(u => u && u.trim() !== '')
  if (validUrls.length === 0) return
  
  // @ts-ignore
  if (window.DEBUG) console.log(`[PRELOAD CRITICAL] Iniciando ${validUrls.length} imagens.`)
  
  await Promise.all(validUrls.map(preloadImage))
  
  // @ts-ignore
  if (window.DEBUG) console.log(`[PRELOAD CRITICAL] Finalizado.`)
}

/**
 * Pre-load serial de imagens restantes. 
 * Executado fora da thread principal para não concorrer com Decode/Render.
 */
export const preloadIdle = (urls: string[]): void => {
  const queue = urls.filter(u => u && u.trim() !== '')
  if (queue.length === 0) return
  
  // @ts-ignore
  if (window.DEBUG) console.log(`[PRELOAD IDLE] Enfileiradas ${queue.length} imagens em background.`)
  
  let i = 0
  
  const processNext = () => {
    // Processa o máximo de imagens possíveis na janela de inatividade do navegador,
    // mas com um sleep interno manual caso a TV seja muito rápida (para não estourar banda)
    if (i < queue.length) {
      const url = queue[i]
      i++
      
      const img = new Image()
      img.onload = () => {
        setTimeout(() => requestIdleCallbackShim(processNext), 50)
      }
      img.onerror = () => {
        setTimeout(() => requestIdleCallbackShim(processNext), 50)
      }
      img.src = url
    } else {
      // @ts-ignore
      if (window.DEBUG) console.log(`[PRELOAD IDLE] Concluído.`)
    }
  }
  
  requestIdleCallbackShim(processNext)
}
