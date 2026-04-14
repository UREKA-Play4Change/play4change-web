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
  category: string
  createdAt: string
  stats: TopicStats
}

export interface CreateTopicFromUrlRequest {
  title: string
  description: string
  urls: string[]
  durationDays: number
  difficulty: TopicDifficulty
  category: string
}
