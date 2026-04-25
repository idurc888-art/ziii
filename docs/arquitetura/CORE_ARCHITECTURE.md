# Arquitetura Core — ziiiTV

## Visão Geral
App IPTV content-first para Samsung Tizen com arquitetura enterprise, focado em VOD (filmes/séries) organizado por streaming.

## Princípios Arquiteturais

### 1. Singleton Pattern
**Uma instância de recursos pesados por sessão:**
- `dbClient.ts`: Uma instância de IndexedDB por sessão para leitura ultrarrápida.
- `ContentCatalog`: Catálogo único de conteúdo normalizado (Singleton com score).
- `playlistService`: Gerenciador único de playlists com cache.

### 2. Idempotência
**Mesma URL = mesma resposta, sem reprocessamento:**
- URL já carregada retorna da memória (RAM).
- Se está carregando (promise), reutiliza a requisição vigente, evitando concorrência destrutiva.
- Reprocessamento zero: `loadedUrls` Map previne duplicação.

### 3. Estados Explícitos (Store)
**Fluxo previsível via Zustand (`channelsStore.ts`)**
- `idle` → `cache_check` → `ready` ou `error`
- Evita estados ambíguos na UI.

### 4. Feature Flags
- `DEBUG`: ativa logs detalhados e testes nativos na TV via on-screen Overlay.
- Produção: console limpo com menos de 4 logs.

## Camadas da Aplicação (Data Flow)
```
RawChannel (M3U) 
  → streamNormalizer (limpeza + dedup)
  → categoryMapper (filmes/series/esportes/etc)
  → ContentCatalog (singleton com score)
  → contentSelector (organiza por streaming via detectStreaming)
  → HomeScreen (UI React)
```

## Normalização de VODs (Content-First Ideal)

### Limpeza Agressiva (`streamNormalizer.ts`)
- Remove prefixos: `|||BR|||`, `[BR]`, `{BR}`
- Remove resoluções/codecs: `4K`, `FHD`, `HEVC`, `H.264`
- Remove idiomas: `DUB`, `LEG`
- Padrão Singleton Name: Agrupa as variantes técnicas ocultamente através do `slug`.

### Classificação (`contentSelector.ts`)
- Analisa `group-title` da playlist M3U e indexa canais por Streaming (Netflix, Amazon, HBO, Disney+, Apple, Paramount) separando Filmes e Séries.

### Enrich e Ranking (`contentCatalog.ts` + `tmdbService.ts`)
- Score dinâmico (0-100) para cada título.
- Ratings TMDB, existência de arte gráfica, ano recente ganham bônus de score.
- Fetch de TMDB roda de background via rate-limit control (batches de 10).

## Cache Strategy & Performance

### IndexedDB (`dbClient.ts`)
- Persistência das playlists brutas/processadas entre saídas e retornos no App.
- Extrema rapidez para Tizen (TV fraca de RAM).

### Otimizações
- Parse fallback main thread (quando worker do Tizen capotar).
- Batch de requisições de Metadata (TMDB) e suspensão visual caso metadata não venha.
- Componentes da lista renderizam baseados em Threshold / Lazy.

## Player Layer (AVPlay) - ✅ ESTÁVEL

### PlayerManager (Singleton)
- **Instância global única** de AVPlay fora do ciclo React
- **Debounce 1.5s** antes de iniciar preview (evita sobrecarga)
- **`isAVPlayBusy` flag** para prevenir PLAYER_ERROR_INVALID_STATE
- **Loop infinito corrigido:** preview para naturalmente ao terminar (sem `seekTo(0)`)
- **`oncurrentplaytime` limitado:** 1x/segundo (não 60x/seg) para evitar sobrecarga de CPU
- **Expand/collapse fullscreen** sem bloqueio (remove check `isAVPlayBusy`)

### Hooks
- **`useCardAutoplay`:** conecta card focado ao PlayerManager, reseta thumb instantaneamente ao trocar
- **`useStreamPreview`:** double-buffer AVPlay para HeroCarousel (player-a/player-b)
- **`useSeamlessExpand`:** expansão seamless card→fullscreen sem interromper stream

### Transições Perfeitas
- **Troca de card:** thumb aparece instantaneamente (`transition: 'none'`)
- **Preview inicia:** fade suave thumb→vídeo (200ms via delay no `setState`)
- **Sem flash preto:** thumb sempre visível até vídeo estar pronto
- **Sem tela preta entre cards:** `setState(IDLE)` imediato ao trocar

### Hole-Punch Layer
- Vídeo nativo renderiza **atrás** do HTML transparente
- `setDisplayRect()` sincronizado com posição do card na tela
- Fundo `transparent` quando vídeo toca, `#000` quando idle

### Controle D-Pad
- Navegação via `keyboardManager` (Vanilla JS, zero lag)
- Enter durante preview: expande para fullscreen
- Back durante fullscreen: colapsa para card
- Setas durante preview: cancela e troca de card instantaneamente

### Máquina de Estados
```
IDLE → OPENING → PREPARING → READY → PLAYING
                                  ↓
                              (termina naturalmente)
```
