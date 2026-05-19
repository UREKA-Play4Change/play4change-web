import type { GenerationPhase } from '@/application/hooks/useTopicProgress'

interface TopicProgressStepperProps {
  phase: GenerationPhase | null
  tasksCompleted: number
  tasksTotal: number
  done: boolean
  failed: boolean
  failureReason: string | null
}

interface Step {
  phase: GenerationPhase
  label: string
  description: string
}

const STEPS: Step[] = [
  { phase: 'INGESTION', label: 'Ingestion', description: 'Fetching content' },
  { phase: 'ANALYSIS', label: 'Analysis', description: 'Preparing module' },
  { phase: 'GENERATION', label: 'Generation', description: 'AI generating tasks' },
  { phase: 'INDEXING', label: 'Indexing', description: 'Saving & embedding' },
  { phase: 'ACTIVE', label: 'Complete', description: 'Topic is ready' },
]

const PHASE_ORDER: Record<GenerationPhase, number> = {
  INGESTION: 0,
  ANALYSIS: 1,
  GENERATION: 2,
  INDEXING: 3,
  ACTIVE: 4,
  FAILED: 5,
}

function getStepState(
  step: Step,
  currentPhase: GenerationPhase | null,
  done: boolean,
  failed: boolean,
): 'pending' | 'active' | 'done' | 'failed' {
  if (failed && currentPhase === step.phase) return 'failed'
  if (done || (currentPhase !== null && PHASE_ORDER[currentPhase] > PHASE_ORDER[step.phase])) {
    return 'done'
  }
  if (currentPhase === step.phase) return 'active'
  return 'pending'
}

export default function TopicProgressStepper({
  phase,
  tasksCompleted,
  tasksTotal,
  done,
  failed,
  failureReason,
}: TopicProgressStepperProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="mb-5 font-display text-base font-semibold text-gray-900">Generating Topic</h3>

      <ol className="relative space-y-0">
        {STEPS.map((step, idx) => {
          const state = getStepState(step, phase, done, failed)
          const isLast = idx === STEPS.length - 1

          return (
            <li key={step.phase} className="flex gap-4">
              {/* Timeline spine */}
              <div className="flex flex-col items-center">
                <StepIcon state={state} />
                {!isLast && (
                  <div
                    className={`mt-1 w-0.5 flex-1 ${
                      state === 'done' ? 'bg-blue-500' : 'bg-gray-200'
                    }`}
                    style={{ minHeight: '2rem' }}
                  />
                )}
              </div>

              {/* Label */}
              <div className="pb-6">
                <p
                  className={`text-sm font-semibold ${
                    state === 'active'
                      ? 'text-blue-600'
                      : state === 'done'
                        ? 'text-gray-700'
                        : state === 'failed'
                          ? 'text-red-600'
                          : 'text-gray-400'
                  }`}
                >
                  {step.label}
                </p>
                <p className="mt-0.5 text-xs text-gray-400">{step.description}</p>
                {state === 'active' && step.phase === 'INDEXING' && tasksTotal > 0 && (
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>
                        {tasksCompleted} / {tasksTotal} tasks
                      </span>
                      <span>{Math.round((tasksCompleted / tasksTotal) * 100)}%</span>
                    </div>
                    <div className="h-1.5 w-48 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full bg-blue-500 transition-all duration-300"
                        style={{ width: `${(tasksCompleted / tasksTotal) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </li>
          )
        })}
      </ol>

      {failed && failureReason && (
        <p className="mt-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{failureReason}</p>
      )}
    </div>
  )
}

function StepIcon({ state }: { state: 'pending' | 'active' | 'done' | 'failed' }) {
  if (state === 'done') {
    return (
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-500">
        <svg className="h-3.5 w-3.5 text-white" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    )
  }

  if (state === 'active') {
    return (
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-blue-500 bg-white">
        <span className="h-3 w-3 animate-pulse rounded-full bg-blue-500" />
      </div>
    )
  }

  if (state === 'failed') {
    return (
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-500">
        <svg className="h-3.5 w-3.5 text-white" viewBox="0 0 20 20" fill="currentColor">
          <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
        </svg>
      </div>
    )
  }

  // pending
  return (
    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-gray-200 bg-white" />
  )
}
