import { useEffect } from 'react'

type HotkeyHandler = (event: KeyboardEvent) => void

function matchesCombo(event: KeyboardEvent, combo: string): boolean {
  const parts = combo.toLowerCase().split('+')
  const key = parts.pop()
  const needsMod = parts.includes('mod')
  const needsShift = parts.includes('shift')

  const hasMod = event.metaKey || event.ctrlKey
  if (needsMod !== hasMod) return false
  if (needsShift !== event.shiftKey) return false

  return event.key.toLowerCase() === key
}

// Global keyboard shortcut registration - one hook owns `keydown` so
// shortcuts never get redefined per-view and conflict with each other.
export function useHotkeys(bindings: Record<string, HotkeyHandler>) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      for (const [combo, handler] of Object.entries(bindings)) {
        if (matchesCombo(event, combo)) {
          event.preventDefault()
          handler(event)
          return
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [bindings])
}
