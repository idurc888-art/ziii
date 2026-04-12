import React, { useState, useRef, useEffect } from 'react'
import { useChannelsStore } from '../../store/channelsStore'
import { fetchM3U } from '../../services/m3u.service'
import styles from './SettingsScreen.module.css'

interface Props { onDone: () => void }

const SettingsScreen: React.FC<Props> = ({ onDone }) => {
  const [user, setUser] = useState(localStorage.getItem('user') || '0357028521')
  const [pass, setPass] = useState(localStorage.getItem('pass') || '82740')
  const [focusIdx, setFocusIdx] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const userRef = useRef<HTMLInputElement>(null)
  const passRef = useRef<HTMLInputElement>(null)
  const btnRef = useRef<HTMLButtonElement>(null)
  const setM3uUrl = useChannelsStore(s => s.setM3uUrl)
  const parseM3U = useChannelsStore(s => s.parseM3U)

  useEffect(() => {
    const refs = [userRef, passRef, btnRef]
    refs[focusIdx].current && refs[focusIdx].current.focus()
  }, [focusIdx])

  async function handleLogin() {
    if (!user || !pass) { setError('Preencha usuário e senha'); return }
    setLoading(true); setError('')
    const url = `http://10.0.0.102:3000?url=${encodeURIComponent(`http://cdc55.cc/get.php?username=${user}&password=${pass}&type=m3u_plus&output=ts`)}`
    console.log('[ziiiTV] Login:', user)
    try {
      const raw = await fetchM3U(url)
      if (!raw || raw.length < 100) throw new Error('M3U vazio ou inválido')
      console.log('[ziiiTV] M3U OK, parsing...')
      await parseM3U(raw, 500)
      localStorage.setItem('user', user); localStorage.setItem('pass', pass)
      setM3uUrl(url)
      console.log('[ziiiTV] Parse OK')
      onDone()
    } catch (err: any) {
      console.error('[ziiiTV] Login error:', err)
      setError(err.message || 'Erro ao carregar lista')
    } finally { setLoading(false) }
  }

  function onKey(e: React.KeyboardEvent) {
    if (loading) return
    if (e.key === 'ArrowDown') { e.preventDefault(); setFocusIdx(f => (f + 1) % 3) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setFocusIdx(f => (f - 1 + 3) % 3) }
    else if (e.key === 'Enter' && focusIdx === 2) handleLogin()
  }

  return (
    <div className={styles.root} onKeyDown={onKey}>
      <div className={styles.box}>
        <h1>ziiiTV</h1>
        <input ref={userRef} type="text" placeholder="Usuário" value={user} onChange={e => setUser(e.target.value)} disabled={loading} />
        <input ref={passRef} type="password" placeholder="Senha" value={pass} onChange={e => setPass(e.target.value)} disabled={loading} />
        <button ref={btnRef} onClick={handleLogin} disabled={loading}>{loading ? 'Carregando...' : 'Entrar'}</button>
        {error && <p className={styles.error}>{error}</p>}
      </div>
    </div>
  )
}

export default SettingsScreen
