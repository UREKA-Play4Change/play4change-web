import { describe, expect, it } from 'vitest'
import { isValidEmail, isValidUrl, validatePdfFile, validateUrls } from '../validators'

describe('isValidEmail', () => {
  it('accepts valid emails', () => {
    expect(isValidEmail('user@example.com')).toBe(true)
    expect(isValidEmail('admin@play4change.org')).toBe(true)
  })

  it('rejects invalid emails', () => {
    expect(isValidEmail('not-an-email')).toBe(false)
    expect(isValidEmail('@missing-local.com')).toBe(false)
    expect(isValidEmail('missing-domain@')).toBe(false)
  })
})

describe('isValidUrl', () => {
  it('accepts valid URLs', () => {
    expect(isValidUrl('https://example.com')).toBe(true)
    expect(isValidUrl('https://un.org/sustainabledevelopment')).toBe(true)
  })

  it('rejects invalid URLs', () => {
    expect(isValidUrl('not a url')).toBe(false)
    expect(isValidUrl('ftp-missing-colon//example')).toBe(false)
  })
})

describe('validateUrls', () => {
  it('returns error for empty array', () => {
    expect(validateUrls([])).toBe('At least one URL is required')
  })

  it('returns error when more than 5 URLs', () => {
    const urls = Array.from({ length: 6 }, (_, i) => `https://example.com/${i}`)
    expect(validateUrls(urls)).toContain('Maximum')
  })

  it('returns null for valid URLs', () => {
    expect(validateUrls(['https://example.com'])).toBeNull()
  })

  it('returns error for invalid URL in list', () => {
    expect(validateUrls(['https://valid.com', 'not-a-url'])).toContain('Invalid URL')
  })
})

describe('validatePdfFile', () => {
  const makeFile = (type: string, sizeBytes: number) =>
    new File([new ArrayBuffer(sizeBytes)], 'test.pdf', { type })

  it('accepts valid PDF within size limit', () => {
    expect(validatePdfFile(makeFile('application/pdf', 1024))).toBeNull()
  })

  it('rejects non-PDF files', () => {
    expect(validatePdfFile(makeFile('image/png', 1024))).toContain('PDF')
  })

  it('rejects files over 100MB', () => {
    const oversized = makeFile('application/pdf', 101 * 1024 * 1024)
    expect(validatePdfFile(oversized)).toContain('100MB')
  })
})
