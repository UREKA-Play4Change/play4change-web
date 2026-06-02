import { FormEvent, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import Logo from '@/ui/components/Logo'
import { useSendMagicLink, useVerifyMagicLink } from '@/application/hooks/useAuth'
import { getAccessToken } from '@/infrastructure/api/apiClient'
import { isValidEmail } from '@/lib/validators'
import { ROUTES } from '@/lib/constants'

type Step = 'form' | 'magic-link-sent'

export default function LoginPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  // If there is already an access token in memory (restored from sessionStorage on
  // page load, or just set by a magic-link verification), skip the login form and
  // go straight to the dashboard.  We reset the auth query first so ProtectedRoute
  // sees isPending/isLoading instead of a stale error from a previous failed attempt.
  useEffect(() => {
    if (getAccessToken()) {
      void queryClient.resetQueries({ queryKey: ['auth', 'me'] })
      void navigate(ROUTES.ADMIN_DASHBOARD, { replace: true })
    }
    // Only run on mount — token in memory won't change during this render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [step, setStep] = useState<Step>('form')
  const [token, setToken] = useState('')
  const [tokenError, setTokenError] = useState('')

  const sendMagicLink = useSendMagicLink()
  const verifyMagicLink = useVerifyMagicLink()

  function handleEmailSubmit(e: FormEvent) {
    e.preventDefault()
    setEmailError('')

    if (!isValidEmail(email)) {
      setEmailError(t('admin.login.emailError'))
      return
    }

    sendMagicLink.mutate(email, {
      onSuccess: () => {
        setStep('magic-link-sent')
      },
      onError: () => {
        setEmailError(t('admin.login.magicLinkError'))
      },
    })
  }

  function handleTokenSubmit(e: FormEvent) {
    e.preventDefault()
    setTokenError('')
    const trimmed = token.trim()
    if (!trimmed) {
      setTokenError('Paste the token from the email.')
      return
    }
    verifyMagicLink.mutate(trimmed, {
      onSuccess: () => {
        void navigate(ROUTES.ADMIN_DASHBOARD, { replace: true })
      },
      onError: () => {
        setTokenError('Invalid or expired token. Request a new link.')
      },
    })
  }

  if (step === 'magic-link-sent') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-green-50 p-4">
        <div className="glass-card w-full max-w-md rounded-3xl p-10 text-center shadow-xl">
          <div className="mb-4 text-5xl" aria-hidden="true">
            ✉️
          </div>
          <h2 className="mb-3 font-display text-2xl font-bold text-gray-900">
            {t('admin.login.checkEmail.heading')}
          </h2>
          <p className="mb-6 text-gray-500">
            {t('admin.login.checkEmail.description', { email })
              .split(email)
              .flatMap((part, i, arr) =>
                i < arr.length - 1
                  ? [
                      part,
                      <span key={i} className="font-semibold text-gray-900">
                        {email}
                      </span>,
                    ]
                  : [part],
              )}
          </p>

          <form onSubmit={handleTokenSubmit} noValidate className="mb-6 text-left">
            <label htmlFor="token" className="mb-1.5 block text-sm font-medium text-gray-700">
              Or paste the token from the email
            </label>
            <input
              id="token"
              type="text"
              value={token}
              onChange={e => {
                setToken(e.target.value)
                setTokenError('')
              }}
              placeholder="Paste token here…"
              autoComplete="off"
              aria-invalid={Boolean(tokenError)}
              aria-describedby={tokenError ? 'token-error' : undefined}
              className={`w-full rounded-xl border px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition-all focus:ring-2 focus:ring-blue-500 ${
                tokenError
                  ? 'border-red-300 bg-red-50 focus:ring-red-400'
                  : 'border-gray-200 bg-white focus:border-blue-400'
              }`}
            />
            {tokenError && (
              <p id="token-error" className="mt-1 text-xs text-red-600" role="alert">
                {tokenError}
              </p>
            )}
            <button
              type="submit"
              disabled={verifyMagicLink.isPending}
              className="mt-3 w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {verifyMagicLink.isPending ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <button
            onClick={() => {
              setStep('form')
              setToken('')
              setTokenError('')
            }}
            className="text-sm text-blue-600 underline underline-offset-2 hover:text-blue-700"
          >
            {t('admin.login.checkEmail.useDifferent')}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-green-50 p-4">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute left-0 top-0 h-80 w-80 rounded-full bg-blue-100/40 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-green-100/30 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="glass-card rounded-3xl p-10 shadow-xl">
          <div className="mb-8 text-center">
            <Logo size="lg" />
            <p className="mt-2 text-sm text-gray-500">{t('admin.login.portalLabel')}</p>
          </div>

          <h1 className="mb-6 text-center font-display text-2xl font-bold text-gray-900">
            {t('admin.login.heading')}
          </h1>

          <form onSubmit={handleEmailSubmit} noValidate>
            <div className="mb-4">
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-gray-700">
                {t('admin.login.emailLabel')}
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => {
                  setEmail(e.target.value)
                  setEmailError('')
                }}
                placeholder={t('admin.login.emailPlaceholder')}
                autoComplete="email"
                aria-invalid={Boolean(emailError)}
                aria-describedby={emailError ? 'email-error' : undefined}
                className={`w-full rounded-xl border px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition-all focus:ring-2 focus:ring-blue-500 ${
                  emailError
                    ? 'border-red-300 bg-red-50 focus:ring-red-400'
                    : 'border-gray-200 bg-white focus:border-blue-400'
                }`}
              />
              {emailError && (
                <p id="email-error" className="mt-1 text-xs text-red-600" role="alert">
                  {emailError}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={sendMagicLink.isPending}
              className="w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {sendMagicLink.isPending ? t('admin.login.sending') : t('admin.login.sendButton')}
            </button>
          </form>
        </div>

        <p className="mt-4 text-center text-xs text-gray-400">
          <a href={ROUTES.HOME} className="hover:text-gray-600">
            {t('admin.login.backToApp')}
          </a>
        </p>
      </div>
    </div>
  )
}
