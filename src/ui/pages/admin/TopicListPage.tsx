import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useTopics } from '@/application/hooks/useTopics'
import type { TopicStatus } from '@/domain/models/Topic'
import TopicCard from '@/ui/components/TopicCard'
import ErrorState from '@/ui/components/ErrorState'
import { ROUTES } from '@/lib/constants'

const STATUS_FILTER_VALUES: { labelKey: string; value: TopicStatus | 'ALL' }[] = [
  { labelKey: 'admin.topicList.filters.all', value: 'ALL' },
  { labelKey: 'admin.topicList.filters.active', value: 'ACTIVE' },
  { labelKey: 'admin.topicList.filters.generating', value: 'GENERATING' },
  { labelKey: 'admin.topicList.filters.pending', value: 'PENDING' },
  { labelKey: 'admin.topicList.filters.failed', value: 'FAILED' },
]

const STATUS_CHIP_COLOR: Record<TopicStatus | 'ALL', string> = {
  ALL: 'bg-gray-100 text-gray-600',
  ACTIVE: 'bg-green-100 text-green-700',
  GENERATING: 'bg-blue-100 text-blue-700',
  PENDING: 'bg-yellow-100 text-yellow-700',
  FAILED: 'bg-red-100 text-red-700',
}

export default function TopicListPage() {
  const { t } = useTranslation()
  const [statusFilter, setStatusFilter] = useState<TopicStatus | 'ALL'>('ALL')
  const { data: rawTopics, isLoading, isError, refetch } = useTopics()
  const allTopics = Array.isArray(rawTopics) ? rawTopics : []

  if (isError) return <ErrorState onRetry={() => void refetch()} />

  const topics =
    statusFilter === 'ALL' ? allTopics : allTopics.filter(topic => topic.status === statusFilter)

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">
            {t('admin.topicList.heading')}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {t('admin.topicList.topicsTotal', { count: allTopics.length })}
          </p>
        </div>
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
          {t('admin.topicList.newTopic')}
        </Link>
      </div>

      <div
        className="flex flex-wrap gap-2"
        role="group"
        aria-label={t('admin.topicList.filterAriaLabel')}
      >
        {STATUS_FILTER_VALUES.map(f => {
          const count =
            f.value === 'ALL'
              ? allTopics.length
              : allTopics.filter(t => t.status === f.value).length
          const active = statusFilter === f.value
          return (
            <button
              key={f.value}
              onClick={() => {
                setStatusFilter(f.value)
              }}
              aria-pressed={active}
              className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                active
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {t(f.labelKey)}
              <span
                className={`rounded-full px-1.5 py-0.5 text-xs font-semibold leading-none ${
                  active ? 'bg-white/20 text-white' : STATUS_CHIP_COLOR[f.value]
                }`}
              >
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-52 animate-pulse rounded-2xl bg-gray-100" />
          ))}
        </div>
      ) : topics.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-16 text-center">
          <p className="text-gray-500">
            {t('admin.topicList.noTopicsFound', {
              filter: statusFilter !== 'ALL' ? `${statusFilter.toLowerCase()} ` : '',
            })}
          </p>
          {statusFilter === 'ALL' && (
            <Link
              to={ROUTES.ADMIN_CREATE_TOPIC}
              className="mt-2 inline-block text-sm font-medium text-blue-600 hover:underline"
            >
              {t('admin.topicList.createFirst')}
            </Link>
          )}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {topics.map(topic => (
            <TopicCard key={topic.id} topic={topic} />
          ))}
        </div>
      )}
    </div>
  )
}
