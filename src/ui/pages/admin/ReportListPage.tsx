import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { usePendingReports } from '@/application/hooks/useReports'
import { ROUTES } from '@/lib/constants'

const PAGE_SIZE = 20

function truncate(text: string, max: number) {
  return text.length <= max ? text : `${text.slice(0, max)}…`
}

export default function ReportListPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [page, setPage] = useState(0)
  const { data, isPending, isError } = usePendingReports(page, PAGE_SIZE)

  if (isPending) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    )
  }

  if (isError) {
    return (
      <p className="text-sm text-red-600" role="alert">
        {t('admin.reports.loadError')}
      </p>
    )
  }

  const reports = data.content
  const totalPages = data.totalPages

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-gray-900">
          {t('admin.reports.heading')}
        </h1>
        <p className="mt-1 text-sm text-gray-500">{t('admin.reports.subtitle')}</p>
      </div>

      {reports.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center">
          <p className="text-sm font-medium text-gray-500">{t('admin.reports.empty')}</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-100 bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left font-medium text-gray-500">
                  {t('admin.reports.colTask')}
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-500">
                  {t('admin.reports.colReason')}
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-500">
                  {t('admin.reports.colDate')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {reports.map(report => (
                <tr
                  key={report.reportId}
                  role="row"
                  onClick={() => {
                    void navigate(ROUTES.ADMIN_REPORT_DETAIL.replace(':reportId', report.reportId))
                  }}
                  className="cursor-pointer transition-colors hover:bg-gray-50"
                >
                  <td className="px-6 py-4 font-mono text-xs text-gray-500">
                    {truncate(report.taskTemplateId, 32)}
                  </td>
                  <td className="px-6 py-4 text-gray-700">{truncate(report.reason, 80)}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-gray-500">
                    {new Date(report.reportedAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div
          className="flex items-center justify-between"
          role="navigation"
          aria-label={t('admin.reports.paginationAriaLabel')}
        >
          <button
            onClick={() => {
              setPage(p => Math.max(0, p - 1))
            }}
            disabled={page === 0}
            className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-40"
          >
            {t('admin.reports.prevPage')}
          </button>
          <span className="text-sm text-gray-500">
            {t('admin.reports.pageOf', { current: page + 1, total: totalPages })}
          </span>
          <button
            onClick={() => {
              setPage(p => Math.min(totalPages - 1, p + 1))
            }}
            disabled={page >= totalPages - 1}
            className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-40"
          >
            {t('admin.reports.nextPage')}
          </button>
        </div>
      )}
    </div>
  )
}
