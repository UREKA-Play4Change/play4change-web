import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { container } from '@/infrastructure/di/container'
import type { CreateTopicFromUrlRequest, TopicStatus } from '@/domain/models/Topic'

const topicService = container.topicService

export function useTopics(status?: TopicStatus) {
  return useQuery({
    queryKey: ['topics', status],
    queryFn: () => topicService.listMyTopics(status),
    staleTime: 30 * 1000, // 30 seconds
    select: data => (Array.isArray(data) ? data : []),
  })
}

export function useTopic(id: string) {
  return useQuery({
    queryKey: ['topics', id],
    queryFn: () => topicService.getTopicById(id),
    enabled: Boolean(id),
    staleTime: 30 * 1000,
  })
}

export function useCreateTopicFromUrl() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (request: CreateTopicFromUrlRequest) => topicService.createFromUrl(request),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['topics'] })
    },
  })
}

export function useCreateTopicFromPdf() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (formData: FormData) => topicService.createFromPdf(formData),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['topics'] })
    },
  })
}

export function useRegenerateTopic() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => topicService.regenerateTopic(id),
    onSuccess: topic => {
      void queryClient.invalidateQueries({ queryKey: ['topics', topic.id] })
      void queryClient.invalidateQueries({ queryKey: ['topics'] })
    },
  })
}
