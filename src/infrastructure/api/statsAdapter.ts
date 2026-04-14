import type { PlatformStats } from '@/domain/models/Stats'
import type { IStatsService } from '@/domain/ports/StatsPort'
import apiClient from './apiClient'

export class StatsAdapter implements IStatsService {
  async getPlatformStats(): Promise<PlatformStats> {
    const response = await apiClient.get<PlatformStats>('/api/stats/public')
    return response.data
  }
}
