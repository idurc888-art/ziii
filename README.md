# ziiiTV

App IPTV para Samsung Tizen 4.0+ (TV UN50RU7100GXZD).

## Stack
- React 18 + Vite 8 + TypeScript
- Shaka Player (HLS/DASH) + AVPlay Samsung (fallback .ts)
- Zustand, CSS Modules, Web Worker, IndexedDB (idb)

## Estado atual
- ✅ Fase 1 — Navegação e estrutura
- ✅ Fase 2 — Playlist Engine (Worker + IndexedDB + cache)
- 🔄 Fase 3 — Player (Shaka funcional no browser, AVPlay tipado, deploy na TV em andamento)
- ⏳ Fase 4 — Interface visual
- ⏳ Fase 5 — Tizen e deploy final

## Rodar em desenvolvimento
```bash
npm run dev
```

## Build e deploy para TV
```bash
bash deploy.sh
```
O script roda `npm run build`, copia `config.xml` e `icon.png` para `dist/`, empacota `.wgt` e instala na TV via sdb.

## Notas críticas de compatibilidade
- Tizen 4.0 = Chromium 56 — **não suporta `type="module"`**
- O plugin `tizen-compat` no `vite.config.ts` remove `type="module"` do `index.html` após o build
- Build target: `es2015 + chrome56`
- Web Worker usa `import.meta.url` — funciona no browser, comportamento na TV a validar

## Navegação
- Teclado D-pad via `document.addEventListener('keydown')`
- Throttle 100ms via `Date.now()`
- Valores mutáveis sempre via `useRef` (sem stale closure)
- Listeners ignoram eventos originados em `<input>`
