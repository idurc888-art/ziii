# Roadmap — ziiiTV

## ✅ Fase 1: Fundação (COMPLETO - 15/04/2026)
- [x] Setup React + Vite + TypeScript
- [x] Estrutura de pastas (screens, services, store, workers)
- [x] Navegação básica (home/player/settings)
- [x] Deploy pipeline (build + package + install)
- [x] **CRÍTICO:** Resolver bundle quebrado na TV
- [x] Validar playlist engine (fetch + parse)
- [x] DebugOverlay implementado

### Problema Resolvido
- **Causa:** Vite 8 com Rolldown não gera código compatível com Chromium 56/63
- **Solução:** Downgrade para Vite 4 + `@vitejs/plugin-legacy`
- **Resultado:** React monta na TV ✅

### Validações na TV Real
- ✅ React renderiza
- ✅ Fetch M3U externo funciona
- ✅ Parse M3U funciona (fallback sem Worker)
- ✅ Lista de canais exibe
- ✅ **IndexedDB nativo funciona (cache persiste entre sessões)**
- ✅ Navegação D-pad (Enter, Back, F1, F2)
- ✅ **Arquitetura enterprise (singleton DB, idempotência, feature flags)**

---

## 🎯 Fase 2: Player (PRÓXIMO - Estimativa: 4-6h)

### 2.1 Teste Básico
- [ ] Criar tela de teste do player
- [ ] Botão "Tocar Canal X" com D-pad
- [ ] Elemento `<video>` básico

### 2.2 Shaka Player
- [ ] Integrar Shaka Player 5.1.2
- [ ] Config otimizado para TV (buffer, ABR)
- [ ] Testar stream HLS na TV
- [ ] Testar stream DASH na TV
- [ ] Controles básicos (play, pause)

### 2.3 AVPlay Fallback
- [ ] Detectar streams .ts diretos
- [ ] Usar AVPlay Samsung nativo
- [ ] Controles unificados
- [ ] Validar playback na TV

---

## ⏳ Fase 3: Layout Telvix (Estimativa: 10-12h)

### 3.1 Estrutura Base
- [ ] Sidebar 70px (ícones verticais)
- [ ] Topbar horizontal (links grandes)
- [ ] Hero banner estático (sem carrossel ainda)
- [ ] Container de conteúdo (viewport)

### 3.2 Sistema de Navegação
- [ ] FocusManager (classe que gerencia `.card-focused`)
- [ ] 4 zonas de foco: `sidebar`, `topbar`, `hero`, `content`
- [ ] D-pad handler (ArrowUp/Down/Left/Right)
- [ ] Transições entre zonas

### 3.3 Carrosséis
- [ ] Top 10 (cards largos com número gigante)
- [ ] Continuar Assistindo (cards simples)
- [ ] Categorias (cards portrait)
- [ ] Scroll automático (card focado sempre visível)

### 3.4 Hero Dinâmico
- [ ] Carrossel de slides (5 slides)
- [ ] Preview dinâmico (backdrop muda com card focado)
- [ ] Estados: `default`, `focused`, `collapsed`

---

## ⏳ Fase 4: Cache + Performance (Estimativa: 4-6h)

### 4.1 Resolver Persistência
- [ ] Testar salvar só metadados (sem logos)
- [ ] Comprimir dados antes de salvar
- [ ] localStorage como fallback (limite 5MB)
- [ ] Validar persistência na TV

### 4.2 Otimizar Parse
- [ ] Chunking de dados grandes
- [ ] Progress feedback durante parse
- [ ] Cancelamento de operações

---

## ⏳ Fase 5: Polish (Estimativa: 4-6h)

### 5.1 Visual
- [ ] Animações suaves (transitions)
- [ ] Glow effects (box-shadow)
- [ ] Tags coloridas (top 10, novo, etc)
- [ ] Loading states

### 5.2 Performance
- [ ] Lazy load de imagens
- [ ] Virtualização de listas longas
- [ ] Debounce de scroll

### 5.3 Testes na TV
- [ ] Validar navegação D-pad
- [ ] Testar playback HLS/DASH
- [ ] Testar fallback AVPlay
- [ ] Validar performance (FPS, memória)

---

## Estimativa de Tempo Total

| Fase | Tempo | Status |
|------|-------|--------|
| Fase 1 | 12h | ✅ Completo |
| Fase 2 | 4-6h | 🎯 Próximo |
| Fase 3 | 10-12h | ⏳ Aguardando |
| Fase 4 | 4-6h | ⏳ Aguardando |
| Fase 5 | 4-6h | ⏳ Aguardando |

**Total:** 34-42h de trabalho focado
