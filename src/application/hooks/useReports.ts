import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { container } from '@/infrastructure/di/container'
import type { CorrectReportRequest } from '@/domain/models/Report'

const reportService = container.reportService

export function usePendingReports(page = 0, size = 20) {
  return useQuery({
    queryKey: ['reports', 'pending', page, size],
    queryFn: () => reportService.listPendingReports(page, size),
    staleTime: 30 * 1000,
  })
}

export function useReport(reportId: string) {
  return useQuery({
    queryKey: ['reports', reportId],
    queryFn: () => reportService.getReport(reportId),
    enabled: Boolean(reportId),
    staleTime: 30 * 1000,
  })
}

export function useCorrectReport() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ reportId, request }: { reportId: string; request: CorrectReportRequest }) =>
      reportService.correctReport(reportId, request),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['reports'] })
    },
  })
}

export function useDismissReport() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (reportId: string) => reportService.dismissReport(reportId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['reports'] })
    },
  })
}
