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
