import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { db } from '../db/db'
import { useAreaStore } from '../store/useAreaStore'
import { useProjectStore } from '../store/useProjectStore'
import { useTagStore } from '../store/useTagStore'
import { useTaskStore } from '../store/useTaskStore'
import { TaskList } from './TaskList'

const tasks = [
  { id: 't1', title: 'Buy milk', projectId: 'p1', tagIds: [], thisEvening: false, completed: false, order: 0, createdAt: '' },
  { id: 't2', title: 'Post letter', tagIds: [], thisEvening: false, completed: false, order: 1, createdAt: '' },
]

beforeEach(async () => {
  await db.tasks.clear()
  useTaskStore.setState({ tasks, loaded: true })
  useTagStore.setState({ tags: [], loaded: true })
  useProjectStore.setState({
    projects: [{ id: 'p1', name: 'Kitchen', completed: false, order: 0 }],
    loaded: true,
  })
  useAreaStore.setState({ areas: [], loaded: true })
})

describe('TaskList', () => {
  it('renders a row per task', () => {
    render(<TaskList tasks={tasks} onSelect={vi.fn()} />)
    expect(screen.getByText('Buy milk')).toBeInTheDocument()
    expect(screen.getByText('Post letter')).toBeInTheDocument()
  })

  it('shows the project name as context when showContext is set', () => {
    render(<TaskList tasks={tasks} onSelect={vi.fn()} showContext />)
    expect(screen.getByText('Kitchen')).toBeInTheDocument()
  })

  it('does not show context by default', () => {
    render(<TaskList tasks={tasks} onSelect={vi.fn()} />)
    expect(screen.queryByText('Kitchen')).not.toBeInTheDocument()
  })

  it('persists completion toggles through the task store', async () => {
    const user = userEvent.setup()
    render(<TaskList tasks={tasks} onSelect={vi.fn()} />)

    await user.click(screen.getAllByRole('checkbox')[0])

    expect(useTaskStore.getState().tasks.find((t) => t.id === 't1')?.completed).toBe(true)
  })

  it('calls onSelect when a row is clicked', async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    render(<TaskList tasks={tasks} onSelect={onSelect} />)

    await user.click(screen.getByText('Buy milk'))

    expect(onSelect).toHaveBeenCalledWith('t1')
  })

  it('advances a recurring task to its next occurrence rather than completing it', async () => {
    const user = userEvent.setup()
    const recurringTasks = [
      {
        id: 't3',
        title: 'Water plants',
        tagIds: [] as string[],
        thisEvening: false,
        completed: false,
        order: 0,
        createdAt: '',
        when: '2026-08-05',
        recurrence: { freq: 'daily' as const, interval: 1, anchor: '2026-08-05' },
      },
    ]
    useTaskStore.setState({ tasks: recurringTasks, loaded: true })
    render(<TaskList tasks={recurringTasks} onSelect={vi.fn()} />)

    await user.click(screen.getByRole('checkbox'))

    const task = useTaskStore.getState().tasks[0]
    expect(task.completed).toBe(false)
    expect(task.when).toBe('2026-08-06')
  })

  it('uncompletes a task by unchecking it', async () => {
    const user = userEvent.setup()
    const completedTasks = [
      { id: 't4', title: 'Done thing', tagIds: [] as string[], thisEvening: false, completed: true, order: 0, createdAt: '' },
    ]
    useTaskStore.setState({ tasks: completedTasks, loaded: true })
    render(<TaskList tasks={completedTasks} onSelect={vi.fn()} />)

    await user.click(screen.getByRole('checkbox'))

    expect(useTaskStore.getState().tasks[0].completed).toBe(false)
  })
})
