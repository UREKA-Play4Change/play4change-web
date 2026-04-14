import { Link } from 'react-router-dom'
import Logo from '@/ui/components/Logo'
import { ROUTES } from '@/lib/constants'

export default function HeroSection() {
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

      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-6 py-24 text-center">
        {/* Badge */}
        <div className="animate-fadeInUp delay-100 mb-6 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2">
          <span className="h-2 w-2 rounded-full bg-green-500" />
          <span className="text-sm font-medium text-blue-700">
            Final Year Project · ISEL &amp; U!REKA
          </span>
        </div>

        {/* Main logo / headline */}
        <div className="animate-fadeInUp delay-200 mb-6">
          <Logo size="xl" className="block" />
        </div>

        {/* Tagline */}
        <p className="animate-fadeInUp delay-300 mx-auto mb-10 max-w-2xl text-xl leading-relaxed text-gray-600 sm:text-2xl">
          Adaptive learning powered by AI.{' '}
          <span className="font-semibold text-gray-800">
            Gamified daily challenges for sustainability and digital literacy.
          </span>
        </p>

        {/* CTAs */}
        <div className="animate-fadeInUp delay-400 flex flex-col items-center gap-4 sm:flex-row">
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
            Get the App
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
      </div>
    </section>
  )
}
