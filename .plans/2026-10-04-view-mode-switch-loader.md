# The view-mode switch locks and shows the loader while it works

> Status: **merged 2026-10-04** as #177 (3773ad1), on `main` after #175
> (fec8288).

## Why

Tapping the parent/child switch starts a save and then a refresh, and nothing
shows that work is happening. A second tap sends a second save.

## Behaviour

- From the tap until the switch is done, the switch is `disabled` and the
  header progress bar (`NavigationProgress`) runs. It is the same bar a menu
  tab shows while it navigates.
- "Done" means one of:
  - **The save fails.** The switch unlocks, slides back and shows the error.
  - **The switch unmounts.** On `/method` and `/transactions` that happens
    when the refreshed child menu arrives. On Home it happens when the view
    flips after the fade, and the bar stops with it, because the child screen
    is already showing.

## Reused, not new

- **The loader:** the header's `NavigationProgress` and its pending counter
  in `navigation-pending-context.tsx`. Menu tabs and `HomeAvatarLink` already
  drive it, and `LoadingShell` draws the same bar.
- **Disabling while saving:** the drawer's pattern in `use-amount-entry.ts`.
  A `useState` flag turns on at submit and off only on failure. On success
  the component goes away, so the flag never turns off. The switch works the
  same way: after a successful save it unmounts when the view flips.

## Phase 1: production code (one commit)

1. **`navigation-pending-context.tsx`:** the counter's context is private,
   and `PendingNavigationReporter` reads `useLinkStatus()`, which only works
   inside a `Link`. So the switch has no way in today. Move the reporter's
   effect into an exported `useReportPendingNavigation(isPending: boolean)`.
   The reporter calls it with `useLinkStatus().pending`. The tabs behave the
   same as before. This is the only new export.
2. **`use-account-view-mode.ts`:**
   - `const [isSaving, setIsSaving] = useState(false)`. Set it to `true` at
     the tap and to `false` on the failure path, next to `setSaveFailed(true)`.
   - Call `useReportPendingNavigation(isSaving)`.
   - Return `isSaving`. The name pairs with `saveFailed` in the same hook.
3. **`ViewModeSwitch.tsx`:** `disabled={isSaving}` on `Row`.
   **`ViewModeSwitch.styles.ts`:** `&:disabled { cursor: default; }` and
   nothing else. The track is still sliding, so the switch should not dim.

No new constants, copy, transition or glossary words.

**Known ceiling, the same as the drawer:** if the save succeeds but
`router.refresh()` never renders, the switch stays locked until a reload.

## Phase 1 as built

- `REQUEST_STATE` and its use in the drawer, account form, theme picker and
  sign-in shipped first, on their own, as #175.
- On this branch, the switch moves onto `requestState`. It names `isSaving`
  and `hasSaveFailed` above its return, the convention #175 settled on.
  While `isSaving`, the switch is disabled and drives the header bar through
  `useReportPendingNavigation`.
- Closing the menu turns only `failed` back to `idle`. A successful switch
  also closes the menu, and a plain reset would unlock the switch mid-save.

## Phase 2: tests

The tests live in `ViewModeSwitch.saving.test.tsx`, beside the existing "the
save fails" tests, which moved there to keep `ViewModeSwitch.test.tsx` under
200 lines. The two header tests render the real `Header` through
`tapSwitchInHeaderMenu()`. Each test was watched failing against its own
break, and against no other.

| Test | Break |
| --- | --- |
| A second tap while saving sends no second save | Drop `disabled={isSaving}` |
| The header loader runs while the save is open | Drop `useReportPendingNavigation(isSaving)` |
| After a failed save the switch unlocks | Lock whenever the state is not `idle` |
| After a failed save the header loader goes away | Report pending whenever the state is not `idle` |
| After a successful save, closing the menu leaves the switch locked and the loader running | Closing the menu resets any state to `idle` |

The bar goes away one render after the error shows, because the counter
changes in an effect cleanup. That is why the failed-save loader test waits for it.

## Verification

`tsc`, `eslint`, `jest` (1,057) and `build` all pass. #177 has screenshots of
the parent and child menus mid-save.
