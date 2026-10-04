# Saving goal — delivery plan and progress

**Spec:** `docs/superpowers/specs/2026-10-03-saving-goal-design.md` (its Delivery
section is the PR breakdown). **Mockup:** `mockups/saving-goal.html`.

Each PR merges on its own and leaves the app working. PR 2 onwards gets a
task-by-task plan in its own session before any code.

## Progress

| PR | What | State |
| --- | --- | --- |
| spec | The design and mockup | Merged #172 (`559f295`), updated by #176 (`82daf24`) |
| 0 | Method opener `goal` → `purpose`, so `goal` is free | Merged #173 (`69585c5`) |
| 1 | `goals` table, `GoalRepository` in all three stores, `src/lib/goal` rules | Merged #174 (`6db66d7`) |
| 4a | Picture search: generated Hebrew emoji list and `matchingPictures` (no UI) | Merged #181 (`3bc65f3`) |
| 2 | API and the server lock | Built on `feat/goal-api`, not merged (plan: `.plans/2026-10-04-goal-api.md`) |
| 3 | Showing a goal | Not started |
| 4b | Setting and cancelling (`SetGoal`, `GoalPictureSearch` UI, `CancelGoal`) | `GoalPictureSearch` UI open as #189; `SetGoal`, `CancelGoal` not started |
| 5 | Celebration | Merged #188 |
| later | The goal in child mode | Separate feature, after this one |

**Migrations:** the `goals` table is on Neon `test`, `dev` and `production`
(2026-10-04). PR 2 needs no further migration.

## What is already built (do not rebuild)

- `src/lib/goal/goals.ts`: `setGoal({ store, accountId, body })` asserts the raw
  body first, then stores the trimmed name and the amount in agorot;
  `cancelGoal` throws `GoalNotActiveError`.
- `src/lib/goal/goal-request-validator.ts`: `assertValidGoalRequest(body)` throws
  `ValidationError` (map it to 400, like the deposit route);
  `isValidPictureEmoji` is server-only (the `v` regex flag).
- `src/lib/goal/savings-withdrawal.ts`: `withdrawFromSavings({ store,
  withdrawal, goal, savingsBalance })` — the three-way branch only. The
  caller reads the savings transactions and the active goal (`Promise.all`)
  and keeps the overdraft check first (spec rule 8).
- `src/lib/goal/picture-search.ts`: build the index once with
  `indexPictureWords(pictureWords)` when `emoji-words.he.json` loads via
  `import()`, then call `matchingPictures(query, index)` per keystroke.
- Fixtures: `createMockGoal`, `mockGoal`, `createMockGoalPicture` in
  `src/test-utils/mocks/goal.mocks.ts`; `goalId(suffix)` in `test-database.ts`.

## PR 2 — API and the server lock (built)

Scope as in the spec's Delivery § 2. Things found since the spec was written:

- The access wrapper is `src/app/api/with-account-access.ts`; route params go
  through `withAccountAccess` (the `AccountHandler` type), so
  `withAccountEditor` and `withAccountUser` both pass them.
- Find savings with `walletNamed(wallets, WALLET_NAMES.savings)`.
- `addWithdrawal` is near the 40-line limit: keep the savings branch in
  `withdrawFromSavings`.
- If loading the goal takes `settleAccountInterest` past 40 lines, move the
  two reads into `readAccountRecords`.
- The set-goal route catches `ValidationError` → 400 and
  `GoalAlreadyActiveError` → 409; the withdrawal route maps
  `SavingsLockedError` → 409 beside `OverdraftError`.
- As built: `settleAccountInterest` stayed under 40 lines, so
  `readAccountRecords` was not needed. `AccountSummary.goal?: Goal` carries
  the active goal (the contract is in `.plans/2026-10-04-goal-api.md`);
  `fetchJson` sends `DELETE` and throws `RequestFailedError` with `status`.

## PR 3 onwards — notes

- The goal shows in the parent view only; child mode is untouched.
- `MenuGoal` sits under `AccountPicker`, above `ViewModeSwitch`, in the parent
  menu only.
- Saved amounts and "עוד ₪…" use `MONEY_ROUNDING.floorToShekels`.
- Forms track `requestState` (`REQUEST_STATE` idle · pending · failed); a `409`
  in the drawer refreshes and returns to idle.
- The memory store has no read for an ended goal, so two memory-store tests
  check `ending` on the stored object. Kept on purpose; add `getGoal(goalId)`
  only if a feature needs it.

## Working rules learned on this feature

- One worktree per PR, sibling to `fun-saver/`. The main checkout holds
  untracked `promo-video/`, which is never committed: stage files by name.
- A test of a database-only rule is never broken by changing a shared Neon
  branch's schema; use a throwaway Neon branch.
- Pushed branches are updated by merging `main` in, never by rebasing.
