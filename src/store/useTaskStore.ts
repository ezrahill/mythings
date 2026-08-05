import { create } from 'zustand'
import { taskRepository } from '../db/repositories'
import { todayISO } from '../lib/dates'
import { nextOccurrence } from '../lib/recurrence'
import type { ID } from '../types/common'
import type { Task } from '../types/task'

interface TaskState {
  tasks: Task[]
  loaded: boolean
  hydrate: () => Promise<void>
  addTask: (task: Task) => Promise<void>
  updateTask: (id: ID, changes: Partial<Task>) => Promise<void>
  removeTask: (id: ID) => Promise<void>
  completeTask: (id: ID) => Promise<void>
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  loaded: false,
  hydrate: async () => {
    const tasks = await taskRepository.list()
    set({ tasks, loaded: true })
  },
  addTask: async (task) => {
    set({ tasks: [...get().tasks, task] })
    await taskRepository.create(task)
  },
  updateTask: async (id, changes) => {
    set({
      tasks: get().tasks.map((task) =>
        task.id === id ? { ...task, ...changes } : task,
      ),
    })
    await taskRepository.update(id, changes)
  },
  removeTask: async (id) => {
    set({ tasks: get().tasks.filter((task) => task.id !== id) })
    await taskRepository.remove(id)
  },
  completeTask: async (id) => {
    const task = get().tasks.find((t) => t.id === id)
    if (!task) return

    if (task.recurrence) {
      const from = task.when ?? todayISO()
      const when = nextOccurrence(task.recurrence, from)
      await get().updateTask(id, { when })
      return
    }

    await get().updateTask(id, {
      completed: true,
      completedAt: new Date().toISOString(),
    })
  },
}))
