import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import App from './App'
import { db } from './db/db'
import { useAreaStore } from './store/useAreaStore'
import { useProjectStore } from './store/useProjectStore'
import { useTagStore } from './store/useTagStore'
import { useTaskStore } from './store/useTaskStore'

beforeEach(async () => {
  await Promise.all([
    db.tasks.clear(),
    db.projects.clear(),
    db.areas.clear(),
    db.tags.clear(),
  ])
  useTaskStore.setState({ tasks: [], loaded: false })
  useProjectStore.setState({ projects: [], loaded: false })
  useAreaStore.setState({ areas: [], loaded: false })
  useTagStore.setState({ tags: [], loaded: false })
})

function renderApp(initialEntries = ['/today']) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <App />
    </MemoryRouter>,
  )
}

describe('App', () => {
  it('hydrates the stores and renders the Today view by default', async () => {
    renderApp()
    expect(await screen.findByRole('heading', { name: 'Today' })).toBeInTheDocument()
    expect(useTaskStore.getState().loaded).toBe(true)
  })

  it('renders the sidebar alongside the routed view', async () => {
    renderApp(['/upcoming'])
    expect(await screen.findByRole('heading', { name: 'Upcoming' })).toBeInTheDocument()
    expect(screen.getByRole('navigation', { name: 'Main' })).toBeInTheDocument()
  })

  it('opens Quick Entry with the mod+n shortcut', async () => {
    const user = userEvent.setup()
    renderApp()
    await screen.findByRole('heading', { name: 'Today' })

    await user.keyboard('{Meta>}n{/Meta}')

    expect(screen.getByRole('dialog', { name: /quick entry/i })).toBeInTheDocument()
  })

  it('opens Quick Entry from the sidebar New To-Do button', async () => {
    const user = userEvent.setup()
    renderApp()
    await screen.findByRole('heading', { name: 'Today' })

    await user.click(screen.getByRole('button', { name: /new to-do/i }))

    expect(screen.getByRole('dialog', { name: /quick entry/i })).toBeInTheDocument()
  })
})
