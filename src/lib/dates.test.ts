import { describe, expect, it } from 'vitest'
import {
  addDays,
  formatLongDate,
  groupByDate,
  isOverdue,
  isToday,
  nextWeekend,
  todayISO,
} from './dates'

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

describe('formatLongDate', () => {
  it('formats a date as weekday, day month', () => {
    // 2026-08-05 is a Wednesday
    expect(formatLongDate('2026-08-05')).toBe('Wednesday, 5 August')
  })
})

describe('groupByDate', () => {
  it('groups items by their when date, ascending', () => {
    const items = [
      { id: 'c', when: '2026-08-10' },
      { id: 'a', when: '2026-08-06' },
      { id: 'b', when: '2026-08-06' },
    ]
    expect(groupByDate(items)).toEqual([
      ['2026-08-06', [items[1], items[2]]],
      ['2026-08-10', [items[0]]],
    ])
  })

  it('drops items with no when date', () => {
    const items = [{ id: 'a', when: undefined }, { id: 'b', when: '2026-08-06' }]
    expect(groupByDate(items)).toEqual([['2026-08-06', [items[1]]]])
  })
})
