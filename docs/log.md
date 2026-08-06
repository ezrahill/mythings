# MyThings — Log

- 2026-08-05: Project kicked off by Ezra. Brief confirmed: single-user, local-first, Things 3-style web to-do app. Channel `proj-mythings` and repo created. Plan phase dispatched to Architect.
- 20:55 architect: plan ready (9 steps, ~20 files)
- 21:14 designer: design ready (off-white/accent-blue palette, Inter/SF Pro type stack, 7 sections)
- 22:10 reviewer: 2 must-fix, 3 worth raising, 0 nits
- 22:32 reviewer: re-verified both must-fixes on PR #1 — Overdue/This Evening mutual exclusion and overdue-recurrence catch-up, each with Coder's new regression test. 137 tests pass, build and lint clean. Ready to merge.
- 22:40 tester: FAIL — dependencies not installed on PR #1 branch (`pr-1` @ 054c65b). `npm test` → `sh: 1: vitest: not found`; no `node_modules` present in the checkout. Per constraints, the tester does not run `npm install` to fix this — a broken/missing install is itself a FAIL finding. Needs a clean `npm install`/`npm ci` step upstream before this can be exercised.
- 22:42 tester: PASS — 137/137, 0 skipped, 59.4s. `npm ci` on `feat/build-app` @ 054c65b installs cleanly (124 packages); build and lint both clean. Manual UI exercise outside the tester's defined process for this run — already covered by Coder (headless Chromium walkthrough) and Reviewer (regression tests for both must-fixes) earlier in the thread.
- 08:31 tester: re-verify PASS — 137/137, 0 skipped, 65.1s on `feat/build-app` @ 4af6f13 (includes 07f46d0 basename fix). `npm ci` clean, build clean, lint clean, no regressions vs prior run.
- 08:35 reviewer: re-verified follow-up commit 07f46d0 (router basename for subpath deploys) on PR #1 @ 4af6f13. 137/137 still pass, build/lint clean, no regressions. Confirmed both a default build and a `--base=/proj-mythings/coder/` build directly: default is unaffected, subpath build correctly emits prefixed asset URLs with the basename inlined for the router. Ready to merge.
