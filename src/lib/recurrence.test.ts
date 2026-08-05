import { describe, expect, it } from 'vitest'
import { describeRecurrence, nextOccurrence } from './recurrence'

describe('nextOccurrence', () => {
  it('advances a daily rule by the interval', () => {
    const rule = { freq: 'daily' as const, interval: 1, anchor: '2026-08-05' }
    expect(nextOccurrence(rule, '2026-08-05')).toBe('2026-08-06')
  })

  it('advances a daily rule by a larger interval', () => {
    const rule = { freq: 'daily' as const, interval: 3, anchor: '2026-08-05' }
    expect(nextOccurrence(rule, '2026-08-05')).toBe('2026-08-08')
  })

  it('advances a plain weekly rule (no weekdays) by the interval in weeks', () => {
    const rule = { freq: 'weekly' as const, interval: 2, anchor: '2026-08-05' }
    expect(nextOccurrence(rule, '2026-08-05')).toBe('2026-08-19')
  })

  it('advances a weekly-with-weekday rule to the next matching weekday', () => {
    // 2026-08-05 is a Wednesday (3); Mon(1)/Wed(3)/Fri(5)
    const rule = {
      freq: 'weekly' as const,
      interval: 1,
      byWeekday: [1, 3, 5],
      anchor: '2026-08-03',
    }
    expect(nextOccurrence(rule, '2026-08-05')).toBe('2026-08-07')
  })

  it('wraps a weekly-with-weekday rule into the following week', () => {
    // 2026-08-07 is a Friday, last of the week's set [1,3,5]; next is Monday 08-10
    const rule = {
      freq: 'weekly' as const,
      interval: 1,
      byWeekday: [1, 3, 5],
      anchor: '2026-08-03',
    }
    expect(nextOccurrence(rule, '2026-08-07')).toBe('2026-08-10')
  })

  it('respects a multi-week interval for weekly-with-weekday rules', () => {
    // anchor Monday 2026-08-03 (week 0), interval 2 -> only even week offsets are active
    const rule = {
      freq: 'weekly' as const,
      interval: 2,
      byWeekday: [1],
      anchor: '2026-08-03',
    }
    // from the anchor Monday itself, next Monday (week 1) is skipped; week 2 (08-17) is active
    expect(nextOccurrence(rule, '2026-08-03')).toBe('2026-08-17')
  })

  it('advances a monthly rule by the interval', () => {
    const rule = { freq: 'monthly' as const, interval: 1, anchor: '2026-08-05' }
    expect(nextOccurrence(rule, '2026-08-05')).toBe('2026-09-05')
  })

  it('clamps a monthly rule to the last day of a shorter target month', () => {
    const rule = { freq: 'monthly' as const, interval: 1, anchor: '2026-01-31' }
    expect(nextOccurrence(rule, '2026-01-31')).toBe('2026-02-28')
  })
})

describe('describeRecurrence', () => {
  it('describes a daily rule', () => {
    expect(describeRecurrence({ freq: 'daily', interval: 1, anchor: '2026-08-05' })).toBe(
      'Every day',
    )
    expect(describeRecurrence({ freq: 'daily', interval: 3, anchor: '2026-08-05' })).toBe(
      'Every 3 days',
    )
  })

  it('describes a plain weekly rule', () => {
    expect(describeRecurrence({ freq: 'weekly', interval: 1, anchor: '2026-08-05' })).toBe(
      'Every week',
    )
    expect(describeRecurrence({ freq: 'weekly', interval: 2, anchor: '2026-08-05' })).toBe(
      'Every 2 weeks',
    )
  })

  it('describes a weekly rule with weekdays', () => {
    expect(
      describeRecurrence({
        freq: 'weekly',
        interval: 2,
        byWeekday: [1],
        anchor: '2026-08-05',
      }),
    ).toBe('Every 2 weeks on Mon')
    expect(
      describeRecurrence({
        freq: 'weekly',
        interval: 1,
        byWeekday: [1, 3, 5],
        anchor: '2026-08-05',
      }),
    ).toBe('Every week on Mon, Wed, Fri')
  })

  it('describes a monthly rule', () => {
    expect(describeRecurrence({ freq: 'monthly', interval: 1, anchor: '2026-08-05' })).toBe(
      'Every month',
    )
  })
})
