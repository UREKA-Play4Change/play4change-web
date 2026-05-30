import type { CorrectReportRequest, TaskReport, TaskReportPage } from '../models/Report'

export interface IReportService {
  listPendingReports(page: number, size: number): Promise<TaskReportPage>
  getReport(reportId: string): Promise<TaskReport>
  correctReport(reportId: string, request: CorrectReportRequest): Promise<TaskReport>
  dismissReport(reportId: string): Promise<TaskReport>
}
