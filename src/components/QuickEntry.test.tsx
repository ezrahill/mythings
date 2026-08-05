import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { db } from '../db/db'
import { todayISO } from '../lib/dates'
import { useTaskStore } from '../store/useTaskStore'
import { QuickEntry } from './QuickEntry'

beforeEach(async () => {
  await db.tasks.clear()
  useTaskStore.setState({ tasks: [], loaded: false })
})

describe('QuickEntry', () => {
  it('renders nothing when closed', () => {
    render(<QuickEntry open={false} onClose={vi.fn()} />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('auto-focuses the title input when open', () => {
    render(<QuickEntry open onClose={vi.fn()} />)
    expect(screen.getByRole('textbox', { name: /title/i })).toHaveFocus()
  })

  it('creates a task and closes on Enter', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<QuickEntry open onClose={onClose} />)

    await user.type(screen.getByRole('textbox', { name: /title/i }), 'Buy milk{Enter}')

    expect(useTaskStore.getState().tasks.map((t) => t.title)).toEqual(['Buy milk'])
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('schedules the new task for today, so it is visible in the Today view', async () => {
    const user = userEvent.setup()
    render(<QuickEntry open onClose={vi.fn()} />)

    await user.type(screen.getByRole('textbox', { name: /title/i }), 'Buy milk{Enter}')

    expect(useTaskStore.getState().tasks[0].when).toBe(todayISO())
  })

  it('does not create a task on Escape, just closes', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<QuickEntry open onClose={onClose} />)

    await user.type(screen.getByRole('textbox', { name: /title/i }), 'Discard me{Escape}')

    expect(useTaskStore.getState().tasks).toEqual([])
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('does not create a task for an empty title on Enter', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<QuickEntry open onClose={onClose} />)

    await user.type(screen.getByRole('textbox', { name: /title/i }), '{Enter}')

    expect(useTaskStore.getState().tasks).toEqual([])
    expect(onClose).not.toHaveBeenCalled()
  })
})
