# Stack Técnica — ziiiTV

## Core
- **React 18.3.1** — UI framework
- **TypeScript 5.6.2** — type safety
- **Vite 4.5.14** — bundler + dev server (downgrade de Vite 8 por compatibilidade)
- **@vitejs/plugin-react 4.x** — React plugin para Vite 4
- **@vitejs/plugin-legacy** — polyfills + transpilação para Chromium 56+
- **Zustand 5.0.2** — state management (channels, player)

## Player
- **Shaka Player 5.1.2** — HLS/DASH (navegador)
- **AVPlay Samsung** — fallback .ts direto (TV)

## Playlist Engine
- **@iptv/playlist 4.1.0** — parse M3U
- **Web Worker** — parse assíncrono (não trava UI)
- **idb 8.0.1** — IndexedDB wrapper (cache local)

## Build & Deploy
- **Tizen Studio CLI** — package .wgt + install
- **Certificate:** IptvFinal
- **Target:** Samsung UN50RU7100GXZD (Tizen 5.0 / Chromium 63)
- **Build output:** `dist/` com múltiplos arquivos (index.html + JS/CSS separados)

## Compatibilidade
- **Target ES:** `es2015` + `chrome56`
- **Polyfills:** `regenerator-runtime` + legacy plugin
- **Bundle:** 2 versões (moderno + legacy) — TV carrega legacy automaticamente
- **CSP:** permissivo no `config.xml`
- **Sem single-file:** arquivos separados (viteSingleFile removido por conflito)

## Estrutura
```
src/
├── App.tsx              # Router (home/player/settings)
├── main.tsx             # Entry point
├── screens/             # HomeScreen, PlayerScreen, SettingsScreen
├── services/            # playerService, avplayService, playlistService
├── workers/             # playlistWorker.ts
├── store/               # channelsStore.ts (Zustand)
└── types/               # channel.ts

dist/
├── index.html                          # 1.72 KB
├── assets/index-0ee003e8.js            # 192 KB (moderno)
├── assets/index-legacy-14efb671.js     # 192 KB (legacy)
└── assets/polyfills-legacy-661da4e7.js # 64 KB
```

## Status Atual
- ✅ Build funciona (Vite 4 + plugin-legacy)
- ✅ Instala na TV
- ✅ **React monta na TV** (tela de teste verde funcionando)
- 🎯 Próximo: implementar layout Telvix + reintegrar features

## Problema Resolvido
**Causa raiz:** Vite 8 com Rolldown não gera código compatível com Chromium 56/63, mesmo com target correto.  
**Solução:** Downgrade para Vite 4 que usa Rollup clássico + plugin-legacy para polyfills.
