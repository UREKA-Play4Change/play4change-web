import type { CreateTopicFromUrlRequest, Topic, TopicStatus } from '@/domain/models/Topic'
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
      'data' in raw &&
      Array.isArray((raw as { data: unknown }).data)
    ) {
      return (raw as { data: Topic[] }).data
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
}
