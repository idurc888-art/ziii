// Teste IndexedDB nativo (sem lib idb) para diagnosticar persistência

const DB_NAME = 'ziiiTV-native-test'
const DB_VERSION = 1
const STORE_NAME = 'test'

export async function testNativeIndexedDB(): Promise<string> {
  return new Promise((resolve, reject) => {
    console.log('[NativeTest] Abrindo IndexedDB nativo...')
    
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    
    request.onerror = () => {
      const msg = 'Erro ao abrir DB: ' + request.error
      console.error('[NativeTest]', msg)
      reject(msg)
    }
    
    request.onupgradeneeded = (event) => {
      console.log('[NativeTest] onupgradeneeded - criando store')
      const db = (event.target as IDBOpenDBRequest).result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME)
      }
    }
    
    request.onsuccess = () => {
      const db = request.result
      console.log('[NativeTest] DB aberto com sucesso')
      
      // 1. Tenta ler teste anterior
      const readTx = db.transaction(STORE_NAME, 'readonly')
      const readStore = readTx.objectStore(STORE_NAME)
      const readReq = readStore.get('persist_test')
      
      readReq.onsuccess = () => {
        const oldData = readReq.result
        
        if (oldData) {
          const diff = Date.now() - oldData.timestamp
          const msg = `✅ TESTE ANTERIOR ENCONTRADO! Salvo há ${Math.floor(diff / 1000)}s`
          console.log('[NativeTest]', msg)
          db.close()
          resolve(msg)
        } else {
          console.log('[NativeTest] Nenhum teste anterior')
          
          // 2. Salva novo teste
          const newData = { timestamp: Date.now(), test: 'ok' }
          const writeTx = db.transaction(STORE_NAME, 'readwrite')
          const writeStore = writeTx.objectStore(STORE_NAME)
          const writeReq = writeStore.put(newData, 'persist_test')
          
          writeReq.onsuccess = () => {
            console.log('[NativeTest] ✅ Novo teste salvo:', newData.timestamp)
            
            // 3. Verifica imediatamente
            const verifyTx = db.transaction(STORE_NAME, 'readonly')
            const verifyStore = verifyTx.objectStore(STORE_NAME)
            const verifyReq = verifyStore.get('persist_test')
            
            verifyReq.onsuccess = () => {
              const verified = verifyReq.result
              if (verified && verified.timestamp === newData.timestamp) {
                const msg = '✅ Verificação imediata OK. Feche e reabra o app para testar persistência.'
                console.log('[NativeTest]', msg)
                db.close()
                resolve(msg)
              } else {
                const msg = '❌ Verificação imediata FALHOU!'
                console.error('[NativeTest]', msg)
                db.close()
                reject(msg)
              }
            }
            
            verifyReq.onerror = () => {
              const msg = '❌ Erro ao verificar: ' + verifyReq.error
              console.error('[NativeTest]', msg)
              db.close()
              reject(msg)
            }
          }
          
          writeReq.onerror = () => {
            const msg = '❌ Erro ao salvar: ' + writeReq.error
            console.error('[NativeTest]', msg)
            db.close()
            reject(msg)
          }
        }
      }
      
      readReq.onerror = () => {
        const msg = '❌ Erro ao ler: ' + readReq.error
        console.error('[NativeTest]', msg)
        db.close()
        reject(msg)
      }
    }
  })
}
