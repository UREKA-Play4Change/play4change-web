import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter, Routes, Route } from 'react-router-dom'

const { mockGetReport, mockCorrectReport, mockDismissReport } = vi.hoisted(() => ({
  mockGetReport: vi.fn(),
  mockCorrectReport: vi.fn(),
  mockDismissReport: vi.fn(),
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
      listPendingReports: vi.fn(),
      getReport: mockGetReport,
      correctReport: mockCorrectReport,
      dismissReport: mockDismissReport,
    },
    authService: {
      sendMagicLink: vi.fn(),
      verifyMagicLink: vi.fn(),
      loginWithOAuth: vi.fn(),
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

vi.mock('sonner', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}))

import ReportDetailPage from '@/ui/pages/admin/ReportDetailPage'

const MOCK_REPORT = {
  reportId: 'report-1',
  taskTemplateId: 'task-template-abc',
  userId: 'user-1',
  reason: 'The answer options seem incorrect.',
  status: 'PENDING',
  reportedAt: '2026-05-01T10:00:00Z',
  resolvedAt: null,
}

function renderPage(reportId = 'report-1') {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter initialEntries={[`/admin/reports/${reportId}`]}>
        <Routes>
          <Route path="/admin/reports/:reportId" element={<ReportDetailPage />} />
          <Route path="/admin/reports" element={<div>Report List</div>} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('ReportDetailPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockGetReport.mockResolvedValue(MOCK_REPORT)
  })

  it('renders the report reason', async () => {
    renderPage()

    await waitFor(() => {
      expect(screen.getByText('The answer options seem incorrect.')).toBeInTheDocument()
    })
  })

  it('dismiss button opens confirmation dialog', async () => {
    const user = userEvent.setup()

    renderPage()

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: 'admin.reportDetail.dismissButton' }),
      ).toBeInTheDocument()
    })

    await user.click(screen.getByRole('button', { name: 'admin.reportDetail.dismissButton' }))

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })
  })

  it('confirming dismiss calls the dismiss endpoint', async () => {
    const user = userEvent.setup()
    mockDismissReport.mockResolvedValue({ ...MOCK_REPORT, status: 'DISMISSED' })

    renderPage()

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: 'admin.reportDetail.dismissButton' }),
      ).toBeInTheDocument()
    })

    await user.click(screen.getByRole('button', { name: 'admin.reportDetail.dismissButton' }))
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })

    await user.click(screen.getByRole('button', { name: 'admin.reportDetail.confirmDismiss' }))

    await waitFor(() => {
      expect(mockDismissReport).toHaveBeenCalledWith('report-1')
    })
  })

  it('clicking Correct shows the correction form', async () => {
    const user = userEvent.setup()

    renderPage()

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: 'admin.reportDetail.correctButton' }),
      ).toBeInTheDocument()
    })

    await user.click(screen.getByRole('button', { name: 'admin.reportDetail.correctButton' }))

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: 'admin.reportDetail.submitCorrection' }),
      ).toBeInTheDocument()
    })
  })

  it('correct form validates that all fields are non-empty before submitting', async () => {
    const user = userEvent.setup()

    renderPage()

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: 'admin.reportDetail.correctButton' }),
      ).toBeInTheDocument()
    })

    await user.click(screen.getByRole('button', { name: 'admin.reportDetail.correctButton' }))
    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: 'admin.reportDetail.submitCorrection' }),
      ).toBeInTheDocument()
    })

    // Submit without filling any fields
    await user.click(screen.getByRole('button', { name: 'admin.reportDetail.submitCorrection' }))

    await waitFor(() => {
      // Title required error appears
      expect(screen.getAllByRole('alert')[0]).toHaveTextContent('admin.reportDetail.titleRequired')
    })
    expect(mockCorrectReport).not.toHaveBeenCalled()
  })

  it('correct form submission calls the correct endpoint with all fields', async () => {
    const user = userEvent.setup()
    mockCorrectReport.mockResolvedValue({ ...MOCK_REPORT, status: 'RESOLVED' })

    renderPage()

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: 'admin.reportDetail.correctButton' }),
      ).toBeInTheDocument()
    })

    await user.click(screen.getByRole('button', { name: 'admin.reportDetail.correctButton' }))
    await waitFor(() => {
      expect(screen.getByLabelText('admin.reportDetail.correctedTitleLabel')).toBeInTheDocument()
    })

    await user.type(
      screen.getByLabelText('admin.reportDetail.correctedTitleLabel'),
      'Fixed question title',
    )

    // Fill all 4 options (all have the same label key due to i18n mock)
    const optionInputs = screen
      .getAllByRole('textbox')
      .filter(el => (el as HTMLInputElement).id.startsWith('option-'))
    for (let i = 0; i < optionInputs.length; i++) {
      await user.type(optionInputs[i], `Option ${String.fromCharCode(65 + i)}`)
    }

    await user.click(screen.getByRole('button', { name: 'admin.reportDetail.submitCorrection' }))

    // mockCorrectReport is called as correctReport(reportId, request)
    await waitFor(() => {
      expect(mockCorrectReport).toHaveBeenCalledWith(
        'report-1',
        expect.objectContaining({ correctedTitle: 'Fixed question title' }),
      )
    })
  })
})
