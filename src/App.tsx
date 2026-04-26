import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
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

// Listens for the auth:session-expired event dispatched by the API client when a
// token refresh fails, and navigates to the login page via React Router instead of
// a hard window.location redirect that breaks SPA routing.
function AuthSessionHandler() {
  const navigate = useNavigate()

  useEffect(() => {
    function handleSessionExpired() {
      void navigate(ROUTES.ADMIN_LOGIN, { replace: true })
    }
    window.addEventListener('auth:session-expired', handleSessionExpired)
    return () => {
      window.removeEventListener('auth:session-expired', handleSessionExpired)
    }
  }, [navigate])

  return null
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
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
