import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { TaskRow } from './TaskRow'

const task = {
  id: 't1',
  title: 'Buy milk',
  tagIds: ['tag-1'],
  thisEvening: false,
  completed: false,
  order: 0,
  createdAt: '2026-08-05T00:00:00.000Z',
}

const tags = [{ id: 'tag-1', name: 'errand', color: '#2FB380' }]

describe('TaskRow', () => {
  it('renders the task title and its tags', () => {
    render(<TaskRow task={task} tags={tags} onToggleComplete={vi.fn()} onSelect={vi.fn()} />)
    expect(screen.getByText('Buy milk')).toBeInTheDocument()
    expect(screen.getByText('errand')).toBeInTheDocument()
  })

  it('toggles complete when the checkbox is clicked', async () => {
    const user = userEvent.setup()
    const onToggleComplete = vi.fn()
    render(<TaskRow task={task} tags={tags} onToggleComplete={onToggleComplete} onSelect={vi.fn()} />)

    await user.click(screen.getByRole('checkbox'))

    expect(onToggleComplete).toHaveBeenCalledWith('t1', true)
  })

  it('applies a completed style when the task is complete', () => {
    render(
      <TaskRow
        task={{ ...task, completed: true }}
        tags={tags}
        onToggleComplete={vi.fn()}
        onSelect={vi.fn()}
      />,
    )
    expect(screen.getByText('Buy milk')).toHaveClass('task-row-title-completed')
  })

  it('calls onSelect when the row is clicked, not the checkbox', async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    render(<TaskRow task={task} tags={tags} onToggleComplete={vi.fn()} onSelect={onSelect} />)

    await user.click(screen.getByText('Buy milk'))

    expect(onSelect).toHaveBeenCalledWith('t1')
  })

  it('shows an overdue date badge for a past-due task', () => {
    render(
      <TaskRow
        task={{ ...task, when: '2000-01-01' }}
        tags={[]}
        onToggleComplete={vi.fn()}
        onSelect={vi.fn()}
        today="2026-08-05"
      />,
    )
    expect(screen.getByText('2000-01-01')).toHaveClass('task-row-date-overdue')
  })

  it('shows the project or area name when provided', () => {
    render(
      <TaskRow
        task={task}
        tags={[]}
        onToggleComplete={vi.fn()}
        onSelect={vi.fn()}
        contextName="Kitchen"
      />,
    )
    expect(screen.getByText('Kitchen')).toBeInTheDocument()
  })
})
