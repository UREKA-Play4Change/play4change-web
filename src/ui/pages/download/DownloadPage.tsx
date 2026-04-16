import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useIntersectionObserver } from '@/ui/hooks/useIntersectionObserver'

const AndroidIcon = () => (
  <svg className="h-10 w-10" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M6 18c0 .55.45 1 1 1h1v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h2v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h1c.55 0 1-.45 1-1V8H6v10zM3.5 8C2.67 8 2 8.67 2 9.5v7c0 .83.67 1.5 1.5 1.5S5 17.33 5 16.5v-7C5 8.67 4.33 8 3.5 8zm17 0c-.83 0-1.5.67-1.5 1.5v7c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-7c0-.83-.67-1.5-1.5-1.5zm-4.97-5.84 1.3-1.3c.2-.2.2-.51 0-.71-.2-.2-.51-.2-.71 0l-1.48 1.48C14.15 1.23 13.1 1 12 1c-1.1 0-2.15.23-3.09.63L7.43.15c-.2-.2-.51-.2-.71 0-.2.2-.2.51 0 .71l1.3 1.3C6.41 3.07 5 5.37 5 8h14c0-2.63-1.41-4.93-3.47-5.84zM10 6H9V5h1v1zm5 0h-1V5h1v1z" />
  </svg>
)

const AppleIcon = () => (
  <svg className="h-10 w-10" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
  </svg>
)

function PhoneMockup({ platform }: { platform: 'android' | 'ios' }) {
  const isAndroid = platform === 'android'

  return (
    <div
      className={`relative mx-auto w-48 ${isAndroid ? 'rounded-3xl' : 'rounded-[2.5rem]'} border-4 bg-gray-900 shadow-2xl`}
      style={{
        borderColor: isAndroid ? '#4ade80' : '#3b82f6',
        height: '380px',
      }}
    >
      <div
        className={`absolute left-1/2 top-3 -translate-x-1/2 ${isAndroid ? 'h-2 w-8 rounded-full bg-gray-700' : 'h-6 w-20 rounded-b-2xl bg-gray-800'}`}
        aria-hidden="true"
      />
      <div className="flex h-full flex-col items-center justify-center gap-3 px-4 pt-6">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-green-500" />
        <div className="h-2 w-24 rounded-full bg-gray-700" />
        <div className="h-2 w-16 rounded-full bg-gray-700" />
        <div className="mt-4 h-24 w-full rounded-xl bg-gray-800" />
        <div className="h-8 w-full rounded-lg bg-blue-600/40" />
        <div className="h-8 w-full rounded-lg bg-gray-800" />
      </div>
      {!isAndroid && (
        <div
          className="absolute bottom-2 left-1/2 h-1 w-24 -translate-x-1/2 rounded-full bg-gray-600"
          aria-hidden="true"
        />
      )}
    </div>
  )
}

function PlatformCard({
  platform,
  delay,
  isVisible,
}: {
  platform: 'android' | 'ios'
  delay: number
  isVisible: boolean
}) {
  const { t } = useTranslation()
  const isAndroid = platform === 'android'
  const accentColor = isAndroid ? 'green' : 'blue'
  const platformKey = isAndroid ? 'android' : 'ios'

  return (
    <div
      className="flex flex-col items-center gap-8 transition-all duration-700"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
        transitionDelay: `${delay}ms`,
      }}
    >
      <PhoneMockup platform={platform} />

      <div className="text-center">
        <div
          className={`mb-3 inline-flex items-center gap-2 rounded-full ${isAndroid ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'} px-4 py-2 text-sm font-semibold`}
        >
          {isAndroid ? <AndroidIcon /> : <AppleIcon />}
          <span>{t(`download.${platformKey}.platform`)}</span>
        </div>

        <h3 className="mb-2 font-display text-xl font-bold text-gray-900">
          {t(`download.${platformKey}.store`)}
        </h3>
        <p className="max-w-xs text-sm text-gray-500">
          {t(`download.${platformKey}.storeDescription`)}
        </p>

        <button
          disabled
          aria-label={t(`download.${platformKey}.comingSoonAriaLabel`)}
          className={`mt-5 flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-full border-2 ${accentColor === 'green' ? 'border-green-200 bg-green-50 text-green-600' : 'border-blue-200 bg-blue-50 text-blue-600'} px-6 py-3 text-sm font-semibold opacity-60`}
        >
          {t('download.comingSoon')}
        </button>
      </div>
    </div>
  )
}

export default function DownloadPage() {
  const { t } = useTranslation()
  const ref = useRef<HTMLElement>(null)
  const isVisible = useIntersectionObserver(ref, { threshold: 0.05 })

  return (
    <section
      ref={ref}
      className="relative min-h-screen overflow-hidden bg-gradient-to-b from-white via-blue-50/30 to-white"
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-blue-100/30 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-80 w-80 rounded-full bg-green-100/30 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-24">
        <div
          className="mb-20 text-center transition-all duration-700"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
          }}
        >
          <span className="mb-4 inline-block rounded-full bg-blue-100 px-4 py-1.5 text-sm font-semibold text-blue-700">
            {t('download.label')}
          </span>
          <h1 className="mb-6 font-display text-5xl font-bold text-gray-900 sm:text-6xl">
            {t('download.heading')}{' '}
            <span className="text-blue-600">{t('download.headingHighlight')}</span>
          </h1>
          <p className="mx-auto max-w-xl text-xl text-gray-600">{t('download.description')}</p>
        </div>

        <div
          className="mx-auto grid max-w-4xl gap-16 sm:grid-cols-2"
          aria-label="App download options"
        >
          <PlatformCard platform="android" delay={0} isVisible={isVisible} />
          <PlatformCard platform="ios" delay={150} isVisible={isVisible} />
        </div>
      </div>
    </section>
  )
}
