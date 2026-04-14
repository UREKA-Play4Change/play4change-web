import type { IAuthService } from '@/domain/ports/AuthPort'
import type { ITopicService } from '@/domain/ports/TopicPort'
import type { IStatsService } from '@/domain/ports/StatsPort'

import { AuthAdapter } from '@/infrastructure/api/authAdapter'
import { TopicAdapter } from '@/infrastructure/api/topicAdapter'
import { StatsAdapter } from '@/infrastructure/api/statsAdapter'

import { MockAuthAdapter } from '@/infrastructure/mock/mockAuthAdapter'
import { MockTopicAdapter } from '@/infrastructure/mock/mockTopicAdapter'
import { MockStatsAdapter } from '@/infrastructure/mock/mockStatsAdapter'

const useMock = import.meta.env.VITE_USE_MOCK === 'true'

interface ServiceContainer {
  authService: IAuthService
  topicService: ITopicService
  statsService: IStatsService
}

function createContainer(): ServiceContainer {
  if (useMock) {
    return {
      authService: new MockAuthAdapter(),
      topicService: new MockTopicAdapter(),
      statsService: new MockStatsAdapter(),
    }
  }

  return {
    authService: new AuthAdapter(),
    topicService: new TopicAdapter(),
    statsService: new StatsAdapter(),
  }
}

// Singleton container — created once when the module is first imported
export const container = createContainer()
