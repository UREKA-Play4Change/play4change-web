import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom'
import {
  QueryClient,
  QueryClientProvider,
  QueryCache,
  MutationCache,
  useQueryClient,
} from '@tanstack/react-query'
import { Toaster, toast } from 'sonner'
import { setTokens } from '@/infrastructure/api/apiClient'
import { getErrorMessage, isHandledByAuthFlow } from '@/lib/errorMessage'
import { ROUTES } from '@/lib/constants'

const LandingPage = lazy(() => import('@/ui/pages/landing/LandingPage'))
const DownloadPage = lazy(() => import('@/ui/pages/download/DownloadPage'))
const LoginPage = lazy(() => import('@/ui/pages/admin/LoginPage'))
const AuthCallbackPage = lazy(() => import('@/ui/pages/admin/AuthCallbackPage'))
const AuthVerifyPage = lazy(() => import('@/ui/pages/admin/AuthVerifyPage'))
const DashboardPage = lazy(() => import('@/ui/pages/admin/DashboardPage'))
const TopicListPage = lazy(() => import('@/ui/pages/admin/TopicListPage'))
const TopicDetailPage = lazy(() => import('@/ui/pages/admin/TopicDetailPage'))
const CreateTopicPage = lazy(() => import('@/ui/pages/admin/CreateTopicPage'))
const ProtectedRoute = lazy(() => import('@/ui/components/ProtectedRoute'))
const AdminLayout = lazy(() => import('@/ui/layouts/AdminLayout'))
const PublicLayout = lazy(() => import('@/ui/layouts/PublicLayout'))
const NotFoundPage = lazy(() => import('@/ui/pages/NotFoundPage'))

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: error => {
      if (!isHandledByAuthFlow(error)) toast.error(getErrorMessage(error))
    },
  }),
  mutationCache: new MutationCache({
    onError: error => {
      if (!isHandledByAuthFlow(error)) toast.error(getErrorMessage(error))
    },
  }),
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

function PageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
    </div>
  )
}

// Handles two global auth events:
// 1. auth:session-expired — dispatched by the API client when a token refresh fails;
//    navigates to login via React Router instead of a hard window.location redirect.
// 2. BroadcastChannel 'p4c:auth' login message — sent by the verify page in a new
//    tab (email magic link always opens a new tab); syncs tokens into this tab so
//    the user lands on the dashboard in both the original tab and the new one.
function AuthSessionHandler() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  useEffect(() => {
    function handleSessionExpired() {
      void navigate(ROUTES.ADMIN_LOGIN, { replace: true })
    }
    window.addEventListener('auth:session-expired', handleSessionExpired)
    return () => {
      window.removeEventListener('auth:session-expired', handleSessionExpired)
    }
  }, [navigate])

  useEffect(() => {
    let bc: BroadcastChannel | null = null
    try {
      bc = new BroadcastChannel('p4c:auth')
      bc.addEventListener(
        'message',
        (
          e: MessageEvent<{ type: string; tokens?: { accessToken: string; refreshToken: string } }>,
        ) => {
          const { type, tokens } = e.data
          if (type === 'login' && tokens) {
            // Load the tokens into this tab's memory so the ProtectedRoute's
            // /admin/me call goes out with a valid Authorization header.
            setTokens(tokens)
            void queryClient.resetQueries({ queryKey: ['auth', 'me'] })
            void navigate(ROUTES.ADMIN_DASHBOARD, { replace: true })
          }
        },
      )
    } catch {
      // BroadcastChannel unavailable (e.g. some private browsing modes)
    }
    return () => bc?.close()
  }, [navigate, queryClient])

  return null
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster position="top-right" richColors closeButton />
      <BrowserRouter>
        <AuthSessionHandler />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public routes */}
            <Route element={<PublicLayout />}>
              <Route path={ROUTES.HOME} element={<LandingPage />} />
              <Route path={ROUTES.DOWNLOAD} element={<DownloadPage />} />
            </Route>

            {/* Admin auth */}
            <Route path={ROUTES.ADMIN_LOGIN} element={<LoginPage />} />
            <Route path={ROUTES.AUTH_CALLBACK} element={<AuthCallbackPage />} />
            <Route path={ROUTES.AUTH_VERIFY} element={<AuthVerifyPage />} />

            {/* Protected admin routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<AdminLayout />}>
                <Route path={ROUTES.ADMIN_DASHBOARD} element={<DashboardPage />} />
                <Route path={ROUTES.ADMIN_TOPICS} element={<TopicListPage />} />
                <Route path={ROUTES.ADMIN_TOPIC_DETAIL} element={<TopicDetailPage />} />
                <Route path={ROUTES.ADMIN_CREATE_TOPIC} element={<CreateTopicPage />} />
              </Route>
            </Route>

            {/* 404 catch-all */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
