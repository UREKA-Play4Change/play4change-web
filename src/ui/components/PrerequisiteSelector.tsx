import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import {
  useTopics,
  useTopicPrerequisites,
  useSetPrerequisites,
} from '@/application/hooks/useTopics'
import type { PrerequisiteTopic } from '@/domain/models/Topic'

interface Props {
  topicId: string
}

export default function PrerequisiteSelector({ topicId }: Props) {
  const { t } = useTranslation()
  const { data: topicsData } = useTopics(undefined, 0, 500)
  const { data: currentPrereqs = [], isLoading } = useTopicPrerequisites(topicId)
  const setPrereqs = useSetPrerequisites(topicId)

  const allTopics = topicsData?.content ?? []
  const [selected, setSelected] = useState<string[] | null>(null)
  const workingSelection = selected ?? currentPrereqs.map(p => p.id)

  const candidates = allTopics.filter(t => t.id !== topicId && t.status === 'ACTIVE')

  function toggle(id: string) {
    setSelected(prev => {
      const base = prev ?? currentPrereqs.map(p => p.id)
      return base.includes(id) ? base.filter(x => x !== id) : [...base, id]
    })
  }

  function handleSave() {
    setPrereqs.mutate(workingSelection, {
      onSuccess: () => {
        toast.success(t('admin.prerequisites.saved'))
        setSelected(null)
      },
      onError: () => {
        toast.error(t('admin.prerequisites.saveError'))
      },
    })
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-12 animate-pulse rounded-xl bg-gray-100" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="mb-1 font-display text-sm font-semibold text-gray-700">
          {t('admin.prerequisites.heading')}
        </h3>
        <p className="text-xs text-gray-400">{t('admin.prerequisites.subheading')}</p>
      </div>

      {candidates.length === 0 ? (
        <p className="text-sm text-gray-400">{t('admin.prerequisites.noTopics')}</p>
      ) : (
        <ul className="space-y-2">
          {candidates.map(topic => {
            const checked = workingSelection.includes(topic.id)
            return (
              <li key={topic.id}>
                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-100 bg-white p-3 hover:border-blue-200 hover:bg-blue-50/40 transition-colors">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => {
                      toggle(topic.id)
                    }}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-900">{topic.title}</p>
                    <p className="text-xs text-gray-400">{topic.category}</p>
                  </div>
                </label>
              </li>
            )
          })}
        </ul>
      )}

      {selected !== null && (
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={handleSave}
            disabled={setPrereqs.isPending}
            className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50"
          >
            {setPrereqs.isPending ? t('admin.prerequisites.saving') : t('admin.prerequisites.save')}
          </button>
          <button
            onClick={() => {
              setSelected(null)
            }}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            {t('common.cancel')}
          </button>
        </div>
      )}

      {currentPrereqs.length > 0 && selected === null && (
        <div className="rounded-xl border border-green-100 bg-green-50 p-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-green-700">
            {t('admin.prerequisites.current')}
          </p>
          <ul className="space-y-1">
            {currentPrereqs.map((p: PrerequisiteTopic) => (
              <li key={p.id} className="text-sm text-green-800">
                {p.title}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
