import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <div style={{ color: '#0f0', fontSize: '48px', padding: '50px' }}>
      React montou na TV
    </div>
  </StrictMode>
)
