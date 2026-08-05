import { useEffect, useRef, useState } from 'react'
import { todayISO } from '../lib/dates'
import { useTaskStore } from '../store/useTaskStore'
import './QuickEntry.css'

export function QuickEntry({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const [title, setTitle] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const addTask = useTaskStore((state) => state.addTask)
  const taskCount = useTaskStore((state) => state.tasks.length)

  useEffect(() => {
    if (open) {
      setTitle('')
      inputRef.current?.focus()
    }
  }, [open])

  if (!open) return null

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    const trimmed = title.trim()
    if (!trimmed) return

    addTask({
      id: crypto.randomUUID(),
      title: trimmed,
      tagIds: [],
      when: todayISO(),
      thisEvening: false,
      completed: false,
      order: taskCount,
      createdAt: new Date().toISOString(),
    })
    onClose()
  }

  function handleKeyDown(event: React.KeyboardEvent) {
    if (event.key === 'Escape') {
      event.preventDefault()
      onClose()
    }
  }

  return (
    <div className="quick-entry-backdrop" onClick={onClose}>
      <div
        className="quick-entry"
        role="dialog"
        aria-label="Quick entry"
        onClick={(event) => event.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        <form onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            type="text"
            aria-label="Title"
            placeholder="New To-Do…"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
        </form>
      </div>
    </div>
  )
}
