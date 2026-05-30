import type {
  AdaptiveTaskAdmin,
  CreateTopicFromUrlRequest,
  LearningGraph,
  PrerequisiteTopic,
  TaskTemplate,
  Topic,
  TopicBadgeStats,
  TopicStatus,
  UpdateTaskRequest,
} from '@/domain/models/Topic'
import type { ITopicService } from '@/domain/ports/TopicPort'
import apiClient from './apiClient'

export class TopicAdapter implements ITopicService {
  async createFromUrl(request: CreateTopicFromUrlRequest): Promise<Topic> {
    const response = await apiClient.post<Topic>('/admin/topics', request)
    return response.data
  }

  async createFromPdf(formData: FormData): Promise<Topic> {
    const response = await apiClient.post<Topic>('/admin/topics/pdf', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  }

  async listMyTopics(status?: TopicStatus): Promise<Topic[]> {
    const params = status ? { status } : {}
    const response = await apiClient.get<unknown>('/admin/topics', { params })
    const raw = response.data
    if (Array.isArray(raw)) return raw as Topic[]
    if (
      raw !== null &&
      typeof raw === 'object' &&
      'content' in raw &&
      Array.isArray((raw as { content: unknown }).content)
    ) {
      return (raw as { content: Topic[] }).content
    }
    return []
  }

  async getTopicById(id: string): Promise<Topic> {
    const response = await apiClient.get<Topic>(`/admin/topics/${id}`)
    return response.data
  }

  async regenerateTopic(id: string): Promise<Topic> {
    const response = await apiClient.post<Topic>(`/admin/topics/${id}/regenerate`)
    return response.data
  }

  async getTopicTasks(topicId: string): Promise<TaskTemplate[]> {
    const response = await apiClient.get<TaskTemplate[]>(`/admin/topics/${topicId}/tasks`)
    return response.data
  }

  async getTopicStruggleTasks(topicId: string): Promise<AdaptiveTaskAdmin[]> {
    const response = await apiClient.get<AdaptiveTaskAdmin[]>(
      `/admin/topics/${topicId}/struggle-tasks`,
    )
    return response.data
  }

  async updateTask(templateId: string, request: UpdateTaskRequest): Promise<TaskTemplate> {
    const response = await apiClient.put<TaskTemplate>(`/admin/tasks/${templateId}`, request)
    return response.data
  }

  async getPrerequisites(topicId: string): Promise<PrerequisiteTopic[]> {
    const response = await apiClient.get<PrerequisiteTopic[]>(
      `/admin/topics/${topicId}/prerequisites`,
    )
    return response.data
  }

  async setPrerequisites(topicId: string, prerequisiteIds: string[]): Promise<PrerequisiteTopic[]> {
    const response = await apiClient.post<PrerequisiteTopic[]>(
      `/admin/topics/${topicId}/prerequisites`,
      {
        prerequisiteIds,
      },
    )
    return response.data
  }

  async getLearningGraph(): Promise<LearningGraph> {
    const response = await apiClient.get<LearningGraph>('/admin/learning-graph')
    return response.data
  }

  async getTopicBadgeStats(topicId: string): Promise<TopicBadgeStats> {
    const response = await apiClient.get<TopicBadgeStats>(`/admin/topics/${topicId}/badges`)
    return response.data
  }
}
