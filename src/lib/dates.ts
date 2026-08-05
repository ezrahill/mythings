export function todayISO(): string {
  return new Date().toISOString().slice(0, 10)
}

export function isToday(when: string | undefined, today = todayISO()): boolean {
  return when === today
}

export function isOverdue(when: string | undefined, today = todayISO()): boolean {
  return when !== undefined && when < today
}

export function addDays(date: string, days: number): string {
  const d = new Date(`${date}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() + days)
  return d.toISOString().slice(0, 10)
}

export function nextWeekend(date: string): string {
  const d = new Date(`${date}T00:00:00Z`)
  const daysUntilSaturday = (6 - d.getUTCDay() + 7) % 7
  return addDays(date, daysUntilSaturday)
}

const WEEKDAYS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
]

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

export function formatLongDate(date: string): string {
  const d = new Date(`${date}T00:00:00Z`)
  return `${WEEKDAYS[d.getUTCDay()]}, ${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]}`
}

interface Scheduled {
  when?: string
}

// Groups tasks by their `when` date, ascending. Unscheduled tasks are
// dropped - callers filter those separately.
export function groupByDate<T extends Scheduled>(items: T[]): [string, T[]][] {
  const groups = new Map<string, T[]>()
  for (const item of items) {
    if (!item.when) continue
    const group = groups.get(item.when)
    if (group) {
      group.push(item)
    } else {
      groups.set(item.when, [item])
    }
  }
  return [...groups.entries()].sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
}
