import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/useAuth.js'

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const location = useLocation()
  const { ready, isAuthenticated, user } = useAuth()

  if (!ready) {
    return <div className="loading-shell">Loading session...</div>
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (allowedRoles.length > 0) {
    const hasRole = user?.role && allowedRoles.includes(user.role)

    if (!hasRole) {
      return <Navigate to="/app" replace />
    }
  }

  return children
}