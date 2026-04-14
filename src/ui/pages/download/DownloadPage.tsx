import { useRef } from 'react'
import { useIntersectionObserver } from '@/ui/hooks/useIntersectionObserver'

const AndroidIcon = () => (
  <svg className="h-10 w-10" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.523 15.341A5 5 0 0 0 20 11H4a5 5 0 0 0 2.477 4.341l-1.327 2.385a.5.5 0 0 0 .874.487L7.46 15.8A6.98 6.98 0 0 0 12 17a6.98 6.98 0 0 0 4.54-1.2l1.436 2.413a.5.5 0 0 0 .874-.487zM8.5 13a1 1 0 1 1 0-2 1 1 0 0 1 0 2m7 0a1 1 0 1 1 0-2 1 1 0 0 1 0 2M6.5 9.5a5.5 5.5 0 0 1 11 0H6.5z" />
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
      {/* Notch / camera area */}
      <div
        className={`absolute left-1/2 top-3 -translate-x-1/2 ${isAndroid ? 'h-2 w-8 rounded-full bg-gray-700' : 'h-6 w-20 rounded-b-2xl bg-gray-800'}`}
        aria-hidden="true"
      />

      {/* Screen content */}
      <div className="flex h-full flex-col items-center justify-center gap-3 px-4 pt-6">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-green-500" />
        <div className="h-2 w-24 rounded-full bg-gray-700" />
        <div className="h-2 w-16 rounded-full bg-gray-700" />
        <div className="mt-4 h-24 w-full rounded-xl bg-gray-800" />
        <div className="h-8 w-full rounded-lg bg-blue-600/40" />
        <div className="h-8 w-full rounded-lg bg-gray-800" />
      </div>

      {/* Home indicator */}
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
  const isAndroid = platform === 'android'
  const accentColor = isAndroid ? 'green' : 'blue'

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
          <span>{isAndroid ? 'Android' : 'iOS'}</span>
        </div>

        <div
          className={`mb-3 inline-flex items-center gap-2 rounded-full border ${isAndroid ? 'border-green-200 bg-green-50 text-green-700' : 'border-blue-200 bg-blue-50 text-blue-700'} px-3 py-1 text-xs font-bold uppercase tracking-wider`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${isAndroid ? 'bg-green-500' : 'bg-blue-500'} animate-pulse`}
          />
          Coming Soon
        </div>

        <h3 className="mb-2 font-display text-xl font-bold text-gray-900">
          {isAndroid ? 'Google Play Store' : 'Apple App Store'}
        </h3>
        <p className="max-w-xs text-sm text-gray-500">
          {isAndroid
            ? 'Available for Android 8.0 and above. Download from the Google Play Store when it launches.'
            : 'Available for iOS 15 and above. Find it on the App Store when it launches.'}
        </p>

        <button
          disabled
          aria-label={`Notify me when ${isAndroid ? 'Android' : 'iOS'} app launches`}
          className={`mt-5 flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-full border-2 ${accentColor === 'green' ? 'border-green-200 bg-green-50 text-green-600' : 'border-blue-200 bg-blue-50 text-blue-600'} px-6 py-3 text-sm font-semibold opacity-60`}
        >
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
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
          Notify me at launch
        </button>
      </div>
    </div>
  )
}

export default function DownloadPage() {
  const ref = useRef<HTMLElement>(null)
  const isVisible = useIntersectionObserver(ref, { threshold: 0.05 })

  return (
    <section
      ref={ref}
      className="relative min-h-screen overflow-hidden bg-gradient-to-b from-white via-blue-50/30 to-white"
    >
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-blue-100/30 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-80 w-80 rounded-full bg-green-100/30 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-24">
        {/* Header */}
        <div
          className="mb-20 text-center transition-all duration-700"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
          }}
        >
          <span className="mb-4 inline-block rounded-full bg-blue-100 px-4 py-1.5 text-sm font-semibold text-blue-700">
            Get the App
          </span>
          <h1 className="mb-6 font-display text-5xl font-bold text-gray-900 sm:text-6xl">
            Play4Change is <span className="text-blue-600">coming to mobile</span>
          </h1>
          <p className="mx-auto max-w-xl text-xl text-gray-600">
            We&apos;re putting the finishing touches on our mobile apps. Be the first to know when
            they launch — sign up for early access below.
          </p>
        </div>

        {/* Platform cards */}
        <div
          className="mx-auto grid max-w-4xl gap-16 sm:grid-cols-2"
          aria-label="App download options"
        >
          <PlatformCard platform="android" delay={0} isVisible={isVisible} />
          <PlatformCard platform="ios" delay={150} isVisible={isVisible} />
        </div>

        {/* Waitlist callout */}
        <div
          className="mx-auto mt-20 max-w-lg transition-all duration-700"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
            transitionDelay: '300ms',
          }}
        >
          <div className="glass-card rounded-3xl p-8 text-center shadow-sm">
            <div className="mb-3 text-4xl" aria-hidden="true">
              🚀
            </div>
            <h2 className="mb-2 font-display text-xl font-bold text-gray-900">Join the waitlist</h2>
            <p className="mb-5 text-sm text-gray-500">
              Be among the first to experience Play4Change on your mobile device.
            </p>
            <p className="text-xs font-medium text-blue-600">Waitlist registration opening soon</p>
          </div>
        </div>
      </div>
    </section>
  )
}
