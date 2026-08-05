import { isOverdue, todayISO } from '../lib/dates'
import type { ID } from '../types/common'
import type { Tag } from '../types/tag'
import type { Task } from '../types/task'
import './TaskRow.css'

export function TaskRow({
  task,
  tags,
  onToggleComplete,
  onSelect,
  contextName,
  today = todayISO(),
}: {
  task: Task
  tags: Tag[]
  onToggleComplete: (id: ID, completed: boolean) => void
  onSelect: (id: ID) => void
  contextName?: string
  today?: string
}) {
  const overdue = !task.completed && isOverdue(task.when, today)

  return (
    <div className="task-row">
      <button
        type="button"
        role="checkbox"
        aria-checked={task.completed}
        aria-label={task.completed ? 'Mark incomplete' : 'Mark complete'}
        className="task-row-checkbox"
        onClick={() => onToggleComplete(task.id, !task.completed)}
      />
      <button
        type="button"
        className="task-row-main"
        onClick={() => onSelect(task.id)}
      >
        <span
          className={`task-row-title${task.completed ? ' task-row-title-completed' : ''}`}
        >
          {task.title}
        </span>
      </button>
      <div className="task-row-meta">
        {tags.map((tag) => (
          <span key={tag.id} className="task-row-chip">
            {tag.name}
          </span>
        ))}
        {contextName && (
          <span className="task-row-context">{contextName}</span>
        )}
        {task.when && (
          <span
            className={`task-row-date${overdue ? ' task-row-date-overdue' : ''}`}
          >
            {task.when}
          </span>
        )}
      </div>
    </div>
  )
}
