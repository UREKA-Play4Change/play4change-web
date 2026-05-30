import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import UserListPage from '../UserListPage'
import type { AdminUserFull, AdminUserPage } from '@/domain/models/User'

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, opts?: Record<string, unknown>) =>
      opts ? `${key}:${JSON.stringify(opts)}` : key,
  }),
}))

vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }))

const { mockListUsers, mockPromoteUser } = vi.hoisted(() => ({
  mockListUsers: vi.fn(),
  mockPromoteUser: vi.fn(),
}))

vi.mock('@/infrastructure/di/container', () => ({
  container: {
    userService: {
      listUsers: mockListUsers,
      promoteUser: mockPromoteUser,
    },
  },
}))

const ADMIN_USER: AdminUserFull = {
  id: 'user-001',
  email: 'alice@example.com',
  name: 'Alice Smith',
  role: 'ADMIN',
  createdAt: '2026-01-10T09:00:00Z',
  enrollmentCount: 5,
}

const USER_USER: AdminUserFull = {
  id: 'user-002',
  email: 'bob@example.com',
  name: 'Bob Jones',
  role: 'USER',
  createdAt: '2026-02-14T12:00:00Z',
  enrollmentCount: 3,
}

const MOCK_PAGE: AdminUserPage = {
  content: [ADMIN_USER, USER_USER],
  page: 0,
  size: 20,
  totalElements: 2,
  totalPages: 1,
}

function wrapper({ children }: { children: React.ReactNode }) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return <QueryClientProvider client={qc}>{children}</QueryClientProvider>
}

describe('PromoteUser flow', () => {
  it('opens confirmation dialog when promote button is clicked', async () => {
    mockListUsers.mockResolvedValue(MOCK_PAGE)
    render(<UserListPage />, { wrapper })

    fireEvent.click(await screen.findByRole('button', { name: 'admin.users.promoteButton' }))

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('admin.users.promoteDialogTitle')).toBeInTheDocument()
  })

  it('closes dialog when cancel is clicked', async () => {
    mockListUsers.mockResolvedValue(MOCK_PAGE)
    render(<UserListPage />, { wrapper })

    fireEvent.click(await screen.findByRole('button', { name: 'admin.users.promoteButton' }))
    fireEvent.click(screen.getByRole('button', { name: 'admin.users.cancel' }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('calls promoteUser with correct userId on confirm', async () => {
    mockListUsers.mockResolvedValue(MOCK_PAGE)
    mockPromoteUser.mockResolvedValue({ ...USER_USER, role: 'ADMIN' })
    render(<UserListPage />, { wrapper })

    fireEvent.click(await screen.findByRole('button', { name: 'admin.users.promoteButton' }))
    fireEvent.click(screen.getByRole('button', { name: 'admin.users.confirmPromote' }))

    await waitFor(() => {
      expect(mockPromoteUser).toHaveBeenCalledWith('user-002')
    })
  })

  it('closes dialog after successful promotion', async () => {
    mockListUsers.mockResolvedValue(MOCK_PAGE)
    mockPromoteUser.mockResolvedValue({ ...USER_USER, role: 'ADMIN' })
    render(<UserListPage />, { wrapper })

    fireEvent.click(await screen.findByRole('button', { name: 'admin.users.promoteButton' }))
    fireEvent.click(screen.getByRole('button', { name: 'admin.users.confirmPromote' }))

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
  })
})
