import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { container } from '@/infrastructure/di/container'
import { setTokens, clearTokens } from '@/infrastructure/api/apiClient'
import type { OAuthProvider } from '@/domain/models/Auth'

const authService = container.authService

export function useCurrentUser() {
  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: () => authService.getCurrentUser(),
    retry: false,
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
      void queryClient.invalidateQueries({ queryKey: ['auth', 'me'] })
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
      void queryClient.invalidateQueries({ queryKey: ['auth', 'me'] })
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
