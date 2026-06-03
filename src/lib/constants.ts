export const APP_NAME = 'Play4Change'
export const APP_TAGLINE =
  'Adaptive learning powered by AI. Gamified daily challenges for sustainability and digital literacy.'

export const MAX_PDF_SIZE_MB = 100
export const MAX_PDF_SIZE_BYTES = MAX_PDF_SIZE_MB * 1024 * 1024
export const MAX_URLS = 1

export const ROUTES = {
  HOME: '/',
  DOWNLOAD: '/download',
  ADMIN_LOGIN: '/admin/login',
  AUTH_CALLBACK: '/auth/callback',
  AUTH_VERIFY: '/auth/verify',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_TOPICS: '/admin/topics',
  ADMIN_TOPIC_DETAIL: '/admin/topics/:id',
  ADMIN_CREATE_TOPIC: '/admin/topics/new',
  ADMIN_LEARNING_PATHS: '/admin/learning-paths',
  ADMIN_REPORTS: '/admin/reports',
  ADMIN_REPORT_DETAIL: '/admin/reports/:reportId',
  ADMIN_USERS: '/admin/users',
  ADMIN_USER_DETAIL: '/admin/users/:id',
  ADMIN_BADGES: '/admin/badges',
} as const
