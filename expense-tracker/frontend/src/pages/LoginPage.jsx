import { useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'

const s = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--bg)',
    padding: '1.5rem',
  },
  card: {
    width: '100%',
    maxWidth: '400px',
  },
  logoRow: { marginBottom: '2.5rem' },
  logo: {
    fontSize: '2rem',
    fontWeight: 800,
    letterSpacing: '-0.02em',
    color: 'var(--text)',
  },
  logoAccent: { color: 'var(--accent)' },
  tagline: {
    fontSize: '0.78rem',
    color: 'var(--text-muted)',
    fontFamily: 'var(--font-mono)',
    marginTop: '0.3rem',
    letterSpacing: '0.04em',
  },
  tabs: {
    display: 'flex',
    background: 'var(--surface)',
    borderRadius: 'var(--radius)',
    padding: '4px',
    marginBottom: '1.75rem',
    border: '1px solid var(--border)',
    gap: '4px',
  },
  tab: {
    flex: 1,
    padding: '0.55rem',
    border: 'none',
    background: 'transparent',
    color: 'var(--text-muted)',
    fontSize: '0.85rem',
    fontWeight: 600,
    borderRadius: '7px',
    cursor: 'pointer',
    fontFamily: 'var(--font-display)',
    transition: 'all 150ms',
  },
  tabActive: {
    background: 'var(--accent)',
    color: '#000',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  fieldWrap: {},
  label: {
    display: 'block',
    fontSize: '0.7rem',
    fontWeight: 700,
    color: 'var(--text-muted)',
    marginBottom: '0.4rem',
    letterSpacing: '0.07em',
    textTransform: 'uppercase',
  },
  input: {
    width: '100%',
    padding: '0.72rem 1rem',
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    color: 'var(--text)',
    fontSize: '0.92rem',
    outline: 'none',
    fontFamily: 'var(--font-mono)',
    transition: 'border-color 150ms',
  },
  hint: {
    fontSize: '0.68rem',
    fontFamily: 'var(--font-mono)',
    color: 'var(--text-dim)',
    marginTop: '0.3rem',
  },
  error: {
    background: 'rgba(255,92,92,0.08)',
    border: '1px solid rgba(255,92,92,0.25)',
    borderRadius: 'var(--radius)',
    padding: '0.7rem 1rem',
    color: 'var(--danger)',
    fontSize: '0.82rem',
    fontFamily: 'var(--font-mono)',
  },
  btn: {
    width: '100%',
    padding: '0.82rem',
    background: 'var(--accent)',
    color: '#000',
    border: 'none',
    borderRadius: 'var(--radius)',
    fontSize: '0.92rem',
    fontWeight: 700,
    marginTop: '0.25rem',
    cursor: 'pointer',
    fontFamily: 'var(--font-display)',
    transition: 'opacity 150ms',
  },
  notice: {
    marginTop: '1.5rem',
    padding: '0.75rem 1rem',
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    fontSize: '0.72rem',
    fontFamily: 'var(--font-mono)',
    color: 'var(--text-dim)',
    lineHeight: 1.6,
  },
}

export default function LoginPage() {
  const { login, register } = useAuth()
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (mode === 'login') {
        await login(form.username, form.password)
      } else {
        await register(form.username, '', form.password)
      }
    } catch (err) {
      const data = err.response?.data
      const msg =
        data?.username?.[0] ||
        data?.password?.[0] ||
        data?.detail ||
        (mode === 'login' ? 'Invalid username or password.' : 'Registration failed.')
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  const switchMode = (m) => {
    setMode(m)
    setError('')
    setForm({ username: '', password: '' })
  }

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.logoRow}>
          <div style={s.logo}>Personal finance Tool<span style={s.logoAccent}>.</span></div>
          <div style={s.tagline}>your expense tracker</div>
        </div>

        <div style={s.tabs}>
          {[['login', 'Sign In'], ['register', 'Sign Up']].map(([m, label]) => (
            <button
              key={m}
              style={{ ...s.tab, ...(mode === m ? s.tabActive : {}) }}
              onClick={() => switchMode(m)}
              type="button"
            >
              {label}
            </button>
          ))}
        </div>

        <form style={s.form} onSubmit={handleSubmit}>
          <div style={s.fieldWrap}>
            <label style={s.label}>Username</label>
            <input
              style={s.input}
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="your_handle"
              required
              autoComplete="username"
              spellCheck={false}
            />
            {mode === 'register' && (
              <div style={s.hint}>
                Usernames are unique — your data is tied only to this username.
              </div>
            )}
          </div>

          <div style={s.fieldWrap}>
            <label style={s.label}>Password</label>
            <input
              style={s.input}
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            />
            {mode === 'register' && (
              <div style={s.hint}>Minimum 6 characters.</div>
            )}
          </div>

          {error && <div style={s.error}>{error}</div>}

          <button
            style={{ ...s.btn, ...(loading ? { opacity: 0.55, cursor: 'not-allowed' } : {}) }}
            type="submit"
            disabled={loading}
          >
            {loading
              ? 'Please wait…'
              : mode === 'login'
                ? 'Sign In →'
                : 'Create Account →'}
          </button>
        </form>

        {mode === 'register' && (
          <div style={s.notice}>
            Each username is unique across the app. Your expenses are visible only to you.
          </div>
        )}
      </div>
    </div>
  )
}
