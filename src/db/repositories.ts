import { db } from './db'
import type { Area } from '../types/area'
import type { ID } from '../types/common'
import type { Project } from '../types/project'
import type { Tag } from '../types/tag'
import type { Task } from '../types/task'

export const taskRepository = {
  list: () => db.tasks.toArray(),
  get: (id: ID) => db.tasks.get(id),
  create: async (task: Task) => {
    await db.tasks.add(task)
    return task.id
  },
  update: (id: ID, changes: Partial<Task>) => db.tasks.update(id, changes),
  remove: (id: ID) => db.tasks.delete(id),
  byProject: (projectId: ID) =>
    db.tasks.where('projectId').equals(projectId).toArray(),
  byArea: (areaId: ID) => db.tasks.where('areaId').equals(areaId).toArray(),
  byTag: (tagId: ID) => db.tasks.where('tagIds').equals(tagId).toArray(),
  byDateRange: (start: string, end: string) =>
    db.tasks.where('when').between(start, end, true, true).toArray(),
}

export const projectRepository = {
  list: () => db.projects.toArray(),
  get: (id: ID) => db.projects.get(id),
  create: async (project: Project) => {
    await db.projects.add(project)
    return project.id
  },
  update: (id: ID, changes: Partial<Project>) =>
    db.projects.update(id, changes),
  remove: (id: ID) => db.projects.delete(id),
  byArea: (areaId: ID) =>
    db.projects.where('areaId').equals(areaId).toArray(),
}

export const areaRepository = {
  list: () => db.areas.toArray(),
  get: (id: ID) => db.areas.get(id),
  create: async (area: Area) => {
    await db.areas.add(area)
    return area.id
  },
  update: (id: ID, changes: Partial<Area>) => db.areas.update(id, changes),
  remove: (id: ID) => db.areas.delete(id),
}

export const tagRepository = {
  list: () => db.tags.toArray(),
  get: (id: ID) => db.tags.get(id),
  create: async (tag: Tag) => {
    await db.tags.add(tag)
    return tag.id
  },
  update: (id: ID, changes: Partial<Tag>) => db.tags.update(id, changes),
  remove: (id: ID) => db.tags.delete(id),
}
