import { render, screen, within, fireEvent } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import UserListPage from '../UserListPage'
import type { AdminUserFull, AdminUserPage } from '@/domain/models/User'

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, opts?: Record<string, unknown>) =>
      opts ? `${key}:${JSON.stringify(opts)}` : key,
  }),
}))

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

const MOCK_USERS: AdminUserFull[] = [
  {
    id: 'user-001',
    email: 'alice@example.com',
    name: 'Alice Smith',
    role: 'ADMIN',
    createdAt: '2026-01-10T09:00:00Z',
    enrollmentCount: 5,
  },
  {
    id: 'user-002',
    email: 'bob@example.com',
    name: 'Bob Jones',
    role: 'USER',
    createdAt: '2026-02-14T12:00:00Z',
    enrollmentCount: 3,
  },
]

const MOCK_PAGE: AdminUserPage = {
  content: MOCK_USERS,
  page: 0,
  size: 20,
  totalElements: 2,
  totalPages: 1,
}

function wrapper({ children }: { children: React.ReactNode }) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return (
    <MemoryRouter>
      <QueryClientProvider client={qc}>{children}</QueryClientProvider>
    </MemoryRouter>
  )
}

async function revealEmails() {
  fireEvent.click(await screen.findByRole('button', { name: 'admin.users.showEmails' }))
}

describe('UserListPage', () => {
  it('renders user rows', async () => {
    mockListUsers.mockResolvedValue(MOCK_PAGE)
    render(<UserListPage />, { wrapper })

    await revealEmails()
    expect(await screen.findByText('alice@example.com')).toBeInTheDocument()
    expect(screen.getByText('bob@example.com')).toBeInTheDocument()
  })

  it('shows ADMIN role badge for admin users', async () => {
    mockListUsers.mockResolvedValue(MOCK_PAGE)
    render(<UserListPage />, { wrapper })

    await revealEmails()
    const aliceCell = await screen.findByText('alice@example.com')
    const aliceRow = aliceCell.closest('tr')
    expect(aliceRow).not.toBeNull()
    expect(within(aliceRow as HTMLElement).getByText('ADMIN')).toBeInTheDocument()
  })

  it('shows promote button only for USER-role users', async () => {
    mockListUsers.mockResolvedValue(MOCK_PAGE)
    render(<UserListPage />, { wrapper })

    await revealEmails()
    await screen.findByText('alice@example.com')

    const buttons = screen.getAllByRole('button', { name: 'admin.users.promoteButton' })
    expect(buttons).toHaveLength(1)
  })

  it('hides pagination when only one page', async () => {
    mockListUsers.mockResolvedValue(MOCK_PAGE)
    render(<UserListPage />, { wrapper })

    await revealEmails()
    await screen.findByText('alice@example.com')

    expect(screen.queryByRole('navigation')).not.toBeInTheDocument()
  })

  it('shows pagination when totalPages > 1', async () => {
    mockListUsers.mockResolvedValue({ ...MOCK_PAGE, totalPages: 3 })
    render(<UserListPage />, { wrapper })

    await revealEmails()
    await screen.findByText('alice@example.com')

    expect(screen.getByRole('navigation')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'admin.users.prevPage' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'admin.users.nextPage' })).not.toBeDisabled()
  })

  it('shows error state on load failure', async () => {
    mockListUsers.mockRejectedValue(new Error('network'))
    render(<UserListPage />, { wrapper })

    expect(await screen.findByRole('alert')).toBeInTheDocument()
  })
})
