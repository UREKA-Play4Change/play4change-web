import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { useIntersectionObserver } from '@/ui/hooks/useIntersectionObserver'
import { ROUTES } from '@/lib/constants'

const steps = [
  {
    step: '01',
    title: 'Educators create topics',
    description:
      'Admins upload PDF materials or provide URLs. Our AI processes the content and generates a structured learning path with daily challenges.',
  },
  {
    step: '02',
    title: 'Learners enroll & start',
    description:
      'Students discover topics, enroll in seconds, and begin receiving one challenge per day — bite-sized tasks that fit any schedule.',
  },
  {
    step: '03',
    title: 'Progress through challenges',
    description:
      'Each day brings new quizzes, reflection prompts, and peer tasks. The AI adapts difficulty based on performance to keep learners in the flow state.',
  },
  {
    step: '04',
    title: 'Earn achievements & grow',
    description:
      'Complete streaks, earn badges, and climb leaderboards. Community peer reviews build deeper understanding and collaborative learning.',
  },
]

export default function ProductSection() {
  const ref = useRef<HTMLElement>(null)
  const isVisible = useIntersectionObserver(ref, { threshold: 0.1 })

  return (
    <section ref={ref} className="bg-gradient-to-b from-blue-50/50 to-white py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div
          className="mb-16 text-center transition-all duration-700"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
          }}
        >
          <span className="mb-4 inline-block rounded-full bg-blue-100 px-4 py-1.5 text-sm font-semibold text-blue-700">
            How it works
          </span>
          <h2 className="mb-6 font-display text-4xl font-bold text-gray-900 sm:text-5xl">
            From content to knowledge in <span className="text-green-500">4 steps</span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Play4Change bridges the gap between educational content and real behavioral change —
            turning any resource into an engaging, adaptive learning journey.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <div
              key={step.step}
              className="relative transition-all duration-700"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
                transitionDelay: `${i * 120}ms`,
              }}
            >
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div
                  className="absolute left-full top-6 hidden h-0.5 w-full bg-gradient-to-r from-blue-200 to-transparent lg:block"
                  aria-hidden="true"
                />
              )}

              <div className="glass-card rounded-2xl p-6 shadow-sm">
                <span className="mb-4 inline-block font-display text-5xl font-extrabold text-blue-100">
                  {step.step}
                </span>
                <h3 className="mb-3 font-display text-lg font-bold text-gray-900">{step.title}</h3>
                <p className="text-sm leading-relaxed text-gray-600">{step.description}</p>
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
            className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-blue-200 transition-all hover:bg-blue-700 hover:-translate-y-0.5 hover:shadow-xl"
          >
            Start learning today
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
