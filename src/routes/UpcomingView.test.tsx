import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useTaskStore } from '../store/useTaskStore'
import { UpcomingView } from './UpcomingView'

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

function renderUpcomingView() {
  return render(
    <MemoryRouter>
      <UpcomingView />
    </MemoryRouter>,
  )
}

describe('UpcomingView', () => {
  it('renders the Upcoming heading', () => {
    renderUpcomingView()
    expect(screen.getByRole('heading', { name: 'Upcoming', level: 1 })).toBeInTheDocument()
  })

  it('groups future tasks by date and excludes today and the past', () => {
    useTaskStore.setState({
      tasks: [
        makeTask({ id: 't1', title: 'Today task', when: '2026-08-05' }),
        makeTask({ id: 't2', title: 'Overdue task', when: '2026-08-01' }),
        makeTask({ id: 't3', title: 'Later this week', when: '2026-08-06' }),
        makeTask({ id: 't4', title: 'Next week', when: '2026-08-13' }),
      ],
      loaded: true,
    })
    renderUpcomingView()

    expect(screen.queryByText('Today task')).not.toBeInTheDocument()
    expect(screen.queryByText('Overdue task')).not.toBeInTheDocument()
    expect(screen.getByText('Thursday, 6 August')).toBeInTheDocument()
    expect(screen.getByText('Later this week')).toBeInTheDocument()
    expect(screen.getByText('Thursday, 13 August')).toBeInTheDocument()
    expect(screen.getByText('Next week')).toBeInTheDocument()
  })

  it('orders date groups ascending', () => {
    useTaskStore.setState({
      tasks: [
        makeTask({ id: 't1', title: 'Later', when: '2026-08-20' }),
        makeTask({ id: 't2', title: 'Sooner', when: '2026-08-06' }),
      ],
      loaded: true,
    })
    renderUpcomingView()

    const headers = screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent)
    expect(headers).toEqual(['Thursday, 6 August', 'Thursday, 20 August'])
  })
})
