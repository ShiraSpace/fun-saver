# Onboarding — delivery plan

**Spec:** `docs/superpowers/specs/2026-10-11-onboarding-design.md`.
**Mockup:** `mockups/onboarding/2-pig.html` (chosen: the pig guides).
**Status:** proposed 2026-10-11; reviewed in six rounds, six against the code, then six more (claims, modal stack, data layer, architecture, standards, delivery); approved 2026-10-11.

Three PRs, each off a fresh `origin/main` (`git fetch origin && git checkout -b
<branch> origin/main`), each leaving the app working. Each follows the
CLAUDE.md phases: production code → review → commit → first three tests (each
watched failing on its own break) → the rest → commit. Each PR gets a
task-by-task outline before its code.

Branches are named `feat/onboarding-*`: a generic name like `feat/set-goal`
collided with another session's branch.

## Progress

| PR | What | State |
| --- | --- | --- |
| spec | Design, mockups, this plan | Ships with PR 1 (#209); `feat/onboarding` is retired |
| 1 | `SetGoal`, its two ways in, top-modal-only Back and Escape | Merged as #209 (`90aba94`) |
| 2 | `Onboarding`: the account step, the goal step (set or skip), the ready screen | Not started |
| 3 | Changing a goal (`PUT` route) and the goal row's **עריכה** | Not started |
| later | The wallet step (shares) | Sketched in the spec, not planned |

## PR 1 — Setting a goal

Makes goals settable at all, outside onboarding. Takes over the `SetGoal` part
of saving-goal PR 4b; update `.plans/2026-10-03-saving-goal.md` so 4b keeps only
`CancelGoal`, and mark done its "only the topmost open sheet should close" note
and its "a goal overlay's finish handler returns `viewingGoal` to `viewing`"
note.

Built as planned, with these differences (the spec now says the same):

- **History ids are made per opening** (time and a counter), not `useId`,
  which repeats after a reload and broke the drawer's reload e2e. `popstate`
  acts on a modal only when its own entry was popped; the open-modal list
  decides only Escape.
- **Empty fields get messages** under them instead of a disabled save
  button, and the **save button shows the loader** while saving. Both asked
  for while testing locally.
- **A ref stops a double send** (two submits in one tick both read `idle`), and
  a pasted decimal keeps only its whole shekels. Both from PR review.
- `GoalDialog` is shared by `ViewGoal` and `SetGoal`; `isConflict` moved into
  `fetch-json.ts` (`SetGoal` is its second user); `savingsBalanceOf` came out of
  `savedTowardGoalOf`.
- Also fixed on the way, all already broken on `main`: the menu chevrons
  pointed backwards in Hebrew (`stylis-plugin-rtl` flips `direction: ltr`, so
  the fix is the glyph `›`, which the browser mirrors), amounts sat off the
  baseline of the text beside them (`Money` now aligns ₪ and digits on one
  baseline), and the card's prompt was dark on the dark theme.
- Tests press a real Back (`src/test-utils/history.ts`), not a fake
  `popstate`; 93 breaks were watched, each reddening its own test.

## PR 2 — Onboarding

From PR 1: `GoalStep` gets the field messages, the save loader and the
double-send guard from `GoalFields`. The picture search renders beside the
form, never inside it, or Enter in its search box would send the goal. To see
it locally on a copy of the data, set `FUNSAVER_DATA_PATH=src/db/data.json` in
the worktree's `.env.local`; without it `npm run dev` reads the Neon dev branch.

The pig frame replaces `CreateAccount`. Both steps ship, so a new parent can
set a goal in onboarding: this PR meets the spec's success criterion. The
ready screen's goal row offers **קביעה** when skipped; with a goal set it shows
the goal and gains **עריכה** in PR 3.

1. `AccountForm/AccountFields/` (name, avatar, save button and error; state in
   `useAccountForm`, which moves in with it); `AccountForm` composes it.
   `useAccountForm` takes `onRequestStateChange`, called where it sets
   `requestState` (`useGoalForm` already does, since PR 1). `use-update-account.ts` moves from `EditAccount/`
   to `src/hooks/`, its test to `src/hooks/__tests__/`. `use-set-goal.ts`
   moves to `src/hooks/` (second user), its test with it.
2. `src/components/Onboarding/`: `Onboarding` (frame, `useModal(leave)`,
   dialog semantics, `onCancel`, `onCreated`), `OnboardingHeader`,
   `use-onboarding.ts` (`useReducer` over a pure walk: index, answers merged
   per step, editing from ready, the step's `requestState` reset to idle on
   every step change, `leave`), `OnboardingQuestion`, `OnboardingProgress`,
   `AccountStep` (with `use-create-account.ts` and its test moved in from
   `CreateAccount/`; creates, or updates when the account exists), `GoalStep`
   (`useSetGoal`; `canSkip`; a `409` is a save error), `OnboardingReady` with
   `ReadyRow`, `onboarding-steps.ts` (entries inline, ids in
   `ONBOARDING_STEP_ID`).
3. Moving around follows the spec's table: on-screen and phone Back go to the
   previous step, or to ready from a row; where there is no Back, phone Back
   leaves; ✕ and Escape leave: `cancel` before the account exists,
   `showNewAccount(account)` after. Nothing moves while a request is pending.
4. The ready screen: the account row with **עריכה**; the goal row with
   «עוד אין יעד» and **קביעה** when skipped, or the goal without a button.
   A row opens its step filled in, submit labelled **✓ שמירה** /
   **✓ שמירת היעד**, and returns to ready once saved. The big picture is the
   goal's, or the avatar.
5. On open `useModal` focuses the dialog (labelled by the question); on each
   later step focus moves to the question; steps enter with `entrance()`.
6. `AccountManagement` renders `Onboarding`; delete
   `src/components/CreateAccount/` with `CreateAccount.test.tsx`. Update the
   `jest.mock` paths in `Home.managing-accounts.test.tsx` (both hooks) and
   `EditAccount.test.tsx`; the test ids in `Home.test.tsx`,
   `Home.managing-accounts.test.tsx`, `AccountManagement.test.tsx`; on
   `main`'s `createAppDriver`, `e2e/driver/use-driver.ts` (an onboarding driver
   that also taps through ready) and `e2e/driver/account-form-driver.ts`;
   `e2e/create-account.e2e.ts`; rewrite the computed-style assertions in
   `e2e/create-account.visual.ts` and `e2e/avatar-picker.visual.ts` for the
   pig frame; `.claude/skills/pr-screenshots/SKILL.md`'s driver list.
7. Glossary: the `onboarding` row (with `AccountStep`, `GoalStep`),
   `OnboardingAnswers`, and `requestState` reworded "sent until the server
   replies".
8. Tests (`npm test`): `useOnboarding` (next, back, skip, each row of the
   table, editing from ready and its return, `requestState` reset),
   `Onboarding` (dialog role and label, a pending step disables Back, Skip and
   ✕, Escape before and after creation, phone Back from a row returns to ready
   and the next Back still works, focus on step change), `OnboardingProgress`
   (none with one step; two dots with two), `AccountStep` create vs update,
   `GoalStep` sets, `OnboardingReady` with and without a goal,
   `useAccountForm` and `useGoalForm` report `requestState`. e2e: create with a
   goal and see it on the card; skip and see the card's prompt; the existing
   create-account path through the new screens.
9. PR screenshots: before (`CreateAccount`) and after: the account step, the
   goal step, ready with and without a goal, in a non-default theme too.

## PR 3 — Changing a goal

1. Postgres store: rename `UPDATE_ACTIVE_GOAL` (the statement that ends a
   goal) to `END_ACTIVE_GOAL`, and inline today's `END_ACTIVE_GOAL` in `end()`
   as `${END_ACTIVE_GOAL} RETURNING *`. Its own commit.
2. `GoalEdits` (`Pick<Goal, 'name' | 'amount' | 'picture'>`); one step shared
   by `setGoal` and `updateGoal` that trims the name and turns shekels into
   agorot; `updateGoal({ store, accountId, goalId, request })` in
   `src/lib/goal/goals.ts`; `updateActiveGoal` in `GoalRepository` (`update`),
   `DataStore` and `RepositoryStore`; a shared `updateActiveGoal(goals,
   request)` in `src/db/goals.ts` for the memory and JSON-file stores (JSON
   saves only when it returns a goal); Postgres one conditional `UPDATE …
   RETURNING` with `picture` as `::jsonb`. `PUT
   /api/accounts/[id]/goals/[goalId]` beside `DELETE`: `200`, `400`,
   `401`/`403`, `409` as `DELETE`. No migration. Glossary: the `GoalEdits` row.
3. `src/components/Onboarding/GoalStep/use-update-goal.ts`: `GoalStep` updates
   when `answers.goal` is set.
4. `OnboardingReady`: the goal row gains **עריכה** when a goal is set.
5. Tests: `npm test` for `updateGoal`, the route, the shared helper
   (`src/db/__tests__/goals.test.ts`), the memory and JSON-file stores,
   `use-update-goal`, `GoalStep` sends `PUT` (not a second `POST`) with a goal,
   the goal row's **עריכה** and its return to ready; `test:db` for the Postgres
   `updateActiveGoal` (ended, foreign and stale ids return nothing;
   break-watches on a throwaway Neon branch).
6. PR screenshots: ready with a goal and its **עריכה**, the goal step opened
   from it.
7. Mark `mockups/onboarding/2-pig.html` ✓ נבחר (not pending) in
   `mockups/index.html`.

## Decided before PR 1

- 2026-10-11, approved ("go"): the new `PUT /api/accounts/[id]/goals/[goalId]`
  (PR 3), overriding the saving-goal spec's "Out: editing a goal" for the
  ready screen's goal row only; no confetti on the ready screen; the phone's
  Back follows the on-screen Back.

## Open

- `node mockups/check.js` fails on `main`, not because of onboarding: it reads
  the CSS `syntax: '<angle>'` inside `saving-goal.html`'s `<style>` as a tag,
  and past that, `index.html` misses four pages (`chart-contrast`,
  `child-mode`, `global-child-mode`, `saving-goal`). The onboarding mockups
  pass. Fix separately.
