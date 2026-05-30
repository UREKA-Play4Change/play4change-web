import { FormEvent, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { useReport, useCorrectReport, useDismissReport } from '@/application/hooks/useReports'
import { ROUTES } from '@/lib/constants'

const INITIAL_OPTIONS = ['', '', '', '']

export default function ReportDetailPage() {
  const { t } = useTranslation()
  const { reportId = '' } = useParams<{ reportId: string }>()
  const navigate = useNavigate()

  const { data: report, isPending, isError } = useReport(reportId)
  const correctReport = useCorrectReport()
  const dismissReport = useDismissReport()

  const [showCorrectForm, setShowCorrectForm] = useState(false)
  const [showDismissDialog, setShowDismissDialog] = useState(false)

  // Correct form state
  const [correctedTitle, setCorrectedTitle] = useState('')
  const [correctedOptions, setCorrectedOptions] = useState<string[]>(INITIAL_OPTIONS)
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState(0)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  function validateCorrectForm(): boolean {
    const errors: Record<string, string> = {}
    if (!correctedTitle.trim()) errors.title = t('admin.reportDetail.titleRequired')
    correctedOptions.forEach((opt, i) => {
      if (!opt.trim()) errors[`option${i}`] = t('admin.reportDetail.optionRequired')
    })
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  function handleCorrectSubmit(e: FormEvent) {
    e.preventDefault()
    if (!validateCorrectForm()) return

    correctReport.mutate(
      {
        reportId,
        request: {
          correctedTitle: correctedTitle.trim(),
          correctedOptions: correctedOptions.map(o => o.trim()),
          correctAnswerIndex,
        },
      },
      {
        onSuccess: () => {
          toast.success(t('admin.reportDetail.correctedSuccess'))
          void navigate(ROUTES.ADMIN_REPORTS)
        },
      },
    )
  }

  function handleDismissConfirm() {
    dismissReport.mutate(reportId, {
      onSuccess: () => {
        toast.success(t('admin.reportDetail.dismissedSuccess'))
        void navigate(ROUTES.ADMIN_REPORTS)
      },
    })
  }

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
        {t('admin.reportDetail.loadError')}
      </p>
    )
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => {
            void navigate(ROUTES.ADMIN_REPORTS)
          }}
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          ← {t('admin.reportDetail.back')}
        </button>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
        <h1 className="font-display text-xl font-bold text-gray-900">
          {t('admin.reportDetail.heading')}
        </h1>

        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
            {t('admin.reportDetail.taskLabel')}
          </p>
          <p className="mt-1 font-mono text-sm text-gray-700">{report.taskTemplateId}</p>
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
            {t('admin.reportDetail.userReasonLabel')}
          </p>
          <p className="mt-1 text-sm text-gray-700">{report.reason}</p>
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
            {t('admin.reportDetail.reportedLabel')}
          </p>
          <p className="mt-1 text-sm text-gray-700">
            {new Date(report.reportedAt).toLocaleString()}
          </p>
        </div>
      </div>

      {!showCorrectForm && (
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => {
              setShowCorrectForm(true)
            }}
            className="rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
          >
            {t('admin.reportDetail.correctButton')}
          </button>
          <button
            type="button"
            onClick={() => {
              setShowDismissDialog(true)
            }}
            className="rounded-xl border border-gray-200 px-6 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
          >
            {t('admin.reportDetail.dismissButton')}
          </button>
        </div>
      )}

      {showCorrectForm && (
        <form
          onSubmit={handleCorrectSubmit}
          noValidate
          className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-4"
        >
          <h2 className="font-display text-base font-semibold text-gray-900">
            {t('admin.reportDetail.correctFormHeading')}
          </h2>

          <div>
            <label
              htmlFor="correctedTitle"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              {t('admin.reportDetail.correctedTitleLabel')}
            </label>
            <input
              id="correctedTitle"
              type="text"
              value={correctedTitle}
              onChange={e => {
                setCorrectedTitle(e.target.value)
                setFormErrors(p => ({ ...p, title: undefined as unknown as string }))
              }}
              className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition-all focus:ring-2 focus:ring-blue-500 ${formErrors.title ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white focus:border-blue-400'}`}
            />
            {formErrors.title && (
              <p className="mt-1 text-xs text-red-600" role="alert">
                {formErrors.title}
              </p>
            )}
          </div>

          {correctedOptions.map((opt, i) => (
            <div key={i}>
              <label
                htmlFor={`option-${i}`}
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                {t('admin.reportDetail.optionLabel', { index: i + 1 })}
              </label>
              <div className="flex items-center gap-3">
                <input
                  id={`option-${i}`}
                  type="text"
                  value={opt}
                  onChange={e => {
                    const next = [...correctedOptions]
                    next[i] = e.target.value
                    setCorrectedOptions(next)
                    setFormErrors(p => ({ ...p, [`option${i}`]: undefined as unknown as string }))
                  }}
                  className={`flex-1 rounded-xl border px-4 py-2.5 text-sm outline-none transition-all focus:ring-2 focus:ring-blue-500 ${formErrors[`option${i}`] ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white focus:border-blue-400'}`}
                />
                <input
                  type="radio"
                  name="correctAnswer"
                  id={`correct-${i}`}
                  checked={correctAnswerIndex === i}
                  onChange={() => {
                    setCorrectAnswerIndex(i)
                  }}
                  aria-label={t('admin.reportDetail.markCorrectAriaLabel', { index: i + 1 })}
                  className="h-4 w-4 accent-blue-600"
                />
              </div>
              {formErrors[`option${i}`] && (
                <p className="mt-1 text-xs text-red-600" role="alert">
                  {formErrors[`option${i}`]}
                </p>
              )}
            </div>
          ))}

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={correctReport.isPending}
              className="rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 disabled:opacity-60"
            >
              {correctReport.isPending
                ? t('admin.reportDetail.submitting')
                : t('admin.reportDetail.submitCorrection')}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowCorrectForm(false)
              }}
              className="rounded-xl border border-gray-200 px-6 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
            >
              {t('admin.reportDetail.cancel')}
            </button>
          </div>
        </form>
      )}

      {showDismissDialog && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="dismiss-dialog-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
        >
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl space-y-4">
            <h2
              id="dismiss-dialog-title"
              className="font-display text-base font-semibold text-gray-900"
            >
              {t('admin.reportDetail.dismissDialogTitle')}
            </h2>
            <p className="text-sm text-gray-600">{t('admin.reportDetail.dismissDialogBody')}</p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleDismissConfirm}
                disabled={dismissReport.isPending}
                className="rounded-xl bg-red-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-red-700 disabled:opacity-60"
              >
                {dismissReport.isPending
                  ? t('admin.reportDetail.submitting')
                  : t('admin.reportDetail.confirmDismiss')}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowDismissDialog(false)
                }}
                className="rounded-xl border border-gray-200 px-5 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
              >
                {t('admin.reportDetail.cancel')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
