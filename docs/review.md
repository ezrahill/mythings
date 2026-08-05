# Review — MyThings feat/build-app (PR #1)

## Must fix

- [x] `src/routes/TodayView.tsx:14-18` — a task with a past `when` (overdue) and `thisEvening: true` renders in **both** the Overdue and This Evening sections, since `overdue` and `evening` are independently filtered from `active` with no mutual exclusion. Why it matters: the same task appears twice in the list, which reads as a data bug to the user and contradicts the plan's "split into a This Evening section" (implying each task belongs to exactly one section). Confirmed by writing a regression test (`when: '2026-08-01'`, `thisEvening: true`, rendered on `2026-08-05` → `getAllByText` returns 2 matches). Suggested fix: exclude `thisEvening` tasks from the `overdue` filter (e.g. `!task.thisEvening`), matching how `dueToday` already excludes them. **Fixed** (commit `dc52fb9`) — overdue filter now excludes `thisEvening` tasks; new regression test added; re-verified.
- [x] `src/store/useTaskStore.ts:44-49` (`completeTask`) — completing an overdue recurring task advances `when` by only one interval from its *existing* (past) `when`, not from today, so it typically stays overdue. Why it matters: for a daily task overdue by 10 days, one "complete" click produces a date still 9 days overdue — the task keeps showing in Overdue and the user has to click Complete repeatedly to catch it up, defeating the point of recurrence. Confirmed with a regression test: `when: 2026-07-26` (10 days before system date), daily/interval 1 → next `when` is `2026-07-27`, still before today. Suggested fix: compute from `max(task.when, today)` (or loop `nextOccurrence` until the result is `>= today`) rather than always stepping from the stored `when`. **Fixed** (commit `03e5973`) — now loops `nextOccurrence` until the result is `>= today`; new regression test added; re-verified.

## Worth raising

- `src/lib/recurrence.ts` completion path is only unit-tested for the "due today" case (`useTaskStore.test.ts`, `recurrence.test.ts`) — no test exercises an overdue task being completed, which is how the must-fix above went uncaught.
- `tsconfig.app.json` doesn't set `"strict": true` (or any of the individual strict flags) — only `noUnusedLocals`/`noUnusedParameters`/`noFallthroughCasesInSwitch` are on. For a project explicitly chosen for TypeScript's guarantees, running without strict null checks etc. weakens that value; worth turning on given the codebase is small enough that it's cheap now and only gets more expensive later.
- Store writes (`addTask`, `updateTask`, etc. across all four Zustand stores) don't handle a rejected Dexie write — in-memory state and IndexedDB can silently diverge if a `db.*.add/update` call throws (e.g. quota exceeded). Low likelihood for a v1 single-user app, but there's currently no error path at all.
- The documented simplifications in `docs/followups.md` (custom calendar grid, combined project/area picker, deferred completion-linger/exit animation, drag-reorder) all look like reasonable, clearly-scoped v1 cuts — flagging here only to confirm they were reviewed, not as new concerns.

## Nits

- None beyond what `oxlint`/`tsc -b` already catch (both pass clean).

## Overall

Solid implementation of the plan and design — data model, repository layer, and component structure all match `docs/plan.md` closely, and the design tokens/palette match `docs/design.md` exactly. Both must-fixes are now fixed and re-verified: 137 tests pass (up from 135), build and lint clean. Ready to merge.
