import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useIntersectionObserver } from '@/ui/hooks/useIntersectionObserver'

export default function TrustSection() {
  const { t } = useTranslation()
  const ref = useRef<HTMLElement>(null)
  const isVisible = useIntersectionObserver(ref, { threshold: 0.15 })

  return (
    <section ref={ref} className="bg-white py-24" aria-label="Research and partners">
      <div className="mx-auto max-w-7xl px-6">
        {/* Heading */}
        <div
          className="mb-16 text-center transition-all duration-700"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
          }}
        >
          <span className="mb-4 inline-block rounded-full bg-green-100 px-4 py-1.5 text-sm font-semibold text-green-700">
            {t('trust.label')}
          </span>
          <h2 className="mb-6 font-display text-3xl font-bold text-gray-900 sm:text-4xl">
            {t('trust.heading')}
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">{t('trust.description')}</p>
        </div>

        {/* DigComp badge + research CTA */}
        <div
          className="mb-16 flex flex-col items-center gap-6 transition-all duration-700"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
            transitionDelay: '100ms',
          }}
        >
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-blue-100 bg-blue-50 px-10 py-8 text-center sm:flex-row sm:gap-6 sm:text-left">
            {/* EU star icon */}
            <div className="shrink-0 rounded-2xl bg-blue-600 p-4">
              <svg
                className="h-8 w-8 text-white"
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
              </svg>
            </div>
            <div>
              <p className="font-display text-lg font-bold text-gray-900">
                {t('trust.digcompBadge')}
              </p>
              <p className="mt-1 text-sm text-gray-600">{t('trust.digcompSub')}</p>
            </div>
            <div className="sm:ml-auto">
              <a
                href="https://publications.jrc.ec.europa.eu/repository/handle/JRC128415"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-blue-700"
              >
                {t('trust.researchCta')}
                <svg
                  className="h-3.5 w-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Partner logos */}
        <div
          className="flex flex-col items-center gap-6 transition-all duration-700"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
            transitionDelay: '200ms',
          }}
        >
          <p className="text-sm font-medium uppercase tracking-wider text-gray-400">
            {t('trust.partnersLabel')}
          </p>
          <div className="flex items-center justify-center gap-12">
            <img
              src="/logos/isel.png"
              alt={t('footer.iselAlt')}
              className="h-12 object-contain opacity-60 grayscale transition-all hover:opacity-100 hover:grayscale-0"
            />
            <img
              src="/logos/ureka.jpg"
              alt={t('footer.urekaAlt')}
              className="h-12 object-contain opacity-60 grayscale transition-all hover:opacity-100 hover:grayscale-0"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
