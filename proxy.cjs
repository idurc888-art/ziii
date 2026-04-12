const http = require('http');
const https = require('https');
const url = require('url');
const zlib = require('zlib');
const fs = require('fs');
const path = require('path');

// MIME types para servir arquivos locais
const MIME = {
  '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css',
  '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg', '.gif': 'image/gif', '.svg': 'image/svg+xml',
  '.webp': 'image/webp', '.ico': 'image/x-icon', '.woff2': 'font/woff2',
};

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': '*',
};

const server = http.createServer((req, res) => {
  const parsed = url.parse(req.url, true);
  const pathname = parsed.pathname;
  const query = parsed.query;

  // CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, CORS);
    res.end();
    return;
  }

  // =============================================
  // ROTA 1: /img?url=  — Proxy de imagens externas
  // =============================================
  if (pathname === '/img' && query.url) {
    const imgUrl = query.url;
    const proto = imgUrl.startsWith('https') ? https : http;

    proto.get(imgUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (imgRes) => {
      // Seguir redirects (301/302)
      if (imgRes.statusCode >= 300 && imgRes.statusCode < 400 && imgRes.headers.location) {
        const rProto = imgRes.headers.location.startsWith('https') ? https : http;
        rProto.get(imgRes.headers.location, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (rRes) => {
          const ct = rRes.headers['content-type'] || 'image/jpeg';
          res.writeHead(200, Object.assign({ 'Content-Type': ct, 'Cache-Control': 'public, max-age=86400' }, CORS));
          rRes.pipe(res);
        }).on('error', () => { res.writeHead(502, CORS); res.end('redirect error'); });
        return;
      }

      const ct = imgRes.headers['content-type'] || 'image/jpeg';
      res.writeHead(imgRes.statusCode, Object.assign({ 'Content-Type': ct, 'Cache-Control': 'public, max-age=86400' }, CORS));
      imgRes.pipe(res);
    }).on('error', (err) => {
      console.error('[IMG PROXY] Error:', imgUrl, err.message);
      res.writeHead(502, CORS);
      res.end('Image proxy error: ' + err.message);
    });
    return;
  }

  // ROTA 0: / — Serve index.html (apenas se não houver ?url=)
  if ((pathname === '/' || pathname === '/index.html') && !query.url) {
    const filePath = path.join(__dirname, 'index.html');
    if (fs.existsSync(filePath)) {
      res.writeHead(200, Object.assign({ 'Content-Type': 'text/html' }, CORS));
      res.end(fs.readFileSync(filePath));
      return;
    }
  }

  // ROTA 2: /static/  — Servir arquivos locais do dist/
  // =============================================
  if (pathname.startsWith('/static/')) {
    const filename = pathname.replace('/static/', '');
    const safeName = path.basename(filename); // Prevenir path traversal
    const filePath = path.join(__dirname, 'dist', safeName);

    if (fs.existsSync(filePath)) {
      const ext = path.extname(safeName).toLowerCase();
      const ct = MIME[ext] || 'application/octet-stream';
      const data = fs.readFileSync(filePath);
      res.writeHead(200, Object.assign({ 'Content-Type': ct, 'Cache-Control': 'public, max-age=3600' }, CORS));
      res.end(data);
      console.log('[STATIC] Serviu:', safeName, (data.length / 1024).toFixed(1), 'KB');
      return;
    }
    res.writeHead(404, CORS);
    res.end('File not found: ' + safeName);
    return;
  }

  // =============================================
  // ROTA 3: /channels — Servir índice de grupos
  // =============================================
  if (pathname === '/channels') {
    const file = path.join(__dirname, 'channels-chunks/index.json');
    if (fs.existsSync(file)) {
      const data = fs.readFileSync(file);
      res.writeHead(200, Object.assign({ 'Content-Type': 'application/json' }, CORS));
      res.end(data);
      console.log('Serviu index.json:', (data.length / 1024).toFixed(1), 'KB');
      return;
    }
  }

  // =============================================
  // ROTA 4: /channels/{file} — Servir chunk de grupo
  // =============================================
  if (pathname.startsWith('/channels/')) {
    const filename = pathname.replace('/channels/', '');
    const file = path.join(__dirname, 'channels-chunks', filename);
    if (fs.existsSync(file)) {
      const compressed = fs.readFileSync(file);
      const data = zlib.gunzipSync(compressed);
      res.writeHead(200, Object.assign({ 'Content-Type': 'application/json' }, CORS));
      res.end(data);
      console.log('Serviu chunk:', filename, '-', (data.length / 1024).toFixed(1), 'KB');
      return;
    }
  }

  // =============================================
  // ROTA 5: ?url= — Proxy genérico (streams IPTV)
  // =============================================
  const targetUrl = query.url;
  if (!targetUrl) {
    res.writeHead(200, Object.assign({ 'Content-Type': 'text/plain' }, CORS));
    res.end('ziiiTV Proxy v2.0 - Rotas: /channels, /img?url=, /static/{file}, ?url=');
    return;
  }

  console.log('Proxying stream:', targetUrl);
  const protocol = targetUrl.startsWith('https') ? https : http;

  protocol.get(targetUrl, (proxyRes) => {
    res.writeHead(200, Object.assign({
      'Content-Type': proxyRes.headers['content-type'] || 'application/x-mpegURL',
    }, CORS));
    proxyRes.pipe(res);
  }).on('error', (err) => {
    console.error('Error:', err.message);
    res.writeHead(500, CORS);
    res.end('Error: ' + err.message);
  });
});

const PORT = 3000;
server.listen(PORT, '0.0.0.0', () => {
  console.log('========================================');
  console.log('  ziiiTV Proxy v2.0 rodando na porta ' + PORT);
  console.log('========================================');
  console.log('  /channels       → lista de grupos');
  console.log('  /channels/{f}   → chunk de canais');
  console.log('  /img?url=       → proxy de imagens');
  console.log('  /static/{file}  → arquivos locais dist/');
  console.log('  ?url=           → proxy de streams');
  console.log('========================================');
});
