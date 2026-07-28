import { useState, useEffect } from 'react'
import { getCurrentUser, signOut } from 'aws-amplify/auth'

interface AuthUser {
  id: string
  email: string
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCurrentUser()
      .then(u => setUser({ id: u.userId, email: u.username }))
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
  }, [])

  const logout = async () => {
    await signOut()
    setUser(null)
  }

  return { user, loading, logout }
}