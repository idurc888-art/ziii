# Arquitetura ziiiTV — Atualizado 18/04/2026

## Visão Geral
App IPTV content-first para Samsung Tizen com arquitetura enterprise, focado em VOD (filmes/séries) organizado por streaming.

## Princípios Arquiteturais

### 1. Singleton Pattern
- **dbClient.ts**: Uma instância de IndexedDB por sessão
- **ContentCatalog**: Catálogo único de conteúdo normalizado
- **playlistService**: Gerenciador único de playlists com cache

### 2. Idempotência
- URL já carregada retorna da memória (RAM)
- Cache em IndexedDB persiste entre sessões
- Reprocessamento zero: `loadedUrls` Map previne duplicação

### 3. Feature Flags
- `DEBUG`: ativa logs detalhados e testes nativos
- Produção: logs mínimos (cache check/hit/ready)

### 4. Content-First (Implementação Atual)
- **Normalização agressiva**: remove anos, qualidade, "O Filme", "Parte X"
- **Deduplicação por slug**: `slugify(cleanName)` gera ID único
- **Agrupamento de variantes**: HD/FHD/4K do mesmo conteúdo
- **Organização por streaming**: detecta Netflix, Amazon, HBO, Disney+

## Camadas da Aplicação

### Data Layer
```
RawChannel (M3U) 
  → streamNormalizer (limpeza + dedup)
  → categoryMapper (filmes/series/esportes/etc)
  → ContentCatalog (singleton com score)
  → contentSelector (organiza por streaming)
  → HomeScreen (UI)
```

### Services
- **playlistService.ts**: Fetch + parse + cache (idempotente)
- **streamNormalizer.ts**: Limpeza agressiva + dedup por slug
- **categoryMapper.ts**: Classifica em 8 categorias UI
- **contentCatalog.ts**: Singleton com score e warmup TMDB
- **contentSelector.ts**: Monta rows por streaming
- **tmdbService.ts**: Enrichment em background (batches de 10)
- **historyService.ts**: Histórico de reprodução persistente

### State Management
- **Zustand**: Estado global reativo
- **channelsStore.ts**: Estados explícitos (idle/loading/ready/error)
- Proteção contra reprocessamento

### UI Components
- **HomeScreen**: Layout Netflix-like com hero + rows
- **HeroBanner**: Carrossel com 5 slides
- **ContentRow**: Carrossel horizontal com focus
- **DebugOverlay**: Menu lateral retrátil (F1 toggle)

## Normalização de Conteúdo

### Limpeza Agressiva (streamNormalizer.ts)
```typescript
cleanChannelName(raw: string): string
  - Remove prefixos: |||BR|||, [BR], {BR}
  - Remove parênteses e colchetes
  - Remove qualidade: 4K, FHD, HD, SD, 1080p, 720p
  - Remove codecs: H.264, H.265, HEVC
  - Remove idioma: DUB, LEG, PT-BR
  - Remove anos: 2024, 2023, etc
  - Remove "O Filme", "A Serie", "Temporada X"
  - Remove "Parte X", "Vol X", "S01", "T01"
  - Capitaliza primeira letra de cada palavra
```

### Detecção de Streaming (contentSelector.ts)
```typescript
detectStreaming(channel: Channel): string
  - Analisa group-title da playlist
  - Detecta: netflix, amazon, hbo, disney, paramount, apple
  - Fallback: 'outros'
```

### Score de Qualidade (contentCatalog.ts)
```typescript
calcScore(channel, tmdb): number (0-100)
  - TMDB rating: 0-40 pts
  - Backdrop/poster: 0-25 pts
  - Overview: 0-10 pts
  - Ano recente (≥2022): 0-10 pts
  - Nome limpo: 0-10 pts
  - Stream premium (4K/FHD): 0-5 pts
```

## Organização da Home

### Estrutura Atual
```
Hero Banner (5 slides)
  ↓
🎬 Netflix Filmes (20 cards)
📺 Netflix Séries (20 cards)
🎥 Amazon Filmes (20 cards)
🍿 Amazon Séries (20 cards)
🎭 HBO Filmes (20 cards)
🎪 HBO Séries (20 cards)
✨ Disney+ Filmes (20 cards)
🏰 Disney+ Séries (20 cards)
🔥 Continuar Assistindo (wide cards)
```

### Navegação D-pad
- **4 zonas**: sidebar, topbar, hero, content
- **Teclas**: Enter (selecionar), Back (voltar), F1 (debug), F2 (limpar logs)
- **Focus system**: portrait → wide on focus
- **Descrição**: 3 linhas, Inter font, 55% largura, abaixo do card focado

## TMDB Enrichment

### Warmup em Background
```typescript
ContentCatalog.warmup()
  - 100 filmes + 100 séries
  - Batches de 10 (rate limit)
  - Atualiza: backdrop, poster, overview, genres, rating, year
  - Re-ordena por score atualizado
```

### Fallback
- Sem TMDB: usa logo da playlist
- Sem overview: não exibe descrição
- Score base: 50 pts

## Cache Strategy

### IndexedDB (dbClient.ts)
```typescript
Store: 'playlists'
Key: URL da playlist
Value: Record<string, Channel[]> (grupos)
TTL: Infinito (persiste entre sessões)
```

### RAM (playlistService.ts)
```typescript
loadedUrls: Map<string, { data, timestamp }>
  - Primeira consulta: retorna imediatamente
  - Evita reprocessamento
```

## Debug System

### DebugOverlay (lateral retrátil)
- **Fechado**: Botão vertical na lateral direita
- **Aberto**: Painel 400px com logs
- **F1**: Toggle abrir/fechar
- **F2**: Limpar logs
- **Click**: Abre/fecha
- **Logs**: Timestamp, tag, mensagem, nível (log/warn/error)

## Performance

### Otimizações Atuais
- Parse M3U no thread principal (Worker fallback)
- Batch TMDB (10 por vez)
- Cache persistente (IndexedDB)
- Dedup agressivo (slug-based)
- Lazy rendering (rows fora da tela não renderizam descrição)

### Próximas Otimizações (Fase 5)
- Virtualização de listas (react-window)
- Lazy loading de imagens
- Prefetch de próximos cards
- Cache de imagens TMDB
- Memoização de componentes

## Deployment

### Build
```bash
npm run build
  → Vite 4 + plugin-legacy
  → Polyfills para Chromium 56+
  → Output: dist/
```

### Deploy
```bash
./deploy.sh
  → tizen package (cria .wgt)
  → tizen install (instala na TV)
  → Target: 10.0.0.100:26101
  → App ID: 2TDndgJZyN.ziiiTV
```

## Próximos Passos

### Fase 3: Player + Canais
- Validar Shaka Player + AVPlay
- Tela de Canais (TV ao vivo)
- Grid com EPG
- Navegação por números

### Fase 7: Content-First Completo
- `CanonicalContent` com identidade única
- `contentType`: movie/series/live/sports
- `categoryPath`: movies/action, series/crime
- Variantes técnicas agrupadas
- Zero duplicatas garantido
