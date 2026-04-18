# ziiiTV — Resumo Executivo (18/04/2026 10:06)

## Status do Projeto
✅ **FASE 2 COMPLETA** — App funcionando na TV com home organizada por streaming

## O Que Funciona Agora
1. **Home Netflix-like** com hero banner e carrosséis horizontais
2. **Organização por streaming**: Netflix, Amazon, HBO, Disney+ (filmes e séries separados)
3. **Zero duplicatas**: limpeza agressiva de nomes elimina repetições
4. **TMDB enrichment**: backdrop, poster, overview, genres, rating
5. **Cache persistente**: IndexedDB mantém dados entre sessões
6. **Debug lateral retrátil**: F1 abre/fecha, F2 limpa logs
7. **Navegação D-pad**: 4 zonas (sidebar, topbar, hero, content)
8. **Descrição dinâmica**: 3 linhas abaixo do card focado

## Arquitetura
- **React 18 + Vite 4 + TypeScript**
- **Singleton pattern**: DB, Catalog, Playlist Service
- **Idempotência total**: URL carregada retorna da memória
- **Feature flags**: DEBUG mode para logs detalhados
- **Content-first**: normalização agressiva + dedup por slug

## Organização da Home
```
Hero Banner (Stranger Things + 4 slides)
  ↓
🎬 Netflix Filmes
📺 Netflix Séries
🎥 Amazon Filmes
🍿 Amazon Séries
🎭 HBO Filmes
🎪 HBO Séries
✨ Disney+ Filmes
🏰 Disney+ Séries
🔥 Continuar Assistindo
```

## Métricas
- **291.055 canais** processados
- **35.148 filmes** únicos
- **251.393 séries** únicas
- **~270KB** bundle moderno
- **~275KB** bundle legacy
- **~100KB** polyfills

## Próximos Passos
1. **Fase 3**: Player (Shaka + AVPlay) + Tela de Canais
2. **Fase 4**: Busca e filtros por gênero
3. **Fase 5**: Otimizações (virtualização, lazy loading)
4. **Fase 7**: Content-first completo (identidade canônica)

## Deploy
```bash
./deploy.sh
# Instala na TV: 10.0.0.100:26101
# App ID: 2TDndgJZyN.ziiiTV
```

## Backup
```bash
/home/carneiro888/ziiiTV_backup_20260418_100647.tar.gz (19MB)
```

## Decisões Técnicas Críticas
1. **Vite 4** (não 8): compatibilidade com Chromium 56/63
2. **IndexedDB nativo**: lib `idb` não persistia
3. **Limpeza agressiva**: remove anos, "O Filme", "Parte X"
4. **Streaming detection**: usa group-title da playlist
5. **Debug lateral**: menu retrátil na lateral direita

## Arquivos Importantes
- `README.md` — contexto do projeto
- `ROADMAP_ATUAL.md` — planejamento de fases
- `ARQUITETURA_ATUAL.md` — arquitetura detalhada
- `src/services/streamNormalizer.ts` — limpeza + dedup
- `src/services/contentSelector.ts` — organização por streaming
- `src/components/DebugOverlay.tsx` — debug lateral
- `deploy.sh` — build + deploy automático
