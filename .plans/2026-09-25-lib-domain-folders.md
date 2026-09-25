# Split `src/lib` and `test-utils/mocks` into domains

## Goal

`src/lib` holds 29 flat files. Group them by glossary domain so each folder owns its logic, types, constants and errors. No behaviour change: files move, the shared `types.ts` / `constants.ts` / `errors.ts` split into their domains, imports are rewritten, and one file is renamed to match the glossary.

## Decisions

- Folders by glossary domain: `account/`, `user/`, `transaction/`, `wallet/`, `interest/` (existing).
- The shared `types.ts`, `constants.ts` and `errors.ts` split into each domain's own `types.ts` / `constants.ts` / `errors.ts`. A domain gets these files only when it has something to put in them.
- Generic helpers stay at the `lib/` root. No `utils/` or `shared/` folder.
- No new `index.ts` barrels. `account/` mixes server code (`accounts-store` → `DataStore`) with client code (`avatars`), so a barrel could pull server code into client bundles. The existing `interest/index.ts` stays.
- Within a folder, imports are relative (`./x`). Across folders they use the alias (`@/lib/wallet/balance`).
- Each folder has its own `__tests__/`, as `interest/` does today.
- `wallet-totals.ts` becomes `wallet/balance.ts`: the glossary lists `walletTotal` under "Not".
- `test-utils/mocks/general.mocks.ts` splits into flat `<domain>.mocks.ts` files, as the convention from PR 155 says. The test-utils helpers stay as they are, because they follow UI surfaces, not domains.
- One PR, one commit per phase. A move adds no behaviour, so each commit carries a file's code and its test together, not the usual production-then-tests pair. Every commit passes `npx tsc --noEmit`, `npm run lint` and `npm test`.
- Start only after the in-flight worktree branches are merged to `main`.

## Target layout

```
lib/
  account/
    accounts-store.ts  account-input.ts  account-access.ts  current-account.ts  avatars.ts
    types.ts      Account, AccountEdits, AccountSummary, AccountUser, AccountUserRole
    constants.ts  EDITING_ROLES, MAX_ACCOUNT_NAME_LENGTH
    errors.ts     DuplicateAccountError, UnknownOwnerError
  user/
    user-provisioning.ts  session-user.ts
    types.ts      User, SignedInUser, AuthProvider
    constants.ts  GOOGLE_PROVIDER, SIGN_IN_PATH
    errors.ts     DuplicateUserError
  transaction/
    transactions.ts  transaction-input.ts
    transaction-rows.ts  transaction-row-builders.ts  transactions-by-account.ts
    types.ts      Transaction, TransactionType
    constants.ts  TRANSACTION_TYPE, ALL_TRANSACTION_TYPES, INTEREST_MODE, DEPOSIT_SHARES
    errors.ts     OverdraftError
  wallet/
    balance.ts (was wallet-totals.ts)  balance-history.ts  summarize-wallet.ts
    types.ts      Wallet, WalletName, WalletSummary, WalletConfig
    constants.ts  WALLET_LABEL, WALLET_ICON, DEFAULT_WALLETS, PERCENT_TOTAL
  interest/
    (existing) + interest-settlement.ts
    constants.ts  DAYS_PER_MONTH, SAVINGS_MONTHLY_RATE
  money.ts        + AGOROT_PER_SHEKEL
  errors.ts       ValidationError only (clock.ts and transactions.ts use it)
  clock.ts  dates.ts  ids.ts  json-object.ts
  fetch-json.ts  navigate.ts  cookies.ts
```

When every symbol has moved, the root `types.ts` and `constants.ts` are deleted.

Test moves: `wallet-totals.test.ts` → `wallet/__tests__/balance.test.ts`. `balance-over-range.test.ts` goes with `balance-history` to `wallet/__tests__/`. Every other test follows its subject. Root tests for clock, dates, cookies (both), fetch-json and money stay in `lib/__tests__/`.

Import direction, checked for cycles between files. Cycles between folders are type-only.

- `account` → `wallet`, `user`
- `transaction` → `wallet`, `interest` (type-only: `SettledAccount`)
- `wallet` → `transaction` (constants), `interest` (constants)
- `interest` → `wallet`, `transaction`

## How imports are rewritten

Moving a whole file is a path change: `git mv`, then rewrite `@/lib/<old>` and the relative `./<old>` imports.

Splitting a file changes imports symbol by symbol: `import { Account, WalletName } from '@/lib/types'` becomes two imports. Do this with a throwaway ts-morph script in the scratchpad, run with `npx -p ts-morph -p tsx`. ts-morph is never added to `package.json`. The script takes a symbol → new module map and rewrites every import in `src/` and `e2e/`.

Places a plain `from` search misses:
- `jest.mock('@/lib/cookies')` in `Home.test.tsx` and `Home.managing-accounts.test.tsx`
- `jest.mock('@/lib/navigate')` in `SignedInUserSection.test.tsx`

These keep their paths because cookies and navigate stay at the root. Re-check them anyway after each phase: `rg "@/lib/" src e2e -g '!*.ts*' ; rg "jest.mock\('@/lib"`.

`e2e/` imports `@/lib/avatars`, `constants`, `cookies`, `money`, `transactions` and `types`, so it is in scope for every phase.

## Phases (one commit each)

1. **interest:** move `interest-settlement.ts` and its test into `interest/`. Create `interest/constants.ts` with `DAYS_PER_MONTH` and `SAVINGS_MONTHLY_RATE`.
2. **transaction:** move `transactions.ts`, `transaction-input.ts`, `transaction-rows.ts`, `transaction-row-builders.ts` and `transactions-by-account.ts`, plus their tests. `transaction-list-view.test.ts` goes with them. Split out `Transaction`, `TransactionType`, `TRANSACTION_TYPE`, `ALL_TRANSACTION_TYPES`, `INTEREST_MODE`, `DEPOSIT_SHARES` and `OverdraftError`.
3. **wallet:** `wallet-totals.ts` → `wallet/balance.ts`, plus `balance-history.ts` and `summarize-wallet.ts`. Split out the wallet types and constants.
4. **account:** move the five account files. Split out the account types, constants and errors.
5. **user:** move `user-provisioning.ts` and `session-user.ts`. Split out the user types, constants and errors.
6. **root cleanup:** move `AGOROT_PER_SHEKEL` into `money.ts`. Leave only `ValidationError` in `errors.ts`. Delete the now-empty root `types.ts` and `constants.ts`.
7. **mocks:** split `general.mocks.ts`, then delete it:
   - `account.mocks.ts`: `createMockAccount`, `createMockAccountUser`, `mockAccount`, `mockSiblingAccount`, `mockAccountUser`, `mockOwner`, `mockStrangerOwner`, `mockCreateAccountInput`, `mockAccountEdits`, `mockAccountSummary`, `mockSiblingAccountSummary`, `mockAccountsContext`
   - `user.mocks.ts`: `createMockUser`, `mockUser`, `mockCoParent`
   - `transaction.mocks.ts` (already exists): add `createMockTransaction`, `mockOpeningDeposit`, `mockTransactions`
   - `wallet.mocks.ts`: `createMockWallet`, `createMockWallets`, `createMockWalletSummary`, `mockWalletSummaries`, `mockWalletShares`

## Verification (every phase)

- `./node_modules/.bin/tsc --noEmit`, `./node_modules/.bin/eslint .` and `./node_modules/.bin/jest`, with output captured to a file. Baseline on `main` at 0f101a8: 152 suites and 833 tests pass. That count must not change.
- Verify `HEAD`, not the working tree: after each commit, `rtk proxy git status --porcelain` is empty.
- `git diff -M --stat main`: moved files show as renames, not as a delete plus an add.
- No changed values. After removing import lines and moved declarations, the diff has no `+`/`-` lines that change a string or number, and cookie names, `TRANSACTION_TYPE` values and `WalletName` literals are unchanged. Check with `git diff main -U0 | rg '^[+-]' | rg -v '^[+-]\s*(import|from|\}|export)'` and read what remains.
- After phase 6: `rg "@/lib/(types|constants)'" src e2e` returns nothing, and `rg "@/lib/errors'"` matches only `ValidationError` imports.
- Before the PR: `npm run test:e2e`, since e2e drivers import lib.

## Out of scope

- Renames other than `wallet-totals` → `balance`.
- Changes to `src/db`, `src/theme` or anything else outside `lib`.
- Any logic change.
