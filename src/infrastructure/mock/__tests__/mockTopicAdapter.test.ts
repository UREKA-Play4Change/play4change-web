import { describe, expect, it } from 'vitest'
import { MockTopicAdapter } from '../mockTopicAdapter'

describe('MockTopicAdapter', () => {
  const adapter = new MockTopicAdapter()

  it('returns list of topics', async () => {
    const topics = await adapter.listMyTopics()
    expect(topics.length).toBeGreaterThan(0)
  })

  it('filters topics by status', async () => {
    const active = await adapter.listMyTopics('ACTIVE')
    expect(active.every(t => t.status === 'ACTIVE')).toBe(true)
  })

  it('retrieves a topic by id', async () => {
    const topics = await adapter.listMyTopics()
    const first = topics[0]
    const fetched = await adapter.getTopicById(first.id)
    expect(fetched.id).toBe(first.id)
  })

  it('throws for unknown topic id', async () => {
    await expect(adapter.getTopicById('nonexistent')).rejects.toThrow('Topic not found')
  })

  it('creates a new topic from URL request', async () => {
    const countBefore = (await adapter.listMyTopics()).length
    await adapter.createFromUrl({
      title: 'Test Topic',
      description: 'Test description',
      urls: ['https://example.com'],
      durationDays: 5,
      difficulty: 'BEGINNER',
      category: 'Test',
    })
    const countAfter = (await adapter.listMyTopics()).length
    expect(countAfter).toBe(countBefore + 1)
  })

  it('sets a topic to GENERATING on regenerate', async () => {
    const topics = await adapter.listMyTopics('ACTIVE')
    const target = topics[0]
    const updated = await adapter.regenerateTopic(target.id)
    expect(updated.status).toBe('GENERATING')
  })
})
