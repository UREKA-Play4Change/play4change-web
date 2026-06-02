export interface AuthTokens {
  accessToken: string
  refreshToken: string
  expiresIn: number
}

export interface AdminUser {
  id: string
  email: string
  name: string
}
