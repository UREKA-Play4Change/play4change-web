import { useTranslation } from 'react-i18next'
import type { TopicDifficulty } from '@/domain/models/Topic'

const DIFFICULTY_STYLES: { value: TopicDifficulty; color: string }[] = [
  { value: 'BEGINNER', color: 'border-green-400 bg-green-50 text-green-700' },
  { value: 'INTERMEDIATE', color: 'border-orange-400 bg-orange-50 text-orange-700' },
  { value: 'ADVANCED', color: 'border-red-400 bg-red-50 text-red-700' },
]

const DIFFICULTY_KEYS = {
  BEGINNER: 'components.difficulty.beginner',
  INTERMEDIATE: 'components.difficulty.intermediate',
  ADVANCED: 'components.difficulty.advanced',
} as const

interface DifficultySelectorProps {
  value: TopicDifficulty
  onChange: (difficulty: TopicDifficulty) => void
}

export default function DifficultySelector({ value, onChange }: DifficultySelectorProps) {
  const { t } = useTranslation()

  return (
    <div
      className="grid gap-3 sm:grid-cols-3"
      role="radiogroup"
      aria-label={t('components.difficulty.ariaLabel')}
    >
      {DIFFICULTY_STYLES.map(d => (
        <button
          key={d.value}
          type="button"
          role="radio"
          aria-checked={value === d.value}
          onClick={() => {
            onChange(d.value)
          }}
          className={`rounded-2xl border-2 p-4 text-left transition-all ${
            value === d.value
              ? `${d.color} shadow-sm`
              : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
          }`}
        >
          <p className="font-semibold">{t(`${DIFFICULTY_KEYS[d.value]}.label`)}</p>
          <p className="mt-0.5 text-xs opacity-80">
            {t(`${DIFFICULTY_KEYS[d.value]}.description`)}
          </p>
        </button>
      ))}
    </div>
  )
}
