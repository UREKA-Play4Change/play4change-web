import { MAX_DURATION_DAYS, MIN_DURATION_DAYS } from '@/lib/constants'

interface DurationSelectorProps {
  value: number
  onChange: (days: number) => void
}

export default function DurationSelector({ value, onChange }: DurationSelectorProps) {
  const options = Array.from(
    { length: MAX_DURATION_DAYS - MIN_DURATION_DAYS + 1 },
    (_, i) => MIN_DURATION_DAYS + i,
  )

  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Select duration in days">
      {options.map(days => (
        <button
          key={days}
          type="button"
          onClick={() => {
            onChange(days)
          }}
          aria-pressed={value === days}
          className={`h-12 w-12 rounded-xl border text-sm font-semibold transition-all ${
            value === days
              ? 'border-blue-600 bg-blue-600 text-white shadow-sm'
              : 'border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50'
          }`}
        >
          {days}d
        </button>
      ))}
    </div>
  )
}
