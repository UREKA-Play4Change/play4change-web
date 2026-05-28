export type TopicStatus = 'PENDING' | 'GENERATING' | 'ACTIVE' | 'FAILED'
export type TopicDifficulty = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'

export interface TopicStats {
  enrolledUsers: number
  completionRate: number
  averageScore: number
  activeUsers: number
  [key: string]: number
}

export interface Topic {
  id: string
  title: string
  description: string
  status: TopicStatus
  difficulty: TopicDifficulty
  durationDays: number
  taskCount: number
  language: string
  category: string
  createdAt: string
  expiresAt?: string | null
  generationLog?: unknown[]
  stats: TopicStats | null
}

export interface TaskQuestionStats {
  totalAttempts: number
  successCount: number
  successRate: number
  avgPointsAwarded: number
}

export interface TaskTemplate {
  id: string
  dayIndex: number
  poolIndex: number
  title: string
  description: string
  hint: string | null
  taskType: 'MULTIPLE_CHOICE' | 'TODO_ACTION'
  pointsReward: number
  options: string[] | null
  correctAnswer: number | null
  version: number
  language: string
  createdAt: string
  stats: TaskQuestionStats
}

export interface AdaptiveTaskAdmin {
  id: string
  sessionId: string
  sessionStatus: 'OPEN' | 'RESOLVED' | 'ABANDONED'
  errorPattern: 'WRONG_CONCEPT' | 'PARTIAL_UNDERSTANDING' | 'READING_ERROR' | 'TIME_PRESSURE'
  sessionDetectedAt: string
  enrollmentId: string
  title: string
  description: string
  hint: string | null
  pointsReward: number
  orderIndex: number
  options: string[] | null
  correctAnswer: number | null
  isCorrect: boolean | null
  completedAt: string | null
}

export interface PhaseLogEntry {
  fromPhase: string
  toPhase: string
  transitionedAt: string
  durationMs: number
}

export interface UpdateTaskRequest {
  title: string
  description: string
  hint: string | null
  options: string[] | null
  correctAnswer: number | null
}

export interface CreateTopicFromUrlRequest {
  title: string
  description: string
  urls: string[]
  durationDays: number
  difficulty: TopicDifficulty
  language: string
  taskCount: number
  category: string
  expiresAt?: string
}
