import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Logo from '@/ui/components/Logo'
import { ROUTES } from '@/lib/constants'

const PILLAR_STYLES = [
  { lightBg: 'bg-blue-50', textColor: 'text-blue-600', border: 'border-blue-100' },
  { lightBg: 'bg-green-50', textColor: 'text-green-600', border: 'border-green-100' },
  { lightBg: 'bg-amber-50', textColor: 'text-amber-600', border: 'border-amber-100' },
]

const PILLAR_KEYS = ['engagement', 'personalisation', 'recognition'] as const

const PILLAR_ICONS = [
  // Engagement — trophy
  <svg
    key="engagement"
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
      d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0"
    />
  </svg>,
  // Personalisation — adjustments/sliders
  <svg
    key="personalisation"
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
      d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75"
    />
  </svg>,
  // Recognition — badge/shield-check
  <svg
    key="recognition"
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

export default function HeroSection() {
  const { t } = useTranslation()

  return (
    <section className="relative min-h-screen overflow-hidden bg-white">
      {/* Gradient mesh background */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse at 15% 40%, rgba(59,130,246,0.12) 0%, transparent 55%), radial-gradient(ellipse at 85% 20%, rgba(34,197,94,0.10) 0%, transparent 55%), radial-gradient(ellipse at 60% 80%, rgba(37,99,235,0.08) 0%, transparent 55%)',
        }}
      />

      {/* Floating ambient blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="animate-float absolute left-[10%] top-[20%] h-64 w-64 rounded-full bg-blue-100/40 blur-3xl" />
        <div
          className="animate-float absolute right-[15%] top-[30%] h-48 w-48 rounded-full bg-green-100/50 blur-3xl"
          style={{ animationDelay: '2s' }}
        />
        <div
          className="animate-float absolute bottom-[20%] left-[30%] h-56 w-56 rounded-full bg-blue-50/60 blur-3xl"
          style={{ animationDelay: '4s' }}
        />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-7xl items-center px-6 py-24">
        <div className="flex w-full flex-col items-center gap-10 sm:gap-16 lg:flex-row lg:items-center lg:gap-20">
          {/* ── Left: H1 + tagline + CTAs ── */}
          <div className="flex w-full flex-1 flex-col items-center text-center lg:items-start lg:text-left">
            <div className="animate-fadeInUp anim-delay-100 mb-5">
              <Logo size="xl" />
            </div>

            <h1 className="animate-fadeInUp anim-delay-200 mb-6 font-display text-4xl font-extrabold leading-tight text-gray-900 sm:text-5xl lg:text-6xl">
              {t('hero.heading')}{' '}
              <span className="text-blue-600">{t('hero.headingHighlight')}</span>
            </h1>

            <p className="animate-fadeInUp anim-delay-300 mb-10 max-w-lg text-xl leading-relaxed text-gray-600">
              {t('hero.tagline')}
            </p>

            <div className="animate-fadeInUp anim-delay-400 flex flex-col items-center gap-3 sm:flex-row sm:gap-4 lg:items-start">
              <Link
                to={ROUTES.DOWNLOAD}
                className="group flex items-center gap-3 rounded-full bg-blue-600 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-blue-200 transition-all hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-300"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                {t('hero.ctaDownload')}
              </Link>
              <a
                href="#challenge"
                className="flex items-center gap-2 rounded-full border border-gray-200 bg-white/80 px-8 py-4 text-base font-semibold text-gray-700 backdrop-blur-sm transition-all hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
              >
                {t('hero.ctaLearnMore')}
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </a>
            </div>
          </div>

          {/* ── Right: 3-pillar snapshot ── */}
          <div className="animate-fadeInUp anim-delay-500 flex w-full flex-1 flex-col gap-4 lg:max-w-md">
            {PILLAR_KEYS.map((key, i) => {
              const style = PILLAR_STYLES[i]
              return (
                <div
                  key={key}
                  className={`glass-card flex items-start gap-4 rounded-2xl border p-5 shadow-sm ${style.border}`}
                >
                  <div className={`shrink-0 rounded-xl p-3 ${style.lightBg}`}>
                    <span className={style.textColor}>{PILLAR_ICONS[i]}</span>
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-gray-900">
                      {t(`hero.pillars.${key}.label`)}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-gray-600">
                      {t(`hero.pillars.${key}.description`)}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="animate-fadeInUp anim-delay-500 absolute bottom-10 left-1/2 hidden -translate-x-1/2 sm:block">
        <div
          className="flex h-10 w-6 items-start justify-center rounded-full border-2 border-gray-300 p-1"
          aria-hidden="true"
        >
          <div className="animate-scrollBounce h-2 w-1 rounded-full bg-gray-400" />
        </div>
      </div>
    </section>
  )
}
