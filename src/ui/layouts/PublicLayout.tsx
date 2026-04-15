import { Link, Outlet } from 'react-router-dom'
import Logo from '@/ui/components/Logo'
import { ROUTES } from '@/lib/constants'

function Header() {
  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/20 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to={ROUTES.HOME} aria-label="Play4Change home">
          <Logo size="sm" />
        </Link>
        <nav className="flex items-center gap-6">
          <Link
            to={ROUTES.DOWNLOAD}
            className="rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
          >
            Download
          </Link>
        </nav>
      </div>
    </header>
  )
}

function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-gray-50 py-12">
      <div className="mx-auto max-w-7xl px-6">
        {/* Partner logos */}
        <div className="mb-8 flex flex-col items-center gap-6 sm:flex-row sm:justify-center">
          <span className="text-sm font-medium text-gray-400 uppercase tracking-wider">
            In partnership with
          </span>
          <div className="flex items-center gap-8">
            <img
              src="/logos/isel.png"
              alt="ISEL — Instituto Superior de Engenharia de Lisboa"
              className="h-10 object-contain opacity-70 grayscale transition-all hover:opacity-100 hover:grayscale-0"
            />
            <img
              src="/logos/ureka.jpg"
              alt="U!REKA European University"
              className="h-10 object-contain opacity-70 grayscale transition-all hover:opacity-100 hover:grayscale-0"
            />
          </div>
        </div>

        <div className="flex flex-col items-center gap-3 text-center">
          <Logo size="sm" />
          <p className="text-sm text-gray-500">© 2025 Play4Change — ISEL &amp; U!REKA</p>
          <Link
            to={ROUTES.ADMIN_LOGIN}
            className="text-xs text-gray-400 transition-colors hover:text-gray-600"
          >
            Administration
          </Link>
        </div>
      </div>
    </footer>
  )
}

export default function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 pt-16">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
