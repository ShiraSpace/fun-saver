# Saving goal — delivery plan and progress

**Spec:** `docs/superpowers/specs/2026-10-03-saving-goal-design.md` (its Delivery
section is the PR breakdown). **Mockup:** `mockups/saving-goal.html`.

Each PR merges on its own and leaves the app working. Each PR gets a
task-by-task plan in its own session before any code.

## Progress

| PR | What | State |
| --- | --- | --- |
| spec | The design and mockup | Merged #172 (`559f295`), updated by #176 (`82daf24`) |
| 0 | Method opener `goal` → `purpose`, so `goal` is free | Merged #173 (`69585c5`) |
| 1 | `goals` table, `GoalRepository` in all three stores, `src/lib/goal` rules | Merged #174 (`6db66d7`) |
| 4a | Picture search: generated Hebrew emoji list and `matchingPictures` (no UI) | Merged #181 (`3bc65f3`) |
| 2 | API and the server lock | Merged #190 (`83defbc`) |
| 3a | The goal on home and in the drawer | Merged #199 (`e8e506f`) (plan: `.plans/2026-10-10-show-goal.md`) |
| 3b | The goal screen and the menu row | Three PRs: the goal screen merged #203, the ways in merged #206, the drawer's kept note line in review #208 (plan: `.plans/2026-10-10-goal-screen.md`) |
| 4b | Setting and cancelling | Merged: `SetGoal` and its ways in #209, `CancelGoal` and the press-and-hold #211, «ביטול היעד» in the menu #214 (plans `.plans/2026-10-11-onboarding.md`, `.plans/2026-10-13-cancel-goal.md`) |
| 5 | Celebration | Confetti #188; shown on home and the goal screen #217; the savings card's travelling border, wobble, bar shine and per-theme look on `feat/goal-celebration-card` (plan `.plans/2026-10-16-goal-celebration.md`) |
| later | The goal in child mode | Separate feature: `.plans/2026-10-16-child-goal-celebration.md` |

**Migrations:** the `goals` table is on Neon `test`, `dev` and `production`
(2026-10-04). No PR left in this feature needs a migration.

## What is already built (do not rebuild)

- `src/lib/goal/goals.ts`: `setGoal({ store, accountId, body })` asserts the raw
  body first, then stores the trimmed name and the amount in agorot;
  `cancelGoal` throws `GoalNotActiveError`.
- `src/lib/goal/goal-request-validator.ts`: `assertValidGoalRequest(body)` throws
  `ValidationError`; `isValidPictureEmoji` is server-only (the `v` regex flag).
- `src/lib/goal/goal-reached.ts`: `goalReached(goal, savingsBalance)`.
- `src/lib/goal/withdraw-unless-savings-locked.ts`:
  `withdrawUnlessSavingsLocked({ store, withdrawal, goal, walletBalance })`.
  `addWithdrawal` calls it for savings after the overdraft check (spec rule 8).
  A withdrawal completes a goal only if that goal is still active when it is
  written; otherwise it throws `SavingsLockedError`.
- Routes (#190): `POST /api/accounts/[id]/goals` → 201 with the goal, 400
  `invalidGoal`, 409 `goalAlreadyActive`; `DELETE /api/accounts/[id]/goals/[goalId]`
  → 200 with the cancelled goal, 409 `goalNotActive`; a locked savings
  withdrawal → 409 `savingsLocked`. Viewers get 403.
- `AccountSummary.goal?: Goal`: the active goal on every summary (home,
  `/method`, `/transactions`); `undefined` when there is none, so test
  `account.goal`, not `'goal' in account`. Whether it is reached is worked out
  with `goalReached(goal, walletNamed(account.wallets, WALLET_NAMES.savings).balance)`.
  Contract: `.plans/2026-10-04-goal-api.md`.
- `fetchJson` (`src/lib/fetch-json.ts`) sends `DELETE` and throws
  `RequestFailedError` carrying `status`, so a client can tell a `409`.
- Picture search: `src/lib/goal/picture-search/` (`indexPictureWords`,
  `matchingPictures`, `picture-words.he.json`).
- `GoalPictureSearch` sheet (#189): props `{ goalName, picture, onChange,
  onClose }`; closes on Escape, Back and the scrim; takes focus on open and
  returns it on close. Plan: `.plans/2026-10-04-goal-picture-search-ui.md`.
- `Celebration` (#188): no props; confetti over the header, under the drawer
  (`LAYERS.celebration`). As merged it always plays: there is no
  reduced-motion check. Plan: `.plans/2026-10-04-goal-celebration.md`.
- Shared UI from those PRs: `BottomSheet` / `BottomSheetScrim`
  (`src/components/BottomSheet/`), `useEscapeKey` and `useCloseOnBack` in
  `src/hooks/`, and `LAYERS.modalOverModal` / `modalOverModalForeground` for a
  sheet opened over another.
- PR 3a (#199), in `src/lib/goal/saved-toward-goal.ts`: `savedTowardGoalOf(account)`
  → `SavedTowardGoal` (`goal`, `saved` floored to whole shekels, `stillToSave`,
  `reached`); `savedTowardGoalIn(wallet, savedTowardGoal)` (only for savings);
  `savingsLocked(savedTowardGoal)`. Components: `GoalProgressBar`,
  `SavedOutOfGoal` («₪85 / ₪300»), the savings card's `GoalProgress` line (not
  tappable yet) and 🔒 (`GOAL_COPY.lock` in `src/components/Goal/constants.ts`),
  the drawer's locked tile, `LockedSavings` laid over the hidden keypad,
  `SelectedWalletNote`, and the `409` refresh in `useAmountEntry`. e2e:
  `GoalDriver` on `AppDriver`, `AnotherPhoneDriver` (sets a goal through the API).
- Fixtures: `createMockGoal`, `mockGoal`, `createMockGoalPicture` in
  `src/test-utils/mocks/goal.mocks.ts`; `goalId(suffix)` in `test-database.ts`;
  `addAccountViewerToStoreFile` in `src/test-utils/account-viewer.ts`.

## PR 3 — Showing a goal (next)

Scope as in the spec's Delivery § 3: `ViewGoal`, `GoalProgress`, `MenuGoal`'s
goal row, the 🔒 on the savings card, the locked drawer states and the `409`
refresh. Tested and screenshotted by seeding `goals: [mockGoal]` through the
e2e driver. Things found since the spec was written:

- Child mode now belongs to the phone, kept in a cookie (#193–#197); accounts
  no longer carry a view mode. Read `.plans/2026-10-05-global-child-mode.md`
  for how the parent and child screens are told apart today.
- The child-view switch moved out of the account controls into «הגדרות
  כלליות» (#195). `AccountControls` is now `AccountPicker` then
  `EditAccountButton`.
- `e2e/menu-morph.visual.ts` "with the account list open" measures that the
  account list reaches down over the per-account block. #171 broke it by
  adding a row under `AccountPicker`; #195 fixed it by removing that row. A
  goal row placed under `AccountPicker` will push that block down again, so
  plan for it: give that scenario more accounts, or place the row so the
  overlap holds.
- The drawer's locked state needs the withdrawal's `409`: `RequestFailedError`
  carries `status`.

## PR 3 onwards — notes

- The goal shows in the parent view only; child mode is untouched.
- `MenuGoal` sits in the parent menu only, under `AccountPicker`. Check where
  the spec's mockup puts it against today's menu, which has changed since.
- Saved amounts and "עוד ₪…" use `MONEY_ROUNDING.floorToShekels`.
- Forms track `requestState` (`REQUEST_STATE` idle · pending · failed); a `409`
  in the drawer refreshes and returns to idle.
- The memory store has no read for an ended goal, so two memory-store tests
  check `ending` on the stored object. Kept on purpose; add `getGoal(goalId)`
  only if a feature needs it.
- PR 4b: «ביטול היעד» goes under `MenuGoal`'s row and makes the parent
  controls taller. `e2e/menu-morph.visual.ts` seeds a goal and a second
  account so the account list still reaches over the per-account block
  (measured in PR 3: with one account and a goal the list stops 21.5 px above
  it). Re-run that suite; add a third account if it falls short.
- PR 4b: a goal overlay's finish handler (after `SetGoal` or «ביטול היעד»)
  returns `viewingGoal` to `viewing`, the way `finishEditing` does. Done for
  `SetGoal`: `GoalScreens` finishes with `finishEditing` itself.
- PR 4b: `GoalPictureSearch` closes on Back through `useCloseOnBack`. If
  `SetGoal` uses it too, both listen for the same `popstate`, so one Back press
  closes the picture sheet and `SetGoal` together. Only the topmost open sheet
  should close. Done in onboarding PR 1: each history entry names its modal,
  and Back and Escape reach only the top one.

## Working rules learned on this feature

- One worktree per PR, sibling to `fun-saver/`. The main checkout holds
  untracked `promo-video/`, which is never committed: stage files by name.
- A test of a database-only rule is never broken by changing a shared Neon
  branch's schema; use a throwaway Neon branch.
- Pushed branches are updated by merging `main` in, never by rebasing.
- A fresh worktree installs with `npm ci --registry=https://registry.npmjs.org/`;
  plain `npm install` ignores the lockfile here and drifts.
- Stage with plain `git`, never list an already-deleted path in `git add` (it
  aborts the whole add), and check `git diff --cached --stat` before each
  commit. Fetch and compare with the remote before every push: the user pushes
  to PR branches too.
- Tests check one behaviour each, with the action in a scenario's
  `beforeEach`; every test is watched failing against a break of its own.
- Every code-review finding is fixed unless it is wrong, cannot be reproduced,
  or goes against a decision the user made (CLAUDE.md).
- A PR that adds a component carries screenshots even when no screen shows it
  yet: mount it on a throwaway, uncommitted page to shoot it.
- Picture and emoji names that don't match (`foundEmoji` under
  `useMatchingPictures`) are deliberate: emoji stand in for real pictures.
