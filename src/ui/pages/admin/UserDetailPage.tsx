import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  useUserDetail,
  useUserEnrollments,
  useUserBadges,
  useUserEnrollmentRoadmap,
  useUserEnrollmentExplanations,
} from '@/application/hooks/useUsers'
import { ROUTES } from '@/lib/constants'
import type {
  AdminExplanationMessage,
  AdminExplanationSession,
  AdminUserEnrollment,
  RoadmapNodeStatus,
} from '@/domain/models/User'

// ── Status helpers ────────────────────────────────────────────────────────────

const STATUS_LABEL: Record<RoadmapNodeStatus, string> = {
  COMPLETED: 'Completed',
  LATE: 'Late',
  SKIPPED: 'Skipped',
  PENDING: 'Pending',
  LOCKED: 'Locked',
  ADAPTIVE_PENDING: 'Adaptive – pending',
  ADAPTIVE_COMPLETED: 'Adaptive – done',
  PENDING_REVIEW: 'Pending review',
  REVIEW_PENDING: 'Review pending',
}

function nodeColorClass(status: RoadmapNodeStatus, isAdaptive: boolean): string {
  if (isAdaptive) {
    return status === 'ADAPTIVE_COMPLETED'
      ? 'bg-orange-500 border-orange-500 text-white'
      : 'bg-orange-100 border-orange-400 text-orange-600'
  }
  switch (status) {
    case 'COMPLETED':
      return 'bg-green-500 border-green-500 text-white'
    case 'LATE':
      return 'bg-yellow-400 border-yellow-400 text-white'
    case 'PENDING_REVIEW':
    case 'REVIEW_PENDING':
      return 'bg-blue-400 border-blue-400 text-white'
    case 'PENDING':
      return 'bg-blue-100 border-blue-300 text-blue-600'
    case 'LOCKED':
      return 'bg-gray-100 border-gray-300 text-gray-400'
    case 'SKIPPED':
      return 'bg-gray-200 border-gray-300 text-gray-500'
    default:
      return 'bg-gray-100 border-gray-300 text-gray-400'
  }
}

function lineColorClass(status: RoadmapNodeStatus, isAdaptive: boolean): string {
  if (isAdaptive) return status === 'ADAPTIVE_COMPLETED' ? 'bg-orange-300' : 'bg-orange-200'
  switch (status) {
    case 'COMPLETED':
      return 'bg-green-300'
    case 'LATE':
      return 'bg-yellow-300'
    default:
      return 'bg-gray-200'
  }
}

// ── Explanation helpers ────────────────────────────────────────────────────────

function patternLabel(pattern: string): string {
  switch (pattern) {
    case 'WRONG_CONCEPT':
    case 'CONCEPTUAL_MISUNDERSTANDING':
      return 'Concept misunderstanding'
    case 'PARTIAL_UNDERSTANDING':
      return 'Partial understanding'
    case 'READING_ERROR':
      return 'Reading error'
    case 'TIME_PRESSURE':
      return 'Time pressure'
    default:
      return pattern.replace(/_/g, ' ').toLowerCase()
  }
}

// ── Conversation bubble ────────────────────────────────────────────────────────

function MessageBubble({ msg }: { msg: AdminExplanationMessage }) {
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

// ── Explanation node (blue, inline in roadmap) ─────────────────────────────────

function ExplanationNode({ session }: { session: AdminExplanationSession }) {
  const [open, setOpen] = useState(false)

  return (
    <li className="relative flex gap-4">
      {/* Vertical connector from explanation node downward (shown as blue) */}
      <div
        className="absolute left-[15px] top-8 w-0.5 bg-blue-200"
        style={{ height: 'calc(100% - 8px)' }}
      />

      {/* Blue circle node */}
      <div className="relative z-10 flex-shrink-0">
        <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-blue-500 bg-blue-500 text-white text-[9px] font-bold">
          AI
        </div>
      </div>

      {/* Content */}
      <div className="mb-4 flex-1 min-w-0">
        <button
          type="button"
          onClick={() => {
            setOpen(v => !v)
          }}
          className="flex w-full items-start gap-2 text-left"
        >
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-blue-50 text-blue-600">
                AI Explanation
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
              <span className="text-[10px] text-gray-400">
                {new Date(session.generatedAt).toLocaleString()}
              </span>
            </div>
            <p className="mt-0.5 text-sm font-medium text-blue-700">
              {patternLabel(session.errorPattern)}
            </p>
          </div>
          <svg
            className={`mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-blue-400 transition-transform ${open ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {open && (
          <div className="mt-2 rounded-xl border border-blue-100 bg-blue-50/60 p-3">
            {!session.explanationText && session.messages.length === 0 ? (
              <p className="text-xs text-gray-400 italic">No conversation yet.</p>
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
                Resolved {new Date(session.resolvedAt).toLocaleString()}
              </p>
            )}
          </div>
        )}
      </div>
    </li>
  )
}

// ── Roadmap panel ─────────────────────────────────────────────────────────────

function RoadmapPanel({ userId, enrollment }: { userId: string; enrollment: AdminUserEnrollment }) {
  const { data: nodes, isLoading } = useUserEnrollmentRoadmap(userId, enrollment.enrollmentId)
  const { data: explanations = [] } = useUserEnrollmentExplanations(userId, enrollment.enrollmentId)

  if (isLoading) {
    return (
      <div className="space-y-3 p-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="flex items-center gap-3">
            <div className="h-8 w-8 animate-pulse rounded-full bg-gray-100" />
            <div className="h-4 flex-1 animate-pulse rounded-full bg-gray-100" />
          </div>
        ))}
      </div>
    )
  }

  if (!nodes || nodes.length === 0) {
    return <p className="p-4 text-sm text-gray-400">No roadmap data yet.</p>
  }

  // Group explanation sessions by dayIndex
  const explanationsByDay = new Map<number, AdminExplanationSession[]>()
  for (const s of explanations) {
    const list = explanationsByDay.get(s.dayIndex) ?? []
    explanationsByDay.set(s.dayIndex, [...list, s])
  }

  return (
    <div className="p-4">
      <ol className="relative">
        {nodes.map((node, i) => {
          const isLastOfDay = i === nodes.length - 1 || nodes[i + 1].dayIndex !== node.dayIndex
          const sessionsForDay = isLastOfDay ? (explanationsByDay.get(node.dayIndex) ?? []) : []
          const isLast = i === nodes.length - 1 && sessionsForDay.length === 0
          const color = nodeColorClass(node.status, node.isAdaptive)
          const lineColor = lineColorClass(node.status, node.isAdaptive)

          return (
            <li key={`${node.dayIndex}-${i}`} className="relative flex gap-4">
              {/* Vertical connector line */}
              {!isLast && (
                <div
                  className={`absolute left-[15px] top-8 w-0.5 ${lineColor}`}
                  style={{ height: 'calc(100% - 8px)' }}
                />
              )}

              {/* Node circle */}
              <div className="relative z-10 flex-shrink-0">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-bold ${color}`}
                >
                  {node.isAdaptive ? '◆' : node.dayIndex + 1}
                </div>
              </div>

              {/* Node content */}
              <div className="mb-4 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                      node.isAdaptive ? 'bg-orange-50 text-orange-600' : 'bg-gray-50 text-gray-500'
                    }`}
                  >
                    {node.isAdaptive ? 'Adaptive' : `Day ${node.dayIndex + 1}`}
                  </span>
                  <span className="text-[10px] text-gray-400">{STATUS_LABEL[node.status]}</span>
                  {node.pointsAwarded != null && node.pointsAwarded > 0 && (
                    <span className="text-[10px] font-medium text-green-600">
                      +{node.pointsAwarded} pts
                    </span>
                  )}
                </div>
                <p
                  className={`mt-0.5 text-sm font-medium leading-snug ${
                    node.status === 'LOCKED' ? 'text-gray-400' : 'text-gray-800'
                  }`}
                >
                  {node.title}
                </p>

                {/* Inject explanation nodes after last node of this dayIndex */}
                {sessionsForDay.length > 0 && (
                  <ol className="mt-3 relative">
                    {sessionsForDay.map(s => (
                      <ExplanationNode key={s.sessionId} session={s} />
                    ))}
                  </ol>
                )}
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

// ── Enrollment card ───────────────────────────────────────────────────────────

const ENROLLMENT_STATUS_STYLE: Record<string, string> = {
  ACTIVE: 'bg-green-100 text-green-700',
  COMPLETED: 'bg-blue-100 text-blue-700',
  EXPIRED: 'bg-red-100 text-red-600',
  PAUSED: 'bg-yellow-100 text-yellow-700',
}

function EnrollmentCard({
  userId,
  enrollment,
}: {
  userId: string
  enrollment: AdminUserEnrollment
}) {
  const [open, setOpen] = useState(false)
  const progress =
    enrollment.totalDays > 0 ? Math.min(enrollment.currentDayIndex / enrollment.totalDays, 1) : 0

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      {/* Header row */}
      <button
        type="button"
        onClick={() => {
          setOpen(v => !v)
        }}
        className="flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-gray-50"
      >
        {/* Topic initial */}
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-blue-50 text-sm font-bold text-blue-600">
          {enrollment.topicTitle.charAt(0).toUpperCase()}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-medium text-gray-900 truncate">{enrollment.topicTitle}</span>
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-medium ${ENROLLMENT_STATUS_STYLE[enrollment.status] ?? 'bg-gray-100 text-gray-600'}`}
            >
              {enrollment.status}
            </span>
          </div>

          {/* Progress bar */}
          <div className="mt-2 flex items-center gap-2">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-blue-500 transition-all"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
            <span className="flex-shrink-0 text-xs text-gray-400">
              {enrollment.currentDayIndex}/{enrollment.totalDays} days
            </span>
          </div>
        </div>

        <div className="flex flex-shrink-0 flex-col items-end gap-1">
          <span className="text-sm font-semibold text-gray-900">
            {enrollment.totalPointsEarned} pts
          </span>
          <span className="text-xs text-gray-400">
            {new Date(enrollment.enrolledAt).toLocaleDateString()}
          </span>
        </div>

        {/* Chevron */}
        <svg
          className={`h-4 w-4 flex-shrink-0 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Expandable roadmap */}
      {open && (
        <div className="border-t border-gray-100">
          <RoadmapPanel userId={userId} enrollment={enrollment} />
        </div>
      )}
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function UserDetailPage() {
  const { id: userId = '' } = useParams<{ id: string }>()

  const { data: user, isLoading: loadingUser, isError: errorUser } = useUserDetail(userId)
  const { data: enrollments = [], isLoading: loadingEnrollments } = useUserEnrollments(userId)
  const { data: badges = [], isLoading: loadingBadges } = useUserBadges(userId)

  if (loadingUser) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    )
  }

  if (errorUser || !user) {
    return (
      <div className="py-20 text-center">
        <p className="text-sm text-red-500">Failed to load user.</p>
        <Link
          to={ROUTES.ADMIN_USERS}
          className="mt-2 inline-block text-sm text-blue-600 hover:underline"
        >
          Back to users
        </Link>
      </div>
    )
  }

  const initials = user.name
    ? user.name
        .split(' ')
        .map(w => w[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : user.email.slice(0, 2).toUpperCase()

  return (
    <div className="space-y-8">
      {/* Back link */}
      <Link
        to={ROUTES.ADMIN_USERS}
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800"
      >
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        All users
      </Link>

      {/* Profile header */}
      <div className="glass-card flex flex-wrap items-center gap-5 rounded-2xl p-6 shadow-sm">
        {/* Avatar */}
        <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-xl font-bold text-blue-600">
          {initials}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-display text-xl font-bold text-gray-900">
              {user.name ?? user.email}
            </h1>
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                user.role === 'ADMIN' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
              }`}
            >
              {user.role}
            </span>
          </div>
          {user.name && <p className="mt-0.5 text-sm text-gray-500">{user.email}</p>}
          <p className="mt-0.5 text-xs text-gray-400">
            Joined {new Date(user.createdAt).toLocaleDateString()}
          </p>
        </div>

        {/* Stats row */}
        <div className="flex flex-wrap gap-6">
          <div className="text-center">
            <p className="font-display text-2xl font-bold text-blue-600">{user.totalPoints}</p>
            <p className="text-xs text-gray-400">Total XP</p>
          </div>
          <div className="text-center">
            <p className="font-display text-2xl font-bold text-orange-500">{user.streakDays}</p>
            <p className="text-xs text-gray-400">Best streak</p>
          </div>
          <div className="text-center">
            <p className="font-display text-2xl font-bold text-green-600">{user.enrollmentCount}</p>
            <p className="text-xs text-gray-400">Topics</p>
          </div>
          <div className="text-center">
            <p className="font-display text-2xl font-bold text-purple-600">{badges.length}</p>
            <p className="text-xs text-gray-400">Badges</p>
          </div>
        </div>
      </div>

      {/* Badges */}
      <section>
        <h2 className="mb-3 font-display text-base font-semibold text-gray-900">Badges</h2>
        {loadingBadges ? (
          <div className="flex gap-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-10 w-32 animate-pulse rounded-xl bg-gray-100" />
            ))}
          </div>
        ) : badges.length === 0 ? (
          <p className="text-sm text-gray-400">No badges earned yet.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {badges.map((badge, i) => (
              <div
                key={i}
                title={`${badge.description}\n${badge.topicTitle} · ${new Date(badge.earnedAt).toLocaleDateString()}`}
                className="flex items-center gap-2 rounded-xl border border-purple-100 bg-purple-50 px-3 py-2"
              >
                <span className="text-lg">🏅</span>
                <div>
                  <p className="text-xs font-semibold text-purple-800">
                    {badge.microCompetenceName}
                  </p>
                  <p className="text-[10px] text-purple-500">{badge.topicTitle}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Enrollments + roadmaps */}
      <section>
        <h2 className="mb-3 font-display text-base font-semibold text-gray-900">
          Topics &amp; Roadmaps
        </h2>
        {loadingEnrollments ? (
          <div className="space-y-3">
            {[1, 2].map(i => (
              <div key={i} className="h-20 animate-pulse rounded-2xl bg-gray-100" />
            ))}
          </div>
        ) : enrollments.length === 0 ? (
          <p className="text-sm text-gray-400">No enrollments yet.</p>
        ) : (
          <div className="space-y-3">
            {enrollments.map(enrollment => (
              <EnrollmentCard
                key={enrollment.enrollmentId}
                userId={userId}
                enrollment={enrollment}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
