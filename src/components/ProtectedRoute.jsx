import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function ProtectedRoute({ children }) {
  const { session, ready } = useAuth()

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-console-bg">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-console-muted">
          Loading…
        </p>
      </div>
    )
  }

  if (!session) {
    return <Navigate to="/login" replace />
  }

  return children
}
