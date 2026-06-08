import { render, screen, fireEvent } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import BadgeOverviewPage from '../BadgeOverviewPage'
import type { Topic } from '@/domain/models/Topic'

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}))

const { mockListMyTopics, mockGetTopicBadgeStats } = vi.hoisted(() => ({
  mockListMyTopics: vi.fn(),
  mockGetTopicBadgeStats: vi.fn(),
}))

vi.mock('@/infrastructure/di/container', () => ({
  container: {
    topicService: {
      listMyTopics: mockListMyTopics,
      getTopicBadgeStats: mockGetTopicBadgeStats,
    },
  },
}))

const MOCK_TOPICS: Topic[] = [
  {
    id: 'topic-001',
    title: 'Sustainable Development Goals',
    description: '',
    status: 'ACTIVE',
    difficulty: 'BEGINNER',
    taskCount: 15,
    language: 'en',
    category: 'Sustainability',
    createdAt: '2026-01-10T09:00:00Z',
    stats: { enrolledUsers: 100, completionRate: 0.5, totalScore: 80, activeUsers: 20 },
  },
  {
    id: 'topic-002',
    title: 'Digital Literacy',
    description: '',
    status: 'ACTIVE',
    difficulty: 'BEGINNER',
    taskCount: 15,
    language: 'en',
    category: 'Digital Literacy',
    createdAt: '2026-02-01T09:00:00Z',
    stats: { enrolledUsers: 50, completionRate: 0, totalScore: 0, activeUsers: 0 },
  },
]

function wrapper({ children }: { children: React.ReactNode }) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return <QueryClientProvider client={qc}>{children}</QueryClientProvider>
}

describe('BadgeOverviewPage', () => {
  it('renders topic list with earned percentage', async () => {
    mockListMyTopics.mockResolvedValue(MOCK_TOPICS)
    mockGetTopicBadgeStats.mockImplementation((id: string) =>
      Promise.resolve({
        totalIssued: id === 'topic-001' ? 30 : 0,
        enrolledCount: id === 'topic-001' ? 100 : 50,
        earnedPercentage: id === 'topic-001' ? 30 : 0,
        recentEarners:
          id === 'topic-001'
            ? [
                { userId: 'user-a', earnedAt: '2026-04-10T12:00:00Z' },
                { userId: 'user-b', earnedAt: '2026-04-08T09:00:00Z' },
              ]
            : [],
      }),
    )

    render(<BadgeOverviewPage />, { wrapper })

    expect(await screen.findByText('Sustainable Development Goals')).toBeInTheDocument()
    expect(screen.getByText('Digital Literacy')).toBeInTheDocument()
    expect(screen.getByText('30.0%')).toBeInTheDocument()
  })

  it('renders "No earners yet" for topics with 0% earned', async () => {
    mockListMyTopics.mockResolvedValue(MOCK_TOPICS)
    mockGetTopicBadgeStats.mockResolvedValue({
      totalIssued: 0,
      enrolledCount: 50,
      earnedPercentage: 0,
      recentEarners: [],
    })

    render(<BadgeOverviewPage />, { wrapper })

    await screen.findByText('Sustainable Development Goals')

    const noEarnersCells = await screen.findAllByText('admin.badges.noEarners')
    expect(noEarnersCells.length).toBeGreaterThan(0)
  })

  it('clicking a topic row opens the detail panel', async () => {
    mockListMyTopics.mockResolvedValue([MOCK_TOPICS[0]])
    mockGetTopicBadgeStats.mockResolvedValue({
      totalIssued: 10,
      enrolledCount: 100,
      earnedPercentage: 10,
      recentEarners: [
        { userId: 'user-a', earnedAt: '2026-04-10T12:00:00Z' },
        { userId: 'user-b', earnedAt: '2026-04-05T12:00:00Z' },
      ],
    })

    render(<BadgeOverviewPage />, { wrapper })

    const row = await screen.findByText('Sustainable Development Goals')
    fireEvent.click(row)

    expect(await screen.findByText('user-a')).toBeInTheDocument()
    expect(screen.getByText('admin.badges.recentEarnersHeading')).toBeInTheDocument()
  })

  it('detail panel shows earners in the order returned by the API', async () => {
    mockListMyTopics.mockResolvedValue([MOCK_TOPICS[0]])
    mockGetTopicBadgeStats.mockResolvedValue({
      totalIssued: 2,
      enrolledCount: 100,
      earnedPercentage: 2,
      recentEarners: [
        { userId: 'user-newest', earnedAt: '2026-04-10T12:00:00Z' },
        { userId: 'user-older', earnedAt: '2026-04-01T12:00:00Z' },
      ],
    })

    render(<BadgeOverviewPage />, { wrapper })

    fireEvent.click(await screen.findByText('Sustainable Development Goals'))

    const earners = await screen.findAllByText(/^user-/)
    expect(earners[0]).toHaveTextContent('user-newest')
    expect(earners[1]).toHaveTextContent('user-older')
  })

  it('shows error state on topic load failure', async () => {
    mockListMyTopics.mockRejectedValue(new Error('network'))
    render(<BadgeOverviewPage />, { wrapper })

    expect(await screen.findByRole('alert')).toBeInTheDocument()
  })
})
