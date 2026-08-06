import { renderHook } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { useHotkeys } from './keyboard'

describe('useHotkeys', () => {
  it('invokes the handler when the mod+key combo is pressed', async () => {
    const user = userEvent.setup()
    const handler = vi.fn()
    renderHook(() => useHotkeys({ 'mod+n': handler }))

    await user.keyboard('{Meta>}n{/Meta}')

    expect(handler).toHaveBeenCalledTimes(1)
  })

  it('invokes the handler for a plain key combo', async () => {
    const user = userEvent.setup()
    const handler = vi.fn()
    renderHook(() => useHotkeys({ escape: handler }))

    await user.keyboard('{Escape}')

    expect(handler).toHaveBeenCalledTimes(1)
  })

  it('does not invoke the handler for an unrelated key', async () => {
    const user = userEvent.setup()
    const handler = vi.fn()
    renderHook(() => useHotkeys({ 'mod+n': handler }))

    await user.keyboard('n')

    expect(handler).not.toHaveBeenCalled()
  })

  it('stops listening after unmount', async () => {
    const user = userEvent.setup()
    const handler = vi.fn()
    const { unmount } = renderHook(() => useHotkeys({ 'mod+n': handler }))
    unmount()

    await user.keyboard('{Meta>}n{/Meta}')

    expect(handler).not.toHaveBeenCalled()
  })
})
