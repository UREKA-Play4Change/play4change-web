import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useIntersectionObserver } from '@/ui/hooks/useIntersectionObserver'

const PILLAR_KEYS = ['engagement', 'personalisation', 'recognition'] as const

const PILLAR_STYLES = [
  {
    accent: 'bg-blue-600',
    lightBg: 'bg-blue-50',
    textColor: 'text-blue-600',
    tagBg: 'bg-blue-100',
    tagText: 'text-blue-700',
    border: 'border-blue-100',
  },
  {
    accent: 'bg-green-500',
    lightBg: 'bg-green-50',
    textColor: 'text-green-600',
    tagBg: 'bg-green-100',
    tagText: 'text-green-700',
    border: 'border-green-100',
  },
  {
    accent: 'bg-amber-500',
    lightBg: 'bg-amber-50',
    textColor: 'text-amber-600',
    tagBg: 'bg-amber-100',
    tagText: 'text-amber-700',
    border: 'border-amber-100',
  },
]

const PILLAR_ICONS = [
  // Engagement — trophy
  <svg
    key="engagement"
    className="h-7 w-7"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0"
    />
  </svg>,
  // Personalisation — sliders
  <svg
    key="personalisation"
    className="h-7 w-7"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75"
    />
  </svg>,
  // Recognition — shield-check
  <svg
    key="recognition"
    className="h-7 w-7"
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

export default function PillarsSection() {
  const { t } = useTranslation()
  const ref = useRef<HTMLElement>(null)
  const isVisible = useIntersectionObserver(ref, { threshold: 0.1 })

  return (
    <section id="pillars" ref={ref} className="bg-gradient-to-b from-white to-gray-50 py-24">
      <div className="mx-auto max-w-7xl px-6">
        {/* Heading */}
        <div
          className="mb-16 text-center transition-all duration-700"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
          }}
        >
          <span className="mb-4 inline-block rounded-full bg-blue-100 px-4 py-1.5 text-sm font-semibold text-blue-700">
            {t('pillars.label')}
          </span>
          <h2 className="mb-6 font-display text-4xl font-bold text-gray-900 sm:text-5xl">
            {t('pillars.heading')}{' '}
            <span className="text-blue-600">{t('pillars.headingHighlight')}</span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">{t('pillars.description')}</p>
        </div>

        {/* Pillar cards */}
        <div className="grid gap-8 md:grid-cols-3">
          {PILLAR_KEYS.map((key, i) => {
            const style = PILLAR_STYLES[i]
            return (
              <div
                key={key}
                className={`glass-card relative overflow-hidden rounded-2xl border p-8 shadow-sm transition-all duration-700 hover:-translate-y-1 hover:shadow-md ${style.border}`}
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
                  transitionDelay: `${i * 150}ms`,
                }}
              >
                {/* Large background number */}
                <span
                  className="pointer-events-none absolute right-4 top-2 select-none font-display text-7xl font-extrabold leading-none"
                  style={{ color: 'rgba(0,0,0,0.04)' }}
                  aria-hidden="true"
                >
                  {t(`pillars.${key}.number`)}
                </span>

                <div className={`mb-4 inline-flex rounded-xl p-3 ${style.lightBg}`}>
                  <span className={style.textColor}>{PILLAR_ICONS[i]}</span>
                </div>

                <span
                  className={`mb-3 inline-block rounded-full px-3 py-1 text-xs font-semibold ${style.tagBg} ${style.tagText}`}
                >
                  {t(`pillars.${key}.tag`)}
                </span>

                <h3 className="mb-3 font-display text-xl font-bold text-gray-900">
                  {t(`pillars.${key}.title`)}
                </h3>
                <p className="text-sm leading-relaxed text-gray-600">
                  {t(`pillars.${key}.description`)}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
