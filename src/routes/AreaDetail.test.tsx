import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import { useAreaStore } from '../store/useAreaStore'
import { useTaskStore } from '../store/useTaskStore'
import { AreaDetail } from './AreaDetail'

beforeEach(() => {
  useAreaStore.setState({
    areas: [{ id: 'a1', name: 'Work', order: 0 }],
    loaded: true,
  })
  useTaskStore.setState({ tasks: [], loaded: true })
})

function renderAreaDetail(id = 'a1') {
  return render(
    <MemoryRouter initialEntries={[`/areas/${id}`]}>
      <Routes>
        <Route path="/areas/:id" element={<AreaDetail />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('AreaDetail', () => {
  it('renders the area name as the heading', () => {
    renderAreaDetail()
    expect(screen.getByRole('heading', { name: 'Work', level: 1 })).toBeInTheDocument()
  })

  it('splits tasks belonging directly to the area into unscheduled and scheduled groups', () => {
    useTaskStore.setState({
      tasks: [
        { id: 't1', title: 'No date', areaId: 'a1', tagIds: [], thisEvening: false, completed: false, order: 0, createdAt: '' },
        { id: 't2', title: 'Has date', areaId: 'a1', when: '2026-08-10', tagIds: [], thisEvening: false, completed: false, order: 1, createdAt: '' },
        { id: 't3', title: 'Other area', areaId: 'a2', tagIds: [], thisEvening: false, completed: false, order: 2, createdAt: '' },
      ],
      loaded: true,
    })
    renderAreaDetail()

    expect(screen.getByText('No date')).toBeInTheDocument()
    expect(screen.getByText('Has date')).toBeInTheDocument()
    expect(screen.getByText('Scheduled')).toBeInTheDocument()
    expect(screen.queryByText('Other area')).not.toBeInTheDocument()
  })
})
