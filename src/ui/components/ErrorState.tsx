import { useTranslation } from 'react-i18next'

interface ErrorStateProps {
  onRetry: () => void
}

export default function ErrorState({ onRetry }: ErrorStateProps) {
  const { t } = useTranslation()
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
        <svg
          className="h-7 w-7 text-red-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m0 3.75h.008v.008H12v-.008zm0-12.75a9 9 0 100 18 9 9 0 000-18z"
          />
        </svg>
      </div>
      <p className="font-semibold text-gray-800">{t('errors.serverError.heading')}</p>
      <p className="mt-1 text-sm text-gray-500">{t('errors.serverError.description')}</p>
      <button
        onClick={onRetry}
        className="mt-4 rounded-xl bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
      >
        {t('errors.serverError.retry')}
      </button>
    </div>
  )
}
