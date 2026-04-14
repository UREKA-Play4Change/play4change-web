# Architecture — Play4Change Web

## 1. Overview

Play4Change Web is built following **Hexagonal Architecture** (also known as Ports and Adapters), layered on top of a clean separation between domain, application, infrastructure, and UI concerns. This approach was chosen deliberately for a Final Year Project context because it:

- Makes the codebase **testable without a running backend** (swap real adapters for mock ones).
- **Documents the API contract explicitly** in TypeScript interfaces, so backend development and frontend development can proceed in parallel.
- Demonstrates **architectural maturity** expected of a senior engineering artefact.
- Makes it trivial to present different "modes" (mock vs. real) during demos.

---

## 2. Layer Map

```
┌─────────────────────────────────────────────────────────┐
│                     UI Layer (React)                    │
│  pages/  layouts/  components/  hooks/ (ui)             │
└────────────────────────┬────────────────────────────────┘
                         │  uses
┌────────────────────────▼────────────────────────────────┐
│               Application Layer                         │
│  application/hooks/  (TanStack Query wrappers)          │
└────────────────────────┬────────────────────────────────┘
                         │  calls
┌────────────────────────▼────────────────────────────────┐
│                 Domain Layer (Pure TS)                  │
│  domain/models/  domain/ports/ (interfaces)             │
└───────────┬─────────────────────────────┬───────────────┘
            │                             │
  ┌─────────▼──────────┐     ┌────────────▼──────────────┐
  │  Real Adapters     │     │  Mock Adapters            │
  │  infrastructure/   │     │  infrastructure/          │
  │  api/              │     │  mock/                    │
  └────────────────────┘     └───────────────────────────┘
            │                             │
            └──────────────┬──────────────┘
                           │  selected by
              ┌────────────▼────────────────┐
              │  DI Container               │
              │  infrastructure/di/         │
              │  container.ts               │
              └─────────────────────────────┘
```

---

## 3. Domain Layer (`src/domain/`)

The domain layer contains **pure TypeScript** — no React, no Axios, no framework. It has two subdirectories:

### `domain/models/`
Value objects and entities:

| File | Contains |
|------|----------|
| `Auth.ts` | `OAuthProvider`, `AuthTokens`, `AdminUser` |
| `Topic.ts` | `Topic`, `TopicStatus`, `TopicDifficulty`, `TopicStats`, `CreateTopicFromUrlRequest` |
| `Stats.ts` | `PlatformStats` |
| `Enrollment.ts` | `EnrollmentSummary` |
| `User.ts` | `AdminUser` (standalone) |

### `domain/ports/`
Inbound/outbound interfaces (the "ports"):

| File | Interface | Purpose |
|------|-----------|---------|
| `AuthPort.ts` | `IAuthService` | Magic link, OAuth, token refresh, logout, current user |
| `TopicPort.ts` | `ITopicService` | CRUD for admin topics, PDF/URL creation, regeneration |
| `StatsPort.ts` | `IStatsService` | Public platform statistics |

**Why interfaces and not classes?** The domain doesn't know whether it's talking to a real API, a mock, or a test double. The port contracts define *what* is needed; the adapters define *how*.

---

## 4. Infrastructure Layer (`src/infrastructure/`)

### Real Adapters (`infrastructure/api/`)
Implement the port interfaces using Axios. All calls go through the shared `apiClient` instance.

- `apiClient.ts` — Axios singleton. Request interceptor injects `Authorization: Bearer {token}`. Response interceptor handles 401 → refresh → retry (with queued subscriber pattern to prevent duplicate refresh calls).
- `authAdapter.ts` → `IAuthService`
- `topicAdapter.ts` → `ITopicService`
- `statsAdapter.ts` → `IStatsService`

### Mock Adapters (`infrastructure/mock/`)
Implement the same interfaces using in-memory state with artificial delays (300–1200ms) to simulate real network latency. All mock data is sustainability/digital-literacy themed.

### DI Container (`infrastructure/di/container.ts`)
```typescript
const useMock = import.meta.env.VITE_USE_MOCK === 'true'

export const container = useMock
  ? { authService: new MockAuthAdapter(), ... }
  : { authService: new AuthAdapter(), ... }
```
**One env var switches the entire data layer.** No code changes, no test doubles, no conditional imports scattered across components.

---

## 5. Application Layer (`src/application/`)

TanStack Query hooks wrap service calls through the container. They are the **only** place where `container.authService`, `container.topicService`, or `container.statsService` are referenced.

```
useCurrentUser()       → container.authService.getCurrentUser()
usePlatformStats()     → container.statsService.getPlatformStats()
useTopics(status?)     → container.topicService.listMyTopics(status)
useCreateTopicFromUrl() → container.topicService.createFromUrl(request)
```

Mutations call `invalidateQueries()` on success, keeping the cache fresh without manual re-fetching.

**Why TanStack Query and not useState + useEffect?** TanStack Query provides cache deduplication, background refetch, stale-while-revalidate, loading/error states, and mutation lifecycle — all without boilerplate. See `TECH_DECISIONS.md` for the comparison.

---

## 6. UI Layer (`src/ui/`)

The UI layer **never imports from `infrastructure/` directly**. It only consumes:
- Hooks from `application/hooks/`
- Types from `domain/models/`
- Constants from `lib/`

### Layouts
- `PublicLayout` — frosted-glass header + footer with ISEL/U!REKA logos
- `AdminLayout` — 64px sticky sidebar (desktop) + hamburger overlay (mobile)

### Pages
| Route | Component | Auth |
|-------|-----------|------|
| `/` | `LandingPage` | Public |
| `/download` | `DownloadPage` | Public |
| `/admin/login` | `LoginPage` | Public |
| `/admin/dashboard` | `DashboardPage` | Protected |
| `/admin/topics` | `TopicListPage` | Protected |
| `/admin/topics/:id` | `TopicDetailPage` | Protected |
| `/admin/topics/new` | `CreateTopicPage` | Protected |

### Route Protection
`ProtectedRoute` uses `useCurrentUser()` (which calls `getCurrentUser()` via the container). If the query returns an error or null user, it redirects to `/admin/login`.

### Code Splitting
All admin routes and the landing/download pages are lazy-loaded via `React.lazy()`. The router wraps them in `<Suspense>`. This keeps the initial bundle small (~70KB gzipped) and loads admin code only when needed.

---

## 7. JWT Security Approach

Tokens are stored in a **module-level variable** in `apiClient.ts` — never in `localStorage` or `sessionStorage`.

**Why not localStorage?**
- `localStorage` is accessible by any JavaScript on the page, making it vulnerable to XSS attacks.
- Module-level variables are wiped on page refresh (acceptable for an admin tool) and are not accessible from injected scripts.

**Refresh flow:**
1. Request interceptor attaches `Authorization: Bearer {accessToken}`.
2. On 401, the response interceptor checks `isRefreshing`.
3. If not refreshing: sets `isRefreshing = true`, calls `/auth/refresh`, updates tokens, replays the failed request.
4. If already refreshing: queues the request via a subscriber array; on refresh success all queued requests are replayed with the new token.
5. On refresh failure: all queued requests are rejected, tokens are cleared, user is redirected to login.

---

## 8. Bounded Contexts

Three bounded contexts in the frontend, mirroring the domain models:

| Context | Models | Port | Adapter | Hook |
|---------|--------|------|---------|------|
| **Auth** | `AuthTokens`, `AdminUser`, `OAuthProvider` | `IAuthService` | `AuthAdapter` / `MockAuthAdapter` | `useAuth.ts` |
| **Topics** | `Topic`, `TopicStats`, `TopicDifficulty`, `TopicStatus` | `ITopicService` | `TopicAdapter` / `MockTopicAdapter` | `useTopics.ts` |
| **Stats** | `PlatformStats` | `IStatsService` | `StatsAdapter` / `MockStatsAdapter` | `useStats.ts` |

---

## 9. Folder Structure Rationale

```
src/
├── domain/          # Pure TypeScript — no framework deps (testable anywhere)
├── application/     # Use cases exposed as React hooks
├── infrastructure/  # External world: real API, mocks, DI
├── ui/              # React components, pages, layouts
└── lib/             # Pure utilities: formatters, validators, constants
```

This structure maps directly to the Hexagonal Architecture concept:
- **Domain** = the hexagon core
- **Application** = orchestration
- **Infrastructure** = the adapters (plugging into the hexagon)
- **UI** = another adapter (the primary/driving side)
