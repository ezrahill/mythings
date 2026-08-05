import { create } from 'zustand'
import { tagRepository } from '../db/repositories'
import type { ID } from '../types/common'
import type { Tag } from '../types/tag'

interface TagState {
  tags: Tag[]
  loaded: boolean
  hydrate: () => Promise<void>
  addTag: (tag: Tag) => Promise<void>
  updateTag: (id: ID, changes: Partial<Tag>) => Promise<void>
  removeTag: (id: ID) => Promise<void>
}

export const useTagStore = create<TagState>((set, get) => ({
  tags: [],
  loaded: false,
  hydrate: async () => {
    const tags = await tagRepository.list()
    set({ tags, loaded: true })
  },
  addTag: async (tag) => {
    set({ tags: [...get().tags, tag] })
    await tagRepository.create(tag)
  },
  updateTag: async (id, changes) => {
    set({
      tags: get().tags.map((tag) =>
        tag.id === id ? { ...tag, ...changes } : tag,
      ),
    })
    await tagRepository.update(id, changes)
  },
  removeTag: async (id) => {
    set({ tags: get().tags.filter((tag) => tag.id !== id) })
    await tagRepository.remove(id)
  },
}))
