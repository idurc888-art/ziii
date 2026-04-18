import { useEffect, useState, useRef } from 'react'

interface LogEntry {
  time: string
  level: 'log' | 'warn' | 'error' | 'info'
  tag: string
  message: string
}

const MAX_LOGS = 150
const BATCH_INTERVAL = 100 // ms

export default function DebugOverlay() {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const logsRef = useRef<LogEntry[]>([])
  const batchRef = useRef<LogEntry[]>([])
  const timerRef = useRef<any>(undefined)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Intercepta console
    const originalLog = console.log
    const originalWarn = console.warn
    const originalError = console.error

    const addLog = (level: LogEntry['level'], args: any[]) => {
      const now = new Date()
      const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`
      
      let tag = 'App'
      let message = args.map(a => {
        if (typeof a === 'object') return JSON.stringify(a, null, 0).substring(0, 200)
        return String(a)
      }).join(' ')

      // Extrai tag de mensagens tipo "[Tag] mensagem"
      const tagMatch = message.match(/^\[([^\]]+)\]/)
      if (tagMatch) {
        tag = tagMatch[1]
        message = message.substring(tagMatch[0].length).trim()
      }

      const entry: LogEntry = { time, level, tag, message }
      
      batchRef.current.push(entry)
      
      // Agenda flush
      if (!timerRef.current) {
        timerRef.current = window.setTimeout(() => {
          const newLogs = [...logsRef.current, ...batchRef.current].slice(-MAX_LOGS)
          logsRef.current = newLogs
          setLogs(newLogs)
          batchRef.current = []
          timerRef.current = undefined
          
          // Auto-scroll
          requestAnimationFrame(() => {
            if (scrollRef.current) {
              scrollRef.current.scrollTop = scrollRef.current.scrollHeight
            }
          })
        }, BATCH_INTERVAL)
      }
    }

    console.log = (...args) => {
      originalLog(...args)
      addLog('log', args)
    }

    console.warn = (...args) => {
      originalWarn(...args)
      addLog('warn', args)
    }

    console.error = (...args) => {
      originalError(...args)
      addLog('error', args)
    }

    // Teclas de controle
    const onKey = (e: KeyboardEvent) => {
      // F1 ou botão vermelho (403) = toggle
      // F1 = toggle overlay
      if (e.key === 'F1' || e.keyCode === 403) {
        e.preventDefault()
        setIsOpen((v: boolean) => !v)
      }
      // F2 = limpar logs
      if (e.key === 'F1' || e.keyCode === 403) {
        e.preventDefault()
        setIsOpen(prev => !prev)
      }
      // F2 = limpar logs
      if (e.key === 'F2' || e.keyCode === 404) {
        e.preventDefault()
        logsRef.current = []
        batchRef.current = []
        setLogs([])
      }
    }
    document.addEventListener('keydown', onKey)

    return () => {
      console.log = originalLog
      console.warn = originalWarn
      console.error = originalError
      document.removeEventListener('keydown', onKey)
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  // Botão retraído (lateral direita)
  if (!isOpen) {
    return (
      <div style={{
        position: 'fixed',
        top: '50%',
        right: 0,
        transform: 'translateY(-50%)',
        background: 'rgba(0,0,0,0.8)',
        color: '#0f0',
        padding: '20px 8px',
        fontSize: '14px',
        zIndex: 9999,
        cursor: 'pointer',
        borderTopLeftRadius: '8px',
        borderBottomLeftRadius: '8px',
        writingMode: 'vertical-rl',
        textOrientation: 'mixed',
        fontWeight: 'bold',
        border: '2px solid #0f0',
        borderRight: 'none'
      }} onClick={() => setIsOpen(true)}>
        DEBUG LOGS ({logs.length})
      </div>
    )
  }

  // Painel aberto (lateral direita)
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      right: 0,
      width: '400px',
      height: '100vh',
      background: 'rgba(0,0,0,0.95)',
      color: '#0f0',
      fontFamily: 'monospace',
      fontSize: '11px',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      borderLeft: '2px solid #0f0',
      animation: 'slideInRight 200ms ease-out'
    }}>
      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
      
      <div style={{
        padding: '10px',
        background: '#000',
        borderBottom: '1px solid #0f0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <span style={{ fontWeight: 'bold' }}>DEBUG LOGS ({logs.length})</span>
        <button 
          onClick={() => setIsOpen(false)}
          style={{
            background: '#0f0',
            color: '#000',
            border: 'none',
            padding: '4px 12px',
            cursor: 'pointer',
            fontWeight: 'bold',
            borderRadius: '4px'
          }}>
          FECHAR
        </button>
      </div>

      <div 
        ref={scrollRef}
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '10px',
          lineHeight: '1.4'
        }}
      >
        {logs.map((log, i) => (
          <div 
            key={i}
            style={{
              marginBottom: '4px',
              color: log.level === 'error' ? '#f00' : log.level === 'warn' ? '#fa0' : '#0f0',
              wordBreak: 'break-word'
            }}
          >
            <span style={{ color: '#666' }}>{log.time}</span>
            {' '}
            <span style={{ 
              color: log.level === 'error' ? '#f00' : log.level === 'warn' ? '#fa0' : '#0af',
              fontWeight: 'bold'
            }}>
              [{log.tag}]
            </span>
            {' '}
            {log.message}
          </div>
        ))}
      </div>

      <div style={{
        padding: '6px 12px',
        background: '#111',
        color: '#666',
        fontSize: '10px',
        borderTop: '1px solid #333'
      }}>
        {logs.length}/{MAX_LOGS} logs • F1: Toggle • F2: Clear
      </div>
    </div>
  )
}
