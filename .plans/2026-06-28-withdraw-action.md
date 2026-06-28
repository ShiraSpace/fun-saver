# Withdraw action — `feat/withdraw-action`

The deposit phase is shipped; withdraw is the owed sibling. Spec mockup:
`docs/superpowers/specs/mockup-withdraw-drawer.html` (3 states: savings withdraw, good-deeds-as-donation,
overdraft blocked).

## Locked decisions (this session)

1. **Entry:** a `הפקדה / משיכה` **mode toggle** at the top of the existing `TransactionDrawer`. Deposit is the
   default mode; the `+ פעולה חדשה` CTA is unchanged.
2. **Wallet selection:** withdraw shows a **3-wallet picker** (each wallet + its current balance); pick one, then type the
   amount. Deposit stays auto-split (no picker).
3. **Overdraft:** client **blocks** — confirm disabled + gentle `אין מספיק בקופה` hint once amount > wallet balance.
   Server enforces `OverdraftError` (400) as the safety net.
4. **Good-deeds = donation:** selecting the good-deeds wallet reframes copy (`כמה תורמים? 💛`, green amount,
   `תרומה של ₪X`). Other wallets: amber amount, `משיכה של ₪X`.

## Conventions (unchanged)

Integer **agorot** internally; shekels→agorot at the API boundary only. `@emotion/styled` + theme tokens; Hebrew
copy/test-ids in per-component `constants.ts`; named exports; explicit return types; files < 200 lines; no comments.
UI-driven outside-in TDD — one failing test → minimal green → mandatory refactor → next. STOP for review before each
commit.

## Theming (must survive a theme swap)

No hardcoded hex in components — every color is a `theme.colors.*` token, added just-in-time and defined in **both**
`jungle-quest.ts` and `midnight-blue.ts` (+ the `ThemeColors` interface).

- **Green = money in** → reuse existing `gainText` (green in both themes) for the deposit `↓` arrow and the
  good-deeds donation amount.
- **Red = money out** → `accent` is **blue** in midnight-blue, so it can't carry red. Add `alert` (a true red) for the
  withdraw `↑` arrow and the overdraft hint text, plus `alertSoftBg` for the hint pill background.
- **Withdraw amount** (amber, "money leaving but not an error") → add `withdrawText`. ponytail: if we want one fewer
  token, the withdraw amount can reuse `alert` red instead — flag at the styling cycle.

New tokens (concrete starting values, tune in the styling pass):
`alert` ≈ jungle `#E5484D` / midnight `#F87171`; `alertSoftBg` ≈ jungle `#FDECEC` / midnight `#3A1518`;
`withdrawText` ≈ jungle `#D9480F` / midnight `#FB923C`.

## What we reuse (don't rebuild)

- `AmountPad`, `ActionButton`, `Money`, the `Sheet`/`Scrim`/`Handle` shell.
- `derivations.balance` (already nets out withdrawals) for the overdraft check.
- `store.listTransactionsByWallet(walletId)` to read a wallet's current balance.
- Account already holds `wallets: WalletWithDerived[]` → pass wallet balances straight into the drawer; no new fetch.

## Slice (each cycle = red → green → refactor)

**Lib / API (built only when a UI test forces them, but listed here as the dependency map):**

1. **`OverdraftError`** in `src/lib/errors.ts` (own class; mapped to 400).
2. **`addWithdrawal(store, account, walletId, amountAgorot, asOf)`** in `transactions.ts` — validate positive integer
   (`ValidationError`); resolve wallet within account; `balance(listTransactionsByWallet)` ≥ amount else
   `OverdraftError`; insert one `type:'withdrawal'` transaction; return it. Unit-test: ok, zero/negative, unknown
   wallet, exact-balance ok, over-balance throws.
3. **`POST /api/accounts/[id]/withdrawals`** — thin; body `{ walletId, amount }` (shekels). 404 unknown account,
   400 `ValidationError`/`OverdraftError`. Mirrors the deposits route.
4. **Hook:** extend `use-add-transaction.ts` with `withdraw(walletId, amountShekels)` → POST withdrawals endpoint.

**UI (leads each cycle):**

5. **Mode toggle** — `Mode = 'deposit' | 'withdraw'` lifted into `TransactionDrawer`; `ModeToggle` pills. Deposit body
   renders for `'deposit'` (unchanged), withdraw body for `'withdraw'`. Extract the existing deposit JSX into a
   `DepositBody` so the drawer shell stays < 200 lines.
6. **Wallet picker** — `WalletPicker` lists the account's wallets (icon, name, balance) from a new `wallets` prop; selecting sets
   `walletId`. Drive balances from `WalletWithDerived` passed by `Account`.
7. **Withdraw amount + pad** — `useWithdrawForm(account, wallets, onClose)` mirroring `useDepositForm`: amount pad,
   `canSubmit = amount>0 && amount*100 <= selectedWallet.balance && !isSubmitting`; overdraft hint when over balance.
   Amount color amber, or green + donation copy when the good-deeds wallet is selected.
8. **Confirm** — `withdraw(walletId, amount)` → `router.refresh()` → close; loading (`מושכים…`) + server-error states
   reuse the deposit pattern.
9. **Wire into `Account`** — pass `wallets` (the existing `wallets`) into `TransactionDrawer`; CTA unchanged.
10. **E2E** — extend `DashboardDriver` (`withdraw`, assert wallet balance drops; assert overdraft blocks). Add
    `e2e/withdraw.visual.ts`. Update README + this plan's Progress.

## Open / deferred

- **Route shape:** account-level `/api/accounts/[id]/withdrawals` with `walletId` in the body (consistent with
  deposits), not a separate `/api/wallets/[id]/...`. ponytail: revisit only if wallets get their own auth root.
- Spend-category tagging, withdrawal history view — out of scope.

## Phase 0 (do before coding)

On `main` (clean apart from untracked `mockups/` + the new mockup). Cut `feat/withdraw-action` off updated
`origin/main`; worktree vs in-place is the user's call.

## Progress (2026-06-28)

Built UI-driven TDD, red→green→refactor per step (tests refactored to shared `beforeEach`/helpers as we went).
Not committed — awaiting review.

- **ModeToggle** — `הפקדה ↓` (green `gainText`) / `משיכה ↑` (red, new `alert` token); `aria-pressed` + `onChange`.
- **WalletPicker** — three wallets (icon gradient, name, `Money` balance), selected wallet highlighted, `onSelect`.
- **Lib** — `OverdraftError`; `addWithdrawal(store, account, walletId, agorot, asOf)` (positive-int +
  unknown-wallet `ValidationError`, `balance` < amount → `OverdraftError`, one `withdrawal` txn). Shared
  `assertPositiveAmount` extracted from `addDeposit`.
- **Hook** — `useAddTransaction.withdraw(walletId, shekels)` → `POST …/withdrawals`; shared `postTransaction`.
- **useWithdrawForm** — default first wallet, amount keypad (shared `amount-keypad` now used by deposit too),
  `isOverdraft`/`isDonation`/`canSubmit`, submit → `router.refresh()` → close, error state.
- **WithdrawBody** — title (withdraw vs `כמה תורמים? 💛`), WalletPicker, amber/green amount, overdraft hint
  (`alert` + `alertSoftBg`), pad, confirm (`משיכה של` / `תרומה של`). Deposit JSX extracted to `DepositBody`;
  shared `DrawerTitle`/`DrawerError` in `drawer-parts`.
- **Drawer** — thin shell: `Mode` state (default deposit), `ModeToggle` + body switch; `wallets` prop threaded
  from `Account`.
- **Route** — `POST /api/accounts/[id]/withdrawals` (`{ walletId, amount }`), 400 validation/overdraft, 404 unknown.
- **Theme** — `alert` / `alertSoftBg` / `withdrawText` added to `ThemeColors` + all themes (palette,
  jungle-quest, midnight-blue); green reuses `gainText`.
- **E2E** — `e2e/withdraw.visual.ts` (savings withdraw lowers hero deposits) + `DashboardDriver.withdraw`.

**Status:** jest **196 passing**, `tsc` + `eslint` clean. Visual E2E written but **not yet run** — `test:visual`
needs `next build`, which would fight the running `next dev` on :3001; run it once the dev server is free.

**Still owed:** run the visual suite; styling/fit pass to mock fidelity (sizes are placeholder tokens).

## Refinements (2026-06-28, post-review iteration)

- **Toggle** labels bumped to `body` (15px), arrows to `heading` (18px); green-down/red-up retained.
- **No layout shift between modes:** both bodies share one skeleton — `Title · Amount · SelectionSlot · MessageSlot
  · Pad · Confirm`. `SelectionSlot` (fixed `selectionHeight`) holds the deposit split OR the wallet picker at the same
  size; `MessageSlot` (fixed `messageHeight`) holds the overdraft hint / server error. Measured equal at 560/560px on
  the dev server. Replaced the earlier `bodyMinHeight`/`margin-top:auto` hack.
- **Z-index:** drawer was `z-index:10/11`, *below* the header (`LAYERS.overlayForeground = 60`), so the header punched
  through. Added `LAYERS.modalForeground = 80`; scrim now `LAYERS.modal`, sheet `modalForeground` → drawer is a proper
  modal over a dimmed header.
- **`account` prop:** `TransactionDrawer` (and both bodies) now take the `AccountWithDerivedWallets` instead of
  `accountId` + a separate `wallets` prop; `Account` takes the account object too (threaded from `AccountSwitcher`).
- **`WithdrawMessage`** extracted as its own component (overdraft hint / error) with a dedicated test.
- Tightened pad + sheet spacing so the equalized drawer fits.

### Cohesion pass (supersedes the slot approach above)

- **Shared `WalletTile`** — the deposit split and the withdraw picker now render the *same* tile row (icon + name +
  `Money`), so the two modes look cohesive and stay the same height with no fixed-height slots. `WalletPicker`
  (selectable, withdraw) and `DepositSplit` (static, deposit) both map to `WalletTile`. Dropped `SelectionSlot` /
  `MessageSlot` / `selectionHeight` / `messageHeight`; messages render inline only when present (tight when calm).
- **Selectable vs not** — `WalletTile` renders a real `<button>`; deposit tiles are `disabled` (dimmed
  `disabledOpacity`, default/arrow cursor), withdraw tiles are enabled (pointer cursor, primary-border on selected).
- **Thinner tinted tiles** — flat `softBg` chips (no shadow), smaller padding/icon — clearly distinct from the white
  raised keypad keys.
- **Terminology:** renamed "pot" → "wallet" across code, tests, plans, and the mockup (`PotPicker`→`WalletPicker`,
  `PotCard`→`WalletTile`, `pot-picker-*`→`wallet-picker-*`, `onSelectWallet`, etc.). The theme gradient tokens
  `potSavings`/`potSpending`/`potGood` keep their existing names (shipped, out of scope).

**Status after refinements:** jest **199 passing**, tsc + eslint clean. Visual suite still pending a free dev server.
