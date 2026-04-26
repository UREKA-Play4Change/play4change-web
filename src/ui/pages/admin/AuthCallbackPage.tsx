import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useVerifyMagicLink } from '@/application/hooks/useAuth'
import { ROUTES } from '@/lib/constants'

export default function AuthCallbackPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const verifyMagicLink = useVerifyMagicLink()

  const token = searchParams.get('token')

  useEffect(() => {
    if (!token) {
      void navigate(ROUTES.ADMIN_LOGIN, { replace: true })
      return
    }

    verifyMagicLink.mutate(token, {
      onSuccess: () => {
        void navigate(ROUTES.ADMIN_DASHBOARD, { replace: true })
      },
      onError: () => {
        void navigate(ROUTES.ADMIN_LOGIN, { replace: true })
      },
    })
    // Run once on mount — token comes from URL and won't change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
    </div>
  )
}
