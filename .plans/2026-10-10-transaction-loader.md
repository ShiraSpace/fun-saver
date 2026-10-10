# Deposit and withdrawal show the loader, and the dashboard replays on new numbers

> Status: **approved 2026-10-10**, on `feat/transaction-loader`.

## Why

After a deposit or withdrawal the drawer closes at once and the balances
change a beat later with nothing on screen saying work is happening. And the
dashboard's entrance animation (donut, count-up, legend) only plays on mount,
so new numbers just snap in.

## Behaviour

- From the moment the save succeeds until the refreshed balances render, the
  header progress bar (`NavigationProgress`) runs — the same loader every
  screen uses. While the save itself is sending, the drawer stays open and its
  button says «submitting…», as today.
- When the refreshed total arrives, `BalanceBreakdown` remounts and replays its
  entrance animation.

## Reused, not new

- **The loader:** `NavigationProgress` and the pending counter in
  `navigation-pending-context.tsx`, through `useReportPendingNavigation`.
- **The replay:** `BalanceBreakdown`'s own mount animation, already replayed on
  account switch through `key={account.id}`.

## Phase 1: production code (one commit)

1. **`navigation-pending-context.tsx`:** the counter's state moves out of
   `Header` into a `NavigationProvider`, mounted once in `layout.tsx`,
   so anything on the screen can report — not only what renders inside the
   header. `Header` reads `useIsNavigating()`. The drawer is a sibling of
   `Header`, which is why it could not reach the counter before.
2. **`use-amount-entry.ts`:** on success it calls `onSaved()` instead of
   `router.refresh(); onClose()`. The forms' success callback is renamed
   `onClose` → `onSaved`; `TransactionDrawer` takes `onSaved` beside `onClose`.
3. **`Account/use-refresh-balances.ts`:** `router.refresh()` inside
   `useTransition`, reporting `isPending` to the counter. It lives in
   `Account` because the drawer unmounts before the refresh lands.
   `Account`'s `onSaved` closes the drawer and refreshes the balances.
4. **`Account.tsx`:** `BalanceBreakdown` is keyed on the account and its total
   balance, so new numbers remount it.

## Phase 2: tests

- The header bar shows while a reporter outside the header is pending.
- `useRefreshBalances` reports pending until the refresh transition ends.
- A successful save calls `onSaved`; a failed one does not.
- `Account` remounts `BalanceBreakdown` when the total changes.
- Existing Header / navigation-pending tests move to the `NavigationProvider`.

## Out of scope

Create, edit and theme saves also refresh with no loader; each can adopt
`useReportPendingNavigation` later.
