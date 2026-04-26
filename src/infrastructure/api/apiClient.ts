import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from 'axios'

const SESSION_ACCESS_KEY = 'p4c_access_token'
const COOKIE_REFRESH_KEY = 'p4c_refresh_token'

function setCookie(name: string, value: string, days = 7) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString()
  const secure = location.protocol === 'https:' ? '; Secure' : ''
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Strict${secure}`
}

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'))
  return match ? decodeURIComponent(match[1]) : null
}

function deleteCookie(name: string) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Strict`
}

// Restore tokens from storage on module load
let accessToken: string | null = sessionStorage.getItem(SESSION_ACCESS_KEY)
let refreshToken: string | null = getCookie(COOKIE_REFRESH_KEY)
let isRefreshing = false
let refreshSubscribers: ((token: string) => void)[] = []

export function setTokens(tokens: { accessToken: string; refreshToken: string }) {
  accessToken = tokens.accessToken
  refreshToken = tokens.refreshToken
  sessionStorage.setItem(SESSION_ACCESS_KEY, tokens.accessToken)
  setCookie(COOKIE_REFRESH_KEY, tokens.refreshToken)
}

export function clearTokens() {
  accessToken = null
  refreshToken = null
  sessionStorage.removeItem(SESSION_ACCESS_KEY)
  deleteCookie(COOKIE_REFRESH_KEY)
}

export function getAccessToken() {
  return accessToken
}

export function getRefreshToken() {
  return refreshToken
}

function subscribeTokenRefresh(cb: (token: string) => void) {
  refreshSubscribers.push(cb)
}

function onTokenRefreshed(token: string) {
  refreshSubscribers.forEach(cb => {
    cb(token)
  })
  refreshSubscribers = []
}

function onRefreshFailed() {
  refreshSubscribers = []
  clearTokens()
  // Dispatch a DOM event so the React tree can handle navigation via React Router
  // instead of a hard full-page redirect that breaks SPA routing.
  window.dispatchEvent(new CustomEvent('auth:session-expired'))
}

const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor — attach access token (skip on auth endpoints to prevent
// a stale/expired token from causing the backend to reject a magic-link verify
// or OAuth request with 401 before the user is even authenticated)
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const url = config.url ?? ''
  const isAuthEndpoint = url.startsWith('/auth/')
  if (accessToken && !isAuthEndpoint) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
})

// Response interceptor — handle 401 and refresh token
apiClient.interceptors.response.use(
  response => response,
  async (rawError: unknown) => {
    if (!axios.isAxiosError(rawError)) return Promise.reject(new Error(String(rawError)))

    const error = rawError
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    if (error.response?.status === 401 && !originalRequest._retry) {
      // No refresh token available — propagate the error instead of attempting a
      // refresh that will fail and hard-redirect to /admin/login via onRefreshFailed
      if (!refreshToken) {
        return Promise.reject(error)
      }

      if (isRefreshing) {
        // Queue the request until refresh completes
        return new Promise(resolve => {
          subscribeTokenRefresh(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`
            resolve(apiClient(originalRequest))
          })
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const response = await axios.post<{ accessToken: string; refreshToken: string }>(
          `${import.meta.env.VITE_API_BASE_URL}/auth/refresh`,
          { refreshToken },
        )

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data
        setTokens({ accessToken: newAccessToken, refreshToken: newRefreshToken })
        onTokenRefreshed(newAccessToken)
        isRefreshing = false

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        return await apiClient(originalRequest)
      } catch {
        isRefreshing = false
        onRefreshFailed()
        return Promise.reject(error)
      }
    }

    return Promise.reject(error)
  },
)

export default apiClient
