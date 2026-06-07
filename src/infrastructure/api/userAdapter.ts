import apiClient from './apiClient'
import type { IUserService } from '@/domain/ports/UserPort'
import type {
  AdminExplanationSession,
  AdminRoadmapNode,
  AdminUserBadge,
  AdminUserDetail,
  AdminUserEnrollment,
  AdminUserFull,
  AdminUserPage,
} from '@/domain/models/User'

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

  async getUserById(userId: string): Promise<AdminUserDetail> {
    const { data } = await apiClient.get<AdminUserDetail>(`/admin/users/${userId}`)
    return data
  }

  async getUserEnrollments(userId: string): Promise<AdminUserEnrollment[]> {
    const { data } = await apiClient.get<AdminUserEnrollment[]>(
      `/admin/users/${userId}/enrollments`,
    )
    return data
  }

  async getUserBadges(userId: string): Promise<AdminUserBadge[]> {
    const { data } = await apiClient.get<AdminUserBadge[]>(`/admin/users/${userId}/badges`)
    return data
  }

  async getUserEnrollmentRoadmap(
    userId: string,
    enrollmentId: string,
  ): Promise<AdminRoadmapNode[]> {
    const { data } = await apiClient.get<AdminRoadmapNode[]>(
      `/admin/users/${userId}/enrollments/${enrollmentId}/roadmap`,
    )
    return data
  }

  async getUserEnrollmentExplanations(
    userId: string,
    enrollmentId: string,
  ): Promise<AdminExplanationSession[]> {
    const { data } = await apiClient.get<AdminExplanationSession[]>(
      `/admin/users/${userId}/enrollments/${enrollmentId}/explanations`,
    )
    return data
  }
}
