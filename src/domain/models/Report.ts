export interface TaskReport {
  reportId: string
  taskTemplateId: string
  userId: string
  reason: string
  status: 'PENDING' | 'RESOLVED' | 'DISMISSED'
  reportedAt: string
  resolvedAt: string | null
}

export interface TaskReportPage {
  content: TaskReport[]
  page: number
  size: number
  totalElements: number
  totalPages: number
}

export interface CorrectReportRequest {
  correctedTitle: string
  correctedOptions: string[]
  correctAnswerIndex: number
}
