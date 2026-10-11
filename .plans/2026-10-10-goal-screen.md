# Saving goal PR 3b — The goal screen

**Status:** proposed, revised after a six-round review (2026-10-11), awaiting approval.
**Branch:** `feat/goal-screen` off `e8e506f` (#199).
**Parent plans:** `.plans/2026-10-10-show-goal.md` ("PR 3b — porting from
`feat/show-goal`"), `.plans/2026-10-03-saving-goal.md`.
**Mockup frames:** 2, 2b (without confetti), 3a.
**Ships as three PRs:** Step 1, the goal screen (#203, merged); Step 2, the ways
in (`feat/goal-ways-in`); Steps 3 and 4, the drawer's kept note line with the
browser checks, glossary and plan updates (a new branch off `main`).

## Ported from `origin/feat/show-goal`, and what stays behind

- Ported: `ViewGoal` with `GoalHero`, `GoalOverlays`, `MenuGoal`,
  `APP_MODE.viewingGoal`, the `AccountForm/index.ts` exports, `<MenuGoal />` in
  `AccountControls`, `<GoalOverlays>` in `AccountManagement`, the menu-morph
  reseed (a second account «תמר», listed after «נועה»), and the three
  goal-screen e2e tests with their driver methods.
- Left behind: its `WalletList` and `GoalProgress` reshapes (`main` has
  `savedTowardGoalIn`), `SavedOfGoal`, `startWithdrawal(digits)`,
  `savingsLockNote` (3a decided against the tile note), `drawerErrorExists`,
  and its unrelated loader and drawer changes.

## Step 1 — The goal screen

### Production

- `APP_MODE.viewingGoal`.
- `AccountForm/index.ts` also exports `CancelButton` and `FormTitle`.
- `src/components/Goal/ViewGoal/` with `GoalHero/`, as built, adapted to
  `savedTowardGoalOf`. `saved` is already floored, so `Money` shows it with the
  default rounding. The reached line quotes the name: «כל הכבוד! אפשר לקנות את
  „אופניים” 🚲».
- `ViewGoal` went past the 40-line limit, so the lock line is its own
  component, `ViewGoal/SavingsLock/` (`{ reached }`), drawing
  `GOAL_COPY.savingsLocked` or `SAVINGS_LOCK_COPY.savingsOpen`.
- Each folder holds its own constants: `GOAL_HERO_TEST_IDS` and
  `GOAL_HERO_COPY` move out of `ViewGoal/constants.ts` into
  `GoalHero/constants.ts` (the port kept both components' constants in one
  file). Test ids follow the renames: `SAVINGS_LOCK_TEST_IDS.label`,
  `GOAL_HERO_TEST_IDS.encouragement`.
- `src/components/AccountManagement/GoalOverlays/` (its own component, as the
  spec decides): props `{ mode, currentAccount, onClose }`; `AccountManagement`
  renders it with `cancel`. With no goal it draws nothing. The spec's rule, «a
  refresh that leaves no goal, or one with a different id, returns
  `viewingGoal` to `viewing`», is deferred to PR 4, where the first refresh
  started from a goal overlay arrives (`SetGoal`, `CancelGoal`, a 409). In 3b
  the screen sends no request, and it sits on `LAYERS.modal` (70) over the
  header and the menu toggle (60), so nothing on it starts a refresh. One
  started just before it opened (a drawer save's `useRefreshBalances`, a 409
  in `useAmountEntry`) can still land under it; the goal can then only have
  changed on another phone. No goal: the overlay draws nothing and `mode`
  stays `viewingGoal`, which nothing else reads in 3b. Another goal: the screen
  shows the account's goal as it now is. Both are harmless until PR 4. The
  parent plan's PR 4 note carries the whole rule plus the finish handler that
  returns to `viewing` the way `finishEditing` does.
- The goal screen closes the way the drawer and the picture search do (the
  create and edit overlays do not close on Back yet). `useModalSheet` (Escape,
  Back through `useCloseOnBack`, focus in on open and back to the opener on
  close) moves from `Goal/GoalPictureSearch/use-modal-sheet.ts` to
  `src/hooks/use-modal.ts`, now that two components use it. It is renamed
  `useModal` since `ViewGoal` is not a sheet. Without it, Back on Android leaves
  the page instead of closing the screen (the drawer has closed on Back since
  #9; #201 made one Back leave the page after it closes). `ViewGoal`'s
  container is `role="dialog"`, `aria-modal="true"`, `aria-label` the title copy
  (`FormTitle` takes no id), and `tabIndex={-1}` for the focus.
- `GOAL_COPY.savingsLocked` («🔒 שומרים עד היעד») replaces
  `WITHDRAWAL_FORM_COPY.savingsLockedSubmit`. An object literal cannot read
  its own `lock` key, so `Goal/constants.ts` hoists `const lock = '🔒'` and
  builds both keys from it. The old key is deleted from
  `WithdrawalForm/constants.ts`, and its four users move with it:
  `withdrawal-copy.ts`, `WithdrawalForm.goal.test.tsx`, `e2e/goal.visual.ts`,
  `e2e/goal.e2e.ts`. These test files go in the production commit, because
  otherwise `tsc` fails at that commit. Check `HEAD` with `tsc`, not the
  working tree. The open copy has one user and lives in `SAVINGS_LOCK_COPY`.

Commit: `feat(goal): the goal screen`.

### Tests

`ViewGoal.test.tsx`, first three:

1. _names whose goal it is_. Break: drop `accountName` from the title.
2. _shows no reached heading while locked_. Break: always draw it.
3. _a reached goal shows the reached heading_. Break: never draw it.

Then, each with its own break: _passes the goal's state to the savings lock_
(pass `reached={false}` always; asserts the open copy for a reached goal);
_✕ closes_ (no `onCancel`); _חזרה closes_ (no `onClick`); _Escape closes_
(no `useModal`).

`SavingsLock.test.tsx`: _says savings are kept while locked_ (break: always
show the open copy); _says savings are open once reached_ (break: ignore
`reached`).

`GoalHero.test.tsx`, each with its own break: _shows the goal's picture_ (drop
the emoji); _names the goal_ (drop the name); _shows how much is saved_
(`goal.amount` for `saved`); _shows the goal's amount_ (`saved` for
`goal.amount`); _says how much is still to save_, «עוד ₪215» (`goal.amount`
for `stillToSave`); _says it can be bought once reached_ (ignore `reached`).

`GoalOverlays.test.tsx`: _draws the goal screen while viewing a goal_ (return
`null` always); _draws nothing when the account has no goal_ (drop the guard);
_draws nothing in another mode_ (drop the mode check).

Fixtures: the existing `mockAccountSavingForGoal` and
`mockAccountWithGoalReached` (`goal.mocks.ts`), and `createMockSavedTowardGoal`,
in place of the port's `{ ...mockAccountSummary, goal: mockGoal }`. Each one
sits in the narrowest `describe` that uses it.

## Step 2 — Ways in: the card line and the menu row

### Production

- One drawing of the goal's progress, used by both ways in (decided
  2026-10-11: consistent and reusable). `GoalProgress` moves from
  `Account/WalletCard/GoalProgress/` to `src/components/Goal/GoalProgress/` and
  becomes only what it shows: picture, heading (the goal's name, or «🎉 הגעת
  ליעד!» in green once reached), `SavedOutOfGoal` and the thin bar. Its prop is
  required (`savedTowardGoal: SavedTowardGoal`); it has no border, no button
  and no `null` branch. Its 3a tests move with it unchanged. One size
  everywhere: the card's (34px picture, 13px heading). The menu row shrinks
  from the port's 42px / 14px to it. A deviation from the spec's folder
  (`WalletCard/GoalProgress/`), recorded in the parent plan's "Where the build
  differs".
- `Account/WalletCard/GoalLine/` (new): the savings card's line. A
  `type="button"` holding `<GoalProgress>`, tapping
  `setMode(APP_MODE.viewingGoal)`; `null` without a goal (the optional prop
  moves here from `GoalProgress`). Its styles reset what a button adds
  (`border: none`, `background: transparent`, `color: inherit`,
  `font: inherit`, `text-align: start`), add `cursor: pointer`, and keep the
  dashed top border (declared after `border: none`), the margin and the
  padding. 3a's card should look the same, checked by a home shot against
  `main`. `WalletList` renders `GoalLine` where it rendered `GoalProgress`.
  `GOAL_PROGRESS_TEST_IDS.line` becomes `GOAL_LINE_TEST_IDS.line` and
  `GoalDriver.goalLine()` follows.
- `src/components/Menu/MenuGoal/`: `styled(Row)` from `Menu/row-parts.ts`
  holding `<GoalProgress>` and the chevron. It adds only the border colour
  (`softBorder`) and `margin-top`, and takes `Row`'s padding (8/11) and radius
  (14) like the account rows. `null` without a goal
  (`savedTowardGoalOf(currentAccount)`); tap →
  `closeMenu(); setMode(APP_MODE.viewingGoal)`. The port's `Thumb`, `Body`,
  `Top` and its own row rules are not ported.
- A button may hold only phrasing content, so `GoalProgress`'s wrappers and
  `GoalProgressBar`'s `Track` and `Fill` are `styled.span` (`display: block`
  or `flex`). The bar looks the same, and its `role="progressbar"` and test ids
  do not change.
- `AccountControls`: `<MenuGoal />` between `AccountPicker` and
  `EditAccountButton`.
- `e2e/menu-morph.visual.ts` seeds `goals: [mockGoal]` and «תמר» as
  `mockSiblingAccountListedAfter` (the glossary rules out a bare "sibling"). The
  shared `mockSiblingAccount` («מתן») cannot serve here, because it lists
  before «נועה».

Commit: `feat(goal): the savings card's goal line and the menu row open the goal screen`.

### Tests

`GoalProgress.test.tsx` moves with the component; its three 3a tests stay as
they are and are re-run.
`GoalLine.test.tsx`: _shows nothing without a goal_ (break: render it anyway);
_shows the goal's progress_ (break: drop `<GoalProgress>`); _opens the goal
screen when tapped_ (break: no `setMode`).
`MenuGoal.test.tsx`: _shows nothing without a goal_ (break: render the row
anyway); _shows the goal's progress_ (break: drop `<GoalProgress>`); _closes the
menu when tapped_ (break: no `closeMenu`); _opens the goal screen when tapped_
(break: no `setMode`). What the progress says (name, reached, saved out of the
goal) is `GoalProgress`'s rule and stays in its tests.
Menu morph: the two "with the account list open" tests, watched failing with the
goal seeded and without «תמר».

## Step 3 — The drawer keeps one line for its note (decided: option B)

### Production

`SelectedWalletNote` always keeps one note-sized line. The reached-goal note
(«🎉 משיכה מהחיסכון תסיים את היעד „…”»), the overdraft alert and the save error
all fill it, so none of them changes the drawer's height.

- The kept line wraps **every** branch, the locked one included. Today
  `SelectedWalletNote` returns `null` while savings is locked; a line kept only
  after that return would shrink the locked drawer by one line and redden
  3a's _keeps its height when savings is picked_ (`e2e/goal.visual.ts`).
- The slot has a fixed `height`, not a `min-height`, and centres its note.
  The three notes are not the same height today: the completion note has
  padding 7 and no margin (≈29px), the overdraft has `DrawerError`'s 6px
  margin plus padding 7 (≈35px), and the save error has the margin and no
  padding (≈21px). A slot sized to just one of them would still move when the
  completion note gives way to the overdraft. The height is the tallest note's,
  and it lives as a value in `SelectedWalletNote.styles.ts`.
- One line means one line. The slot's child, whichever note it is, gets
  `max-width: 100%`, `white-space: nowrap`, `overflow: hidden` and
  `text-overflow: ellipsis` (`& > *` in the slot's style). Putting the rule on
  the slot itself would clip the pill's end padding and radius, and putting it
  on `DrawerError` would reach the deposit form too. A goal name can be 30
  characters (`MAX_GOAL_NAME_LENGTH`), and with it the completion note runs
  past one line at 12px. The note's words come before the name, so the
  ellipsis cuts only the end of the name. The overdraft and error copy fit on
  one line at 360px.
- Every withdrawal drawer, with or without a goal, grows by the slot's height
  and nothing more. The drawer's 8px `gap` sits on `Sheet`, between the handle,
  the toggle and `Body`; `Body`'s children have no gap. The body sits inside a
  `max-height: 80svh` that clips (`overflow: hidden`), so a browser check (see
  Tests) proves the submit stays whole on a 360×640 phone. If it does not,
  stop and ask before shrinking anything.

Commit: `feat(goal): the withdrawal drawer keeps its height when a note shows`.

### Tests

`e2e/goal.visual.ts`, _a goal reached: the drawer keeps its height when savings
is picked_, using `main`'s `drawerHeight()`, seeded with a goal whose name is
`MAX_GOAL_NAME_LENGTH` long. Break: drop the kept line; then, separately, drop
the `nowrap`.
_a goal reached: the drawer keeps its height when the amount runs past
savings_: savings is picked, then the amount is typed past the savings
balance, so the overdraft replaces the completion note. Break: `min-height` in
place of `height`.
_the submit stays whole on a small phone_: at a new
`SMALL_PHONE = { width: 360, height: 640 }` in `e2e/driver/viewports.ts`
(`appBrowser.resize`), the submit's box ends inside the drawer's box. Break:
make the slot 200px tall.
jsdom has no layout, so none of these is a unit test. 3a's locked-height test
is re-run and stays green.

## Step 4 — Browser checks, docs, PR

- `e2e/goal.visual.ts` and `GoalDriver` (with `main`'s `waits.testId`, and
  `tap…` methods, never click): _opens from the savings card_; _opens from the
  menu_; _✕ returns home_; reached: _the screen says savings are open_ (break:
  ignore `reached`).
- `e2e/goal.e2e.ts`, where flows through real history live (as in
  `transaction-drawer.e2e.ts`):
  - _Back closes the goal screen and stays home_: arrive home from the Method
    page first (the `cameHomeFromTheMethodPage` steps) so that Back has
    somewhere to go. Assert the screen is gone and the page is still home.
    Break: no `useModal` (the page leaves for Method).
  - _opens from the menu on the Method page and ✕ returns to it_: the spec
    says goal screens open over whichever page the menu was on, and
    `/method` and `/transactions` render `AccountManagement` too. Break:
    render `GoalOverlays` from `Home` instead of `AccountManagement`.
- Glossary: the goal's screen → `ViewGoal`, `viewingGoal`; `SavingsLock` on
  the "Savings kept for a goal" row; a row for `Encouragement`; the goal's row
  in the menu → `MenuGoal`; the savings card's line → `GoalLine`; `GoalProgress`
  now one drawing shared by both; `useModal`.
- Plans: 3b row → in review; in `.plans/2026-10-10-show-goal.md`, the drawer's
  open decision → decided (option B), and under "Where the build differs":
  `GoalProgress` lives in `Goal/`, shared by `GoalLine` and `MenuGoal`. The PR 4 note carries two things: the
  spec's rule that a refresh leaving no goal, or one with a different id,
  returns `viewingGoal` to `viewing`; and that a goal overlay's finish handler
  returns to `viewing` the way `finishEditing` does.
- Suites, each captured to a file: `tsc --noEmit`, `eslint .`, `jest`,
  `npm run build`, `npm run test:e2e`.
- Screenshots (`pr-screenshots`): the goal screen locked (2) and reached (2b),
  the menu row (3a), the menu row reached, the drawer with the reached note
  (30-character name, cut by the ellipsis), the drawer with no note (it grows
  for everyone), the drawer at 360×640, the savings card (unchanged by the
  button), one non-default theme.

## Names (proposed; checked against the glossary)

| Built on `feat/show-goal`                                | Proposed                                                 | Why                                                     |
| -------------------------------------------------------- | -------------------------------------------------------- | ------------------------------------------------------- |
| `Badge`, `lockedBadge` / `openBadge`                     | `SavingsLock`; `savingsLocked` / `savingsOpen`           | It says whether savings is locked; a badge is the drawing |
| «🔒 שומרים עד היעד» in two places                        | `GOAL_COPY.savingsLocked`, also used by the drawer submit | One text, one constant                                  |
| `StillToSave` / `stillToSaveText` (holds the buy line too) | `Encouragement` / `encouragementFor`                     | Once reached it no longer says what is left             |
| `MenuGoal`'s `accountGoal`                               | `savedTowardGoal`                                        | A value takes its type's name                           |
| `useModalSheet` (in `GoalPictureSearch/`)                | `useModal` (`src/hooks/use-modal.ts`)                    | Two users now; `ViewGoal` is not a sheet                |
| `GoalOverlays`' `viewedGoal`                             | `savedTowardGoal`                                        | A parameter takes its type's name                       |
| driver `goalScreenBadge`                                 | `goalScreenSavingsLock`                                  | After the component                                     |
| test ids `badge`, `stillToSave` (hero)                   | `savingsLock`, `encouragement`                           | After the component they mark                           |
| `MenuGoal`'s `Thumb`, `Top`, `Body`; `GoalProgress`'s `GoalLine` style | one `Goal/GoalProgress` component; `WalletCard/GoalLine` for the card's button | One drawing for both ways in; the line is the card's |
| menu-morph `mockSiblingListedAfter`                      | `mockSiblingAccountListedAfter`                          | Glossary: `siblingAccount`, never a bare sibling        |

Kept: `ViewGoal`, `GoalHero` (decided in 3a), `MenuGoal`, `GoalOverlays`,
`viewingGoal`, `tapGoalLine`, `tapMenuGoal`.

## Workflow

Per `CLAUDE.md`, each step goes: production code, then your review and "commit".
After that, the first (up to) three tests of one file, then your review, then the
rest, then "commit tests". Each test is watched failing against its own break:
`cp` the file aside, apply the break, run, restore, then `cmp` to prove the restore.
