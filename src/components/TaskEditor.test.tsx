import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { db } from '../db/db'
import { useAreaStore } from '../store/useAreaStore'
import { useProjectStore } from '../store/useProjectStore'
import { useTagStore } from '../store/useTagStore'
import { useTaskStore } from '../store/useTaskStore'
import { TaskEditor } from './TaskEditor'

const task = {
  id: 't1',
  title: 'Buy milk',
  notes: '',
  tagIds: [] as string[],
  thisEvening: false,
  completed: false,
  order: 0,
  createdAt: '2026-08-05T00:00:00.000Z',
}

beforeEach(async () => {
  await Promise.all([db.tasks.clear(), db.projects.clear(), db.tags.clear()])
  useTaskStore.setState({ tasks: [task], loaded: true })
  useProjectStore.setState({
    projects: [{ id: 'p1', name: 'Kitchen', completed: false, order: 0 }],
    loaded: true,
  })
  useAreaStore.setState({ areas: [], loaded: true })
  useTagStore.setState({ tags: [{ id: 'tag-1', name: 'errand', color: '#2FB380' }], loaded: true })
})

describe('TaskEditor', () => {
  it('renders nothing when there is no task selected', () => {
    const { container } = render(<TaskEditor taskId={null} onClose={vi.fn()} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('renders the task title and notes', () => {
    render(<TaskEditor taskId="t1" onClose={vi.fn()} />)
    expect(screen.getByDisplayValue('Buy milk')).toBeInTheDocument()
  })

  it('persists a title edit', async () => {
    const user = userEvent.setup()
    render(<TaskEditor taskId="t1" onClose={vi.fn()} />)

    const titleInput = screen.getByDisplayValue('Buy milk')
    await user.clear(titleInput)
    await user.type(titleInput, 'Buy oat milk')
    await user.tab()

    expect(useTaskStore.getState().tasks[0].title).toBe('Buy oat milk')
  })

  it('persists a notes edit', async () => {
    const user = userEvent.setup()
    render(<TaskEditor taskId="t1" onClose={vi.fn()} />)

    const notes = screen.getByPlaceholderText(/add notes/i)
    await user.type(notes, 'Semi-skimmed')
    await user.tab()

    expect(useTaskStore.getState().tasks[0].notes).toBe('Semi-skimmed')
  })

  it('marks the task complete', async () => {
    const user = userEvent.setup()
    render(<TaskEditor taskId="t1" onClose={vi.fn()} />)

    await user.click(screen.getByRole('button', { name: /mark complete/i }))

    expect(useTaskStore.getState().tasks[0].completed).toBe(true)
  })

  it('assigns a project from the picker', async () => {
    const user = userEvent.setup()
    render(<TaskEditor taskId="t1" onClose={vi.fn()} />)

    await user.selectOptions(screen.getByLabelText(/project\/area/i), 'project:p1')

    expect(useTaskStore.getState().tasks[0].projectId).toBe('p1')
  })

  it('assigns a tag via the tag picker', async () => {
    const user = userEvent.setup()
    render(<TaskEditor taskId="t1" onClose={vi.fn()} />)

    await user.click(screen.getByRole('button', { name: /add tag/i }))
    await user.click(screen.getByRole('option', { name: 'errand' }))

    expect(useTaskStore.getState().tasks[0].tagIds).toEqual(['tag-1'])
  })

  it('sets the scheduled date via the date picker', async () => {
    const user = userEvent.setup()
    render(<TaskEditor taskId="t1" onClose={vi.fn()} />)

    await user.click(screen.getByRole('button', { name: /^when/i }))
    await user.click(screen.getByRole('button', { name: 'Today' }))

    expect(useTaskStore.getState().tasks[0].when).toBeDefined()
  })

  it('shows None for recurrence by default and can set a rule via the picker', async () => {
    const user = userEvent.setup()
    render(<TaskEditor taskId="t1" onClose={vi.fn()} />)

    expect(screen.getByRole('button', { name: /^recurrence/i })).toHaveTextContent('None')

    await user.click(screen.getByRole('button', { name: /^recurrence/i }))
    await user.selectOptions(screen.getByLabelText(/frequency/i), 'daily')

    expect(useTaskStore.getState().tasks[0].recurrence).toMatchObject({
      freq: 'daily',
      interval: 1,
    })
  })

  it('shows the plain-English recurrence summary once a rule is set', () => {
    useTaskStore.setState({
      tasks: [
        {
          ...task,
          recurrence: { freq: 'weekly', interval: 2, byWeekday: [1], anchor: '2026-08-05' },
        },
      ],
      loaded: true,
    })
    render(<TaskEditor taskId="t1" onClose={vi.fn()} />)

    expect(screen.getByRole('button', { name: /^recurrence/i })).toHaveTextContent(
      'Every 2 weeks on Mon',
    )
  })

  it('advances a recurring task to its next occurrence when Mark Complete is clicked', async () => {
    const user = userEvent.setup()
    useTaskStore.setState({
      tasks: [
        {
          ...task,
          when: '2026-08-05',
          recurrence: { freq: 'daily', interval: 1, anchor: '2026-08-05' },
        },
      ],
      loaded: true,
    })
    render(<TaskEditor taskId="t1" onClose={vi.fn()} />)

    await user.click(screen.getByRole('button', { name: /mark complete/i }))

    const updated = useTaskStore.getState().tasks[0]
    expect(updated.completed).toBe(false)
    expect(updated.when).toBe('2026-08-06')
  })
})
