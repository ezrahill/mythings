import { useAreaStore } from '../store/useAreaStore'
import { useProjectStore } from '../store/useProjectStore'
import { useTagStore } from '../store/useTagStore'
import { useTaskStore } from '../store/useTaskStore'
import type { ID } from '../types/common'
import type { Task } from '../types/task'
import { TaskRow } from './TaskRow'
import './TaskList.css'

export function TaskList({
  tasks,
  onSelect,
  showContext = false,
}: {
  tasks: Task[]
  onSelect: (id: ID) => void
  showContext?: boolean
}) {
  const tags = useTagStore((state) => state.tags)
  const projects = useProjectStore((state) => state.projects)
  const areas = useAreaStore((state) => state.areas)
  const updateTask = useTaskStore((state) => state.updateTask)
  const completeTask = useTaskStore((state) => state.completeTask)

  function contextNameFor(task: Task): string | undefined {
    if (!showContext) return undefined
    if (task.projectId) {
      return projects.find((project) => project.id === task.projectId)?.name
    }
    if (task.areaId) {
      return areas.find((area) => area.id === task.areaId)?.name
    }
    return undefined
  }

  function handleToggleComplete(id: ID, completed: boolean) {
    if (completed) {
      completeTask(id)
    } else {
      updateTask(id, { completed: false, completedAt: undefined })
    }
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <TaskRow
          key={task.id}
          task={task}
          tags={tags.filter((tag) => task.tagIds.includes(tag.id))}
          onToggleComplete={handleToggleComplete}
          onSelect={onSelect}
          contextName={contextNameFor(task)}
        />
      ))}
    </div>
  )
}
