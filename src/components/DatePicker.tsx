import { addDays, nextWeekend, todayISO } from '../lib/dates'
import './DatePicker.css'

export function DatePicker({
  value,
  onChange,
  today = todayISO(),
}: {
  value: string | undefined
  onChange: (value: string | undefined) => void
  today?: string
}) {
  return (
    <div className="date-picker">
      <div className="date-picker-quick-options">
        <button type="button" onClick={() => onChange(today)}>
          Today
        </button>
        <button type="button" onClick={() => onChange(addDays(today, 1))}>
          Tomorrow
        </button>
        <button type="button" onClick={() => onChange(nextWeekend(today))}>
          This Weekend
        </button>
        <button type="button" onClick={() => onChange(undefined)}>
          Someday
        </button>
      </div>
      <label className="date-picker-custom">
        Custom date
        <input
          type="date"
          value={value ?? ''}
          onChange={(event) => onChange(event.target.value || undefined)}
        />
      </label>
    </div>
  )
}
