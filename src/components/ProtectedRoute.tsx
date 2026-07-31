import { Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useOrg } from '../context/OrgContext'

interface ProtectedRouteProps {
  children: ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const { orgId } = useOrg()

  if (loading) return null // wait for Cognito to check session

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (!orgId) {
    return <Navigate to="/org-setup" replace />
  }

  return <>{children}</>
}