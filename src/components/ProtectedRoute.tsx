import { Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAuth } from '../hooks/useAuth'

interface ProtectedRouteProps {
  children: ReactNode
  // TODO: once useAuth distinguishes staff vs participant, add a role
  // check here — /scan should end up staff-only, not just "logged in."
}

/**
 * Redirects to /login if there's no user. Matches the current
 * useAuth() placeholder, which returns { user } with no loading state.
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}