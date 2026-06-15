import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useTopics } from '@/application/hooks/useTopics'
import { useAllTopicBadgeStats } from '@/application/hooks/useTopics'
import type { Topic } from '@/domain/models/Topic'

const PAGE_SIZE = 5

export default function BadgeOverviewPage() {
  const { t } = useTranslation()
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null)
  const [topicPage, setTopicPage] = useState(0)

  const {
    data: topicsData,
    isPending: topicsPending,
    isError: topicsError,
  } = useTopics(undefined, topicPage, PAGE_SIZE)

  const topics = topicsData?.content ?? []
  const totalPages = topicsData?.totalPages ?? 0

  const topicIds = topics.map((t: Topic) => t.id)
  const { data: badgeStats, isPending: statsPending } = useAllTopicBadgeStats(topicIds)

  if (topicsPending || (topicIds.length > 0 && statsPending)) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    )
  }

  if (topicsError) {
    return (
      <p className="text-sm text-red-600" role="alert">
        {t('admin.badges.loadError')}
      </p>
    )
  }

  const rows = topics.map((topic: Topic) => {
    const stats = badgeStats?.find(s => s.topicId === topic.id)
    return { topic, stats }
  })

  const selectedRow = rows.find(r => r.topic.id === selectedTopicId)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-gray-900">
          {t('admin.badges.heading')}
        </h1>
        <p className="mt-1 text-sm text-gray-500">{t('admin.badges.subtitle')}</p>
      </div>

      <div className="flex gap-6">
        <div className="flex-1 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-100 bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left font-medium text-gray-500">
                  {t('admin.badges.colTopic')}
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-500">
                  {t('admin.badges.colIssued')}
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-500">
                  {t('admin.badges.colEnrolled')}
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-500">
                  {t('admin.badges.colEarned')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.map(({ topic, stats }) => (
                <tr
                  key={topic.id}
                  className="cursor-pointer transition-colors hover:bg-gray-50"
                  onClick={() => {
                    setSelectedTopicId(prev => (prev === topic.id ? null : topic.id))
                  }}
                  aria-selected={selectedTopicId === topic.id}
                >
                  <td className="px-6 py-4 font-medium text-gray-900">{topic.title}</td>
                  <td className="px-6 py-4 text-gray-500">{stats?.totalIssued ?? '—'}</td>
                  <td className="px-6 py-4 text-gray-500">{stats?.enrolledCount ?? '—'}</td>
                  <td className="px-6 py-4">
                    {stats == null ? (
                      <span className="text-gray-400">—</span>
                    ) : stats.earnedPercentage === 0 ? (
                      <span className="text-gray-400 italic">{t('admin.badges.noEarners')}</span>
                    ) : (
                      <span className="font-medium text-green-700">
                        {stats.earnedPercentage.toFixed(1)}%
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selectedRow && (
          <div className="w-80 shrink-0 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="font-display text-base font-semibold text-gray-900">
              {selectedRow.topic.title}
            </h2>
            <p className="mt-1 text-xs text-gray-500">{t('admin.badges.recentEarnersHeading')}</p>
            <ul className="mt-4 space-y-2">
              {selectedRow.stats?.recentEarners.length === 0 ? (
                <li className="text-sm text-gray-400">{t('admin.badges.noRecentEarners')}</li>
              ) : (
                selectedRow.stats?.recentEarners.map(earner => (
                  <li key={`${earner.userId}-${earner.earnedAt}`} className="text-sm">
                    <span className="font-medium text-gray-700">{earner.userId}</span>
                    <span className="ml-2 text-gray-400">
                      {new Date(earner.earnedAt).toLocaleDateString()}
                    </span>
                  </li>
                ))
              )}
            </ul>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div
          className="flex items-center justify-between"
          role="navigation"
          aria-label={t('admin.badges.paginationAriaLabel')}
        >
          <button
            onClick={() => {
              setTopicPage(p => Math.max(0, p - 1))
            }}
            disabled={topicPage === 0}
            className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-40"
          >
            {t('admin.users.prevPage')}
          </button>
          <span className="text-sm text-gray-500">
            {t('admin.users.pageOf', { current: topicPage + 1, total: totalPages })}
          </span>
          <button
            onClick={() => {
              setTopicPage(p => Math.min(totalPages - 1, p + 1))
            }}
            disabled={topicPage >= totalPages - 1}
            className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-40"
          >
            {t('admin.users.nextPage')}
          </button>
        </div>
      )}
    </div>
  )
}
