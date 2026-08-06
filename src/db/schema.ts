import type Dexie from 'dexie'

export function applySchema(db: Dexie) {
  db.version(1).stores({
    tasks: 'id, projectId, areaId, when, *tagIds, completed',
    projects: 'id, areaId, completed, order',
    areas: 'id, order',
    tags: 'id, name',
  })
}
