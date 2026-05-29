import type { IUserService } from '@/domain/ports/UserPort'
import type { AdminUserFull, AdminUserPage } from '@/domain/models/User'

const delay = (ms = 300) => new Promise(r => setTimeout(r, ms))

const MOCK_USERS: AdminUserFull[] = [
  {
    id: 'user-001',
    email: 'alice@example.com',
    name: 'Alice Smith',
    role: 'ADMIN',
    createdAt: '2026-01-10T09:00:00Z',
    enrollmentCount: 5,
  },
  {
    id: 'user-002',
    email: 'bob@example.com',
    name: 'Bob Jones',
    role: 'USER',
    createdAt: '2026-02-14T12:00:00Z',
    enrollmentCount: 3,
  },
  {
    id: 'user-003',
    email: 'carol@example.com',
    name: null,
    role: 'USER',
    createdAt: '2026-03-20T08:30:00Z',
    enrollmentCount: 0,
  },
]

export class MockUserAdapter implements IUserService {
  private users = MOCK_USERS.map(u => ({ ...u }))

  async listUsers(page: number, size: number): Promise<AdminUserPage> {
    await delay()
    const start = page * size
    return {
      content: this.users.slice(start, start + size),
      page,
      size,
      totalElements: this.users.length,
      totalPages: Math.ceil(this.users.length / size),
    }
  }

  async promoteUser(userId: string): Promise<AdminUserFull> {
    await delay()
    const user = this.users.find(u => u.id === userId)
    if (!user) throw new Error(`User ${userId} not found`)
    user.role = 'ADMIN'
    return user
  }
}
