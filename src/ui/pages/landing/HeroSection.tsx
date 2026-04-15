import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Logo from '@/ui/components/Logo'
import { ROUTES } from '@/lib/constants'

const features = [
  {
    label: 'AI-Generated Content',
    description:
      'Upload any PDF or URL and our AI instantly builds structured daily challenges tailored to your topic.',
    accentClass: 'bg-blue-600',
    lightBgClass: 'bg-blue-50',
    textColorClass: 'text-blue-700',
    icon: (
      <svg
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
          d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z"
        />
      </svg>
    ),
  },
  {
    label: 'Adaptive Learning',
    description:
      'Difficulty adjusts in real-time based on performance, keeping every learner in their optimal learning zone.',
    accentClass: 'bg-green-500',
    lightBgClass: 'bg-green-50',
    textColorClass: 'text-green-700',
    icon: (
      <svg
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
          d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941"
        />
      </svg>
    ),
  },
  {
    label: 'Gamification & Peer Review',
    description:
      'Streaks, badges, and leaderboards drive motivation while peer review builds deeper collaborative understanding.',
    accentClass: 'bg-blue-600',
    lightBgClass: 'bg-blue-50',
    textColorClass: 'text-blue-700',
    icon: (
      <svg
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
      </svg>
    ),
  },
  {
    label: 'Sustainability Focus',
    description:
      'Purpose-built for sustainability and digital literacy — turning daily micro-learning into lasting behavioural change.',
    accentClass: 'bg-green-500',
    lightBgClass: 'bg-green-50',
    textColorClass: 'text-green-700',
    icon: (
      <svg
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
          d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"
        />
      </svg>
    ),
  },
]

export default function HeroSection() {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex(i => (i + 1) % features.length)
    }, 3500)
    return () => {
      clearInterval(timer)
    }
  }, [])

  return (
    <section className="relative min-h-screen overflow-hidden bg-white">
      {/* Animated gradient mesh background */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse at 15% 40%, rgba(59,130,246,0.12) 0%, transparent 55%), radial-gradient(ellipse at 85% 20%, rgba(34,197,94,0.10) 0%, transparent 55%), radial-gradient(ellipse at 60% 80%, rgba(37,99,235,0.08) 0%, transparent 55%)',
        }}
      />

      {/* Floating shapes */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div
          className="absolute left-[10%] top-[20%] h-64 w-64 rounded-full bg-blue-100/40 blur-3xl"
          style={{ animation: 'float 8s ease-in-out infinite' }}
        />
        <div
          className="absolute right-[15%] top-[30%] h-48 w-48 rounded-full bg-green-100/50 blur-3xl"
          style={{ animation: 'float 10s ease-in-out infinite 2s' }}
        />
        <div
          className="absolute bottom-[20%] left-[30%] h-56 w-56 rounded-full bg-blue-50/60 blur-3xl"
          style={{ animation: 'float 12s ease-in-out infinite 4s' }}
        />
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-20px) scale(1.05); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeInUp { animation: fadeInUp 0.8s ease-out forwards; }
        .delay-100 { animation-delay: 0.1s; opacity: 0; }
        .delay-200 { animation-delay: 0.2s; opacity: 0; }
        .delay-300 { animation-delay: 0.3s; opacity: 0; }
        .delay-400 { animation-delay: 0.4s; opacity: 0; }
        .delay-500 { animation-delay: 0.5s; opacity: 0; }
      `}</style>

      <div className="relative mx-auto flex min-h-screen max-w-7xl items-center px-6 py-24">
        <div className="flex w-full flex-col items-center gap-16 lg:flex-row lg:items-center lg:gap-20">
          {/* ── Left: headline + CTA ── */}
          <div className="flex flex-1 flex-col items-center text-center lg:items-start lg:text-left">
            <div className="animate-fadeInUp delay-100 mb-6">
              <Logo size="xl" className="block" />
            </div>

            <p className="animate-fadeInUp delay-200 mb-10 max-w-lg text-xl leading-relaxed text-gray-600 sm:text-2xl">
              Adaptive learning powered by AI.{' '}
              <span className="font-semibold text-gray-800">
                Gamified daily challenges for sustainability and digital literacy.
              </span>
            </p>

            <div className="animate-fadeInUp delay-300 flex flex-col items-center gap-4 sm:flex-row lg:items-start">
              <Link
                to={ROUTES.DOWNLOAD}
                className="group flex items-center gap-3 rounded-full bg-blue-600 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-blue-200 transition-all hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-300 hover:-translate-y-0.5"
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
                Download
              </Link>
              <a
                href="#mission"
                className="flex items-center gap-2 rounded-full border border-gray-200 bg-white/80 px-8 py-4 text-base font-semibold text-gray-700 backdrop-blur-sm transition-all hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
              >
                Learn more
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

          {/* ── Right: feature carousel ── */}
          <div className="animate-fadeInUp delay-400 flex flex-1 flex-col items-center">
            {/* Card stack */}
            <div className="relative w-full max-w-md">
              {/* Decorative background cards */}
              <div
                className="absolute inset-0 rounded-2xl bg-gray-100"
                style={{ transform: 'rotate(3deg) scale(0.97)' }}
                aria-hidden="true"
              />
              <div
                className="absolute inset-0 rounded-2xl bg-gray-50"
                style={{ transform: 'rotate(1.5deg) scale(0.985)' }}
                aria-hidden="true"
              />

              {/* Feature cards */}
              <div className="relative h-64">
                {features.map((feature, i) => (
                  <div
                    key={feature.label}
                    className="glass-card absolute inset-0 rounded-2xl p-8 shadow-sm"
                    style={{
                      opacity: i === activeIndex ? 1 : 0,
                      transform: i === activeIndex ? 'translateY(0)' : 'translateY(14px)',
                      transition: 'opacity 0.5s ease, transform 0.5s ease',
                      pointerEvents: i === activeIndex ? 'auto' : 'none',
                    }}
                    aria-hidden={i !== activeIndex}
                  >
                    <div
                      className={`mb-4 inline-flex items-center justify-center rounded-xl p-3 ${feature.lightBgClass}`}
                    >
                      <span className={feature.textColorClass}>{feature.icon}</span>
                    </div>
                    <h3 className="mb-3 font-display text-xl font-bold text-gray-900">
                      {feature.label}
                    </h3>
                    <p className="text-sm leading-relaxed text-gray-600">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Progress dots */}
            <div className="mt-6 flex items-center gap-2">
              {features.map((feature, i) => (
                <button
                  key={feature.label}
                  onClick={() => {
                    setActiveIndex(i)
                  }}
                  aria-label={`Go to ${feature.label}`}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === activeIndex ? 'w-6 bg-blue-600' : 'w-2 bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="animate-fadeInUp delay-500 absolute bottom-10 left-1/2 -translate-x-1/2">
        <div
          className="flex h-10 w-6 items-start justify-center rounded-full border-2 border-gray-300 p-1"
          aria-hidden="true"
        >
          <div
            className="h-2 w-1 rounded-full bg-gray-400"
            style={{ animation: 'scrollBounce 2s ease-in-out infinite' }}
          />
        </div>
        <style>{`
          @keyframes scrollBounce {
            0%, 100% { transform: translateY(0); opacity: 1; }
            50% { transform: translateY(12px); opacity: 0.3; }
          }
        `}</style>
      </div>
    </section>
  )
}
