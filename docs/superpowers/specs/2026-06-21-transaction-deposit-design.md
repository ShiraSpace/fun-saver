# Transaction Flow — Deposit (auto-split) — `feat/transaction-flow`

**Date:** 2026-06-21
**Branch:** `feat/transaction-flow` (worktree `/Users/technotronic/Projects/technotronic/fun-saver-account-dashboard`).
**Companion mockup:** `docs/superpowers/specs/mockup-transaction-drawer.html` (Variant B chosen).
**Builds on:** the dashboard + create-account flow already merged to `main`.

## Goal

From the dashboard, the child taps the existing `＋ פעולה חדשה` CTA and a bottom-sheet drawer
opens. They enter one amount on a custom number pad; the app **auto-splits the deposit across the
three pots** and writes it. On success the drawer closes and the dashboard repaints with the new
balances.

**This phase is deposit-only.** Withdraw is the next phase and must be additive (see
[Forward-compatibility](#forward-compatibility)).

## Locked decisions

1. **Auto-split, no pot picker.** A deposit is a single amount divided
   **60% savings / 20% spending / 20% good-deeds**. Ratios live in a constants file so they are
   trivially changeable. There is no deposit/withdraw toggle and no pot selection this phase.
2. **Whole shekels only** via a custom in-drawer number pad (no device keyboard, no decimals).
3. **Money boundary:** UI/API speak shekels; store + logic are integer **agorot**. Convert at the
   API route only.
4. **Split rounding:** computed in integer agorot; the rounding **remainder goes to savings** so the
   three parts always sum to the deposit exactly.
5. **Confirm gating:** the confirm button is disabled until the amount is a positive integer.
6. **Persistence:** the deposit is recorded as **one `deposit` transaction per pot** (three rows),
   each carrying that pot's share. Balances stay derived from transactions (no stored balance).
7. **Drawer style:** Variant B — big green amount (deposit = money in, matching the home-screen gain
   green), one compact dashed split line (`יתחלק לבד: 🐷 ₪12 · 🛍️ ₪4 · 💛 ₪4`), custom number pad,
   purple confirm pill (`GRADIENTS.actionButton`) whose label carries the live amount.

## Method

UI-driven, outside-in TDD (locked for this branch): a failing UI test leads each cycle → extend the
driver/scaffold only when the test demands it → minimal code to green → **mandatory refactor** → next.
A lib module / API route / hook is created only when a UI (or unit) test cannot go green without it.
One test at a time; stop for review before each commit. **No code that wasn't driven by a test** —
this rules out speculative withdraw scaffolding.

## Architecture

### Domain logic — `src/lib` (framework-agnostic, unit-tested)

- **`src/lib/constants.ts`** — extend with `DEPOSIT_SPLIT = { savings: 0.6, spending: 0.2, goodDeeds: 0.2 }`.
- **`splitDeposit(totalAgorot): { savings; spending; goodDeeds }`** — pure. Integer agorot per pot;
  remainder added to `savings`. Unit-tested: even split, uneven remainder, ₪1, large amounts.
- **`addDeposit(store, accountId, amountAgorot, asOf): Promise<Transaction[]>`** (in
  `src/lib/transactions.ts`) — loads the account's three wallets (by `WalletName`), builds one
  `deposit` transaction per wallet with its `splitDeposit` share + `newId`, inserts them via
  `store.insertTransactions`, returns them. Reuses the existing `Transaction` type.
- **`src/lib/errors.ts`** — `ValidationError` (amount must be a positive integer). `OverdraftError`
  is **deferred** to the withdraw phase (nothing drives it yet).

### API — thin route

- **`POST /api/accounts/[id]/deposits`** — body `{ amount: number }` (shekels). Handler:
  `const { id } = await ctx.params` (Next 16 async params) → validate → `shekelsToAgorot(amount)` →
  `addDeposit(getStore(), id, amountAgorot, today())` → `Response.json(transactions)`. Errors mapped
  to `{ error: string }`: `400` (non-positive / non-integer amount, `ValidationError`), `404`
  (account / wallets not found). No business logic in the handler.

### Frontend data flow

- **`QueryClientProvider`** added to `src/app/providers.tsx` (currently Emotion-only) as a client
  component, so React Query `useMutation` is available.
- **`src/hooks/use-add-transaction.ts`** — `useMutation` posting `{ amount }` to the deposits
  endpoint (`cache: 'no-store'`); on success calls `router.refresh()` to re-fetch the
  server-rendered dashboard (wallet data is not a React Query cache entry). Named generically so the
  withdraw phase can branch on transaction type without renaming.

### Components — nested under `Account/`

```
src/components/Account/
  Account.tsx                ← owns drawer open/close state; existing CTA opens it
  TransactionDrawer/
    TransactionDrawer.tsx     ← bottom sheet: amount, split line, AmountPad, confirm; loading + error
    TransactionDrawer.test.tsx
    constants.ts              ← test-ids + Hebrew copy + split-line formatting
    index.ts
    AmountPad/
      AmountPad.tsx           ← 1–9, 0, C, ⌫; emits amount changes
      AmountPad.test.tsx
      constants.ts
      index.ts
```

- The split line is computed live from the typed amount via `splitDeposit` (display in shekels).
- All theme values are tokens (`@/theme` `COLORS`/`GRADIENTS`/`TYPE_SCALE`); no inline hex or
  font-size. Extend token files just-in-time as a cycle needs a value.
- **RTL caveats** (from this worktree): `stylis-plugin-rtl` flips physical `left`/`right` **and**
  `direction:` in CSS — for an LTR money widget use the `dir="ltr"` HTML attribute, not CSS.

### States

- **Loading:** confirm disabled + spinner while the mutation is in flight.
- **Error:** gentle inline Hebrew message; the typed amount is preserved so the child can retry.
- **Success:** drawer closes; `router.refresh()` repaints the hero + cards with new balances. No
  celebratory animation this phase (can be added later).

## Forward-compatibility

Withdraw is the next phase. It must be additive, achieved through **naming and boundaries only** —
no unused code now (TDD):

- Generic names already chosen: `transactions.ts`, `use-add-transaction.ts`, `TransactionDrawer`.
- Pure `splitDeposit` is separate from the `addDeposit` writer, so withdraw adds a sibling writer
  reusing shared primitives (balance-from-transactions, `newId`, `insertTransactions`) without
  touching deposit math.
- Resource-specific thin routes: withdraw will get its own route (per-pot, overdraft-protected)
  rather than overloading the deposits endpoint.
- The drawer will be restructured (toggle + per-pot picker + overdraft message) by withdraw's own
  red→green→refactor — **not** pre-built as empty slots here.

Withdraw model recorded for the next phase (not built now): per-pot, overdraft-protected, withdraw
from good-deeds counts as a donation.

## Testing

- **Unit (jest):** `splitDeposit` (even, remainder-to-savings, ₪1, large); `addDeposit` (creates
  three transactions with correct shares, batch-inserted); `shekelsToAgorot` boundary if not already
  covered.
- **Component (jsdom RTL):** open drawer from CTA; type amount via pad; live split line; confirm
  disabled until amount > 0; mutation fired with the right amount; loading + error rendering.
  Mutation/fetch mocked.
- **API:** validation + error-status contract (400 / 404), happy path returns the transactions.
- **E2E (one, at the wiring step):** deposit ₪20 → assert hero total and the three cards update;
  extend `useDriver` seeding + `DashboardDriver`.

## Out of scope (this phase)

Withdraw, the deposit/withdraw toggle, pot selection, `OverdraftError`, interest accrual changes,
celebratory success animation, decimal/half-shekel deposits.
