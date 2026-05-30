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
} from '../models/Topic'

export interface ITopicService {
  createFromUrl(request: CreateTopicFromUrlRequest): Promise<Topic>
  createFromPdf(formData: FormData): Promise<Topic>
  listMyTopics(status?: TopicStatus): Promise<Topic[]>
  getTopicById(id: string): Promise<Topic>
  regenerateTopic(id: string): Promise<Topic>
  getTopicTasks(topicId: string): Promise<TaskTemplate[]>
  getTopicStruggleTasks(topicId: string): Promise<AdaptiveTaskAdmin[]>
  updateTask(templateId: string, request: UpdateTaskRequest): Promise<TaskTemplate>
  getPrerequisites(topicId: string): Promise<PrerequisiteTopic[]>
  setPrerequisites(topicId: string, prerequisiteIds: string[]): Promise<PrerequisiteTopic[]>
  getLearningGraph(): Promise<LearningGraph>
  getTopicBadgeStats(topicId: string): Promise<TopicBadgeStats>
}
