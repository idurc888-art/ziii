export async function fetchM3U(url: string): Promise<string> {
  console.log('[ziiiTV] Fetching M3U:', url)

  // Tenta direto primeiro
  try {
    const res = await fetch(url)
    if (res.ok) {
      console.log('[ziiiTV] Direct fetch OK')
      return res.text()
    }
  } catch (e) {
    console.log('[ziiiTV] Direct failed, trying proxy')
  }

  // Fallback proxy
  const proxy = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`
  const res = await fetch(proxy)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  console.log('[ziiiTV] Proxy fetch OK')
  return res.text()
}
