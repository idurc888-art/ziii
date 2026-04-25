# Players de Vídeo para Tizen

## Comparativo de Players

| Player | Quem usa | Samsung 2017+ | HLS M3U8 | Performance | DRM |
|---|---|---|---|---|---|
| **🥇 Shaka Player** (Google) | YouTube, Disney+ | ✅ Tizen 3.0+ | ✅ Full | ⭐⭐⭐⭐⭐ | Widevine, PlayReady |
| **🥈 HLS.js** | Twitch, Dailymotion | ✅ Tizen 3.0+ | ✅ Focado HLS | ⭐⭐⭐⭐ | Não |
| **Samsung AVPlay** (nativo) | Apps nativos Tizen | ✅ Tizen 2.3+ | ✅ | ⭐⭐⭐ | Widevine, PlayReady |
| Video.js | Blogs/sites | ⚠️ Adaptação | Plugin | ⭐⭐⭐ | Plugins |
| dash.js | MPEG-DASH puro | ✅ | Só DASH | ⭐⭐⭐ | Não |

## Shaka Player (Escolha do ziiiTV)

### Por Que Shaka Player?

- Desenvolvido pelo **Google**, usado pelo **YouTube e Disney+** em Smart TVs
- Suporta **HLS (M3U8)** e **MPEG-DASH** na mesma lib
- Funciona em **Tizen 3.0 (2017)** até Tizen 10.0 (2026)
- **Adaptive Bitrate (ABR)** automático — qualidade cai/sobe conforme internet
- **DRM** integrado (PlayReady + Widevine) para futuro
- **Open-source e gratuito** (licença Apache 2.0)
- Mesma lib roda em **LG webOS**, Fire TV com wrapper, Android TV

### Configuração Otimizada para TVs

```javascript
import shaka from 'shaka-player/dist/shaka-player.compiled.js'

const player = new shaka.Player(videoElement)

player.configure({
  streaming: {
    bufferingGoal: 30,        // 30s buffer = TV não trava
    rebufferingGoal: 5,       // retoma após 5s
    bufferBehind: 30,
  },
  abr: {
    enabled: true,            // qualidade automática
    defaultBandwidthEstimate: 5e6  // começa em 5Mbps
  }
})
```

### Limitações

- Não suporta streams `.ts` diretos (precisa AVPlay fallback)
- DRM requer certificação da TV (Widevine Level 1)
- MSE (Media Source Extensions) obrigatório

## Samsung AVPlay (Fallback)

### Quando Usar

- Streams `.ts` diretos (sem manifest HLS/DASH)
- Quando Shaka Player não está disponível
- Quando MSE não é suportado (TVs antigas)

### API Básica

```javascript
const avplay = window.webapis?.avplay

// Máquina de estados: NONE → IDLE → READY → PLAYING
avplay.open(url)
avplay.setDisplayRect(x, y, width, height)
avplay.setDisplayMethod('PLAYER_EXTERNAL_OUTPUT_MODE_NONE')

avplay.setListener({
  onbufferingstart: () => console.log('buffering...'),
  onbufferingcomplete: () => console.log('ready'),
  onstreamcompleted: () => console.log('ended'),
  onerror: (err) => console.error('error:', err)
})

avplay.prepareAsync(
  () => avplay.play(),
  (err) => console.error('prepare failed:', err)
)
```

### Limitações

- API inconsistente entre modelos/versões
- Bugs de seek em alguns formatos
- Sem ABR automático
- Só funciona em Samsung (não portável)

## Estratégia Híbrida (ziiiTV)

```javascript
function initPlayer(url) {
  const isTS = url.endsWith('.ts')
  const hasAVPlay = typeof window.webapis?.avplay !== 'undefined'
  
  if (isTS && hasAVPlay) {
    // Streams .ts diretos → AVPlay
    return initAVPlay(url)
  } else if (window.shaka && shaka.Player.isBrowserSupported()) {
    // HLS/DASH → Shaka Player
    return initShaka(url)
  } else if (hasAVPlay) {
    // Fallback final → AVPlay
    return initAVPlay(url)
  } else {
    throw new Error('Nenhum player disponível')
  }
}
```

## Referências

- [Shaka Player GitHub](https://github.com/shaka-project/shaka-player)
- [Samsung AVPlay API](https://developer.samsung.com/signage/develop/api-references/samsung-product-api-references/avplay-api.html)
- [Dolby: Custom Players on Tizen](https://optiview.dolby.com/resources/blog/playback/how-to-use-your-own-player-on-samsung-tizen/)
