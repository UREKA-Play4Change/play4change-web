# API Requirements — Play4Change Web

This document lists the HTTP endpoints the Play4Change web platform requires from the backend server. Endpoints marked ⚠️ may not yet exist or may need to be added/modified.

---

## Authentication

### `POST /auth/magic-link`
**Status:** Standard — likely already planned
**Request:**
```json
{ "email": "admin@play4change.org" }
```
**Response:** `204 No Content` or `{ "message": "Magic link sent" }`
**Notes:** Sends an email with a magic link to the admin.

---

### `POST /auth/magic-link/verify`
**Status:** Standard
**Request:**
```json
{ "token": "eyJh..." }
```
**Response:**
```json
{ "accessToken": "eyJh...", "refreshToken": "eyJh..." }
```

---

### `POST /auth/oauth`
**Status:** Standard
**Request:**
```json
{ "provider": "GOOGLE" | "FACEBOOK", "credential": "google-id-token-or-facebook-access-token" }
```
**Response:**
```json
{ "accessToken": "eyJh...", "refreshToken": "eyJh..." }
```

---

### `POST /auth/refresh`
**Status:** Standard
**Request:**
```json
{ "refreshToken": "eyJh..." }
```
**Response:**
```json
{ "accessToken": "eyJh...", "refreshToken": "eyJh..." }
```
**Notes:** The web app performs token refresh automatically on 401 responses.

---

### `POST /auth/logout`
**Status:** Standard
**Request:**
```json
{ "refreshToken": "eyJh..." }
```
**Response:** `204 No Content`
**Notes:** Should invalidate the refresh token server-side.

---

## Admin Profile

### ⚠️ `GET /admin/me`
**Status:** Required — may not exist yet
**Auth:** Required (Bearer token)
**Response:**
```json
{
  "id": "admin-uuid",
  "email": "admin@play4change.org",
  "name": "Admin User"
}
```
**Notes:** The web app calls this to display the admin's name in the sidebar and dashboard greeting. If it doesn't exist, the name will be empty.

---

## Topics

### `GET /admin/topics`
**Status:** Standard
**Auth:** Required
**Query params:** `?status=ACTIVE|GENERATING|PENDING|FAILED` (optional)
**Response:** `Topic[]` (see schema below)
**Notes:** Should return only topics created by the authenticated admin.

---

### `GET /admin/topics/:id`
**Status:** Standard
**Auth:** Required
**Response:** `Topic` (full object including stats)

---

### `POST /admin/topics`
**Status:** Standard
**Auth:** Required
**Request:**
```json
{
  "title": "string",
  "description": "string",
  "urls": ["https://...", "https://..."],
  "durationDays": 5,
  "difficulty": "BEGINNER" | "INTERMEDIATE" | "ADVANCED",
  "category": "string"
}
```
**Response:** `Topic` (the created topic, status will be PENDING)

---

### `POST /admin/topics/pdf`
**Status:** Standard
**Auth:** Required
**Content-Type:** `multipart/form-data`
**Fields:** `file` (PDF, max 100MB), `title`, `description`, `durationDays`, `difficulty`, `category`
**Response:** `Topic`

---

### `POST /admin/topics/:id/regenerate`
**Status:** May need adding
**Auth:** Required
**Response:** `Topic` (status changed to GENERATING)

---

## ⚠️ Public Statistics

### `GET /api/stats/public`
**Status:** Required — likely does not exist yet
**Auth:** None (public endpoint)
**Response:**
```json
{
  "totalUsers": 2847,
  "activeTopics": 14,
  "tasksCompleted": 38621
}
```
**Notes:** This is called from the public landing page (no authentication). It should aggregate stats across all active topics and users. This is the most likely endpoint to be missing — it needs to be created specifically for the web platform.

---

## Topic Schema

```typescript
interface Topic {
  id: string
  title: string
  description: string
  status: 'PENDING' | 'GENERATING' | 'ACTIVE' | 'FAILED'
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
  durationDays: number
  category: string
  createdAt: string  // ISO 8601
  stats: {
    enrolledUsers: number
    completionRate: number  // 0.0 – 1.0
    averageScore: number    // 0 – 100
    activeUsers: number
    // Additional stats fields are also rendered automatically
  }
}
```

---

## Error Responses

The web platform expects standard HTTP error codes:

| Code | Meaning |
|------|---------|
| `400` | Bad request (validation error) |
| `401` | Unauthorized (triggers token refresh) |
| `403` | Forbidden |
| `404` | Not found |
| `422` | Unprocessable entity (semantic validation) |
| `5xx` | Server error |

All errors should include a JSON body with at minimum `{ "message": "..." }`.
