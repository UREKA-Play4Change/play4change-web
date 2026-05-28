import { useState, useEffect } from 'react'
import type { TaskTemplate, UpdateTaskRequest } from '@/domain/models/Topic'

interface Props {
  template: TaskTemplate
  onSave: (request: UpdateTaskRequest) => void
  onClose: () => void
  isSaving: boolean
}

export default function EditTaskModal({ template, onSave, onClose, isSaving }: Props) {
  const [title, setTitle] = useState(template.title)
  const [description, setDescription] = useState(template.description)
  const [hint, setHint] = useState(template.hint ?? '')
  const [options, setOptions] = useState<string[]>(template.options ?? ['', '', '', ''])
  const [correctAnswer, setCorrectAnswer] = useState<number>(template.correctAnswer ?? 0)

  useEffect(() => {
    setTitle(template.title)
    setDescription(template.description)
    setHint(template.hint ?? '')
    setOptions(template.options ?? ['', '', '', ''])
    setCorrectAnswer(template.correctAnswer ?? 0)
  }, [template])

  function handleOptionChange(idx: number, value: string) {
    setOptions(prev => prev.map((o, i) => (i === idx ? value : o)))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSave({
      title: title.trim(),
      description: description.trim(),
      hint: hint.trim() || null,
      options: template.taskType === 'MULTIPLE_CHOICE' ? options.map(o => o.trim()) : null,
      correctAnswer: template.taskType === 'MULTIPLE_CHOICE' ? correctAnswer : null,
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 className="font-display text-base font-semibold text-gray-900">Edit Question</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            aria-label="Close"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Question title</label>
            <input
              value={title}
              onChange={e => {
                setTitle(e.target.value)
              }}
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-800 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-200"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">
              Description / context
            </label>
            <textarea
              value={description}
              onChange={e => {
                setDescription(e.target.value)
              }}
              rows={3}
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-800 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-200"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Hint (optional)</label>
            <input
              value={hint}
              onChange={e => {
                setHint(e.target.value)
              }}
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-800 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-200"
            />
          </div>

          {template.taskType === 'MULTIPLE_CHOICE' && (
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Answer options</label>
              <div className="space-y-2">
                {options.map((opt, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="correct"
                      checked={correctAnswer === idx}
                      onChange={() => {
                        setCorrectAnswer(idx)
                      }}
                      className="h-4 w-4 text-blue-600"
                      title={`Mark option ${idx + 1} as correct`}
                    />
                    <input
                      value={opt}
                      onChange={e => {
                        handleOptionChange(idx, e.target.value)
                      }}
                      placeholder={`Option ${idx + 1}`}
                      className="flex-1 rounded-xl border border-gray-200 px-3 py-1.5 text-sm text-gray-800 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-200"
                      required
                    />
                    {correctAnswer === idx && (
                      <span className="text-xs font-medium text-green-600">Correct</span>
                    )}
                  </div>
                ))}
              </div>
              <p className="mt-1 text-xs text-gray-400">
                Select the radio button next to the correct answer.
              </p>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {isSaving ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
