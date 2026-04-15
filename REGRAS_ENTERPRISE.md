# 📏 Regras Enterprise 2026 — ziiiTV (OBRIGATÓRIAS)

## 1. Plataforma / Compatibilidade

- Alvo primário: **Samsung Tizen 5.0 (2019, Chromium 63)**
- Compatibilidade mínima: **Tizen 4.0 (2018, Chromium 56)**
- Nenhum ajuste de stack pode quebrar Tizen 4.0+ sem decisão explícita
- `config.xml` é parte da stack: mudar aqui exige teste em TV real

## 2. Build / Bundler

- Bundler **fixo**: **Vite 4.5.x + Rollup clássico**
- **PROIBIDO** subir para Vite 5/8/Rolldown enquanto Tizen 4/5 for alvo
- Plugins permitidos:
  - `@vitejs/plugin-react` (React)
  - `@vitejs/plugin-legacy` (bundle moderno + legacy, polyfills Chrome 56+)
- **PROIBIDO** usar `vite-plugin-singlefile` neste projeto (já provou quebrar a TV)
- `build.target`: sempre `['es2015', 'chrome56']`
- Sem hacks manuais pós-build (tipo sed em bundle) sem motivo documentado

## 3. Players / Mídia

- Player principal: **Shaka Player** (HLS + DASH) configurado para TV
- Fallback obrigatório: **AVPlay** nativo para `.ts`/casos onde MSE/Shaka não suportar
- Decisão de backend centralizada numa função única (`selectPlayerBackend`)
- Sempre usar **feature detection**, nunca user-agent:
  - `shaka.Player.isBrowserSupported()` para decidir Shaka
  - fallback para AVPlay se não suportar

## 4. UI / Performance em TV

- Animações apenas em **`transform` e `opacity`**, sem `top/left` animado
- Navegação por **D-pad** centralizada em um manager (sem listeners espalhados)
- Nada de **scroll suave nativo** em listas grandes (breaka em TV); usar transform/virtualização
- Listas grandes: **virtualização obrigatória**
- Qualquer operação >10ms vai para:
  - Web Worker (parser)
  - ou `requestIdleCallback` (se feature-detect confirmar)

## 5. Processo de Mudança

Qualquer mudança em:
- `vite.config.ts`
- `config.xml`
- player (Shaka/AVPlay)
- Worker/IndexedDB

tem que passar pelo mesmo pipeline:

1. Rodar build local (`npm run build`)
2. Validar no navegador desktop
3. Gerar `.wgt` e instalar na TV
4. Marcar explicitamente o resultado:
   - ✅ OK na TV real
   - ❌ Falhou na TV (com descrição curta)

**Sem TV real, não se considera "resolvido".**

## 6. Documentação / Single Source of Truth

- A stack **oficial** é o que está em `STACK_ATUAL.md`
- README deve sempre refletir:
  - alvo de Tizen
  - versão de Vite
  - player principal e fallback
- **PROIBIDO** mudar stack via IDE/experimento sem atualizar `STACK_ATUAL.md`

## 7. O que é PROIBIDO neste projeto

- ❌ Subir para Vite 8/Rolldown
- ❌ Reintroduzir `vite-plugin-singlefile`
- ❌ Trocar React 18 por outro major sem motivo forte e documentado
- ❌ Introduzir libs pesadas de UI sem avaliar impacto em TV (ex.: UI kits de web comum)

---

**Essas regras existem para garantir que o ziiiTV se comporta como produto de empresa grande, não como experimento de dev local.**
