import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from 'axios'

// Module-level token store — intentionally NOT in localStorage for security
let accessToken: string | null = null
let refreshToken: string | null = null
let isRefreshing = false
let refreshSubscribers: ((token: string) => void)[] = []

export function setTokens(tokens: { accessToken: string; refreshToken: string }) {
  accessToken = tokens.accessToken
  refreshToken = tokens.refreshToken
}

export function clearTokens() {
  accessToken = null
  refreshToken = null
}

export function getAccessToken() {
  return accessToken
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
  window.location.href = '/admin/login'
}

const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor — attach access token
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (accessToken) {
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
