import { create } from 'zustand'
import { areaRepository } from '../db/repositories'
import type { Area } from '../types/area'
import type { ID } from '../types/common'

interface AreaState {
  areas: Area[]
  loaded: boolean
  hydrate: () => Promise<void>
  addArea: (area: Area) => Promise<void>
  updateArea: (id: ID, changes: Partial<Area>) => Promise<void>
  removeArea: (id: ID) => Promise<void>
}

export const useAreaStore = create<AreaState>((set, get) => ({
  areas: [],
  loaded: false,
  hydrate: async () => {
    const areas = await areaRepository.list()
    set({ areas, loaded: true })
  },
  addArea: async (area) => {
    await areaRepository.create(area)
    set({ areas: [...get().areas, area] })
  },
  updateArea: async (id, changes) => {
    await areaRepository.update(id, changes)
    set({
      areas: get().areas.map((area) =>
        area.id === id ? { ...area, ...changes } : area,
      ),
    })
  },
  removeArea: async (id) => {
    await areaRepository.remove(id)
    set({ areas: get().areas.filter((area) => area.id !== id) })
  },
}))
