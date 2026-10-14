# Saving goal PR 4b — cancelling a goal

Parent plan: `.plans/2026-10-03-saving-goal.md` (PR 4b). Spec: Screens §
Opening and closing, New components (`MenuGoal`, `CancelGoal`), Rules 4–6,
Delivery § 4. Mockup frames 3a, 3c.

## Scope

Setting a goal is **not** in this plan. Onboarding PR 1
(`.plans/2026-10-11-onboarding.md`, approved 2026-10-11, built in worktree
`fun-saver-onboarding-set-goal` on `feat/onboarding-set-goal`) takes over
`SetGoal`, its two ways in (the card's `GoalLine`, the menu's «🎯 קביעת יעד
חיסכון +»), `APP_MODE.settingGoal`, `GoalScreens`, `isConflict` in
`fetch-json.ts`, and the top-modal-only Back and Escape in `useCloseOnBack` /
`useModal`. This plan builds on all of them.

| PR | Branch | What | Users can | State |
| --- | --- | --- | --- | --- |
| 4b-1 | `feat/cancel-goal` | Steps 1–2: press-and-hold and `CancelGoal`, shown nowhere yet | nothing new | Built and tested; PR open for review |
| 4b-2 | `feat/cancel-goal-menu` | Step 3: the menu's «ביטול היעד» opens `CancelGoal` | cancel a goal | Waits for onboarding PR 1 and 4b-1 to merge |

4b-1 is in worktree `fun-saver-cancel-goal`, off `origin/main` (`48c78e9`,
#207). Neither of its steps needs onboarding PR 1: `CancelGoal` never opens a
sheet over itself, so `main`'s `useModal` serves it. It moves `isConflict`
from `use-amount-entry.ts` to `fetch-json.ts`, the same move PR 1 makes, so
the two merge cleanly.

4b-2 touches `app-mode-context.ts`, `MenuGoal` and `GoalScreens`, which PR 1
rewrites. It starts fresh off `origin/main` once both PR 1 and 4b-1 have
merged; first confirm by content that they landed:
`git grep -n "openModalIds\|isConflict\|GoalScreens\|CancelGoal" origin/main -- src`.
If a name differs on `main`, `main` wins; update this plan first.

Each step: production code → "commit" → first three tests (watched failing)
→ approval → the rest → "commit tests".

---

### Step 1 — holding a button

Production: `src/components/Goal/CancelGoal/HoldToCancel/use-hold-to-cancel.ts`
(co-located; its only user is `HoldToCancel`). `useHoldToCancel({ holdMs, isCancelling, onHeld })`
→ `{ isHolding, handlers }`.
- Starts on `pointerdown` (primary button only), or on a Space/Enter
  `keydown`. It remembers the key that started the hold: only that key's
  `keyup` lets go, and neither the other hold key nor a held key's repeats
  start it over.
- On `pointerdown` it calls `releasePointerCapture(event.pointerId)`: touch
  pointers are captured implicitly, and a captured pointer never fires
  `pointerleave`, so sliding a finger off would not reset the hold.
- Stops and resets on `pointerup`, `pointercancel`, `pointerleave`, the held
  key's `keyup` and `blur`. `isCancelling` refuses a new hold (browsers may still send
  pointer events to a disabled button).
- Calls `onHeld` once after `holdMs` unbroken, and `isHolding` returns to
  false. The timer is cleared on unmount.
- `holdMs` is `HOLD_TO_CANCEL.holdMs` (2000) in `HoldToCancel/constants.ts`.
  The fill's CSS duration and the seconds in the copy («להחזיק 2 שניות») are
  worked out from it.

First three tests (`use-hold-to-cancel.test.ts`, beside the hook, fake
timers):

| Test | Break |
| --- | --- |
| holding for 2 seconds calls `onHeld` | the timer never starts |
| letting go before 2 seconds does not | `pointerup` doesn't clear the timer |
| a repeated `keydown` does not restart the hold | drop the held-key guard in `pressKey` |

Rest, each with its own break: `pointercancel`, `pointerleave`, `keyup` and
`blur` each reset; another key's `keyup` keeps the hold; a key other than
Space/Enter does nothing; a secondary
mouse button does nothing; `pointerdown` releases the pointer capture;
`isCancelling` refuses a hold; unmount mid-hold never calls `onHeld`.

### Step 2 — `CancelGoal`, not yet shown anywhere

`src/components/Goal/CancelGoal/` (frame 3c): a white card over a dimmed page.
Props: `{ savedTowardGoal, onKeep, onFinished }`.
- `CancelGoal`: the `alertdialog` card, labelled by its question and described
  by what is saved; **משאירים את היעד** (`KeepButton`, a full-width
  `PrimaryButton`) and `HoldToCancel`. A tap on the dimmed page keeps the goal.
- `GoalBeingCancelled/`: the picture on the savings gradient, «לבטל את היעד
  „{name}”?», «כבר נחסכו ₪85 מתוך ₪300.» through `Money` (gender-neutral, not
  the mockup's «נועה … חסכה»), and «הכסף נשאר בקופת החיסכון, והקופה תיפתח
  למשיכה.», ending at «…החיסכון.» once the goal is `reached`.
- `HoldToCancel/`: the red pill with no `onClick`, `touch-action: none`, no
  selection or long-press menu, an `aria-label` saying to hold 2 seconds,
  «להחזיק 2 שניות» under it, and the error line after a failed cancel. Its
  fill grows from the reading start while held (`transform-origin: left`,
  which the RTL style plugin turns into `right`), is not switched off under
  reduced motion (it is progress), and gives way to a solid red button while
  cancelling.
- `use-cancel-goal.ts`: `DELETE /api/accounts/[accountId]/goals/[goalId]`
  through `fetchJson`; success or `isConflict` → `onFinished`; any other
  failure (`403` for a viewer included) → `failed`. It hands its
  `requestState` to the rest, each of which reads what it needs. While cancelling it shows
  the header loader, and keeping the goal does nothing, so Escape and Back
  cannot close a dialog whose cancel is in flight.
- `use-cancel-goal-dialog.ts`: `useModal` (Escape and Back keep the goal);
  focus on **משאירים את היעד** on open and after a failed cancel; on the card
  while cancelling, since both buttons are disabled then and a browser drops
  focus from a disabled button; Tab enters at **משאירים את היעד** and
  Shift+Tab at the hold button, so focus never leaves the card.

Tests: `CancelGoal.test.tsx` (opening, keeping, a quick tap, Tab),
`CancelGoal.cancelling.test.tsx` (by id, success, `409`, a failure answered
after the pending state renders, while cancelling), `GoalBeingCancelled.test.tsx`,
`HoldToCancel.test.tsx`, `use-hold-to-cancel.test.ts` (pointer) and
`use-hold-to-cancel.keys.test.ts` (keyboard); shared setup in
`src/test-utils/cancel-goal.tsx` and `src/test-utils/hold-to-cancel.ts`,
including the `PointerEvent` stand-in jsdom lacks. Every test watched failing
against its own break.

Screenshots (`pr-screenshots`): the dialog at `PHONE` through a throwaway
mount, at rest, mid-hold, while cancelling, after a failure, and for a
reached goal.

### Step 3 — the menu opens `CancelGoal`

Production:
- `APP_MODE.cancellingGoal`.
- `useAccountNavigation`: `goalBeingViewed` is derived in `cancellingGoal`
  as in `viewingGoal`, so a refresh that leaves no goal returns either mode
  to `viewing`. No goal id is kept in navigation: `router.refresh()` runs only
  after the user's own actions, which the open dialog blocks, and a stale id
  is refused by the server (rule 5) with a `409` that closes and refreshes.
- `CancelGoal` moves onto PR 1's `GoalDialog` if it fits a card over a dimmed
  page with `alertdialog`; until then it keeps its own `Card`/`Scrim`.
- `GoalScreens`' `Overlay` already carries `LAYERS.modal`, so the card and
  the dimmed page need no `z-index` of their own.
- `GoalScreens` draws `CancelGoal` in `cancellingGoal` with `onKeep={cancel}`
  and `onFinished={finishEditing}`.
- `MenuGoal`: under the goal row, a separate small text `<button>`
  **ביטול היעד** (frame 3a; not nested in the row button) that opens
  `cancellingGoal` through the same `open(mode)` as the row.
- Focus returns to the menu toggle: `useMenuState` keeps a ref to the toggle
  (`MenuToggle` takes it), and `closeMenu` focuses it when focus is inside the
  menu. `useModal` then records the toggle as the element to refocus, so this
  also fixes `ViewGoal` opened from the menu, which today returns focus into
  the inert menu.

First three tests (`MenuGoal.test.tsx`):

| Test | Break |
| --- | --- |
| with a goal, shows **ביטול היעד** | don't render the link |
| tapping it opens `cancellingGoal` | set `viewingGoal` |
| without a goal there is no **ביטול היעד** | render it always |

Rest: `useAccountNavigation` returns `cancellingGoal` to `viewing` when the
goal is gone; `GoalScreens` draws `CancelGoal` in `cancellingGoal` and
nothing in `viewing`; `closeMenu` focuses the toggle (`use-menu-state` test);
after closing `CancelGoal` with **משאירים את היעד**, focus is on the toggle.

Browser (`e2e/cancel-goal.e2e.ts`, at `PHONE`, seeding `goals: [mockGoal]`,
reusing `goal-driver`'s `tapMenuGoal`; holds use `page.clock` rather than
real 2-second waits):
- holding cancels: the menu offers «קביעת יעד חיסכון» again and savings has
  no 🔒;
- a short press keeps the goal;
- Escape keeps it, and one Back after that stays on home.
- Back while the cancel is in flight leaves the dialog open, and after a
  failed cancel one Back still closes it and stays on home. This relies on
  PR 1's `useCloseOnBack` re-pushing the entry before `onClose`, so a refused
  close keeps it; `main`'s hook before PR 1 would lose the entry.

Each browser break gets a fresh `next build`, all in one background script
with a JUnit reporter. Re-run `e2e/menu-morph.visual.ts`: the link makes the
parent controls taller, so add a third account if the list stops short.

Screenshots (`pr-screenshots`): frame 3a (the menu with the link) and 3c
(the dialog, and the hold mid-fill with `page.clock` paused) at `PHONE`.

---

## Open points

- Viewers see «ביטול היעד» and get `403` (spec: deliberate). They see the
  error line.
- After 4b-2, update `.plans/2026-10-03-saving-goal.md`: 4b done.
