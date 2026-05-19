import type { AdminUser, AuthTokens, OAuthProvider } from '@/domain/models/Auth'
import type { IAuthService } from '@/domain/ports/AuthPort'
import apiClient from './apiClient'

export class AuthAdapter implements IAuthService {
  async sendMagicLink(email: string): Promise<void> {
    await apiClient.post('/auth/magic-link', { email })
  }

  async verifyMagicLink(token: string): Promise<AuthTokens> {
    const response = await apiClient.post<AuthTokens>('/auth/magic-link/verify', { token })
    return response.data
  }

  async loginWithOAuth(provider: OAuthProvider, credential: string): Promise<AuthTokens> {
    const response = await apiClient.post<AuthTokens>('/auth/oauth', { provider, credential })
    return response.data
  }

  async refreshToken(refreshToken: string): Promise<AuthTokens> {
    const response = await apiClient.post<AuthTokens>('/auth/refresh', { refreshToken })
    return response.data
  }

  async logout(refreshToken: string): Promise<void> {
    await apiClient.post('/auth/logout', { refreshToken })
  }

  async getCurrentUser(): Promise<AdminUser> {
    const response = await apiClient.get<AdminUser>('/admin/me')
    return response.data
  }
}
