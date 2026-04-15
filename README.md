# ziiiTV — Contexto do Projeto

## Objetivo
App IPTV para Samsung Tizen 4.0+ (TV UN50RU7100GXZD) que carrega playlists M3U, navega com D-pad e reproduz streams HLS/DASH/TS.

## Stack Confirmada (Funcionando na TV)
- React 18 + Vite 4 + TypeScript
- Vite 4.5.14 com `@vitejs/plugin-legacy` (polyfills para Chromium 56+)
- IndexedDB nativo singleton (sem lib `idb` que causava problemas)
- Shaka Player (HLS/DASH) + AVPlay (fallback .ts)
- Zustand + Web Worker (fallback thread principal)

## Status Atual (15/04/2026 10:33)
✅ **Fase 1 COMPLETA** — Stack validada na TV real
- React monta e renderiza
- Playlist carrega (fetch + parse funcionam)
- **Cache persiste entre sessões** (IndexedDB validado)
- DebugOverlay implementado (painel lateral com logs em tempo real)
- Navegação D-pad (Enter, Back, F1, F2)
- **Arquitetura enterprise limpa** (singleton DB, idempotência, feature flags)

✅ **Arquitetura Enterprise (15/04/2026)**
- Singleton `dbClient.ts` - uma instância de DB por sessão
- Idempotência total - URL já carregada retorna da memória
- Feature flag `DEBUG` - testes nativos só em modo debug
- Logs limpos - apenas estados essenciais (cache check/hit/miss/ready)
- Zero ruído - sem reaberturas de DB, sem reprocessamento

🎯 **Próximo passo:** Validar Player (Shaka + AVPlay) antes de implementar layout

## Decisões Técnicas Críticas
1. **Vite 4 em vez de Vite 8** — Rolldown não gera código compatível com Chromium 56/63
2. **Plugin-legacy sem viteSingleFile** — conflito entre os dois, arquivos separados funcionam
3. **IndexedDB nativo singleton** — lib `idb` não persistia dados, API nativa com singleton funciona
4. **Web Worker fallback** — `type: 'module'` não suportado, parse no thread principal
5. **DebugOverlay** — painel lateral na TV para ver logs sem Web Inspector
6. **Arquitetura enterprise** — singleton DB, idempotência, feature flags, logs limpos

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
- `src/components/DebugOverlay.tsx` — painel de debug na TV
- `src/services/dbClient.ts` — singleton IndexedDB
- `src/services/playlistService.ts` — idempotência + feature flag DEBUG
- `src/store/channelsStore.ts` — estados explícitos + proteção contra reprocessamento

## Próximos Passos
1. **Validar Player** (Shaka + AVPlay) na TV
2. Implementar layout Telvix (sidebar + topbar + hero)
3. Sistema de navegação D-pad (4 zonas)
4. Carrosséis horizontais com scroll automático
5. Otimizações de performance
