import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { container } from '@/infrastructure/di/container'
import type {
  CreateTopicFromUrlRequest,
  TopicStatus,
  UpdateTaskRequest,
} from '@/domain/models/Topic'

const topicService = container.topicService

export function useTopics(status?: TopicStatus, page = 0, size = 20) {
  return useQuery({
    queryKey: ['topics', status, page, size],
    queryFn: () => topicService.listMyTopics(status, page, size),
    staleTime: 0,
    refetchInterval: 30_000,
    placeholderData: keepPreviousData,
  })
}

export function useTopic(id: string) {
  return useQuery({
    queryKey: ['topics', id],
    queryFn: () => topicService.getTopicById(id),
    enabled: Boolean(id),
    staleTime: 0,
    refetchInterval: query => (query.state.data?.status === 'GENERATING' ? 10_000 : 30_000),
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

export function useTopicTasks(topicId: string) {
  return useQuery({
    queryKey: ['topic-tasks', topicId],
    queryFn: () => topicService.getTopicTasks(topicId),
    enabled: Boolean(topicId),
    staleTime: 0,
    refetchInterval: 30_000,
  })
}

export function useTopicStruggleTasks(topicId: string) {
  return useQuery({
    queryKey: ['topic-struggle-tasks', topicId],
    queryFn: () => topicService.getTopicStruggleTasks(topicId),
    enabled: Boolean(topicId),
    staleTime: 0,
    refetchInterval: 30_000,
  })
}

export function useStrugglePathStats(topicId: string) {
  return useQuery({
    queryKey: ['struggle-path-stats', topicId],
    queryFn: () => topicService.getStrugglePathStats(topicId),
    enabled: Boolean(topicId),
    staleTime: 0,
    refetchInterval: 30_000,
  })
}

export function useUpdateTask(topicId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ templateId, request }: { templateId: string; request: UpdateTaskRequest }) =>
      topicService.updateTask(templateId, request),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['topic-tasks', topicId] })
    },
  })
}

export function useUpdateAdaptiveTask(topicId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ taskId, request }: { taskId: string; request: UpdateTaskRequest }) =>
      topicService.updateAdaptiveTask(taskId, request),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['topic-struggle-tasks', topicId] })
    },
  })
}

export function useTopicPrerequisites(topicId: string) {
  return useQuery({
    queryKey: ['topic-prerequisites', topicId],
    queryFn: () => topicService.getPrerequisites(topicId),
    enabled: Boolean(topicId),
    staleTime: 60 * 1000,
  })
}

export function useSetPrerequisites(topicId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (prerequisiteIds: string[]) =>
      topicService.setPrerequisites(topicId, prerequisiteIds),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['topic-prerequisites', topicId] })
      void queryClient.invalidateQueries({ queryKey: ['learning-graph'] })
    },
  })
}

export function useLearningGraph() {
  return useQuery({
    queryKey: ['learning-graph'],
    queryFn: () => topicService.getLearningGraph(),
    staleTime: 60 * 1000,
  })
}

export function useAllTopicBadgeStats(topicIds: string[]) {
  return useQuery({
    queryKey: ['badge-stats', topicIds],
    queryFn: () =>
      Promise.all(
        topicIds.map(id => topicService.getTopicBadgeStats(id).then(s => ({ topicId: id, ...s }))),
      ),
    enabled: topicIds.length > 0,
    staleTime: 60 * 1000,
  })
}

export function useTopicExplanations(topicId: string) {
  return useQuery({
    queryKey: ['topic-explanations', topicId],
    queryFn: () => topicService.getTopicExplanations(topicId),
    enabled: Boolean(topicId),
    staleTime: 0,
  })
}
