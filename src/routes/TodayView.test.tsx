import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useTaskStore } from '../store/useTaskStore'
import { TodayView } from './TodayView'

function taskFixture(overrides: Partial<Parameters<typeof makeTask>[0]>) {
  return makeTask(overrides)
}

function makeTask(overrides: Record<string, unknown>) {
  return {
    id: 't-default',
    title: 'Untitled',
    tagIds: [] as string[],
    thisEvening: false,
    completed: false,
    order: 0,
    createdAt: '',
    ...overrides,
  }
}

beforeEach(() => {
  vi.useFakeTimers()
  vi.setSystemTime(new Date('2026-08-05T12:00:00.000Z'))
  useTaskStore.setState({ tasks: [], loaded: true })
})

afterEach(() => {
  vi.useRealTimers()
})

function renderTodayView() {
  return render(
    <MemoryRouter>
      <TodayView />
    </MemoryRouter>,
  )
}

describe('TodayView', () => {
  it('renders the Today heading and current date subtitle', () => {
    renderTodayView()
    expect(screen.getByRole('heading', { name: 'Today', level: 1 })).toBeInTheDocument()
    expect(screen.getByText('Wednesday, 5 August')).toBeInTheDocument()
  })

  it('hides sections that have no tasks', () => {
    renderTodayView()
    expect(screen.queryByText('Overdue')).not.toBeInTheDocument()
    expect(screen.queryByText('This Evening')).not.toBeInTheDocument()
  })

  it('splits tasks into Overdue, Today and This Evening sections', () => {
    useTaskStore.setState({
      tasks: [
        taskFixture({ id: 't1', title: 'Overdue task', when: '2000-01-01' }),
        taskFixture({ id: 't2', title: 'Due today', when: '2026-08-05' }),
        taskFixture({ id: 't3', title: 'Evening task', thisEvening: true }),
        taskFixture({ id: 't4', title: 'Future task', when: '2026-08-10' }),
        taskFixture({ id: 't5', title: 'Done task', when: '2026-08-05', completed: true }),
      ],
      loaded: true,
    })
    renderTodayView()

    expect(screen.getByText('Overdue')).toBeInTheDocument()
    expect(screen.getByText('Overdue task')).toBeInTheDocument()
    expect(screen.getByText('Due today')).toBeInTheDocument()
    expect(screen.getByText('This Evening')).toBeInTheDocument()
    expect(screen.getByText('Evening task')).toBeInTheDocument()
    expect(screen.queryByText('Future task')).not.toBeInTheDocument()
    expect(screen.queryByText('Done task')).not.toBeInTheDocument()
  })
})
