import { useState } from 'react'
import { toast } from 'sonner'
import { useTopicTasks, useUpdateTask } from '@/application/hooks/useTopics'
import type { TaskTemplate, UpdateTaskRequest } from '@/domain/models/Topic'
import EditTaskModal from './EditTaskModal'

interface Props {
  topicId: string
}

function successBadge(rate: number) {
  if (rate >= 0.8) return 'bg-green-100 text-green-700'
  if (rate >= 0.5) return 'bg-yellow-100 text-yellow-700'
  return 'bg-red-100 text-red-700'
}

export default function TaskQuestionsPanel({ topicId }: Props) {
  const { data: tasks, isLoading, isError } = useTopicTasks(topicId)
  const updateTask = useUpdateTask(topicId)
  const [editing, setEditing] = useState<TaskTemplate | null>(null)

  function handleSave(request: UpdateTaskRequest) {
    if (!editing) return
    updateTask.mutate(
      { templateId: editing.id, request },
      {
        onSuccess: () => {
          toast.success('Question updated')
          setEditing(null)
        },
        onError: () => toast.error('Failed to save changes'),
      },
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-20 animate-pulse rounded-2xl bg-gray-100" />
        ))}
      </div>
    )
  }

  if (isError) {
    return <p className="text-sm text-red-500">Failed to load questions.</p>
  }

  if (!tasks || tasks.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-10 text-center">
        <p className="text-sm text-gray-400">No questions generated yet for this topic.</p>
      </div>
    )
  }

  const byDay = tasks.reduce<Record<number, TaskTemplate[]>>((acc, t) => {
    const day = t.dayIndex + 1
    acc[day] = [...(acc[day] ?? []), t]
    return acc
  }, {})

  return (
    <>
      <div className="space-y-6">
        {Object.entries(byDay)
          .sort(([a], [b]) => Number(a) - Number(b))
          .map(([day, dayTasks]) => (
            <div key={day}>
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                Day {day}
              </h3>
              <div className="space-y-2">
                {dayTasks.map(task => (
                  <div
                    key={task.id}
                    className="flex items-start justify-between gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex flex-wrap items-center gap-2">
                        <span className="text-xs text-gray-400">
                          {task.taskType === 'MULTIPLE_CHOICE' ? 'MCQ' : 'Action'} · v{task.version}
                        </span>
                        {task.stats.totalAttempts > 0 && (
                          <span
                            className={`rounded-full px-2 py-0.5 text-xs font-medium ${successBadge(task.stats.successRate)}`}
                          >
                            {Math.round(task.stats.successRate * 100)}% success
                          </span>
                        )}
                        {task.stats.totalAttempts > 0 && (
                          <span className="text-xs text-gray-400">
                            {task.stats.totalAttempts} attempts
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-medium text-gray-900">{task.title}</p>
                      <p className="mt-0.5 text-xs text-gray-500 line-clamp-2">
                        {task.description}
                      </p>
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
                    </div>
                    <button
                      onClick={() => {
                        setEditing(task)
                      }}
                      className="shrink-0 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
                    >
                      Edit
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
      </div>

      {editing && (
        <EditTaskModal
          template={editing}
          onSave={handleSave}
          onClose={() => {
            setEditing(null)
          }}
          isSaving={updateTask.isPending}
        />
      )}
    </>
  )
}
