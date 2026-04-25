# Protocolos de Streaming

## HLS (HTTP Live Streaming)

### Características
- **Criador:** Apple (2009)
- **Formato:** `.m3u8` (manifest) + `.ts` (segmentos)
- **Suporte:** Universal (iOS, Android, Smart TVs, browsers modernos)
- **Adaptive:** Sim (múltiplas qualidades no manifest)

### Estrutura

```
master.m3u8          # Manifest principal
├── 720p.m3u8        # Playlist 720p
│   ├── seg0.ts
│   ├── seg1.ts
│   └── seg2.ts
├── 480p.m3u8        # Playlist 480p
│   ├── seg0.ts
│   ├── seg1.ts
│   └── seg2.ts
└── 360p.m3u8        # Playlist 360p
    ├── seg0.ts
    ├── seg1.ts
    └── seg2.ts
```

### Exemplo de Manifest

```m3u8
#EXTM3U
#EXT-X-VERSION:3
#EXT-X-STREAM-INF:BANDWIDTH=2000000,RESOLUTION=1280x720
720p.m3u8
#EXT-X-STREAM-INF:BANDWIDTH=1000000,RESOLUTION=854x480
480p.m3u8
#EXT-X-STREAM-INF:BANDWIDTH=500000,RESOLUTION=640x360
360p.m3u8
```

### Suporte em Tizen
- **Tizen 3.0+:** HLS v7 nativo via `<video>` tag
- **Shaka Player:** HLS via MSE (Media Source Extensions)
- **AVPlay:** HLS nativo (API Samsung)

## DASH (Dynamic Adaptive Streaming over HTTP)

### Características
- **Criador:** ISO/IEC (2012)
- **Formato:** `.mpd` (manifest) + `.m4s` (segmentos)
- **Suporte:** Android, Smart TVs, browsers modernos (não iOS nativo)
- **Adaptive:** Sim (múltiplas qualidades no manifest)

### Estrutura

```
manifest.mpd         # Manifest principal
├── video_720p/
│   ├── init.m4s     # Inicialização
│   ├── seg0.m4s
│   ├── seg1.m4s
│   └── seg2.m4s
├── video_480p/
│   ├── init.m4s
│   ├── seg0.m4s
│   ├── seg1.m4s
│   └── seg2.m4s
└── audio/
    ├── init.m4s
    ├── seg0.m4s
    ├── seg1.m4s
    └── seg2.m4s
```

### Vantagens sobre HLS
- Áudio e vídeo separados (economia de banda)
- Melhor suporte a DRM (Widevine, PlayReady)
- Usado por YouTube, Netflix, Disney+

### Suporte em Tizen
- **Tizen 3.0+:** DASH via MSE (não nativo no `<video>`)
- **Shaka Player:** DASH completo ✅
- **AVPlay:** DASH limitado (depende do modelo)

## TS Direto (Transport Stream)

### Características
- **Formato:** `.ts` (MPEG-2 Transport Stream)
- **Uso:** IPTV, broadcast TV, streams ao vivo
- **Adaptive:** Não (qualidade fixa)

### Quando Usar
- Streams IPTV que não têm manifest HLS/DASH
- Canais de TV ao vivo
- Streams de baixa latência

### Suporte em Tizen
- **AVPlay:** ✅ Suporte nativo
- **Shaka Player:** ❌ Não suporta (precisa manifest)
- **`<video>` tag:** ⚠️ Depende do codec

## Comparativo

| Protocolo | Adaptive | DRM | Latência | Suporte Tizen | Uso Principal |
|---|---|---|---|---|---|
| **HLS** | ✅ | ⚠️ FairPlay | Média (6-30s) | ✅ Nativo | VOD, Live |
| **DASH** | ✅ | ✅ Widevine/PlayReady | Média (6-30s) | ✅ MSE | VOD, Live Premium |
| **TS Direto** | ❌ | ❌ | Baixa (2-6s) | ✅ AVPlay | IPTV, Broadcast |

## Estratégia ziiiTV

```javascript
function detectStreamType(url) {
  if (url.endsWith('.m3u8')) return 'HLS'
  if (url.endsWith('.mpd')) return 'DASH'
  if (url.endsWith('.ts')) return 'TS'
  return 'UNKNOWN'
}

function selectPlayer(streamType) {
  switch (streamType) {
    case 'HLS':
    case 'DASH':
      return 'shaka' // Shaka Player (MSE)
    case 'TS':
      return 'avplay' // AVPlay nativo
    default:
      return 'auto' // Tenta Shaka, fallback AVPlay
  }
}
```

## Referências

- [HLS Specification (RFC 8216)](https://datatracker.ietf.org/doc/html/rfc8216)
- [DASH Specification (ISO/IEC 23009-1)](https://www.iso.org/standard/79329.html)
- [MPEG-TS Overview](https://en.wikipedia.org/wiki/MPEG_transport_stream)
