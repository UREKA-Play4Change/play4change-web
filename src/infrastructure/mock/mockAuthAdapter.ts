import type { AdminUser, AuthTokens, OAuthProvider } from '@/domain/models/Auth'
import type { IAuthService } from '@/domain/ports/AuthPort'

const delay = (ms = 500) => new Promise(r => setTimeout(r, ms))

const MOCK_USER: AdminUser = {
  id: 'admin-001',
  email: 'admin@play4change.org',
  name: 'Admin User',
}

const MOCK_TOKENS: AuthTokens = {
  accessToken: 'mock-access-token-abc123',
  refreshToken: 'mock-refresh-token-xyz789',
}

export class MockAuthAdapter implements IAuthService {
  async sendMagicLink(_email: string): Promise<void> {
    await delay()
    // In mock mode, magic link is "sent" successfully
  }

  async verifyMagicLink(_token: string): Promise<AuthTokens> {
    await delay()
    return { ...MOCK_TOKENS }
  }

  async loginWithOAuth(_provider: OAuthProvider, _credential: string): Promise<AuthTokens> {
    await delay()
    return { ...MOCK_TOKENS }
  }

  async refreshToken(_refreshToken: string): Promise<AuthTokens> {
    await delay(200)
    return { ...MOCK_TOKENS }
  }

  async logout(_refreshToken: string): Promise<void> {
    await delay(200)
  }

  async getCurrentUser(): Promise<AdminUser> {
    await delay(300)
    return { ...MOCK_USER }
  }
}
