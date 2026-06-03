import { useState } from 'react'
import { toast } from 'sonner'
import { useTopicStruggleTasks, useUpdateAdaptiveTask } from '@/application/hooks/useTopics'
import type { AdaptiveTaskAdmin, UpdateTaskRequest } from '@/domain/models/Topic'
import EditTaskModal from './EditTaskModal'

interface Props {
  topicId: string
}

const PATTERN_LABEL: Record<string, string> = {
  WRONG_CONCEPT: 'Wrong concept',
  PARTIAL_UNDERSTANDING: 'Partial understanding',
  READING_ERROR: 'Reading error',
  TIME_PRESSURE: 'Time pressure',
}

const PATTERN_COLOR: Record<string, string> = {
  WRONG_CONCEPT: 'bg-red-50 text-red-700',
  PARTIAL_UNDERSTANDING: 'bg-orange-50 text-orange-700',
  READING_ERROR: 'bg-yellow-50 text-yellow-700',
  TIME_PRESSURE: 'bg-blue-50 text-blue-700',
}

interface PathGroup {
  originalTaskTemplateId: string
  originalTaskTitle: string
  errorPattern: AdaptiveTaskAdmin['errorPattern']
  tasks: AdaptiveTaskAdmin[]
}

function groupIntoPaths(tasks: AdaptiveTaskAdmin[]): PathGroup[] {
  const map = new Map<string, PathGroup>()
  for (const task of tasks) {
    const key = `${task.originalTaskTemplateId}::${task.errorPattern}`
    if (!map.has(key)) {
      map.set(key, {
        originalTaskTemplateId: task.originalTaskTemplateId,
        originalTaskTitle: task.originalTaskTitle,
        errorPattern: task.errorPattern,
        tasks: [],
      })
    }
    const group = map.get(key)
    if (group) group.tasks.push(task)
  }
  return Array.from(map.values())
}

export default function StruggleTasksPanel({ topicId }: Props) {
  const { data: tasks, isLoading, isError } = useTopicStruggleTasks(topicId)
  const updateAdaptiveTask = useUpdateAdaptiveTask(topicId)
  const [editing, setEditing] = useState<AdaptiveTaskAdmin | null>(null)
  const [expanded, setExpanded] = useState<Set<string>>(new Set())

  function toggleGroup(key: string) {
    setExpanded(prev => {
      const next = new Set(prev)
      if (next.has(key)) {
        next.delete(key)
      } else {
        next.add(key)
      }
      return next
    })
  }

  function handleSave(request: UpdateTaskRequest) {
    if (!editing) return
    updateAdaptiveTask.mutate(
      { taskId: editing.id, request },
      {
        onSuccess: () => {
          toast.success('Adaptive task updated')
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
    return <p className="text-sm text-red-500">Failed to load adaptive paths.</p>
  }

  if (!tasks || tasks.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-10 text-center">
        <p className="text-sm text-gray-400">No adaptive paths generated for this topic yet.</p>
      </div>
    )
  }

  const groups = groupIntoPaths(tasks)

  return (
    <>
      <div className="space-y-4">
        {groups.map(group => {
          const key = `${group.originalTaskTemplateId}::${group.errorPattern}`
          const isOpen = expanded.has(key)
          return (
            <div key={key} className="rounded-2xl border border-gray-100 bg-white shadow-sm">
              {/* Group header — triggering question + struggle type */}
              <button
                className="flex w-full items-start justify-between gap-4 p-4 text-left"
                onClick={() => {
                  toggleGroup(key)
                }}
              >
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${PATTERN_COLOR[group.errorPattern] ?? 'bg-gray-100 text-gray-600'}`}
                    >
                      {PATTERN_LABEL[group.errorPattern] ?? group.errorPattern}
                    </span>
                    <span className="text-xs text-gray-400">
                      {group.tasks.length} adaptive task{group.tasks.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">
                    Triggered by: {group.originalTaskTitle}
                  </p>
                </div>
                <svg
                  className={`mt-0.5 h-4 w-4 shrink-0 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Adaptive tasks inside */}
              {isOpen && (
                <div className="border-t border-gray-100 px-4 pb-4 pt-3 space-y-3">
                  {group.tasks.map(task => (
                    <div
                      key={task.id}
                      className="flex items-start justify-between gap-4 rounded-xl border border-gray-100 bg-gray-50 p-3"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="mb-1 flex flex-wrap items-center gap-2">
                          <span className="text-xs text-gray-400">Task {task.orderIndex + 1}</span>
                          {task.isCorrect !== null && (
                            <span
                              className={`text-xs font-medium ${task.isCorrect ? 'text-green-600' : 'text-red-500'}`}
                            >
                              {task.isCorrect ? '✓ Correct' : '✗ Incorrect'}
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
                        className="shrink-0 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-white"
                      >
                        Edit
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {editing && (
        <EditTaskModal
          template={{
            id: editing.id,
            title: editing.title,
            description: editing.description,
            hint: editing.hint,
            options: editing.options,
            correctAnswer: editing.correctAnswer,
            taskType: 'MULTIPLE_CHOICE',
            dayIndex: 0,
            poolIndex: 0,
            pointsReward: 0,
            version: 1,
            language: '',
            createdAt: '',
            stats: { totalAttempts: 0, successCount: 0, successRate: 0, avgPointsAwarded: 0 },
          }}
          onSave={handleSave}
          onClose={() => {
            setEditing(null)
          }}
          isSaving={updateAdaptiveTask.isPending}
        />
      )}
    </>
  )
}
