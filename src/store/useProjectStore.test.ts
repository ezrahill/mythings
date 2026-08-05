import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '../db/db'
import { useProjectStore } from './useProjectStore'

beforeEach(async () => {
  await db.projects.clear()
  useProjectStore.setState({ projects: [], loaded: false })
})

describe('useProjectStore', () => {
  it('hydrates from the repository', async () => {
    await db.projects.add({ id: 'p1', name: 'Kitchen', completed: false, order: 0 })
    await useProjectStore.getState().hydrate()
    expect(useProjectStore.getState().projects.map((p) => p.id)).toEqual(['p1'])
    expect(useProjectStore.getState().loaded).toBe(true)
  })

  it('adds a project and persists it', async () => {
    await useProjectStore.getState().addProject({ id: 'p1', name: 'Kitchen', completed: false, order: 0 })
    expect(useProjectStore.getState().projects.map((p) => p.id)).toEqual(['p1'])
    const stored = await db.projects.get('p1')
    expect(stored?.name).toBe('Kitchen')
  })

  it('updates a project and persists the change', async () => {
    await useProjectStore.getState().addProject({ id: 'p1', name: 'Kitchen', completed: false, order: 0 })
    await useProjectStore.getState().updateProject('p1', { completed: true })
    expect(useProjectStore.getState().projects[0].completed).toBe(true)
    const stored = await db.projects.get('p1')
    expect(stored?.completed).toBe(true)
  })

  it('removes a project and persists the removal', async () => {
    await useProjectStore.getState().addProject({ id: 'p1', name: 'Kitchen', completed: false, order: 0 })
    await useProjectStore.getState().removeProject('p1')
    expect(useProjectStore.getState().projects).toEqual([])
    const stored = await db.projects.get('p1')
    expect(stored).toBeUndefined()
  })
})
