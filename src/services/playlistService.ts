import { openDB } from 'idb'
import type { Channel } from '../types/channel'

const DB_NAME = 'ziiiTV-db'
const DB_VERSION = 1
const STORE = 'playlist'

const db = openDB(DB_NAME, DB_VERSION, {
  upgrade(db) {
    db.createObjectStore(STORE)
  },
})

export async function loadPlaylist(url: string): Promise<Record<string, Channel[]>> {
  const cached = await (await db).get(STORE, url)
  if (cached) return cached

  return new Promise((resolve, reject) => {
    const worker = new Worker(
      new URL('../workers/playlistWorker.ts', import.meta.url),
      { type: 'module' }
    )

    worker.onmessage = async (e) => {
      worker.terminate()
      if (e.data.type === 'SUCCESS') {
        await (await db).put(STORE, e.data.groups, url)
        resolve(e.data.groups)
      } else {
        reject(new Error(e.data.message))
      }
    }

    worker.onerror = (e) => {
      worker.terminate()
      reject(new Error(e.message))
    }

    worker.postMessage({ type: 'LOAD', url })
  })
}

export async function clearPlaylistCache(): Promise<void> {
  await (await db).clear(STORE)
}
