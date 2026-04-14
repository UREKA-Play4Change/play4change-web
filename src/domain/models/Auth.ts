export type OAuthProvider = 'GOOGLE' | 'FACEBOOK'

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface AdminUser {
  id: string
  email: string
  name: string
}
