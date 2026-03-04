import { createContext, useContext, useEffect, useState } from 'react'
import axios from 'axios'

const AuthContext = createContext(null)

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // On initial load, always require sign-in for the dashboard.
    setUser(null)
    setToken(null)
    setIsAuthenticated(false)
    setLoading(false)
  }, [])

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common.Authorization = `Bearer ${token}`
    } else {
      delete axios.defaults.headers.common.Authorization
    }
  }, [token])

  const signup = async (payload) => {
    if (!BACKEND_URL) {
      throw new Error('Backend URL is not configured')
    }
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/auth/register`,
        payload,
      )
      return response.data
    } catch (error) {
      if (error?.response?.status === 404) {
        throw new Error(
          'Signup endpoint not found (404). Check that your backend route matches /auth/signup or update the frontend URL.',
        )
      }
      throw error
    }
  }

  const login = async ({ username, password }) => {
    if (!BACKEND_URL) {
      throw new Error('Backend URL is not configured')
    }
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/auth/login`,
        {
          username,
          password,
        },
      )

      const { token: receivedToken, user: receivedUser } = response.data

      if (receivedToken) {
        setToken(receivedToken)
      }
      if (receivedUser) {
        setUser(receivedUser)
      }

      // Mark user as authenticated for this session even if
      // the backend doesn't return a token or user object.
      setIsAuthenticated(true)

      return response.data
    } catch (error) {
      if (error?.response?.status === 404) {
        throw new Error(
          'Login endpoint not found (404). Check that your backend route matches /auth/login or update the frontend URL.',
        )
      }
      throw error
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    setIsAuthenticated(false)
  }

  const value = {
    user,
    token,
    loading,
    signup,
    login,
    logout,
    isAuthenticated,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return ctx
}

