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
  stats: TopicStats
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
