import { useState } from 'react'
import { swatchColor } from '../lib/colors'
import { useTagStore } from '../store/useTagStore'
import type { ID } from '../types/common'
import './TagPicker.css'

export function TagPicker({
  assignedTagIds,
  onToggleTag,
}: {
  assignedTagIds: ID[]
  onToggleTag: (id: ID) => void
}) {
  const tags = useTagStore((state) => state.tags)
  const addTag = useTagStore((state) => state.addTag)
  const [query, setQuery] = useState('')

  const filtered = tags.filter((tag) =>
    tag.name.toLowerCase().includes(query.trim().toLowerCase()),
  )
  const trimmedQuery = query.trim()
  const exactMatch = tags.some(
    (tag) => tag.name.toLowerCase() === trimmedQuery.toLowerCase(),
  )

  async function handleCreate() {
    if (!trimmedQuery) return
    const id = crypto.randomUUID()
    await addTag({ id, name: trimmedQuery, color: swatchColor(tags.length) })
    onToggleTag(id)
    setQuery('')
  }

  return (
    <div className="tag-picker">
      <input
        type="text"
        aria-label="Search tags"
        placeholder="Search or create tag…"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      <ul className="tag-picker-list" role="listbox" aria-label="Tags">
        {filtered.map((tag) => {
          const selected = assignedTagIds.includes(tag.id)
          return (
            <li key={tag.id}>
              <button
                type="button"
                role="option"
                aria-selected={selected}
                className={`tag-picker-option${selected ? ' selected' : ''}`}
                onClick={() => onToggleTag(tag.id)}
              >
                <span
                  className="tag-picker-swatch"
                  style={{ background: tag.color }}
                  aria-hidden="true"
                />
                {tag.name}
              </button>
            </li>
          )
        })}
      </ul>
      {trimmedQuery && !exactMatch && (
        <button
          type="button"
          className="tag-picker-create"
          onClick={handleCreate}
        >
          Create &quot;{trimmedQuery}&quot;
        </button>
      )}
    </div>
  )
}
