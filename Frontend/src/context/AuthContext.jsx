import { useCallback, useEffect, useMemo, useState } from 'react'
import { authService } from '../services/authService.js'
import { AuthContext } from './authContext.js'

const TOKEN_KEY = 'nexdesk_token'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY))
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false

    const bootstrap = async () => {
      if (!token) {
        if (!cancelled) {
          setReady(true)
        }
        return
      }

      try {
        const currentUser = await authService.getCurrentUser()
        if (!cancelled) {
          setUser(currentUser)
        }
      } catch {
        localStorage.removeItem(TOKEN_KEY)
        if (!cancelled) {
          setToken(null)
          setUser(null)
        }
      } finally {
        if (!cancelled) {
          setReady(true)
        }
      }
    }

    bootstrap()

    return () => {
      cancelled = true
    }
  }, [token])

  const storeSession = useCallback((nextToken, nextUser) => {
    localStorage.setItem(TOKEN_KEY, nextToken)
    setToken(nextToken)
    setUser(nextUser)
  }, [])

  const login = useCallback(async (credentials) => {
    const { token: nextToken, user: nextUser } = await authService.login(credentials)
    storeSession(nextToken, nextUser)
    return nextUser
  }, [storeSession])

  const register = useCallback(async (payload) => {
    const { token: nextToken, user: nextUser } = await authService.register(payload)
    storeSession(nextToken, nextUser)
    return nextUser
  }, [storeSession])

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    setToken(null)
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({
      user,
      token,
      ready,
      isAuthenticated: Boolean(token),
      login,
      register,
      logout,
    }),
    [user, token, ready, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
