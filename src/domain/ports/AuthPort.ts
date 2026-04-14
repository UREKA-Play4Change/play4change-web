import type { AdminUser, AuthTokens, OAuthProvider } from '../models/Auth'

export interface IAuthService {
  sendMagicLink(email: string): Promise<void>
  verifyMagicLink(token: string): Promise<AuthTokens>
  loginWithOAuth(provider: OAuthProvider, credential: string): Promise<AuthTokens>
  refreshToken(refreshToken: string): Promise<AuthTokens>
  logout(refreshToken: string): Promise<void>
  getCurrentUser(): Promise<AdminUser>
}
