import type { PhaseLogEntry } from '@/domain/models/Topic'

interface Props {
  log: PhaseLogEntry[]
}

const PHASE_LABEL: Record<string, string> = {
  INGESTION: 'Ingestion',
  ANALYSIS: 'Analysis',
  QUESTION_GENERATION: 'Question generation',
  INSTANCE_GENERATION: 'Instance generation',
  EMBEDDING: 'Embedding',
  INDEXING: 'Indexing',
  PUBLISHED: 'Published',
}

export default function GenerationLogPanel({ log }: Props) {
  if (log.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-10 text-center">
        <p className="text-sm text-gray-400">Generation log not available.</p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50">
            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
              Phase
            </th>
            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
              → To
            </th>
            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
              When
            </th>
            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-400">
              Duration
            </th>
          </tr>
        </thead>
        <tbody>
          {log.map((entry, i) => (
            <tr key={i} className="border-b border-gray-50 last:border-0">
              <td className="px-4 py-3 text-gray-600">
                {PHASE_LABEL[entry.fromPhase] ?? entry.fromPhase}
              </td>
              <td className="px-4 py-3 font-medium text-gray-900">
                {PHASE_LABEL[entry.toPhase] ?? entry.toPhase}
              </td>
              <td className="px-4 py-3 text-gray-500">
                {new Date(entry.transitionedAt).toLocaleString()}
              </td>
              <td className="px-4 py-3 text-right text-gray-500">
                {entry.durationMs >= 1000
                  ? `${(entry.durationMs / 1000).toFixed(1)}s`
                  : `${entry.durationMs}ms`}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
