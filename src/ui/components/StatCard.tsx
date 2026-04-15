import { useTranslation } from 'react-i18next'
import AnimatedCounter from './AnimatedCounter'

interface StatCardProps {
  label: string
  value: number
  prefix?: string
  suffix?: string
  icon?: React.ReactNode
  trend?: number
}

export default function StatCard({ label, value, prefix, suffix, icon, trend }: StatCardProps) {
  const { t } = useTranslation()

  return (
    <div className="glass-card flex flex-col gap-3 rounded-2xl p-6 shadow-sm">
      {icon && (
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          {icon}
        </div>
      )}
      <AnimatedCounter
        target={value}
        prefix={prefix}
        suffix={suffix}
        className="font-display text-4xl font-bold text-gray-900"
      />
      <p className="text-sm font-medium text-gray-500">{label}</p>
      {trend !== undefined && (
        <p className={`text-xs font-semibold ${trend >= 0 ? 'text-green-600' : 'text-red-500'}`}>
          {trend >= 0
            ? t('components.statCard.trendPositive', { value: trend })
            : t('components.statCard.trendNegative', { value: trend })}
        </p>
      )}
    </div>
  )
}
