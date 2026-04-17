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
