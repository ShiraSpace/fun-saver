# fun-saver — Design Spec

> A playful savings app where each account holds wallets, and a savings wallet grows
> through daily interest. Built mobile-first with a gamified-but-disciplined tone.

- **Status:** approved design, ready for implementation planning
- **Date:** 2026-06-20
- **Stack:** Next.js 16 (App Router) · React 19 · MUI + Emotion · React Query · file-backed JSON store
- **Companion docs:** [`visual-palettes.md`](./visual-palettes.md) (palette C "Sunshine Quest"), [`mockup-home-screen.html`](./mockup-home-screen.html)

## Terminology

The user-facing and code term for a person is **Account** — never "kid" or "child". A wallet
is a **Wallet** (never "pot"). A money movement is a **Transaction**.

---

## 1. Domain Model

Three entities, persisted in the JSON store. Balances are **derived from the transaction
ledger**, never stored.

### Account

| Field           | Type      | Notes                                          |
| --------------- | --------- | ---------------------------------------------- |
| `id`            | string    |                                                |
| `name`          | string    |                                                |
| `avatarInitial` | string    | Defaults to first letter of `name`             |
| `isActive`      | boolean   | `false` = soft-deleted (no hard delete)        |

### Wallet

| Field                 | Type   | Notes                                                     |
| --------------------- | ------ | -------------------------------------------------------- |
| `id`                  | string |                                                          |
| `accountId`           | string |                                                          |
| `name`                | string | e.g. Savings / Spending / Good deeds                     |
| `icon`                | string | emoji or token (🐷 / 🛍️ / 💛)                            |
| `monthlyInterestRate` | number | Per-wallet, configurable. Default `0`. Savings `0.15`    |
| `openedAt`            | string | ISO date — when the wallet started                       |
| `lastInterestDate`    | string | ISO date — last day interest was settled through         |

Wallets are **user-definable in the data model** (per-wallet rate) even though the MVP only
creates them via the auto-seed. This keeps future wallet creation/editing a no-migration add.

### Transaction

| Field        | Type                                       | Notes                          |
| ------------ | ------------------------------------------ | ------------------------------ |
| `id`         | string                                     |                                |
| `walletId`   | string                                     |                                |
| `type`       | `'deposit' \| 'withdrawal' \| 'interest'`  |                                |
| `amount`     | number                                     | **Integer agorot** (1 ₪ = 100) |
| `occurredAt` | string                                     | ISO date                       |

### Derived values (computed, never stored)

- `balance` = Σ deposits − Σ withdrawals + Σ interest
- `principal` = Σ deposits − Σ withdrawals
- `interestGain` = Σ interest
- `todayInterest` = the `interest` transaction(s) dated today

### Store interface (`src/db`)

Framework-agnostic. Reads settle interest before returning (see §4).

```ts
listAccounts(): Account[]
createAccount(input: { name: string; avatarInitial?: string }): Account // auto-seeds 3 wallets
updateAccount(id: string, patch: Partial<Pick<Account, 'name' | 'avatarInitial' | 'isActive'>>): Account
getWalletsForAccount(accountId: string): WalletWithDerived[]
getWallet(id: string): WalletWithDerived & { transactions: Transaction[] }
addTransaction(walletId: string, input: { type: 'deposit' | 'withdrawal'; amount: number }): Transaction
```

---

## 2. API Surface

Thin routes only: **validate → call a `src/lib` function → return JSON**. Every wallet read or
mutation runs interest settlement first, so balances are always current.

| Method & route                     | Purpose                                                                 |
| ---------------------------------- | ----------------------------------------------------------------------- |
| `GET /api/accounts`                | List accounts (dock avatars)                                            |
| `POST /api/accounts`               | Create account `{ name, avatarInitial? }`; auto-seeds 3 wallets         |
| `PATCH /api/accounts/:id`          | Edit `{ name?, avatarInitial?, isActive? }`; `isActive:false` = delete  |
| `GET /api/accounts/:id/wallets`    | Wallets + derived `balance` / `principal` / `interestGain` / `todayInterest` |
| `GET /api/wallets/:id`             | One wallet + its transaction ledger                                     |
| `POST /api/wallets/:id/transactions` | Add `deposit` / `withdrawal`                                           |

**Rules**

- **Amounts** are entered in shekels in the UI and converted to **integer agorot at the API
  boundary**. The lib layer only ever sees agorot.
- `POST .../transactions` body: `{ type: 'deposit' | 'withdrawal', amount: number }`.
  Validation: `amount > 0`, valid `type`, wallet exists.
- **Overdraft:** a `withdrawal` greater than the current (interest-settled) balance is rejected
  with `400` ("not enough in this wallet").
- **Status codes:** `400` invalid input / overdraft, `404` unknown account/wallet, `200` reads,
  `201` created transaction.
- **Errors** use a consistent `{ error: string }` shape so the frontend can surface the message
  (nothing swallowed silently).

---

## 3. Frontend Architecture

**New dependencies:** `@mui/material` + `@emotion/*` + `stylis-plugin-rtl`,
`@tanstack/react-query`.

### Providers

A client `Providers` wrapper mounted in `src/app/layout.tsx`:

```
QueryClientProvider → LocaleProvider → Emotion CacheProvider (rtl/ltr) → MUI ThemeProvider
```

### i18n (`src/i18n/`)

- `he.json` / `en.json` dictionaries — **all UI copy is keyed**, no hardcoded strings.
- `LocaleProvider` + `useTranslation()` → `t('key')`.
- Locale + direction persisted in `localStorage`; **default `he` / `rtl`** (matches the mockup).
- Sets `<html dir>` and MUI `theme.direction`. RTL uses `stylis-plugin-rtl` via the Emotion cache.
- A `LanguageToggle` (he↔en) lives in settings.

### Theme (`src/theme/`)

Palette C tokens from `visual-palettes.md` (colors, Fredoka/Rubik typography, radii, shadows).
Single source of truth — no inline hex in components.

### Data layer (`src/hooks/`)

- Queries: `useAccounts`, `useWallets(accountId)`, `useWallet(id)`.
- Mutations: `useAddTransaction`, `useCreateAccount`, `useUpdateAccount` — invalidate relevant
  queries on success.
- All fetches use `{ cache: 'no-store' }` (Next 16 caching pitfall).
- Active account id persisted in `localStorage`; defaults to the first account, or **none →
  empty state**.
- Every hook exposes `isLoading` / `isError` → skeletons + error banners.

### Routing & component tree

Each component lives in its own folder (`Impl.tsx` + `Impl.test.tsx` + `constants.ts` +
`index.ts`), under 200 lines, named exports only, explicit return types.

- `/` → `page.tsx` (dashboard). When zero accounts → **empty state: "Create your first
  account."** Otherwise composes:
  - `AccountDock` — avatars + settings gear; switches active account
  - `WalletHero` — savings hero (balance, `CoinRow` today-interest, deposits/gain breakdown)
  - `WalletList` → `WalletCard`
  - `NewActionButton` → `TransactionDrawer` (deposit/withdrawal form)
- `/wallet/[id]` → `WalletLedger` (full transaction history)
- `/settings` → `AccountForm` (create/edit account) + `LanguageToggle`
- Shared presentational: `Money` (₪ lower-left rendering), `CoinRow` (full/half coin SVGs)

---

## 4. Interest Math + Display Rules

### Accrual rule

- `dailyRate = wallet.monthlyInterestRate / 30` (flat — e.g. 0.5%/day for 15%/month).
  Explainable to a child; accepts a minor (~1%/month) compounding overshoot.
- For each day `D` from `lastInterestDate + 1` through today:
  `interest = closingBalance(D-1) × dailyRate`, written as **one `interest` transaction dated `D`**.
- Interest accrues **only on a positive balance** (balance ≤ 0 → 0).
- **Day-of-deposit weighting is automatic:** a deposit only joins the running balance on its own
  date, so a mid-month top-up simply earns fewer days that month. No per-deposit cohorts.

### Precision & rounding

- Amounts stored as **integer agorot** to avoid float drift. Each daily interest credit is
  rounded to the nearest agora.
- **Display** rounds to the nearest **half-shekel**. The coin row shows `floor(todayInterest)`
  full coins + one half-coin when the half-shekel remainder is 0.5, and hides entirely when the
  rounded value is 0.

### Settlement (lazy, no cron)

- Pure function `addDailyInterest(wallet, transactions, asOf)` in `src/lib/interest.ts`:
  input ledger → output new `interest` transactions. **Takes an explicit `asOf` date — never
  reads the clock internally** (testability).
- The store calls it on wallet read and before any new transaction, persists the results, and
  advances `lastInterestDate`.
- **Idempotent:** re-running for an already-settled day produces nothing.

---

## 5. Testing Strategy

TDD throughout (failing test → implement → green). **Keystone:** all interest logic is pure and
takes an explicit `asOf` — the store passes the real clock, tests pass fixed dates.

1. **Lib unit tests** (`src/lib/__tests__/`) — highest density:
   - `addDailyInterest`: single deposit over N days; mid-month deposit earns fewer days;
     withdrawal lowers later interest; zero/negative balance earns nothing; idempotency;
     multi-day catch-up after a gap; agorot rounding.
   - Derivations: `balance`, `principal`, `interestGain`, `todayInterest`.
   - Money helpers: shekel↔agorot conversion; half-shekel rounding; coin breakdown.
2. **Store tests** — `addTransaction` settles interest first; overdraft rejected;
   `createAccount` auto-seeds 3 wallets.
3. **API route tests** — input validation, status codes (`400`/`404`/`201`), `{ error }` shape.
4. **Component tests** — own file per component; `data-testid` + content from `constants.ts`;
   `render()` in `beforeEach`; `getByTestId`. Cover `Money`, `CoinRow`, `WalletCard`,
   `TransactionDrawer` (submit + overdraft error surfaced), loading/error states, empty state.
   React Query hooks mocked; shared mocks centralized in `__mocks__/`.
5. **i18n test** — every key present in both `he.json` and `en.json`.
6. **E2E (Puppeteer)** — `test:e2e` script boots `next start` on a test port, runs, tears down.
   - **Isolated store:** path via `FUNSAVER_DATA_PATH`, seeded fresh per suite.
   - **Deterministic clock:** store reads an optional `FUNSAVER_NOW` override.
   - **Flows:** (1) deposit updates balance; (2) withdrawal succeeds / overdraft blocked;
     (3) switch account; (4) create account → 3 seeded wallets; (5) language toggle flips copy
     and `dir`.

---

## 6. Seed & Migration Path

**Store format** — one JSON file (default `src/db/data.json`, overridable via
`FUNSAVER_DATA_PATH`):

```json
{ "version": 1, "accounts": [], "wallets": [], "transactions": [] }
```

- **Bootstrapping:** on first read, if the file is missing, write the **empty** structure above.
  No demo accounts. First run shows the empty state ("Create your first account").
- **Account creation** is the entry point and auto-seeds the 3 default wallets
  (Savings 15%/mo · Spending 0 · Good deeds 0).
- **Write safety:** reads are read-modify-write; writes are serialized through a small in-process
  queue/mutex so concurrent API requests cannot corrupt the file.
- **Versioning / migration:** the top-level `version` drives a `migrate(data)` step run on every
  load — a registry of `version → version+1` transforms. v1 has none yet, but the seam exists so
  future shape changes migrate old data forward.
- **Git & reset:** the runtime data file is **gitignored** (mutable state); structure/defaults
  live in code. Test/E2E resets write fixture data to a `FUNSAVER_DATA_PATH` location.

---

## Assumptions

- ILS only; no multi-currency.
- Single trusted local user (a parent) — no auth in MVP.
- "Today" is the server's local date; interest settles per calendar day.
- Withdrawals cannot overdraw a wallet.
