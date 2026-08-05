# Follow-ups

Noticed but out of scope for this build pass.

- **DatePicker**: implemented as quick options (Today/Tomorrow/This Weekend/Someday) plus a native `<input type="date">`, rather than the custom single-month calendar grid described in `docs/design.md`. Functionally equivalent for scheduling a task; the bespoke calendar UI is a visual-polish item if pixel parity with the design matters.
- **TaskEditor Project/Area field**: implemented as a single `<select>` covering "None" / areas / projects, rather than two distinct fields. Simpler to use given a task can only belong to one or the other; revisit if the design intends visually separate pickers.
- **Task-complete linger-then-fade** (`docs/design.md` Interactions): design specifies a completed row should stay visible for ~600ms before fading out and the list reflowing. The views currently filter completed tasks out of the list immediately (the row just disappears), since each view derives its task list straight from the store. Implementing the linger needs local "recently completed" state (with a timeout) in `TaskList`, decoupled from the parent's already-filtered `tasks` prop — deferred as a targeted follow-up rather than threading it through this pass.
- **Detail panel exit transition**: `TaskEditor` has a CSS slide-in on mount, but closing it unmounts immediately (no slide-out) since the parent view just stops rendering it. An exit transition needs the same "linger after logical removal" pattern as above.
- **Drag reorder** (`docs/design.md` Interactions): no drag-and-drop is implemented — `Task.order` exists in the data model but nothing currently writes to it via dragging. This is a standalone feature (needs a DnD library or custom pointer handling), not a small polish item.
