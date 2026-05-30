import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { container } from '@/infrastructure/di/container'

const userService = container.userService

export function useUsers(page = 0, size = 20) {
  return useQuery({
    queryKey: ['users', page, size],
    queryFn: () => userService.listUsers(page, size),
    staleTime: 30 * 1000,
  })
}

export function usePromoteUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (userId: string) => userService.promoteUser(userId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}
