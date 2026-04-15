import { useEffect, useRef, useState } from 'react'
import { useChannelsStore } from '../../store/channelsStore'

const URL_KEY = 'ziiiTV-m3u-url'

interface Props {
  onBack: () => void
}

export default function SettingsScreen({ onBack }: Props) {
  const [url, setUrl] = useState(() => localStorage.getItem(URL_KEY) ?? '')
  const loadFromUrl = useChannelsStore(s => s.loadFromUrl)
  const status = useChannelsStore(s => s.status)
  const error = useChannelsStore(s => s.error)

  const urlRef = useRef(url)
  const onBackRef = useRef(onBack)
  const statusRef = useRef(status)
  urlRef.current = url
  onBackRef.current = onBack
  statusRef.current = status

  const inputRef = useRef<HTMLInputElement>(null)
  const lastKey = useRef(0)

  // foca o input 50ms após montar — evita capturar a tecla que abriu a tela
  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 50)
    return () => clearTimeout(t)
  }, [])

  const handleSave = () => {
    const u = urlRef.current.trim()
    if (!u) return
    localStorage.setItem(URL_KEY, u)
    loadFromUrl(u)
  }

  useEffect(() => {
    if (status === 'ready') {
      const t = setTimeout(() => onBackRef.current(), 1000)
      return () => clearTimeout(t)
    }
  }, [status])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const now = Date.now()
      if (now - lastKey.current < 200) return
      lastKey.current = now

      const fromInput = (e.target as HTMLElement).tagName === 'INPUT'
      const isLoading = statusRef.current !== 'idle' && statusRef.current !== 'ready' && statusRef.current !== 'error'

      if (!fromInput && (e.keyCode === 10009 || e.keyCode === 8)) {
        if (!isLoading) onBackRef.current()
      } else if (e.keyCode === 13) {
        handleSave()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  const isLoading = status !== 'idle' && status !== 'ready' && status !== 'error'

  return (
    <div>
      <input
        ref={inputRef}
        type="text"
        value={url}
        onChange={e => setUrl(e.target.value)}
        placeholder="URL da lista M3U"
      />
      <button onClick={handleSave} disabled={isLoading}>Salvar</button>
      {isLoading && <div>Carregando lista...</div>}
      {status === 'ready' && <div>Lista carregada com sucesso!</div>}
      {status === 'error' && <div style={{ color: 'red' }}>{error}</div>}
    </div>
  )
}
