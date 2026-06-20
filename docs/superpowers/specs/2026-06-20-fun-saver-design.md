# fun-saver — Design Spec

> A playful savings app where each account holds wallets, and a savings wallet grows
> through daily interest. Built mobile-first with a gamified-but-disciplined tone.

- **Status:** approved design, ready for implementation planning
- **Date:** 2026-06-20
- **Stack:** Next.js 16 (App Router) · React 19 · MUI + Emotion (dynamic multi-theme) · React Query · JSON store behind a swappable DAL
- **Companion docs:** [`visual-palettes.md`](./visual-palettes.md) (palette C "Sunshine Quest"), [`mockup-home-screen.html`](./mockup-home-screen.html)

## Domain Language & Conventions

All code — variables, interfaces, methods, functions, files — uses the **domain language** below
(the ubiquitous language). The same word means the same thing in the UI, the API, the services,
and the store. Avoid generic technical placeholders (`data`, `item`, `manager`, `handler`,
`process`, `util`) when a domain term exists.

| Term            | Meaning                                                                 |
| --------------- | ---------------------------------------------------------------------- |
| **Account**     | A person who holds wallets (the user-facing & code term — never "kid"/"child") |
| **Wallet**      | A named purse under an account (never "pot")                            |
| **Transaction** | A single money movement: `deposit`, `withdrawal`, or `interest`         |
| **deposit**     | Money added by a person                                                 |
| **withdrawal**  | Money taken out by a person                                             |
| **interest**    | Money the app adds daily to a savings wallet                            |
| **balance**     | Current total in a wallet (deposits − withdrawals + interest)          |
| **principal**   | Deposits − withdrawals (the part that isn't interest)                  |
| **interestGain**| Total interest earned                                                   |
| **todayInterest** | Interest credited today (drives the coin row)                        |
| **agora / agorot** | Integer money unit; 1 ₪ = 100 agorot (the only unit code stores)    |
| **monthlyInterestRate** | A wallet's monthly interest rate (0.20 = 20%/month for Savings) |
| **settle / addDailyInterest** | Bring a wallet's interest up to date through a given day      |

**Names and comments express the _what_ and _why_, not the _how_.** The how is visible in the
code itself. So: name things for intent (`addDailyInterest`, not `processLoop`); write comments
only to capture business rules, the reason behind a non-obvious choice, or a constraint that the
code can't show (e.g. *why* interest rounds to the nearest agora, *why* withdrawals can't
overdraw) — never to restate what the next line plainly does.

---

## 1. Domain Model

Three entities, persisted in the JSON store. Balances are **derived from the transaction
ledger**, never stored.

### Account

| Field           | Type      | Notes                                          |
| --------------- | --------- | ---------------------------------------------- |
| `id`            | string    |                                                |
| `name`          | string    |                                                |
| `avatarId`      | string    | Id of a bundled kids-avatar SVG asset (see §3 Avatars) |
| `isActive`      | boolean   | `false` = soft-deleted (no hard delete)        |

### Wallet

| Field                 | Type   | Notes                                                     |
| --------------------- | ------ | -------------------------------------------------------- |
| `id`                  | string |                                                          |
| `accountId`           | string |                                                          |
| `name`                | string | e.g. Savings / Spending / Good deeds                     |
| `icon`                | string | emoji or token (🐷 / 🛍️ / 💛)                            |
| `monthlyInterestRate` | number | Per-wallet, configurable. Default `0`. Savings `0.20`    |
| `openedAt`            | string | ISO date — when the wallet started                       |
| `lastInterestDate`    | string | ISO date — last day interest was settled through         |

Wallets are **user-definable in the data model** (per-wallet rate) even though the MVP only
creates them via the auto-seed. This keeps future wallet creation/editing a no-migration add.

#### Default wallets (seeded for every account)

Every account is created with exactly these three wallets — the set agreed in the UI design phase
and shown on the home screen:

| Wallet         | `icon` | `monthlyInterestRate` | Role                                  |
| -------------- | ------ | --------------------- | ------------------------------------- |
| **Savings**    | 🐷     | `0.20` (20%/month)    | Hero card; the only wallet that earns interest |
| **Spending**   | 🛍️     | `0`                   | Everyday money                        |
| **Good deeds** | 💛     | `0`                   | Giving / donations                    |

These names are display labels resolved through i18n; the seeded wallet identity is stable
regardless of locale.

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

### Persistence: DAL (ports & adapters)

Persistence is hidden behind a **Data Access Layer**. Production code (services, API routes)
depends **only on the `DataStore` interface** — never on the file. Swapping to a real database
later means writing a new adapter and changing **one wiring point** (`getStore()`), with zero
changes to services, API, or UI.

**The port** (`src/db/DataStore.ts`) — pure, low-level CRUD only. No business logic, no interest,
no seeding. Async signatures (return `Promise`) so a real-DB adapter needs no signature changes.
All amounts are integer agorot.

```ts
interface DataStore {
  // accounts
  getAccounts(): Promise<Account[]>;
  getAccount(id: string): Promise<Account | null>;
  insertAccount(account: Account): Promise<void>;
  updateAccount(id: string, patch: Partial<Account>): Promise<Account>;
  // wallets
  getWalletsByAccount(accountId: string): Promise<Wallet[]>;
  getWallet(id: string): Promise<Wallet | null>;
  insertWallet(wallet: Wallet): Promise<void>;
  updateWallet(id: string, patch: Partial<Wallet>): Promise<Wallet>; // e.g. lastInterestDate
  // transactions
  getTransactionsByWallet(walletId: string): Promise<Transaction[]>;
  insertTransactions(transactions: Transaction[]): Promise<void>; // batch: interest days + deposits
}
```

**Adapters**

- `src/db/jsonStore.ts` — `JsonFileStore implements DataStore`. Owns file read/write, the
  serialized write queue, empty-file bootstrap, and `migrate()` (see §6).
- `src/db/memoryStore.ts` — `InMemoryStore implements DataStore`. For fast service/unit tests, no
  filesystem.
- `src/db/index.ts` — `getStore(): DataStore` factory. Returns the configured adapter (default
  JSON; env-selectable). **The only place an adapter is named.**

### Service layer (`src/lib`)

All business logic lives here and depends only on the injected `DataStore` — making it both
DB-agnostic and trivially testable against `InMemoryStore`. Reads settle interest before
returning (see §4).

```text
listAccounts(store)                          -> Promise<Account[]>
createAccount(store, input)                  -> Promise<Account>   // ids + account + 3 seeded wallets
updateAccount(store, id, patch)              -> Promise<Account>
getWalletsForAccount(store, accountId, asOf) -> Promise<WalletWithDerived[]>
getWallet(store, id, asOf)                   -> Promise<WalletWithDerived & { transactions }>
addTransaction(store, walletId, input, asOf) -> Promise<Transaction>  // settle, overdraft check, insert
```

Pure helpers (`addDailyInterest`, derivations, money conversion) take plain data and never touch
the store.

---

## 2. API Surface

Thin routes only: **validate → call a `src/lib` service → return JSON**. Services receive the
`DataStore` from `getStore()` and never touch persistence directly. Every wallet read or mutation
runs interest settlement first, so balances are always current.

| Method & route                     | Purpose                                                                 |
| ---------------------------------- | ----------------------------------------------------------------------- |
| `GET /api/accounts`                | List accounts (menu avatars)                                            |
| `POST /api/accounts`               | Create account `{ name, avatarId }`; auto-seeds 3 wallets               |
| `PATCH /api/accounts/:id`          | Edit `{ name?, avatarId?, isActive? }`; `isActive:false` = delete       |
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
QueryClientProvider → LocaleProvider → ThemeProvider (themeId + direction)
  → Emotion CacheProvider (rtl/ltr) → MUI ThemeProvider
```

### i18n (`src/i18n/`)

- `he.json` / `en.json` dictionaries — **all UI copy is keyed**, no hardcoded strings.
- `LocaleProvider` + `useTranslation()` → `t('key')`.
- Locale + direction persisted in `localStorage`; **default `he` / `rtl`** (matches the mockup).
- Sets `<html dir>` and MUI `theme.direction`. RTL uses `stylis-plugin-rtl` via the Emotion cache.
- MVP ships the `he`/`rtl` default; the user-facing `LanguageToggle` (he↔en) is exposed via the
  Menu in a later phase (see Future Phases).

### Theme (`src/theme/`) — dynamic, multi-theme

Themes are a **registry**, not a single hardcoded palette, so adding or switching a theme is easy.

- Each theme is one `ThemeTokens` object (colors, pot accents, Fredoka/Rubik typography, radii,
  shadows) in `src/theme/themes/` — `sunshineQuest.ts`, `mintLedger.ts`, `sunnyModern.ts`
  (palettes C / A / B from `visual-palettes.md`).
- `ThemeTokens` is a shared interface, so **adding a theme = drop in one token file and register
  it** — no component changes.
- `src/theme/registry.ts` maps `themeId → ThemeTokens`; `buildMuiTheme(tokens, direction)`
  produces the MUI theme.
- `ThemeProvider` holds the selected `themeId` (persisted in `localStorage`, default
  `sunshine-quest`) + direction, exposes `useThemeSwitch()`, and selects the matching Emotion
  cache (rtl/ltr).
- Components consume **MUI theme tokens only** (no inline hex), so switching theme instantly
  restyles the whole app. MVP ships the default theme; the user-facing `ThemePicker` is exposed
  via the Menu in a later phase (see Future Phases).

### Data layer (`src/hooks/`)

- MVP queries: `useAccounts`, `useWallets(accountId)`. (`useWallet(id)` arrives with the ledger
  phase.)
- MVP mutations: `useCreateAccount`, `useAddTransaction` — invalidate relevant queries on success.
  (`useUpdateAccount` arrives with the Menu phase; the `PATCH` API already exists.)
- All fetches use `{ cache: 'no-store' }` (Next 16 caching pitfall).
- Active account id, selected `themeId`, and locale all persisted in `localStorage`; active
  account defaults to the first, or **none → empty state**.
- Every hook exposes `isLoading` / `isError` → skeletons + error banners.

### Avatars (`src/avatars/` + `public/avatars/`)

- **Finalized:** **20 painted kid-avatar SVGs** (boys + girls, SVGRepo free-for-commercial pack)
  are **bundled offline** at `public/avatars/kid-01.svg … kid-20.svg`. No runtime network, no
  generative library. Stored per account as `avatarId` = the filename stem (e.g. `kid-07`).
- `AvatarPicker` (used by `AccountForm`) renders the bundled set as a **single grid** (no category
  labels) on colored circles; the child taps one. Layout:
  [`mockup-avatar-picker.html`](./mockup-avatar-picker.html) (app-gradient page, purple "create"
  CTA — consistent with the home screen).
- **Extensible:** more avatars (e.g. profession characters) are added later by dropping SVGs into
  `public/avatars/` — no code change beyond the asset list.
- **License:** SVGRepo assets are free for commercial use; credit on an "About" line if a chosen
  asset requires attribution.

### Routing & component tree

Each component lives in its own folder (`Impl.tsx` + `Impl.test.tsx` + `constants.ts` +
`index.ts`), under 200 lines, named exports only, explicit return types.

**MVP scope** — one route:

- `/` → `page.tsx` (dashboard). When zero accounts → **empty state: "Create your first
  account"** with `AccountForm` (name + `AvatarPicker`). Otherwise composes:
  - `Ribbon` — top bar: ☰ menu button (top-start) · account **name** (centered, name only) ·
    account **avatar** (top-end)
  - `WalletHero` — savings hero (balance, `CoinRow` today-interest, deposits/gain breakdown)
  - `WalletList` → `WalletCard`
  - `NewActionButton` → `TransactionDrawer` (deposit/withdrawal form)
- Shared presentational: `Money` (₪ lower-left rendering), `CoinRow` (full/half coin SVGs)

The always-visible **Menu** (account switch/create/edit, theme, language) and the **per-wallet
ledger** are deferred — see Future Phases.

---

## 4. Interest Math + Display Rules

### Accrual rule

- `dailyRate = wallet.monthlyInterestRate / 30` (flat — e.g. ≈0.667%/day for 20%/month).
  Explainable to a child; accepts a minor compounding overshoot over the month.
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

### The interest module (self-contained & pure)

All interest math lives in **its own dedicated module, `src/lib/interest/`**, with **zero
dependencies** on the store/DAL, API, React, MUI, or the clock. It takes plain data in and returns
plain data out — which is exactly what makes every calculation independently and exhaustively unit
testable for accuracy. Nothing else in the app does interest arithmetic.

The math is broken into small, individually-testable primitives:

```text
dailyRate(monthlyRate)                            -> number  // monthlyRate / 30
interestForDay(closingBalanceAgorot, monthlyRate) -> number  // one day, rounded to nearest agora
addDailyInterest(wallet, transactions, asOf)      -> Transaction[]  // replays days -> new interest txns
```

- `addDailyInterest` (the public entry point) replays each day from `lastInterestDate + 1` through
  `asOf`, applying `interestForDay` to the previous day's closing balance, and returns the new
  `interest` transactions. **Takes an explicit `asOf` — never reads the clock internally.**
- **Idempotent:** re-running for an already-settled day returns `[]`.
- **Settlement is lazy (no cron):** the service layer calls `addDailyInterest` on wallet read and
  before any new transaction, persists the results via the DAL, and advances `lastInterestDate`.
  The module itself performs no I/O.

`src/lib/interest/__tests__/` exhaustively covers the primitives and `addDailyInterest`: rate
derivation, single-day rounding, multi-day catch-up, mid-month deposits, withdrawals lowering
later interest, zero/negative balances, and idempotency.

---

## 5. Testing Approach (TDD-driven)

There is **no upfront test catalog** — TDD produces the tests as we build. Each unit follows
**red → green → refactor**: write a failing test, write the minimum code to pass, refactor, repeat.
We work **outside-in**: start from one failing end-to-end acceptance test, then drive the units
needed to make it pass.

### First acceptance test (E2E, written first, fails first)

Load the app → create an account (name + pick an avatar) → assert the rendered **name**, the
**chosen avatar**, and the **numbers all read 0** initially (new account's wallets are empty).
This drives the empty state, the account-creation flow, and the first dashboard render.

### First unit test

The smallest possible step: the app renders a root `div`. Then continue TDD outward — each new
MVP behavior (interest math, derivations, money formatting, account creation, transactions,
overdraft) is introduced by its own failing test first.

### Infrastructure decisions (the parts that are design, not test content)

- **Unit / component:** Jest + Testing Library. Each component has its own test file;
  `data-testid` + content from `constants.ts`; `render()` in `beforeEach`; `getByTestId`. React
  Query hooks mocked; shared mocks centralized in `__mocks__/`.
- **E2E:** Puppeteer via a `test:e2e` script that boots `next start` on a test port, runs, tears
  down. **Isolated store** via `FUNSAVER_DATA_PATH`; **deterministic clock** via an optional
  `FUNSAVER_NOW` override the store reads.
- **Deterministic time keystone:** all interest logic is pure and takes an explicit `asOf` — the
  store passes the real clock, tests pass fixed dates. This is what makes interest behavior
  testable without flakiness.

---

## 6. Seed & Migration Path

**Store format** — one JSON file (default `src/db/data.json`, overridable via
`FUNSAVER_DATA_PATH`):

```json
{ "version": 1, "accounts": [], "wallets": [], "transactions": [] }
```

All of the following are **internal to the `JsonFileStore` adapter** (§1) — bootstrap, write
safety, and migration live behind the `DataStore` interface, so a future DB adapter brings its own
equivalents (schema, transactions, migrations) without affecting services or API.

- **Bootstrapping:** on first read, if the file is missing, write the **empty** structure above.
  No demo accounts. First run shows the empty state ("Create your first account").
- **Account creation** is the entry point and auto-seeds the 3 default wallets (§1)
  (Savings 20%/mo · Spending 0 · Good deeds 0).
- **Write safety:** reads are read-modify-write; writes are serialized through a small in-process
  queue/mutex so concurrent API requests cannot corrupt the file.
- **Versioning / migration:** the top-level `version` drives a `migrate(data)` step run on every
  load — a registry of `version → version+1` transforms. v1 has none yet, but the seam exists so
  future shape changes migrate old data forward.
- **Git & reset:** the runtime data file is **gitignored** (mutable state); structure/defaults
  live in code. Test/E2E resets write fixture data to a `FUNSAVER_DATA_PATH` location.

---

## Future Phases (noted, not yet planned)

Mentioned here so the MVP design leaves room for them; each gets its own brainstorm → spec → plan
when we reach it.

- **Full-screen Menu** *(design done — see [`mockup-menu.html`](./mockup-menu.html))*. Opened from
  a **hamburger button in the top-start corner** (placement A) that **spins 180° as it morphs into
  ✕** (animation B); the menu **fades + scales up** from that corner. Layout is **inline sections**
  (C), all visible at once:
  - **Accounts** — avatar chips to **switch** + a ＋ to **create** a new account.
  - **Edit account** — affordance still open (options: edit-badge on avatar · tap-avatar→sheet ·
    "manage accounts" row); decide when building.
  - **Theme** — theme swatches (inline `ThemePicker`), instant switch.
  - **Language** — עברית / EN segmented toggle (inline `LanguageToggle`).
  The underlying capabilities already exist in MVP infra (i18n, dynamic theme registry, account API
  incl. `PATCH`); this phase wires up the UI controls.
- **Per-wallet ledger.** A screen showing one wallet's full transaction history (deposits,
  withdrawals, daily interest). The data is already available via `GET /api/wallets/:id`; this
  phase needs the **UX for navigating there** (e.g. tapping a wallet card) and the ledger layout.

## Assumptions

- ILS only; no multi-currency.
- Single trusted local user (a parent) — no auth in MVP.
- "Today" is the server's local date; interest settles per calendar day.
- Withdrawals cannot overdraw a wallet.
