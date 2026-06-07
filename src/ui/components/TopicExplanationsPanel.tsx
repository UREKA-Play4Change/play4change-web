import { useState } from 'react'
import { useTopicExplanations } from '@/application/hooks/useTopics'
import { formatDate } from '@/lib/formatters'
import type { TopicExplanationMessage, TopicExplanationSession } from '@/domain/models/Topic'

interface Props {
  topicId: string
}

const PATTERN_LABEL: Record<string, string> = {
  WRONG_CONCEPT: 'Wrong concept',
  CONCEPTUAL_MISUNDERSTANDING: 'Concept misunderstanding',
  PARTIAL_UNDERSTANDING: 'Partial understanding',
  READING_ERROR: 'Reading error',
  TIME_PRESSURE: 'Time pressure',
}

const PATTERN_COLOR: Record<string, string> = {
  WRONG_CONCEPT: 'bg-red-50 text-red-700',
  CONCEPTUAL_MISUNDERSTANDING: 'bg-red-50 text-red-700',
  PARTIAL_UNDERSTANDING: 'bg-orange-50 text-orange-700',
  READING_ERROR: 'bg-yellow-50 text-yellow-700',
  TIME_PRESSURE: 'bg-blue-50 text-blue-700',
}

function MessageBubble({ msg }: { msg: TopicExplanationMessage }) {
  const isAI = msg.role === 'AI'
  return (
    <div className={`flex ${isAI ? 'justify-start' : 'justify-end'}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-3 py-2 text-xs leading-relaxed ${
          isAI ? 'rounded-tl-sm bg-blue-50 text-gray-700' : 'rounded-tr-sm bg-blue-600 text-white'
        }`}
      >
        {msg.content}
      </div>
    </div>
  )
}

function ExplanationCard({ session }: { session: TopicExplanationSession }) {
  const [open, setOpen] = useState(false)
  const patternLabel =
    PATTERN_LABEL[session.errorPattern] ?? session.errorPattern.replace(/_/g, ' ').toLowerCase()
  const patternColor = PATTERN_COLOR[session.errorPattern] ?? 'bg-gray-50 text-gray-600'
  const userName = session.userName ?? session.userEmail

  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
      <button
        type="button"
        onClick={() => {
          setOpen(v => !v)
        }}
        className="flex w-full items-start gap-4 p-4 text-left hover:bg-gray-50 transition-colors"
      >
        {/* User avatar */}
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-blue-50 text-xs font-bold text-blue-600">
          {userName.slice(0, 2).toUpperCase()}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-gray-900 truncate">{userName}</span>
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${patternColor}`}>
              {patternLabel}
            </span>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                session.status === 'RESOLVED'
                  ? 'bg-green-100 text-green-700'
                  : session.status === 'ACTIVE'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-500'
              }`}
            >
              {session.status}
            </span>
          </div>
          <p className="mt-0.5 text-xs text-gray-500">
            Day {session.dayIndex + 1} ·{' '}
            <span className="font-medium text-gray-700">{session.originalTaskTitle}</span>
          </p>
          <p className="mt-0.5 text-[10px] text-gray-400">{formatDate(session.generatedAt)}</p>
        </div>

        <svg
          className={`mt-1 h-4 w-4 flex-shrink-0 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="border-t border-gray-100 px-4 pb-4 pt-3">
          {!session.explanationText && session.messages.length === 0 ? (
            <p className="text-xs italic text-gray-400">No conversation yet.</p>
          ) : (
            <div className="space-y-2">
              {session.explanationText && (
                <MessageBubble
                  msg={{
                    role: 'AI',
                    content: session.explanationText,
                    sentAt: session.generatedAt,
                  }}
                />
              )}
              {session.messages.map((msg, i) => (
                <MessageBubble key={i} msg={msg} />
              ))}
            </div>
          )}
          {session.resolvedAt && (
            <p className="mt-2 text-[10px] text-green-600">
              Resolved {formatDate(session.resolvedAt)}
            </p>
          )}
        </div>
      )}
    </div>
  )
}

export default function TopicExplanationsPanel({ topicId }: Props) {
  const { data: sessions, isLoading, isError } = useTopicExplanations(topicId)

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
    return <p className="text-sm text-red-500">Failed to load explanations.</p>
  }

  if (!sessions || sessions.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-10 text-center">
        <p className="text-sm text-gray-400">No AI explanations triggered for this topic yet.</p>
      </div>
    )
  }

  // Group by dayIndex + question for overview
  const byQuestion = new Map<number, TopicExplanationSession[]>()
  for (const s of sessions) {
    const list = byQuestion.get(s.dayIndex) ?? []
    byQuestion.set(s.dayIndex, [...list, s])
  }

  const sortedDays = Array.from(byQuestion.entries()).sort(([a], [b]) => a - b)

  return (
    <div className="space-y-6">
      {/* Summary bar */}
      <div className="flex flex-wrap gap-4">
        <div className="glass-card rounded-xl px-4 py-3 shadow-sm">
          <p className="text-xs text-gray-400">Total sessions</p>
          <p className="font-display text-xl font-bold text-gray-900">{sessions.length}</p>
        </div>
        <div className="glass-card rounded-xl px-4 py-3 shadow-sm">
          <p className="text-xs text-gray-400">Resolved</p>
          <p className="font-display text-xl font-bold text-green-600">
            {sessions.filter(s => s.status === 'RESOLVED').length}
          </p>
        </div>
        <div className="glass-card rounded-xl px-4 py-3 shadow-sm">
          <p className="text-xs text-gray-400">Questions affected</p>
          <p className="font-display text-xl font-bold text-blue-600">{byQuestion.size}</p>
        </div>
      </div>

      {/* Sessions grouped by question */}
      {sortedDays.map(([dayIndex, daySessions]) => (
        <div key={dayIndex}>
          <div className="mb-2 flex items-center gap-2">
            <span className="rounded-md bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700">
              Day {dayIndex + 1}
            </span>
            <span className="text-xs font-medium text-gray-700">
              {daySessions[0].originalTaskTitle}
            </span>
            <span className="text-xs text-gray-400">
              · {daySessions.length} explanation{daySessions.length !== 1 ? 's' : ''}
            </span>
          </div>
          <div className="space-y-2">
            {daySessions.map(session => (
              <ExplanationCard key={session.sessionId} session={session} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
