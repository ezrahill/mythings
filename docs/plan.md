# Plan — MyThings

![[architecture.excalidraw]]

## Context

MyThings is a single-user, local-first to-do app in the Things 3 mould: minimal, fast, keyboard-driven. There's no backend and no accounts — everything lives in the browser. Success is a plan the Designer and coder can build from directly: a stack that supports snappy micro-interactions, a data model that covers areas/projects/tags/recurrence/"This Evening" without rework, and a component layout that keeps views thin and logic in one place.

## Approach

**Stack:** React + TypeScript + Vite. React's component model fits the view/detail-panel structure Things 3 uses, and Vite keeps dev iteration fast, which matters for tuning micro-interactions.

**State:** Zustand as the single in-memory store. It's less boilerplate than Redux for an app this size, and its selector model plays well with frequent, fine-grained UI updates (checking off a task, dragging reorder) without extra plumbing.

**Persistence:** IndexedDB via Dexie.js, not `localStorage`. Reasoning: the data model is relational (tasks ↔ tags is many-to-many, tasks belong to projects belong to areas), IndexedDB queries handle that without loading/reserializing one giant JSON blob on every write, and reads/writes are async so they don't block the main thread — important for a "fast" feel. The Zustand store is the source of truth for rendering; Dexie is the write-behind persistence layer it syncs to. On load, the store hydrates from Dexie once.

**Routing:** React Router with real routes (`/today`, `/upcoming`, `/projects/:id`, `/areas/:id`) rather than pure state-switching, so the back/forward buttons and reload behave as users expect even with no backend.

**Recurrence:** Modelled as a rule on a task (not a separate generator table). Completing a recurring task computes and writes the next occurrence's date via a small pure `recurrence.ts` module — no scheduled jobs needed since there's no backend; the "next due" date is just computed lazily and shown when relevant.

**Keyboard-first:** A single global keyboard hook (`useHotkeys`-style) owns shortcut registration, so shortcuts don't get redefined per-view and conflict. Quick-entry (new task from anywhere) is a global overlay component, not per-view.

I'm not specifying animation/visual details here — that's the Designer's call after this plan. I've noted where Framer Motion would hook in (task-complete, list reorder, view transitions) so the component boundaries support it without restructuring later.

**Alternative considered:** `localStorage` with a single JSON blob. Rejected — simpler to start, but every write serializes the whole dataset, and querying by tag/area/project across a growing task list gets awkward fast. Dexie's marginal setup cost is small and avoids a rewrite once the dataset grows past trivial.

## Data model

```ts
type ID = string; // uuid

interface Area {
  id: ID;
  name: string;
  order: number;
}

interface Project {
  id: ID;
  name: string;
  notes?: string;
  areaId?: ID;        // null = no area
  completed: boolean;
  completedAt?: string; // ISO date
  order: number;
}

interface Tag {
  id: ID;
  name: string;
  color?: string;
}

interface RecurrenceRule {
  freq: 'daily' | 'weekly' | 'monthly';
  interval: number;        // every N freq units
  byWeekday?: number[];    // 0–6, for weekly
  anchor: string;          // ISO date the rule is computed from
}

interface Task {
  id: ID;
  title: string;
  notes?: string;
  projectId?: ID;          // null = standalone / area-only
  areaId?: ID;              // set when task has no project
  tagIds: ID[];
  when?: string;            // ISO date — scheduled day ("Today"/"Upcoming")
  thisEvening: boolean;     // Today, evening slot
  deadline?: string;        // ISO date — distinct from `when`
  recurrence?: RecurrenceRule;
  completed: boolean;
  completedAt?: string;
  order: number;
  createdAt: string;
}
```

Views are derived, not stored:
- **Today** = tasks where `when` = today OR `when` < today (overdue) OR `thisEvening`, split into a "This Evening" section.
- **Upcoming** = tasks where `when` > today, grouped by date.
- **Projects** / **Areas** = tasks filtered by `projectId` / `areaId`, plus their own nav trees.

Dexie tables: `tasks`, `projects`, `areas`, `tags` — indexed on `projectId`, `areaId`, `when`, and a multi-entry index on `tagIds` for tag filtering.

## Component structure

```
src/
  main.tsx, App.tsx            — router + store hydration on mount
  routes/
    TodayView.tsx
    UpcomingView.tsx
    ProjectsView.tsx / ProjectDetail.tsx
    AreasView.tsx / AreaDetail.tsx
  components/
    Sidebar.tsx                — areas/projects nav tree + Today/Upcoming links
    TaskList.tsx / TaskRow.tsx — shared across every view
    TaskEditor.tsx             — inline/side-panel task detail (notes, tags, dates, recurrence)
    QuickEntry.tsx             — global new-task overlay (keyboard-triggered)
    TagPicker.tsx, DatePicker.tsx, RecurrencePicker.tsx
  store/
    useTaskStore.ts, useProjectStore.ts, useAreaStore.ts, useTagStore.ts
  db/
    schema.ts                  — Dexie schema + versioning
    db.ts                      — Dexie instance
    repositories.ts            — typed CRUD/query functions the store calls
  lib/
    recurrence.ts              — next-occurrence calculation
    dates.ts                   — today/overdue/grouping helpers
    keyboard.ts                — global hotkey registration
  types/
    task.ts, project.ts, area.ts, tag.ts
```

Views stay thin (layout + which store slice to read); `TaskList`/`TaskRow`/`TaskEditor` are shared everywhere a task appears, so behaviour (complete, reschedule, tag) is defined once.

## Steps

1. **Scaffold** — Vite + React + TypeScript project; install Zustand, Dexie, React Router. Files: `package.json`, `vite.config.ts`, `src/main.tsx`, `src/App.tsx`.
2. **Types + Dexie schema** — define `src/types/*.ts` and `src/db/schema.ts` / `db.ts` per the data model above.
3. **Repository layer** — CRUD + query functions in `src/db/repositories.ts` (by project, by area, by tag, by date range).
4. **Stores** — Zustand slices in `src/store/*.ts` wired to the repository layer; hydrate on app load.
5. **Routing + shell** — `App.tsx` routes, `Sidebar.tsx`, `QuickEntry.tsx` overlay, `lib/keyboard.ts` global shortcuts.
6. **Shared task components** — `TaskList.tsx`, `TaskRow.tsx`, `TaskEditor.tsx`, `TagPicker.tsx`, `DatePicker.tsx`.
7. **Views** — `TodayView` (incl. This Evening split + overdue), `UpcomingView` (date-grouped), `ProjectsView`/`ProjectDetail`, `AreasView`/`AreaDetail`.
8. **Recurrence** — `lib/recurrence.ts`, wired into task completion in the task store; `RecurrencePicker.tsx` in the editor.
9. **Polish hooks for Designer/coder** — mark the component boundaries above where transitions apply (task complete, reorder, view switch) without implementing animation.

Each step is independently testable: 1–2 stand up an empty app that persists nothing wrong; 3–4 are verifiable with unit tests against Dexie's in-memory test adapter; 5–8 are verifiable by using the running app.

## Risks

- **IndexedDB is async everywhere** — a naive implementation could show stale UI on first paint before hydration completes. Mitigate with a simple loading state in `App.tsx`.
- **Recurrence edge cases** (monthly on the 31st, weekly with multiple weekdays) can get complicated — keep `recurrence.ts` pure and unit-tested in isolation so this doesn't leak into components.
- **No backend means no cross-device sync** — acceptable per brief (v1, single user), but worth flagging: if that changes later, the repository layer (step 3) is the seam where a sync backend would slot in without touching components.
- **Areas without projects vs. tasks directly in an area** — the brief doesn't say whether tasks can attach directly to an Area (bypassing a Project), so the data model above allows both (`Task.areaId` set when `projectId` is absent). If that's wrong, it only touches the data model and view-filtering logic, not the component structure.
