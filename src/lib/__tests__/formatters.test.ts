import { describe, expect, it } from 'vitest'
import { formatDate, formatNumber, formatPercentage, formatScore } from '../formatters'

describe('formatNumber', () => {
  it('returns raw number for values below 1000', () => {
    expect(formatNumber(999)).toBe('999')
  })

  it('formats thousands with K suffix', () => {
    expect(formatNumber(1500)).toBe('1.5K')
    expect(formatNumber(2847)).toBe('2.8K')
  })

  it('formats millions with M suffix', () => {
    expect(formatNumber(1_200_000)).toBe('1.2M')
  })
})

describe('formatPercentage', () => {
  it('converts decimal to percentage string', () => {
    expect(formatPercentage(0.68)).toBe('68.0%')
    expect(formatPercentage(1.0)).toBe('100.0%')
    expect(formatPercentage(0)).toBe('0.0%')
  })
})

describe('formatDate', () => {
  it('formats an ISO date string to readable format', () => {
    const result = formatDate('2025-01-15T10:00:00Z')
    expect(result).toContain('2025')
    expect(result).toContain('Jan')
  })
})

describe('formatScore', () => {
  it('rounds and appends /100', () => {
    expect(formatScore(82.4)).toBe('82/100')
    expect(formatScore(100)).toBe('100/100')
  })
})
