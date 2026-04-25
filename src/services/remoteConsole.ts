// Remote Console — intercepta console.* e envia via WebSocket para o PC
// Ativo apenas em modo dev ou quando VITE_REMOTE_LOG=true

const PC_IP = '10.0.0.103'
const WS_URL = `ws://${PC_IP}:9999`

let ws: WebSocket | null = null
let queue: string[] = []
let connected = false

function connect() {
  try {
    ws = new WebSocket(WS_URL)
    ws.onopen = () => {
      connected = true
      queue.forEach(m => ws!.send(m))
      queue = []
    }
    ws.onclose = () => {
      connected = false
      ws = null
      // Reconecta após 3s
      setTimeout(connect, 3000)
    }
    ws.onerror = () => { ws?.close() }
  } catch (_) {}
}

function send(level: string, args: unknown[]) {
  const msg = JSON.stringify({ level, args, ts: Date.now() })
  if (connected && ws) {
    try { ws.send(msg) } catch (_) { queue.push(msg) }
  } else {
    queue.push(msg)
  }
}

const LEVELS = ['log', 'info', 'warn', 'error', 'debug'] as const
const originals: Record<string, (...args: unknown[]) => void> = {}

LEVELS.forEach(level => {
  originals[level] = (console[level] as (...args: unknown[]) => void).bind(console)
  ;(console as any)[level] = (...args: unknown[]) => {
    originals[level](...args)
    send(level, args)
  }
})

// Captura erros não tratados
window.addEventListener('error', (e) => {
  send('error', [`[UNCAUGHT] ${e.message}`, `${e.filename}:${e.lineno}`])
})
window.addEventListener('unhandledrejection', (e) => {
  send('error', [`[PROMISE] ${String(e.reason)}`])
})

connect()
