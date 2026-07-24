import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Login() {
  const { session, login } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (session) return <Navigate to="/" replace />

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!username.trim() || !password) {
      setError('Enter both a username and password.')
      return
    }
    setSubmitting(true)
    try {
      await login(username.trim(), password)
      navigate('/', { replace: true })
    } catch (err) {
      setError(err?.response?.data?.error || 'Could not sign in. Check your credentials.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-console-bg px-6">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(37,46,69,0.5) 1px, transparent 1px), linear-gradient(to bottom, rgba(37,46,69,0.5) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(ellipse at center, black 0%, transparent 75%)',
        }}
      />

      <div className="relative w-full max-w-sm">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-signal-cyan/30 bg-signal-cyan/10 text-signal-cyan">
            <span className="h-2 w-2 animate-pulse rounded-full bg-signal-cyan" />
          </div>
          <div>
            <p className="font-display text-lg font-semibold text-console-text">Support Console</p>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-console-muted">
              Operator sign-in
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-console-border bg-console-panel/80 p-7 shadow-glow backdrop-blur"
        >
          <div className="space-y-5">
            <div>
              <label className="mb-2 block font-mono text-[11px] uppercase tracking-[0.15em] text-console-muted">
                Username
              </label>
              <input
                type="text"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-lg border border-console-border bg-console-bg px-3.5 py-2.5 font-body text-sm text-console-text placeholder:text-console-muted/50 focus:border-signal-cyan/60 focus:outline-none focus:ring-1 focus:ring-signal-cyan/40"
                placeholder="admin"
              />
            </div>
            <div>
              <label className="mb-2 block font-mono text-[11px] uppercase tracking-[0.15em] text-console-muted">
                Password
              </label>
              <input
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-console-border bg-console-bg px-3.5 py-2.5 font-body text-sm text-console-text placeholder:text-console-muted/50 focus:border-signal-cyan/60 focus:outline-none focus:ring-1 focus:ring-signal-cyan/40"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <p className="mt-4 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 font-mono text-[12px] text-rose-300">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="mt-6 w-full rounded-lg bg-signal-cyan px-4 py-2.5 font-display text-sm font-semibold text-console-bg transition hover:bg-signal-cyan/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="mt-5 text-center font-mono text-[11px] text-console-muted">
          Admin accounts are provisioned directly in the database.
        </p>
      </div>
    </div>
  )
}
