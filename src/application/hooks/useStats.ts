import { useQuery } from '@tanstack/react-query'
import { container } from '@/infrastructure/di/container'

const statsService = container.statsService

export function usePlatformStats() {
  return useQuery({
    queryKey: ['stats', 'platform'],
    queryFn: () => statsService.getPlatformStats(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  })
}
