export interface AdminUser {
  id: string
  email: string
  name: string
}

export interface AdminUserFull {
  id: string
  email: string
  name: string | null
  role: 'USER' | 'ADMIN'
  createdAt: string
  enrollmentCount: number
}

export interface AdminUserPage {
  content: AdminUserFull[]
  page: number
  size: number
  totalElements: number
  totalPages: number
}
