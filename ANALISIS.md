# ANALISIS — Admin Topic Creation: End-to-End Reality

> **Scope:** Everything required to make admin topic creation work against a real backend, including Cloudflare tunnel wiring, GitHub secrets, exact backend contract (endpoints + request/response), and a precise description of admin capabilities.

---

## 1. WHERE WE ARE RIGHT NOW

The frontend is fully built and production-ready in terms of UI and architecture.

| Layer | State |
|---|---|
| Admin UI (CreateTopicPage, TopicListPage, TopicDetailPage) | Complete |
| API adapters (real Axios-based) | Complete — wired but pointing at nothing |
| DI container (mock/real switch) | Complete — `VITE_USE_MOCK` toggles it |
| Authentication flow (magic link, OAuth, token refresh) | Complete on frontend |
| Backend | **Does not exist yet** |
| Cloudflare tunnel | **Not configured** |
| GitHub secrets | **Not set** |

The only thing standing between a demo and a real product is the backend + tunnel wiring.

---

## 2. WHAT THE ADMIN CAN DO (Expected UX)

This is the complete set of actions the admin will perform in the browser, and what each one requires from the backend.

### 2.1 Login

**How:** Admin goes to `/admin/login`, enters their email, clicks "Send Magic Link".
**What happens:**
1. Frontend POSTs to `/auth/magic-link` → backend sends an email with a one-time link.
2. Admin clicks the link in their email, which hits `/admin/login?token=<TOKEN>`.
3. Frontend POSTs to `/auth/magic-link/verify` with the token.
4. Backend returns `accessToken` + `refreshToken`.
5. Admin is redirected to `/admin/dashboard`.

**Session:** Tokens are held in memory (not localStorage). Refreshing the page requires re-login unless a persistent cookie strategy is added to the backend.

---

### 2.2 Dashboard

**Route:** `/admin/dashboard`
**What the admin sees:**
- Total enrolled users
- Number of active topics
- Tasks completed count
- Last 3 created topics (title, status badge)
- Quick action buttons: "Create Topic", "View All Topics"

**Backend required:** `GET /admin/me` (user info) + `GET /api/stats/public` (platform stats) + `GET /admin/topics` (recent 3 topics).

---

### 2.3 Create a Topic from URL

**Route:** `/admin/topics/new`
**What the admin fills in:**

| Field | Type | Required | Constraints |
|---|---|---|---|
| Title | text | yes | non-empty |
| Description | textarea | yes | non-empty |
| Category | text | yes | non-empty |
| Content Source | toggle | yes | "URL" or "PDF" |
| URLs (if URL mode) | list of text inputs | yes | 1–5 URLs, each a valid `https://` URL |
| Duration | selector (3–7 days) | yes | integer 3–7 |
| Difficulty | selector | yes | `BEGINNER` \| `INTERMEDIATE` \| `ADVANCED` |

**What happens on submit:**
1. Frontend validates fields locally.
2. POST `/admin/topics` with JSON body.
3. Backend accepts the request, starts an async AI generation job, and immediately returns the topic object with `status: "PENDING"`.
4. Frontend redirects admin to `/admin/topics/:id` (TopicDetailPage).
5. Admin sees the topic with a "PENDING" or "GENERATING" status badge.
6. Admin can navigate away; the topic will eventually become "ACTIVE".

**The admin does NOT wait on a spinner for AI generation.** The backend must respond fast (< 3 s) and handle generation asynchronously.

---

### 2.4 Create a Topic from PDF

**Route:** `/admin/topics/new` (same page, PDF tab)
**What the admin fills in:** same fields as URL mode but instead of URLs, uploads a single PDF file (max 100 MB).

**What happens on submit:**
1. Frontend validates PDF MIME type (`application/pdf`) and size.
2. POST `/admin/topics/pdf` with `multipart/form-data`.
3. Backend stores the PDF, starts async generation, returns topic with `status: "PENDING"`.
4. Same redirect flow as URL mode.

---

### 2.5 View Topic List

**Route:** `/admin/topics`
**What the admin sees:**
- All topics they created, as cards.
- Filter buttons: ALL | ACTIVE | GENERATING | PENDING | FAILED.
- Status badge on each card (color-coded).
- Clicking a card navigates to TopicDetailPage.
- "Create Topic" button at the top.

**Backend required:** `GET /admin/topics` and `GET /admin/topics?status=ACTIVE` (etc.).

---

### 2.6 View Topic Detail

**Route:** `/admin/topics/:id`
**What the admin sees:**
- Title, description, category, difficulty, duration.
- Status badge.
- Stats grid: enrolled users, completion rate, average score, active users.
- "Regenerate" button (only visible when status is `ACTIVE` or `FAILED`).
- Created date.

**Backend required:** `GET /admin/topics/:id`.

---

### 2.7 Regenerate a Topic

**Action:** Admin clicks "Regenerate" on TopicDetailPage.
**What happens:**
1. POST `/admin/topics/:id/regenerate`.
2. Backend re-triggers AI generation, sets status back to `GENERATING`.
3. Frontend invalidates query cache and shows updated status.

---

## 3. WHAT THE BACKEND MUST IMPLEMENT

Every endpoint below is already called by the real Axios adapters in `src/infrastructure/api/`. The frontend does nothing else; the backend just needs to match this contract exactly.

---

### 3.1 Authentication Endpoints

#### `POST /auth/magic-link`

Sends a magic link email to the given address.

**Request:**
```json
{
  "email": "admin@play4change.org"
}
```

**Response `200 OK`:**
```json
{
  "message": "Magic link sent to admin@play4change.org"
}
```

**Response `400`:**
```json
{ "error": "Invalid email address" }
```

---

#### `POST /auth/magic-link/verify`

Exchanges a one-time token for access + refresh tokens.

**Request:**
```json
{
  "token": "<one-time-token-from-email>"
}
```

**Response `200 OK`:**
```json
{
  "accessToken": "<JWT>",
  "refreshToken": "<opaque-token-or-JWT>"
}
```

**Response `401`:**
```json
{ "error": "Token expired or invalid" }
```

---

#### `POST /auth/oauth`

Handles Google / GitHub OAuth login. The frontend sends the provider credential (Google ID token or GitHub code).

**Request:**
```json
{
  "provider": "google",
  "credential": "<id-token-from-google>"
}
```

**Response `200 OK`:**
```json
{
  "accessToken": "<JWT>",
  "refreshToken": "<opaque-token-or-JWT>"
}
```

---

#### `POST /auth/refresh`

Rotates the access token using the refresh token.

**Request:**
```json
{
  "refreshToken": "<current-refresh-token>"
}
```

**Response `200 OK`:**
```json
{
  "accessToken": "<new-JWT>",
  "refreshToken": "<new-refresh-token>"
}
```

**Response `401`:** refresh token expired — frontend will redirect to `/admin/login`.

---

#### `POST /auth/logout`

Invalidates the refresh token server-side.

**Request:**
```json
{
  "refreshToken": "<refresh-token>"
}
```

**Response `204 No Content`** (no body).

---

#### `GET /admin/me`

Returns the currently authenticated admin's profile.

**Headers required:** `Authorization: Bearer <accessToken>`

**Response `200 OK`:**
```json
{
  "id": "admin-uuid",
  "email": "admin@play4change.org",
  "name": "Admin User"
}
```

**Response `401`:** frontend will attempt token refresh then retry once.

---

### 3.2 Topic Endpoints

All topic endpoints require `Authorization: Bearer <accessToken>`.
The token belongs to the admin; topics are scoped to that admin.

---

#### `GET /admin/topics`

Returns all topics created by the authenticated admin.

**Query params (optional):**
```
?status=PENDING|GENERATING|ACTIVE|FAILED
```

If no `status` param → return all topics.

**Response `200 OK`:**
```json
[
  {
    "id": "topic-uuid-1",
    "title": "Climate Change Fundamentals",
    "description": "An overview of climate science.",
    "category": "Environment",
    "difficulty": "BEGINNER",
    "durationDays": 5,
    "status": "ACTIVE",
    "createdAt": "2025-04-01T10:00:00Z",
    "stats": {
      "enrolledUsers": 142,
      "completionRate": 0.68,
      "averageScore": 74.5,
      "activeUsers": 38
    }
  }
]
```

Empty array `[]` is valid when no topics exist.

---

#### `GET /admin/topics/:id`

Returns a single topic by ID.

**Response `200 OK`:**
```json
{
  "id": "topic-uuid-1",
  "title": "Climate Change Fundamentals",
  "description": "An overview of climate science.",
  "category": "Environment",
  "difficulty": "BEGINNER",
  "durationDays": 5,
  "status": "ACTIVE",
  "createdAt": "2025-04-01T10:00:00Z",
  "stats": {
    "enrolledUsers": 142,
    "completionRate": 0.68,
    "averageScore": 74.5,
    "activeUsers": 38
  }
}
```

**Response `404`:**
```json
{ "error": "Topic not found" }
```

---

#### `POST /admin/topics`

Creates a new topic from URLs. Backend must respond fast — do NOT wait for AI generation.

**Request body (`application/json`):**
```json
{
  "title": "Climate Change Fundamentals",
  "description": "An overview of climate science for beginners.",
  "category": "Environment",
  "urls": [
    "https://example.com/climate-article",
    "https://example.com/ipcc-summary"
  ],
  "durationDays": 5,
  "difficulty": "BEGINNER"
}
```

**Field constraints:**
- `title`: string, non-empty, max 200 chars.
- `description`: string, non-empty, max 2000 chars.
- `category`: string, non-empty, max 100 chars.
- `urls`: array, 1–5 items, each a valid `https://` URL.
- `durationDays`: integer, 3–7 inclusive.
- `difficulty`: one of `"BEGINNER"`, `"INTERMEDIATE"`, `"ADVANCED"`.

**Response `201 Created`:**
```json
{
  "id": "topic-uuid-new",
  "title": "Climate Change Fundamentals",
  "description": "An overview of climate science for beginners.",
  "category": "Environment",
  "difficulty": "BEGINNER",
  "durationDays": 5,
  "status": "PENDING",
  "createdAt": "2025-04-24T14:30:00Z",
  "stats": {
    "enrolledUsers": 0,
    "completionRate": 0,
    "averageScore": 0,
    "activeUsers": 0
  }
}
```

**Response `400`:**
```json
{ "error": "Validation failed", "details": { "urls": "Must provide 1–5 URLs" } }
```

**Backend must:** kick off async AI job (queue, background worker, etc.) and flip status through `PENDING → GENERATING → ACTIVE` (or `FAILED`).

---

#### `POST /admin/topics/pdf`

Creates a new topic from a PDF upload. Backend must respond fast — do NOT wait for AI generation.

**Request:** `multipart/form-data`

| Field | Type | Description |
|---|---|---|
| `file` | File (PDF) | The PDF file. Max 100 MB. MIME: `application/pdf`. |
| `title` | string | Topic title |
| `description` | string | Topic description |
| `category` | string | Topic category |
| `durationDays` | string (parsed to int) | 3–7 |
| `difficulty` | string | `BEGINNER` \| `INTERMEDIATE` \| `ADVANCED` |

**Response `201 Created`:** same shape as `POST /admin/topics`.

**Response `400`:**
```json
{ "error": "Only PDF files are accepted" }
```

**Backend must:** store the PDF (S3, R2, local disk — your choice), then kick off async AI job.

---

#### `POST /admin/topics/:id/regenerate`

Re-triggers AI generation for an existing topic.

**Request body:** empty (no body needed).

**Response `200 OK`:**
```json
{
  "id": "topic-uuid-1",
  "title": "Climate Change Fundamentals",
  "description": "An overview of climate science for beginners.",
  "category": "Environment",
  "difficulty": "BEGINNER",
  "durationDays": 5,
  "status": "GENERATING",
  "createdAt": "2025-04-01T10:00:00Z",
  "stats": {
    "enrolledUsers": 142,
    "completionRate": 0.68,
    "averageScore": 74.5,
    "activeUsers": 38
  }
}
```

**Response `404`:** topic not found.

---

### 3.3 Public Stats Endpoint

#### `GET /api/stats/public`

No authentication required.

**Response `200 OK`:**
```json
{
  "totalUsers": 2847,
  "activeTopics": 14,
  "tasksCompleted": 38621
}
```

---

## 4. CLOUDFLARE TUNNEL — HOW TO WIRE IT

Cloudflare Tunnel lets your local backend be reachable at a public HTTPS URL **without opening firewall ports or buying a VPS**. This is how you connect the deployed frontend on Vercel/Netlify to your local or staging backend during development.

### 4.1 Install `cloudflared`

```bash
# macOS
brew install cloudflared

# or download from: https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/downloads/
```

### 4.2 Authenticate with Cloudflare

```bash
cloudflared tunnel login
# This opens a browser. Log in and authorize your Cloudflare account.
```

### 4.3 Create a Named Tunnel

```bash
cloudflared tunnel create play4change-backend
# This creates a tunnel with a stable UUID and writes credentials to:
# ~/.cloudflared/<TUNNEL-UUID>.json
```

Note the tunnel UUID printed — you need it next.

### 4.4 Create a DNS CNAME Record

```bash
cloudflared tunnel route dns play4change-backend api.play4change.org
# This creates a CNAME: api.play4change.org → <TUNNEL-UUID>.cfargotunnel.com
# You need to own play4change.org and have it on Cloudflare DNS.
```

If you do not have a domain yet, use a temporary URL:
```bash
cloudflared tunnel --url http://localhost:8000
# Cloudflare prints a random https://<random>.trycloudflare.com URL — no account needed.
```

### 4.5 Tunnel Config File

Create `~/.cloudflared/config.yml`:

```yaml
tunnel: <TUNNEL-UUID>
credentials-file: /Users/<you>/.cloudflared/<TUNNEL-UUID>.json

ingress:
  - hostname: api.play4change.org
    service: http://localhost:8000   # ← your backend port
  - service: http_status:404
```

### 4.6 Run the Tunnel

```bash
cloudflared tunnel run play4change-backend
```

Your backend is now reachable at `https://api.play4change.org` from anywhere (including the deployed Vercel frontend).

### 4.7 Run in Production as a Service

```bash
cloudflared service install
# Registers cloudflared as a system service that starts on boot.
```

---

## 5. GITHUB SECRETS — WHAT TO SET

These secrets are used by GitHub Actions CI/CD to build and deploy the frontend with the correct environment variables pointing at the real backend.

Go to: **GitHub → your repo → Settings → Secrets and variables → Actions → New repository secret**

| Secret Name | Value | Used for |
|---|---|---|
| `VITE_API_BASE_URL` | `https://api.play4change.org` | Points frontend at real backend |
| `VITE_USE_MOCK` | `false` | Switches off mock adapters |
| `CLOUDFLARE_API_TOKEN` | (your CF API token) | Only needed if you deploy to Cloudflare Pages |
| `VERCEL_TOKEN` | (your Vercel token) | Only if deploying to Vercel via CI |
| `VERCEL_ORG_ID` | (your Vercel org ID) | Same |
| `VERCEL_PROJECT_ID` | (your Vercel project ID) | Same |

### 5.1 How GitHub Actions Uses These

In your `.github/workflows/deploy.yml`:

```yaml
- name: Build
  env:
    VITE_API_BASE_URL: ${{ secrets.VITE_API_BASE_URL }}
    VITE_USE_MOCK: ${{ secrets.VITE_USE_MOCK }}
  run: npm run build
```

Vite bakes `VITE_*` variables into the static bundle at build time. The built JS will call `https://api.play4change.org` directly from the user's browser.

### 5.2 Local Development (no CI)

Create `.env.local` (git-ignored):
```env
VITE_API_BASE_URL=https://api.play4change.org
VITE_USE_MOCK=false
```

Then `npm run dev` will use the real backend via Cloudflare Tunnel.

---

## 6. SWITCHING FROM MOCK TO REAL — EXACT STEPS

1. Start your backend (`python manage.py runserver 8000`, `node server.js`, etc.).
2. Start Cloudflare Tunnel: `cloudflared tunnel run play4change-backend`.
3. Set `VITE_API_BASE_URL=https://api.play4change.org` and `VITE_USE_MOCK=false` in `.env.local`.
4. `npm run dev`
5. Log in with a real admin account (backend must have a real admin seeded or magic-link flow working).
6. Create a topic → watch it appear in the topic list with `PENDING` status.
7. Backend must update the topic status asynchronously; admin refreshes TopicDetail to see progression.

---

## 7. TOPIC LIFECYCLE — WHAT THE ADMIN SEES AT EACH STEP

| Backend Status | What Admin Sees | Badge Color |
|---|---|---|
| `PENDING` | Topic created, queued for AI | Yellow |
| `GENERATING` | AI is building the topic content | Blue (animated) |
| `ACTIVE` | Topic is live, users can enroll | Green |
| `FAILED` | AI generation failed, retry available | Red |

The frontend already renders all four states. The backend just needs to update `status` in its database as the job progresses. The frontend does not poll automatically — admin must refresh or navigate away and back. If real-time status updates are desired, a `GET /admin/topics/:id` polling hook or WebSocket can be added later.

---

## 8. CORS — MANDATORY BACKEND CONFIG

The deployed frontend (Vercel/Netlify) runs on a different origin from the backend. The backend must set these headers:

```
Access-Control-Allow-Origin: https://your-frontend-domain.vercel.app
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Authorization, Content-Type
Access-Control-Allow-Credentials: true
```

For local dev, also allow: `http://localhost:5173` (Vite dev server default port).

---

## 9. SUMMARY — WHAT NEEDS TO BE BUILT, IN ORDER

1. **Backend auth:** magic link (email sending) + token issuance + `/admin/me`.
2. **Backend topic CRUD:** list, get, create-from-url, create-from-pdf, regenerate.
3. **Backend async AI job:** accepts URLs/PDF → generates topic content → updates status.
4. **Backend public stats:** `/api/stats/public` returning real counts.
5. **Cloudflare Tunnel:** install, authenticate, create tunnel, set DNS, run as service.
6. **GitHub Secrets:** `VITE_API_BASE_URL` + `VITE_USE_MOCK=false`.
7. **CI/CD workflow:** build step uses secrets, deploys to Vercel/CF Pages.
8. **CORS config:** allow frontend origin on all endpoints.
9. **Flip the switch:** set `VITE_USE_MOCK=false` → frontend calls real backend.

The frontend changes required: **zero**. Everything is already wired.
