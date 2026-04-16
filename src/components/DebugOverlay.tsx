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
  const [visible, setVisible] = useState(true)
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
      if (e.key === 'F1' || e.keyCode === 403) {
        e.preventDefault()
        setVisible(v => !v)
      }
      // F2 ou botão verde (404) = limpar
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

  if (!visible) {
    return (
      <div style={{
        position: 'fixed',
        top: '10px',
        right: '10px',
        background: 'rgba(0,0,0,0.7)',
        color: '#0f0',
        padding: '8px 12px',
        borderRadius: '4px',
        fontSize: '12px',
        zIndex: 9999,
        pointerEvents: 'none'
      }}>
        Debug: OFF (F1)
      </div>
    )
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      right: 0,
      width: '500px',
      height: '100vh',
      background: 'rgba(0, 0, 0, 0.92)',
      borderLeft: '2px solid #0f0',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 9999,
      pointerEvents: 'none',
      fontFamily: 'monospace'
    }}>
      {/* Header */}
      <div style={{
        padding: '8px 12px',
        background: '#0f0',
        color: '#000',
        fontSize: '12px',
        fontWeight: 'bold',
        display: 'flex',
        justifyContent: 'space-between'
      }}>
        <span>DEBUG OVERLAY</span>
        <span>F1:Hide F2:Clear</span>
      </div>

      {/* Logs */}
      <div 
        ref={scrollRef}
        style={{
          flex: 1,
          overflow: 'auto',
          padding: '8px',
          fontSize: '11px',
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

      {/* Footer */}
      <div style={{
        padding: '6px 12px',
        background: '#111',
        color: '#666',
        fontSize: '10px',
        borderTop: '1px solid #333'
      }}>
        {logs.length}/{MAX_LOGS} logs
      </div>
    </div>
  )
}
