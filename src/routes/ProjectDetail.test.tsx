import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import { useProjectStore } from '../store/useProjectStore'
import { useTaskStore } from '../store/useTaskStore'
import { ProjectDetail } from './ProjectDetail'

beforeEach(() => {
  useProjectStore.setState({
    projects: [{ id: 'p1', name: 'Kitchen', completed: false, order: 0 }],
    loaded: true,
  })
  useTaskStore.setState({ tasks: [], loaded: true })
})

function renderProjectDetail(id = 'p1') {
  return render(
    <MemoryRouter initialEntries={[`/projects/${id}`]}>
      <Routes>
        <Route path="/projects/:id" element={<ProjectDetail />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('ProjectDetail', () => {
  it('renders the project name as the heading', () => {
    renderProjectDetail()
    expect(screen.getByRole('heading', { name: 'Kitchen', level: 1 })).toBeInTheDocument()
  })

  it('splits tasks into unscheduled and scheduled groups', () => {
    useTaskStore.setState({
      tasks: [
        { id: 't1', title: 'No date', projectId: 'p1', tagIds: [], thisEvening: false, completed: false, order: 0, createdAt: '' },
        { id: 't2', title: 'Has date', projectId: 'p1', when: '2026-08-10', tagIds: [], thisEvening: false, completed: false, order: 1, createdAt: '' },
        { id: 't3', title: 'Other project', projectId: 'p2', tagIds: [], thisEvening: false, completed: false, order: 2, createdAt: '' },
        { id: 't4', title: 'Completed', projectId: 'p1', tagIds: [], thisEvening: false, completed: true, order: 3, createdAt: '' },
      ],
      loaded: true,
    })
    renderProjectDetail()

    expect(screen.getByText('No date')).toBeInTheDocument()
    expect(screen.getByText('Has date')).toBeInTheDocument()
    expect(screen.getByText('Scheduled')).toBeInTheDocument()
    expect(screen.queryByText('Other project')).not.toBeInTheDocument()
    expect(screen.queryByText('Completed')).not.toBeInTheDocument()
  })
})
