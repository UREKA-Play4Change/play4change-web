import type {
  AdaptiveTaskAdmin,
  CreateTopicFromUrlRequest,
  LearningGraph,
  PrerequisiteTopic,
  StrugglePathStats,
  TaskTemplate,
  Topic,
  TopicBadgeStats,
  TopicExplanationSession,
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
  getStrugglePathStats(topicId: string): Promise<StrugglePathStats[]>
  updateTask(templateId: string, request: UpdateTaskRequest): Promise<TaskTemplate>
  updateAdaptiveTask(taskId: string, request: UpdateTaskRequest): Promise<AdaptiveTaskAdmin>
  getPrerequisites(topicId: string): Promise<PrerequisiteTopic[]>
  setPrerequisites(topicId: string, prerequisiteIds: string[]): Promise<PrerequisiteTopic[]>
  getLearningGraph(): Promise<LearningGraph>
  getTopicBadgeStats(topicId: string): Promise<TopicBadgeStats>
  getTopicExplanations(topicId: string): Promise<TopicExplanationSession[]>
}
