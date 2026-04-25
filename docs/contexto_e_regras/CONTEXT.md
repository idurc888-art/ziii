# ziiiTV — Contexto do Projeto

## Identidade
- App ID: 2TDndgJZyN.ziiiTV
- Target: Samsung Tizen 5.0+ (TV UN50RU7100GXZD, 2019)
- Compatibilidade mínima: Tizen 4.0 (2018)
- Resolução: 1920×1080 (fixed, não responsivo)
- Padrão de qualidade: no mínimo igual a Netflix/Amazon Prime na TV

---

## Stack — TRAVADA, não discutir mais

| Camada | Tecnologia | Motivo |
|---|---|---|
| Framework | React 18 + Vite 5 + TypeScript | Suporte Tizen, build leve, tipagem segura |
| Player | Shaka Player 4.x (primário) + Samsung AVPlay (fallback) | HLS+DASH+DRM, usado por YouTube/Disney+ |
| Estado global | Zustand | Leve ~1kb, sem boilerplate |
| Estilo | CSS Modules | Isolamento por componente, sem conflito |
| Parser M3U | @iptv/playlist (rodando em Web Worker) | Mais rápido benchmarkado, não bloqueia UI |
| Navegação | keydown no document, throttle 200ms via Date.now() | Único padrão confiável no Tizen |

---

## Arquitetura em Camadas — ordem de construção

### Camada 1 — Playlist Engine (CONCLUÍDA)
- Web Worker faz fetch + parse da M3U
- Resultado: `{ groups: Record<string, Channel[]> }` entregue via postMessage
- Persistência: URL salva em localStorage, canais cacheados em IndexedDB
- Nunca recarrega a lista se já está em cache (só se usuário forçar)
- **Normalização:** `categoryMapper.ts` transforma grupos crus em 8 categorias fixas da UI
- **Pipeline de 3 níveis:** Parse bruto → Normalização → Consumo da UI
- A UI nunca lê `group-title` original da M3U diretamente

### Camada 2 — Player
- Shaka Player inicializado uma única vez (singleton)
- Fallback automático para AVPlay se MSE não disponível
- Buffer: 30s ahead, 10s behind
- ABR automático, começa em 5Mbps

### Camada 3 — Interface Visual
- Virtualização obrigatória: só os cards visíveis estão no DOM
- Card focado SEMPRE fixo na posição visual (conveyor belt)
- Listener de teclado registrado UMA VEZ com useEffect(fn, [])
- Todos os valores mutáveis acessados via useRef (nunca stale closure)
- Transições CSS only (sem JavaScript animando)
- Zero scroll nativo — tudo controlado por translateX/translateY

---

## Regras de Código — OBRIGATÓRIAS

1. **Listener de teclado**: sempre `document.addEventListener`, registrado
   uma única vez em `useEffect(fn, [])`, valores via `useRef`
2. **Throttle**: `Date.now()` — nunca `e.repeat` (não funciona no Tizen)
3. **Animações**: CSS `transition` e `transform` apenas — GPU compositor
4. **DOM mínimo**: virtualização em toda lista com mais de 20 itens
5. **Sem localStorage para estado de sessão**: só para URL e preferências
6. **Cache de canais**: IndexedDB via `idb` lib (não localStorage — limite 5MB)
7. **Web Worker**: todo parse pesado fora da main thread
8. **Imagens**: `loading="lazy"` + fallback para inicial do canal
9. **scrollIntoView**: sempre `behavior: 'instant'` — smooth trava no Tizen
10. **Sem Tailwind, sem styled-components**: CSS Modules puro

---

## Fluxo do Usuário

1. Primeira abertura → Tela de configuração (digita URL da lista M3U)
2. Worker faz fetch + parse → salva em IndexedDB
3. Home → categorias na vertical, canais na horizontal (conveyor belt)
4. Seleciona canal → Player inicia imediatamente
5. Próximas aberturas → carrega do IndexedDB (instantâneo)
6. Usuário pode forçar reload da lista nas configurações

---

## Estado do Projeto

- [x] Camada 1: Playlist Engine (Web Worker + IndexedDB + Normalização) — CONCLUÍDA
- [x] Camada 1.5: Pipeline de normalização (categoryMapper.ts) — CONCLUÍDA
- [/] Camada 2: Player (Shaka + AVPlay fallback) — EM ANDAMENTO
- [ ] Camada 3: Interface Visual

---

## Decisões Tomadas e Por Quê

- **Web Worker para parse**: M3U com 10k+ canais bloqueia UI por 2-5s no main thread
- **IndexedDB**: localStorage tem limite de 5MB — uma lista grande estoura
- **Virtualização**: 10k cards no DOM = crash garantido em TVs entry-level
- **AVPlay fallback**: garante funcionamento em Tizen < 4.0 sem MSE
- **Throttle 200ms**: Tizen repete keydown a ~30ms — sem throttle pula 6+ itens
- **Build target es2015 + chrome56**: Tizen 4.0 usa Chromium 56 — não suporta ES modules nem `type="module"`
- **Plugin tizen-compat no vite.config.ts**: Vite 8/Rolldown não permite desabilitar `type="module"` via config — plugin `closeBundle` remove o atributo do `dist/index.html` após o build
- **`type="module"` causa loader infinito na TV**: script não carrega silenciosamente, app fica preso no splash
  - `.m3u8` / `.mpd` → Shaka Player
  - `.ts` / desconhecido → AVPlay (nativo Samsung)
  - Função `selectPlayerBackend(url)` em `playerService.ts` centraliza essa decisão
- **Erro 7000 do Shaka**: streams da M3U com URL direta (`.ts`, sem manifesto HLS/DASH) falham no Shaka — não invalida a arquitetura, confirma que AVPlay é necessário para esses casos na TV
- **detectStreamType()**: helper para identificar `.m3u8` (HLS), `.mpd` (DASH) ou `unknown` antes de tentar carregar
- **focus() com delay 50ms**: ao montar SettingsScreen, o foco no input deve ser adiado para não capturar a tecla que abriu a tela (ex: M/Menu)
- **document.body.focus() ao voltar**: ao desmontar SettingsScreen/PlayerScreen, devolver foco ao body garante que o listener global da HomeScreen continue recebendo eventos de teclado
- **src/types/channel.ts**: tipo Channel centralizado — não duplicar em data/ e store/

---

## Dispositivos

- **TV:** Samsung UN50RU7100GXZD — IP `10.0.0.100` — porta SDB `26101`
- **PC dev:** IP `10.0.0.102`
- **Certificado Tizen:** `IptvFinal`
- **Chromium da TV:** versão 69 (Tizen 5.0)

---

## Roadmap

### FASE 1 — Estrutura e Navegação (sem visual)
- [x] Passo 1 — Scaffold React + Vite + TypeScript
- [x] Passo 2 — CONTEXT.md criado na raiz
- [x] Passo 3 — src/data/mockChannels.ts — 20 canais, 3 grupos
- [x] Passo 4 — src/store/channelsStore.ts — Zustand com loadMock
- [x] Passo 5 — src/App.tsx — controle de telas + listener Back
- [x] Passo 6 — HomeScreen.tsx esqueleto: grupos + canais em divs simples, navegação D-pad funcional com throttle, ENTER loga canal no console
- [x] Passo 7 — Conectar HomeScreen no App.tsx: renderiza HomeScreen quando screen === 'home', ao pressionar ENTER muda para screen === 'player' passando o canal
- [x] Passo 8 — PlayerScreen.tsx esqueleto: recebe o canal, mostra nome + URL na tela, botão Back volta para home
- [x] Passo 9 — SettingsScreen.tsx esqueleto: campo de texto para URL da lista, botão salvar (só loga por enquanto)
- [x] Passo 10 — Navegação completa testada no browser: home → player → back → home → settings → back

### FASE 2 — Playlist Engine real — CONCLUÍDA
- [x] Passo 11 — Instalar @iptv/playlist e idb
- [x] Passo 12 — Criar src/workers/playlistWorker.ts: recebe URL via postMessage, faz fetch, parseia M3U, retorna groups via postMessage
- [x] Passo 13 — Criar src/services/playlistService.ts: gerencia o Worker, salva resultado no IndexedDB, carrega do cache se já existe
- [x] Passo 14 — Adicionar loadFromUrl(url: string) no store Zustand + inicialização automática no App.tsx (localStorage → IndexedDB → mock fallback)
- [x] Passo 15 — Conectar SettingsScreen com loadFromUrl: salva URL no localStorage, dispara o Worker, feedback de status na tela
- [x] Passo 16 — Testado com URL M3U real: lista carrega, grupos aparecem, cache IndexedDB funciona (F5 instantâneo)
- [ ] Passo 14 — Adicionar loadFromUrl(url: string) no store Zustand, substituindo loadMock
- [ ] Passo 15 — Conectar SettingsScreen com loadFromUrl: salva URL no localStorage, dispara o Worker
- [ ] Passo 16 — Testar com URL M3U real: lista carrega, grupos aparecem, cache funciona

### FASE 3 — Player — ATUAL
- [x] Passo 17 — Instalar Shaka Player
- [x] Passo 18 — Criar src/services/playerService.ts: singleton Shaka, configuração de buffer otimizada para TV
- [x] Passo 19 — Detectar suporte a MSE + seleção automática de backend (selectPlayerBackend) + stub AVPlay tipado em src/services/avplayService.ts
- [ATUAL] Passo 20 — PlayerScreen real: <video> element, Shaka carrega HLS/DASH, AVPlay carrega .ts — testado no browser, AVPlay real pendente de validação na TV
- [ ] Passo 21 — Controles do player via D-pad: PLAY/PAUSE, FF, RW, STOP, volume
- [ ] Passo 22 — Testar player com canal real na TV

### FASE 4 — Interface Visual
- [ ] Passo 23 — Design tokens no CSS: cores, tipografia, espaçamentos para 1920×1080
- [ ] Passo 24 — HomeScreen visual: conveyor belt (lista desliza, card focado fixo), row title, contador
- [ ] Passo 25 — Card component: logo do canal, nome, estado focado com borda pink, animação scale
- [ ] Passo 26 — Virtualização: só renderiza cards visíveis na janela (±3 do focado)
- [ ] Passo 27 — PlayerScreen visual: fullscreen, overlay com nome do canal, barra de controles
- [ ] Passo 28 — SettingsScreen visual: teclado virtual D-pad para digitar URL na TV
- [ ] Passo 29 — Splash screen / loading state enquanto lista carrega

### FASE 5 — Tizen e Deploy
- [ ] Passo 30 — config.xml correto para Tizen 5.0
- [ ] Passo 31 — vite.config.ts ajustado para build Tizen (base: './', sem hash nos assets)
- [ ] Passo 32 — Script de build + empacotamento .wgt automático
- [ ] Passo 33 — Instalar na TV e testar tudo do zero
- [ ] Passo 34 — Ajustes finais de performance na TV real
