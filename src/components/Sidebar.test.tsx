import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useAreaStore } from '../store/useAreaStore'
import { useProjectStore } from '../store/useProjectStore'
import { useTaskStore } from '../store/useTaskStore'
import { Sidebar } from './Sidebar'

beforeEach(() => {
  useAreaStore.setState({ areas: [], loaded: false })
  useProjectStore.setState({ projects: [], loaded: false })
  useTaskStore.setState({ tasks: [], loaded: false })
})

function renderSidebar(initialEntries = ['/today']) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <Sidebar onNewTask={vi.fn()} />
    </MemoryRouter>,
  )
}

describe('Sidebar', () => {
  it('renders the fixed nav items', () => {
    renderSidebar()
    expect(screen.getByRole('link', { name: /today/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /upcoming/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /projects/i })).toBeInTheDocument()
  })

  it('marks the active route', () => {
    renderSidebar(['/upcoming'])
    expect(screen.getByRole('link', { name: /upcoming/i })).toHaveClass('active')
    expect(screen.getByRole('link', { name: /today/i })).not.toHaveClass('active')
  })

  it('calls onNewTask when the New To-Do button is clicked', async () => {
    const onNewTask = vi.fn()
    render(
      <MemoryRouter>
        <Sidebar onNewTask={onNewTask} />
      </MemoryRouter>,
    )
    screen.getByRole('button', { name: /new to-do/i }).click()
    expect(onNewTask).toHaveBeenCalledTimes(1)
  })

  it('renders areas with their nested projects', () => {
    useAreaStore.setState({ areas: [{ id: 'a1', name: 'Work', order: 0 }], loaded: true })
    useProjectStore.setState({
      projects: [{ id: 'p1', name: 'Launch site', areaId: 'a1', completed: false, order: 0 }],
      loaded: true,
    })
    renderSidebar()
    expect(screen.getByText('Work')).toBeInTheDocument()
    expect(screen.getByText('Launch site')).toBeInTheDocument()
  })

  it('shows a Today count that includes overdue and this-evening tasks', () => {
    useTaskStore.setState({
      tasks: [
        { id: 't1', title: 'Overdue', tagIds: [], thisEvening: false, completed: false, order: 0, createdAt: '', when: '2000-01-01' },
        { id: 't2', title: 'Evening', tagIds: [], thisEvening: true, completed: false, order: 1, createdAt: '' },
        { id: 't3', title: 'Done', tagIds: [], thisEvening: true, completed: true, order: 2, createdAt: '' },
      ],
      loaded: true,
    })
    renderSidebar()
    const todayLink = screen.getByRole('link', { name: /today/i })
    expect(todayLink).toHaveTextContent('2')
  })
})
