import type { ID } from './common'

export interface RecurrenceRule {
  freq: 'daily' | 'weekly' | 'monthly'
  interval: number // every N freq units
  byWeekday?: number[] // 0-6, for weekly
  anchor: string // ISO date the rule is computed from
}

export interface Task {
  id: ID
  title: string
  notes?: string
  projectId?: ID // undefined = standalone / area-only
  areaId?: ID // set when task has no project
  tagIds: ID[]
  when?: string // ISO date - scheduled day ("Today"/"Upcoming")
  thisEvening: boolean // Today, evening slot
  deadline?: string // ISO date - distinct from `when`
  recurrence?: RecurrenceRule
  completed: boolean
  completedAt?: string
  order: number
  createdAt: string
}
