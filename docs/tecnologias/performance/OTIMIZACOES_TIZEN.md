# Performance e Otimizações para Tizen

## Limitações de Hardware

### TV Alvo (UN50RU7100GXZD - 2019)
- **CPU:** Quad-core ARM (1.3 GHz)
- **RAM:** 1.5 GB (compartilhada com sistema)
- **GPU:** Mali-G51 (OpenGL ES 3.2)
- **Chromium:** 63 (ES6 completo, mas sem features modernas)

### Gargalos Comuns
1. **RAM limitada** — 1.5 GB total, ~800 MB disponível para app
2. **CPU fraca** — JavaScript pesado trava UI
3. **GPU limitada** — animações CSS complexas causam lag
4. **Rede instável** — buffering frequente em streams

## Estratégias de Otimização

### 1. Bundle Size

#### Problema
- Vite 8 + Rolldown gera código incompatível com Chromium 63
- Bundle grande (>500 KB) demora para parsear na TV

#### Solução
```javascript
// vite.config.ts
export default defineConfig({
  plugins: [
    react(),
    legacy({
      targets: ['chrome >= 56'],
      additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
    }),
  ],
  build: {
    target: ['es2015', 'chrome56'],
    cssCodeSplit: false,
    minify: 'terser',
    terserOptions: {
      compress: { ecma: 2015 },
      output: { ecma: 2015 },
    },
  },
})
```

#### Resultado
- Bundle moderno: ~314 KB
- Bundle legacy: ~321 KB (com polyfills)
- Polyfills separados: ~102 KB

### 2. Rendering

#### Problema
- React re-renderiza componentes desnecessariamente
- Listas grandes (1000+ canais) travam scroll

#### Solução

```javascript
// React.memo para componentes pesados
const MemoizedCard = React.memo(({ channel }) => {
  return <Card channel={channel} />
}, (prev, next) => {
  // Re-renderiza só se canal mudou
  return prev.channel.id === next.channel.id
})

// Virtualização de listas
import { FixedSizeList } from 'react-window'

<FixedSizeList
  height={600}
  itemCount={channels.length}
  itemSize={150}
  width="100%"
>
  {({ index, style }) => (
    <div style={style}>
      <Card channel={channels[index]} />
    </div>
  )}
</FixedSizeList>
```

### 3. Animações CSS

#### Problema
- `width`, `height`, `left`, `right` causam reflow (lento)
- Animações complexas travam em 30 FPS

#### Solução

```css
/* ❌ EVITAR - causa reflow */
.card {
  transition: width 300ms, left 300ms;
}

/* ✅ USAR - GPU-accelerated */
.card {
  transition: transform 300ms, opacity 300ms;
  will-change: transform;
}

/* Força compositing layer */
.card {
  transform: translate3d(0, 0, 0);
}
```

### 4. Imagens

#### Problema
- Imagens grandes (backdrop 1920x1080) consomem RAM
- Carregamento síncrono trava UI

#### Solução

```javascript
// Preload crítico (primeiras 6 imagens)
async function preloadCritical(urls) {
  const promises = urls.slice(0, 6).map(url => {
    return new Promise((resolve) => {
      const img = new Image()
      img.onload = resolve
      img.onerror = resolve
      img.src = url
    })
  })
  await Promise.all(promises)
}

// Preload idle (restante em background)
function preloadIdle(urls) {
  requestIdleCallback(() => {
    urls.forEach(url => {
      const img = new Image()
      img.src = url
    })
  })
}
```

### 5. IndexedDB

#### Problema
- Operações síncronas travam UI
- Quota limitada (~50 MB em algumas TVs)

#### Solução

```javascript
// Singleton pattern - uma instância por sessão
let dbInstance = null

async function getDB() {
  if (dbInstance) return dbInstance
  
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('ziiiTV', 1)
    
    request.onsuccess = () => {
      dbInstance = request.result
      resolve(dbInstance)
    }
    
    request.onerror = () => reject(request.error)
  })
}

// Operações assíncronas
async function savePlaylist(url, data) {
  const db = await getDB()
  const tx = db.transaction('playlists', 'readwrite')
  const store = tx.objectStore('playlists')
  
  return new Promise((resolve, reject) => {
    const request = store.put({ url, data, timestamp: Date.now() })
    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
  })
}
```

### 6. Web Workers

#### Problema
- Parse de M3U grande (10k+ canais) trava UI por segundos
- Chromium 63 não suporta `type: 'module'` em Workers

#### Solução

```javascript
// Fallback para main thread se Worker falhar
async function parsePlaylist(text) {
  try {
    // Tenta Worker
    const worker = new Worker('/worker.js')
    return await new Promise((resolve, reject) => {
      worker.onmessage = (e) => resolve(e.data)
      worker.onerror = reject
      worker.postMessage(text)
      
      // Timeout de 10s
      setTimeout(() => reject(new Error('timeout')), 10000)
    })
  } catch (err) {
    // Fallback: parse na main thread com yield
    console.warn('Worker failed, using main thread')
    return await parseInMainThread(text)
  }
}

async function parseInMainThread(text) {
  const lines = text.split('\n')
  const channels = []
  
  for (let i = 0; i < lines.length; i += 100) {
    // Processa 100 linhas por vez
    const batch = lines.slice(i, i + 100)
    channels.push(...parseBatch(batch))
    
    // Yield para não travar UI
    await new Promise(r => setTimeout(r, 0))
  }
  
  return channels
}
```

### 7. AVPlay (Hardware Player)

#### Problema
- `seekTo()` em streams TS pode travar decoder
- Loop infinito (`onstreamcompleted` → `seekTo(0)`) causa crash

#### Solução

```javascript
// ❌ EVITAR - loop infinito trava TV
avplay.setListener({
  onstreamcompleted: () => {
    avplay.seekTo(0)
    avplay.play()
  }
})

// ✅ USAR - preview toca uma vez e para
avplay.setListener({
  onstreamcompleted: () => {
    // Não faz nada - deixa parar naturalmente
  }
})

// Limitar oncurrentplaytime (dispara 60x/segundo)
let lastTime = 0
avplay.setListener({
  oncurrentplaytime: (time) => {
    // Só processa a cada 1 segundo
    if (time - lastTime > 1000) {
      lastTime = time
      updateProgress(time)
    }
  }
})
```

## Métricas de Performance

### Targets
- **TTI (Time to Interactive):** < 3s
- **FPS:** 30+ (60 ideal, mas difícil em Tizen)
- **Bundle parse:** < 500ms
- **Playlist parse:** < 2s (10k canais)
- **RAM usage:** < 400 MB

### Ferramentas

```javascript
// Logger de performance
const t0 = performance.now()
await loadPlaylist(url)
const t1 = performance.now()
console.log(`Playlist loaded in ${t1 - t0}ms`)

// Memory usage (não disponível em Tizen, só desktop)
if (performance.memory) {
  console.log(`RAM: ${performance.memory.usedJSHeapSize / 1024 / 1024} MB`)
}
```

## Checklist de Otimização

- [ ] Bundle < 350 KB (moderno + legacy)
- [ ] Polyfills separados (carregamento condicional)
- [ ] React.memo em componentes pesados
- [ ] Virtualização de listas (react-window)
- [ ] CSS: `transform` + `opacity` apenas
- [ ] Imagens: preload crítico + lazy load restante
- [ ] IndexedDB: singleton + operações assíncronas
- [ ] Web Worker: fallback para main thread
- [ ] AVPlay: sem loop infinito, limitar callbacks
- [ ] Debounce em navegação D-pad (200ms)

## Referências

- [React Performance Optimization](https://react.dev/learn/render-and-commit)
- [CSS GPU Acceleration](https://www.smashingmagazine.com/2016/12/gpu-animation-doing-it-right/)
- [IndexedDB Best Practices](https://web.dev/indexeddb-best-practices/)
