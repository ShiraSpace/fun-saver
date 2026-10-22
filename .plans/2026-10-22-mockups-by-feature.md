# Mockups by feature

One dated HTML file per feature in `mockups/`, named like the plans
(`YYYY-MM-DD-<feature>.html`, the earliest date of what it merges). Each opens
with the decisions made and the plans that record them, then every original
mockup in its own frame, the chosen one marked ✓ and the rest «נדחה».

## Files

| File | Merged from |
|---|---|
| `2026-06-17-home-screen` | specs/mockup-home-screen |
| `2026-06-17-menu` | specs/mockup-menu, -menu-edit-chip, -menu-avatar-letter |
| `2026-06-17-total-balance` | specs/mockup-total-balance |
| `2026-06-20-avatar-picker` | specs/mockup-avatar-picker |
| `2026-06-21-transaction-drawer` | specs/mockup-transaction-drawer, -keypad-options, -withdraw-drawer |
| `2026-06-29-edit-account` | edit-account |
| `2026-09-12-login` | login/1–4 |
| `2026-09-12-home-overview` | home-overview, donut-load-animation |
| `2026-09-14-method-page` | method-page/a–e |
| `2026-09-15-menu-redesign` | account-summary/menu, .plans/2026-09-23-pr12-empty-state-header.html |
| `2026-09-15-loading` | loading-states, loading-open-questions |
| `2026-09-23-transactions` | account-summary/transactions, chart-contrast |
| `2026-09-23-contrast` | contrast |
| `2026-09-23-theme-parity` | theme-swatches, midnight-shadows |
| `2026-10-03-child-mode` | child-mode, child-mode-in-menu, child-account-switcher, global-child-mode |
| `2026-10-03-saving-goal` | saving-goal, -celebration-themes, -shine, goal-celebration-child |
| `2026-10-11-onboarding` | onboarding/2-pig, 1-style |

## Also

- `index.html` lists every feature file, oldest first, with its plans.
- Delete `homework-companion.html` (not fun-saver) and `check.js` (it checked the
  per-screen layout this removes, and already failed on `main`).
- Every reference in `.plans/` and `docs/` points at the new file, including the
  ones that were already broken.
- Out of scope: `.superpowers/brainstorm/` (gitignored), `docs/research/*.html`,
  the usage-stats skill's `report.html`.

## Delivery

Branch `docs/mockups-by-feature` off `origin/main`, one PR: the merged files,
then the reference fixes.
