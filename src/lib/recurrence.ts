import type { RecurrenceRule } from '../types/task'
import { addDays } from './dates'

export const WEEKDAY_ABBR = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MS_PER_WEEK = 7 * 24 * 60 * 60 * 1000

export function nextOccurrence(rule: RecurrenceRule, from: string): string {
  switch (rule.freq) {
    case 'daily':
      return addDays(from, rule.interval)
    case 'weekly':
      return rule.byWeekday && rule.byWeekday.length > 0
        ? nextWeeklyByWeekday(rule, from)
        : addDays(from, rule.interval * 7)
    case 'monthly':
      return addMonthsClamped(from, rule.interval)
  }
}

function nextWeeklyByWeekday(rule: RecurrenceRule, from: string): string {
  const weekdays = rule.byWeekday ?? []
  let candidate = addDays(from, 1)
  const maxAttempts = 7 * (rule.interval + 2)
  for (let i = 0; i < maxAttempts; i++) {
    const day = new Date(`${candidate}T00:00:00Z`).getUTCDay()
    if (weekdays.includes(day) && isActiveWeek(rule, candidate)) {
      return candidate
    }
    candidate = addDays(candidate, 1)
  }
  return candidate
}

function isActiveWeek(rule: RecurrenceRule, date: string): boolean {
  if (rule.interval <= 1) return true
  const anchor = new Date(`${rule.anchor}T00:00:00Z`).getTime()
  const current = new Date(`${date}T00:00:00Z`).getTime()
  const weeksSinceAnchor = Math.floor((current - anchor) / MS_PER_WEEK)
  return ((weeksSinceAnchor % rule.interval) + rule.interval) % rule.interval === 0
}

function addMonthsClamped(date: string, months: number): string {
  const d = new Date(`${date}T00:00:00Z`)
  const day = d.getUTCDate()
  const targetMonthIndex = d.getUTCMonth() + months
  const daysInTargetMonth = new Date(
    Date.UTC(d.getUTCFullYear(), targetMonthIndex + 1, 0),
  ).getUTCDate()
  const clampedDay = Math.min(day, daysInTargetMonth)
  return new Date(Date.UTC(d.getUTCFullYear(), targetMonthIndex, clampedDay))
    .toISOString()
    .slice(0, 10)
}

export function describeRecurrence(rule: RecurrenceRule): string {
  const plural = rule.interval > 1

  if (rule.freq === 'daily') {
    return plural ? `Every ${rule.interval} days` : 'Every day'
  }

  if (rule.freq === 'weekly') {
    const cadence = plural ? `Every ${rule.interval} weeks` : 'Every week'
    if (rule.byWeekday && rule.byWeekday.length > 0) {
      const names = [...rule.byWeekday]
        .sort((a, b) => a - b)
        .map((day) => WEEKDAY_ABBR[day])
        .join(', ')
      return `${cadence} on ${names}`
    }
    return cadence
  }

  return plural ? `Every ${rule.interval} months` : 'Every month'
}
