import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'

// ─── Samsung Tizen: fixa o canvas em 1920×1080 e escala para a TV ────────────
function adaptToScreen() {
  const TARGET_W = 1920
  const TARGET_H = 1080
  const scaleX = window.innerWidth  / TARGET_W
  const scaleY = window.innerHeight / TARGET_H
  const scale  = Math.min(scaleX, scaleY)

  const root = document.getElementById('root')
  if (!root) return

  root.style.width     = `${TARGET_W}px`
  root.style.height    = `${TARGET_H}px`
  root.style.transform = `scale(${scale})`
  root.style.transformOrigin = 'top left'
  root.style.overflow  = 'hidden'
  root.style.position  = 'absolute'
  root.style.top       = '0'
  root.style.left      = '0'

  // centraliza caso a TV tenha resolução maior
  const offsetX = (window.innerWidth  - TARGET_W * scale) / 2
  const offsetY = (window.innerHeight - TARGET_H * scale) / 2
  root.style.marginLeft = `${offsetX}px`
  root.style.marginTop  = `${offsetY}px`
}

adaptToScreen()
window.addEventListener('resize', adaptToScreen)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
