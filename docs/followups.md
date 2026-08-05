# Follow-ups

Noticed but out of scope for this build pass.

- **DatePicker**: implemented as quick options (Today/Tomorrow/This Weekend/Someday) plus a native `<input type="date">`, rather than the custom single-month calendar grid described in `docs/design.md`. Functionally equivalent for scheduling a task; the bespoke calendar UI is a visual-polish item if pixel parity with the design matters.
- **TaskEditor Project/Area field**: implemented as a single `<select>` covering "None" / areas / projects, rather than two distinct fields. Simpler to use given a task can only belong to one or the other; revisit if the design intends visually separate pickers.
