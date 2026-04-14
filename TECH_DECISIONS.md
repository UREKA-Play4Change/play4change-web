# Technology Decisions — Play4Change Web

This document records the technology choices made for the Play4Change Web platform, with brief rationale and comparison to alternatives considered. Written for the ISEL Final Year Project report.

---

## React 18 vs. Next.js, Vue, Svelte

**Chosen: React 18**

| | React | Next.js | Vue 3 | Svelte |
|--|-------|---------|-------|--------|
| SSR/SSG | Opt-in (Vite SSR) | Built-in | Opt-in (Nuxt) | SvelteKit |
| Bundle size | Medium | Larger | Smaller | Smallest |
| Ecosystem | Largest | Built on React | Large | Growing |
| TypeScript | Excellent | Excellent | Good | Good |
| Learning curve | Medium | Higher | Medium | Low |
| Job market | Dominant | High | High | Niche |

**Rationale:** The platform has no SEO requirement for the admin dashboard, and the landing page's SEO needs are minimal (no content-heavy pages requiring SSR for indexing). React's ecosystem maturity, team familiarity, and the breadth of integrations (TanStack Query, React Router, testing libraries) made it the pragmatic choice. Next.js was considered but rejected because it adds server infrastructure complexity (Lambda functions or Edge runtime) that is unnecessary for a static + SPA deployment on Cloudflare Pages.

---

## Vite 6 vs. Webpack (CRA), Turbopack

**Chosen: Vite 6**

| | Vite | CRA (Webpack) | Turbopack |
|--|------|---------------|-----------|
| Dev start time | ~300ms | ~10-30s | ~1s |
| HMR speed | Near-instant | Slow on large projects | Fast |
| Config complexity | Low | Moderate (ejected) | Low |
| Maturity | High | Deprecated | Beta |
| Plugin ecosystem | Rich | Rich | Growing |

**Rationale:** Vite's native ESM dev server provides instant hot module replacement and sub-second startup times. CRA (Create React App) is officially deprecated. Turbopack (Next.js bundler) is still in beta. Vite has become the industry standard for new React projects. The `@tailwindcss/vite` plugin integrates Tailwind CSS v4 directly into the build pipeline without additional PostCSS configuration.

---

## TanStack Query v5 vs. SWR, RTK Query, plain fetch

**Chosen: TanStack Query v5**

| | TanStack Query | SWR | RTK Query | plain fetch |
|--|---------------|-----|-----------|-------------|
| Cache management | Excellent | Good | Excellent | Manual |
| Mutations + invalidation | Built-in | Limited | Built-in | Manual |
| DevTools | Yes | No | Yes (Redux) | No |
| Bundle size | ~13KB | ~4KB | ~10KB + Redux | 0 |
| TypeScript | Excellent | Good | Excellent | Manual |
| Optimistic updates | Built-in | Manual | Built-in | Manual |

**Rationale:** The admin dashboard requires both queries (topic list, stats) and mutations (create topic, regenerate). TanStack Query provides a unified API for both, with automatic cache invalidation after mutations (`invalidateQueries`). SWR is focused on read-only data and lacks the mutation lifecycle. RTK Query would require adopting Redux, which is overkill for this project's state complexity. Plain fetch would require manually implementing loading/error states, caching, and deduplication — TanStack Query provides all of this out of the box.

---

## Tailwind CSS v4 vs. CSS Modules, styled-components, vanilla CSS

**Chosen: Tailwind CSS v4**

| | Tailwind CSS v4 | CSS Modules | styled-components | vanilla CSS |
|--|----------------|-------------|-------------------|-------------|
| Productivity | High | Medium | Medium | Low |
| Bundle size | Minimal (purged) | Small | Medium (runtime) | Minimal |
| Design consistency | Excellent | Manual | Good | Manual |
| Responsive | Built-in utilities | Manual | Manual | Manual |
| Runtime cost | None | None | Yes (CSS-in-JS) | None |
| Learning curve | Low-Medium | Low | Medium | Low |

**Rationale:** Tailwind v4 moves configuration from `tailwind.config.js` to the CSS `@theme` block, eliminating JavaScript build-time configuration entirely. Utility-first CSS enables rapid prototyping while keeping bundle sizes minimal (only used classes are included). styled-components and Emotion have a runtime JS cost which reduces performance, particularly on mobile. CSS Modules provide good isolation but require naming, which slows development and creates cognitive overhead when building design-system-style components. The `glass-card` and `gradient-mesh` custom utilities in `globals.css` show how project-specific patterns are added without breaking Tailwind's model.

---

## Axios vs. fetch

**Chosen: Axios**

| | Axios | fetch |
|--|-------|-------|
| Request/response interceptors | Yes | Manual |
| Automatic JSON parsing | Yes | `response.json()` |
| Request cancellation | Yes | AbortController |
| Error handling | Throws on 4xx/5xx | Must check `ok` |
| Bundle size | ~14KB | 0 (built-in) |
| TypeScript | Good | Good |

**Rationale:** The JWT refresh interceptor is the critical feature. Implementing request/response interceptors with retry logic in plain fetch requires significant boilerplate and careful error handling. Axios's interceptor pattern (`apiClient.interceptors.request.use`, `apiClient.interceptors.response.use`) cleanly separates the token injection and refresh logic from business code. The slightly larger bundle size is justified by the reduced complexity.

---

## React Router v7 vs. TanStack Router, wouter

**Chosen: React Router v7**

| | React Router v7 | TanStack Router | wouter |
|--|-----------------|-----------------|--------|
| Maturity | Highest | High | Medium |
| Bundle size | ~11KB | ~13KB | ~2KB |
| TypeScript | Good | Excellent | Good |
| Nested layouts | Yes | Yes | Limited |
| Code splitting | Yes | Yes | Manual |

**Rationale:** React Router v7 is the standard for React SPAs. Its `<Outlet>` pattern for nested layouts (PublicLayout wrapping landing/download, AdminLayout wrapping protected pages) cleanly separates concerns. TanStack Router has better TypeScript support but is newer and less battle-tested. wouter is minimal but lacks nested layout support.

---

## Cloudflare Pages vs. Vercel, Netlify

**Chosen: Cloudflare Pages**

| | Cloudflare Pages | Vercel | Netlify |
|--|-----------------|--------|---------|
| Free tier | 500 builds/month | 100 builds/month | 300 build min/month |
| CDN | 275+ PoPs globally | ~80 PoPs | ~80 PoPs |
| Build speed | Fast | Fast | Medium |
| GitHub integration | Yes | Yes | Yes |
| Edge functions | Yes (Workers) | Yes | Yes |
| Custom domains | Free + automatic HTTPS | Free | Free |
| University/student | Generous free tier | Student packs | Standard |

**Rationale:** Cloudflare Pages deploys to Cloudflare's global network (275+ points of presence) which ensures low latency for users across Portugal and Europe — relevant for an ISEL project. The free tier is more generous than Vercel's for build minutes. Deployment uses `wrangler pages deploy` via GitHub Actions, keeping the CI/CD pipeline straightforward. There is no server-side rendering requirement, so the static SPA deployment model is perfectly matched.

---

## TypeScript Strict Mode

All TypeScript files compile in strict mode with `noUnusedLocals`, `noUnusedParameters`, and `noFallthroughCasesInSwitch`. This catches bugs early and produces cleaner documentation of intent. The ESLint config adds `@typescript-eslint/no-explicit-any` and `no-console` rules for additional safety.
