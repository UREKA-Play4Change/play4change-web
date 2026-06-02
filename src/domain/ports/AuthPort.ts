import type { AdminUser, AuthTokens } from '../models/Auth'

export interface IAuthService {
  sendMagicLink(email: string): Promise<void>
  verifyMagicLink(token: string): Promise<AuthTokens>
  refreshToken(refreshToken: string): Promise<AuthTokens>
  logout(refreshToken: string): Promise<void>
  getCurrentUser(): Promise<AdminUser>
}
