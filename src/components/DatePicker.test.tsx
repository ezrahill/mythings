import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { DatePicker } from './DatePicker'

describe('DatePicker', () => {
  it('sets today when the Today quick option is clicked', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<DatePicker value={undefined} onChange={onChange} today="2026-08-05" />)

    await user.click(screen.getByRole('button', { name: 'Today' }))

    expect(onChange).toHaveBeenCalledWith('2026-08-05')
  })

  it('sets tomorrow when the Tomorrow quick option is clicked', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<DatePicker value={undefined} onChange={onChange} today="2026-08-05" />)

    await user.click(screen.getByRole('button', { name: 'Tomorrow' }))

    expect(onChange).toHaveBeenCalledWith('2026-08-06')
  })

  it('sets the upcoming Saturday when This Weekend is clicked', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<DatePicker value={undefined} onChange={onChange} today="2026-08-05" />)

    await user.click(screen.getByRole('button', { name: 'This Weekend' }))

    expect(onChange).toHaveBeenCalledWith('2026-08-08')
  })

  it('clears the date when Someday is clicked', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<DatePicker value="2026-08-05" onChange={onChange} today="2026-08-05" />)

    await user.click(screen.getByRole('button', { name: 'Someday' }))

    expect(onChange).toHaveBeenCalledWith(undefined)
  })

  it('sets a custom date from the date input', async () => {
    const onChange = vi.fn()
    render(<DatePicker value={undefined} onChange={onChange} today="2026-08-05" />)

    const input = screen.getByLabelText(/custom date/i)
    await userEvent.type(input, '2026-12-25')

    expect(onChange).toHaveBeenCalledWith('2026-12-25')
  })
})
