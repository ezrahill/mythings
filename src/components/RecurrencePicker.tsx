import { WEEKDAY_ABBR } from '../lib/recurrence'
import type { RecurrenceRule } from '../types/task'
import './RecurrencePicker.css'

export function RecurrencePicker({
  value,
  onChange,
  anchor,
}: {
  value: RecurrenceRule | undefined
  onChange: (rule: RecurrenceRule | undefined) => void
  anchor: string
}) {
  const freq = value?.freq ?? 'weekly'
  const interval = value?.interval ?? 1
  const byWeekday = value?.byWeekday ?? []

  function apply(partial: Partial<RecurrenceRule>) {
    onChange({
      freq,
      interval,
      byWeekday: freq === 'weekly' ? byWeekday : undefined,
      anchor: value?.anchor ?? anchor,
      ...partial,
    })
  }

  return (
    <div className="recurrence-picker">
      <label>
        Frequency
        <select
          value={freq}
          onChange={(event) =>
            apply({ freq: event.target.value as RecurrenceRule['freq'] })
          }
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </label>

      <label>
        Every
        <input
          type="number"
          min={1}
          value={interval}
          onChange={(event) =>
            apply({ interval: Math.max(1, Number(event.target.value) || 1) })
          }
        />
      </label>

      {freq === 'weekly' && (
        <div
          className="recurrence-picker-weekdays"
          role="group"
          aria-label="Weekdays"
        >
          {WEEKDAY_ABBR.map((label, day) => {
            const selected = byWeekday.includes(day)
            return (
              <button
                key={day}
                type="button"
                aria-pressed={selected}
                className={selected ? 'selected' : ''}
                onClick={() =>
                  apply({
                    byWeekday: selected
                      ? byWeekday.filter((d) => d !== day)
                      : [...byWeekday, day],
                  })
                }
              >
                {label}
              </button>
            )
          })}
        </div>
      )}

      <button type="button" onClick={() => onChange(undefined)}>
        None
      </button>
    </div>
  )
}
