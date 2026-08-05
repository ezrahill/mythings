import { create } from 'zustand'
import { taskRepository } from '../db/repositories'
import type { ID } from '../types/common'
import type { Task } from '../types/task'

interface TaskState {
  tasks: Task[]
  loaded: boolean
  hydrate: () => Promise<void>
  addTask: (task: Task) => Promise<void>
  updateTask: (id: ID, changes: Partial<Task>) => Promise<void>
  removeTask: (id: ID) => Promise<void>
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  loaded: false,
  hydrate: async () => {
    const tasks = await taskRepository.list()
    set({ tasks, loaded: true })
  },
  addTask: async (task) => {
    await taskRepository.create(task)
    set({ tasks: [...get().tasks, task] })
  },
  updateTask: async (id, changes) => {
    await taskRepository.update(id, changes)
    set({
      tasks: get().tasks.map((task) =>
        task.id === id ? { ...task, ...changes } : task,
      ),
    })
  },
  removeTask: async (id) => {
    await taskRepository.remove(id)
    set({ tasks: get().tasks.filter((task) => task.id !== id) })
  },
}))
