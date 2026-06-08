import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useIntersectionObserver } from '@/ui/hooks/useIntersectionObserver'
import { ROUTES } from '@/lib/constants'

const STEP_KEYS = [
  'product.steps.step1',
  'product.steps.step2',
  'product.steps.step3',
  'product.steps.step4',
] as const

const STEP_NUMBERS = ['01', '02', '03', '04']

const STEP_ICONS = [
  // Discover — magnifying glass
  <svg
    key="discover"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
    />
  </svg>,
  // Daily challenge — lightning bolt
  <svg
    key="daily"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
    />
  </svg>,
  // AI adapts — sparkles
  <svg
    key="ai"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z"
    />
  </svg>,
  // Earn badge — shield-check
  <svg
    key="badge"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
    />
  </svg>,
]

export default function ProductSection() {
  const { t } = useTranslation()
  const ref = useRef<HTMLElement>(null)
  const isVisible = useIntersectionObserver(ref, { threshold: 0.1 })

  return (
    <section ref={ref} className="bg-gradient-to-b from-gray-50 to-white py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div
          className="mb-16 text-center transition-all duration-700"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
          }}
        >
          <span className="mb-4 inline-block rounded-full bg-blue-100 px-4 py-1.5 text-sm font-semibold text-blue-700">
            {t('product.label')}
          </span>
          <h2 className="mb-6 font-display text-4xl font-bold text-gray-900 sm:text-5xl">
            {t('product.heading')}{' '}
            <span className="text-green-500">{t('product.headingHighlight')}</span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">{t('product.description')}</p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {STEP_KEYS.map((key, i) => (
            <div
              key={key}
              className="relative transition-all duration-700"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
                transitionDelay: `${i * 120}ms`,
              }}
            >
              {/* Connector line */}
              {i < STEP_KEYS.length - 1 && (
                <div
                  className="absolute left-full top-6 hidden h-0.5 w-full bg-gradient-to-r from-blue-200 to-transparent lg:block"
                  aria-hidden="true"
                />
              )}

              <div className="glass-card rounded-2xl p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white">
                    {STEP_ICONS[i]}
                  </div>
                  <span className="font-display text-3xl font-extrabold text-blue-100">
                    {STEP_NUMBERS[i]}
                  </span>
                </div>
                <h3 className="mb-3 font-display text-lg font-bold text-gray-900">
                  {t(`${key}.title`)}
                </h3>
                <p className="text-sm leading-relaxed text-gray-600">{t(`${key}.description`)}</p>
              </div>
            </div>
          ))}
        </div>

        <div
          className="mt-12 text-center transition-all duration-700"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
            transitionDelay: '500ms',
          }}
        >
          <Link
            to={ROUTES.DOWNLOAD}
            className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-blue-200 transition-all hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-xl"
          >
            {t('product.cta')}
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
