# Índice de Tecnologias — ziiiTV

Documentação técnica organizada por tópicos para consulta rápida e pesquisa profunda.

## 📱 Tizen

### [Versões e Compatibilidade](./tizen/VERSOES_E_COMPATIBILIDADE.md)
- Tabela oficial Samsung (2015-2026)
- TV alvo do projeto (UN50RU7100GXZD)
- Limitações por versão (Chromium 56 vs 63)
- Estratégia de compatibilidade

**Quando consultar:** Decidir versão mínima suportada, entender limitações de ES6/polyfills

---

## 🎬 Player

### [Comparativo de Players](./player/COMPARATIVO_PLAYERS.md)
- Shaka Player vs HLS.js vs AVPlay vs Video.js
- Por que Shaka Player é a escolha certa
- Configuração otimizada para TVs
- Estratégia híbrida (Shaka + AVPlay fallback)

**Quando consultar:** Implementar player, debugar problemas de playback, escolher entre Shaka/AVPlay

---

## 📡 Streaming

### [Protocolos de Streaming](./streaming/PROTOCOLOS.md)
- HLS (HTTP Live Streaming) — `.m3u8`
- DASH (Dynamic Adaptive Streaming) — `.mpd`
- TS Direto (Transport Stream) — `.ts`
- Comparativo e quando usar cada um

**Quando consultar:** Entender formato de stream, decidir player, debugar problemas de manifest

---

## 🔒 DRM

### [DRM em Tizen](./drm/DRM_TIZEN.md)
- Widevine (Google) — Levels 1/2/3
- PlayReady (Microsoft)
- FairPlay (Apple)
- EME (Encrypted Media Extensions)
- Certificação e custos

**Quando consultar:** Implementar conteúdo premium, entender limitações de DRM, certificação

---

## ⚡ Performance

### [Otimizações para Tizen](./performance/OTIMIZACOES_TIZEN.md)
- Limitações de hardware (RAM, CPU, GPU)
- Bundle size e code splitting
- Rendering (React.memo, virtualização)
- Animações CSS (GPU-accelerated)
- Imagens (preload crítico + lazy load)
- IndexedDB (singleton, operações assíncronas)
- Web Workers (fallback main thread)
- AVPlay (evitar loop infinito, limitar callbacks)

**Quando consultar:** App travando, FPS baixo, RAM alta, bundle grande, scroll lento

---

## 🛠️ Build

### [Vite e Build](./build/VITE_E_BUILD.md)
- Por que Vite 4 (não Vite 8)
- Configuração vite.config.ts
- Plugin Legacy (polyfills + transpilação)
- Tizen Studio (certificado, package, deploy)
- Script de deploy automatizado
- config.xml (CSP permissivo)
- Troubleshooting

**Quando consultar:** Setup inicial, problemas de build, deploy na TV, certificado expirado

---

## 🔍 Como Usar Este Índice

### Por Problema
1. **App não carrega na TV** → [Build](./build/VITE_E_BUILD.md) + [Tizen](./tizen/VERSOES_E_COMPATIBILIDADE.md)
2. **Vídeo não toca** → [Player](./player/COMPARATIVO_PLAYERS.md) + [Streaming](./streaming/PROTOCOLOS.md)
3. **App travando** → [Performance](./performance/OTIMIZACOES_TIZEN.md)
4. **Conteúdo premium** → [DRM](./drm/DRM_TIZEN.md)

### Por Fase do Projeto
- **Setup inicial** → Build → Tizen
- **Implementar player** → Player → Streaming
- **Otimizar** → Performance
- **Conteúdo premium** → DRM

### Por Tecnologia
- **Shaka Player** → Player + Streaming + DRM
- **AVPlay** → Player + Performance
- **Vite** → Build
- **React** → Performance (rendering)

---

## 📚 Documentação Complementar

### Arquitetura
- [CORE_ARCHITECTURE.md](../arquitetura/CORE_ARCHITECTURE.md) — Singleton, idempotência, estados
- [STACK_E_TECNOLOGIAS.md](../arquitetura/STACK_E_TECNOLOGIAS.md) — Stack completa

### Planejamento
- [ROADMAP.md](../planejamento/ROADMAP.md) — Fases do projeto
- [CHANGELOG_VIDEO_PREVIEW.md](../planejamento/CHANGELOG_VIDEO_PREVIEW.md) — Histórico de features

### Design
- [LAYOUT_TELVIX.md](../design_e_ui/LAYOUT_TELVIX.md) — Referência de layout Netflix-like
- [COMPARATIVO_ZIITV_VS_APPS_PREMIUM.md](../design_e_ui/COMPARATIVO_ZIITV_VS_APPS_PREMIUM.md) — Análise de apps premium

---

**Última atualização:** 25/04/2026 14:15  
**Versão:** 1.0
