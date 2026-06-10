import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import LandingPage from '../pages/LandingPage'

export default function RootRedirect() {
  const { user } = useAuth()
  return user ? <Navigate to="/dashboard" replace /> : <LandingPage />
}