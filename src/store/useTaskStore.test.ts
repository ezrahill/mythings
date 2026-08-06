import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '../db/db'
import { addDays, todayISO } from '../lib/dates'
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

  it('completes a non-recurring task outright', async () => {
    await useTaskStore.getState().addTask({ ...baseTask, id: 't1', title: 'Buy milk' })
    await useTaskStore.getState().completeTask('t1')

    const task = useTaskStore.getState().tasks[0]
    expect(task.completed).toBe(true)
    expect(task.completedAt).toBeDefined()
  })

  it('advances a recurring task to its next occurrence instead of completing it', async () => {
    await useTaskStore.getState().addTask({
      ...baseTask,
      id: 't1',
      title: 'Water plants',
      when: '2026-08-05',
      recurrence: { freq: 'daily', interval: 1, anchor: '2026-08-05' },
    })
    await useTaskStore.getState().completeTask('t1')

    const task = useTaskStore.getState().tasks[0]
    expect(task.completed).toBe(false)
    expect(task.when).toBe('2026-08-06')
    const stored = await db.tasks.get('t1')
    expect(stored?.when).toBe('2026-08-06')
  })

  it('advances an overdue recurring task to today, not one interval past its old date', async () => {
    const today = todayISO()
    const tenDaysAgo = addDays(today, -10)
    await useTaskStore.getState().addTask({
      ...baseTask,
      id: 't1',
      title: 'Water plants',
      when: tenDaysAgo,
      recurrence: { freq: 'daily', interval: 1, anchor: tenDaysAgo },
    })
    await useTaskStore.getState().completeTask('t1')

    const task = useTaskStore.getState().tasks[0]
    expect(task.completed).toBe(false)
    expect(task.when).toBe(today)
    const stored = await db.tasks.get('t1')
    expect(stored?.when).toBe(today)
  })
})
