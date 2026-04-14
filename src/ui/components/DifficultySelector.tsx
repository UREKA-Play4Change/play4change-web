import type { TopicDifficulty } from '@/domain/models/Topic'

const DIFFICULTIES: {
  value: TopicDifficulty
  label: string
  description: string
  color: string
}[] = [
  {
    value: 'BEGINNER',
    label: 'Beginner',
    description: 'No prior knowledge needed',
    color: 'border-green-400 bg-green-50 text-green-700',
  },
  {
    value: 'INTERMEDIATE',
    label: 'Intermediate',
    description: 'Some background helpful',
    color: 'border-orange-400 bg-orange-50 text-orange-700',
  },
  {
    value: 'ADVANCED',
    label: 'Advanced',
    description: 'Prior knowledge required',
    color: 'border-red-400 bg-red-50 text-red-700',
  },
]

interface DifficultySelectorProps {
  value: TopicDifficulty
  onChange: (difficulty: TopicDifficulty) => void
}

export default function DifficultySelector({ value, onChange }: DifficultySelectorProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-3" role="radiogroup" aria-label="Select difficulty">
      {DIFFICULTIES.map(d => (
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
          <p className="font-semibold">{d.label}</p>
          <p className="mt-0.5 text-xs opacity-80">{d.description}</p>
        </button>
      ))}
    </div>
  )
}
