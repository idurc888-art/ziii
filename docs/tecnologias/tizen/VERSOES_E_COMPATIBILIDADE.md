# Versões Tizen e Compatibilidade

## Tabela Oficial Samsung (2015-2026)

| Ano TV    | Tizen    | JavaScript Engine | Chromium | HLS suporte | Recomendação              |
| --------- | -------- | ----------------- | -------- | ----------- | ------------------------- |
| 2015      | 2.3      | JSC (WebKit)      | -        | v3 básico   | ❌ Samsung removeu da loja |
| 2016      | 2.4      | V8 (Chromium)     | -        | v3          | ⚠️ Evitar                 |
| **2017**  | **3.0**  | **V8**            | -        | **v7**      | ✅ **Mínimo recomendado**  |
| **2018**  | **4.0**  | **V8 + ES6 full** | **56**   | **v7**      | ✅ **Ideal começar aqui**  |
| 2019      | 5.0      | V8                | 63       | v7          | ✅                         |
| 2020–2026 | 5.5–10.0 | V8                | 69-108   | v7–v10      | ✅ Tudo ok                 |

## TV Alvo do Projeto

- **Modelo:** UN50RU7100GXZD
- **Ano:** 2019
- **Tizen:** 5.0
- **Chromium:** 63
- **IP:** 10.0.0.100:26101
- **DUID:** 00000002094ebbd4

## Conclusão

Suporte a partir de **Tizen 3.0 (2017)** é o sweet spot:
- Cobre a grande maioria dos usuários ativos
- HLS M3U8 já funciona nativo
- ES6 completo desde Tizen 4.0 (2018)

## Limitações Conhecidas

### Tizen 4.0 (Chromium 56)
- Sem `async/await` nativo (precisa polyfill)
- Sem `Object.entries/values` (precisa polyfill)
- Sem `Array.prototype.flat/flatMap`
- Web Worker `type: 'module'` não suportado

### Tizen 5.0 (Chromium 63)
- ES6 completo ✅
- `async/await` nativo ✅
- Web Worker `type: 'module'` ainda não suportado ⚠️
- IndexedDB quota limitada (funciona, mas sem garantia de tamanho)

## Estratégia de Compatibilidade

```javascript
// Detecta capacidade em vez de detectar versão
const supportsHLS = () => {
  const video = document.createElement('video')
  return video.canPlayType('application/vnd.apple.mpegurl') !== ''
}

// Tizen 2017+ → usa Shaka Player (HLS via MSE)
// Se MSE não disponível → fallback para AVPlay nativo Samsung
if (window.shaka && shaka.Player.isBrowserSupported()) {
  initShakaPlayer()
} else {
  initSamsungAVPlay() // API nativa Samsung, suporte desde 2015
}
```

**Resultado:** app funciona em **~95% de todas as Samsung TVs** vendidas desde 2017.
