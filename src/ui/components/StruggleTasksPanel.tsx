import { useTopicStruggleTasks } from '@/application/hooks/useTopics'

interface Props {
  topicId: string
}

const STATUS_BADGE: Record<string, string> = {
  OPEN: 'bg-yellow-100 text-yellow-700',
  RESOLVED: 'bg-green-100 text-green-700',
  ABANDONED: 'bg-gray-100 text-gray-500',
}

const PATTERN_LABEL: Record<string, string> = {
  WRONG_CONCEPT: 'Wrong concept',
  PARTIAL_UNDERSTANDING: 'Partial understanding',
  READING_ERROR: 'Reading error',
  TIME_PRESSURE: 'Time pressure',
}

export default function StruggleTasksPanel({ topicId }: Props) {
  const { data: tasks, isLoading, isError } = useTopicStruggleTasks(topicId)

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2].map(i => (
          <div key={i} className="h-20 animate-pulse rounded-2xl bg-gray-100" />
        ))}
      </div>
    )
  }

  if (isError) {
    return <p className="text-sm text-red-500">Failed to load struggle questions.</p>
  }

  if (!tasks || tasks.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-10 text-center">
        <p className="text-sm text-gray-400">No struggle sessions recorded for this topic yet.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {tasks.map(task => (
        <div key={task.id} className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_BADGE[task.sessionStatus] ?? 'bg-gray-100 text-gray-500'}`}
            >
              {task.sessionStatus}
            </span>
            <span className="rounded-full bg-purple-50 px-2 py-0.5 text-xs text-purple-700">
              {PATTERN_LABEL[task.errorPattern] ?? task.errorPattern}
            </span>
            {task.isCorrect !== null && (
              <span
                className={`text-xs font-medium ${task.isCorrect ? 'text-green-600' : 'text-red-500'}`}
              >
                {task.isCorrect ? '✓ Answered correctly' : '✗ Answered incorrectly'}
              </span>
            )}
          </div>
          <p className="text-sm font-medium text-gray-900">{task.title}</p>
          <p className="mt-0.5 text-xs text-gray-500 line-clamp-2">{task.description}</p>
          {task.options && (
            <ul className="mt-2 space-y-0.5">
              {task.options.map((opt, i) => (
                <li
                  key={i}
                  className={`text-xs ${i === task.correctAnswer ? 'font-semibold text-green-700' : 'text-gray-500'}`}
                >
                  {i === task.correctAnswer ? '✓ ' : '· '}
                  {opt}
                </li>
              ))}
            </ul>
          )}
          <p className="mt-2 text-xs text-gray-400">
            Session detected: {new Date(task.sessionDetectedAt).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  )
}
