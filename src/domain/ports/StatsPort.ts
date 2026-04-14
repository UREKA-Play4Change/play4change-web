import type { PlatformStats } from '../models/Stats'

export interface IStatsService {
  getPlatformStats(): Promise<PlatformStats>
}
