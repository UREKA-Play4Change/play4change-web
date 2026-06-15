import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { container } from '@/infrastructure/di/container'

const userService = container.userService

export function useUsers(page = 0, size = 20) {
  return useQuery({
    queryKey: ['users', page, size],
    queryFn: () => userService.listUsers(page, size),
    staleTime: 30 * 1000,
    placeholderData: keepPreviousData,
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

export function useUserDetail(userId: string) {
  return useQuery({
    queryKey: ['user-detail', userId],
    queryFn: () => userService.getUserById(userId),
    enabled: Boolean(userId),
    staleTime: 30 * 1000,
  })
}

export function useUserEnrollments(userId: string) {
  return useQuery({
    queryKey: ['user-enrollments', userId],
    queryFn: () => userService.getUserEnrollments(userId),
    enabled: Boolean(userId),
    staleTime: 0,
    refetchInterval: 30_000,
  })
}

export function useUserBadges(userId: string) {
  return useQuery({
    queryKey: ['user-badges', userId],
    queryFn: () => userService.getUserBadges(userId),
    enabled: Boolean(userId),
    staleTime: 30 * 1000,
  })
}

export function useUserEnrollmentRoadmap(userId: string, enrollmentId: string) {
  return useQuery({
    queryKey: ['user-roadmap', userId, enrollmentId],
    queryFn: () => userService.getUserEnrollmentRoadmap(userId, enrollmentId),
    enabled: Boolean(userId) && Boolean(enrollmentId),
    staleTime: 0,
  })
}

export function useUserEnrollmentExplanations(userId: string, enrollmentId: string) {
  return useQuery({
    queryKey: ['user-explanations', userId, enrollmentId],
    queryFn: () => userService.getUserEnrollmentExplanations(userId, enrollmentId),
    enabled: Boolean(userId) && Boolean(enrollmentId),
    staleTime: 0,
  })
}
