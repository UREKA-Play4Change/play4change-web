import { Navigate, Outlet } from 'react-router-dom'
import { useCurrentUser } from '@/application/hooks/useAuth'
import { ROUTES } from '@/lib/constants'

export default function ProtectedRoute() {
  const { data: user, isLoading, isError } = useCurrentUser()

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    )
  }

  if (isError || !user) {
    return <Navigate to={ROUTES.ADMIN_LOGIN} replace />
  }

  return <Outlet />
}
