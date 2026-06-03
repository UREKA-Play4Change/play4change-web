import type {
  AdminRoadmapNode,
  AdminUserBadge,
  AdminUserDetail,
  AdminUserEnrollment,
  AdminUserFull,
  AdminUserPage,
} from '../models/User'

export interface IUserService {
  listUsers(page: number, size: number): Promise<AdminUserPage>
  promoteUser(userId: string): Promise<AdminUserFull>
  getUserById(userId: string): Promise<AdminUserDetail>
  getUserEnrollments(userId: string): Promise<AdminUserEnrollment[]>
  getUserBadges(userId: string): Promise<AdminUserBadge[]>
  getUserEnrollmentRoadmap(userId: string, enrollmentId: string): Promise<AdminRoadmapNode[]>
}
