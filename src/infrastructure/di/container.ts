import type { IAuthService } from '@/domain/ports/AuthPort'
import type { ITopicService } from '@/domain/ports/TopicPort'
import type { IReportService } from '@/domain/ports/ReportPort'
import type { IUserService } from '@/domain/ports/UserPort'

import { AuthAdapter } from '@/infrastructure/api/authAdapter'
import { TopicAdapter } from '@/infrastructure/api/topicAdapter'
import { ReportAdapter } from '@/infrastructure/api/reportAdapter'
import { UserAdapter } from '@/infrastructure/api/userAdapter'

import { MockAuthAdapter } from '@/infrastructure/mock/mockAuthAdapter'
import { MockTopicAdapter } from '@/infrastructure/mock/mockTopicAdapter'
import { MockReportAdapter } from '@/infrastructure/mock/mockReportAdapter'
import { MockUserAdapter } from '@/infrastructure/mock/mockUserAdapter'

const useMock = import.meta.env.VITE_USE_MOCK === 'true'

interface ServiceContainer {
  authService: IAuthService
  topicService: ITopicService
  reportService: IReportService
  userService: IUserService
}

function createContainer(): ServiceContainer {
  if (useMock) {
    return {
      authService: new MockAuthAdapter(),
      topicService: new MockTopicAdapter(),
      reportService: new MockReportAdapter(),
      userService: new MockUserAdapter(),
    }
  }

  return {
    authService: new AuthAdapter(),
    topicService: new TopicAdapter(),
    reportService: new ReportAdapter(),
    userService: new UserAdapter(),
  }
}

// Singleton container — created once when the module is first imported
export const container = createContainer()
