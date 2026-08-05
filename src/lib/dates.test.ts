import { describe, expect, it } from 'vitest'
import { addDays, isOverdue, isToday, nextWeekend, todayISO } from './dates'

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

describe('addDays', () => {
  it('adds days within a month', () => {
    expect(addDays('2026-08-05', 1)).toBe('2026-08-06')
  })

  it('rolls over into the next month', () => {
    expect(addDays('2026-08-31', 1)).toBe('2026-09-01')
  })
})

describe('nextWeekend', () => {
  it('returns the upcoming Saturday from a midweek date', () => {
    // 2026-08-05 is a Wednesday
    expect(nextWeekend('2026-08-05')).toBe('2026-08-08')
  })

  it('returns the same day when it is already Saturday', () => {
    expect(nextWeekend('2026-08-08')).toBe('2026-08-08')
  })
})
