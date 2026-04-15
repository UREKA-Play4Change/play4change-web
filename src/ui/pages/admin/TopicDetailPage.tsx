import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useTopic, useRegenerateTopic } from '@/application/hooks/useTopics'
import { formatDate, formatPercentage, formatScore } from '@/lib/formatters'
import { ROUTES } from '@/lib/constants'
import type { TopicStats } from '@/domain/models/Topic'

interface StatCardProps {
  label: string
  value: string | number
  sub?: string
}

function StatCard({ label, value, sub }: StatCardProps) {
  return (
    <div className="glass-card rounded-2xl p-5 shadow-sm">
      <p className="mb-1 text-xs font-medium uppercase tracking-wider text-gray-400">{label}</p>
      <p className="font-display text-2xl font-bold text-gray-900">{value}</p>
      {sub && <p className="mt-0.5 text-xs text-gray-400">{sub}</p>}
    </div>
  )
}

const STATUS_STYLES: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  GENERATING: 'bg-blue-100 text-blue-700',
  ACTIVE: 'bg-green-100 text-green-700',
  FAILED: 'bg-red-100 text-red-700',
}

function StatsGrid({ stats, t }: { stats: TopicStats; t: (key: string) => string }) {
  const knownKeys = ['enrolledUsers', 'completionRate', 'averageScore', 'activeUsers']
  const extraKeys = Object.keys(stats).filter(k => !knownKeys.includes(k))

  return (
    <>
      <StatCard label={t('admin.topicDetail.enrolledUsers')} value={stats.enrolledUsers} />
      <StatCard
        label={t('admin.topicDetail.completionRate')}
        value={formatPercentage(stats.completionRate)}
        sub={t('admin.topicDetail.ofEnrolledUsers')}
      />
      <StatCard
        label={t('admin.topicDetail.averageScore')}
        value={formatScore(stats.averageScore)}
      />
      <StatCard
        label={t('admin.topicDetail.activeUsers')}
        value={stats.activeUsers}
        sub={t('admin.topicDetail.currentlyLearning')}
      />
      {extraKeys.map(key => (
        <StatCard key={key} label={key.replace(/([A-Z])/g, ' $1').trim()} value={stats[key]} />
      ))}
    </>
  )
}

export default function TopicDetailPage() {
  const { t } = useTranslation()
  const { id } = useParams<{ id: string }>()
  const { data: topic, isLoading, isError } = useTopic(id ?? '')
  const regenerate = useRegenerateTopic()

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-64 animate-pulse rounded-xl bg-gray-100" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-28 animate-pulse rounded-2xl bg-gray-100" />
          ))}
        </div>
      </div>
    )
  }

  if (isError || !topic) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">{t('admin.topicDetail.notFound')}</p>
        <Link
          to={ROUTES.ADMIN_TOPICS}
          className="mt-2 inline-block text-sm font-medium text-blue-600 hover:underline"
        >
          {t('admin.topicDetail.backToTopics')}
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-gray-400">
        <Link to={ROUTES.ADMIN_TOPICS} className="hover:text-blue-600">
          {t('admin.topicDetail.breadcrumbTopics')}
        </Link>
        <span aria-hidden="true">/</span>
        <span className="text-gray-700">{topic.title}</span>
      </nav>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_STYLES[topic.status] ?? 'bg-gray-100 text-gray-600'}`}
            >
              {topic.status}
            </span>
            <span className="text-xs text-gray-400">{topic.category}</span>
            <span className="text-xs text-gray-400">·</span>
            <span className="text-xs text-gray-400">
              {topic.durationDays} {t('admin.topicDetail.daysUnit')}
            </span>
            <span className="text-xs text-gray-400">·</span>
            <span className="text-xs text-gray-400">
              {topic.difficulty.charAt(0) + topic.difficulty.slice(1).toLowerCase()}
            </span>
          </div>
          <h1 className="font-display text-2xl font-bold text-gray-900">{topic.title}</h1>
          <p className="mt-2 max-w-2xl text-sm text-gray-500">{topic.description}</p>
          <p className="mt-2 text-xs text-gray-400">{formatDate(topic.createdAt)}</p>
        </div>

        <button
          onClick={() => {
            regenerate.mutate(topic.id)
          }}
          disabled={regenerate.isPending || topic.status === 'GENERATING'}
          className="shrink-0 flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
            />
          </svg>
          {regenerate.isPending
            ? t('admin.topicDetail.regenerating')
            : t('admin.topicDetail.regenerate')}
        </button>
      </div>

      {topic.status === 'ACTIVE' ? (
        <div>
          <h2 className="mb-4 font-display text-lg font-semibold text-gray-900">
            {t('admin.topicDetail.statsHeading')}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatsGrid stats={topic.stats} t={t} />
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-10 text-center">
          <p className="text-gray-400">{t('admin.topicDetail.statsNotAvailable')}</p>
        </div>
      )}
    </div>
  )
}
