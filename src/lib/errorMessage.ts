import axios from 'axios'

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (!error.response) return 'Network error — check your connection'
    const data = error.response.data as Record<string, unknown> | undefined
    if (data?.message && typeof data.message === 'string') return data.message
    if (data?.error && typeof data.error === 'string') return data.error
    if (data?.detail && typeof data.detail === 'string') return data.detail
    return `Server error (${error.response.status})`
  }
  if (error instanceof Error) return error.message
  return 'An unexpected error occurred'
}

/** Returns true for errors that are already handled by the auth flow (401s) */
export function isHandledByAuthFlow(error: unknown): boolean {
  return axios.isAxiosError(error) && error.response?.status === 401
}
