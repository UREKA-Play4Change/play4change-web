export const APP_NAME = 'Play4Change'
export const APP_TAGLINE =
  'Adaptive learning powered by AI. Gamified daily challenges for sustainability and digital literacy.'

export const MAX_PDF_SIZE_MB = 100
export const MAX_PDF_SIZE_BYTES = MAX_PDF_SIZE_MB * 1024 * 1024
export const MAX_URLS = 5
export const MIN_DURATION_DAYS = 3
export const MAX_DURATION_DAYS = 7

export const ROUTES = {
  HOME: '/',
  DOWNLOAD: '/download',
  ADMIN_LOGIN: '/admin/login',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_TOPICS: '/admin/topics',
  ADMIN_TOPIC_DETAIL: '/admin/topics/:id',
  ADMIN_CREATE_TOPIC: '/admin/topics/new',
} as const
