import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

vi.mock('@/infrastructure/api/apiClient', () => ({
  getAccessToken: vi.fn().mockReturnValue(null),
  setTokens: vi.fn(),
  clearTokens: vi.fn(),
  getRefreshToken: vi.fn().mockReturnValue(null),
  default: {},
}))

// Mock useCurrentUser directly to bypass React Query retry delays
vi.mock('@/application/hooks/useAuth', () => ({
  useCurrentUser: () => ({
    data: undefined,
    isPending: false,
    isError: true,
    isFetching: false,
  }),
  useSendMagicLink: vi.fn(),
  useVerifyMagicLink: vi.fn(),
  useLoginWithOAuth: vi.fn(),
  useLogout: vi.fn(),
}))

import ProtectedRoute from '@/ui/components/ProtectedRoute'

describe('ProtectedRoute', () => {
  it('redirects an unauthenticated user to /admin/login', async () => {
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })

    render(
      <QueryClientProvider client={client}>
        <MemoryRouter initialEntries={['/admin/dashboard']}>
          <Routes>
            <Route element={<ProtectedRoute />}>
              <Route path="/admin/dashboard" element={<div>Protected Content</div>} />
            </Route>
            <Route path="/admin/login" element={<div>Login Page</div>} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>,
    )

    await waitFor(() => {
      expect(screen.getByText('Login Page')).toBeInTheDocument()
    })
  })
})
