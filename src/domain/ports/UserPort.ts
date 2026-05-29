import type { AdminUserFull, AdminUserPage } from '../models/User'

export interface IUserService {
  listUsers(page: number, size: number): Promise<AdminUserPage>
  promoteUser(userId: string): Promise<AdminUserFull>
}
