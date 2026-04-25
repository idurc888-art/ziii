# Contexto Completo — ziiiTV (25/04/2026)

## OBJETIVO FINAL
App IPTV production-ready para Samsung Tizen 5.0 TV que:
- Carrega playlists M3U (fetch + parse + match inteligente)
- Exibe canais em layout Netflix-like (Sidebar + Topbar + Hero + Carrosséis)
- Reproduz streams HLS/DASH/TS com video preview nos cards
- Navega com D-pad (4 zonas: sidebar/topbar/hero/content)

---

## TV ALVO

| Campo         | Valor                         |
|---------------|-------------------------------|
| Modelo        | UN50RU7100GXZD                |
| Tizen         | 5.0                           |
| Chromium      | 63                            |
| IP            | 10.0.0.100:26101              |
| DUID          | 00000002094ebbd4              |
| App ID        | 2TDndgJZyN.ziiiTV             |
| Certificado   | `zi01` (expira 2027/04/22)    |
| PC IP         | 10.0.0.103                    |

---

## DEPLOY RÁPIDO

```bash
bash deploy.sh
# (build + package + install automático)
```

Manual:
```bash
npm run build
cd dist && rm -f ziiiTV.wgt
~/tizen-studio/tools/ide/bin/tizen package -t wgt -s zi01 -o . -- .
~/tizen-studio/tools/ide/bin/tizen install -n ziiiTV.wgt -t UN50RU7100GXZD
```

**Debug na TV:** Botão Vermelho (keyCode 403) = toggle DebugOverlay

---

## STATUS ATUAL (25/04/2026)

### ✅ IMPLEMENTADO E FUNCIONANDO

**Pipeline de Dados:**
- Boot progressivo: `Auth + loadFromUrl()` em paralelo no início do app
- `CatalogMatcher`: L1 (RAM) → L3 (IndexedDB) → Worker → fallback main thread
- SWR pattern: serve cache, revalida em background se TTL > 7 dias
- `normalizeGroups()`: M3U group-titles → 8 categorias da UI
- `ContentCatalog`: singleton, TMDB enrichment em background, scoring de qualidade

**Home Screen:**
- 4 tabs: Home / Filmes / Séries / TV ao Vivo
- Sidebar colapsável (ícone ativo expande para 320px)
- Topbar flutuante com glow ativo
- Hero Banner (HeroBanner.tsx) com carrossel
- Carrosséis Telvix: card central FIXO (cinema 16:9) + laterais deslizando por trás
- Keys: `Netflix`, `Max`, `Disney+`, `Apple TV+`, `Amazon Prime`, `Paramount+`, `Globoplay`
- Lazy DOM: apenas ±3 rows no DOM ao mesmo tempo
- Progressive rendering: bloco 1 (3 rows) → bloco 2 (500ms) → bloco 3 (3s)
- Content cache por aba (troca instantânea sem re-build)
- Vanilla JS Bypass: scroll das rows via `.style.transform` direto no DOM (sem re-render React)
- `React.memo` + Surface Cache Shielding nos cards laterais

**Video Preview (AVPlay no Card Central):**
- `AutoplayCard` + `useCardAutoplay` + `PlayerManager` (singleton)
- 1.5s debounce após focar no card → `PlayerManager.requestPlay()` (SD stream)
- Poster → crossfade suave para hardware video
- Hole punch: `background: transparent` no container, `visibility: hidden` no placeholder
- Seamless expand: Enter → `expandToFullscreen()` → `setDisplayRect(0,0,1920,1080)`
- Collapse: BACK → `collapseToCard()` + `expandManager.markIdle()`

**PlayerScreen (Full Screen):**
- AVPlay (`.ts` streams) + Shaka Player (HLS/DASH) com detecção automática
- OSD com controles completos (play/pause/FF/RW/±10s/volume/qualidade)
- Menu de qualidade (HD/FHD/4K selecionável)
- Retry automático: 5 tentativas (delays: 1s/3s/5s/8s/12s)
- Slow warning (12s sem resposta)
- Adoção seamless: se preview estava tocando, PlayerScreen adota sem re-open

**Outros:**
- `SplashScreen → ProfileScreen → HomeScreen` a cada boot
- `DetailScreen` (entre HomeScreen e PlayerScreen)
- `TransitionOverlay` entre telas
- `FullscreenOverlay` para o expand seamless
- `keyboardMaestro`: listener global centralizado (sem duplicatas)
- `historyService`: "Continuar Assistindo" (mais vistos)
- `imagePreloader`: pré-carrega critical (top 6 posters + top 2 backdrops)
- `remoteConsole`: log server local (scripts/log-server.cjs)
- `sportsArtwork`: arte personalizada para canais esportivos

---

## ARQUITETURA — PIPELINE COMPLETO

```
App.boot()
  ├── AuthService.checkUserAuth()          [paralelo]
  └── channelsStore.loadFromUrl(M3U_URL)   [paralelo]
        └── CatalogMatcher.loadAndMatch(url)
              ├── L1 cache? → retorna imediato
              ├── L3 (IndexedDB)? → retorna + SWR background se expirado
              ├── Worker (catalogMatcherWorker.ts, timeout 20s)
              └── fallback: loadInMainThread() [batches de 200 com yield]
                    ├── fetch + parseM3U (até 3000 canais)
                    ├── normalizeStreams()
                    ├── Match contra CANONICAL_CATALOG (7606 linhas)
                    │   1. Exact slug match (score 100)
                    │   2. AltTitle match (score 92)
                    │   3. Prefix match (score 80)
                    └── db.put() → cache IndexedDB

  → normalizeGroups(matched+unmatched)    [8 categorias]
  → ContentCatalog.init(normalizedGroups)
  → imagePreloader.preloadCritical()
  → set({ status: 'done' })               [libera SplashScreen]
  → ContentCatalog.warmup() [background]  [TMDB enriquece top 20+20]
```

---

## ARQUITETURA — CANONICAL CATALOG

**src/data/catalog.ts** (7606 linhas):
- `CANONICAL_CATALOG`: array de títulos com slug, altTitles, streaming, TMDB data embutida
- `Streaming` type: `'netflix' | 'amazon' | 'hbo' | 'disney' | 'paramount' | 'apple' | 'globoplay'`
- Já contém poster, backdrop, overview, rating, year — sem precisar de API na maioria dos casos

**IMPORTANTE — Bug Potencial:**
Matched channels são agrupados por `ch.canonical.streaming` antes de `normalizeGroups()`.
`normalizeGroups('netflix')` → retorna 'outros' (não há pattern para 'netflix').
`normalizeGroups('disney')` → retorna 'infantil' (tem `/disney/i` nos patterns!).
**Resultado:** `ContentCatalog.getPool('filmes')` e `.getPool('series')` retornam canais não-matched (M3U genérico), não os premium.
**Mitigação atual:** Home page usa `CatalogMatcher.getMatchedByStreaming()` diretamente (não ContentCatalog), então as rows por streaming aparecem corretamente. Filmes/Séries tabs mostram conteúdo genérico da M3U.

---

## ARQUITETURA — PLAYER

```
PlayerManager (singleton, <object id="avplay-global-preview">)
  → requestPlay(SD_url, rect, 1.5s debounce)
  → executePlay() → AVPlay.open/prepareAsync/play
  → setDisplayRect(card bounds) → hardware layer no card

AutoplayCard (useCardAutoplay hook)
  → thumbnailOpacity: 1 → 0 ao tocar (crossfade)
  → useSeamlessExpand: Enter → expandToFullscreen()

ExpandManager (singleton)
  → states: idle → expanding → fullscreen → collapsing → idle
  → registra collapseHandler
  → HomeScreen: displayCallback (opacity 0 no fullscreen)

PlayerScreen (full-screen, <object id="av-player">)
  → AVPlay (backend = 'avplay' para .ts streams)
  → Shaka Player (HLS/DASH)
  → Adoção seamless: isSeamlessActive() && channel.id match → sem re-open

⚠️  Dois <object> AVPlay no DOM simultaneamente (avplay-global-preview + av-player)
    Samsung Tizen tem 1 instância de hardware. Funciona por timing:
    - preview object fica 1x1px quando não usa
    - PlayerScreen adopta via seamless ou re-open limpo
    Risco: race condition se Preview estava tocando ao ir pro Detail path
```

---

## ARQUITETURA — NAVEGAÇÃO

```
HomeScreen — 4 Zonas:
  sidebar (colapsável)
    ↓ RIGHT
  topbar [Home | Filmes | Séries | TV ao Vivo]
    ↓ DOWN
  hero (banner)
    ↓ DOWN
  content (rows de cards)
    BACK ← sobe uma zona por vez
    RIGHT no último topbar item = toggle DebugOverlay

Content Zone:
  - Row type 'grid': 4 colunas × 2 linhas (Continuar Assistindo)
  - Row type outros: Card Central FIXO + laterais deslizando
  - Circular scroll (esquerda do fim = volta ao início)
  - Lazy load: expande buffer ao navegar perto do edge
```

---

## STACK TÉCNICA

```json
{
  "react": "18.3.1",
  "zustand": "5.0.2",
  "@iptv/playlist": "4.2.0",
  "shaka-player": "5.1.2",
  "vite": "4.5.14",    ← LOCKED! Não atualizar (Chromium 63)
  "@vitejs/plugin-legacy": "5.4.4",
  "@vitejs/plugin-react": "4.3.4"
}
```

---

## REGRAS CRÍTICAS

1. **Vite 4.5.x LOCKED** — Vite 5/8 quebra polyfills no Chromium 63
2. **IndexedDB nativo** — sem lib `idb` ou similares
3. **Web Worker `type: 'module'` proibido** — use apenas `type: 'classic'` (mas o Vite resolve o bundle)
4. **AVPlay: 1 instância por app** — coordenar via PlayerManager + expandManager
5. **`background: transparent`** no root e containers do AVPlay — hole punch obrigatório
6. **`visibility: hidden`** (não `opacity: 0`) nos placeholders que ficam sobre o AVPlay
7. **Zero React re-render no D-pad** — usar Vanilla JS Bypass + useRef para leituras rápidas

---

## ISSUES CONHECIDOS / PRÓXIMOS PASSOS

### 🔴 Crítico
1. **Hero channels são hardcoded** — `O Rei Leão`, `Stranger Things`, `Vingadores` com streams vazias. Clicar no banner vai para DetailScreen mas não reproduz nada real. Precisa mapear para canais reais da M3U.

### 🟡 Importante
2. **ContentCatalog.getPool('filmes')** retorna só canais não-matched (M3U genérico). Premium catalog (Netflix/HBO etc.) vai para 'outros'. Filmes/Séries tabs mostram conteúdo de qualidade inferior ao Home. Solução: `normalizeGroups` para matched channels deve usar tipo de mídia (`movie`/`series`) em vez do streaming name.
3. **Star+, Telecine, Crunchyroll** em `STREAMING_CONF` usam keys que não existem no `Streaming` type do catalog.ts. Essas rows sempre ficam vazias silenciosamente.
4. **`imagePreloader` sem seek a 4 minutos** — commit `a048c0f` menciona "seek para 4min" mas useCardAutoplay atual não implementa seek. Pode ter sido removido ou está incompleto.

### 🟢 Bom para ter
5. **DetailScreen** — existe mas conteúdo e UX não foram revisados nesta sessão
6. **Settings e Profile screens** — placeholders, sem funcionalidade real ainda
7. **Expand catalog.ts** — adicionar `'star' | 'telecine' | 'crunchyroll'` ao Streaming type e popular o catalog com esses títulos

---

## COMANDOS

```bash
# Dev (PC)
npm run dev

# Build + Deploy TV
bash deploy.sh

# Log server remoto
node scripts/log-server.cjs

# Debug na TV
Botão Vermelho → toggle DebugOverlay
RIGHT no último item do topbar → toggle DebugOverlay (alt)
```

---

## PLAYLIST M3U
```
http://cdc55.cc/get.php?username=0357028521&password=82740&type=m3u_plus&output=ts
```

---

**Última atualização:** 25/04/2026 (análise completa do codebase)
**Status:** Fase 3 avançada — Layout + Video Preview + Seamless Expand implementados. Issues conhecidos documentados acima.
