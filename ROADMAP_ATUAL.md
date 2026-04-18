# Roadmap ziiiTV — Atualizado 18/04/2026

## ✅ Fase 1: Stack Validada (COMPLETA)
- [x] React monta e renderiza na TV
- [x] Playlist carrega (fetch + parse)
- [x] Cache persiste (IndexedDB validado)
- [x] DebugOverlay implementado
- [x] Navegação D-pad básica
- [x] Arquitetura enterprise (singleton, idempotência, feature flags)

## ✅ Fase 2: Home Netflix-like (COMPLETA - 18/04/2026)
- [x] Layout Netflix-like com hero banner
- [x] Hero banner com 5 slides (Stranger Things primeiro)
- [x] Carrosséis horizontais organizados por streaming
- [x] Netflix, Amazon, HBO, Disney+ (filmes e séries separados)
- [x] Descrição abaixo do card focado (3 linhas, Inter font, 55% largura)
- [x] Preview da próxima row visível
- [x] Limpeza agressiva de nomes (zero duplicatas)
- [x] DebugOverlay lateral retrátil (F1 toggle, F2 limpar)
- [x] TMDB enrichment em background
- [x] Navegação D-pad entre zonas (sidebar, topbar, hero, content)
- [x] Continuar Assistindo (última row)

## 🎯 Fase 3: Player + Tela de Canais (PRÓXIMA)
- [ ] Validar Player (Shaka + AVPlay) na TV
- [ ] Tela de Canais (TV ao vivo separada)
- [ ] Grid de canais com EPG
- [ ] Navegação entre canais (números, setas)
- [ ] Preview de canal ao focar

## 🔮 Fase 4: Busca e Filtros
- [ ] Tela de busca com teclado virtual
- [ ] Filtros por gênero (TMDB genres)
- [ ] Filtros por ano, rating
- [ ] Histórico de busca

## 🔮 Fase 5: Otimizações
- [ ] Virtualização de listas (react-window)
- [ ] Lazy loading de imagens
- [ ] Prefetch de próximos cards
- [ ] Cache de imagens TMDB
- [ ] Otimização de re-renders

## 🔮 Fase 6: Features Avançadas
- [ ] Favoritos persistentes
- [ ] Listas personalizadas
- [ ] Recomendações inteligentes
- [ ] Sincronização multi-dispositivo
- [ ] Controle parental

## Decisões Arquiteturais

### Content-First (Planejado para Fase 7)
Arquitetura futura para eliminar 100% das duplicatas:
- **Identidade canônica**: `canonicalId`, `canonicalName`, `contentType`
- **Metadata**: `categoryPath`, `displayName`, TMDB enrichment
- **Variantes técnicas**: agrupa HD/FHD/4K do mesmo conteúdo
- **Separação VOD/Live**: filmes e séries separados de TV ao vivo

### Limpeza Atual (Fase 2)
- Remove anos, "O Filme", "Parte X", "Vol X"
- Remove qualidade, codecs, idioma
- Agrupa por nome limpo + slug
- Detecta streaming por group-title
