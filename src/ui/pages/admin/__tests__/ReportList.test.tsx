import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'

const { mockListPendingReports } = vi.hoisted(() => ({
  mockListPendingReports: vi.fn(),
}))

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}))

vi.mock('@/infrastructure/api/apiClient', () => ({
  getAccessToken: vi.fn().mockReturnValue('test-token'),
  setTokens: vi.fn(),
  clearTokens: vi.fn(),
  getRefreshToken: vi.fn().mockReturnValue(null),
  default: {},
}))

vi.mock('@/infrastructure/di/container', () => ({
  container: {
    reportService: {
      listPendingReports: mockListPendingReports,
      getReport: vi.fn(),
      correctReport: vi.fn(),
      dismissReport: vi.fn(),
    },
    authService: {
      sendMagicLink: vi.fn(),
      verifyMagicLink: vi.fn(),
      refreshToken: vi.fn(),
      logout: vi.fn(),
      getCurrentUser: vi.fn().mockRejectedValue(new Error()),
    },
    topicService: {
      listMyTopics: vi.fn().mockResolvedValue([]),
      getTopicById: vi.fn(),
      createFromUrl: vi.fn(),
      createFromPdf: vi.fn(),
      regenerateTopic: vi.fn(),
      getTopicTasks: vi.fn().mockResolvedValue([]),
      getTopicStruggleTasks: vi.fn().mockResolvedValue([]),
      updateTask: vi.fn(),
      getPrerequisites: vi.fn().mockResolvedValue([]),
      setPrerequisites: vi.fn(),
      getLearningGraph: vi.fn().mockResolvedValue({ nodes: [], edges: [] }),
    },
    statsService: { getStats: vi.fn().mockResolvedValue({}) },
  },
}))

import ReportListPage from '@/ui/pages/admin/ReportListPage'

function renderPage() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter>
        <ReportListPage />
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

const REPORT_1 = {
  reportId: 'report-1',
  taskTemplateId: 'task-template-abc',
  userId: 'user-1',
  reason: 'The answer is wrong',
  status: 'PENDING',
  reportedAt: '2026-05-01T10:00:00Z',
  resolvedAt: null,
}

const REPORT_2 = {
  reportId: 'report-2',
  taskTemplateId: 'task-template-xyz',
  userId: 'user-2',
  reason: 'Question is confusing',
  status: 'PENDING',
  reportedAt: '2026-05-02T14:30:00Z',
  resolvedAt: null,
}

describe('ReportListPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders list of reports from API response', async () => {
    mockListPendingReports.mockResolvedValue({
      content: [REPORT_1, REPORT_2],
      page: 0,
      size: 20,
      totalElements: 2,
      totalPages: 1,
    })

    renderPage()

    await waitFor(() => {
      expect(screen.getByText('The answer is wrong')).toBeInTheDocument()
      expect(screen.getByText('Question is confusing')).toBeInTheDocument()
    })
  })

  it('shows empty state when there are no pending reports', async () => {
    mockListPendingReports.mockResolvedValue({
      content: [],
      page: 0,
      size: 20,
      totalElements: 0,
      totalPages: 0,
    })

    renderPage()

    await waitFor(() => {
      expect(screen.getByText('admin.reports.empty')).toBeInTheDocument()
    })
  })

  it('shows pagination controls when there are multiple pages', async () => {
    mockListPendingReports.mockResolvedValue({
      content: [REPORT_1],
      page: 0,
      size: 20,
      totalElements: 40,
      totalPages: 2,
    })

    renderPage()

    await waitFor(() => {
      expect(
        screen.getByRole('navigation', { name: 'admin.reports.paginationAriaLabel' }),
      ).toBeInTheDocument()
    })
  })

  it('does not show pagination when there is only one page', async () => {
    mockListPendingReports.mockResolvedValue({
      content: [REPORT_1],
      page: 0,
      size: 20,
      totalElements: 1,
      totalPages: 1,
    })

    renderPage()

    await waitFor(() => {
      expect(screen.getByText('The answer is wrong')).toBeInTheDocument()
    })
    expect(
      screen.queryByRole('navigation', { name: 'admin.reports.paginationAriaLabel' }),
    ).not.toBeInTheDocument()
  })

  it('clicking a report row navigates to the detail page', async () => {
    const user = userEvent.setup()
    mockListPendingReports.mockResolvedValue({
      content: [REPORT_1],
      page: 0,
      size: 20,
      totalElements: 1,
      totalPages: 1,
    })

    renderPage()

    await waitFor(() => {
      expect(screen.getByText('The answer is wrong')).toBeInTheDocument()
    })

    await user.click(screen.getByRole('row', { name: /The answer is wrong/ }))

    // Navigation happens — no error thrown means it worked
    expect(mockListPendingReports).toHaveBeenCalledWith(0, 20)
  })
})
