import { useTranslation } from 'react-i18next'
import type { LearningGraph } from '@/domain/models/Topic'

interface TopicNode {
  id: string
  title: string
  category: string
  status: string
}

interface Props {
  graph: LearningGraph
  topics: TopicNode[]
}

const STATUS_DOT: Record<string, string> = {
  ACTIVE: 'bg-green-500',
  GENERATING: 'bg-blue-500',
  PENDING: 'bg-yellow-500',
  FAILED: 'bg-red-500',
}

export default function LearningPathDagView({ graph, topics }: Props) {
  const { t } = useTranslation()
  const topicMap = new Map(topics.map(t => [t.id, t]))

  // Group: for each topic, collect what it requires (incoming prerequisites)
  const prereqsOf = new Map<string, string[]>()
  for (const edge of graph.edges) {
    const list = prereqsOf.get(edge.topicId) ?? []
    list.push(edge.prerequisiteTopicId)
    prereqsOf.set(edge.topicId, list)
  }

  interface ResolvedRow {
    topic: TopicNode
    prereqs: TopicNode[]
  }

  // Topics that appear as targets (have prerequisites), filtered to known topics
  const topicsWithPrereqs: ResolvedRow[] = [...prereqsOf.entries()].flatMap(
    ([topicId, prereqIds]) => {
      const topic = topicMap.get(topicId)
      if (!topic) return []
      const prereqs = prereqIds.map(id => topicMap.get(id)).filter((n): n is TopicNode => n != null)
      return [{ topic, prereqs }]
    },
  )

  if (graph.edges.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-10 text-center">
        <p className="text-sm text-gray-400">{t('admin.learningPaths.noEdges')}</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {topicsWithPrereqs.map(({ topic, prereqs }) => (
        <div key={topic.id} className="glass-card rounded-2xl p-5 shadow-sm">
          {/* Target topic */}
          <div className="mb-3 flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${STATUS_DOT[topic.status] ?? 'bg-gray-400'}`} />
            <span className="font-display text-sm font-semibold text-gray-900">{topic.title}</span>
            <span className="text-xs text-gray-400">·</span>
            <span className="text-xs text-gray-400">{topic.category}</span>
          </div>

          {/* Arrow + prerequisites */}
          <div className="ml-4 flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-gray-400">
              {t('admin.learningPaths.requires')}
            </span>
            {prereqs.map(p => (
              <span
                key={p.id}
                className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700"
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[p.status] ?? 'bg-gray-400'}`}
                />
                {p.title}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
