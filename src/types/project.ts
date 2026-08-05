import type { ID } from './common'

export interface Project {
  id: ID
  name: string
  notes?: string
  areaId?: ID // undefined = no area
  completed: boolean
  completedAt?: string // ISO date
  order: number
}
