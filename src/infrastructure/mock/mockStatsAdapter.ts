import type { PlatformStats } from '@/domain/models/Stats'
import type { IStatsService } from '@/domain/ports/StatsPort'

const delay = (ms = 500) => new Promise(r => setTimeout(r, ms))

const MOCK_STATS: PlatformStats = {
  totalUsers: 2847,
  activeTopics: 14,
  tasksCompleted: 38621,
}

export class MockStatsAdapter implements IStatsService {
  async getPlatformStats(): Promise<PlatformStats> {
    await delay(400)
    return { ...MOCK_STATS }
  }
}
