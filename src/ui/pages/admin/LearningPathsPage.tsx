import { useTranslation } from 'react-i18next'
import { useTopics, useLearningGraph } from '@/application/hooks/useTopics'
import ErrorState from '@/ui/components/ErrorState'
import LearningPathDagView from '@/ui/components/LearningPathDagView'

export default function LearningPathsPage() {
  const { t } = useTranslation()
  const { data: topics = [], isLoading: topicsLoading, isError: topicsError, refetch } = useTopics()
  const { data: graph, isLoading: graphLoading, isError: graphError } = useLearningGraph()

  const isLoading = topicsLoading || graphLoading
  const isError = topicsError || graphError

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-72 animate-pulse rounded-xl bg-gray-100" />
        {[1, 2, 3].map(i => (
          <div key={i} className="h-24 animate-pulse rounded-2xl bg-gray-100" />
        ))}
      </div>
    )
  }

  if (isError) {
    return <ErrorState onRetry={() => void refetch()} />
  }

  const totalTopics = topics.length
  const topicsWithPrereqs = graph ? new Set(graph.edges.map(e => e.topicId)).size : 0
  const totalEdges = graph?.edges.length ?? 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-gray-900">
          {t('admin.learningPaths.title')}
        </h1>
        <p className="mt-1 text-sm text-gray-500">{t('admin.learningPaths.subtitle')}</p>
      </div>

      {/* Stats row */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="glass-card rounded-2xl p-5 shadow-sm">
          <p className="mb-1 text-xs font-medium uppercase tracking-wider text-gray-400">
            {t('admin.learningPaths.totalTopics')}
          </p>
          <p className="font-display text-2xl font-bold text-gray-900">{totalTopics}</p>
        </div>
        <div className="glass-card rounded-2xl p-5 shadow-sm">
          <p className="mb-1 text-xs font-medium uppercase tracking-wider text-gray-400">
            {t('admin.learningPaths.topicsWithPrereqs')}
          </p>
          <p className="font-display text-2xl font-bold text-gray-900">{topicsWithPrereqs}</p>
        </div>
        <div className="glass-card rounded-2xl p-5 shadow-sm">
          <p className="mb-1 text-xs font-medium uppercase tracking-wider text-gray-400">
            {t('admin.learningPaths.totalEdges')}
          </p>
          <p className="font-display text-2xl font-bold text-gray-900">{totalEdges}</p>
        </div>
      </div>

      {/* Graph view */}
      <div>
        <h2 className="mb-4 font-display text-lg font-semibold text-gray-900">
          {t('admin.learningPaths.graphHeading')}
        </h2>
        {graph ? (
          <LearningPathDagView graph={graph} topics={topics} />
        ) : (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-10 text-center">
            <p className="text-sm text-gray-400">{t('admin.learningPaths.noEdges')}</p>
          </div>
        )}
      </div>

      <p className="text-xs text-gray-400">{t('admin.learningPaths.hint')}</p>
    </div>
  )
}
