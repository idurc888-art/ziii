## 📅 Ciclos Tizen — A partir de qual ano suportar?

Esta é a tabela oficial da Samsung para TVs 2015–2026:[](https://developer.samsung.com/smarttv/develop/specifications/general-specifications.html)

| Ano TV    | Tizen    | JavaScript Engine | HLS suporte | Recomendação              |
| --------- | -------- | ----------------- | ----------- | ------------------------- |
| 2015      | 2.3      | JSC (WebKit)      | v3 básico   | ❌ Samsung removeu da loja |
| 2016      | 2.4      | V8 (Chromium)     | v3          | ⚠️ Evitar                 |
| **2017**  | **3.0**  | **V8**            | **v7**      | ✅ **Mínimo recomendado**  |
| **2018**  | **4.0**  | **V8 + ES6 full** | **v7**      | ✅ **Ideal começar aqui**  |
| 2019      | 5.0      | V8                | v7          | ✅                         |
| 2020–2026 | 5.5–10.0 | V8                | v7–v10      | ✅ Tudo ok                 |

> **Conclusão:** suporte a partir de **Tizen 3.0 (2017)** é o sweet spot — cobre a grande maioria dos usuários ativos e HLS M3U8 já funciona nativo.

---

## ⚙️ A Stack Tecnológica Certa para o ziiiTV

## Camada 1 — App Framework

text

`React (não React Native) + Vite → Por quê: é exatamente o que roda   no Chromium do Tizen desde 2017 → Mesma base funciona em LG webOS → Suporte a ES6 completo desde Tizen 4.0 (2018) → Samsung já tem boilerplate oficial em React`

## Camada 2 — Player de Vídeo (a decisão mais importante)

Você perguntou sobre a tecnologia da Amazon. O Fire TV usa **ExoPlayer** (Android nativo). Mas para Samsung Tizen — que roda Web — o equivalente mais poderoso é:

|Player|Quem usa|Samsung 2017+|HLS M3U8|Performance|
|---|---|---|---|---|
|**🥇 Shaka Player** (Google)|YouTube, Disney+|✅ Tizen 3.0+|✅ Full|⭐⭐⭐⭐⭐|
|**🥈 HLS.js**|Twitch, Dailymotion|✅ Tizen 3.0+|✅ Focado HLS|⭐⭐⭐⭐|
|**Samsung AVPlay** (nativo)|Apps nativos Tizen|✅ Tizen 2.3+|✅|⭐⭐⭐ (só Samsung)|
|Video.js|Blogs/sites|⚠️ Adaptação|Plugin|⭐⭐⭐|
|dash.js|MPEG-DASH puro|✅|Só DASH|⭐⭐⭐|

**Para o ziiiTV, a combinação vencedora é:**

javascript

`// Shaka Player para HLS + MPEG-DASH + DRM import shaka from 'shaka-player/dist/shaka-player.compiled.js' // Configuração otimizada para TVs 2017+ const player = new shaka.Player(videoElement) player.configure({   streaming: {    bufferingGoal: 30,        // 30s buffer = TV não trava    rebufferingGoal: 5,       // retoma após 5s    bufferBehind: 30,  },  abr: {    enabled: true,            // qualidade automática    defaultBandwidthEstimate: 5e6  // começa em 5Mbps  } })`

---

## 🔄 Por que Shaka Player é o certo?

- Desenvolvido pelo **Google**, usado pelo **YouTube e Disney+** em Smart TVs
    
- Suporta **HLS (M3U8)** e **MPEG-DASH** na mesma lib
    
- Funciona em **Tizen 3.0 (2017)** até Tizen 10.0 (2026)
    
- **Adaptive Bitrate (ABR)** automático — qualidade cai/sobe conforme internet
    
- **DRM** integrado (PlayReady + Widevine) para futuro
    
- **Open-source e gratuito** (licença Apache 2.0)
    
- Mesma lib roda em **LG webOS**, Fire TV com wrapper, Android TV
    

---

## 🏗️ Arquitetura completa do ziiiTV

text

`ziiiTV ├── 🎨 UI Layer │   ├── React + Vite (build leve) │   ├── CSS custom (sem Tailwind — TV não precisa) │   └── Navegação D-pad (↑↓←→ do controle remoto) │ ├── 📋 Playlist Engine │   ├── Parser M3U8 (custom ou iptv-playlist-parser npm) │   ├── Organização por grupos/categorias │   ├── Busca e filtros │   └── Favoritos (localStorage ou indexedDB) │ ├── 🎬 Player Layer │   ├── Shaka Player → HLS + DASH │   ├── Fallback: Samsung AVPlay API (nativo Tizen) │   └── Controles: play, pause, volume, seek, EPG │ └── 📡 Data Layer     ├── Fetch M3U8 da URL do usuário    ├── EPG (Electronic Program Guide) via XMLTV    └── Cache local para não recarregar sempre`

---

## 🎯 Estratégia de compatibilidade

O segredo para cobrir **2017 → 2026** com um único código:

javascript

`// Detecta capacidade em vez de detectar versão const supportsHLS = () => {   const video = document.createElement('video')  return video.canPlayType('application/vnd.apple.mpegurl') !== '' } // Tizen 2017+ → usa Shaka Player (HLS via MSE) // Se MSE não disponível → fallback para AVPlay nativo Samsung if (window.shaka && shaka.Player.isBrowserSupported()) {   initShakaPlayer() } else {   initSamsungAVPlay() // API nativa Samsung, suporte desde 2015 }`

**Resultado:** seu app funciona em **~95% de todas as Samsung TVs** vendidas desde 2017 sem nenhuma adaptação extra.# Stack Técnica — ziiiTV

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
# Tecnologias dos Apps Samsung Tizen TV

**Data:** 17/04/2026 07:52  
**TV:** UN50RU7100GXZD (Tizen 4.0)

## 🎯 Resumo Executivo

Apps premium (Netflix, YouTube, Apple TV, Disney+, Spotify, Prime Video) usam tecnologias proprietárias e frameworks especializados que não são acessíveis via extração de `.wgt`. Análise baseada em pesquisa pública e documentação oficial.

---

## 📺 YouTube (Cobalt)

**AppID:** `com.samsung.tv.cobalt-yt`, `9Ur5IzDKqV.TizenYouTube`

### Stack Técnica
- **Cobalt Browser** — Container HTML5 leve desenvolvido pelo YouTube/Google
  - Fork do Chromium otimizado para TVs e dispositivos embarcados
  - Baseado em C++ com engine V8 (JavaScript)
  - Suporte nativo a MSE (Media Source Extensions) e EME (Encrypted Media Extensions)
  - Rendering via Skia (2D graphics)
  - Starboard API — camada de abstração para diferentes plataformas (Tizen, Android TV, etc)

### Características
- HTML5/CSS3/JavaScript (ES6+)
- WebGL para aceleração gráfica
- Widevine CDM (Content Decryption Module) para DRM
- DASH (Dynamic Adaptive Streaming over HTTP)
- Otimizado para baixo consumo de memória (< 200MB RAM)

### Referências
- [GitHub: youtube/cobalt](https://github.com/youtube/cobalt) — Código aberto
- [cobalt.dev](https://cobalt.dev) — Documentação oficial
- Content was rephrased for compliance with licensing restrictions

---

## 🎬 Netflix

**AppID:** `org.tizen.netflix-app`

### Stack Técnica (Inferida)
- **Gibbon** — Framework proprietário Netflix para Smart TVs
  - Baseado em HTML5/JavaScript com engine customizada
  - Rendering nativo via WebKit/Chromium embarcado
  - MSE + EME para streaming adaptativo

### DRM
- **Widevine Level 1** (hardware-backed) — Padrão em Tizen 4.0+
- **PlayReady** (fallback) — Microsoft DRM para compatibilidade
- Certificação Netflix obrigatória — TV precisa passar testes de segurança

### Streaming
- DASH (manifests `.mpd`)
- Bitrate adaptativo (240p até 4K dependendo da certificação)
- Pré-buffering inteligente

### Referências
- Netflix usa múltiplos sistemas DRM (Widevine, PlayReady, FairPlay) dependendo da plataforma
- Tizen 4.0+ suporta Widevine via AVPlay API
- Content was rephrased for compliance with licensing restrictions

---

## 🍎 Apple TV / AirPlay

**AppID:** `com.samsung.tv.aria-video`, `com.samsung.tv.aria-dummy`, `NRi6kdBYJ0.AirPlayWebApp`

### Stack Técnica
- **Aria Framework** — Framework Samsung para apps de vídeo premium
  - Container WebView (Chromium-based)
  - Integração com AVPlay (player nativo Tizen)
  - Suporte a AirPlay 2 (protocolo Apple)

### Características
- FairPlay DRM (Apple) via EME
- HLS (HTTP Live Streaming) — formato nativo Apple
- Integração com HomeKit (Samsung TVs 2018+)

### Referências
- Samsung TVs 2018-2023 suportam AirPlay 2 nativamente
- Aria é um framework interno Samsung para apps de streaming premium
- Content was rephrased for compliance with licensing restrictions

---

## 🎵 Spotify

**AppID:** `rJeHak5zRg.Spotify`

### Stack Técnica
- **Spotify Connect** — Protocolo proprietário para controle remoto
- Web Player embarcado (HTML5/JavaScript)
- Streaming via Ogg Vorbis (320kbps premium) ou AAC

### Características
- Sem DRM (música em cache criptografada localmente)
- API REST para controle via smartphone
- WebSocket para sincronização em tempo real

---

## 🏰 Disney+

**AppID:** `MCmYXNxgcu.DisneyPlus`

### Stack Técnica
- **Disney Streaming Services** — Plataforma baseada em BAMTech (adquirida pela Disney)
- HTML5/JavaScript com player customizado
- MSE + EME (Widevine/PlayReady)

### Streaming
- DASH + HLS (dual-format)
- Dolby Atmos e Dolby Vision (em TVs compatíveis)

---

## 📦 Amazon Prime Video

**AppID:** `evKhCgZelL.AmazonIgnitionLauncher2`

### Stack Técnica
- **Ignition** — Framework Amazon para Fire TV adaptado para Tizen
- WebView (Chromium) + player nativo
- Widevine Level 1

### Características
- DASH + HLS
- X-Ray (metadados em tempo real) via WebSocket
- Download offline (em dispositivos certificados)

---

## 🛠️ Tecnologias Comuns (Tizen 4.0+)

### Player APIs
1. **AVPlay** (nativo Tizen)
   - API C/JavaScript para playback de vídeo
   - Suporte a HLS, DASH, MP4, TS
   - DRM: Widevine, PlayReady
   - Limitações: bugs entre modelos/versões diferentes

2. **Shaka Player** (open-source Google)
   - JavaScript player para DASH/HLS
   - MSE + EME
   - Usado como alternativa ao AVPlay
   - Compatível com Tizen 4.0+ (Chromium 56+)

### DRM
- **Widevine CDM** — Google (padrão Android/Chrome)
  - Level 1: Hardware-backed (seguro, HD/4K)
  - Level 3: Software (menos seguro, SD apenas)
- **PlayReady** — Microsoft (padrão Xbox/Windows)
- **FairPlay** — Apple (HLS apenas)

### Streaming
- **DASH** (Dynamic Adaptive Streaming over HTTP) — ISO standard
- **HLS** (HTTP Live Streaming) — Apple standard
- **MSE** (Media Source Extensions) — W3C API para streaming adaptativo
- **EME** (Encrypted Media Extensions) — W3C API para DRM

### Rendering
- **Chromium 56** (Tizen 4.0) / **Chromium 63** (Tizen 5.0+)
- **WebKit** (fallback em apps mais antigos)
- **Skia** — 2D graphics engine (usado pelo Chromium)

---

## 🔒 Por Que Não Dá Pra Baixar os `.wgt`?

1. **Partições protegidas** — Apps do sistema ficam em `/usr/apps/` ou `/opt/preloaded/` (read-only, sem acesso via `sdb`)
2. **DRM anti-extração** — Netflix, Disney+, etc têm proteção contra cópia
3. **Assinatura criptográfica** — Samsung assina os pacotes, não rodam em outro dispositivo
4. **Certificação** — Apps premium exigem certificação da plataforma (Netflix, Widevine L1)

---

## ✅ Apps Que Dá Pra Baixar (Instalados Manualmente)

Esses ficam em `/opt/usr/apps/` e são acessíveis:

1. **Gala TV** — `PPePAN9WHl.GalaTV`
2. **IPTV Playlist Player** — `F4m4lSJ4bU.VisionTv`
3. **IPTV Stream Player** — `t11i22v33i.TiviPlayer`
4. **ziiiTV** — `2TDndgJZyN.ziiiTV` (nosso app)

---

## 📚 Referências

1. [Shaka Player GitHub](https://github.com/shaka-project/shaka-player) — Player open-source usado em produção
2. [Cobalt GitHub](https://github.com/youtube/cobalt) — YouTube TV container
3. [Samsung AVPlay API](https://developer.samsung.com/signage/develop/api-references/samsung-product-api-references/avplay-api.html)
4. [Dolby: Custom Players on Tizen](https://optiview.dolby.com/resources/blog/playback/how-to-use-your-own-player-on-samsung-tizen/)
5. [Widevine DRM Overview](https://developers.google.com/widevine/drm/overview)

Content was rephrased for compliance with licensing restrictions.

---

## 🎯 Conclusão para ziiiTV

**O que usar:**
- ✅ **Shaka Player** — já implementado, compatível com Tizen 4.0+
- ✅ **AVPlay** (fallback) — para streams `.ts` que Shaka não suporta
- ✅ **IndexedDB** — cache persistente (já validado)
- ✅ **React 18 + Vite 4** — stack atual funciona

**O que evitar:**
- ❌ Cobalt — framework complexo, overkill para IPTV
- ❌ AVPlay como player principal — bugs entre modelos
- ❌ Libs pesadas — Chromium 56 tem limitações de memória

**Próximo passo:**
Validar Shaka Player + AVPlay na TV antes de implementar layout.
