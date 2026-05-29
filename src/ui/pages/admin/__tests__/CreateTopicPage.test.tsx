import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'

const { mockCreateFromUrl, mockCreateFromPdf } = vi.hoisted(() => ({
  mockCreateFromUrl: vi.fn(),
  mockCreateFromPdf: vi.fn(),
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
    topicService: {
      createFromUrl: mockCreateFromUrl,
      createFromPdf: mockCreateFromPdf,
      listMyTopics: vi.fn().mockResolvedValue([]),
      getTopicById: vi.fn(),
      regenerateTopic: vi.fn(),
      getTopicTasks: vi.fn().mockResolvedValue([]),
      getTopicStruggleTasks: vi.fn().mockResolvedValue([]),
      updateTask: vi.fn(),
      getPrerequisites: vi.fn().mockResolvedValue([]),
      setPrerequisites: vi.fn(),
      getLearningGraph: vi.fn().mockResolvedValue({ nodes: [], edges: [] }),
    },
    authService: {
      sendMagicLink: vi.fn(),
      verifyMagicLink: vi.fn(),
      loginWithOAuth: vi.fn(),
      refreshToken: vi.fn(),
      logout: vi.fn(),
      getCurrentUser: vi.fn().mockRejectedValue(new Error()),
    },
    statsService: { getStats: vi.fn().mockResolvedValue({}) },
  },
}))

vi.mock('@/application/hooks/useTopicProgress', () => ({
  useTopicProgress: vi.fn().mockReturnValue({
    phase: null,
    tasksCompleted: 0,
    tasksTotal: 0,
    done: false,
    failed: false,
    failureReason: null,
  }),
}))

import CreateTopicPage from '@/ui/pages/admin/CreateTopicPage'

// Labels in CreateTopicPage have an asterisk inside an aria-hidden span,
// so exact: false is used to match on the key prefix.
function getTitle() {
  return screen.getByLabelText('admin.createTopic.titleLabel', { exact: false })
}
function getDescription() {
  return screen.getByLabelText('admin.createTopic.descriptionLabel', { exact: false })
}
function getCategory() {
  return screen.getByLabelText('admin.createTopic.categoryLabel', { exact: false })
}
function getUrlInput() {
  return screen.getByLabelText('components.urlInput.urlAriaLabel')
}

function renderPage() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter>
        <CreateTopicPage />
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('CreateTopicPage — URL form', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('submitting a valid URL calls createFromUrl with title, description, category and url', async () => {
    const user = userEvent.setup()
    mockCreateFromUrl.mockResolvedValue({ id: 'topic-1', title: 'Test', status: 'ACTIVE' })

    renderPage()

    await user.type(getTitle(), 'Test Topic')
    await user.type(getDescription(), 'A test description')
    await user.type(getCategory(), 'Science')
    await user.type(getUrlInput(), 'https://example.com')
    await user.click(screen.getByRole('button', { name: 'admin.createTopic.createButton' }))

    await waitFor(() => {
      expect(mockCreateFromUrl).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Test Topic',
          description: 'A test description',
          category: 'Science',
          urls: ['https://example.com'],
        }),
      )
    })
  })

  it('submitting without a URL shows "At least one URL is required" error', async () => {
    const user = userEvent.setup()

    renderPage()

    await user.type(getTitle(), 'Test Topic')
    await user.type(getDescription(), 'A test description')
    await user.type(getCategory(), 'Science')
    // Leave URL input empty, then submit
    await user.click(screen.getByRole('button', { name: 'admin.createTopic.createButton' }))

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('At least one URL is required')
    })
    expect(mockCreateFromUrl).not.toHaveBeenCalled()
  })

  it('submitting an invalid URL shows "Invalid URL" error', async () => {
    const user = userEvent.setup()

    renderPage()

    await user.type(getTitle(), 'Test Topic')
    await user.type(getDescription(), 'A test description')
    await user.type(getCategory(), 'Science')
    await user.type(getUrlInput(), 'not-a-valid-url')
    await user.click(screen.getByRole('button', { name: 'admin.createTopic.createButton' }))

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/Invalid URL/)
    })
    expect(mockCreateFromUrl).not.toHaveBeenCalled()
  })
})

describe('CreateTopicPage — PDF form', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('switching to PDF mode and submitting without a file shows pdf required error', async () => {
    const user = userEvent.setup()

    renderPage()

    await user.type(getTitle(), 'PDF Topic')
    await user.type(getDescription(), 'A test description')
    await user.type(getCategory(), 'Science')
    await user.click(screen.getByRole('button', { name: 'admin.createTopic.sourcePdf' }))
    await user.click(screen.getByRole('button', { name: 'admin.createTopic.createButton' }))

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('admin.createTopic.pdfRequired')
    })
    expect(mockCreateFromPdf).not.toHaveBeenCalled()
  })

  it('selecting a valid PDF calls createFromPdf on submit', async () => {
    const user = userEvent.setup()
    mockCreateFromPdf.mockResolvedValue({ id: 'topic-2', title: 'PDF Topic', status: 'ACTIVE' })

    const { container } = renderPage()

    await user.type(getTitle(), 'PDF Topic')
    await user.type(getDescription(), 'A test description')
    await user.type(getCategory(), 'Science')
    await user.click(screen.getByRole('button', { name: 'admin.createTopic.sourcePdf' }))

    const pdfFile = new File(['pdf-content'], 'document.pdf', { type: 'application/pdf' })
    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement
    fireEvent.change(fileInput, { target: { files: [pdfFile] } })

    await user.click(screen.getByRole('button', { name: 'admin.createTopic.createButton' }))

    await waitFor(() => {
      expect(mockCreateFromPdf).toHaveBeenCalledWith(expect.any(FormData))
    })
  })

  it('selecting a PDF over 100MB shows "File size must not exceed 100MB" error', async () => {
    const user = userEvent.setup()

    const { container } = renderPage()

    await user.click(screen.getByRole('button', { name: 'admin.createTopic.sourcePdf' }))

    const oversizedFile = new File([''], 'large.pdf', { type: 'application/pdf' })
    Object.defineProperty(oversizedFile, 'size', { value: 101 * 1024 * 1024 })
    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement
    fireEvent.change(fileInput, { target: { files: [oversizedFile] } })

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('File size must not exceed 100MB')
    })
  })
})

describe('CreateTopicPage — generation progress', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows the progress stepper after URL topic is created successfully', async () => {
    const user = userEvent.setup()
    mockCreateFromUrl.mockResolvedValue({ id: 'topic-1', title: 'Test', status: 'ACTIVE' })

    renderPage()

    await user.type(getTitle(), 'Test Topic')
    await user.type(getDescription(), 'A test description')
    await user.type(getCategory(), 'Science')
    await user.type(getUrlInput(), 'https://example.com')
    await user.click(screen.getByRole('button', { name: 'admin.createTopic.createButton' }))

    await waitFor(() => {
      expect(screen.getByText('admin.createTopic.generatingSubtitle')).toBeInTheDocument()
    })
  })
})
