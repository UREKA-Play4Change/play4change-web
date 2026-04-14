import { Link } from 'react-router-dom'
import type { Topic } from '@/domain/models/Topic'
import { formatDate, formatPercentage, formatScore } from '@/lib/formatters'
import { ROUTES } from '@/lib/constants'

const STATUS_STYLES: Record<Topic['status'], string> = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  GENERATING: 'bg-blue-100 text-blue-700',
  ACTIVE: 'bg-green-100 text-green-700',
  FAILED: 'bg-red-100 text-red-700',
}

const DIFFICULTY_STYLES: Record<Topic['difficulty'], string> = {
  BEGINNER: 'bg-green-50 text-green-600 border-green-200',
  INTERMEDIATE: 'bg-orange-50 text-orange-600 border-orange-200',
  ADVANCED: 'bg-red-50 text-red-600 border-red-200',
}

interface TopicCardProps {
  topic: Topic
}

export default function TopicCard({ topic }: TopicCardProps) {
  const detailPath = ROUTES.ADMIN_TOPIC_DETAIL.replace(':id', topic.id)

  return (
    <Link
      to={detailPath}
      className="glass-card group block rounded-2xl p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
    >
      {/* Header row */}
      <div className="mb-3 flex items-start justify-between gap-3">
        <h3 className="font-display font-bold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {topic.title}
        </h3>
        <span
          className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_STYLES[topic.status]}`}
        >
          {topic.status}
        </span>
      </div>

      {/* Description */}
      <p className="mb-4 text-sm text-gray-500 line-clamp-2">{topic.description}</p>

      {/* Tags */}
      <div className="mb-4 flex flex-wrap gap-2">
        <span
          className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${DIFFICULTY_STYLES[topic.difficulty]}`}
        >
          {topic.difficulty.charAt(0) + topic.difficulty.slice(1).toLowerCase()}
        </span>
        <span className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-0.5 text-xs font-medium text-gray-500">
          {topic.durationDays}d
        </span>
        <span className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-0.5 text-xs font-medium text-gray-500">
          {topic.category}
        </span>
      </div>

      {/* Stats row */}
      {topic.status === 'ACTIVE' && (
        <div className="grid grid-cols-2 gap-3 border-t border-gray-100 pt-4">
          <div>
            <p className="text-xs text-gray-400">Enrolled</p>
            <p className="font-semibold text-gray-900">{topic.stats.enrolledUsers}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Completion</p>
            <p className="font-semibold text-gray-900">
              {formatPercentage(topic.stats.completionRate, 0)}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Avg Score</p>
            <p className="font-semibold text-gray-900">{formatScore(topic.stats.averageScore)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Active now</p>
            <p className="font-semibold text-gray-900">{topic.stats.activeUsers}</p>
          </div>
        </div>
      )}

      {/* Footer */}
      <p className="mt-3 text-xs text-gray-400">Created {formatDate(topic.createdAt)}</p>
    </Link>
  )
}
