import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { setAuthToken, login as loginRequest } from '../lib/api.js'

const AuthContext = createContext(null)
const STORAGE_KEY = 'support_console_session'

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      try {
        const parsed = JSON.parse(raw)
        setAuthToken(parsed.token)
        setSession(parsed)
      } catch {
        localStorage.removeItem(STORAGE_KEY)
      }
    }
    setReady(true)
  }, [])

  const login = useCallback(async (username, password) => {
    const { token, admin } = await loginRequest(username, password)
    const next = { token, admin }
    setAuthToken(token)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    setSession(next)
    return next
  }, [])

  const logout = useCallback(() => {
    setAuthToken(null)
    localStorage.removeItem(STORAGE_KEY)
    setSession(null)
  }, [])

  return (
    <AuthContext.Provider value={{ session, ready, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
