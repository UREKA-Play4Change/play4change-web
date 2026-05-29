import apiClient from './apiClient'
import type { IUserService } from '@/domain/ports/UserPort'
import type { AdminUserFull, AdminUserPage } from '@/domain/models/User'

export class UserAdapter implements IUserService {
  async listUsers(page: number, size: number): Promise<AdminUserPage> {
    const { data } = await apiClient.get<AdminUserPage>('/admin/users', {
      params: { page, size },
    })
    return data
  }

  async promoteUser(userId: string): Promise<AdminUserFull> {
    const { data } = await apiClient.post<AdminUserFull>(`/admin/users/${userId}/promote`)
    return data
  }
}
