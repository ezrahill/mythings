import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import { useAreaStore } from '../store/useAreaStore'
import { AreasView } from './AreasView'

beforeEach(() => {
  useAreaStore.setState({ areas: [], loaded: true })
})

function renderAreasView() {
  return render(
    <MemoryRouter>
      <AreasView />
    </MemoryRouter>,
  )
}

describe('AreasView', () => {
  it('renders the Areas heading', () => {
    renderAreasView()
    expect(screen.getByRole('heading', { name: 'Areas', level: 1 })).toBeInTheDocument()
  })

  it('lists areas and links each to its detail route', () => {
    useAreaStore.setState({ areas: [{ id: 'a1', name: 'Work', order: 0 }], loaded: true })
    renderAreasView()
    expect(screen.getByRole('link', { name: 'Work' })).toHaveAttribute('href', '/areas/a1')
  })
})
