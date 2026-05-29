import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const { mockVerifyMagicLink } = vi.hoisted(() => ({ mockVerifyMagicLink: vi.fn() }))

vi.mock('@/infrastructure/api/apiClient', () => ({
  getAccessToken: vi.fn().mockReturnValue(null),
  setTokens: vi.fn(),
  clearTokens: vi.fn(),
  getRefreshToken: vi.fn().mockReturnValue(null),
  default: {},
}))

vi.mock('@/infrastructure/di/container', () => ({
  container: {
    authService: {
      sendMagicLink: vi.fn(),
      verifyMagicLink: mockVerifyMagicLink,
      loginWithOAuth: vi.fn(),
      refreshToken: vi.fn(),
      logout: vi.fn(),
      getCurrentUser: vi.fn().mockRejectedValue(new Error('not authenticated')),
    },
  },
}))

import AuthVerifyPage from '@/ui/pages/admin/AuthVerifyPage'

function renderWithToken(token: string) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter initialEntries={[`/auth/verify?token=${token}`]}>
        <Routes>
          <Route path="/auth/verify" element={<AuthVerifyPage />} />
          <Route path="/admin/dashboard" element={<div>Dashboard</div>} />
          <Route path="/" element={<div>Home</div>} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('AuthVerifyPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('calls verifyMagicLink on mount with the token from the URL', async () => {
    mockVerifyMagicLink.mockResolvedValue({ accessToken: 'access', refreshToken: 'refresh' })

    renderWithToken('test-token-123')

    await waitFor(() => {
      expect(mockVerifyMagicLink).toHaveBeenCalledWith('test-token-123')
    })
  })

  it('redirects to dashboard on successful verification', async () => {
    mockVerifyMagicLink.mockResolvedValue({ accessToken: 'access', refreshToken: 'refresh' })

    renderWithToken('valid-token')

    await waitFor(() => {
      expect(screen.getByText('Dashboard')).toBeInTheDocument()
    })
  })

  it('shows authentication failed message when the token is invalid', async () => {
    mockVerifyMagicLink.mockRejectedValue(new Error('invalid token'))

    renderWithToken('bad-token')

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /authentication failed/i })).toBeInTheDocument()
    })
  })
})
