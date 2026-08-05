import { describe, expect, it } from 'vitest'
import { db } from './db'

describe('db schema', () => {
  it('defines the tasks, projects, areas and tags tables', () => {
    const tableNames = db.tables.map((table) => table.name).sort()
    expect(tableNames).toEqual(['areas', 'projects', 'tags', 'tasks'])
  })

  it('can write and read a task keyed by string id', async () => {
    await db.tasks.put({
      id: 'task-1',
      title: 'Buy milk',
      tagIds: [],
      thisEvening: false,
      completed: false,
      order: 0,
      createdAt: '2026-08-05T00:00:00.000Z',
    })

    const task = await db.tasks.get('task-1')
    expect(task?.title).toBe('Buy milk')
  })

  it('can query tasks by tag via the multi-entry tagIds index', async () => {
    await db.tags.put({ id: 'tag-1', name: 'errand' })
    await db.tasks.put({
      id: 'task-2',
      title: 'Post letter',
      tagIds: ['tag-1'],
      thisEvening: false,
      completed: false,
      order: 1,
      createdAt: '2026-08-05T00:00:00.000Z',
    })

    const tagged = await db.tasks.where('tagIds').equals('tag-1').toArray()
    expect(tagged.map((task) => task.id)).toContain('task-2')
  })
})
