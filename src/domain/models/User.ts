export interface AdminUser {
  id: string
  email: string
  name: string
}

export interface AdminUserFull {
  id: string
  email: string
  name: string | null
  role: 'USER' | 'ADMIN'
  createdAt: string
  enrollmentCount: number
}

export interface AdminUserPage {
  content: AdminUserFull[]
  page: number
  size: number
  totalElements: number
  totalPages: number
}

export interface AdminUserDetail {
  id: string
  email: string
  name: string | null
  role: 'USER' | 'ADMIN'
  createdAt: string
  enrollmentCount: number
  totalPoints: number
  streakDays: number
}

export interface AdminUserEnrollment {
  enrollmentId: string
  topicId: string
  topicTitle: string
  status: 'ACTIVE' | 'COMPLETED' | 'EXPIRED' | 'PAUSED'
  currentDayIndex: number
  totalDays: number
  totalPointsEarned: number
  streakDays: number
  enrolledAt: string
}

export interface AdminUserBadge {
  microCompetenceName: string
  description: string
  topicTitle: string
  earnedAt: string
}

export type RoadmapNodeStatus =
  | 'COMPLETED'
  | 'LATE'
  | 'SKIPPED'
  | 'PENDING'
  | 'LOCKED'
  | 'ADAPTIVE_PENDING'
  | 'ADAPTIVE_COMPLETED'
  | 'PENDING_REVIEW'
  | 'REVIEW_PENDING'

export interface AdminRoadmapNode {
  dayIndex: number
  title: string
  status: RoadmapNodeStatus
  isAdaptive: boolean
  assignmentId: string | null
  pointsAwarded: number | null
  description?: string | null
  hint?: string | null
  options?: string[] | null
  selectedOption?: number | null
  correctAnswer?: number | null
  isCorrect?: boolean | null
}

export type ExplanationSessionStatus = 'GENERATING' | 'ACTIVE' | 'RESOLVED'

export interface AdminExplanationMessage {
  role: 'USER' | 'AI'
  content: string
  sentAt: string
}

export interface AdminExplanationSession {
  sessionId: string
  dayIndex: number
  errorPattern: string
  status: ExplanationSessionStatus
  explanationText: string | null
  generatedAt: string
  resolvedAt: string | null
  messages: AdminExplanationMessage[]
}
