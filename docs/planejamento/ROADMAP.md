# Roadmap ziiiTV — Documento Oficial

> [!NOTE]
> Este documento centraliza o planejamento do ziiiTV, com as fases atualizadas após a validação da Stack em TV Samsung reais e a construção da UI.

## ✅ Fase 1: Stack Validada (COMPLETA)
- [x] React monta e renderiza na TV (Downgrade para Vite 4 + `@vitejs/plugin-legacy`)
- [x] Playlist carrega (fetch + parse)
- [x] Arquitetura enterprise (singleton DB, idempotência, feature flags)
- [x] Cache persiste (IndexedDB validado entre sessões)
- [x] DebugOverlay implementado
- [x] Navegação D-pad básica (Enter, Back, F1, F2)

## ✅ Fase 2: Home Netflix-like (COMPLETA)
- [x] Layout Netflix-like com hero banner
- [x] Hero banner com dinâmico 
- [x] Carrosséis horizontais flexíveis organizados por streaming (Netflix, Amazon, HBO, Disney+, etc)
- [x] Descrição inteligente abaixo do card focado (3 linhas, Inter font, 55% largura)
- [x] Preview da próxima row visível
- [x] Limpeza agressiva de nomes no parsing da Playlist (zero duplicatas)
- [x] DebugOverlay lateral retrátil (F1 toggle, F2 limpar logs)
- [x] TMDB enrichment em background
- [x] Navegação D-pad estrita e fluida entre zonas (sidebar, topbar, hero, content)
- [x] Continuar Assistindo funcional (base de mock)

## ✅ Fase 3: Player + Tela de Canais (COMPLETA)
- [x] Validar inicialização do Player (Shaka + nativo Samsung AVPlay) na TV real
- [x] Construir lógica autônoma para interceptar links .ts diretos e passar pro AVPlay (PlayerManager)
- [x] Criar tela de Canais independente da Home (via `activeView === 'live'`)
- [x] Grid de canais com EPG (Enriquecimento via TMDB/SportsArtwork)
- [x] Navegação D-pad dentro do Player + Mudança de canais (Seamless Expand)
- [x] Funcionalidade de Preview em miniatura do canal ativo no catálogo (Double-Buffer + setDisplayRect)

## 🎯 Fase 4: Busca e Filtros (PRÓXIMA)
- [ ] Tela de busca isolada
- [ ] Virtual Keyboard nativo da TV (se possível) ou teclado custom D-pad
- [ ] Sistema de Filtros rápidos: Gêneros TMDB, Ano de lançamento, Nota (Rating)
- [ ] Histórico de busca via IndexedDB

## 🔮 Fase 5: Otimizações e Scale
- [ ] Substituir lists massivas por Virtualização de dom (ex: `react-window`)
- [ ] Implementar Intersection Observers para Lazy Loading de imagens pesadas (backdrops)
- [ ] Prefetch de metadados do TMDB assim que card entra em vista
- [ ] Debounce intensivo no scroll dos canais para poupar a CPU da TV (Legacy Chromium)

## 🔮 Fase 6: Features Avançadas (Visão Futura)
- [ ] Favoritos persistentes cross-playlist
- [ ] Listas/Perfis personalizados ("Minha Lista")
- [ ] AI-Powered Recommendations (baseado no watch history guardado localmente)
- [ ] Sincronização em nuvem ou multi-dispositivo
- [ ] Controle parental nativo

---

## 🏛 Decisões Arquiteturais Vigentes

### Estratégia de Parse (Atual - Fase 2)
- Remove tags de ano ("2023"), qualidades HD/FHD/4K, codecs
- Mantém o nome puro. Agrupa as variantes técnicas ocultamente.
- Detecta plataforma do filme pelo "group-title" dentro da source (filtra o VOD do Live).

### Estratégia Content-First (Ideal - Fase 7)
Visão arquitetônica futura para suportar M3Us de 50k+ com total perfeição:
- **Identidade:** `canonicalId`, `canonicalName`, `contentType` 
- **Metadata Centralizada:** Agrupamentos lógicos em vez de listas puras M3U.
- **VOD vs Live Strict Separation:** Evitar que engine misture filmes on-demand com televisão linear.
