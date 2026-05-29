import type { IReportService } from '@/domain/ports/ReportPort'
import type { CorrectReportRequest, TaskReport, TaskReportPage } from '@/domain/models/Report'

const delay = (ms = 300) => new Promise(r => setTimeout(r, ms))

const MOCK_REPORTS: TaskReport[] = [
  {
    reportId: 'report-1',
    taskTemplateId: 'task-template-1',
    userId: 'user-1',
    reason: 'The answer options seem incorrect — option B should be the right answer.',
    status: 'PENDING',
    reportedAt: '2026-05-01T10:00:00Z',
    resolvedAt: null,
  },
  {
    reportId: 'report-2',
    taskTemplateId: 'task-template-2',
    userId: 'user-2',
    reason: 'The question is confusing and ambiguous.',
    status: 'PENDING',
    reportedAt: '2026-05-02T14:30:00Z',
    resolvedAt: null,
  },
]

export class MockReportAdapter implements IReportService {
  private reports = MOCK_REPORTS.map(r => ({ ...r }))

  async listPendingReports(page: number, size: number): Promise<TaskReportPage> {
    await delay()
    const pending = this.reports.filter(r => r.status === 'PENDING')
    const start = page * size
    return {
      content: pending.slice(start, start + size),
      page,
      size,
      totalElements: pending.length,
      totalPages: Math.ceil(pending.length / size),
    }
  }

  async getReport(reportId: string): Promise<TaskReport> {
    await delay()
    const report = this.reports.find(r => r.reportId === reportId)
    if (!report) throw new Error(`Report ${reportId} not found`)
    return report
  }

  async correctReport(reportId: string, _request: CorrectReportRequest): Promise<TaskReport> {
    await delay()
    const report = this.reports.find(r => r.reportId === reportId)
    if (!report) throw new Error(`Report ${reportId} not found`)
    report.status = 'RESOLVED'
    report.resolvedAt = new Date().toISOString()
    return report
  }

  async dismissReport(reportId: string): Promise<TaskReport> {
    await delay()
    const report = this.reports.find(r => r.reportId === reportId)
    if (!report) throw new Error(`Report ${reportId} not found`)
    report.status = 'DISMISSED'
    report.resolvedAt = new Date().toISOString()
    return report
  }
}
