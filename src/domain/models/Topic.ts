export type TopicStatus = 'PENDING' | 'GENERATING' | 'ACTIVE' | 'FAILED'

export interface TopicPage {
  content: Topic[]
  page: number
  size: number
  totalElements: number
  totalPages: number
}
export type TopicDifficulty = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'

export interface TopicStats {
  enrolledUsers: number
  completionRate: number
  totalScore: number
  activeUsers: number
  [key: string]: number
}

export interface PrerequisiteTopic {
  id: string
  title: string
  status: TopicStatus
  category: string
}

export interface LearningGraphEdge {
  topicId: string
  prerequisiteTopicId: string
}

export interface LearningGraph {
  edges: LearningGraphEdge[]
}

export interface Topic {
  id: string
  title: string
  description: string
  status: TopicStatus
  difficulty: TopicDifficulty
  taskCount: number
  language: string
  category: string
  createdAt: string
  expiresAt?: string | null
  generationLog?: unknown[]
  stats: TopicStats | null
  prerequisites?: PrerequisiteTopic[]
}

export interface TaskQuestionStats {
  totalAttempts: number
  successCount: number
  successRate: number
  avgPointsAwarded: number
  struggleTriggerCount: number
}

export interface StrugglePathStats {
  originalTaskTemplateId: string
  errorPattern: 'WRONG_CONCEPT' | 'PARTIAL_UNDERSTANDING' | 'READING_ERROR' | 'TIME_PRESSURE'
  totalSessions: number
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
  originalTaskTemplateId: string
  originalTaskTitle: string
  title: string
  description: string
  hint: string | null
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
  url: string
  difficulty: TopicDifficulty
  language: string
  taskCount: number
  category: string
  expiresAt?: string
}

export interface RecentEarner {
  userId: string
  earnedAt: string
}

export interface TopicBadgeStats {
  totalIssued: number
  enrolledCount: number
  earnedPercentage: number
  recentEarners: RecentEarner[]
}

export type TopicExplanationStatus = 'GENERATING' | 'ACTIVE' | 'RESOLVED'

export interface TopicExplanationMessage {
  role: 'USER' | 'AI'
  content: string
  sentAt: string
}

export interface TopicExplanationSession {
  sessionId: string
  userId: string
  userEmail: string
  userName: string | null
  dayIndex: number
  originalTaskTitle: string
  errorPattern: string
  status: TopicExplanationStatus
  explanationText: string | null
  generatedAt: string
  resolvedAt: string | null
  messages: TopicExplanationMessage[]
}
