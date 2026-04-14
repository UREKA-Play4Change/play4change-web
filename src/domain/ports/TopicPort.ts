import type { CreateTopicFromUrlRequest, Topic, TopicStatus } from '../models/Topic'

export interface ITopicService {
  createFromUrl(request: CreateTopicFromUrlRequest): Promise<Topic>
  createFromPdf(formData: FormData): Promise<Topic>
  listMyTopics(status?: TopicStatus): Promise<Topic[]>
  getTopicById(id: string): Promise<Topic>
  regenerateTopic(id: string): Promise<Topic>
}
