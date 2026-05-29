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

const delay = (ms = 500) => new Promise(r => setTimeout(r, ms))

const MOCK_TOPICS: Topic[] = [
  {
    id: 'topic-001',
    title: 'Introduction to Sustainable Development Goals',
    description:
      'Explore the 17 SDGs adopted by the United Nations and understand how individuals and organizations can contribute to achieving them by 2030.',
    status: 'ACTIVE',
    difficulty: 'BEGINNER',
    durationDays: 5,
    taskCount: 15,
    language: 'en',
    category: 'Sustainability',
    createdAt: '2025-01-15T10:00:00Z',
    stats: {
      enrolledUsers: 342,
      completionRate: 0.68,
      averageScore: 82.4,
      activeUsers: 89,
    },
  },
  {
    id: 'topic-002',
    title: 'Digital Literacy Fundamentals for the Modern Workplace',
    description:
      "Build essential digital skills for today's connected world, covering cybersecurity awareness, cloud tools, data privacy, and effective online communication.",
    status: 'ACTIVE',
    difficulty: 'BEGINNER',
    durationDays: 7,
    taskCount: 15,
    language: 'en',
    category: 'Digital Literacy',
    createdAt: '2025-01-20T09:30:00Z',
    stats: {
      enrolledUsers: 518,
      completionRate: 0.71,
      averageScore: 78.9,
      activeUsers: 134,
    },
  },
  {
    id: 'topic-003',
    title: 'Circular Economy Principles and Business Models',
    description:
      'Deep dive into circular economy frameworks, exploring how companies redesign products and processes to eliminate waste and regenerate natural systems.',
    status: 'ACTIVE',
    difficulty: 'INTERMEDIATE',
    durationDays: 6,
    taskCount: 15,
    language: 'en',
    category: 'Sustainability',
    createdAt: '2025-02-01T14:00:00Z',
    stats: {
      enrolledUsers: 203,
      completionRate: 0.55,
      averageScore: 74.2,
      activeUsers: 61,
    },
  },
  {
    id: 'topic-004',
    title: 'AI Ethics and Responsible Technology Use',
    description:
      'Understand the ethical dimensions of artificial intelligence, including bias, transparency, accountability, and the societal impact of automated decision-making.',
    status: 'GENERATING',
    difficulty: 'INTERMEDIATE',
    durationDays: 5,
    taskCount: 15,
    language: 'en',
    category: 'Digital Literacy',
    createdAt: '2025-02-10T11:15:00Z',
    stats: {
      enrolledUsers: 0,
      completionRate: 0,
      averageScore: 0,
      activeUsers: 0,
    },
  },
  {
    id: 'topic-005',
    title: 'Climate Change Science and Policy Responses',
    description:
      'Examine the scientific consensus on climate change, current mitigation and adaptation strategies, and the role of international agreements in shaping climate policy.',
    status: 'ACTIVE',
    difficulty: 'ADVANCED',
    durationDays: 7,
    taskCount: 15,
    language: 'en',
    category: 'Sustainability',
    createdAt: '2025-02-15T08:00:00Z',
    stats: {
      enrolledUsers: 156,
      completionRate: 0.42,
      averageScore: 71.8,
      activeUsers: 43,
    },
  },
  {
    id: 'topic-006',
    title: 'Open Source Collaboration and Community Building',
    description:
      'Learn how open source software projects are governed, how to contribute effectively, and how to build inclusive technical communities.',
    status: 'PENDING',
    difficulty: 'BEGINNER',
    durationDays: 4,
    taskCount: 15,
    language: 'en',
    category: 'Digital Literacy',
    createdAt: '2025-02-20T16:45:00Z',
    stats: {
      enrolledUsers: 0,
      completionRate: 0,
      averageScore: 0,
      activeUsers: 0,
    },
  },
  {
    id: 'topic-007',
    title: 'Green Computing and Energy-Efficient Software Design',
    description:
      'Discover how software engineers can reduce the carbon footprint of digital systems through efficient algorithms, sustainable infrastructure choices, and green DevOps practices.',
    status: 'FAILED',
    difficulty: 'ADVANCED',
    durationDays: 6,
    taskCount: 15,
    language: 'en',
    category: 'Sustainability',
    createdAt: '2025-02-25T12:00:00Z',
    stats: {
      enrolledUsers: 0,
      completionRate: 0,
      averageScore: 0,
      activeUsers: 0,
    },
  },
]

const MOCK_TASKS: Record<string, TaskTemplate[]> = {
  'topic-001': [
    {
      id: 'tpl-001-1',
      dayIndex: 0,
      poolIndex: 0,
      title: 'What does SDG stand for?',
      description: 'Select the correct full form of the abbreviation used in the UN 2030 Agenda.',
      hint: 'Think about what the United Nations wants to achieve by 2030.',
      taskType: 'MULTIPLE_CHOICE',
      pointsReward: 20,
      options: [
        'Sustainable Development Goals',
        'Social Development Guidelines',
        'Systematic Design Goals',
        'Shared Development Governance',
      ],
      correctAnswer: 0,
      version: 1,
      language: 'en',
      createdAt: '2025-01-15T10:05:00Z',
      stats: { totalAttempts: 312, successCount: 289, successRate: 0.926, avgPointsAwarded: 18.5 },
    },
    {
      id: 'tpl-001-2',
      dayIndex: 1,
      poolIndex: 0,
      title: 'How many SDGs are there?',
      description: 'Choose the correct number of Sustainable Development Goals adopted in 2015.',
      hint: null,
      taskType: 'MULTIPLE_CHOICE',
      pointsReward: 20,
      options: ['10', '15', '17', '21'],
      correctAnswer: 2,
      version: 1,
      language: 'en',
      createdAt: '2025-01-15T10:06:00Z',
      stats: { totalAttempts: 298, successCount: 261, successRate: 0.876, avgPointsAwarded: 17.5 },
    },
    {
      id: 'tpl-001-3',
      dayIndex: 2,
      poolIndex: 0,
      title: 'Which SDG focuses on clean water?',
      description: 'Identify the correct SDG number dedicated to clean water and sanitation.',
      hint: 'It is one of the basic human needs goals.',
      taskType: 'MULTIPLE_CHOICE',
      pointsReward: 20,
      options: ['SDG 3', 'SDG 6', 'SDG 9', 'SDG 14'],
      correctAnswer: 1,
      version: 2,
      language: 'en',
      createdAt: '2025-01-15T10:07:00Z',
      stats: { totalAttempts: 267, successCount: 198, successRate: 0.741, avgPointsAwarded: 14.8 },
    },
  ],
  'topic-003': [
    {
      id: 'tpl-003-1',
      dayIndex: 0,
      poolIndex: 0,
      title: 'What is the core principle of a circular economy?',
      description: 'Choose the statement that best captures the circular economy concept.',
      hint: 'Think about what happens to products after use.',
      taskType: 'MULTIPLE_CHOICE',
      pointsReward: 20,
      options: [
        'Maximising production output at minimum cost',
        'Eliminating waste by keeping resources in use',
        'Moving manufacturing to lower-cost regions',
        'Reducing all product packaging to zero',
      ],
      correctAnswer: 1,
      version: 1,
      language: 'en',
      createdAt: '2025-02-01T14:05:00Z',
      stats: { totalAttempts: 183, successCount: 129, successRate: 0.705, avgPointsAwarded: 14.1 },
    },
  ],
}

const MOCK_STRUGGLE_TASKS: Record<string, AdaptiveTaskAdmin[]> = {
  'topic-001': [
    {
      id: 'adp-001-1',
      sessionId: 'sess-001',
      sessionStatus: 'RESOLVED',
      errorPattern: 'WRONG_CONCEPT',
      sessionDetectedAt: '2025-03-10T14:22:00Z',
      enrollmentId: 'enr-001',
      title: 'Simpler: What does SDG stand for?',
      description:
        'The letters S, D, G — what do they mean in the context of the United Nations agenda?',
      hint: 'Each letter is the first letter of a word in the phrase.',
      pointsReward: 10,
      orderIndex: 0,
      options: ['Sustainable Development Goals', 'Shared Design Guidelines'],
      correctAnswer: 0,
      isCorrect: true,
      completedAt: '2025-03-10T14:25:00Z',
    },
    {
      id: 'adp-001-2',
      sessionId: 'sess-002',
      sessionStatus: 'OPEN',
      errorPattern: 'PARTIAL_UNDERSTANDING',
      sessionDetectedAt: '2025-04-01T09:10:00Z',
      enrollmentId: 'enr-042',
      title: 'Which goal deals with life on land?',
      description: 'Choose the SDG that specifically addresses terrestrial ecosystems.',
      hint: 'It is one of the last goals in the list.',
      pointsReward: 10,
      orderIndex: 0,
      options: ['SDG 13', 'SDG 15', 'SDG 17'],
      correctAnswer: 1,
      isCorrect: null,
      completedAt: null,
    },
  ],
}

let taskStore: Record<string, TaskTemplate[]> = { ...MOCK_TASKS }

let topicsStore = [...MOCK_TOPICS]
let nextId = topicsStore.length + 1

// In-memory prerequisite graph: topicId → list of prerequisite topicIds
const prerequisiteStore = new Map<string, string[]>([
  ['topic-003', ['topic-001']],
  ['topic-005', ['topic-001', 'topic-003']],
])

export class MockTopicAdapter implements ITopicService {
  async createFromUrl(request: CreateTopicFromUrlRequest): Promise<Topic> {
    await delay(800)
    const newTopic: Topic = {
      id: `topic-${String(nextId++).padStart(3, '0')}`,
      title: request.title,
      description: request.description,
      status: 'PENDING',
      difficulty: request.difficulty,
      durationDays: request.durationDays,
      taskCount: request.taskCount,
      language: request.language,
      category: request.category,
      createdAt: new Date().toISOString(),
      stats: {
        enrolledUsers: 0,
        completionRate: 0,
        averageScore: 0,
        activeUsers: 0,
      },
    }
    topicsStore = [newTopic, ...topicsStore]
    return newTopic
  }

  async createFromPdf(_formData: FormData): Promise<Topic> {
    await delay(1200)
    const newTopic: Topic = {
      id: `topic-${String(nextId++).padStart(3, '0')}`,
      title: 'New Topic from PDF',
      description: 'Topic content extracted and processed from uploaded PDF document.',
      status: 'PENDING',
      difficulty: 'BEGINNER',
      durationDays: 5,
      taskCount: 15,
      language: 'en',
      category: 'General',
      createdAt: new Date().toISOString(),
      stats: {
        enrolledUsers: 0,
        completionRate: 0,
        averageScore: 0,
        activeUsers: 0,
      },
    }
    topicsStore = [newTopic, ...topicsStore]
    return newTopic
  }

  async listMyTopics(status?: TopicStatus): Promise<Topic[]> {
    await delay()
    if (status) {
      return topicsStore.filter(t => t.status === status)
    }
    return topicsStore
  }

  async getTopicById(id: string): Promise<Topic> {
    await delay(300)
    const topic = topicsStore.find(t => t.id === id)
    if (!topic) throw new Error(`Topic not found: ${id}`)
    return topic
  }

  async regenerateTopic(id: string): Promise<Topic> {
    await delay(600)
    const idx = topicsStore.findIndex(t => t.id === id)
    if (idx === -1) throw new Error(`Topic not found: ${id}`)
    const updated: Topic = { ...topicsStore[idx], status: 'GENERATING' }
    topicsStore = topicsStore.map(t => (t.id === id ? updated : t))
    return updated
  }

  async getTopicTasks(topicId: string): Promise<TaskTemplate[]> {
    await delay(400)
    return taskStore[topicId] ?? []
  }

  async getTopicStruggleTasks(topicId: string): Promise<AdaptiveTaskAdmin[]> {
    await delay(400)
    return MOCK_STRUGGLE_TASKS[topicId] ?? []
  }

  async updateTask(templateId: string, request: UpdateTaskRequest): Promise<TaskTemplate> {
    await delay(600)
    for (const topicId of Object.keys(taskStore)) {
      const idx = taskStore[topicId].findIndex(t => t.id === templateId)
      if (idx !== -1) {
        const existing = taskStore[topicId][idx]
        const updated: TaskTemplate = {
          ...existing,
          title: request.title,
          description: request.description,
          hint: request.hint,
          options: request.options,
          correctAnswer: request.correctAnswer,
          version: existing.version + 1,
        }
        taskStore = {
          ...taskStore,
          [topicId]: taskStore[topicId].map(t => (t.id === templateId ? updated : t)),
        }
        return updated
      }
    }
    throw new Error(`TaskTemplate not found: ${templateId}`)
  }

  async getPrerequisites(topicId: string): Promise<PrerequisiteTopic[]> {
    await delay(300)
    const ids = prerequisiteStore.get(topicId) ?? []
    return ids
      .map(id => topicsStore.find(t => t.id === id))
      .filter((t): t is Topic => t != null)
      .map(t => ({ id: t.id, title: t.title, status: t.status, category: t.category }))
  }

  async setPrerequisites(topicId: string, prerequisiteIds: string[]): Promise<PrerequisiteTopic[]> {
    await delay(500)
    prerequisiteStore.set(topicId, prerequisiteIds)
    return prerequisiteIds
      .map(id => topicsStore.find(t => t.id === id))
      .filter((t): t is Topic => t != null)
      .map(t => ({ id: t.id, title: t.title, status: t.status, category: t.category }))
  }

  async getLearningGraph(): Promise<LearningGraph> {
    await delay(400)
    const edges: LearningGraph['edges'] = []
    for (const [topicId, prereqIds] of prerequisiteStore) {
      for (const prereqId of prereqIds) {
        edges.push({ topicId, prerequisiteTopicId: prereqId })
      }
    }
    return { edges }
  }

  async getTopicBadgeStats(topicId: string): Promise<TopicBadgeStats> {
    await delay(300)
    const topic = topicsStore.find(t => t.id === topicId)
    const enrolled = topic?.stats?.enrolledUsers ?? 0
    const issued = Math.floor(enrolled * 0.3)
    return {
      totalIssued: issued,
      enrolledCount: enrolled,
      earnedPercentage: enrolled > 0 ? (issued / enrolled) * 100 : 0,
      recentEarners:
        issued > 0
          ? [
              { userId: 'user-001', earnedAt: '2026-04-10T12:00:00Z' },
              { userId: 'user-002', earnedAt: '2026-04-08T09:30:00Z' },
            ]
          : [],
    }
  }
}
