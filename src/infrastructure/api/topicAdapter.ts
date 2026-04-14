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
    const response = await apiClient.get<Topic[]>('/admin/topics', { params })
    return response.data
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
