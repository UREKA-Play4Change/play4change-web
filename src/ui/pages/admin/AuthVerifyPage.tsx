import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useVerifyMagicLink } from '@/application/hooks/useAuth'
import { ROUTES } from '@/lib/constants'

export default function AuthVerifyPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const verifyMagicLink = useVerifyMagicLink()
  const [failed, setFailed] = useState(false)
  // Guard against React 18 Strict Mode's double-invocation of useEffect in dev,
  // which would call verify twice — the second call gets 401 (token already used)
  // and triggers the refresh interceptor's hard redirect to /admin/login.
  const verifyCalledRef = useRef(false)

  const token = searchParams.get('token')

  useEffect(() => {
    if (!token) {
      void navigate(ROUTES.HOME, { replace: true })
      return
    }

    if (verifyCalledRef.current) return
    verifyCalledRef.current = true

    verifyMagicLink.mutate(token, {
      onSuccess: () => {
        void navigate(ROUTES.ADMIN_DASHBOARD, { replace: true })
      },
      onError: () => {
        setFailed(true)
        setTimeout(() => {
          void navigate(ROUTES.HOME, { replace: true })
        }, 3000)
      },
    })
    // Run once on mount — token comes from URL and won't change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (failed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-lg text-center">
          <div className="mb-4 flex items-center justify-center">
            <div className="rounded-full bg-red-100 p-3">
              <svg
                className="h-8 w-8 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
          </div>
          <h2 className="mb-2 text-xl font-semibold text-gray-900">Authentication failed</h2>
          <p className="text-sm text-gray-500">
            This link is invalid or has expired. Redirecting you to the homepage…
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
    </div>
  )
}
