import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useCurrentUser } from '@/application/hooks/useAuth'
import { useTopics } from '@/application/hooks/useTopics'
import { ROUTES } from '@/lib/constants'
import TopicCard from '@/ui/components/TopicCard'

function OverviewCard({
  label,
  value,
  sub,
  accent,
}: {
  label: string
  value: number | string
  sub?: string
  accent: 'blue' | 'green' | 'orange'
}) {
  const accentMap = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    orange: 'bg-orange-50 text-orange-600',
  }

  return (
    <div className="glass-card rounded-2xl p-6 shadow-sm">
      <p className="mb-1 text-sm font-medium text-gray-500">{label}</p>
      <p className={`font-display text-3xl font-bold ${accentMap[accent].split(' ')[1]}`}>
        {value}
      </p>
      {sub && <p className="mt-1 text-xs text-gray-400">{sub}</p>}
    </div>
  )
}

export default function DashboardPage() {
  const { t } = useTranslation()
  const { data: user } = useCurrentUser()
  const { data: rawTopics, isLoading } = useTopics()
  const topics = Array.isArray(rawTopics) ? rawTopics : []

  const totalTopics = topics.length
  const activeTopics = topics.filter(topic => topic.status === 'ACTIVE').length
  const totalEnrolled = topics.reduce((sum, topic) => sum + topic.stats.enrolledUsers, 0)

  const recentTopics = topics.slice(0, 3)

  const firstName = user?.name ? `, ${user.name.split(' ')[0]}` : ''

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-gray-900">
          {t('admin.dashboard.welcomeBack', { name: firstName })}
        </h1>
        <p className="mt-1 text-sm text-gray-500">{t('admin.dashboard.subtitle')}</p>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-28 animate-pulse rounded-2xl bg-gray-100" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-3">
          <OverviewCard
            label={t('admin.dashboard.totalTopics')}
            value={totalTopics}
            accent="blue"
          />
          <OverviewCard
            label={t('admin.dashboard.activeTopics')}
            value={activeTopics}
            sub={t('admin.dashboard.otherStates', { count: totalTopics - activeTopics })}
            accent="green"
          />
          <OverviewCard
            label={t('admin.dashboard.totalEnrolled')}
            value={totalEnrolled.toLocaleString()}
            sub={t('admin.dashboard.acrossAllTopics')}
            accent="orange"
          />
        </div>
      )}

      <div>
        <h2 className="mb-4 font-display text-lg font-semibold text-gray-900">
          {t('admin.dashboard.quickActions')}
        </h2>
        <div className="flex flex-wrap gap-3">
          <Link
            to={ROUTES.ADMIN_CREATE_TOPIC}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            {t('admin.dashboard.createNewTopic')}
          </Link>
          <Link
            to={ROUTES.ADMIN_TOPICS}
            className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
          >
            {t('admin.dashboard.viewAllTopics')}
          </Link>
        </div>
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-gray-900">
            {t('admin.dashboard.recentTopics')}
          </h2>
          <Link
            to={ROUTES.ADMIN_TOPICS}
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            {t('admin.dashboard.viewAll')}
          </Link>
        </div>

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-48 animate-pulse rounded-2xl bg-gray-100" />
            ))}
          </div>
        ) : recentTopics.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-12 text-center">
            <p className="text-gray-500">{t('admin.dashboard.noTopics')}</p>
            <Link
              to={ROUTES.ADMIN_CREATE_TOPIC}
              className="mt-2 inline-block text-sm font-medium text-blue-600 hover:underline"
            >
              {t('admin.dashboard.createFirst')}
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            {recentTopics.map(topic => (
              <TopicCard key={topic.id} topic={topic} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
