import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { db } from '../db/db'
import { useTagStore } from '../store/useTagStore'
import { TagPicker } from './TagPicker'

beforeEach(async () => {
  await db.tags.clear()
  useTagStore.setState({
    tags: [
      { id: 'tag-1', name: 'errand', color: '#2FB380' },
      { id: 'tag-2', name: 'home', color: '#AF52DE' },
    ],
    loaded: true,
  })
})

describe('TagPicker', () => {
  it('lists existing tags', () => {
    render(<TagPicker assignedTagIds={[]} onToggleTag={vi.fn()} />)
    expect(screen.getByRole('option', { name: 'errand' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'home' })).toBeInTheDocument()
  })

  it('marks assigned tags as selected', () => {
    render(<TagPicker assignedTagIds={['tag-1']} onToggleTag={vi.fn()} />)
    expect(screen.getByRole('option', { name: 'errand' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('option', { name: 'home' })).toHaveAttribute('aria-selected', 'false')
  })

  it('calls onToggleTag when an existing tag is clicked', async () => {
    const user = userEvent.setup()
    const onToggleTag = vi.fn()
    render(<TagPicker assignedTagIds={[]} onToggleTag={onToggleTag} />)

    await user.click(screen.getByRole('option', { name: 'errand' }))

    expect(onToggleTag).toHaveBeenCalledWith('tag-1')
  })

  it('filters tags by search text', async () => {
    const user = userEvent.setup()
    render(<TagPicker assignedTagIds={[]} onToggleTag={vi.fn()} />)

    await user.type(screen.getByRole('textbox', { name: /search tags/i }), 'err')

    expect(screen.getByRole('option', { name: 'errand' })).toBeInTheDocument()
    expect(screen.queryByRole('option', { name: 'home' })).not.toBeInTheDocument()
  })

  it('creates a new tag and assigns it', async () => {
    const user = userEvent.setup()
    const onToggleTag = vi.fn()
    render(<TagPicker assignedTagIds={[]} onToggleTag={onToggleTag} />)

    await user.type(screen.getByRole('textbox', { name: /search tags/i }), 'urgent')
    await user.click(screen.getByRole('button', { name: /create "urgent"/i }))

    expect(useTagStore.getState().tags.map((t) => t.name)).toContain('urgent')
    expect(onToggleTag).toHaveBeenCalled()
  })
})
