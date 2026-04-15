import { useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import Logo from '@/ui/components/Logo'
import { useCurrentUser, useLogout } from '@/application/hooks/useAuth'
import { getAccessToken } from '@/infrastructure/api/apiClient'
import { ROUTES } from '@/lib/constants'

const NAV_ITEMS = [
  {
    to: ROUTES.ADMIN_DASHBOARD,
    label: 'Dashboard',
    icon: (
      <svg
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
        />
      </svg>
    ),
  },
  {
    to: ROUTES.ADMIN_TOPICS,
    label: 'My Topics',
    icon: (
      <svg
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
        />
      </svg>
    ),
  },
  {
    to: ROUTES.ADMIN_CREATE_TOPIC,
    label: 'Create Topic',
    icon: (
      <svg
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
      </svg>
    ),
  },
]

export default function AdminLayout() {
  const { data: user } = useCurrentUser()
  const navigate = useNavigate()
  const logout = useLogout()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  function handleLogout() {
    const token = getAccessToken() ?? ''
    logout.mutate(token, {
      onSettled: () => {
        void navigate(ROUTES.ADMIN_LOGIN)
      },
    })
  }

  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <nav className={`flex h-full flex-col ${mobile ? '' : 'w-64'}`} aria-label="Admin navigation">
      {/* Logo */}
      <div className="border-b border-gray-100 p-6">
        <Link to={ROUTES.HOME}>
          <Logo size="sm" />
        </Link>
      </div>

      {/* Nav links */}
      <div className="flex-1 space-y-1 p-4">
        {NAV_ITEMS.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === ROUTES.ADMIN_DASHBOARD}
            onClick={() => {
              if (mobile) setSidebarOpen(false)
            }}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`
            }
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </div>

      {/* User info + logout */}
      <div className="border-t border-gray-100 p-4">
        {user && (
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
              {(user.name || user.email || '?').charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-gray-900">
                {user.name || user.email}
              </p>
              <p className="truncate text-xs text-gray-400">{user.email}</p>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          disabled={logout.isPending}
          className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-gray-500 transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
            />
          </svg>
          {logout.isPending ? 'Signing out…' : 'Sign out'}
        </button>
      </div>
    </nav>
  )

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Desktop sidebar */}
      <aside className="hidden border-r border-gray-100 bg-white lg:block lg:w-64">
        <div className="sticky top-0 h-screen">
          <Sidebar />
        </div>
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => {
              setSidebarOpen(false)
            }}
            aria-hidden="true"
          />
          <aside className="relative h-full w-64 border-r border-gray-100 bg-white shadow-xl">
            <Sidebar mobile />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        {/* Top bar (mobile) */}
        <header className="flex h-16 items-center justify-between border-b border-gray-100 bg-white px-6 lg:hidden">
          <button
            onClick={() => {
              setSidebarOpen(true)
            }}
            aria-label="Open sidebar"
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>
          <Logo size="sm" />
          <div className="w-8" aria-hidden="true" />
        </header>

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
