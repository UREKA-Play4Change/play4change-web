import { FormEvent, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import Logo from '@/ui/components/Logo'
import { useSendMagicLink } from '@/application/hooks/useAuth'
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

  const sendMagicLink = useSendMagicLink()

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

  function handleOAuthLogin(provider: 'GOOGLE' | 'FACEBOOK') {
    void navigate(ROUTES.ADMIN_DASHBOARD)
    void provider
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
          <button
            onClick={() => {
              setStep('form')
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

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-gray-200" aria-hidden="true" />
            <span className="text-xs text-gray-400">{t('admin.login.orContinueWith')}</span>
            <div className="h-px flex-1 bg-gray-200" aria-hidden="true" />
          </div>

          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={() => {
                handleOAuthLogin('GOOGLE')
              }}
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white py-3 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:border-gray-300 hover:shadow-md"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              {t('admin.login.continueGoogle')}
            </button>

            <button
              type="button"
              onClick={() => {
                handleOAuthLogin('FACEBOOK')
              }}
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white py-3 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:border-gray-300 hover:shadow-md"
            >
              <svg
                className="h-5 w-5 text-[#1877F2]"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              {t('admin.login.continueFacebook')}
            </button>
          </div>
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
