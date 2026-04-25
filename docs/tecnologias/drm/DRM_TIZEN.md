# DRM (Digital Rights Management) em Tizen

## Sistemas DRM Suportados

| DRM | Criador | Plataformas | Tizen Suporte | Uso Principal |
|---|---|---|---|---|
| **Widevine** | Google | Android, Chrome, Smart TVs | ✅ Tizen 4.0+ | Netflix, YouTube, Disney+ |
| **PlayReady** | Microsoft | Xbox, Windows, Smart TVs | ✅ Tizen 3.0+ | Amazon Prime, Hulu |
| **FairPlay** | Apple | iOS, macOS, Safari | ⚠️ Limitado | Apple TV+, iTunes |

## Widevine

### Níveis de Segurança

| Nível | Segurança | Qualidade Máxima | Tizen Suporte |
|---|---|---|---|
| **Level 1** | Hardware-backed (TEE) | 4K, HDR | ✅ Tizen 4.0+ (modelos certificados) |
| **Level 2** | Software + Hardware | 1080p | ⚠️ Raro |
| **Level 3** | Software apenas | 480p (SD) | ✅ Tizen 3.0+ (fallback) |

### Certificação

Para usar Widevine Level 1:
1. TV precisa ter chip TEE (Trusted Execution Environment)
2. Samsung precisa certificar o modelo com Google
3. App precisa solicitar certificação (processo pago)

### Implementação com Shaka Player

```javascript
const player = new shaka.Player(videoElement)

player.configure({
  drm: {
    servers: {
      'com.widevine.alpha': 'https://license.example.com/widevine'
    }
  }
})

await player.load(manifestUrl)
```

### Limitações

- **ziiiTV (IPTV):** Streams M3U geralmente **não têm DRM**
- Widevine só funciona com DASH/HLS criptografado
- Certificação cara (milhares de dólares)

## PlayReady

### Características
- Desenvolvido pela Microsoft
- Usado por Amazon Prime Video, Hulu
- Suporte nativo em Tizen 3.0+

### Implementação

```javascript
player.configure({
  drm: {
    servers: {
      'com.microsoft.playready': 'https://license.example.com/playready'
    }
  }
})
```

## FairPlay (Apple)

### Características
- Exclusivo para HLS
- Usado por Apple TV+, iTunes
- Suporte limitado em Tizen (via EME)

### Limitações
- Requer certificação Apple
- Não funciona com Shaka Player (só Safari nativo)
- Tizen suporta via AVPlay (não documentado)

## EME (Encrypted Media Extensions)

### O Que É?
- API W3C para DRM em browsers
- Permite que JavaScript controle conteúdo criptografado
- Usado por Shaka Player, HLS.js, dash.js

### Fluxo

```
1. Player detecta conteúdo criptografado no manifest
2. Solicita licença ao servidor DRM
3. Browser/TV descriptografa via CDM (Content Decryption Module)
4. Vídeo é renderizado
```

### Implementação

```javascript
// Shaka Player abstrai EME automaticamente
const player = new shaka.Player(videoElement)

player.configure({
  drm: {
    servers: {
      'com.widevine.alpha': licenseServerUrl
    }
  }
})

// Shaka lida com EME internamente
await player.load(manifestUrl)
```

## ziiiTV e DRM

### Status Atual
- **Não usa DRM** — streams IPTV M3U são abertas
- Shaka Player configurado sem DRM
- AVPlay usado para streams `.ts` diretos (sem criptografia)

### Futuro (Se Necessário)
- Implementar Widevine para conteúdo premium
- Solicitar certificação Samsung + Google
- Custo estimado: $5k-$20k (certificação + desenvolvimento)

## Referências

- [Widevine DRM Overview](https://developers.google.com/widevine/drm/overview)
- [PlayReady Documentation](https://www.microsoft.com/playready/)
- [EME Specification (W3C)](https://www.w3.org/TR/encrypted-media/)
- [Samsung DRM Support](https://developer.samsung.com/smarttv/develop/specifications/media-specifications/drm.html)
