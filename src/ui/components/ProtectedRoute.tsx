import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { useCurrentUser } from '@/application/hooks/useAuth'
import { clearTokens } from '@/infrastructure/api/apiClient'
import { ROUTES } from '@/lib/constants'

export default function ProtectedRoute() {
  const { data: user, isPending, isError, isFetching } = useCurrentUser()
  const navigate = useNavigate()

  // isPending is true from the moment the query is reset/created until data or error
  // arrives — even before isFetching flips to true. Using isLoading (= isPending &&
  // isFetching) misses the brief window right after resetQueries() where the query
  // is pending but the fetch hasn't started yet, which caused an immediate redirect.
  const isUnauthenticated = !isPending && !isFetching && (isError || !user)

  useEffect(() => {
    if (isUnauthenticated) {
      // Clear tokens here (in an effect, not during render) so that LoginPage's
      // getAccessToken() check returns null and doesn't redirect back in a loop.
      clearTokens()
      void navigate(ROUTES.ADMIN_LOGIN, { replace: true })
    }
  }, [isUnauthenticated, navigate])

  if (isPending || (isFetching && !user) || isUnauthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    )
  }

  return <Outlet />
}
