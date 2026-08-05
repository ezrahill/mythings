import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '../db/db'
import { useTagStore } from './useTagStore'

beforeEach(async () => {
  await db.tags.clear()
  useTagStore.setState({ tags: [], loaded: false })
})

describe('useTagStore', () => {
  it('hydrates from the repository', async () => {
    await db.tags.add({ id: 'tag-1', name: 'errand' })
    await useTagStore.getState().hydrate()
    expect(useTagStore.getState().tags.map((t) => t.id)).toEqual(['tag-1'])
    expect(useTagStore.getState().loaded).toBe(true)
  })

  it('adds a tag and persists it', async () => {
    await useTagStore.getState().addTag({ id: 'tag-1', name: 'errand' })
    expect(useTagStore.getState().tags.map((t) => t.id)).toEqual(['tag-1'])
    const stored = await db.tags.get('tag-1')
    expect(stored?.name).toBe('errand')
  })

  it('updates a tag and persists the change', async () => {
    await useTagStore.getState().addTag({ id: 'tag-1', name: 'errand' })
    await useTagStore.getState().updateTag('tag-1', { color: '#2FB380' })
    expect(useTagStore.getState().tags[0].color).toBe('#2FB380')
    const stored = await db.tags.get('tag-1')
    expect(stored?.color).toBe('#2FB380')
  })

  it('removes a tag and persists the removal', async () => {
    await useTagStore.getState().addTag({ id: 'tag-1', name: 'errand' })
    await useTagStore.getState().removeTag('tag-1')
    expect(useTagStore.getState().tags).toEqual([])
    const stored = await db.tags.get('tag-1')
    expect(stored).toBeUndefined()
  })
})
