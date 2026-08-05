import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '../db/db'
import { useAreaStore } from './useAreaStore'

beforeEach(async () => {
  await db.areas.clear()
  useAreaStore.setState({ areas: [], loaded: false })
})

describe('useAreaStore', () => {
  it('hydrates from the repository', async () => {
    await db.areas.add({ id: 'a1', name: 'Work', order: 0 })
    await useAreaStore.getState().hydrate()
    expect(useAreaStore.getState().areas.map((a) => a.id)).toEqual(['a1'])
    expect(useAreaStore.getState().loaded).toBe(true)
  })

  it('adds an area and persists it', async () => {
    await useAreaStore.getState().addArea({ id: 'a1', name: 'Work', order: 0 })
    expect(useAreaStore.getState().areas.map((a) => a.id)).toEqual(['a1'])
    const stored = await db.areas.get('a1')
    expect(stored?.name).toBe('Work')
  })

  it('updates an area and persists the change', async () => {
    await useAreaStore.getState().addArea({ id: 'a1', name: 'Work', order: 0 })
    await useAreaStore.getState().updateArea('a1', { name: 'Home' })
    expect(useAreaStore.getState().areas[0].name).toBe('Home')
    const stored = await db.areas.get('a1')
    expect(stored?.name).toBe('Home')
  })

  it('removes an area and persists the removal', async () => {
    await useAreaStore.getState().addArea({ id: 'a1', name: 'Work', order: 0 })
    await useAreaStore.getState().removeArea('a1')
    expect(useAreaStore.getState().areas).toEqual([])
    const stored = await db.areas.get('a1')
    expect(stored).toBeUndefined()
  })
})
