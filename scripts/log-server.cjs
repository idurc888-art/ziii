#!/usr/bin/env node
// Servidor TCP puro — recebe logs da TV. Zero dependências.
// Uso: node scripts/log-server.js

const net = require('net')

const COLORS = {
  log:   '\x1b[37m',
  info:  '\x1b[36m',
  warn:  '\x1b[33m',
  error: '\x1b[31m',
  debug: '\x1b[35m',
  reset: '\x1b[0m',
}

// WebSocket handshake mínimo (sem lib)
const crypto = require('crypto')

function wsHandshake(socket, request) {
  const key = request.match(/Sec-WebSocket-Key: (.+)/i)?.[1]?.trim()
  if (!key) return false
  const accept = crypto.createHash('sha1')
    .update(key + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11')
    .digest('base64')
  socket.write(
    'HTTP/1.1 101 Switching Protocols\r\n' +
    'Upgrade: websocket\r\n' +
    'Connection: Upgrade\r\n' +
    `Sec-WebSocket-Accept: ${accept}\r\n\r\n`
  )
  return true
}

function decodeFrame(buf) {
  if (buf.length < 2) return null
  const masked = (buf[1] & 0x80) !== 0
  let len = buf[1] & 0x7f
  let offset = 2
  if (len === 126) { len = buf.readUInt16BE(2); offset = 4 }
  else if (len === 127) { len = Number(buf.readBigUInt64BE(2)); offset = 10 }
  if (buf.length < offset + (masked ? 4 : 0) + len) return null
  const mask = masked ? buf.slice(offset, offset + 4) : null
  offset += masked ? 4 : 0
  const payload = buf.slice(offset, offset + len)
  if (mask) for (let i = 0; i < payload.length; i++) payload[i] ^= mask[i % 4]
  return payload.toString('utf8')
}

const server = net.createServer((socket) => {
  const ip = socket.remoteAddress
  let handshakeDone = false
  let buf = Buffer.alloc(0)

  socket.on('data', (chunk) => {
    if (!handshakeDone) {
      const req = chunk.toString()
      if (req.includes('Upgrade: websocket')) {
        handshakeDone = wsHandshake(socket, req)
        if (handshakeDone) console.log(`\x1b[32m[TV conectada] ${ip}\x1b[0m`)
      }
      return
    }
    buf = Buffer.concat([buf, chunk])
    const text = decodeFrame(buf)
    if (!text) return
    buf = Buffer.alloc(0)
    try {
      const { level = 'log', args = [], ts } = JSON.parse(text)
      const color = COLORS[level] || COLORS.log
      const time = new Date(ts || Date.now()).toISOString().slice(11, 23)
      const msg = args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ')
      console.log(`${color}[${time}] [${level.toUpperCase()}] ${msg}${COLORS.reset}`)
    } catch { console.log('[TV RAW]', text) }
  })

  socket.on('close', () => console.log(`\x1b[33m[TV desconectada] ${ip}\x1b[0m`))
  socket.on('error', () => {})
})

server.listen(9999, '0.0.0.0', () => {
  console.log('\x1b[32m[log-server] Aguardando TV em ws://10.0.0.103:9999\x1b[0m\n')
})
