import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import api from '../services/api'

const AuthContext = createContext(null)

const TOKEN_KEY = 'token'

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null)
  const [token,   setToken]   = useState(() => localStorage.getItem(TOKEN_KEY))
  const [loading, setLoading] = useState(true)   // true until the mount check resolves

  // ── Persist helpers ──────────────────────────────────────────────────────────

  const saveSession = (newToken, newUser) => {
    localStorage.setItem(TOKEN_KEY, newToken)
    setToken(newToken)
    setUser(newUser)
  }

  const clearSession = () => {
    localStorage.removeItem(TOKEN_KEY)
    setToken(null)
    setUser(null)
  }

  // ── Validate stored token on mount ───────────────────────────────────────────

  useEffect(() => {
    const stored = localStorage.getItem(TOKEN_KEY)
    if (!stored) {
      setLoading(false)
      return
    }

    api.get('/api/auth/me')
      .then(({ data }) => setUser(data.user))
      .catch(() => clearSession())   // token is expired or invalid — wipe it
      .finally(() => setLoading(false))
  }, [])

  // ── Auth actions ─────────────────────────────────────────────────────────────

  const login = useCallback(async (email, password) => {
    const { data } = await api.post('/api/auth/login', { email, password })
    saveSession(data.token, data.user)
    return data.user
  }, [])

  const register = useCallback(async (full_name, email, password) => {
    try {
      const response = await api.post('/api/auth/register', { full_name, email, password })
      return { success: true, message: response.data.message }
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed'
      return { success: false, message }
    }
  }, [])

  const logout = useCallback(() => {
    clearSession()
  }, [])

  const updateProfile = useCallback(async (data) => {
    const { data: res } = await api.put('/api/auth/profile', data)
    setUser(res.user)
    return res.user
  }, [])

  const setUserFromGoogle = useCallback((newToken, newUser) => {
    saveSession(newToken, newUser)
  }, [])

  // ── Context value ────────────────────────────────────────────────────────────

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateProfile, setUserFromGoogle }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
