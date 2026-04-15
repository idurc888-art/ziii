# Contexto Completo — ziiiTV (15/04/2026 10:33)

## OBJETIVO FINAL
App IPTV production-ready para Samsung Tizen 5.0 TV que:
- Carrega playlists M3U (fetch + parse)
- Exibe canais em layout Netflix-like
- Reproduz streams HLS/DASH/TS
- Navega com D-pad (4 zonas)

---

## STATUS ATUAL

### ✅ FASE 1 COMPLETA
**Stack validada na TV real (UN50RU7100GXZD)**

#### O que funciona:
1. **React 18** monta e renderiza
2. **Playlist engine** carrega e parseia M3U (10-30s primeira vez)
3. **Cache persiste** entre sessões (IndexedDB nativo)
4. **DebugOverlay** mostra logs em tempo real (F1 toggle, F2 clear)
5. **Navegação D-pad** (Enter, Back, setas)
6. **Arquitetura enterprise** implementada:
   - Singleton DB (uma instância por sessão)
   - Idempotência (URL já carregada retorna da memória)
   - Feature flags (DEBUG para diagnósticos)
   - Estados explícitos (idle/cache_check/ready/error)
   - Logs limpos (apenas essenciais em produção)

#### Decisões técnicas críticas:
- **Vite 4.5.14** (Vite 8 Rolldown incompatível com Chromium 63)
- **@vitejs/plugin-legacy** (polyfills para Chrome 56+)
- **IndexedDB nativo singleton** (lib `idb` removida - causava problemas)
- **Web Worker fallback** (type: 'module' não suportado)
- **Sem vite-plugin-singlefile** (conflito com plugin-legacy)

---

## ARQUITETURA ENTERPRISE

### 1. Singleton Pattern
**Uma instância de DB por sessão**

```typescript
// src/services/dbClient.ts
let dbInstance: IDBDatabase | null = null
let dbPromise: Promise<IDBDatabase> | null = null

function openDB(): Promise<IDBDatabase> {
  if (dbInstance) return Promise.resolve(dbInstance)
  if (dbPromise) return dbPromise
  // abre apenas uma vez
}
```

### 2. Idempotência
**Mesma URL = mesma resposta, sem reprocessamento**

```typescript
// src/services/playlistService.ts
const loadedUrls = new Map<string, Record<string, Channel[]>>()
const activeLoads = new Map<string, Promise<...>>()

export async function loadPlaylist(url: string) {
  // 1. Já carregada? Retorna da memória
  if (loadedUrls.has(url)) return loadedUrls.get(url)!
  
  // 2. Load em andamento? Reutiliza promise
  if (activeLoads.has(url)) return activeLoads.get(url)!
  
  // 3. Carrega apenas se necessário
}
```

### 3. Feature Flags
**Debug separado de produção**

```typescript
// src/App.tsx e src/services/playlistService.ts
const DEBUG = false

if (DEBUG) {
  // Logs detalhados e testes nativos
}
```

### 4. Estados Explícitos
**Fluxo previsível**

```typescript
// src/store/channelsStore.ts
type LoadStatus = 
  | 'idle'        // inicial
  | 'cache_check' // verificando cache
  | 'ready'       // dados disponíveis
  | 'error'       // falha
```

---

## PIPELINE DE CARREGAMENTO

### Cache Hit (2ª execução)
```
User: Enter
  ↓
[Store] Verifica se URL já carregada → SIM
  ↓
[Store] URL já carregada (retorna da memória)
  ↓
UI atualiza instantaneamente
```

### Cache Miss (1ª execução)
```
User: Enter
  ↓
[Store] status = 'cache_check'
  ↓
[Playlist] Cache check
  ↓
[Playlist] Cache miss
  ↓
[Playlist] Fetch + Parse (10-30s)
  ↓
[Playlist] Salva no IndexedDB
  ↓
[Playlist] Ready
  ↓
[Store] status = 'ready'
```

### Logs em Produção (DEBUG = false)
```
[Playlist] Cache check
[Playlist] Cache hit
```

### Logs em Debug (DEBUG = true)
```
[Playlist #1] Fetch iniciado
[Playlist #1] Parse completo: 115 grupos
[Playlist #1] Salvando cache
✅ TESTE ANTERIOR ENCONTRADO! (salvo há 3600s)
```

---

## STACK TÉCNICA

### Dependências Principais
```json
{
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "zustand": "^5.0.2",
  "@iptv/playlist": "^4.2.0",
  "shaka-player": "^5.1.2"
}
```

### DevDependencies
```json
{
  "vite": "^4.5.14",
  "@vitejs/plugin-react": "^4.3.4",
  "@vitejs/plugin-legacy": "^5.4.4",
  "typescript": "^5.6.2",
  "terser": "^5.36.0",
  "regenerator-runtime": "^0.14.1"
}
```

### vite.config.ts
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import legacy from '@vitejs/plugin-legacy'

export default defineConfig({
  plugins: [
    react(),
    legacy({
      targets: ['chrome >= 56'],
      additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
    }),
  ],
  base: './',
  build: {
    target: ['es2015', 'chrome56'],
    cssCodeSplit: false,
    minify: 'terser',
    terserOptions: {
      compress: { ecma: 2015 },
      output: { ecma: 2015 },
    },
  },
})
```

---

## ESTRUTURA DE ARQUIVOS

```
ziiiTV/
├── public/
│   ├── config.xml          # Manifest Tizen (CSP permissivo)
│   └── icon.png
├── src/
│   ├── components/
│   │   └── DebugOverlay.tsx    # Logs on-screen (F1/F2)
│   ├── services/
│   │   ├── dbClient.ts         # Singleton IndexedDB
│   │   ├── playlistService.ts  # Idempotência + cache
│   │   └── storageTest.ts      # Diagnóstico (DEBUG only)
│   ├── store/
│   │   └── channelsStore.ts    # Estados explícitos
│   ├── types/
│   │   └── channel.ts
│   ├── App.tsx                 # Feature flag DEBUG
│   └── main.tsx
├── ARQUITETURA.md          # Este arquivo
├── README.md               # Contexto do projeto
├── ROADMAP.md              # Planejamento de fases
├── REGRAS_ENTERPRISE.md    # Regras obrigatórias
├── STACK_ATUAL.md          # Stack técnica detalhada
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

## TV ALVO

### Hardware
- **Modelo:** UN50RU7100GXZD
- **Tizen:** 5.0
- **Chromium:** 63
- **IP:** 10.0.0.100:26101
- **Certificado:** IptvFinal

### Limitações
- Chromium 63 (ES2015 apenas)
- Web Worker type: 'module' não suportado
- IndexedDB quota limitada (funciona, mas sem garantia de tamanho)
- Sem Web Inspector remoto confiável (por isso DebugOverlay)

---

## DEPLOY

### Pipeline Completo
```bash
cd /home/carneiro888/ziiiTV

# 1. Build
npm run build

# 2. Package
cd dist
rm -f ziiiTV.wgt
~/tizen-studio/tools/ide/bin/tizen package -t wgt -s IptvFinal -o . -- .

# 3. Install
~/tizen-studio/tools/ide/bin/tizen install -n ziiiTV.wgt -t UN50RU7100GXZD
```

### Script Automatizado
```bash
# deploy.sh (se existir)
npm run build && \
cd dist && \
rm -f ziiiTV.wgt && \
tizen package -t wgt -s IptvFinal && \
tizen install -n ziiiTV.wgt -t UN50RU7100GXZD
```

---

## PRÓXIMOS PASSOS

### 🎯 Fase 2: Player (PRÓXIMA)
1. Integrar Shaka Player 5.1.2
2. Testar HLS playback na TV
3. Implementar AVPlay fallback para .ts
4. Controles D-pad (play/pause/stop)
5. Aplicar arquitetura enterprise (singleton player)

### 📐 Fase 3: Layout Telvix
1. Sidebar 70px (ícones verticais)
2. Topbar horizontal (links grandes)
3. Hero banner (carrossel com backdrop)
4. Carrosséis horizontais (categorias)
5. Sistema de navegação 4 zonas

**Referência:** `/home/carneiro888/Documentos/zikualdo/Telvix/LEGACY_SVELTE_TELVIX/`

---

## GARANTIAS ATUAIS

✅ Uma instância de DB por sessão  
✅ Uma execução por URL  
✅ Zero reprocessamento de dados já carregados  
✅ Logs limpos em produção  
✅ Diagnósticos completos em debug  
✅ Cache persistente entre sessões  
✅ Navegação D-pad funcional  
✅ DebugOverlay para debugging na TV  

---

## TESTE M3U URL (Hardcoded)
```
http://cdc55.cc/get.php?username=0357028521&password=82740&type=m3u_plus&output=ts
```

---

## COMANDOS ÚTEIS

### Desenvolvimento
```bash
npm run dev          # Dev server (não funciona na TV)
npm run build        # Build produção
npm run preview      # Preview build local
```

### Tizen
```bash
tizen list devices                    # Lista TVs conectadas
tizen package -t wgt -s IptvFinal     # Empacota .wgt
tizen install -n ziiiTV.wgt -t <TV>   # Instala na TV
tizen uninstall -p <package-id> -t <TV>  # Desinstala
```

### Debug
```bash
# Na TV, pressione:
F1 - Toggle DebugOverlay
F2 - Clear logs
Enter - Carregar playlist
Back - Fechar app
```

---

## REGRAS OBRIGATÓRIAS

1. **Vite 4.5.x LOCKED** - não atualizar para Vite 5/8
2. **Test on real TV required** - nenhuma mudança é "done" sem validar na TV
3. **IndexedDB native only** - não adicionar libs de storage
4. **DebugOverlay mandatory** - logs on-screen para debugging
5. **REGRAS_ENTERPRISE.md is MANDATORY** - seguir regras enterprise
6. **Incremental validation** - validar cada camada antes de avançar

---

## REFERÊNCIAS

- **ARQUITETURA.md** - Arquitetura enterprise detalhada
- **README.md** - Contexto e status do projeto
- **ROADMAP.md** - Planejamento de fases
- **REGRAS_ENTERPRISE.md** - Regras obrigatórias
- **STACK_ATUAL.md** - Stack técnica completa
- **Legacy Telvix** - `/home/carneiro888/Documentos/zikualdo/Telvix/LEGACY_SVELTE_TELVIX/`

---

**Última atualização:** 15/04/2026 10:33  
**Status:** Fase 1 completa, Fase 2 (Player) é próxima
