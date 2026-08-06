import { create } from 'zustand'
import { projectRepository } from '../db/repositories'
import type { ID } from '../types/common'
import type { Project } from '../types/project'

interface ProjectState {
  projects: Project[]
  loaded: boolean
  hydrate: () => Promise<void>
  addProject: (project: Project) => Promise<void>
  updateProject: (id: ID, changes: Partial<Project>) => Promise<void>
  removeProject: (id: ID) => Promise<void>
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: [],
  loaded: false,
  hydrate: async () => {
    const projects = await projectRepository.list()
    set({ projects, loaded: true })
  },
  addProject: async (project) => {
    set({ projects: [...get().projects, project] })
    await projectRepository.create(project)
  },
  updateProject: async (id, changes) => {
    set({
      projects: get().projects.map((project) =>
        project.id === id ? { ...project, ...changes } : project,
      ),
    })
    await projectRepository.update(id, changes)
  },
  removeProject: async (id) => {
    set({ projects: get().projects.filter((project) => project.id !== id) })
    await projectRepository.remove(id)
  },
}))
