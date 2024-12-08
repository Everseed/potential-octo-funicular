import { useState, useEffect } from 'react'
import { api } from '@/lib/api'

interface User {
  id: string
  email: string
  name?: string
  role: 'STUDENT' | 'MENTOR' | 'ADMIN'
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      if (!token) {
        setUser(null)
        return
      }
      const userData = await api.get('/auth/me')
      setUser(userData)
    } catch (err) {
      setError(err as Error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  return { user, loading, error, checkAuth }
}