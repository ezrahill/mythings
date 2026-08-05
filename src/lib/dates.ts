export function todayISO(): string {
  return new Date().toISOString().slice(0, 10)
}

export function isToday(when: string | undefined, today = todayISO()): boolean {
  return when === today
}

export function isOverdue(when: string | undefined, today = todayISO()): boolean {
  return when !== undefined && when < today
}
