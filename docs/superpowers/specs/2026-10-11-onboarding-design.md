# Onboarding — design

**Date:** 2026-10-11. **Mockups:** `mockups/onboarding/2-pig.html` (chosen),
`mockups/onboarding/1-style.html` (the three styles compared).
**Plan:** `.plans/2026-10-11-onboarding.md`.

## What and why

A parent creating a child account today fills one form (name and avatar) and
lands on an empty dashboard. Nothing asks for a goal, and no screen can set one.

Onboarding walks the parent through setting the child up, one subject per
screen, with the pig asking each question. Version 1 asks for the account and
the goal. Later versions add the wallets and their deposit shares as further
steps, without changing how the flow works.

**Success:** a parent with no accounts reaches the child's dashboard, goal on
the savings card, in under a minute and without help.

## Decisions

| Question | Decision |
| --- | --- |
| When it runs | Every time a child account is created: from `EmptyState` and from the menu's add button. It replaces `CreateAccount`. |
| The goal | Optional. **דלג — אקבע אחר כך** skips it. Until a goal is set, the savings card shows a **קובעים יעד חיסכון?** line that opens `SetGoal`. |
| Screens | One per subject: the account (name and avatar), the goal (picture, name, amount), then a ready screen. |
| Style | The pig asks each question in a speech bubble, with progress dots (mockup A). |
| Structure | An overlay that walks a list of steps (approach 1). A step knows its own fields and nothing about the flow. |
| The ready screen | A summary row per step with **עריכה** (or **קביעה** for a skipped goal), whether or not the goal was set. |
| Changing a set goal | A new `PUT /api/accounts/[id]/goals/[goalId]` updates the active goal's name, amount and picture. It is reached only from the ready screen's goal row; there is still no goal editing elsewhere. This overrides the saving-goal spec's "Out: editing a goal" for that one row. Cancelling and setting again was rejected: it records a cancelled goal the parent never cancelled, and a failed second request leaves no goal at all. |
| No confetti on the ready screen | `Celebration` means a goal reached (glossary). Playing it when a goal is only set spends the child's reward on the parent's setup, and it would replay each time an edit row returns to the ready screen. |
| Copy | Gender-neutral: the app does not know the child's gender, so no «חוסכ/ת», «לו» or «לילד». |

## The flow

1. **The account.** «למי פותחים חשבון?», hint «שם ודמות». Name and avatar,
   **המשך ליעד ←**. On submit the account is created (`POST /api/accounts`).
2. **The goal.** «מה היעד של {name}?», hint «אפשר לקבוע את זה ביחד אחר כך».
   Picture (tapping opens `GoalPictureSearch`), name, amount and the lock note.
   **✓ קובעים יעד** sets it (`POST /api/accounts/[id]/goals`); **דלג — אקבע אחר
   כך** goes on without one.
3. **Ready.** «החשבון של {name} מוכן!» The goal picture (or the account's
   avatar when skipped), a summary card, and **לחשבון של {name} ←**, which
   calls `showNewAccount`: it switches to the new account and refreshes.
   The summary card has a row per step, each with its own button:
   - the account, with **עריכה**;
   - the goal, with **עריכה**, or «עוד אין יעד» with **קביעה** when skipped.

   A row's button opens that step filled in, without the dots, its submit
   labelled **✓ שמירה** (account) or **✓ שמירת היעד** (goal). Saving it
   returns to the ready screen instead of going on to the next step; Back
   returns there without saving; there is no Skip and no ✕ in this mode.

**Moving around.** The on-screen Back (→) and the phone's Back do the same
thing, as on any phone screen. Where there is no Back, the phone's Back
leaves. ✕ and Escape always leave. Leaving goes through one `leave` action:

| Where | Back (→) and phone Back | ✕ and Escape |
| --- | --- | --- |
| The account step, no account yet | no Back; phone Back → `leave` → `cancel` | `leave` → `cancel` |
| A step, account exists | previous step | `leave` → `showNewAccount(account)` |
| A row opened from ready | ready, without saving | no ✕; Escape returns to ready |
| Ready | no Back; phone Back → `leave` → `showNewAccount(account)` | no ✕; Escape → `leave` → `showNewAccount(account)` |

- Escape and the phone's Back on the account step are new: `CreateAccount`
  today closes only by its ✕.
- Going back to the account step after the account exists pre-fills it, and
  submitting updates it (`PUT /api/accounts/[id]`) instead of creating a
  second one.
- While a request is pending, Back, Skip, ✕ and Escape do nothing. A phone
  Back that does not close the overlay (pending, a previous step, a row
  returning to ready) leaves the next press working, instead of leaving the
  app (see Back and Escape reach only the top modal).
- With `GoalPictureSearch` open over a step, Escape and the phone's Back close
  only the sheet.
- There is no resume. Each step saves when submitted, so leaving halfway leaves
  a real account without a goal, and the savings card's line offers the goal
  from there.

## Structure

### The step list

```ts
const ONBOARDING_STEP_ID = { account: 'account', goal: 'goal' } as const;

interface OnboardingAnswers {
  account?: Account;
  goal?: Goal;
}

interface OnboardingStepProps {
  answers: OnboardingAnswers;
  onAnswered: (answered: OnboardingAnswers) => void;
  onRequestStateChange: (requestState: RequestState) => void;
}

interface OnboardingStep {
  id: OnboardingStepId;
  question: (answers: OnboardingAnswers) => string;
  hint: string;
  Form: ComponentType<OnboardingStepProps>;
  canSkip: boolean;
}

const ONBOARDING_STEPS: readonly OnboardingStep[] = [
  { id: ONBOARDING_STEP_ID.account, Form: AccountStep, canSkip: false, … },
  { id: ONBOARDING_STEP_ID.goal, Form: GoalStep, canSkip: true, … },
];
```

The entries are written inline in `onboarding-steps.ts`, so no `ACCOUNT_STEP`
constant reads like the `AccountStep` component.

`Onboarding` draws the frame (`OnboardingHeader` with Back, dots and ✕; the
pig's question; Skip when `canSkip` and not editing from ready) and renders the
current step's `Form` inside it. `useOnboarding({ onCancel, onCreated })`
(co-located) holds the walk: the step index, the answers so far, whether a step
was opened from the ready screen, the current step's `requestState`, and
`leave`. The walk is a pure reducer over that state, run by `useReducer`, so
the moving-around table is tested without rendering and the hook stays under
the 40-line limit. When the last step is answered or skipped it shows
`OnboardingReady`, which reads the answers for its summary.

- `onAnswered` merges what the step saved into the answers; a step never
  overwrites another's.
- Every step change (answered, skipped, back, a row opened, a row's return)
  resets the frame's `requestState` to idle. `useAccountForm` stays `pending`
  after a successful save, so without the reset ✕ would stay disabled on the
  ready screen.

A step's `Form` renders its own `<form>` with its fields and its submit button.
It reports its `requestState` through `onRequestStateChange`, called where the
form sets it (not from an effect), because Back, ✕, Skip and Escape live in the
frame, which otherwise cannot know a request is in flight. It calls
`onAnswered` with what it saved once its request succeeds. It never knows its
position, the dots or what comes next. That is what lets the same fields
appear outside onboarding: `AccountForm` composes `AccountFields` and `SetGoal`
composes `GoalFields`, each with its own title and ✕, and a future wallet step
will be composed the same way in settings.

**Adding a step later** (wallets, shares) is one entry in `ONBOARDING_STEPS`,
its id and its `Form`, plus its summary row in `OnboardingReady`. The dots,
Back and Skip follow from the list. The rows share a presentational
`ReadyRow` (label, value, button); which rows appear is written out by hand,
because with two steps a per-step summary component would be an abstraction
with no second use.

### Components

Each in its own folder with `.tsx`, `.test.tsx`, `constants.ts`, `index.ts`
and, where it has styles, `.styles.ts`; under `src/components/Onboarding/`
unless named otherwise.

| Component | What it is |
| --- | --- |
| `Onboarding` | The overlay: frame, current step, ready screen. A `role="dialog"`, `aria-modal`, labelled by the question, through `useModal(leave)`. Replaces `CreateAccount` in `AccountManagement`. |
| `OnboardingHeader` | Back, `OnboardingProgress` and ✕; each hidden where the moving-around table has none, disabled while pending. |
| `OnboardingQuestion` | The pig and its speech bubble. The bubble is the step's `<h1>`, with `tabIndex={-1}`; it takes focus when the step changes. |
| `OnboardingProgress` | The dots, `aria-current="step"` on the current one, labelled «שלב 2 מתוך 2». Renders nothing with fewer than two steps, or for a row opened from ready. |
| `AccountStep` | `AccountFields`. Creates the account with `useCreateAccount`, or updates it with `useUpdateAccount` when `answers.account` is set. |
| `GoalStep` | `GoalFields`. Sets the goal with `useSetGoal`, or updates it with `useUpdateGoal` when `answers.goal` is set. |
| `OnboardingReady` | The big picture, the question bubble, the summary card of `ReadyRow`s and the button. |
| `AccountForm/AccountFields` | Name, avatar and the save button with its error; state in `useAccountForm`. Shared by `AccountForm` (create and edit) and `AccountStep`, so `useAccountForm` keeps one user. |
| `Goal/SetGoal` | The standalone goal form: `CloseButton`, `ScreenTitle`, `GoalFields`, **ביטול**. Opened by `APP_MODE.settingGoal`; drawn in `GoalDialog`, which it shares with `ViewGoal` and which calls `useModal`. |
| `Goal/GoalFields` | Picture button, name, amount, the lock note; state in `useGoalForm`. Shared by `SetGoal` and `GoalStep`. Choosing a picture calls its `onChange`, and `GoalFields` closes the sheet there: `GoalPictureSearch` never closes itself. |
| `AccountManagement/GoalScreens` | `ViewGoal` and `SetGoal`, moved out of `AccountManagement`, as the saving-goal spec planned, to keep it under the 40-line limit. It reads `mode` and `currentAccount` and finishes with the existing `finishEditing`, so `useAccountNavigation` (38 of 40 lines) does not grow. `Overlay` then has two users and moves to `AccountManagement/overlay-parts.ts`. |

`GoalFields` keeps everything the saving-goal spec gives `SetGoal`
(Screens, `SetGoal` row; Decisions, Lock copy): 🎯 when no picture is chosen;
upload and link shown disabled with a בקרוב tag; the lock note «מרגע שקובעים
יעד, שומרים את קופת החיסכון עד שיש בה ₪…»; and with the amount at or below the
savings balance, the lock note gives way to the reached line. A new account's
balance is zero, so in onboarding the reached line never shows.

Hooks, by how many places use them (CLAUDE.md):

| Hook | Lives in | Used by |
| --- | --- | --- |
| `useAccountForm` | `AccountForm/AccountFields/` | `AccountFields` |
| `useCreateAccount` | `Onboarding/AccountStep/` (moved from `CreateAccount/`) | `AccountStep` |
| `useUpdateAccount` | `src/hooks/` (moved from `EditAccount/`) | `EditAccount`, `AccountStep` |
| `useGoalForm` | `Goal/GoalFields/` | `GoalFields` |
| `useSetGoal` | `Goal/SetGoal/` in PR 1, where `SetGoal` is its only user; `src/hooks/` in PR 2 | `SetGoal`, `GoalStep` |
| `useUpdateGoal` | `Onboarding/GoalStep/` | `GoalStep` |

`useUpdateGoal` sends `PUT /api/accounts/[id]/goals/[goalId]` with
`{ name, amount, picture }` (amount in shekels, a `GoalRequest`) through
`fetchJson`, returns the `Goal` (amount in agorot) and reports `requestState`.
A `409` is a save error like any other. Hooks and functions that take more than
two values take one object (`updateGoal({ accountId, goalId, request })`).

`SetGoal` is the goal form the saving-goal spec planned for its PR 4b
(`docs/superpowers/specs/2026-10-03-saving-goal-design.md`, Screens). It is
built here as specified there, with its fields split out into `GoalFields`
and with `CloseButton` and `ScreenTitle` in place of that spec's `CancelButton`
and `FormTitle`, which have since become shared components; 4b keeps
`CancelGoal`.

### Changing a goal

- `GoalEdits` in `src/lib/goal/types.ts` is `Pick<Goal, 'name' | 'amount' |
  'picture'>`: all three required, amount in agorot. The request body is a
  whole `GoalRequest` (amount in shekels), unlike `AccountEdits`, whose fields
  are optional. `setGoal` and `updateGoal` share one step that trims the name
  and turns shekels into agorot (`goals.ts` does it inline in `setGoal` today),
  so the two cannot drift.
- `updateGoal({ store, accountId, goalId, request })` in
  `src/lib/goal/goals.ts` checks the body with `assertValidGoalRequest`, then
  calls `store.updateActiveGoal({ accountId, goalId, edits })`. It throws
  `GoalNotActiveError` when nothing was updated. `startedAt` does not change.
- The store updates in one statement: Postgres `UPDATE goals SET name, amount,
  picture = $…::jsonb WHERE id = $1 AND account_id = $2 AND ended_at IS NULL
  RETURNING *`. An edit therefore cannot revive or change an ended goal; it
  loses to a cancel or a completing withdrawal with a `409`. A withdrawal
  already past its `goalReached` check still completes under the amount it
  read. That window is new with this route, and is accepted: the only caller
  is `GoalStep` on an account created seconds ago, with a zero balance.
- The memory and JSON-file stores share an `updateActiveGoal(goals, request)`
  helper in `src/db/goals.ts`, beside `endActiveGoal` and of the same shape
  (find the active goal, check the id, replace it). The JSON-file store saves
  only when it returns a goal, as `end()` does.
- Added to `GoalRepository` (`update`), `DataStore` and `RepositoryStore`
  (`updateActiveGoal`). Same columns, so no migration.
- The Postgres store's `UPDATE_ACTIVE_GOAL` is the whole statement that *ends*
  a goal, so it is renamed `END_ACTIVE_GOAL` before `updateActiveGoal`
  arrives, and today's `END_ACTIVE_GOAL` is inlined in `end()` as
  `${END_ACTIVE_GOAL} RETURNING *`: two names that read alike must mean alike
  (glossary).
- `PUT /api/accounts/[id]/goals/[goalId]` beside `DELETE`, behind
  `withAccountEditor`: `200` with the goal; `400` for an invalid or malformed
  body; `401`/`403` from `withAccountEditor`; `409` when the goal is not this
  account's active goal (ended, unknown or another account's), as `DELETE`.
- An amount at or below what is already saved is allowed, as when setting
  one: the goal shows as reached and savings open, which `DELETE` already lets
  an editor do.

### Back and Escape reach only the top modal

`GoalStep` and `SetGoal` open `GoalPictureSearch` over themselves, and all
three use `useModal`. Today each listens on its own: one phone Back fires
every `popstate` listener, and `useEscapeKey` registers each on `document`
in the capture phase, where `stopPropagation` does not stop another listener
on the same node, so the outer one fires first. Either way one press closes
the sheet and the screen under it, which after the account exists lands the
parent on the dashboard mid-goal.

A listener stack alone does not fix it. `useCloseOnBack` pushes one history
entry per open modal, all tagged the same `{ funsaverDrawer: true }`, and a
modal closed any way but Back (choosing a picture, ✕, the scrim) removes its
entry with `history.back()`. That `popstate` then reaches the modal
underneath, which is now the top one, and closes it. Choosing a picture would
close `SetGoal`, and in onboarding would land the parent on the dashboard.

The fix, in `use-close-on-back.ts`:

1. **Each entry names its opening.** A modal pushes
   `{ [DRAWER_HISTORY_KEY]: modalId }`, not `true`, with an id made fresh each
   time it opens (time and a counter). Not `useId`: it repeats after a reload,
   so a drawer reopened after reloading took the old entry for its own and
   ignored Back. Next's patched `pushState` keeps the router's own keys beside
   it, as it does today.
2. **A modal acts on `popstate` only when its own entry was popped**, i.e.
   `history.state` no longer carries its id. A `popstate` that lands on its own
   entry, as a closing modal's `history.back()` does for the one below, is
   ignored. A modal below always finds its own entry current, so no "is it on
   top" check is needed here. No counter of expected events, so a fast second
   Back cannot be swallowed.
3. **Back re-arms before it closes.** The popped top modal pushes its entry
   again, then calls its `onClose`. If that closes it, its cleanup removes the
   entry; cleanup calls `history.back()` only when `history.state` carries its
   own id. If not (`leave` refused while pending, a previous step, a row
   returning to ready), the next Back still reaches it.
4. **A reused entry is re-tagged.** When one modal closes and another opens in
   the same tick (`pendingBack` today), the new one keeps the entry and
   `replaceState`s it with its own id.
5. **Escape reaches only the top modal.** A list of open modal ids, in the
   order they opened, says which is on top. `useCloseOnBack` returns an
   `isOnTop` check, and `useModal` wraps its `onClose` for `useEscapeKey` with
   it. `useEscapeKey` itself
   does not change, so `AccountPicker`, which uses `takesPrecedence` and is not
   a modal, keeps its Escape.

Fixed once, in PR 1, since `SetGoal` hits it first. Closes the open item in
`.plans/2026-10-03-saving-goal.md`.

### Changes to existing code

- `AccountManagement`: `isCreating` renders `Onboarding` instead of
  `CreateAccount`, with `onCancel={cancel}` and `onCreated={showNewAccount}`,
  the prop names `CreateAccount` uses today. `onCreated` fires once the parent
  leaves an onboarding whose account exists.
  `APP_MODE.creatingAccount` keeps its name, because every onboarding creates
  an account; `EmptyState` and `AddAccountButton` do not change.
- `APP_MODE` gains `settingGoal`, drawn by `GoalScreens`, which returns to
  `viewing` and refreshes through `finishEditing` once the goal is set.
- `GoalLine`: with no goal it renders **🎯 קובעים יעד חיסכון? ←**, which opens
  `settingGoal`. `WalletList` renders `GoalLine` on every card today and passes
  `savedTowardGoalIn(wallet, …)`, which is `undefined` for spending and good
  deeds too. "No goal" cannot be read from it, so `WalletList` renders
  `GoalLine` only on the savings card; otherwise the prompt shows on all three.
  No view-mode check is needed: `WalletList` and `MenuGoal` render only in
  parent mode (`ShownAccount`, `MenuContent`).
- `MenuGoal`: with no goal it renders **🎯 קביעת יעד חיסכון +**, as the
  saving-goal spec draws it, opening `settingGoal`.
- `CreateAccount` and its folder are deleted, with `CreateAccount.test.tsx`;
  `use-create-account.ts` and its test move to `Onboarding/AccountStep/`, and
  `use-update-account.ts` and its test to `src/hooks/` and
  `src/hooks/__tests__/`. These follow:
  - the `jest.mock` paths in `Home.managing-accounts.test.tsx` (both hooks) and
    `EditAccount.test.tsx` (`use-update-account`);
  - the test ids in `Home.test.tsx`, `Home.managing-accounts.test.tsx` and
    `AccountManagement.test.tsx`;
  - `e2e/driver/use-driver.ts`, whose `createAccount` driver becomes an
    onboarding driver that also taps through the ready screen, and
    `e2e/driver/account-form-driver.ts`, whose open and title checks assume
    `AccountForm`'s frame;
  - `e2e/create-account.e2e.ts`, and the computed-style assertions in
    `e2e/create-account.visual.ts` (title spacing, form gaps, title colour and
    size) and `e2e/avatar-picker.visual.ts`, rewritten for the pig frame;
  - `.claude/skills/pr-screenshots/SKILL.md`, which names the `createAccount`
    driver.
- Glossary, on top of `main`'s rows for `GoalLine`, `MenuGoal`, `ViewGoal`
  and `useModal`: «Setting a goal» → `SetGoal`, opened by
  `APP_MODE.settingGoal`, its fields `GoalFields`, state `useGoalForm`;
  `GoalLine` and `MenuGoal` open `SetGoal` when there is no goal; «Setting up a
  new child account» → `onboarding`, `Onboarding`, `ONBOARDING_STEPS`,
  `OnboardingStep`, `AccountStep`, `GoalStep` (not wizard, setup, flow,
  `ChildStep`); «What onboarding has saved so far» → `OnboardingAnswers`,
  `answers` (not `saved`, which is money saved toward a goal); «A goal's
  changes» → `GoalEdits`; the goal's screens → `GoalScreens` (not overlays);
  `requestState` reworded "sent until the server replies", since `answered`
  now means the parent's answers.

## Errors and loading

Each step keeps its own `requestState` (`REQUEST_STATE` idle · pending ·
failed), as `useAccountForm` does, and reports it to the frame. While pending,
the submit, Back, Skip and ✕ are disabled. A ref marks the request pending the
moment it starts, because two submits in the same tick both read the last
render's `idle`; it is cleared on failure, so a retry still sends.

`GoalFields` (built in PR 1) keeps its save button tappable. Saving with a
missing name or amount, or an amount above the most a goal can be, shows a
message under that field instead of sending; the messages appear only after the
first save and clear as each field is fixed. While the goal is saved, the
button reads «שומרים את היעד…» with the loader bar along its bottom edge,
because a full-screen form hides the header's bar. A pasted amount keeps only
its whole shekels before the decimal point.

Any failure keeps the step open with its save error, a `409` included.
`SetGoal` is the exception: it opens on existing, possibly shared accounts, so
a `409` there is real (another parent set a goal). It follows the saving-goal
spec and closes to `viewing` with a refresh. In `GoalStep` a `409` needs a goal
set or ended on an account created seconds ago, from another session. It gets
no branch of its own, because ✕ still lands on the account and its refresh
shows the goal as it really is.

## Accessibility and direction

- On open, `useModal` focuses the dialog, which announces the first question
  through `aria-labelledby`. The question cannot take focus there itself,
  because a child's effect runs before its parent's and `useModal` would take
  focus back. On each later step change, focus moves to the question bubble,
  and at the end to the ready heading. Closing the overlay returns focus where
  it was, through `useModal`.
- Back is at the inline start (right) and points right (→); the forward buttons
  end in ←.
- Steps enter with `entrance()` from `src/theme/motion.ts`, which already
  honours reduced motion.

## Testing

- `npm test`:
  - The modal stack: with two modals open, Escape and `popstate` close only
    the top one; closing the top one by its own button leaves the one below
    open and one more Back closes it; a Back the top modal refuses leaves the
    next Back working; a fast second Back is not swallowed; `AccountPicker`
    still closes on Escape.
  - `useOnboarding`: next, back, skip, each row of the moving-around table, a
    row opened from ready and its return, `requestState` back to idle on every
    step change.
  - `Onboarding`: dialog role and label; a pending step disables Back, Skip
    and ✕; Escape before and after the account exists; phone Back from a row
    returns to ready and the next Back still works; focus on step change.
  - `OnboardingProgress`: nothing with one step; `aria-current` and «שלב 2
    מתוך 2» with two.
  - `AccountStep` creates first and updates after; `GoalStep` sets first and
    updates (`PUT`, not a second `POST`) after; `OnboardingReady` with and
    without a goal; `useAccountForm` and `useGoalForm` report their
    `requestState`.
  - `SetGoal` sets and closes on a `409`; `GoalScreens` draws `SetGoal` for
    `settingGoal` and `ViewGoal` for `viewingGoal`; `GoalLine` shows the
    prompt only without a goal; `WalletList` renders `GoalLine` only on the
    savings card; `MenuGoal` with and without a goal.
  - `updateGoal`, the route, the shared `updateActiveGoal` helper
    (`src/db/__tests__/goals.test.ts`) and the memory and JSON-file stores.
  - Theme assertions use a non-default theme id.
- `test:db`: the Postgres `updateActiveGoal`
  (`src/db/postgres-store/__tests__/goals.e2e.ts`) updates the active goal,
  and returns nothing for an ended goal, another account's goal or a stale id.
  Break-watches run on a throwaway Neon branch, never a shared one.
- e2e: a new parent creates a child with a goal and sees it on the savings card;
  a parent skips the goal and sees the card's prompt; in `SetGoal`, choosing a
  picture leaves `SetGoal` open, and the phone's Back over the sheet closes only
  the sheet.

## Later: the wallet step (not in version 1)

Sketched so version 1 leaves room for it.

- `Wallet` gains a `depositShare`; `splitDeposit` reads the account's wallets
  instead of `DEPOSIT_SHARES`, which becomes the default for wallets without
  one. Wallets are JSONB, so no migration.
- `WalletStep`: preset buttons (מומלץ 50/40/10, חוסך גדול 70/20/10, שווה בשווה),
  ±5% per wallet, a «נשארו X%» line, and continue disabled until the shares sum
  to 100%. Its default is the recommended preset, so skipping is safe.
- Adding or removing wallets needs `WalletName` to stop being a closed union.
  That is its own design.
