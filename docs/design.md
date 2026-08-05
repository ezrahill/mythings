# Design — MyThings

![[wireframe.excalidraw]]

Live sample (palette/type/hero): https://preview.thehackshop.com/proj-mythings/design/

## Vision

Calm, uncluttered, and fast — a tool that gets out of the way. The interface reads as quiet paper: soft off-white surfaces, restrained colour used only where it carries meaning (a task is overdue, an area is "Work"), generous whitespace, and one confident accent blue tying navigation and actions together. Every interaction — checking off a task, opening the detail panel, adding something new — should feel immediate and slightly springy, never jarring. The three-pane shell (nav / list / detail) keeps context visible at all times, so switching between Today and a project never feels like leaving the app.

## Palette

Light mode only for v1 (dark mode is a natural v2 addition; the token names below are chosen so a dark variant can slot in later without renaming).

| Role | Hex | Usage |
|---|---|---|
| `bg` | `#FFFFFF` | Task list / main content background |
| `sidebar-bg` | `#F5F5F7` | Sidebar background |
| `surface` | `#F0F1F3` | Row hover, chip background, swatch backdrop |
| `border` | `#E3E4E7` | Hairlines: row dividers, panel edges |
| `text` | `#1C1C1E` | Primary text (task titles, headings) |
| `text-secondary` | `#6E6E73` | Secondary text (notes preview, subtitles) |
| `text-tertiary` | `#A0A0A5` | Placeholders, muted metadata, disabled |
| `accent` | `#3478F6` | Active nav item, links, focus ring, primary buttons |
| `accent-soft` | `#EAF1FE` | Active nav item background |
| `today` | `#F2A93B` | Today nav icon |
| `upcoming` | `#E5484D` | Upcoming nav icon, overdue date/section label |
| `evening` | `#5E5CE6` | "This Evening" section label |

**Area/tag colour set** (assigned round-robin as areas/tags are created; user can't currently override in v1, but store the value per-record so this is easy to add later):

`#2FB380` (green), `#AF52DE` (purple), `#30B0C7` (teal), `#E5484D` (red), `#F2A93B` (amber), `#5E5CE6` (indigo), `#FF6B9D` (pink), `#8E8E93` (grey — fallback/overflow).

Contrast: `text` on `bg`/`surface`/`sidebar-bg` = 16.1:1. `text-secondary` on `bg` = 5.4:1. `accent` on `bg` = 4.6:1 — all pass WCAG AA for body text (≥4.5:1). Area/tag colours are used as small dots/chip backgrounds with dark text on top (chips use `surface` bg + `text-secondary`, never colour-as-background-with-white-text for body copy), so none of them carry a text-contrast obligation directly.

## Typography

**Family:** `-apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', sans-serif` — native San Francisco on Mac/iOS, Inter (self-hosted or Google Fonts, weights 400/500/600/700) everywhere else. Inter was chosen over a generic system stack because its metrics and humanist-geometric shapes are close enough to SF that switching between the two at runtime doesn't cause a visible personality shift.

| Token | Size / Line-height | Weight | Usage |
|---|---|---|---|
| `title` | 28px / 34px | 700 | View title ("Today", "Upcoming") |
| `heading` | 19px / 26px | 600 | Detail panel task title, project/area names |
| `body` | 15px / 20px | 400 | Task row title, editor body text |
| `body-secondary` | 13px / 18px | 400 | Task notes preview, view subtitle |
| `label-nav` | 14px / 20px | 500 | Sidebar nav items |
| `label-section` | 11–12px / 16px | 600 | Group headers (OVERDUE, TODAY, THIS EVENING) — uppercase, letter-spacing 0.04–0.05em |
| `label-field` | 11px / 16px | 600 | Detail panel field labels — uppercase, letter-spacing 0.04em |
| `chip` | 12px / 16px | 500 | Tag chips, counts |

Letter-spacing on `title` is slightly negative (-0.01em) for a tighter, more confident large headline; all uppercase labels get positive tracking so they don't feel cramped at small size.

## Spacing & layout

**Base unit:** 4px. Scale: 4, 8, 12, 16, 20, 24, 32, 40, 48.

- Sidebar width: 260px fixed (collapses to a 64px icon rail below 1024px, see breakpoints).
- Detail panel width: 360px, slides in from the right; overlays rather than squeezes the list below 1024px.
- Task list content padding: 32px top, 40px sides (desktop); 20px/16px on mobile.
- Task row: min-height 38px, 9px vertical / 8px horizontal padding, 8px border-radius on hover state, 1px `border` bottom hairline between rows (no hairline after the last row in a group).
- Group header spacing: 24px above, 8px below.
- Sidebar nav item: 7px vertical / 10px horizontal padding, 6px border-radius, 4px gap between stacked items.

**Breakpoints (three-pane shell → responsive):**
- `≥1024px` — full three-pane: sidebar (260px) + list (fluid) + detail panel (360px) side by side.
- `768–1023px` — two-pane: sidebar collapses to a 64px icon-only rail (expands as a temporary overlay on click/hover); list is fluid; detail panel becomes a right-side overlay (360px, drop shadow) above the list rather than pushing it.
- `<768px` — single pane: sidebar hidden behind a hamburger/back affordance as a full-screen overlay; detail panel opens full-screen with a back chevron replacing the panel's implicit "click outside to close."

Max content width 1280px, centred, with a 1px `border`-coloured outline standing in for a shadow on very wide viewports (keeps the app feeling like a bounded surface rather than stretching edge-to-edge on ultrawide monitors).

## Sections

**Sidebar** — top: a "New To-Do" quick-entry affordance styled as a subtle bordered button (not filled — it's a secondary action relative to the task list itself) with a right-aligned `⌘N` hint. Below: four fixed nav items (Today, Upcoming, Projects, Areas... actually Areas has no single nav row — see below), each with a small coloured icon-dot (today = amber sun glyph, upcoming = red calendar glyph, projects = blue folder glyph) and a right-aligned count badge in `text-tertiary`. Active item gets `accent-soft` background + `accent` text/icon. Below the fixed items, an "Areas" section label introduces the areas/projects tree: each area is a row with its own coloured swatch + name; its projects are indented rows beneath it with a small square bullet in `text-tertiary`. The tree scrolls independently if it overflows; fixed nav items never scroll away.

**Today view** — title "Today" + subtitle showing the current date (`body-secondary`). Sections in fixed order, each only rendered if it has tasks: **Overdue** (label in `upcoming` red), **Today**, **This Evening** (label in `evening` indigo). Each is a flat list of task rows — no extra card chrome, just the hairline-separated rows described above.

**Upcoming view** — title "Upcoming". Tasks grouped by date, each date as a `label-section` group header (e.g. "Wednesday, 6 August"); today's tasks are excluded (they live in Today). Groups with no tasks between two populated dates are skipped entirely rather than shown empty.

**Projects / Areas views** — a lightweight nav grid or list of project/area cards (name, small progress indicator — completed/total task count as a dim fraction, not a progress bar, to stay consistent with Things' text-first feel) that route into `ProjectDetail`/`AreaDetail`, which reuse the exact same task-list layout as Today/Upcoming (title = project/area name, tasks grouped by "no date" vs scheduled).

**Task row** — leading circular checkbox (18px, 1.5px `#C7C7CC` stroke; filled `accent` with a white check mark when complete), title (`body`, strikethrough + `text-tertiary` when complete — see Interactions for the completion delay), and trailing metadata that only appears where relevant: a tag chip (`surface` background, `text-secondary`, fully rounded, 12px text), a project/area name in `text-tertiary` when the row is shown outside its own project context (e.g. in Today), and a date badge in `upcoming` red for overdue or `text-tertiary` for a neutral scheduled date. Secondary metadata (schedule/tag quick-edit icons) is hidden until row hover to keep the resting state calm.

**Task editor / detail panel** — opens on row click, slides in from the right (see Interactions). Title is an inline-editable heading (`heading` style). Below, stacked fields each with an uppercase `label-field` caption: Notes (multi-line, `body-secondary`, placeholder "Add notes…" in `text-tertiary`), When, Project/Area, Tags (chip row, "+" chip to add), Recurrence (shows "None" or a plain-English summary like "Every 2 weeks on Mon"). A primary "Mark Complete" button (filled `accent`, white text, 8px radius) sits below the fields — deliberately the only filled/coloured button in the panel so it stays the obvious primary action.

**Quick Entry overlay** — triggered by `⌘N` from anywhere. Centred modal (480px wide) over a blurred/dimmed backdrop (`rgba(28,28,30,0.28)` + backdrop-blur), single-line title input auto-focused, with a compact row below for When / Tag / Project pickers (icon buttons that expand into the relevant picker). `Enter` saves and closes; `Esc` cancels.

**TagPicker / DatePicker / RecurrencePicker** — small popovers (not full modals) anchored to the field that opened them, `bg` background, `border` outline, 8px radius, drop shadow (`0 4px 16px rgba(0,0,0,0.08)`). TagPicker is a searchable chip list with inline "create new tag" (assigns the next unused colour from the area/tag set). DatePicker is a compact single-month calendar plus quick options ("Today", "Tomorrow", "This Weekend", "Someday" — clears the date). RecurrencePicker is a short form (frequency dropdown, interval stepper, weekday toggles for weekly) that renders live as the plain-English summary shown in the detail panel.

## Interactions

- **Completing a task:** checkbox fills and draws its checkmark over 150ms (ease-out), title gets a strikethrough that animates in over the same duration, then the row lingers for ~600ms before fading out and the list reflows — so completing something reads as a small reward, not a disappearing act. Un-completing (unchecking) is instant, no delay.
- **Row hover:** background steps to `surface` over 100ms; trailing quick-edit icons fade in over the same duration. No layout shift on hover — icons occupy reserved space at low opacity rather than being inserted.
- **Detail panel open/close:** slides in from the right over 200ms (ease-out on open, ease-in on close), list pane does not resize/reflow underneath it on desktop (panel overlays the right edge of the list with a drop shadow) to avoid a jarring reflow of task rows.
- **View switch (Today ↔ Upcoming ↔ Project):** content cross-fades over 120ms; sidebar selection state updates immediately (no delay) so navigation always feels responsive even if list content is still loading from Dexie.
- **Drag reorder:** dragged row lifts with a subtle shadow (`0 2px 8px rgba(0,0,0,0.12)`) and scales to 1.02, other rows animate out of the way over 150ms; a thin `accent`-coloured placeholder line shows the drop position.
- **Quick Entry:** modal scales in from 0.96→1 with the backdrop fade, both over 150ms (subtle spring, not linear) — this is the single "delight" moment worth a slightly bouncier easing curve than everything else in the app, since it's the most frequent entry point for new input.
- **Focus states:** every interactive element (nav item, button, input, chip) gets a visible 2px `accent` outline with 2px offset on keyboard focus — never suppressed, since this app is explicitly keyboard-first.
- All motion respects `prefers-reduced-motion`: durations collapse to near-zero and the completion-linger delay is skipped (row is removed immediately) when the user has that preference set.
