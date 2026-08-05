import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '../db/db'
import { useTaskStore } from './useTaskStore'

const baseTask = {
  tagIds: [] as string[],
  thisEvening: false,
  completed: false,
  order: 0,
  createdAt: '2026-08-05T00:00:00.000Z',
}

beforeEach(async () => {
  await db.tasks.clear()
  useTaskStore.setState({ tasks: [], loaded: false })
})

describe('useTaskStore', () => {
  it('hydrates from the repository', async () => {
    await db.tasks.add({ ...baseTask, id: 't1', title: 'Buy milk' })
    await useTaskStore.getState().hydrate()
    expect(useTaskStore.getState().tasks.map((t) => t.id)).toEqual(['t1'])
    expect(useTaskStore.getState().loaded).toBe(true)
  })

  it('adds a task and persists it', async () => {
    await useTaskStore.getState().addTask({ ...baseTask, id: 't1', title: 'Buy milk' })
    expect(useTaskStore.getState().tasks.map((t) => t.id)).toEqual(['t1'])
    const stored = await db.tasks.get('t1')
    expect(stored?.title).toBe('Buy milk')
  })

  it('updates a task and persists the change', async () => {
    await useTaskStore.getState().addTask({ ...baseTask, id: 't1', title: 'Buy milk' })
    await useTaskStore.getState().updateTask('t1', { completed: true })
    expect(useTaskStore.getState().tasks[0].completed).toBe(true)
    const stored = await db.tasks.get('t1')
    expect(stored?.completed).toBe(true)
  })

  it('removes a task and persists the removal', async () => {
    await useTaskStore.getState().addTask({ ...baseTask, id: 't1', title: 'Buy milk' })
    await useTaskStore.getState().removeTask('t1')
    expect(useTaskStore.getState().tasks).toEqual([])
    const stored = await db.tasks.get('t1')
    expect(stored).toBeUndefined()
  })
})
