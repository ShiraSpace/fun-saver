# Embed wallets on the account

## Context

Today the data model is fully normalized: `accounts`, `wallets`, and `transactions`
are three flat collections, with `Wallet.accountId` and `Transaction.walletId` as
foreign keys. Wallets are read separately from accounts and stitched together at the
app layer (`getWalletsForAccount`).

Wallets are a strict composition of an account: fixed cardinality (the 3 seeded
wallets), born and die with the account, and never move between accounts. That makes
embedding the correct model. Transactions stay in their own collection (they are the
hot, unbounded, append-heavy data), so the append path is unaffected.

Outcome: an account carries its wallets inline (`getAccount` returns everything in one
read), and transactions gain an `accountId` for future account-scoped queries.

## Design

**Types (`src/lib/types.ts`)**
- `Account` gains `wallets: Wallet[]`.
- `Wallet` drops `accountId`.
- `Transaction` gains `accountId: string`.
- `WalletWithDerived` unchanged (still extends `Wallet`).

**Store data shape (`src/db/data-store.ts`)**
- `StoreData` drops the top-level `wallets: Wallet[]`.
- `DataStore` interface: remove `insertWallet` and `listWalletsByAccount`; add
  `getAccount(id: string): Promise<Account | undefined>`.

**Store implementations**
- `src/db/memory-store.ts`, `src/db/json-file-store.ts`: drop the wallets array,
  implement `getAccount` (find account by id; wallets read from `account.wallets`).

**Seeding (`src/lib/accounts-store.ts`)**
- `seedDefaultWallets` builds the `wallets` array in memory; one `insertAccount` with
  wallets embedded (no more per-wallet inserts).

**Reads / logic**
- `src/lib/account-dashboard.ts`: `getWalletsForAccount` uses `getAccount(id)` then
  derives over `account.wallets`.
- `src/lib/transactions.ts`: `addDeposit` uses `getAccount(accountId)`, maps over
  `account.wallets`, and stamps each transaction with both `walletId` and `accountId`.
- `src/app/api/accounts/[id]/deposits/route.ts`: existence check via `getAccount(id)`
  instead of `listAccounts().some(...)`.

We are NOT adding `listTransactionsByAccount` until a consumer needs it (YAGNI). The
`accountId` field is added now because it is free and de-risks a future cascade/history
query; the derivation is stable (wallets never change accounts) so there is no
consistency risk.

## Blast radius (from exploration)

Production: `types.ts`, `data-store.ts`, `memory-store.ts`, `json-file-store.ts`,
`accounts-store.ts`, `account-dashboard.ts`, `transactions.ts`, deposits `route.ts`.

Tests/fixtures to update (wallet literals drop `accountId`; transaction literals add
`accountId`; `listWalletsByAccount` calls become `getAccount(...).wallets`):
`src/test-support/fixtures.ts`, `src/db/__tests__/memory-store.test.ts`,
`src/db/__tests__/json-file-store.test.ts`, `src/lib/__tests__/accounts-store.test.ts`,
`src/lib/__tests__/account-dashboard.test.ts`, `src/lib/__tests__/transactions.test.ts`,
`src/lib/__tests__/derive-wallet.test.ts`, `src/lib/__tests__/derivations.test.ts`,
`src/app/api/accounts/[id]/deposits/__tests__/route.test.ts`,
`e2e/driver/use-driver.ts` (seed embeds wallets in account instead of `insertWallet`).

Components need no change: `WalletList`/`WalletCard` already `Pick` fields that exclude
`accountId`.

## Data migration

None. Wiping the existing JSON store is acceptable (confirmed) — reseed on next run.

## Proposed execution order

1. Types + `data-store` interface (`StoreData`, `DataStore`).
2. Both store implementations (`getAccount`, drop wallet array/methods).
3. `accounts-store` seeding (embed wallets, single insert).
4. `account-dashboard` + `transactions` + deposits route.
5. Update fixtures, then the affected unit tests; update `e2e/driver/use-driver.ts`.
6. Full `jest` green (target 134/134), then typecheck/lint.

## Verification

- `npx jest` — full suite green (134/134 baseline).
- `npx tsc --noEmit` (or project typecheck) — no type errors from dropped/added fields.
- `npm run lint`.
- Manual: `npm run dev`, create an account (seeds 3 embedded wallets), make a deposit,
  confirm the split lands across savings/spending/goodDeeds and balances derive.
