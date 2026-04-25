import { createRoot } from 'react-dom/client'
import './services/remoteConsole'
import App from './App.tsx'

// ★ Samsung Tizen: adaptToScreen deve ser chamado antes do primeiro render
// Fonte: Samsung Developer Docs — Launch Time Optimization
const tizen = (window as any).tizen
try { tizen?.tvwindow?.getAvailableWindows?.() } catch (_) {}
try {
  const webapis = (window as any).webapis
  webapis?.productinfo?.getRealModel && webapis.productinfo.getRealModel()
} catch (_) {}

// StrictMode REMOVIDO: em Tizen causa duplo mount → duplo init de AVPlay/Shaka
createRoot(document.getElementById('root')!).render(<App />)
