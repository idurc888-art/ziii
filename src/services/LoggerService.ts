/**
 * LoggerService — Black Box Enterprise Logger para ziiiTV
 * 
 * Formato: [CATEGORIA] [TIMESTAMP_MS] [AÇÃO] [RESULTADO]
 * Fila circular de 200 entradas (sem crescimento infinito).
 * 
 * Categorias:
 *   HW  — Hardware AVPlay (estados, setDisplayRect, errors)
 *   MEM — Memória estimada (Surface Cache, rows mount/unmount)
 *   NAV — Navegação D-pad (focusZone, row, col)
 *   BOOT — Ciclo de inicialização (TTI, loadPlaylist, etc)
 */

interface LogEntry {
  ts: number      // performance.now() em ms
  cat: string     // HW | MEM | NAV | BOOT
  action: string
  detail: string
}

const MAX_ENTRIES = 200
const VRAM_PER_1080P_IMAGE_MB = 8.29

class LoggerServiceClass {
  private entries: LogEntry[] = []
  private bootStart = typeof performance !== 'undefined' ? performance.now() : 0

  private push(cat: string, action: string, detail: string): void {
    const ts = typeof performance !== 'undefined' ? performance.now() : Date.now()
    const entry: LogEntry = { ts, cat, action, detail }

    if (this.entries.length >= MAX_ENTRIES) {
      this.entries.shift() // Fila circular
    }
    this.entries.push(entry)

    // Também envia para o console (que o DebugOverlay intercepta)
    const formatted = `[${cat}] ${ts.toFixed(1)}ms ${action} ${detail}`
    if (cat === 'HW' && detail.includes('ERROR')) {
      console.error(formatted)
    } else if (cat === 'MEM') {
      console.warn(formatted)
    } else {
      console.log(formatted)
    }
  }

  /** Log de Hardware AVPlay */
  hw(action: string, detail: string = ''): void {
    this.push('HW', action, detail)
  }

  /** Log de Memória estimada */
  mem(action: string, detail: string = ''): void {
    this.push('MEM', action, detail)
  }

  /** Log de Navegação */
  nav(action: string, detail: string = ''): void {
    this.push('NAV', action, detail)
  }

  /** Log de Boot */
  boot(action: string, detail: string = ''): void {
    this.push('BOOT', action, detail)
  }

  /** Calcula memória estimada de VRAM para N imagens 1080p */
  estimateVRAM(imageCount: number): string {
    const mb = imageCount * VRAM_PER_1080P_IMAGE_MB
    return `~${mb.toFixed(1)}MB VRAM (${imageCount} imgs)`
  }

  /** Retorna o TTI (Time to Interactive) desde o boot */
  getTTI(): number {
    return typeof performance !== 'undefined' ? performance.now() - this.bootStart : 0
  }

  /** Retorna todas as entradas (para debug externo) */
  getAll(): LogEntry[] {
    return [...this.entries]
  }

  /** Limpa o buffer */
  clear(): void {
    this.entries = []
  }
}

export const Logger = new LoggerServiceClass()
