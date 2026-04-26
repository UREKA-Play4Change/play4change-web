# Mock Notes — Play4Change Web

This document lists every mock/hardcoded value in the frontend, how to find it, and how to switch to real data.

---

## The One Switch

```env
# .env.development
VITE_USE_MOCK=true   # All data comes from mock adapters 

# .env.production
VITE_USE_MOCK=false  # All data comes from the real API
```

Set `VITE_USE_MOCK=false` (or leave it unset, defaulting to false) to use the real backend. **No code changes are required.**

---

## Mock Adapter Locations

| Context | File | What it mocks |
|---------|------|---------------|
| Auth | `src/infrastructure/mock/mockAuthAdapter.ts` | sendMagicLink, verifyMagicLink, loginWithOAuth, refreshToken, logout, getCurrentUser |
| Topics | `src/infrastructure/mock/mockTopicAdapter.ts` | createFromUrl, createFromPdf, listMyTopics, getTopicById, regenerateTopic |
| Stats | `src/infrastructure/mock/mockStatsAdapter.ts` | getPlatformStats |

---

## Hardcoded Mock Data

### `mockAuthAdapter.ts`
```typescript
MOCK_USER = { id: 'admin-001', email: 'admin@play4change.org', name: 'Admin User' }
MOCK_TOKENS = { accessToken: 'mock-access-token-abc123', refreshToken: 'mock-refresh-token-xyz789' }
```

### `mockStatsAdapter.ts`
```typescript
MOCK_STATS = { totalUsers: 2847, activeTopics: 14, tasksCompleted: 38621 }
```

### `mockTopicAdapter.ts`
7 pre-seeded topics about sustainability and digital literacy:
- "Introduction to Sustainable Development Goals" (ACTIVE)
- "Digital Literacy Fundamentals for the Modern Workplace" (ACTIVE)
- "Circular Economy Principles and Business Models" (ACTIVE)
- "AI Ethics and Responsible Technology Use" (GENERATING)
- "Climate Change Science and Policy Responses" (ACTIVE)
- "Open Source Collaboration and Community Building" (PENDING)
- "Green Computing and Energy-Efficient Software Design" (FAILED)

New topics created via the form are added to the in-memory array for the session lifetime.

---

## Simulated Delays

All mock adapters include artificial delays to simulate real network latency:

| Operation | Delay |
|-----------|-------|
| Auth (getCurrentUser, verifyMagicLink) | 300–500ms |
| Auth (logout, refresh) | 200ms |
| Stats | 400ms |
| Topics (list, get) | 300–500ms |
| Topics (create from URL) | 800ms |
| Topics (create from PDF) | 1200ms |
| Topics (regenerate) | 600ms |

---

## Mocked Endpoints → Real API Mapping

| Mock method | Real endpoint | Notes |
|-------------|--------------|-------|
| `sendMagicLink(email)` | `POST /auth/magic-link` | Body: `{ email }` |
| `verifyMagicLink(token)` | `POST /auth/magic-link/verify` | Body: `{ token }` |
| `loginWithOAuth(provider, credential)` | `POST /auth/oauth` | Body: `{ provider, credential }` |
| `refreshToken(refreshToken)` | `POST /auth/refresh` | Body: `{ refreshToken }` |
| `logout(refreshToken)` | `POST /auth/logout` | Body: `{ refreshToken }` |
| `getCurrentUser()` | `GET /admin/me` | Requires Bearer token |
| `getPlatformStats()` | `GET /api/stats/public` | No auth required |
| `listMyTopics(status?)` | `GET /admin/topics?status={status}` | Filters to current admin |
| `getTopicById(id)` | `GET /admin/topics/{id}` | |
| `createFromUrl(request)` | `POST /admin/topics` | JSON body |
| `createFromPdf(formData)` | `POST /admin/topics/pdf` | multipart/form-data |
| `regenerateTopic(id)` | `POST /admin/topics/{id}/regenerate` | |

---

## Steps to Switch from Mock to Real

1. Set `VITE_USE_MOCK=false` in your environment (or update `.env.development`).
2. Set `VITE_API_BASE_URL` to your backend URL (e.g. ngrok tunnel or production URL).
3. Ensure the backend endpoints listed above are implemented and accepting the documented request shapes.
4. The DI container (`src/infrastructure/di/container.ts`) will automatically create real adapter instances.
5. Run `npm run dev` — all hooks will now make real HTTP calls.
