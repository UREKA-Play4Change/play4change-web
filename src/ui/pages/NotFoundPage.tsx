import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ROUTES } from '@/lib/constants'

export default function NotFoundPage() {
  const { t } = useTranslation()
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-6 text-center">
      <p className="select-none font-display text-8xl font-bold text-blue-100">404</p>
      <h1 className="mt-2 font-display text-2xl font-bold text-gray-900">
        {t('errors.notFound.heading')}
      </h1>
      <p className="mt-2 max-w-sm text-sm text-gray-500">{t('errors.notFound.description')}</p>
      <Link
        to={ROUTES.HOME}
        className="mt-6 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
      >
        {t('errors.notFound.backHome')}
      </Link>
    </div>
  )
}
