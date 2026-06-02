import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'

const { mockSendMagicLink } = vi.hoisted(() => ({ mockSendMagicLink: vi.fn() }))

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}))

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
      sendMagicLink: mockSendMagicLink,
      verifyMagicLink: vi.fn(),
      refreshToken: vi.fn(),
      logout: vi.fn(),
      getCurrentUser: vi.fn().mockRejectedValue(new Error('not authenticated')),
    },
  },
}))

import LoginPage from '@/ui/pages/admin/LoginPage'

function renderLoginPage() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('submitting a valid email calls POST /auth/magic-link', async () => {
    const user = userEvent.setup()
    mockSendMagicLink.mockResolvedValue(undefined)

    renderLoginPage()

    await user.type(screen.getByLabelText('admin.login.emailLabel'), 'admin@example.com')
    await user.click(screen.getByRole('button', { name: 'admin.login.sendButton' }))

    await waitFor(() => {
      expect(mockSendMagicLink).toHaveBeenCalledWith('admin@example.com')
    })
  })

  it('shows check-your-email section after successful submission', async () => {
    const user = userEvent.setup()
    mockSendMagicLink.mockResolvedValue(undefined)

    renderLoginPage()

    await user.type(screen.getByLabelText('admin.login.emailLabel'), 'admin@example.com')
    await user.click(screen.getByRole('button', { name: 'admin.login.sendButton' }))

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: 'admin.login.checkEmail.heading' }),
      ).toBeInTheDocument()
    })
  })
})
