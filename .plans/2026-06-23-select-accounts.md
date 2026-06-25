# Select Accounts — wire real accounts + switch + animate

**Date:** 2026-06-23
**Branch:** `feat/select-accounts` (worktree: `../fun-saver-select-accounts`, off `origin/main`)
**Decisions:** selection state = **pure client-side**; animations = **CSS transitions only**.

## Goal

Replace the hardcoded menu accounts with the real accounts from the store, let the
user switch the active account by tapping a chip (which closes the menu and reveals
the newly-selected account's main page), and add CSS animation polish to the chip
taps and the switch.

## Architecture

Selection lives in a client provider seeded by the server page.

- **`page.tsx` (server)** — fetch *all* accounts and, for each, its wallets:
  ```ts
  const accounts = await store.listAccounts();
  const views = await Promise.all(accounts.map(async (a) => ({
    account: a,
    wallets: await getWalletsForAccount(store, a.id, today()),
  })));
  ```
  Empty `views` -> `EmptyState`; `?create` -> `CreateAccount`; else
  `<AccountSwitcher views={views} />`.

- **`AccountSwitcher` (NEW client component)** — holds `selectedId` state (default
  `views[0]`), exposes `{ accounts, selectedId, selectAccount }` via context, renders
  the active `<Account>` wrapped in a transition element keyed by `selectedId` (each
  switch remounts -> plays a CSS enter animation).

- **Menu consumes the context.** `AccountsSection` reads `accounts` + `selectedId`
  from context (no data prop-drilling), renders a real chip per account, and on tap
  calls `selectAccount(id)` then closes the menu. `onClose` threads one level:
  `MenuOverlay` -> `AccountsSection`.

The chip already renders the real `Avatar` SVG + first-letter `Badge` + gold ring
(`data-selected`); it just needs real data + to become interactive.

## Files

**New** — `src/components/AccountSwitcher/`: `AccountSwitcher.tsx`,
`account-selection-context.ts` (context + `useAccountSelection`),
`AccountTransition.tsx` (CSS enter-animation wrapper), `constants.ts`, `index.ts`,
plus co-located tests.

**Changed**:
- `src/app/page.tsx` — build `views`, render `AccountSwitcher`.
- `Menu/AccountsSection/AccountsSection.tsx` — consume context, accept close.
- `Menu/AccountsSection/AccountChip.tsx` — become a `<button>`; press-scale + ring
  transition + `onClick`.
- `Menu/AccountsSection/constants.ts` — drop hardcoded `accounts`/`selectedId`; keep
  style/labels/test-ids.
- `Menu/MenuOverlay/MenuOverlay.tsx` — pass `onClose` to `AccountsSection`.
- Update affected tests (AccountsSection/MenuOverlay now need the context provider).

## Animations (CSS only)

1. Chip tap — `:active` press-scale (~0.92) with transition on the chip button.
2. Selection ring — transition the gold ring (box-shadow) so it pops in on select.
3. Menu close on switch — reuse existing overlay scale/opacity-out (300ms).
4. Account switch — `key={selectedId}` remounts the view; fade + slight slide/scale
   keyframe plays as it is revealed behind the closing menu.

## Phases (project TDD workflow: production code approved & committed first, then
tests one at a time)

- **Phase 1 — Selection provider + server wiring:** `AccountSwitcher` + context +
  `page.tsx` preload. Active account still `views[0]`; UI switching not wired yet.
- **Phase 2 — Wire menu to real accounts + switching:** `AccountsSection`/`AccountChip`
  consume context, tap selects + closes menu.
- **Phase 3 — Animation polish:** chip press, ring transition, switch enter animation.

## Assumptions / Out of scope

- Account count is small enough to preload all wallets per load (family app).
- Edit-account and add-account chips stay **inert** (separate follow-ups).
- A meaningful demo needs >=2 accounts; `data.json` is created on first account
  creation — confirm/seed test data during verification.

## Verification

`npm test`, `npm run lint`, manual browser check (switch accounts -> menu closes ->
main page shows the new account with the enter animation).
