import Dexie, { type EntityTable } from 'dexie'
import type { Area } from '../types/area'
import type { Project } from '../types/project'
import type { Tag } from '../types/tag'
import type { Task } from '../types/task'
import { applySchema } from './schema'

class MyThingsDB extends Dexie {
  tasks!: EntityTable<Task, 'id'>
  projects!: EntityTable<Project, 'id'>
  areas!: EntityTable<Area, 'id'>
  tags!: EntityTable<Tag, 'id'>

  constructor() {
    super('mythings')
    applySchema(this)
  }
}

export const db = new MyThingsDB()
