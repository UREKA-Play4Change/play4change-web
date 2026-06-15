import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { useUsers, usePromoteUser } from '@/application/hooks/useUsers'
import type { AdminUserFull } from '@/domain/models/User'

const PAGE_SIZE = 5

export default function UserListPage() {
  const { t } = useTranslation()
  const [page, setPage] = useState(0)
  const [showEmails, setShowEmails] = useState(false)
  const [pendingPromoteUser, setPendingPromoteUser] = useState<AdminUserFull | null>(null)

  const { data, isPending, isError } = useUsers(page, PAGE_SIZE)
  const promoteUser = usePromoteUser()

  function handlePromoteConfirm() {
    if (!pendingPromoteUser) return
    promoteUser.mutate(pendingPromoteUser.id, {
      onSuccess: () => {
        toast.success(t('admin.users.promotedSuccess'))
        setPendingPromoteUser(null)
      },
    })
  }

  if (isPending) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    )
  }

  if (isError) {
    return (
      <p className="text-sm text-red-600" role="alert">
        {t('admin.users.loadError')}
      </p>
    )
  }

  const users = data.content
  const totalPages = data.totalPages

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-gray-900">
          {t('admin.users.heading')}
        </h1>
        <p className="mt-1 text-sm text-gray-500">{t('admin.users.subtitle')}</p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-100 bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left font-medium text-gray-500">
                <div className="flex items-center gap-2">
                  {t('admin.users.colEmail')}
                  <button
                    type="button"
                    onClick={() => {
                      setShowEmails(v => !v)
                    }}
                    className="rounded p-0.5 text-gray-400 transition-colors hover:text-gray-600"
                    aria-label={
                      showEmails ? t('admin.users.hideEmails') : t('admin.users.showEmails')
                    }
                    title={showEmails ? t('admin.users.hideEmails') : t('admin.users.showEmails')}
                  >
                    {showEmails ? (
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 4.411m0 0L21 21"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </th>
              <th className="px-6 py-3 text-left font-medium text-gray-500">
                {t('admin.users.colName')}
              </th>
              <th className="px-6 py-3 text-left font-medium text-gray-500">
                {t('admin.users.colRole')}
              </th>
              <th className="px-6 py-3 text-left font-medium text-gray-500">
                {t('admin.users.colTopics')}
              </th>
              <th className="px-6 py-3 text-left font-medium text-gray-500">
                {t('admin.users.colJoined')}
              </th>
              <th className="px-6 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map(user => (
              <tr key={user.id} className="transition-colors hover:bg-gray-50">
                <td className="px-6 py-4 text-gray-900">
                  <Link
                    to={`/admin/users/${user.id}`}
                    className="font-medium text-blue-600 hover:underline"
                  >
                    {showEmails ? user.email : maskEmail(user.email)}
                  </Link>
                </td>
                <td className="px-6 py-4 text-gray-500">{user.name ?? '—'}</td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      user.role === 'ADMIN'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                    aria-label={`${t('admin.users.roleLabel')}: ${user.role}`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-500">{user.enrollmentCount}</td>
                <td className="whitespace-nowrap px-6 py-4 text-gray-500">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  {user.role === 'USER' && (
                    <button
                      type="button"
                      onClick={() => {
                        setPendingPromoteUser(user)
                      }}
                      className="rounded-lg border border-blue-200 px-3 py-1 text-xs font-medium text-blue-600 transition-colors hover:bg-blue-50"
                    >
                      {t('admin.users.promoteButton')}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div
          className="flex items-center justify-between"
          role="navigation"
          aria-label={t('admin.users.paginationAriaLabel')}
        >
          <button
            onClick={() => {
              setPage(p => Math.max(0, p - 1))
            }}
            disabled={page === 0}
            className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-40"
          >
            {t('admin.users.prevPage')}
          </button>
          <span className="text-sm text-gray-500">
            {t('admin.users.pageOf', { current: page + 1, total: totalPages })}
          </span>
          <button
            onClick={() => {
              setPage(p => Math.min(totalPages - 1, p + 1))
            }}
            disabled={page >= totalPages - 1}
            className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-40"
          >
            {t('admin.users.nextPage')}
          </button>
        </div>
      )}

      {pendingPromoteUser && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="promote-dialog-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
        >
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl space-y-4">
            <h2
              id="promote-dialog-title"
              className="font-display text-base font-semibold text-gray-900"
            >
              {t('admin.users.promoteDialogTitle')}
            </h2>
            <p className="text-sm text-gray-600">
              {t('admin.users.promoteDialogBody', {
                name: pendingPromoteUser.name ?? pendingPromoteUser.email,
              })}
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handlePromoteConfirm}
                disabled={promoteUser.isPending}
                className="rounded-xl bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 disabled:opacity-60"
              >
                {promoteUser.isPending
                  ? t('admin.users.promoting')
                  : t('admin.users.confirmPromote')}
              </button>
              <button
                type="button"
                onClick={() => {
                  setPendingPromoteUser(null)
                }}
                className="rounded-xl border border-gray-200 px-5 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
              >
                {t('admin.users.cancel')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function maskEmail(email: string): string {
  const [local, domain] = email.split('@')
  return `${local.slice(0, 2)}${'•'.repeat(4)}@${domain}`
}
