import apiClient from './apiClient'
import type { IReportService } from '@/domain/ports/ReportPort'
import type { CorrectReportRequest, TaskReport, TaskReportPage } from '@/domain/models/Report'

export class ReportAdapter implements IReportService {
  async listPendingReports(page: number, size: number): Promise<TaskReportPage> {
    const { data } = await apiClient.get<TaskReportPage>('/admin/task-reports', {
      params: { status: 'PENDING', page, size },
    })
    return data
  }

  async getReport(reportId: string): Promise<TaskReport> {
    const { data } = await apiClient.get<TaskReport>(`/admin/task-reports/${reportId}`)
    return data
  }

  async correctReport(reportId: string, request: CorrectReportRequest): Promise<TaskReport> {
    const { data } = await apiClient.post<TaskReport>(
      `/admin/task-reports/${reportId}/correct`,
      request,
    )
    return data
  }

  async dismissReport(reportId: string): Promise<TaskReport> {
    const { data } = await apiClient.post<TaskReport>(`/admin/task-reports/${reportId}/dismiss`)
    return data
  }
}
