import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { container } from '@/infrastructure/di/container'
import { setTokens, clearTokens } from '@/infrastructure/api/apiClient'
import type { OAuthProvider } from '@/domain/models/Auth'

const authService = container.authService

export function useCurrentUser() {
  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: () => authService.getCurrentUser(),
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useSendMagicLink() {
  return useMutation({
    mutationFn: (email: string) => authService.sendMagicLink(email),
  })
}

export function useVerifyMagicLink() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (token: string) => authService.verifyMagicLink(token),
    onSuccess: tokens => {
      setTokens(tokens)
      // resetQueries clears any prior error state so ProtectedRoute sees isPending→isLoading
      // instead of isError, preventing an immediate redirect back to the login page
      void queryClient.resetQueries({ queryKey: ['auth', 'me'] })
      // Notify any other open tabs (e.g. the login tab the user left behind) so they
      // can acquire the new tokens and navigate to the dashboard without a page reload.
      try {
        const bc = new BroadcastChannel('p4c:auth')
        bc.postMessage({ type: 'login', tokens })
        bc.close()
      } catch {
        // BroadcastChannel unavailable (e.g. some private browsing modes)
      }
    },
  })
}

export function useLoginWithOAuth() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ provider, credential }: { provider: OAuthProvider; credential: string }) =>
      authService.loginWithOAuth(provider, credential),
    onSuccess: tokens => {
      setTokens(tokens)
      void queryClient.resetQueries({ queryKey: ['auth', 'me'] })
    },
  })
}

export function useLogout() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (refreshToken: string) => authService.logout(refreshToken),
    onSettled: () => {
      clearTokens()
      queryClient.clear()
    },
  })
}
