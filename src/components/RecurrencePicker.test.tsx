import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { RecurrencePicker } from './RecurrencePicker'

describe('RecurrencePicker', () => {
  it('defaults to weekly with an interval of 1 when there is no rule', () => {
    render(<RecurrencePicker value={undefined} onChange={vi.fn()} anchor="2026-08-05" />)
    expect(screen.getByLabelText(/frequency/i)).toHaveValue('weekly')
    expect(screen.getByLabelText(/every/i)).toHaveValue(1)
  })

  it('switches frequency and reports the new rule', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<RecurrencePicker value={undefined} onChange={onChange} anchor="2026-08-05" />)

    await user.selectOptions(screen.getByLabelText(/frequency/i), 'daily')

    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ freq: 'daily', interval: 1, anchor: '2026-08-05' }),
    )
  })

  it('changes the interval', () => {
    const onChange = vi.fn()
    render(
      <RecurrencePicker
        value={{ freq: 'daily', interval: 1, anchor: '2026-08-05' }}
        onChange={onChange}
        anchor="2026-08-05"
      />,
    )

    fireEvent.change(screen.getByLabelText(/every/i), { target: { value: '3' } })

    expect(onChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ freq: 'daily', interval: 3 }),
    )
  })

  it('shows weekday toggles only for weekly and toggles a weekday', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <RecurrencePicker
        value={{ freq: 'weekly', interval: 1, anchor: '2026-08-05' }}
        onChange={onChange}
        anchor="2026-08-05"
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Mon' }))

    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ freq: 'weekly', byWeekday: [1] }),
    )
  })

  it('does not show weekday toggles for daily or monthly', () => {
    render(
      <RecurrencePicker
        value={{ freq: 'daily', interval: 1, anchor: '2026-08-05' }}
        onChange={vi.fn()}
        anchor="2026-08-05"
      />,
    )
    expect(screen.queryByRole('button', { name: 'Mon' })).not.toBeInTheDocument()
  })

  it('clears the rule when None is clicked', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <RecurrencePicker
        value={{ freq: 'daily', interval: 1, anchor: '2026-08-05' }}
        onChange={onChange}
        anchor="2026-08-05"
      />,
    )

    await user.click(screen.getByRole('button', { name: 'None' }))

    expect(onChange).toHaveBeenCalledWith(undefined)
  })
})
