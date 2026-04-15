# Arquitetura Enterprise — ziiiTV

## Princípios

### 1. Singleton Pattern
**Uma instância de DB por sessão do app**

```typescript
// src/services/dbClient.ts
let dbInstance: IDBDatabase | null = null
let dbPromise: Promise<IDBDatabase> | null = null

function openDB(): Promise<IDBDatabase> {
  if (dbInstance) return Promise.resolve(dbInstance)
  if (dbPromise) return dbPromise
  // ... abre apenas uma vez
}
```

**Benefícios:**
- Zero reabertura de conexão
- Performance otimizada
- Previsibilidade total

### 2. Idempotência
**Mesma URL = mesma resposta, sem reprocessamento**

```typescript
// src/services/playlistService.ts
const loadedUrls = new Map<string, Record<string, Channel[]>>()
const activeLoads = new Map<string, Promise<Record<string, Channel[]>>>()

export async function loadPlaylist(url: string) {
  // 1. Já carregada? Retorna da memória
  if (loadedUrls.has(url)) {
    return loadedUrls.get(url)!
  }
  
  // 2. Load em andamento? Reutiliza promise
  if (activeLoads.has(url)) {
    return activeLoads.get(url)!
  }
  
  // 3. Carrega apenas se necessário
  // ...
}
```

**Benefícios:**
- Sem fetch duplicado
- Sem parse duplicado
- UX instantânea em recargas

### 3. Feature Flags
**Debug separado de produção**

```typescript
// src/App.tsx
const DEBUG = false

useEffect(() => {
  if (DEBUG) {
    // Testes nativos só em modo debug
    import('./services/storageTest').then(...)
  }
}, [])
```

```typescript
// src/services/playlistService.ts
const DEBUG = false

if (DEBUG) console.log('[Playlist] Detalhes técnicos...')
```

**Benefícios:**
- Logs limpos em produção
- Diagnósticos completos em debug
- Código profissional

### 4. Estados Explícitos
**Fluxo previsível e rastreável**

```typescript
// src/store/channelsStore.ts
type LoadStatus = 
  | 'idle'        // inicial
  | 'cache_check' // verificando cache
  | 'ready'       // dados disponíveis
  | 'error'       // falha

// Transições válidas:
// idle → cache_check → ready
// idle → cache_check → error
// ready → cache_check (reload)
```

**Benefícios:**
- UI sempre sincronizada
- Debugging facilitado
- Sem estados ambíguos

## Pipeline de Carregamento

### Fluxo Normal (Cache Hit)
```
User: Enter
  ↓
[Store] Verifica se URL já carregada → SIM
  ↓
[Store] URL já carregada (retorna)
```

### Fluxo Normal (Cache Miss)
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

### Fluxo Otimizado (2ª execução)
```
User: Enter
  ↓
[Store] Verifica se URL já carregada → SIM
  ↓
[Store] URL já carregada (retorna da memória)
  ↓
UI atualiza instantaneamente
```

## Logs em Produção

**Apenas 4 mensagens essenciais:**

```
[Playlist] Cache check
[Playlist] Cache hit
```

OU

```
[Playlist] Cache check
[Playlist] Cache miss
[Playlist] Ready
```

**Se apertar Enter novamente:**
```
[Store] URL já carregada
```

## Logs em Debug (DEBUG = true)

```
[Playlist #1] Fetch iniciado
[Playlist #1] Parse completo: 115 grupos
[Playlist #1] Salvando cache
✅ TESTE ANTERIOR ENCONTRADO! (salvo há 3600s)
```

## Estrutura de Arquivos

```
src/
├── services/
│   ├── dbClient.ts          # Singleton IndexedDB
│   ├── playlistService.ts   # Idempotência + cache
│   └── storageTest.ts       # Diagnóstico (DEBUG only)
├── store/
│   └── channelsStore.ts     # Estados explícitos
├── components/
│   └── DebugOverlay.tsx     # Logs on-screen
└── App.tsx                  # Feature flag DEBUG
```

## Garantias

✅ **Uma instância de DB** por sessão  
✅ **Uma execução** por URL  
✅ **Zero reprocessamento** de dados já carregados  
✅ **Logs limpos** em produção  
✅ **Diagnósticos completos** em debug  
✅ **Cache persistente** entre sessões  

## Validação na TV

**Teste 1: Cache funciona?**
1. Abrir app
2. Apertar Enter (carrega playlist)
3. Fechar app
4. Abrir app novamente
5. Apertar Enter
6. **Esperado:** `[Playlist] Cache hit` instantâneo

**Teste 2: Idempotência funciona?**
1. Abrir app
2. Apertar Enter (carrega playlist)
3. Apertar Enter novamente
4. **Esperado:** `[Store] URL já carregada`

**Teste 3: Singleton funciona?**
1. Ativar `DEBUG = true`
2. Build + deploy
3. Abrir app
4. **Esperado:** Apenas 1 log de "Abrindo IndexedDB"

## Camada 2 — Player (Arquitetura Híbrida)

### 1. Padrão Híbrido (Shaka + AVPlay)
- Erro 7000 do Shaka com streams `.ts` diretos exige isolamento da lógica de play.
- A função `selectPlayerBackend(url)` contida em `playerService.ts` garante abstração. A UI só pede `play(url)`.

### 2. Singleton Obrigatório
- O Player (seja Shaka ou o contexto do AVPlay) será inicializado **uma única vez**.
- Em cada troca de canal: fazemos `player.load(NOVA_URL)`, não destruir/recriar instância (Evita memory leak severo no Tizen).

### 3. Máquina de Estados do Player
Semelhante à máquina da Playlist, essencial para lidar com zapping metralhado sem travar a engine:
- `idle` → `loading` → `buffering` → `playing` → `error` → `idle`
*Nota:* `buffering` é vital porque o Tizen possui estados intermediários demorados.

### 4. Buffer Tuning (Safety Margins)
Configurações fixas para contornar instabilidade de rede em SmartTVs:
- `bufferingGoal`: 30 (segundos acumulados antes de inciar)
- `rebufferingGoal`: 5 (segundos mínimos retidos para retomar via stall)
- `bufferBehind`: 10 (segundos para trás em memória)
- `defaultBandwidthEstimate`: 5e6 (5 Mbps - começa em qualidade alta e desce em redes fracas).

### 5. Navegação no Controle (Zero Stale Closures)
Regra sagrada para `keydown` do controle remoto Tizen: **1 único listener global com referência dinâmica.**
```typescript
const currentChannelRef = useRef(currentChannel)
useEffect(() => { currentChannelRef.current = currentChannel }, [currentChannel])

useEffect(() => {
  const handler = (e) => {
    // sempre lê da Ref, nunca via closure velha
    if (e.keyCode === 13) playChannel(currentChannelRef.current)
  }
  window.addEventListener('keydown', handler)
  return () => window.removeEventListener('keydown', handler)
}, [])
```
