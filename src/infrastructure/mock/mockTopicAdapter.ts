import type { CreateTopicFromUrlRequest, Topic, TopicStatus } from '@/domain/models/Topic'
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

let topicsStore = [...MOCK_TOPICS]
let nextId = topicsStore.length + 1

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
}
