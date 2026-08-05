import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import { useProjectStore } from '../store/useProjectStore'
import { useTaskStore } from '../store/useTaskStore'
import { ProjectsView } from './ProjectsView'

beforeEach(() => {
  useProjectStore.setState({ projects: [], loaded: true })
  useTaskStore.setState({ tasks: [], loaded: true })
})

function renderProjectsView() {
  return render(
    <MemoryRouter>
      <ProjectsView />
    </MemoryRouter>,
  )
}

describe('ProjectsView', () => {
  it('renders the Projects heading', () => {
    renderProjectsView()
    expect(screen.getByRole('heading', { name: 'Projects', level: 1 })).toBeInTheDocument()
  })

  it('lists active projects with a completed/total task fraction', () => {
    useProjectStore.setState({
      projects: [{ id: 'p1', name: 'Kitchen', completed: false, order: 0 }],
      loaded: true,
    })
    useTaskStore.setState({
      tasks: [
        { id: 't1', title: 'A', projectId: 'p1', tagIds: [], thisEvening: false, completed: true, order: 0, createdAt: '' },
        { id: 't2', title: 'B', projectId: 'p1', tagIds: [], thisEvening: false, completed: false, order: 1, createdAt: '' },
      ],
      loaded: true,
    })
    renderProjectsView()

    expect(screen.getByText('Kitchen')).toBeInTheDocument()
    expect(screen.getByText('1/2')).toBeInTheDocument()
  })

  it('excludes completed projects', () => {
    useProjectStore.setState({
      projects: [{ id: 'p1', name: 'Done project', completed: true, order: 0 }],
      loaded: true,
    })
    renderProjectsView()
    expect(screen.queryByText('Done project')).not.toBeInTheDocument()
  })

  it('links each project to its detail route', () => {
    useProjectStore.setState({
      projects: [{ id: 'p1', name: 'Kitchen', completed: false, order: 0 }],
      loaded: true,
    })
    renderProjectsView()
    expect(screen.getByRole('link', { name: /kitchen/i })).toHaveAttribute('href', '/projects/p1')
  })
})
