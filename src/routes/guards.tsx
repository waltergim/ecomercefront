import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/features/auth/hooks'
import { PageLoader } from '@/components/ui/Spinner'

export function ProtectedRoute() {
  const { user, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) return <PageLoader label="Verificando tu sesión..." />

  if (!user) {
    const next = encodeURIComponent(`${location.pathname}${location.search}`)
    return <Navigate to={`/ingresar?redirect=${next}`} replace />
  }

  return <Outlet />
}

export function AdminRoute() {
  const { user, isLoading } = useAuth()

  if (isLoading) return <PageLoader label="Verificando tu sesión..." />

  if (!user) return <Navigate to="/ingresar?redirect=%2Fadmin" replace />
  if (user.role !== 'admin') return <Navigate to="/" replace />

  return <Outlet />
}

export function GuestRoute() {
  const { user, isLoading } = useAuth()

  if (isLoading) return <PageLoader label="Verificando tu sesión..." />
  if (user) return <Navigate to="/" replace />

  return <Outlet />
}
