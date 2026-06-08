import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useIntersectionObserver } from '@/ui/hooks/useIntersectionObserver'

const CARD_KEYS = ['infrastructure', 'governance', 'skills'] as const

const CARD_ICONS = [
  // Infrastructure — cpu/circuit
  <svg
    key="infrastructure"
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
      d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25zm.75-12h9v9h-9v-9z"
    />
  </svg>,
  // Governance — landmark/institution
  <svg
    key="governance"
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
      d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z"
    />
  </svg>,
  // Skills — academic cap
  <svg
    key="skills"
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
      d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5"
    />
  </svg>,
]

export default function ChallengeSection() {
  const { t } = useTranslation()
  const ref = useRef<HTMLElement>(null)
  const isVisible = useIntersectionObserver(ref, { threshold: 0.1 })

  return (
    <section id="challenge" ref={ref} className="bg-blue-900 py-24 text-white">
      <div className="mx-auto max-w-7xl px-6">
        {/* Heading */}
        <div
          className="mb-16 text-center transition-all duration-700"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
          }}
        >
          <span className="mb-4 inline-block rounded-full bg-blue-800 px-4 py-1.5 text-sm font-semibold text-blue-200">
            {t('challenge.label')}
          </span>
          <h2 className="mb-6 font-display text-4xl font-bold sm:text-5xl">
            {t('challenge.heading')}{' '}
            <span className="text-green-400">{t('challenge.headingHighlight')}</span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-blue-200">
            {t('challenge.description')}
          </p>
        </div>

        {/* Challenge cards */}
        <div className="grid gap-6 md:grid-cols-3">
          {CARD_KEYS.map((key, i) => (
            <div
              key={key}
              className="rounded-2xl border border-blue-800 bg-blue-800/50 p-6 backdrop-blur-sm transition-all duration-700 hover:-translate-y-1 hover:border-blue-700 hover:bg-blue-800/70"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
                transitionDelay: `${i * 120}ms`,
              }}
            >
              <div className="mb-4 inline-flex rounded-xl bg-blue-700/60 p-3 text-green-400">
                {CARD_ICONS[i]}
              </div>
              <h3 className="mb-3 font-display text-lg font-bold text-white">
                {t(`challenge.cards.${key}.title`)}
              </h3>
              <p className="text-sm leading-relaxed text-blue-200">
                {t(`challenge.cards.${key}.description`)}
              </p>
            </div>
          ))}
        </div>

        {/* DigComp reference */}
        <div
          className="mt-16 flex flex-col items-center gap-4 text-center transition-all duration-700"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
            transitionDelay: '400ms',
          }}
        >
          <p className="text-sm font-medium text-blue-300">{t('challenge.digcomp')}</p>
          <a
            href="https://publications.jrc.ec.europa.eu/repository/handle/JRC128415"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-blue-700 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:border-green-400 hover:text-green-400"
          >
            {t('challenge.researchLink')}
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
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
    </section>
  )
}
