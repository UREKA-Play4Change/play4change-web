import { describe, expect, it } from 'vitest'
import { MockTopicAdapter } from '../mockTopicAdapter'

describe('MockTopicAdapter', () => {
  const adapter = new MockTopicAdapter()

  it('returns list of topics', async () => {
    const result = await adapter.listMyTopics()
    expect(result.content.length).toBeGreaterThan(0)
  })

  it('filters topics by status', async () => {
    const result = await adapter.listMyTopics('ACTIVE')
    expect(result.content.every(t => t.status === 'ACTIVE')).toBe(true)
  })

  it('retrieves a topic by id', async () => {
    const result = await adapter.listMyTopics()
    const first = result.content[0]
    const fetched = await adapter.getTopicById(first.id)
    expect(fetched.id).toBe(first.id)
  })

  it('throws for unknown topic id', async () => {
    await expect(adapter.getTopicById('nonexistent')).rejects.toThrow('Topic not found')
  })

  it('creates a new topic from URL request', async () => {
    const countBefore = (await adapter.listMyTopics()).totalElements
    await adapter.createFromUrl({
      title: 'Test Topic',
      description: 'Test description',
      url: 'https://example.com',
      difficulty: 'BEGINNER',
      language: 'en',
      taskCount: 15,
      category: 'Test',
    })
    const countAfter = (await adapter.listMyTopics()).totalElements
    expect(countAfter).toBe(countBefore + 1)
  })

  it('sets a topic to GENERATING on regenerate', async () => {
    const result = await adapter.listMyTopics('ACTIVE')
    const target = result.content[0]
    const updated = await adapter.regenerateTopic(target.id)
    expect(updated.status).toBe('GENERATING')
  })
})
