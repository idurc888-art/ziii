# ziiiTV — Contexto do Projeto

## Objetivo
App IPTV para Samsung Tizen 4.0+ (TV UN50RU7100GXZD) que carrega playlists M3U, navega com D-pad e reproduz streams HLS/DASH/TS.

## Stack Confirmada (Funcionando na TV)
- React 18 + Vite 4 + TypeScript
- Vite 4.5.14 com `@vitejs/plugin-legacy` (polyfills para Chromium 56+)
- IndexedDB nativo singleton (sem lib `idb` que causava problemas)
- Shaka Player (HLS/DASH) + AVPlay (fallback .ts)
- Zustand + Web Worker (fallback thread principal)

## Status Atual (18/04/2026 10:02)
✅ **FASE 2 COMPLETA** — Home organizada por streaming + zero duplicatas
- Layout Netflix-like funcionando na TV
- Hero banner com 5 slides (Stranger Things primeiro)
- **Home organizada por streaming**: Netflix, Amazon, HBO, Disney+ (filmes e séries separados)
- **Limpeza agressiva de nomes**: remove anos, "O Filme", "Parte X", etc
- **DebugOverlay lateral retrátil**: F1 toggle, F2 limpar
- Descrição abaixo do card focado (3 linhas, Inter font, largura 55%)
- Preview da próxima row visível
- Cache persiste entre sessões (IndexedDB validado)
- Navegação D-pad (Enter, Back, F1, F2)

## Decisões Técnicas Críticas
1. **Vite 4 em vez de Vite 8** — Rolldown não gera código compatível com Chromium 56/63
2. **Plugin-legacy sem viteSingleFile** — conflito entre os dois, arquivos separados funcionam
3. **IndexedDB nativo singleton** — lib `idb` não persistia dados, API nativa com singleton funciona
4. **Web Worker fallback** — `type: 'module'` não suportado, parse no thread principal
5. **DebugOverlay lateral retrátil** — menu na lateral direita, abre/fecha com F1 ou click
6. **Arquitetura enterprise** — singleton DB, idempotência, feature flags, logs limpos
7. **Limpeza agressiva de nomes** — remove anos, artigos, qualidade, codecs para eliminar duplicatas
8. **Home por streaming** — organiza filmes/séries por Netflix, Amazon, HBO, Disney+

## Organização da Home
```
🎬 Netflix Filmes
📺 Netflix Séries
🎥 Amazon Filmes
🍿 Amazon Séries
🎭 HBO Filmes
🎪 HBO Séries
✨ Disney+ Filmes
🏰 Disney+ Séries
🔥 Continuar Assistindo (último)
```

## Referência de Layout
`/home/carneiro888/Documentos/zikualdo/Telvix/LEGACY_SVELTE_TELVIX/` — projeto Svelte que funcionava na TV, layout Netflix-like com:
- Sidebar 70px (ícones verticais)
- Topbar horizontal (links grandes)
- Hero banner (carrossel com backdrop)
- Carrosséis horizontais (Top 10, Continuar, Categorias)
- Navegação D-pad entre 4 zonas (sidebar, topbar, hero, content)

## Arquivos Importantes
- `STACK_ATUAL.md` — stack técnica detalhada
- `REGRAS_ENTERPRISE.md` — regras obrigatórias do projeto
- `ROADMAP.md` — planejamento de fases
- `ARQUITETURA.md` — arquitetura enterprise (singleton, idempotência)
- `vite.config.ts` — Vite 4 + plugin-legacy
- `deploy.sh` — build + package + install na TV
- `public/config.xml` — manifest Tizen com CSP permissivo
- `src/components/DebugOverlay.tsx` — menu lateral retrátil de debug
- `src/services/dbClient.ts` — singleton IndexedDB
- `src/services/playlistService.ts` — idempotência + feature flag DEBUG
- `src/services/streamNormalizer.ts` — limpeza agressiva de nomes + dedup
- `src/services/contentSelector.ts` — organiza home por streaming
- `src/store/channelsStore.ts` — estados explícitos + proteção contra reprocessamento

## Próximos Passos
1. **Implementar tela de Canais** (TV ao vivo separada da home)
2. **Melhorar detecção de streaming** (usar group-title da playlist)
3. **Adicionar filtros por gênero** (TMDB genres)
4. **Implementar busca** (search screen)
5. **Otimizações de performance** (virtualização de listas)
