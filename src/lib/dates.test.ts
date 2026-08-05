import { describe, expect, it } from 'vitest'
import { isOverdue, isToday, todayISO } from './dates'

describe('todayISO', () => {
  it('returns an ISO date string (YYYY-MM-DD)', () => {
    expect(todayISO()).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })
})

describe('isToday', () => {
  it('is true when the date matches today', () => {
    expect(isToday('2026-08-05', '2026-08-05')).toBe(true)
  })

  it('is false when the date does not match today', () => {
    expect(isToday('2026-08-04', '2026-08-05')).toBe(false)
  })

  it('is false when there is no date', () => {
    expect(isToday(undefined, '2026-08-05')).toBe(false)
  })
})

describe('isOverdue', () => {
  it('is true when the date is before today', () => {
    expect(isOverdue('2026-08-04', '2026-08-05')).toBe(true)
  })

  it('is false when the date is today', () => {
    expect(isOverdue('2026-08-05', '2026-08-05')).toBe(false)
  })

  it('is false when the date is after today', () => {
    expect(isOverdue('2026-08-06', '2026-08-05')).toBe(false)
  })

  it('is false when there is no date', () => {
    expect(isOverdue(undefined, '2026-08-05')).toBe(false)
  })
})
