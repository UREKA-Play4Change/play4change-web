import { useRef } from 'react'
import { useIntersectionObserver } from '@/ui/hooks/useIntersectionObserver'
import { usePlatformStats } from '@/application/hooks/useStats'
import StatCard from '@/ui/components/StatCard'

const UsersIcon = () => (
  <svg
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
    />
  </svg>
)

const TopicsIcon = () => (
  <svg
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
    />
  </svg>
)

const TasksIcon = () => (
  <svg
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
)

export default function StatsSection() {
  const ref = useRef<HTMLElement>(null)
  const isVisible = useIntersectionObserver(ref, { threshold: 0.2 })
  const { data: stats, isLoading } = usePlatformStats()

  const statItems = [
    {
      label: 'Learners worldwide',
      value: stats?.totalUsers ?? 0,
      icon: <UsersIcon />,
    },
    {
      label: 'Active topics',
      value: stats?.activeTopics ?? 0,
      icon: <TopicsIcon />,
    },
    {
      label: 'Tasks completed',
      value: stats?.tasksCompleted ?? 0,
      icon: <TasksIcon />,
    },
  ]

  return (
    <section ref={ref} className="bg-white py-24" aria-label="Platform statistics">
      <div className="mx-auto max-w-7xl px-6">
        <div
          className="mb-12 text-center transition-all duration-700"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
          }}
        >
          <span className="mb-4 inline-block rounded-full bg-green-100 px-4 py-1.5 text-sm font-semibold text-green-700">
            Live Stats
          </span>
          <h2 className="font-display text-4xl font-bold text-gray-900 sm:text-5xl">
            Join a growing community
          </h2>
        </div>

        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-40 animate-pulse rounded-2xl bg-gray-100" />
            ))}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-3">
            {statItems.map((stat, i) => (
              <div
                key={stat.label}
                className="transition-all duration-700"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
                  transitionDelay: `${i * 150}ms`,
                }}
              >
                <StatCard label={stat.label} value={stat.value} icon={stat.icon} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
