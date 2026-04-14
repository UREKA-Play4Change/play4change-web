import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTopics } from '@/application/hooks/useTopics'
import type { TopicStatus } from '@/domain/models/Topic'
import TopicCard from '@/ui/components/TopicCard'
import { ROUTES } from '@/lib/constants'

const STATUS_FILTERS: { label: string; value: TopicStatus | 'ALL' }[] = [
  { label: 'All', value: 'ALL' },
  { label: 'Active', value: 'ACTIVE' },
  { label: 'Generating', value: 'GENERATING' },
  { label: 'Pending', value: 'PENDING' },
  { label: 'Failed', value: 'FAILED' },
]

export default function TopicListPage() {
  const [statusFilter, setStatusFilter] = useState<TopicStatus | 'ALL'>('ALL')
  const { data: allTopics = [], isLoading } = useTopics()

  const topics =
    statusFilter === 'ALL' ? allTopics : allTopics.filter(t => t.status === statusFilter)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">My Topics</h1>
          <p className="mt-1 text-sm text-gray-500">
            {allTopics.length} topic{allTopics.length !== 1 ? 's' : ''} total
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
          New Topic
        </Link>
      </div>

      {/* Status filter pills */}
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by status">
        {STATUS_FILTERS.map(f => (
          <button
            key={f.value}
            onClick={() => {
              setStatusFilter(f.value)
            }}
            aria-pressed={statusFilter === f.value}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              statusFilter === f.value
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-52 animate-pulse rounded-2xl bg-gray-100" />
          ))}
        </div>
      ) : topics.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-16 text-center">
          <p className="text-gray-500">
            No {statusFilter !== 'ALL' ? statusFilter.toLowerCase() : ''} topics found.
          </p>
          {statusFilter === 'ALL' && (
            <Link
              to={ROUTES.ADMIN_CREATE_TOPIC}
              className="mt-2 inline-block text-sm font-medium text-blue-600 hover:underline"
            >
              Create your first topic →
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
