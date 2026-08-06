import { useState } from 'react'
import { describeRecurrence } from '../lib/recurrence'
import { useAreaStore } from '../store/useAreaStore'
import { useProjectStore } from '../store/useProjectStore'
import { useTagStore } from '../store/useTagStore'
import { useTaskStore } from '../store/useTaskStore'
import type { ID } from '../types/common'
import { DatePicker } from './DatePicker'
import { RecurrencePicker } from './RecurrencePicker'
import { TagPicker } from './TagPicker'
import './TaskEditor.css'

export function TaskEditor({
  taskId,
  onClose,
}: {
  taskId: ID | null
  onClose: () => void
}) {
  const foundTask = useTaskStore((state) =>
    state.tasks.find((t) => t.id === taskId),
  )
  const updateTask = useTaskStore((state) => state.updateTask)
  const completeTask = useTaskStore((state) => state.completeTask)
  const projects = useProjectStore((state) => state.projects)
  const areas = useAreaStore((state) => state.areas)
  const tags = useTagStore((state) => state.tags)
  const [datePickerOpen, setDatePickerOpen] = useState(false)
  const [tagPickerOpen, setTagPickerOpen] = useState(false)
  const [recurrencePickerOpen, setRecurrencePickerOpen] = useState(false)

  if (!foundTask) return null
  const task = foundTask

  const assignedTags = tags.filter((tag) => task.tagIds.includes(tag.id))

  function handleProjectAreaChange(rawValue: string) {
    if (rawValue === 'none') {
      updateTask(task.id, { projectId: undefined, areaId: undefined })
    } else if (rawValue.startsWith('project:')) {
      updateTask(task.id, {
        projectId: rawValue.slice('project:'.length),
        areaId: undefined,
      })
    } else if (rawValue.startsWith('area:')) {
      updateTask(task.id, {
        areaId: rawValue.slice('area:'.length),
        projectId: undefined,
      })
    }
  }

  function handleToggleTag(tagId: ID) {
    const nextTagIds = task.tagIds.includes(tagId)
      ? task.tagIds.filter((id) => id !== tagId)
      : [...task.tagIds, tagId]
    updateTask(task.id, { tagIds: nextTagIds })
  }

  const projectAreaValue = task.projectId
    ? `project:${task.projectId}`
    : task.areaId
      ? `area:${task.areaId}`
      : 'none'

  return (
    <div className="task-editor" role="complementary" aria-label="Task detail">
      <button type="button" className="task-editor-close" onClick={onClose}>
        Close
      </button>

      <input
        className="task-editor-title"
        value={task.title}
        onChange={(event) => updateTask(task.id, { title: event.target.value })}
      />

      <div className="task-editor-field">
        <span className="task-editor-label">Notes</span>
        <textarea
          placeholder="Add notes…"
          value={task.notes ?? ''}
          onChange={(event) => updateTask(task.id, { notes: event.target.value })}
        />
      </div>

      <div className="task-editor-field">
        <span className="task-editor-label">When</span>
        <button
          type="button"
          aria-label="When"
          onClick={() => setDatePickerOpen((open) => !open)}
        >
          {task.when ?? 'None'}
        </button>
        {datePickerOpen && (
          <DatePicker
            value={task.when}
            onChange={(value) => {
              updateTask(task.id, { when: value })
              setDatePickerOpen(false)
            }}
          />
        )}
      </div>

      <div className="task-editor-field">
        <label className="task-editor-label" htmlFor="task-editor-project-area">
          Project/Area
        </label>
        <select
          id="task-editor-project-area"
          value={projectAreaValue}
          onChange={(event) => handleProjectAreaChange(event.target.value)}
        >
          <option value="none">None</option>
          {areas.map((area) => (
            <option key={area.id} value={`area:${area.id}`}>
              {area.name}
            </option>
          ))}
          {projects.map((project) => (
            <option key={project.id} value={`project:${project.id}`}>
              {project.name}
            </option>
          ))}
        </select>
      </div>

      <div className="task-editor-field">
        <span className="task-editor-label">Tags</span>
        <div className="task-editor-tags">
          {assignedTags.map((tag) => (
            <span key={tag.id} className="task-editor-tag-chip">
              {tag.name}
            </span>
          ))}
          <button
            type="button"
            aria-label="Add tag"
            onClick={() => setTagPickerOpen((open) => !open)}
          >
            +
          </button>
        </div>
        {tagPickerOpen && (
          <TagPicker assignedTagIds={task.tagIds} onToggleTag={handleToggleTag} />
        )}
      </div>

      <div className="task-editor-field">
        <span className="task-editor-label">Recurrence</span>
        <button
          type="button"
          aria-label="Recurrence"
          onClick={() => setRecurrencePickerOpen((open) => !open)}
        >
          {task.recurrence ? describeRecurrence(task.recurrence) : 'None'}
        </button>
        {recurrencePickerOpen && (
          <RecurrencePicker
            value={task.recurrence}
            anchor={task.when ?? new Date().toISOString().slice(0, 10)}
            onChange={(rule) => updateTask(task.id, { recurrence: rule })}
          />
        )}
      </div>

      <button
        type="button"
        className="task-editor-complete"
        onClick={() => completeTask(task.id)}
      >
        Mark Complete
      </button>
    </div>
  )
}
