import { describe, expect, it, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createElement } from 'react'
import type { ReactNode } from 'react'

// Mock the DI container before importing the hook
const mockListMyTopics = vi.fn()
vi.mock('@/infrastructure/di/container', () => ({
  container: {
    topicService: {
      listMyTopics: mockListMyTopics,
    },
  },
}))

// Import after mock is set up
const { useTopics } = await import('../useTopics')

function makeWrapper() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return ({ children }: { children: ReactNode }) =>
    createElement(QueryClientProvider, { client }, children)
}

describe('useTopics', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns an array when the API resolves with an array', async () => {
    const topics = [{ id: '1', title: 'Test', status: 'ACTIVE' }]
    mockListMyTopics.mockResolvedValue(topics)

    const { result } = renderHook(() => useTopics(), { wrapper: makeWrapper() })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })
    expect(Array.isArray(result.current.data)).toBe(true)
    expect(result.current.data).toEqual(topics)
  })

  it('returns an empty array when the API resolves with null', async () => {
    mockListMyTopics.mockResolvedValue(null)

    const { result } = renderHook(() => useTopics(), { wrapper: makeWrapper() })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })
    expect(result.current.data).toEqual([])
  })

  it('returns an empty array when the API resolves with a number (unexpected type)', async () => {
    // Simulates a scenario where the adapter returns a non-array scalar
    mockListMyTopics.mockResolvedValue(42 as unknown as never)

    const { result } = renderHook(() => useTopics(), { wrapper: makeWrapper() })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })
    expect(result.current.data).toEqual([])
  })

  it('returns an empty array when the API resolves with a plain object', async () => {
    mockListMyTopics.mockResolvedValue({ data: [{ id: '1' }], total: 1 })

    const { result } = renderHook(() => useTopics(), { wrapper: makeWrapper() })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })
    expect(result.current.data).toEqual([])
  })

  it('returns an empty array when the API resolves with an empty array', async () => {
    mockListMyTopics.mockResolvedValue([])

    const { result } = renderHook(() => useTopics(), { wrapper: makeWrapper() })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })
    expect(result.current.data).toEqual([])
  })
})
