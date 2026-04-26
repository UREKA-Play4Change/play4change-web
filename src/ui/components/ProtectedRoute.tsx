import { Navigate, Outlet } from 'react-router-dom'
import { useCurrentUser } from '@/application/hooks/useAuth'
import { clearTokens } from '@/infrastructure/api/apiClient'
import { ROUTES } from '@/lib/constants'

export default function ProtectedRoute() {
  const { data: user, isLoading, isError, isFetching } = useCurrentUser()

  // Show spinner while loading for the first time OR while actively re-fetching
  // after a login (covers the window between setTokens and the query resolving)
  if (isLoading || (isFetching && !user)) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    )
  }

  if (isError || !user) {
    // Clear tokens so LoginPage's getAccessToken() check returns null and doesn't
    // immediately bounce the user back here in a redirect loop
    clearTokens()
    return <Navigate to={ROUTES.ADMIN_LOGIN} replace />
  }

  return <Outlet />
}
