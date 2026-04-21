# 🔧 FALLBACK: Worker não funciona no Tizen 4.0

## Problema identificado
- App abre mas não carrega canais
- Worker provavelmente não suportado (Tizen 4.0 = Chromium 56)
- `type: 'module'` não funciona em Workers antigos

## Solução: Fallback para thread principal

### Opção 1: Detectar suporte e fazer fallback automático
```ts
// catalogMatcher.ts
async loadAndMatch(url: string) {
  // Tenta Worker primeiro
  if (typeof Worker !== 'undefined') {
    try {
      return await this.loadWithWorker(url)
    } catch (err) {
      console.warn('[CatalogMatcher] Worker failed, fallback to main thread')
      return await this.loadInMainThread(url)
    }
  }
  // Fallback direto se Worker não existe
  return await this.loadInMainThread(url)
}
```

### Opção 2: Desabilitar Worker completamente (mais rápido para testar)
```ts
// catalogMatcher.ts - linha 30
// Comentar instanciação do Worker e chamar função direta
const result = await this.loadInMainThread(url)
```

## Próximo passo
Aguardando logs da TV para confirmar o erro exato.
