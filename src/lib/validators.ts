import { MAX_PDF_SIZE_BYTES, MAX_URLS } from './constants'

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

export function validateUrls(urls: string[]): string | null {
  if (urls.length === 0) return 'At least one URL is required'
  if (urls.length > MAX_URLS) return `Maximum ${MAX_URLS} URLs allowed`
  const invalid = urls.filter(u => !isValidUrl(u))
  if (invalid.length > 0) return `Invalid URL: ${invalid[0]}`
  return null
}

export function validatePdfFile(file: File): string | null {
  if (file.type !== 'application/pdf') return 'Only PDF files are accepted'
  if (file.size > MAX_PDF_SIZE_BYTES) return 'File size must not exceed 100MB'
  return null
}
