import { describe, expect, it } from 'vitest'
import { MockStatsAdapter } from '../mockStatsAdapter'

describe('MockStatsAdapter', () => {
  const adapter = new MockStatsAdapter()

  it('returns platform stats with positive numbers', async () => {
    const stats = await adapter.getPlatformStats()
    expect(stats.totalUsers).toBeGreaterThan(0)
    expect(stats.activeTopics).toBeGreaterThan(0)
    expect(stats.tasksCompleted).toBeGreaterThan(0)
  })

  it('returns a new object each call (no mutation risk)', async () => {
    const s1 = await adapter.getPlatformStats()
    const s2 = await adapter.getPlatformStats()
    expect(s1).not.toBe(s2)
  })
})
