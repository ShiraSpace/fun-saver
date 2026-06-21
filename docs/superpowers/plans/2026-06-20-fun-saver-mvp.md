# fun-saver MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the fun-saver MVP — a kids savings app where you create an account (name + avatar) and a dashboard shows three wallets, with the savings wallet earning daily interest.

**Architecture:** Outside-in. A swappable DAL (`DataStore` port + JSON/in-memory adapters) underpins pure, framework-free business logic (interest, derivations, money) and a service layer; thin Next.js route handlers expose it; a React-Query + MUI + i18n frontend renders one dashboard route. One failing Puppeteer E2E anchors the work; everything else is red→green→refactor units.

**Tech Stack:** Next.js 16 (App Router) · React 19 · TypeScript (strict) · MUI + Emotion · `@tanstack/react-query` · Jest + Testing Library · Puppeteer.

## Global Constraints

- **Next.js 16 App Router.** Route handlers: dynamic params are async — `const { id } = await ctx.params`. Return `Response.json(body, { status })`. This Next.js differs from training data — read `node_modules/next/dist/docs/01-app/` before writing route/layout code.
- **TypeScript strict.** Every function has an explicit return type (`JSX.Element`, `void`, `Promise<X>`, etc.).
- **Single quotes** everywhere. **Named exports only** (no default exports) — except `src/app/**` Next.js files that *require* a default export (`page.tsx`, `layout.tsx`).
- **Files < 200 lines.** If one grows past, split by responsibility.
- **No hardcoded values in logic** — constants live in a `constants.ts` (per-component or `src/lib/constants.ts`).
- **No inline hex / no ad-hoc `fontSize`** in components — colors and type come from the MUI theme only.
- **Domain language** (ubiquitous): `Account`, `Wallet`, `Transaction`, `deposit | withdrawal | interest`, `balance`, `principal`, `interestGain`, `todayInterest`, `agorot`, `monthlyInterestRate`, `addDailyInterest`. Never `data`/`item`/`manager`/`handler`/`util` when a domain term fits. Comments explain *why*, not *what*.
- **Money:** all stored/computed amounts are **integer agorot** (1 ₪ = 100 agorot). Shekels↔agorot conversion happens only at the API boundary and in display helpers.
- **Dates:** day-granular ISO strings `'YYYY-MM-DD'` for `openedAt`, `lastInterestDate`, `occurredAt`, and `asOf`.
- **Pure modules never read the clock.** Interest/derivations take an explicit `asOf`. Only `src/lib/clock.ts` reads time (honouring the `FUNSAVER_NOW` override); only the DAL reads the filesystem (honouring `FUNSAVER_DATA_PATH`).
- **Components:** each in its own folder — `Name.tsx` + `Name.test.tsx` + `constants.ts` + `index.ts`; `data-testid` + copy from `constants.ts`; `render()` in `beforeEach`; query via `getByTestId`.
- **Errors surface to the user** (`{ error: string }` from the API; error banners in UI) — nothing swallowed. Loading states shown while fetching.
- **i18n:** default locale `he`, direction `rtl`. All UI copy keyed in `src/i18n/he.json` + `en.json`; no hardcoded strings in components.
- **Spec:** `docs/superpowers/specs/2026-06-20-fun-saver-design.md` is the source of truth.

---

## Decisions (updated 2026-06-21)

Where these differ from the task list below, these win.

- **TDD outside-in:** acceptance E2E `e2e/create-account.e2e.ts` now asserts the first step — clicking the empty-state CTA opens the create-account view (`account-name-input`) — and is GREEN. The remaining journey (fill the form → dashboard) is the next acceptance step. Commit only on explicit approval.
- **Code conventions:** no comments; server/logic/test files kebab-case, components + their tests PascalCase; `@/` alias. **Domain language everywhere** — names say what/why, not how (e.g. driver `waitForPigToOink()` / `waitForCtaToLift()` hide the CSS; the pig is `pig`, not `brand`).
- **E2E:** TypeScript via `tsx` + `node:test`. Per-component drivers (composition): `session.ts` (lifecycle + `click`/`hover`/`box`/`computedStyle`/`styleOf`/`waitForStyle`/`exists`/`hasVerticalScroll`) + `menu`/`header`/`empty-state`/`create-account` drivers; `use-driver.ts` returns `{ session, menu, header, emptyState, createAccount }` (one server+browser per file). Keep drivers lean — add methods only when a test needs them. `session` = browser mechanism; drivers = app DSL on top, hiding CSS specifics (test-ids stay in each component's `constants.ts`). Shared CSS test helpers in `e2e/support/css-color.ts` (`hexToRgb`, `gradientToRgb`). Drivers expose `exists()` delegating to `session.exists(testId)`.
- **Seeding:** `useDriver(state: Partial<StoreData>)` seeds via the real store API — `rm` the data file, then `new JsonFileStore(server.dataPath).insertAccount(...)` per account (cross-process: the test process and the `next start` app share only the data file, so an in-memory store can't be used to seed). `server.dataPath` exposes the path. `StoreData` lives on the **port** (`src/db/data-store.ts`), not the adapter.
- **Tests:** visual = computed-style/bbox in a real browser; jsdom for behaviour only. Test-ids from each component's `constants.ts`. Shared mock data in `src/test-support/fixtures.ts` (`ACCOUNT`, `CREATE_ACCOUNT_INPUT`) — reuse across unit + E2E. `test:visual` runs all `e2e/*.visual.ts`; both `test:*` build first.
- **App:** RTL/Hebrew; Emotion RTL cache registry in `src/app/providers.tsx`. Shared `ActionButton` is the only main-action style — reuse for all primary actions; it is the mockup's gradient pill (`GRADIENTS.actionButton` = `#8A3AAE → #6B2C8E`) with a double shadow (base `0 5px 0 primaryShadow` + glow `0 10px 18px primaryGlow`) and carries the hover-lift + active-press (mobile-tap) animation (offsets/timing in `ActionButton/constants.ts`).
- **Theming (context-driven, swappable):** colors/gradients are NOT imported statically by components — they come from a context theme. `src/theme/theme-tokens.ts` defines the `ThemeTokens` contract (`colors`, `gradients`) and augments Emotion's `Theme` so the `theme` prop is typed app-wide. Raw values live in `palette.ts` (`COLORS`, incl. `primary #6B2C8E`, `primaryGradientTop`, `primaryShadow`, `primaryGlow`) + `gradients.ts` (`GRADIENTS.screen`, `GRADIENTS.actionButton`) + `typography.ts` (`TYPE_SCALE`, header = `h2`); `themes/sunshine-quest.ts` composes them into the one `ThemeTokens`; `registry.ts` maps `themeId → tokens` (`getThemeTokens(id)`, default `'sunshine-quest'`, throws on unknown). `providers.tsx` serves it via `@emotion/react` `ThemeProvider`. Styled components read `({ theme }) => theme.colors/​gradients...` — switching themes = swap the active id. Jsdom tests render through the theme-aware `src/test-support/render.tsx` helper.
- **Screen surface:** shared `Screen` (`src/components/Screen`) gives full-height centering + the sunset background gradient (reads `theme.gradients.screen`); used by `EmptyState` and `CreateAccount`. **RTL caveat:** `stylis-plugin-rtl` mirrors `0%`/`100%` color-stop positions and flattens gradients — author gradients **without** explicit stop percentages (e.g. `actionButton` omits the default `180deg`).
- **Avatars:** `public/avatars/kid-01..20.svg` via `next/image` `unoptimized`.
- **Domain:** `AccountsStore` holds a `DataStore`. DAL: `DataStore` port (`insertAccount`, `listAccounts`) + `StoreData`; adapters `InMemoryStore` (unit tests) and `JsonFileStore` (file-backed, bootstrap-on-read, `FUNSAVER_DATA_PATH`); `getStore()` factory memoized per path. Page reads `getStore().listAccounts()` directly for now — **note:** service-layer `listActiveAccounts` (active-only filter, per spec) still owed.
- **Flow:** `page.tsx` is the Router — account → `Account` (wraps `Header`); `?create` search param → `CreateAccount`; else `EmptyState`. First-account entry is the empty-state CTA (`צור חשבון`), a styled `Link` to `/?create=1` (the server page decides the view). Clicking the CTA plays the pig oink animation and defers navigation until the pig's `animationend` (`useOinkThenNavigate` — no timer). Component tests that render `useRouter` consumers rely on the centralized `__mocks__/next/navigation.ts`.
- **Mobile dev:** `npm run dev:mobile` + `allowedDevOrigins`.

## Progress (updated 2026-06-21)

- **Done:** UI shell (Menu, Header, EmptyState, ActionButton) + theme; DAL (`DataStore`/`InMemoryStore`/`JsonFileStore`/`getStore`); `page.tsx` Router (Account ↔ CreateAccount ↔ EmptyState) account- and `?create`-driven via `useDriver` seeding. This session: `Account` (wraps Header) + `CreateAccount` (placeholder `account-name-input`) + shared `Screen` surface with the sunset gradient; `ActionButton` hover-lift/active-press animation; pig oink on CTA click with navigation deferred to `animationend` (`useOinkThenNavigate`). Jest 23/23 green · visual E2E 15/15 green · acceptance E2E 1/1 green.
- **This session (theming):** upgraded `ActionButton` to the mockup's gradient pill + double shadow, then made theming context-driven — introduced `ThemeTokens` + `themes/sunshine-quest` + `registry.getThemeTokens` + Emotion `ThemeProvider` in `providers.tsx`; `ActionButton`/`Screen` now read colors/gradients off the `theme` prop, and jsdom tests render via `test-support/render.tsx`. Jest 26/26 green · theme-dependent visual E2E green · `tsc` clean.
- **Test status:** acceptance E2E `e2e/create-account.e2e.ts` GREEN for step 1 (CTA opens the create-account view). The create-account form itself is still a bare name input — not yet wired to the service.
- **Mockup source of truth:** the create-account form must match `docs/superpowers/specs/mockup-avatar-picker.html` — title `צור חשבון` (h2, white), name as a white card with an inline `שם:` label + input (label `#8A7AA7`, value `#3a1f5a`), a 4-col grid of 20 circular avatars each with a per-avatar background colour (`kid-01 #7AB7E0 … kid-20 #7CC9B0`), selected = white border + `0 0 0 4px primary` ring + hover lift, and the gradient-pill CTA `✓ יצירת חשבון` (reuse `ActionButton`).
- **Next — "wire submit first" increment (inside-out, TDD per unit, one at a time):**
  1. ✅ `ActionButton` gradient pill + theme system (done this session).
  2. `POST /api/accounts` route — jest on the exported `POST` handler (temp-path store) → `201` + created `Account`, persisted; thin handler delegates to `new AccountsStore(getStore()).createAccount(...)`.
  3. `AvatarPicker` (`src/components/AvatarPicker/`) — single-select grid of 20 avatars (per-avatar bg, selected ring), `onSelect(avatarId)`; visual test for grid/circle/ring.
  4. Extend the existing `CreateAccount` component — title + inline-label name field + `AvatarPicker` + CTA; submit with name+avatar → create (native `fetch` hook, not react-query) → `router.push('/')`; CTA disabled until both present.
  5. Extend acceptance E2E to the full journey: fill → pick → submit → dashboard shows the name. (Dashboard's 3 zero wallets deferred — needs `Wallet` types/seeding not yet present.)
  6. Service layer in `src/lib`: `listActiveAccounts` (active-only filter) so the page stops reading the raw store; generalize `useDriver` seeding as `StoreData` grows (wallets, transactions).

---

## File Structure

```
src/
  lib/
    types.ts                 domain types (Account, Wallet, Transaction, WalletWithDerived)
    constants.ts             DEFAULT_WALLETS, AGOROT_PER_SHEKEL, DAYS_PER_MONTH
    ids.ts                   newId() — wraps crypto.randomUUID
    clock.ts                 today() — FUNSAVER_NOW-aware 'YYYY-MM-DD'
    dates.ts                 addDays(iso, n), eachDayExclusive(start, end)
    money.ts                 shekelsToAgorot, agorotToShekels, coinBreakdown
    derivations.ts           balance, principal, interestGain, todayInterest
    interest/
      dailyRate.ts           dailyRate(monthlyRate)
      interestForDay.ts      interestForDay(closingBalanceAgorot, monthlyRate)
      addDailyInterest.ts    addDailyInterest(wallet, transactions, asOf)
      index.ts               re-exports
      __tests__/             pure interest tests
    settle.ts                settleWallet(store, wallet, asOf)
    accounts.ts              listAccounts, createAccount, updateAccount
    wallets.ts               getWalletsForAccount, getWallet
    transactions.ts          addTransaction
    __tests__/               lib + service tests
  db/
    DataStore.ts             DataStore interface
    memoryStore.ts           InMemoryStore
    jsonStore.ts             JsonFileStore (bootstrap, queue, migrate)
    index.ts                 getStore()
    __tests__/
  app/
    layout.tsx               wraps <Providers>
    providers.tsx            QueryClient + Locale + Theme providers
    page.tsx                 dashboard route (empty state vs dashboard)
    api/
      accounts/route.ts                 GET, POST
      accounts/[id]/route.ts            PATCH
      accounts/[id]/wallets/route.ts    GET
      wallets/[id]/route.ts             GET
      wallets/[id]/transactions/route.ts POST
  theme/
    types.ts                 ThemeTokens
    themes/sunshineQuest.ts  palette C tokens
    registry.ts              themeId -> ThemeTokens
    buildMuiTheme.ts         tokens + direction -> MUI Theme (typography scale)
    ThemeProvider.tsx        selected theme + emotion cache
  i18n/
    he.json, en.json
    LocaleProvider.tsx       LocaleProvider + useTranslation
  hooks/
    apiClient.ts             fetchJson (cache: 'no-store')
    useAccounts.ts, useWallets.ts, useCreateAccount.ts, useAddTransaction.ts
  components/
    Money/  CoinRow/  AvatarPicker/  AccountForm/  Ribbon/
    WalletHero/  WalletCard/  WalletList/  NewActionButton/  TransactionDrawer/
e2e/
  createAccount.e2e.mjs      Puppeteer acceptance test
  run-e2e.mjs                boot next start + run + teardown
public/avatars/kid-01..20.svg  (already bundled)
```

---

## Task 1: Project setup — dependencies, scripts, gitignore, types & constants

**Files:**
- Modify: `package.json` (deps + scripts)
- Modify: `.gitignore`
- Create: `src/lib/types.ts`, `src/lib/constants.ts`, `src/lib/ids.ts`

**Interfaces:**
- Produces: domain types `Account`, `Wallet`, `Transaction`, `WalletWithDerived`, `TransactionType`, `WalletName`; `DEFAULT_WALLETS`, `AGOROT_PER_SHEKEL`, `DAYS_PER_MONTH`; `newId(): string`.

- [ ] **Step 1: Install runtime + dev dependencies**

Run:
```bash
npm install @mui/material @emotion/react @emotion/styled @emotion/cache @emotion/server stylis stylis-plugin-rtl @tanstack/react-query
npm install -D puppeteer
```
Expected: installs succeed; `package.json` lists them.

- [ ] **Step 2: Add the e2e script + data-file gitignore**

In `package.json` `"scripts"`, add:
```json
"test:e2e": "node e2e/run-e2e.mjs"
```
Append to `.gitignore`:
```
# fun-saver runtime data store (mutable state)
/src/db/data.json
/.e2e-data
```

- [ ] **Step 3: Write domain types**

Create `src/lib/types.ts`:
```ts
export type TransactionType = 'deposit' | 'withdrawal' | 'interest';
export type WalletName = 'savings' | 'spending' | 'goodDeeds';

export interface Account {
  id: string;
  name: string;
  avatarId: string;
  isActive: boolean;
}

export interface Wallet {
  id: string;
  accountId: string;
  name: WalletName;
  icon: string;
  monthlyInterestRate: number;
  openedAt: string; // 'YYYY-MM-DD'
  lastInterestDate: string; // 'YYYY-MM-DD' — settled through this day
}

export interface Transaction {
  id: string;
  walletId: string;
  type: TransactionType;
  amount: number; // integer agorot
  occurredAt: string; // 'YYYY-MM-DD'
}

export interface WalletWithDerived extends Wallet {
  balance: number; // agorot
  principal: number; // agorot
  interestGain: number; // agorot
  todayInterest: number; // agorot credited today
}
```

- [ ] **Step 4: Write constants**

Create `src/lib/constants.ts`:
```ts
import type { WalletName } from './types';

export const AGOROT_PER_SHEKEL = 100;
export const DAYS_PER_MONTH = 30;

export const SAVINGS_MONTHLY_RATE = 0.2;

export interface DefaultWalletSeed {
  name: WalletName;
  icon: string;
  monthlyInterestRate: number;
}

export const DEFAULT_WALLETS: readonly DefaultWalletSeed[] = [
  { name: 'savings', icon: '🐷', monthlyInterestRate: SAVINGS_MONTHLY_RATE },
  { name: 'spending', icon: '🛍️', monthlyInterestRate: 0 },
  { name: 'goodDeeds', icon: '💛', monthlyInterestRate: 0 },
];
```

- [ ] **Step 5: Write id generator**

Create `src/lib/ids.ts`:
```ts
export function newId(): string {
  return crypto.randomUUID();
}
```

- [ ] **Step 6: Verify the project still type-checks and builds config**

Run: `npx tsc --noEmit`
Expected: PASS (no errors).

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json .gitignore src/lib/types.ts src/lib/constants.ts src/lib/ids.ts
git commit -m "chore: add deps, scripts, domain types and constants"
```

---

## Task 2: Failing acceptance E2E (outside-in anchor)

**Files:**
- Create: `e2e/createAccount.e2e.mjs`
- Create: `e2e/run-e2e.mjs`

**Interfaces:**
- Consumes: the running app at `/` (built in later tasks), the `FUNSAVER_DATA_PATH` + `FUNSAVER_NOW` env overrides (implemented in the DAL/clock tasks), and these `data-testid`s that later UI tasks MUST produce: `empty-state`, `account-name-input`, `avatar-option` (one per avatar), `create-account-submit`, `ribbon-name`, `ribbon-avatar`, `wallet-hero`, `wallet-balance` (per wallet card + hero).

- [ ] **Step 1: Write the E2E runner**

Create `e2e/run-e2e.mjs`:
```js
import { spawn } from 'node:child_process';
import { rm, mkdir } from 'node:fs/promises';

const PORT = 3987;
const DATA_DIR = '.e2e-data';

async function main() {
  await rm(DATA_DIR, { recursive: true, force: true });
  await mkdir(DATA_DIR, { recursive: true });

  const env = {
    ...process.env,
    PORT: String(PORT),
    FUNSAVER_DATA_PATH: `${DATA_DIR}/data.json`,
    FUNSAVER_NOW: '2026-01-01',
  };

  const server = spawn('npx', ['next', 'start', '-p', String(PORT)], { env, stdio: 'inherit' });
  try {
    await waitForServer(`http://localhost:${PORT}`);
    const test = spawn('node', ['e2e/createAccount.e2e.mjs'], {
      env: { ...env, BASE_URL: `http://localhost:${PORT}` },
      stdio: 'inherit',
    });
    const code = await new Promise((res) => test.on('exit', res));
    process.exitCode = code ?? 1;
  } finally {
    server.kill('SIGTERM');
  }
}

async function waitForServer(url) {
  for (let i = 0; i < 60; i++) {
    try {
      const res = await fetch(url);
      if (res.ok || res.status === 404) return;
    } catch {
      // not up yet
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error('server did not start');
}

main();
```

- [ ] **Step 2: Write the acceptance test**

Create `e2e/createAccount.e2e.mjs`:
```js
import puppeteer from 'puppeteer';
import assert from 'node:assert/strict';

const BASE_URL = process.env.BASE_URL ?? 'http://localhost:3987';

async function main() {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  try {
    await page.goto(BASE_URL, { waitUntil: 'networkidle0' });

    await page.waitForSelector('[data-testid="empty-state"]');
    await page.type('[data-testid="account-name-input"]', 'נועה');
    await page.click('[data-testid="avatar-option"]');
    await page.click('[data-testid="create-account-submit"]');

    await page.waitForSelector('[data-testid="ribbon-name"]');
    const name = await page.$eval('[data-testid="ribbon-name"]', (el) => el.textContent);
    assert.equal(name?.trim(), 'נועה', 'ribbon shows account name');

    await page.waitForSelector('[data-testid="ribbon-avatar"]');
    await page.waitForSelector('[data-testid="wallet-hero"]');

    const balances = await page.$$eval('[data-testid="wallet-balance"]', (els) =>
      els.map((el) => el.textContent ?? ''),
    );
    assert.ok(balances.length >= 3, 'three wallets render');
    for (const b of balances) {
      assert.ok(/(^|\D)0(\D|$)/.test(b), `new wallet balance reads 0, got "${b}"`);
    }
    console.log('E2E PASS: create account → dashboard with 3 zero wallets');
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error('E2E FAIL:', err.message);
  process.exit(1);
});
```

- [ ] **Step 3: Run it and confirm it FAILS**

Run: `npm run build && npm run test:e2e`
Expected: FAIL — build error or the E2E cannot find `[data-testid="empty-state"]` (no UI yet). This is the outside-in anchor; it stays red until Task 22.

- [ ] **Step 4: Commit**

```bash
git add e2e/
git commit -m "test: add failing acceptance E2E for create-account flow"
```

---

## Task 3: Clock & date helpers (pure)

**Files:**
- Create: `src/lib/clock.ts`, `src/lib/dates.ts`
- Test: `src/lib/__tests__/dates.test.ts`

**Interfaces:**
- Produces: `today(): string`; `addDays(iso: string, n: number): string`; `eachDayExclusive(startInclusive: string, endInclusive: string): string[]` (returns days from `startInclusive` through `endInclusive`, both inclusive; empty if start > end).

- [ ] **Step 1: Write the failing test**

Create `src/lib/__tests__/dates.test.ts`:
```ts
import { addDays, eachDayExclusive } from '../dates';

describe('dates', () => {
  it('addDays moves forward across month boundary', () => {
    expect(addDays('2026-01-31', 1)).toBe('2026-02-01');
  });
  it('addDays moves backward', () => {
    expect(addDays('2026-03-01', -1)).toBe('2026-02-28');
  });
  it('eachDayExclusive lists inclusive day range', () => {
    expect(eachDayExclusive('2026-01-01', '2026-01-03')).toEqual([
      '2026-01-01',
      '2026-01-02',
      '2026-01-03',
    ]);
  });
  it('eachDayExclusive is empty when start after end', () => {
    expect(eachDayExclusive('2026-01-05', '2026-01-04')).toEqual([]);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx jest src/lib/__tests__/dates.test.ts`
Expected: FAIL — `Cannot find module '../dates'`.

- [ ] **Step 3: Write minimal implementation**

Create `src/lib/dates.ts`:
```ts
export function addDays(iso: string, n: number): string {
  const date = new Date(`${iso}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + n);
  return date.toISOString().slice(0, 10);
}

export function eachDayExclusive(startInclusive: string, endInclusive: string): string[] {
  const days: string[] = [];
  let current = startInclusive;
  while (current <= endInclusive) {
    days.push(current);
    current = addDays(current, 1);
  }
  return days;
}
```

Create `src/lib/clock.ts`:
```ts
export function today(): string {
  const override = process.env.FUNSAVER_NOW;
  if (override) return override;
  return new Date().toISOString().slice(0, 10);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx jest src/lib/__tests__/dates.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/clock.ts src/lib/dates.ts src/lib/__tests__/dates.test.ts
git commit -m "feat: add pure clock and date helpers"
```

---

## Task 4: Money helpers (pure)

**Files:**
- Create: `src/lib/money.ts`
- Test: `src/lib/__tests__/money.test.ts`

**Interfaces:**
- Produces: `shekelsToAgorot(shekels: number): number`; `agorotToShekels(agorot: number): number`; `coinBreakdown(agorot: number): { show: boolean; full: number; half: boolean }` — rounds to nearest half-shekel, then `full = floor(shekels)`, `half = remainder is 0.5`, `show = rounded > 0`.

- [ ] **Step 1: Write the failing test**

Create `src/lib/__tests__/money.test.ts`:
```ts
import { agorotToShekels, coinBreakdown, shekelsToAgorot } from '../money';

describe('money', () => {
  it('converts shekels to integer agorot', () => {
    expect(shekelsToAgorot(5)).toBe(500);
    expect(shekelsToAgorot(5.5)).toBe(550);
    expect(shekelsToAgorot(0.014)).toBe(1); // rounds to nearest agora
  });
  it('converts agorot to shekels', () => {
    expect(agorotToShekels(550)).toBe(5.5);
  });
  it('coinBreakdown rounds to nearest half-shekel', () => {
    expect(coinBreakdown(550)).toEqual({ show: true, full: 5, half: true }); // 5.5
    expect(coinBreakdown(500)).toEqual({ show: true, full: 5, half: false }); // 5.0
    expect(coinBreakdown(525)).toEqual({ show: true, full: 5, half: false }); // 5.25 -> 5.0
    expect(coinBreakdown(540)).toEqual({ show: true, full: 5, half: true }); // 5.40 -> 5.5
  });
  it('coinBreakdown hides when rounded value is zero', () => {
    expect(coinBreakdown(0)).toEqual({ show: false, full: 0, half: false });
    expect(coinBreakdown(20)).toEqual({ show: false, full: 0, half: false }); // 0.20 -> 0.0
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx jest src/lib/__tests__/money.test.ts`
Expected: FAIL — `Cannot find module '../money'`.

- [ ] **Step 3: Write minimal implementation**

Create `src/lib/money.ts`:
```ts
import { AGOROT_PER_SHEKEL } from './constants';

export function shekelsToAgorot(shekels: number): number {
  return Math.round(shekels * AGOROT_PER_SHEKEL);
}

export function agorotToShekels(agorot: number): number {
  return agorot / AGOROT_PER_SHEKEL;
}

const HALF_SHEKEL_AGOROT = AGOROT_PER_SHEKEL / 2;

export function coinBreakdown(agorot: number): { show: boolean; full: number; half: boolean } {
  const roundedAgorot = Math.round(agorot / HALF_SHEKEL_AGOROT) * HALF_SHEKEL_AGOROT;
  if (roundedAgorot <= 0) return { show: false, full: 0, half: false };
  const full = Math.floor(roundedAgorot / AGOROT_PER_SHEKEL);
  const half = roundedAgorot % AGOROT_PER_SHEKEL === HALF_SHEKEL_AGOROT;
  return { show: true, full, half };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx jest src/lib/__tests__/money.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/money.ts src/lib/__tests__/money.test.ts
git commit -m "feat: add pure money + coin-breakdown helpers"
```

---

## Task 5: Derivations (pure)

**Files:**
- Create: `src/lib/derivations.ts`
- Test: `src/lib/__tests__/derivations.test.ts`

**Interfaces:**
- Consumes: `Transaction` (Task 1).
- Produces: `balance(txns: Transaction[]): number`; `principal(txns: Transaction[]): number`; `interestGain(txns: Transaction[]): number`; `todayInterest(txns: Transaction[], asOf: string): number`. All return agorot.

- [ ] **Step 1: Write the failing test**

Create `src/lib/__tests__/derivations.test.ts`:
```ts
import { balance, interestGain, principal, todayInterest } from '../derivations';
import type { Transaction } from '../types';

const tx = (type: Transaction['type'], amount: number, occurredAt: string): Transaction => ({
  id: `${type}-${occurredAt}-${amount}`,
  walletId: 'w1',
  type,
  amount,
  occurredAt,
});

describe('derivations', () => {
  const txns: Transaction[] = [
    tx('deposit', 8000, '2026-01-01'),
    tx('interest', 53, '2026-01-02'),
    tx('withdrawal', 1000, '2026-01-03'),
    tx('interest', 47, '2026-01-03'),
  ];
  it('balance = deposits - withdrawals + interest', () => {
    expect(balance(txns)).toBe(8000 - 1000 + 53 + 47);
  });
  it('principal = deposits - withdrawals', () => {
    expect(principal(txns)).toBe(7000);
  });
  it('interestGain = sum of interest', () => {
    expect(interestGain(txns)).toBe(100);
  });
  it('todayInterest = interest dated asOf only', () => {
    expect(todayInterest(txns, '2026-01-03')).toBe(47);
    expect(todayInterest(txns, '2026-01-10')).toBe(0);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx jest src/lib/__tests__/derivations.test.ts`
Expected: FAIL — `Cannot find module '../derivations'`.

- [ ] **Step 3: Write minimal implementation**

Create `src/lib/derivations.ts`:
```ts
import type { Transaction } from './types';

const sum = (txns: Transaction[], type: Transaction['type']): number =>
  txns.filter((t) => t.type === type).reduce((acc, t) => acc + t.amount, 0);

export function principal(txns: Transaction[]): number {
  return sum(txns, 'deposit') - sum(txns, 'withdrawal');
}

export function interestGain(txns: Transaction[]): number {
  return sum(txns, 'interest');
}

export function balance(txns: Transaction[]): number {
  return principal(txns) + interestGain(txns);
}

export function todayInterest(txns: Transaction[], asOf: string): number {
  return txns
    .filter((t) => t.type === 'interest' && t.occurredAt === asOf)
    .reduce((acc, t) => acc + t.amount, 0);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx jest src/lib/__tests__/derivations.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/derivations.ts src/lib/__tests__/derivations.test.ts
git commit -m "feat: add pure ledger derivations"
```

---

## Task 6: Interest module (pure, self-contained)

**Files:**
- Create: `src/lib/interest/dailyRate.ts`, `src/lib/interest/interestForDay.ts`, `src/lib/interest/addDailyInterest.ts`, `src/lib/interest/index.ts`
- Test: `src/lib/interest/__tests__/interest.test.ts`

**Interfaces:**
- Consumes: `Wallet`, `Transaction` (Task 1); `addDays`, `eachDayExclusive` (Task 3); `DAYS_PER_MONTH` (Task 1); `newId` (Task 1).
- Produces: `dailyRate(monthlyRate: number): number`; `interestForDay(closingBalanceAgorot: number, monthlyRate: number): number`; `addDailyInterest(wallet: Wallet, transactions: Transaction[], asOf: string): Transaction[]` — returns NEW interest transactions for each day in `(lastInterestDate, asOf]`; never mutates input; returns `[]` when already settled or rate is 0.

- [ ] **Step 1: Write the failing test**

Create `src/lib/interest/__tests__/interest.test.ts`:
```ts
import { addDailyInterest, dailyRate, interestForDay } from '../index';
import type { Transaction, Wallet } from '../../types';

const savings = (lastInterestDate: string, monthlyInterestRate = 0.2): Wallet => ({
  id: 'w1',
  accountId: 'a1',
  name: 'savings',
  icon: '🐷',
  monthlyInterestRate,
  openedAt: '2026-01-01',
  lastInterestDate,
});

const deposit = (amount: number, occurredAt: string): Transaction => ({
  id: `d-${occurredAt}`,
  walletId: 'w1',
  type: 'deposit',
  amount,
  occurredAt,
});

describe('interest primitives', () => {
  it('dailyRate is monthlyRate / 30', () => {
    expect(dailyRate(0.2)).toBeCloseTo(0.2 / 30, 10);
  });
  it('interestForDay rounds to nearest agora, zero on non-positive balance', () => {
    expect(interestForDay(8000, 0.2)).toBe(Math.round(8000 * (0.2 / 30))); // 53
    expect(interestForDay(0, 0.2)).toBe(0);
    expect(interestForDay(-500, 0.2)).toBe(0);
  });
});

describe('addDailyInterest', () => {
  it('credits one interest txn per day from lastInterestDate+1..asOf', () => {
    const wallet = savings('2026-01-01');
    const txns = [deposit(8000, '2026-01-01')];
    const result = addDailyInterest(wallet, txns, '2026-01-03');
    expect(result.map((t) => t.occurredAt)).toEqual(['2026-01-02', '2026-01-03']);
    expect(result.every((t) => t.type === 'interest')).toBe(true);
    // day1 interest on 8000; day2 on 8000+day1interest (compounding)
    const day1 = interestForDay(8000, 0.2);
    const day2 = interestForDay(8000 + day1, 0.2);
    expect(result[0].amount).toBe(day1);
    expect(result[1].amount).toBe(day2);
  });
  it('is idempotent — already settled returns []', () => {
    const wallet = savings('2026-01-03');
    expect(addDailyInterest(wallet, [deposit(8000, '2026-01-01')], '2026-01-03')).toEqual([]);
  });
  it('weights by day of deposit — mid-period deposit earns fewer days', () => {
    const wallet = savings('2026-01-01');
    const txns = [deposit(8000, '2026-01-01'), deposit(2000, '2026-01-03')];
    const result = addDailyInterest(wallet, txns, '2026-01-03');
    // 2026-01-02 interest only on 8000(+nothing); 2026-01-03 on 8000+day1 (deposit of 01-03 not yet earning)
    expect(result[0].amount).toBe(interestForDay(8000, 0.2));
    expect(result[1].amount).toBe(interestForDay(8000 + result[0].amount, 0.2));
  });
  it('no interest on a zero-rate wallet', () => {
    const wallet = { ...savings('2026-01-01'), monthlyInterestRate: 0 };
    expect(addDailyInterest(wallet, [deposit(5000, '2026-01-01')], '2026-01-05')).toEqual([]);
  });
  it('withdrawals lower later interest', () => {
    const wallet = savings('2026-01-01');
    const txns: Transaction[] = [
      deposit(8000, '2026-01-01'),
      { id: 'w', walletId: 'w1', type: 'withdrawal', amount: 8000, occurredAt: '2026-01-02' },
    ];
    const result = addDailyInterest(wallet, txns, '2026-01-04');
    // 01-02 interest on 8000; then balance drops to ~day1 interest; 01-03/01-04 ~0
    expect(result[0].amount).toBe(interestForDay(8000, 0.2));
    expect(result[1].amount).toBe(0 /* balance after withdrawal ~ a few agorot rounds to 0 */);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx jest src/lib/interest`
Expected: FAIL — `Cannot find module '../index'`.

- [ ] **Step 3: Write minimal implementation**

Create `src/lib/interest/dailyRate.ts`:
```ts
import { DAYS_PER_MONTH } from '../constants';

export function dailyRate(monthlyRate: number): number {
  return monthlyRate / DAYS_PER_MONTH;
}
```

Create `src/lib/interest/interestForDay.ts`:
```ts
import { dailyRate } from './dailyRate';

export function interestForDay(closingBalanceAgorot: number, monthlyRate: number): number {
  if (closingBalanceAgorot <= 0) return 0;
  return Math.round(closingBalanceAgorot * dailyRate(monthlyRate));
}
```

Create `src/lib/interest/addDailyInterest.ts`:
```ts
import type { Transaction, Wallet } from '../types';
import { addDays, eachDayExclusive } from '../dates';
import { newId } from '../ids';
import { interestForDay } from './interestForDay';

// Replays each day after lastInterestDate through asOf, crediting interest on the
// previous day's closing balance. Day-of-deposit weighting is automatic: a deposit
// only joins `balance` on its own date, so it earns from the next day onward.
export function addDailyInterest(
  wallet: Wallet,
  transactions: Transaction[],
  asOf: string,
): Transaction[] {
  const firstDay = addDays(wallet.lastInterestDate, 1);
  if (firstDay > asOf || wallet.monthlyInterestRate === 0) return [];

  const deltaByDay = new Map<string, number>();
  for (const t of transactions) {
    if (t.type === 'interest') continue;
    const sign = t.type === 'deposit' ? 1 : -1;
    deltaByDay.set(t.occurredAt, (deltaByDay.get(t.occurredAt) ?? 0) + sign * t.amount);
  }

  // Closing balance through lastInterestDate (= firstDay - 1), interest included.
  let balance = transactions
    .filter((t) => t.occurredAt <= wallet.lastInterestDate)
    .reduce((acc, t) => acc + (t.type === 'withdrawal' ? -t.amount : t.amount), 0);

  const created: Transaction[] = [];
  for (const day of eachDayExclusive(firstDay, asOf)) {
    const earned = interestForDay(balance, wallet.monthlyInterestRate);
    if (earned > 0) {
      created.push({ id: newId(), walletId: wallet.id, type: 'interest', amount: earned, occurredAt: day });
      balance += earned;
    }
    balance += deltaByDay.get(day) ?? 0; // that day's deposits/withdrawals join after interest
  }
  return created;
}
```

Create `src/lib/interest/index.ts`:
```ts
export { dailyRate } from './dailyRate';
export { interestForDay } from './interestForDay';
export { addDailyInterest } from './addDailyInterest';
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx jest src/lib/interest`
Expected: PASS (all interest tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/interest
git commit -m "feat: add pure interest module (dailyRate, interestForDay, addDailyInterest)"
```

---

## Task 7: DataStore port + InMemoryStore adapter

**Files:**
- Create: `src/db/DataStore.ts`, `src/db/memoryStore.ts`
- Test: `src/db/__tests__/memoryStore.test.ts`

**Interfaces:**
- Consumes: `Account`, `Wallet`, `Transaction` (Task 1).
- Produces: `interface DataStore` (exact signatures below); `class InMemoryStore implements DataStore` with constructor `new InMemoryStore(seed?: { accounts?: Account[]; wallets?: Wallet[]; transactions?: Transaction[] })`.

- [ ] **Step 1: Write the failing test**

Create `src/db/__tests__/memoryStore.test.ts`:
```ts
import { InMemoryStore } from '../memoryStore';
import type { Account } from '../../lib/types';

const account: Account = { id: 'a1', name: 'נועה', avatarId: 'kid-01', isActive: true };

describe('InMemoryStore', () => {
  it('inserts and reads accounts', async () => {
    const store = new InMemoryStore();
    await store.insertAccount(account);
    expect(await store.getAccounts()).toEqual([account]);
    expect(await store.getAccount('a1')).toEqual(account);
    expect(await store.getAccount('missing')).toBeNull();
  });
  it('patches an account and returns the merged record', async () => {
    const store = new InMemoryStore({ accounts: [account] });
    const updated = await store.updateAccount('a1', { name: 'מיה' });
    expect(updated.name).toBe('מיה');
    expect((await store.getAccount('a1'))?.name).toBe('מיה');
  });
  it('throws when patching a missing account', async () => {
    const store = new InMemoryStore();
    await expect(store.updateAccount('nope', { name: 'x' })).rejects.toThrow();
  });
  it('filters wallets and transactions by parent id', async () => {
    const store = new InMemoryStore();
    await store.insertWallet({
      id: 'w1', accountId: 'a1', name: 'savings', icon: '🐷',
      monthlyInterestRate: 0.2, openedAt: '2026-01-01', lastInterestDate: '2026-01-01',
    });
    await store.insertTransactions([
      { id: 't1', walletId: 'w1', type: 'deposit', amount: 5000, occurredAt: '2026-01-01' },
    ]);
    expect((await store.getWalletsByAccount('a1')).map((w) => w.id)).toEqual(['w1']);
    expect((await store.getTransactionsByWallet('w1')).map((t) => t.id)).toEqual(['t1']);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx jest src/db/__tests__/memoryStore.test.ts`
Expected: FAIL — `Cannot find module '../memoryStore'`.

- [ ] **Step 3: Write the port + adapter**

Create `src/db/DataStore.ts`:
```ts
import type { Account, Transaction, Wallet } from '../lib/types';

export interface DataStore {
  getAccounts(): Promise<Account[]>;
  getAccount(id: string): Promise<Account | null>;
  insertAccount(account: Account): Promise<void>;
  updateAccount(id: string, patch: Partial<Account>): Promise<Account>;

  getWalletsByAccount(accountId: string): Promise<Wallet[]>;
  getWallet(id: string): Promise<Wallet | null>;
  insertWallet(wallet: Wallet): Promise<void>;
  updateWallet(id: string, patch: Partial<Wallet>): Promise<Wallet>;

  getTransactionsByWallet(walletId: string): Promise<Transaction[]>;
  insertTransactions(transactions: Transaction[]): Promise<void>;
}
```

Create `src/db/memoryStore.ts`:
```ts
import type { Account, Transaction, Wallet } from '../lib/types';
import type { DataStore } from './DataStore';

interface Seed {
  accounts?: Account[];
  wallets?: Wallet[];
  transactions?: Transaction[];
}

export class InMemoryStore implements DataStore {
  private accounts: Account[];
  private wallets: Wallet[];
  private transactions: Transaction[];

  constructor(seed: Seed = {}) {
    this.accounts = [...(seed.accounts ?? [])];
    this.wallets = [...(seed.wallets ?? [])];
    this.transactions = [...(seed.transactions ?? [])];
  }

  async getAccounts(): Promise<Account[]> {
    return [...this.accounts];
  }
  async getAccount(id: string): Promise<Account | null> {
    return this.accounts.find((a) => a.id === id) ?? null;
  }
  async insertAccount(account: Account): Promise<void> {
    this.accounts.push(account);
  }
  async updateAccount(id: string, patch: Partial<Account>): Promise<Account> {
    const account = this.accounts.find((a) => a.id === id);
    if (!account) throw new Error(`account ${id} not found`);
    Object.assign(account, patch);
    return account;
  }

  async getWalletsByAccount(accountId: string): Promise<Wallet[]> {
    return this.wallets.filter((w) => w.accountId === accountId);
  }
  async getWallet(id: string): Promise<Wallet | null> {
    return this.wallets.find((w) => w.id === id) ?? null;
  }
  async insertWallet(wallet: Wallet): Promise<void> {
    this.wallets.push(wallet);
  }
  async updateWallet(id: string, patch: Partial<Wallet>): Promise<Wallet> {
    const wallet = this.wallets.find((w) => w.id === id);
    if (!wallet) throw new Error(`wallet ${id} not found`);
    Object.assign(wallet, patch);
    return wallet;
  }

  async getTransactionsByWallet(walletId: string): Promise<Transaction[]> {
    return this.transactions.filter((t) => t.walletId === walletId);
  }
  async insertTransactions(transactions: Transaction[]): Promise<void> {
    this.transactions.push(...transactions);
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx jest src/db/__tests__/memoryStore.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/db/DataStore.ts src/db/memoryStore.ts src/db/__tests__/memoryStore.test.ts
git commit -m "feat: add DataStore port and InMemoryStore adapter"
```

---

## Task 8: JsonFileStore adapter (bootstrap, serialized writes, migrate)

**Files:**
- Create: `src/db/jsonStore.ts`
- Test: `src/db/__tests__/jsonStore.test.ts`

**Interfaces:**
- Consumes: `DataStore` (Task 7), domain types.
- Produces: `class JsonFileStore implements DataStore` with constructor `new JsonFileStore(filePath: string)`; bootstraps an empty `{ version: 1, accounts: [], wallets: [], transactions: [] }` file on first access; serializes writes; runs `migrate(data)` on load.

- [ ] **Step 1: Write the failing test**

Create `src/db/__tests__/jsonStore.test.ts`:
```ts
import { mkdtempSync, rmSync, existsSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { JsonFileStore } from '../jsonStore';
import type { Account } from '../../lib/types';

let dir: string;
let file: string;
beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), 'funsaver-'));
  file = join(dir, 'data.json');
});
afterEach(() => rmSync(dir, { recursive: true, force: true }));

const account: Account = { id: 'a1', name: 'נועה', avatarId: 'kid-01', isActive: true };

describe('JsonFileStore', () => {
  it('bootstraps an empty store file and reads empty accounts', async () => {
    const store = new JsonFileStore(file);
    expect(await store.getAccounts()).toEqual([]);
    expect(existsSync(file)).toBe(true);
    expect(JSON.parse(readFileSync(file, 'utf8')).version).toBe(1);
  });
  it('persists inserts across instances', async () => {
    await new JsonFileStore(file).insertAccount(account);
    const reopened = new JsonFileStore(file);
    expect(await reopened.getAccounts()).toEqual([account]);
  });
  it('serializes concurrent writes without losing records', async () => {
    const store = new JsonFileStore(file);
    await Promise.all(
      Array.from({ length: 10 }, (_, i) =>
        store.insertAccount({ id: `a${i}`, name: `n${i}`, avatarId: 'kid-01', isActive: true }),
      ),
    );
    expect((await store.getAccounts()).length).toBe(10);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx jest src/db/__tests__/jsonStore.test.ts`
Expected: FAIL — `Cannot find module '../jsonStore'`.

- [ ] **Step 3: Write the adapter**

Create `src/db/jsonStore.ts`:
```ts
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';
import type { Account, Transaction, Wallet } from '../lib/types';
import type { DataStore } from './DataStore';

interface StoreData {
  version: number;
  accounts: Account[];
  wallets: Wallet[];
  transactions: Transaction[];
}

const EMPTY: StoreData = { version: 1, accounts: [], wallets: [], transactions: [] };

// Registry of version -> next-version transforms. v1 has none yet; the seam exists
// so future shape changes migrate old data forward instead of breaking.
function migrate(data: StoreData): StoreData {
  return data;
}

export class JsonFileStore implements DataStore {
  private queue: Promise<unknown> = Promise.resolve();
  constructor(private readonly filePath: string) {}

  private async read(): Promise<StoreData> {
    try {
      const raw = await readFile(this.filePath, 'utf8');
      return migrate({ ...EMPTY, ...JSON.parse(raw) });
    } catch {
      await this.persist(EMPTY);
      return { ...EMPTY };
    }
  }

  private async persist(data: StoreData): Promise<void> {
    await mkdir(dirname(this.filePath), { recursive: true });
    await writeFile(this.filePath, JSON.stringify(data, null, 2), 'utf8');
  }

  // Serialize every mutation through a single promise chain (read-modify-write).
  private mutate<T>(fn: (data: StoreData) => T): Promise<T> {
    const run = this.queue.then(async () => {
      const data = await this.read();
      const result = fn(data);
      await this.persist(data);
      return result;
    });
    this.queue = run.catch(() => undefined);
    return run;
  }

  async getAccounts(): Promise<Account[]> {
    return (await this.read()).accounts;
  }
  async getAccount(id: string): Promise<Account | null> {
    return (await this.read()).accounts.find((a) => a.id === id) ?? null;
  }
  async insertAccount(account: Account): Promise<void> {
    await this.mutate((d) => {
      d.accounts.push(account);
    });
  }
  async updateAccount(id: string, patch: Partial<Account>): Promise<Account> {
    return this.mutate((d) => {
      const account = d.accounts.find((a) => a.id === id);
      if (!account) throw new Error(`account ${id} not found`);
      Object.assign(account, patch);
      return account;
    });
  }

  async getWalletsByAccount(accountId: string): Promise<Wallet[]> {
    return (await this.read()).wallets.filter((w) => w.accountId === accountId);
  }
  async getWallet(id: string): Promise<Wallet | null> {
    return (await this.read()).wallets.find((w) => w.id === id) ?? null;
  }
  async insertWallet(wallet: Wallet): Promise<void> {
    await this.mutate((d) => {
      d.wallets.push(wallet);
    });
  }
  async updateWallet(id: string, patch: Partial<Wallet>): Promise<Wallet> {
    return this.mutate((d) => {
      const wallet = d.wallets.find((w) => w.id === id);
      if (!wallet) throw new Error(`wallet ${id} not found`);
      Object.assign(wallet, patch);
      return wallet;
    });
  }

  async getTransactionsByWallet(walletId: string): Promise<Transaction[]> {
    return (await this.read()).transactions.filter((t) => t.walletId === walletId);
  }
  async insertTransactions(transactions: Transaction[]): Promise<void> {
    await this.mutate((d) => {
      d.transactions.push(...transactions);
    });
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx jest src/db/__tests__/jsonStore.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/db/jsonStore.ts src/db/__tests__/jsonStore.test.ts
git commit -m "feat: add JsonFileStore adapter with bootstrap, write queue, migrate seam"
```

---

## Task 9: getStore() factory

**Files:**
- Create: `src/db/index.ts`

**Interfaces:**
- Consumes: `JsonFileStore` (Task 8), `DataStore` (Task 7).
- Produces: `getStore(): DataStore` — the single place an adapter is named; JSON store at `FUNSAVER_DATA_PATH` or default `src/db/data.json`; memoized per path.

- [ ] **Step 1: Write the factory**

Create `src/db/index.ts`:
```ts
import { JsonFileStore } from './jsonStore';
import type { DataStore } from './DataStore';

const DEFAULT_PATH = 'src/db/data.json';
let cached: { path: string; store: DataStore } | null = null;

export function getStore(): DataStore {
  const path = process.env.FUNSAVER_DATA_PATH ?? DEFAULT_PATH;
  if (cached?.path !== path) cached = { path, store: new JsonFileStore(path) };
  return cached.store;
}

export type { DataStore } from './DataStore';
```

- [ ] **Step 2: Verify type-check**

Run: `npx tsc --noEmit`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/db/index.ts
git commit -m "feat: add getStore() DAL factory"
```

---

## Task 10: Service layer part 1 — errors, settle, accounts

**Files:**
- Create: `src/lib/errors.ts`, `src/lib/settle.ts`, `src/lib/accounts.ts`
- Test: `src/lib/__tests__/accounts.test.ts`, `src/lib/__tests__/settle.test.ts`

**Interfaces:**
- Consumes: `DataStore` (Task 7/9), `addDailyInterest` (Task 6), `DEFAULT_WALLETS` (Task 1), `newId` (Task 1), `balance` (Task 5).
- Produces:
  - `class NotFoundError extends Error`, `class OverdraftError extends Error`, `class ValidationError extends Error`.
  - `settleWallet(store: DataStore, wallet: Wallet, asOf: string): Promise<Wallet>` — credits any owed interest, advances `lastInterestDate` to `asOf`, returns the updated wallet.
  - `listAccounts(store: DataStore): Promise<Account[]>` (active only).
  - `createAccount(store: DataStore, input: { name: string; avatarId: string }, asOf: string): Promise<Account>` (auto-seeds the 3 default wallets opened on `asOf`).
  - `updateAccount(store: DataStore, id: string, patch: Partial<Pick<Account, 'name' | 'avatarId' | 'isActive'>>): Promise<Account>`.

- [ ] **Step 1: Write the failing settle test**

Create `src/lib/__tests__/settle.test.ts`:
```ts
import { InMemoryStore } from '../../db/memoryStore';
import { settleWallet } from '../settle';
import { balance } from '../derivations';
import type { Wallet } from '../types';

const wallet: Wallet = {
  id: 'w1', accountId: 'a1', name: 'savings', icon: '🐷',
  monthlyInterestRate: 0.2, openedAt: '2026-01-01', lastInterestDate: '2026-01-01',
};

describe('settleWallet', () => {
  it('credits interest and advances lastInterestDate', async () => {
    const store = new InMemoryStore({
      wallets: [wallet],
      transactions: [{ id: 'd', walletId: 'w1', type: 'deposit', amount: 8000, occurredAt: '2026-01-01' }],
    });
    const updated = await settleWallet(store, wallet, '2026-01-03');
    expect(updated.lastInterestDate).toBe('2026-01-03');
    const txns = await store.getTransactionsByWallet('w1');
    expect(txns.filter((t) => t.type === 'interest').length).toBe(2);
    expect(balance(txns)).toBeGreaterThan(8000);
  });
  it('advances date with no interest when already settled', async () => {
    const store = new InMemoryStore({ wallets: [wallet] });
    const updated = await settleWallet(store, wallet, '2026-01-01');
    expect(updated.lastInterestDate).toBe('2026-01-01');
    expect((await store.getTransactionsByWallet('w1')).length).toBe(0);
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npx jest src/lib/__tests__/settle.test.ts`
Expected: FAIL — `Cannot find module '../settle'`.

- [ ] **Step 3: Write errors + settle**

Create `src/lib/errors.ts`:
```ts
export class NotFoundError extends Error {}
export class OverdraftError extends Error {}
export class ValidationError extends Error {}
```

Create `src/lib/settle.ts`:
```ts
import type { DataStore } from '../db/DataStore';
import type { Wallet } from './types';
import { addDailyInterest } from './interest';

export async function settleWallet(store: DataStore, wallet: Wallet, asOf: string): Promise<Wallet> {
  if (asOf <= wallet.lastInterestDate) return wallet;
  const txns = await store.getTransactionsByWallet(wallet.id);
  const credited = addDailyInterest(wallet, txns, asOf);
  if (credited.length > 0) await store.insertTransactions(credited);
  return store.updateWallet(wallet.id, { lastInterestDate: asOf });
}
```

- [ ] **Step 4: Run settle test — PASS**

Run: `npx jest src/lib/__tests__/settle.test.ts`
Expected: PASS.

- [ ] **Step 5: Write the failing accounts test**

Create `src/lib/__tests__/accounts.test.ts`:
```ts
import { InMemoryStore } from '../../db/memoryStore';
import { createAccount, listAccounts, updateAccount } from '../accounts';

describe('accounts service', () => {
  it('creates an account and seeds three wallets opened today', async () => {
    const store = new InMemoryStore();
    const account = await createAccount(store, { name: 'נועה', avatarId: 'kid-01' }, '2026-01-01');
    expect(account.id).toBeTruthy();
    expect(account.isActive).toBe(true);
    const wallets = await store.getWalletsByAccount(account.id);
    expect(wallets.map((w) => w.name).sort()).toEqual(['goodDeeds', 'savings', 'spending']);
    const savings = wallets.find((w) => w.name === 'savings');
    expect(savings?.monthlyInterestRate).toBe(0.2);
    expect(savings?.openedAt).toBe('2026-01-01');
    expect(savings?.lastInterestDate).toBe('2026-01-01');
  });
  it('lists only active accounts', async () => {
    const store = new InMemoryStore();
    const a = await createAccount(store, { name: 'A', avatarId: 'kid-01' }, '2026-01-01');
    await createAccount(store, { name: 'B', avatarId: 'kid-02' }, '2026-01-01');
    await updateAccount(store, a.id, { isActive: false });
    expect((await listAccounts(store)).map((x) => x.name)).toEqual(['B']);
  });
});
```

- [ ] **Step 6: Run to verify it fails**

Run: `npx jest src/lib/__tests__/accounts.test.ts`
Expected: FAIL — `Cannot find module '../accounts'`.

- [ ] **Step 7: Write the accounts service**

Create `src/lib/accounts.ts`:
```ts
import type { DataStore } from '../db/DataStore';
import type { Account, Wallet } from './types';
import { DEFAULT_WALLETS } from './constants';
import { newId } from './ids';

export async function listAccounts(store: DataStore): Promise<Account[]> {
  return (await store.getAccounts()).filter((a) => a.isActive);
}

export async function createAccount(
  store: DataStore,
  input: { name: string; avatarId: string },
  asOf: string,
): Promise<Account> {
  const account: Account = { id: newId(), name: input.name, avatarId: input.avatarId, isActive: true };
  await store.insertAccount(account);
  for (const seed of DEFAULT_WALLETS) {
    const wallet: Wallet = {
      id: newId(),
      accountId: account.id,
      name: seed.name,
      icon: seed.icon,
      monthlyInterestRate: seed.monthlyInterestRate,
      openedAt: asOf,
      lastInterestDate: asOf,
    };
    await store.insertWallet(wallet);
  }
  return account;
}

export async function updateAccount(
  store: DataStore,
  id: string,
  patch: Partial<Pick<Account, 'name' | 'avatarId' | 'isActive'>>,
): Promise<Account> {
  return store.updateAccount(id, patch);
}
```

- [ ] **Step 8: Run accounts test — PASS**

Run: `npx jest src/lib/__tests__/accounts.test.ts`
Expected: PASS.

- [ ] **Step 9: Commit**

```bash
git add src/lib/errors.ts src/lib/settle.ts src/lib/accounts.ts src/lib/__tests__/settle.test.ts src/lib/__tests__/accounts.test.ts
git commit -m "feat: add errors, settleWallet, and accounts service"
```

---

## Task 11: Service layer part 2 — wallets & transactions

**Files:**
- Create: `src/lib/wallets.ts`, `src/lib/transactions.ts`
- Test: `src/lib/__tests__/wallets.test.ts`, `src/lib/__tests__/transactions.test.ts`

**Interfaces:**
- Consumes: `DataStore`, `settleWallet` (Task 10), derivations (Task 5), `newId` (Task 1), `NotFoundError`/`OverdraftError`/`ValidationError` (Task 10), `WalletWithDerived` (Task 1).
- Produces:
  - `getWalletsForAccount(store, accountId, asOf): Promise<WalletWithDerived[]>`.
  - `getWallet(store, id, asOf): Promise<WalletWithDerived & { transactions: Transaction[] }>` (throws `NotFoundError`).
  - `addTransaction(store, walletId, input: { type: 'deposit' | 'withdrawal'; amount: number }, asOf): Promise<Transaction>` — settles first, validates `amount > 0` (`ValidationError`), rejects overdraft (`OverdraftError`), inserts dated `asOf`.

- [ ] **Step 1: Write the failing wallets test**

Create `src/lib/__tests__/wallets.test.ts`:
```ts
import { InMemoryStore } from '../../db/memoryStore';
import { createAccount } from '../accounts';
import { addTransaction } from '../transactions';
import { getWalletsForAccount } from '../wallets';

describe('getWalletsForAccount', () => {
  it('returns wallets with derived balances and settles interest', async () => {
    const store = new InMemoryStore();
    const account = await createAccount(store, { name: 'נועה', avatarId: 'kid-01' }, '2026-01-01');
    const wallets = await getWalletsForAccount(store, account.id, '2026-01-01');
    const savings = wallets.find((w) => w.name === 'savings');
    expect(savings?.balance).toBe(0);
    expect(savings?.principal).toBe(0);
    expect(savings?.interestGain).toBe(0);

    const savingsWallet = (await store.getWalletsByAccount(account.id)).find((w) => w.name === 'savings');
    await addTransaction(store, savingsWallet!.id, { type: 'deposit', amount: 8000 }, '2026-01-01');
    const later = await getWalletsForAccount(store, account.id, '2026-01-03');
    const grown = later.find((w) => w.name === 'savings');
    expect(grown!.principal).toBe(8000);
    expect(grown!.interestGain).toBeGreaterThan(0);
    expect(grown!.balance).toBe(grown!.principal + grown!.interestGain);
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npx jest src/lib/__tests__/wallets.test.ts`
Expected: FAIL — `Cannot find module '../wallets'` (and `../transactions`).

- [ ] **Step 3: Write the wallets service**

Create `src/lib/wallets.ts`:
```ts
import type { DataStore } from '../db/DataStore';
import type { Transaction, Wallet, WalletWithDerived } from './types';
import { settleWallet } from './settle';
import { balance, interestGain, principal, todayInterest } from './derivations';
import { NotFoundError } from './errors';

async function derive(store: DataStore, wallet: Wallet, asOf: string): Promise<WalletWithDerived> {
  const settled = await settleWallet(store, wallet, asOf);
  const txns = await store.getTransactionsByWallet(settled.id);
  return {
    ...settled,
    balance: balance(txns),
    principal: principal(txns),
    interestGain: interestGain(txns),
    todayInterest: todayInterest(txns, asOf),
  };
}

export async function getWalletsForAccount(
  store: DataStore,
  accountId: string,
  asOf: string,
): Promise<WalletWithDerived[]> {
  const wallets = await store.getWalletsByAccount(accountId);
  return Promise.all(wallets.map((w) => derive(store, w, asOf)));
}

export async function getWallet(
  store: DataStore,
  id: string,
  asOf: string,
): Promise<WalletWithDerived & { transactions: Transaction[] }> {
  const wallet = await store.getWallet(id);
  if (!wallet) throw new NotFoundError(`wallet ${id} not found`);
  const derived = await derive(store, wallet, asOf);
  const transactions = await store.getTransactionsByWallet(id);
  return { ...derived, transactions };
}
```

- [ ] **Step 4: Write the failing transactions test**

Create `src/lib/__tests__/transactions.test.ts`:
```ts
import { InMemoryStore } from '../../db/memoryStore';
import { createAccount } from '../accounts';
import { addTransaction } from '../transactions';
import { OverdraftError, ValidationError } from '../errors';
import { balance } from '../derivations';

async function savingsWalletId(store: InMemoryStore, accountId: string): Promise<string> {
  const w = (await store.getWalletsByAccount(accountId)).find((x) => x.name === 'savings');
  return w!.id;
}

describe('addTransaction', () => {
  it('records a deposit dated asOf', async () => {
    const store = new InMemoryStore();
    const acc = await createAccount(store, { name: 'נועה', avatarId: 'kid-01' }, '2026-01-01');
    const id = await savingsWalletId(store, acc.id);
    const tx = await addTransaction(store, id, { type: 'deposit', amount: 5000 }, '2026-01-02');
    expect(tx.type).toBe('deposit');
    expect(tx.occurredAt).toBe('2026-01-02');
    expect(balance(await store.getTransactionsByWallet(id))).toBe(5000);
  });
  it('rejects an overdraft withdrawal', async () => {
    const store = new InMemoryStore();
    const acc = await createAccount(store, { name: 'נועה', avatarId: 'kid-01' }, '2026-01-01');
    const id = await savingsWalletId(store, acc.id);
    await addTransaction(store, id, { type: 'deposit', amount: 1000 }, '2026-01-01');
    await expect(
      addTransaction(store, id, { type: 'withdrawal', amount: 5000 }, '2026-01-01'),
    ).rejects.toBeInstanceOf(OverdraftError);
  });
  it('rejects a non-positive amount', async () => {
    const store = new InMemoryStore();
    const acc = await createAccount(store, { name: 'נועה', avatarId: 'kid-01' }, '2026-01-01');
    const id = await savingsWalletId(store, acc.id);
    await expect(
      addTransaction(store, id, { type: 'deposit', amount: 0 }, '2026-01-01'),
    ).rejects.toBeInstanceOf(ValidationError);
  });
});
```

- [ ] **Step 5: Run to verify it fails**

Run: `npx jest src/lib/__tests__/transactions.test.ts`
Expected: FAIL — `Cannot find module '../transactions'`.

- [ ] **Step 6: Write the transactions service**

Create `src/lib/transactions.ts`:
```ts
import type { DataStore } from '../db/DataStore';
import type { Transaction } from './types';
import { settleWallet } from './settle';
import { balance } from './derivations';
import { newId } from './ids';
import { NotFoundError, OverdraftError, ValidationError } from './errors';

export async function addTransaction(
  store: DataStore,
  walletId: string,
  input: { type: 'deposit' | 'withdrawal'; amount: number },
  asOf: string,
): Promise<Transaction> {
  if (!Number.isInteger(input.amount) || input.amount <= 0) {
    throw new ValidationError('amount must be a positive integer (agorot)');
  }
  const wallet = await store.getWallet(walletId);
  if (!wallet) throw new NotFoundError(`wallet ${walletId} not found`);

  await settleWallet(store, wallet, asOf);

  if (input.type === 'withdrawal') {
    const current = balance(await store.getTransactionsByWallet(walletId));
    if (input.amount > current) throw new OverdraftError('not enough in this wallet');
  }

  const tx: Transaction = {
    id: newId(),
    walletId,
    type: input.type,
    amount: input.amount,
    occurredAt: asOf,
  };
  await store.insertTransactions([tx]);
  return tx;
}
```

- [ ] **Step 7: Run wallets + transactions tests — PASS**

Run: `npx jest src/lib/__tests__/wallets.test.ts src/lib/__tests__/transactions.test.ts`
Expected: PASS.

- [ ] **Step 8: Commit**

```bash
git add src/lib/wallets.ts src/lib/transactions.ts src/lib/__tests__/wallets.test.ts src/lib/__tests__/transactions.test.ts
git commit -m "feat: add wallets and transactions services with overdraft guard"
```

---

## Task 12: API routes (thin handlers)

**Files:**
- Create: `src/lib/httpErrors.ts`
- Create: `src/app/api/accounts/route.ts`, `src/app/api/accounts/[id]/route.ts`, `src/app/api/accounts/[id]/wallets/route.ts`, `src/app/api/wallets/[id]/route.ts`, `src/app/api/wallets/[id]/transactions/route.ts`
- Test: `src/app/api/__tests__/api.test.ts`

**Interfaces:**
- Consumes: `getStore` (Task 9), services (Tasks 10–11), `today` (Task 3), `shekelsToAgorot` (Task 4), error classes (Task 10).
- Produces: HTTP endpoints per spec §2. Request bodies for transactions carry **shekels**; the route converts to agorot. Errors return `{ error: string }` with `400`/`404`/`500`.

- [ ] **Step 1: Write the failing API test**

Create `src/app/api/__tests__/api.test.ts`:
```ts
/** @jest-environment node */
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

let dir: string;
beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), 'funsaver-api-'));
  process.env.FUNSAVER_DATA_PATH = join(dir, 'data.json');
  process.env.FUNSAVER_NOW = '2026-01-01';
  jest.resetModules();
});
afterEach(() => rmSync(dir, { recursive: true, force: true }));

const json = (url: string, method: string, body?: unknown): Request =>
  new Request(url, {
    method,
    headers: { 'content-type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

it('creates an account (201) and lists it', async () => {
  const accounts = await import('../accounts/route');
  const created = await accounts.POST(json('http://x/api/accounts', 'POST', { name: 'נועה', avatarId: 'kid-01' }));
  expect(created.status).toBe(201);
  const list = await accounts.GET();
  expect((await list.json()).length).toBe(1);
});

it('deposits in shekels (stored as agorot) and rejects overdraft (400)', async () => {
  const accounts = await import('../accounts/route');
  const account = await (await accounts.POST(json('http://x/api/accounts', 'POST', { name: 'נ', avatarId: 'kid-01' }))).json();

  const walletsRoute = await import('../accounts/[id]/wallets/route');
  const wallets = await (await walletsRoute.GET(json(`http://x`, 'GET'), { params: Promise.resolve({ id: account.id }) })).json();
  const savings = wallets.find((w: { name: string }) => w.name === 'savings');

  const txRoute = await import('../wallets/[id]/transactions/route');
  const ok = await txRoute.POST(json('http://x', 'POST', { type: 'deposit', amount: 80 }), {
    params: Promise.resolve({ id: savings.id }),
  });
  expect(ok.status).toBe(201);
  expect((await ok.json()).amount).toBe(8000); // 80 shekels -> 8000 agorot

  const bad = await txRoute.POST(json('http://x', 'POST', { type: 'withdrawal', amount: 999 }), {
    params: Promise.resolve({ id: savings.id }),
  });
  expect(bad.status).toBe(400);
  expect((await bad.json()).error).toBeTruthy();
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npx jest src/app/api/__tests__/api.test.ts`
Expected: FAIL — route modules don't exist.

- [ ] **Step 3: Write the HTTP error mapper**

Create `src/lib/httpErrors.ts`:
```ts
import { NotFoundError, OverdraftError, ValidationError } from './errors';

export function errorResponse(err: unknown): Response {
  if (err instanceof ValidationError || err instanceof OverdraftError) {
    return Response.json({ error: err.message }, { status: 400 });
  }
  if (err instanceof NotFoundError) {
    return Response.json({ error: err.message }, { status: 404 });
  }
  return Response.json({ error: 'unexpected error' }, { status: 500 });
}
```

- [ ] **Step 4: Write the route handlers**

Create `src/app/api/accounts/route.ts`:
```ts
import { getStore } from '@/db';
import { createAccount, listAccounts } from '@/lib/accounts';
import { today } from '@/lib/clock';
import { ValidationError } from '@/lib/errors';
import { errorResponse } from '@/lib/httpErrors';

export async function GET(): Promise<Response> {
  return Response.json(await listAccounts(getStore()));
}

export async function POST(req: Request): Promise<Response> {
  try {
    const body = await req.json();
    if (typeof body?.name !== 'string' || !body.name.trim() || typeof body?.avatarId !== 'string') {
      throw new ValidationError('name and avatarId are required');
    }
    const account = await createAccount(
      getStore(),
      { name: body.name.trim(), avatarId: body.avatarId },
      today(),
    );
    return Response.json(account, { status: 201 });
  } catch (err) {
    return errorResponse(err);
  }
}
```

Create `src/app/api/accounts/[id]/route.ts`:
```ts
import { getStore } from '@/db';
import { updateAccount } from '@/lib/accounts';
import { errorResponse } from '@/lib/httpErrors';

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }): Promise<Response> {
  try {
    const { id } = await ctx.params;
    const patch = await req.json();
    return Response.json(await updateAccount(getStore(), id, patch));
  } catch (err) {
    return errorResponse(err);
  }
}
```

Create `src/app/api/accounts/[id]/wallets/route.ts`:
```ts
import { getStore } from '@/db';
import { getWalletsForAccount } from '@/lib/wallets';
import { today } from '@/lib/clock';

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }): Promise<Response> {
  const { id } = await ctx.params;
  return Response.json(await getWalletsForAccount(getStore(), id, today()));
}
```

Create `src/app/api/wallets/[id]/route.ts`:
```ts
import { getStore } from '@/db';
import { getWallet } from '@/lib/wallets';
import { today } from '@/lib/clock';
import { errorResponse } from '@/lib/httpErrors';

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }): Promise<Response> {
  try {
    const { id } = await ctx.params;
    return Response.json(await getWallet(getStore(), id, today()));
  } catch (err) {
    return errorResponse(err);
  }
}
```

Create `src/app/api/wallets/[id]/transactions/route.ts`:
```ts
import { getStore } from '@/db';
import { addTransaction } from '@/lib/transactions';
import { today } from '@/lib/clock';
import { shekelsToAgorot } from '@/lib/money';
import { ValidationError } from '@/lib/errors';
import { errorResponse } from '@/lib/httpErrors';

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }): Promise<Response> {
  try {
    const { id } = await ctx.params;
    const body = await req.json();
    if (body?.type !== 'deposit' && body?.type !== 'withdrawal') {
      throw new ValidationError('type must be deposit or withdrawal');
    }
    if (typeof body?.amount !== 'number' || body.amount <= 0) {
      throw new ValidationError('amount must be a positive number of shekels');
    }
    const tx = await addTransaction(
      getStore(),
      id,
      { type: body.type, amount: shekelsToAgorot(body.amount) },
      today(),
    );
    return Response.json(tx, { status: 201 });
  } catch (err) {
    return errorResponse(err);
  }
}
```

- [ ] **Step 5: Run the API test — PASS**

Run: `npx jest src/app/api/__tests__/api.test.ts`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/lib/httpErrors.ts src/app/api src/app/api/__tests__/api.test.ts
git commit -m "feat: add thin API route handlers for accounts, wallets, transactions"
```

---

## Task 13: Theme — tokens, registry, MUI theme builder, ThemeProvider

**Files:**
- Create: `src/theme/types.ts`, `src/theme/themes/sunshineQuest.ts`, `src/theme/registry.ts`, `src/theme/buildMuiTheme.ts`, `src/theme/ThemeProvider.tsx`
- Test: `src/theme/__tests__/buildMuiTheme.test.ts`

**Interfaces:**
- Produces: `interface ThemeTokens`; `sunshineQuest: ThemeTokens`; `THEME_REGISTRY: Record<string, ThemeTokens>` with default key `'sunshine-quest'`; `buildMuiTheme(tokens: ThemeTokens, direction: 'rtl' | 'ltr'): Theme`; `ThemeProvider({ direction, children }): JSX.Element` (uses default theme for MVP).

- [ ] **Step 1: Write the failing test**

Create `src/theme/__tests__/buildMuiTheme.test.ts`:
```ts
import { buildMuiTheme } from '../buildMuiTheme';
import { sunshineQuest } from '../themes/sunshineQuest';

describe('buildMuiTheme', () => {
  it('applies the fixed typography scale and direction', () => {
    const theme = buildMuiTheme(sunshineQuest, 'rtl');
    expect(theme.direction).toBe('rtl');
    expect(theme.typography.h2.fontSize).toBe('22px');
    expect(theme.typography.body1.fontSize).toBe('16px');
    expect(theme.typography.overline.fontSize).toBe('11px');
    expect(theme.palette.primary.main).toBe(sunshineQuest.primary);
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npx jest src/theme/__tests__/buildMuiTheme.test.ts`
Expected: FAIL — modules missing.

- [ ] **Step 3: Write tokens + builder**

Create `src/theme/types.ts`:
```ts
export interface ThemeTokens {
  appBgGradient: string;
  surface: string;
  primary: string;
  primaryHi: string;
  primaryShadow: string;
  accentGold: string;
  success: string;
  text: string;
  textOnDark: string;
  textMuted: string;
}
```

Create `src/theme/themes/sunshineQuest.ts` (values from `visual-palettes.md`, palette C):
```ts
import type { ThemeTokens } from '../types';

export const sunshineQuest: ThemeTokens = {
  appBgGradient: 'linear-gradient(160deg,#FFC34D 0%,#FF8A4C 40%,#E94E89 100%)',
  surface: '#FFFFFF',
  primary: '#6B2C8E',
  primaryHi: '#8A3AAE',
  primaryShadow: '#4A1A6E',
  accentGold: '#FFD23F',
  success: '#2E7D32',
  text: '#3a1f5a',
  textOnDark: '#FFFFFF',
  textMuted: '#8A7AA7',
};
```

Create `src/theme/registry.ts`:
```ts
import type { ThemeTokens } from './types';
import { sunshineQuest } from './themes/sunshineQuest';

export const DEFAULT_THEME_ID = 'sunshine-quest';
export const THEME_REGISTRY: Record<string, ThemeTokens> = {
  'sunshine-quest': sunshineQuest,
};
```

Create `src/theme/buildMuiTheme.ts`:
```ts
import { createTheme, type Theme } from '@mui/material/styles';
import type { ThemeTokens } from './types';

const DISPLAY_FONT = "'Fredoka', 'Rubik', sans-serif";
const BODY_FONT = "'Rubik', 'Roboto', sans-serif";

export function buildMuiTheme(tokens: ThemeTokens, direction: 'rtl' | 'ltr'): Theme {
  return createTheme({
    direction,
    palette: {
      primary: { main: tokens.primary, dark: tokens.primaryShadow, light: tokens.primaryHi },
      success: { main: tokens.success },
      background: { default: tokens.surface, paper: tokens.surface },
      text: { primary: tokens.text, secondary: tokens.textMuted },
    },
    typography: {
      fontFamily: BODY_FONT,
      h1: { fontFamily: DISPLAY_FONT, fontSize: '54px', fontWeight: 700 },
      h2: { fontFamily: DISPLAY_FONT, fontSize: '22px', fontWeight: 700 },
      h3: { fontFamily: DISPLAY_FONT, fontSize: '18px', fontWeight: 700 },
      subtitle1: { fontSize: '13px', fontWeight: 500 },
      body1: { fontSize: '16px', fontWeight: 400 },
      caption: { fontSize: '12px', fontWeight: 500 },
      overline: { fontSize: '11px', fontWeight: 600, textTransform: 'uppercase' },
    },
  });
}
```

- [ ] **Step 4: Run the theme test — PASS**

Run: `npx jest src/theme/__tests__/buildMuiTheme.test.ts`
Expected: PASS.

- [ ] **Step 5: Write ThemeProvider (emotion cache + MUI)**

Create `src/theme/ThemeProvider.tsx`:
```tsx
'use client';

import { useMemo, type ReactNode } from 'react';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material';
import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';
import { buildMuiTheme } from './buildMuiTheme';
import { THEME_REGISTRY, DEFAULT_THEME_ID } from './registry';

export function ThemeProvider({
  direction,
  children,
}: {
  direction: 'rtl' | 'ltr';
  children: ReactNode;
}): JSX.Element {
  const cache = useMemo(
    () =>
      createCache({
        key: direction === 'rtl' ? 'mui-rtl' : 'mui-ltr',
        stylisPlugins: direction === 'rtl' ? [prefixer, rtlPlugin] : [prefixer],
      }),
    [direction],
  );
  const theme = useMemo(() => buildMuiTheme(THEME_REGISTRY[DEFAULT_THEME_ID], direction), [direction]);

  return (
    <CacheProvider value={cache}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </CacheProvider>
  );
}
```

- [ ] **Step 6: Type-check**

Run: `npx tsc --noEmit`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/theme
git commit -m "feat: add dynamic theme registry, MUI theme builder, ThemeProvider"
```

---

## Task 14: i18n — dictionaries + LocaleProvider

**Files:**
- Create: `src/i18n/he.json`, `src/i18n/en.json`, `src/i18n/LocaleProvider.tsx`
- Test: `src/i18n/__tests__/i18n.test.tsx`, `src/i18n/__tests__/keys.test.ts`

**Interfaces:**
- Produces: `LocaleProvider({ children }): JSX.Element` (default locale `he`, direction `rtl`); `useTranslation(): { t: (key: string) => string; locale: 'he' | 'en'; direction: 'rtl' | 'ltr' }`.

- [ ] **Step 1: Write the failing tests**

Create `src/i18n/__tests__/keys.test.ts`:
```ts
import he from '../he.json';
import en from '../en.json';

it('he and en have identical key sets', () => {
  expect(Object.keys(he).sort()).toEqual(Object.keys(en).sort());
});
```

Create `src/i18n/__tests__/i18n.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react';
import { LocaleProvider, useTranslation } from '../LocaleProvider';

function Probe(): JSX.Element {
  const { t, direction } = useTranslation();
  return <div data-testid="probe" data-dir={direction}>{t('createAccount')}</div>;
}

it('provides he translations and rtl by default', () => {
  render(
    <LocaleProvider>
      <Probe />
    </LocaleProvider>,
  );
  const el = screen.getByTestId('probe');
  expect(el.getAttribute('data-dir')).toBe('rtl');
  expect(el.textContent).toBe('צור חשבון');
});
```

- [ ] **Step 2: Run to verify they fail**

Run: `npx jest src/i18n`
Expected: FAIL — modules missing.

- [ ] **Step 3: Write dictionaries + provider**

Create `src/i18n/he.json`:
```json
{
  "createAccount": "צור חשבון",
  "emptyStateTitle": "בואו ניצור חשבון ראשון",
  "nameLabel": "שם",
  "namePlaceholder": "איך קוראים לך?",
  "chooseAvatar": "בחרו דמות",
  "createAccountCta": "יצירת חשבון",
  "newAction": "פעולה חדשה",
  "deposit": "הפקדה",
  "withdrawal": "משיכה",
  "amountLabel": "סכום (₪)",
  "submit": "אישור",
  "cancel": "ביטול",
  "totalInBucket": "סך הכל בקופה",
  "depositsLabel": "הפקדות",
  "interestGainLabel": "רווח מריבית",
  "todayInterestLabel": "היום קיבלת מהריבית:",
  "wallet.savings": "חיסכון",
  "wallet.spending": "בזבוזים",
  "wallet.goodDeeds": "מעשים טובים",
  "savingsEyebrow": "החיסכון שלך",
  "errorGeneric": "משהו השתבש, נסו שוב",
  "notEnough": "אין מספיק בקופה"
}
```

Create `src/i18n/en.json`:
```json
{
  "createAccount": "Create account",
  "emptyStateTitle": "Let's create your first account",
  "nameLabel": "Name",
  "namePlaceholder": "What's your name?",
  "chooseAvatar": "Choose a character",
  "createAccountCta": "Create account",
  "newAction": "New action",
  "deposit": "Deposit",
  "withdrawal": "Withdrawal",
  "amountLabel": "Amount (₪)",
  "submit": "Confirm",
  "cancel": "Cancel",
  "totalInBucket": "Total in wallet",
  "depositsLabel": "Deposits",
  "interestGainLabel": "Interest earned",
  "todayInterestLabel": "Today you earned:",
  "wallet.savings": "Savings",
  "wallet.spending": "Spending",
  "wallet.goodDeeds": "Good deeds",
  "savingsEyebrow": "Your savings",
  "errorGeneric": "Something went wrong, try again",
  "notEnough": "Not enough in this wallet"
}
```

Create `src/i18n/LocaleProvider.tsx`:
```tsx
'use client';

import { createContext, useContext, type ReactNode } from 'react';
import he from './he.json';
import en from './en.json';

type Locale = 'he' | 'en';
type Dictionary = Record<string, string>;
const DICTIONARIES: Record<Locale, Dictionary> = { he, en };

interface LocaleValue {
  t: (key: string) => string;
  locale: Locale;
  direction: 'rtl' | 'ltr';
}

const LocaleContext = createContext<LocaleValue | null>(null);

export function LocaleProvider({
  locale = 'he',
  children,
}: {
  locale?: Locale;
  children: ReactNode;
}): JSX.Element {
  const dictionary = DICTIONARIES[locale];
  const value: LocaleValue = {
    locale,
    direction: locale === 'he' ? 'rtl' : 'ltr',
    t: (key: string) => dictionary[key] ?? key,
  };
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useTranslation(): LocaleValue {
  const value = useContext(LocaleContext);
  if (!value) throw new Error('useTranslation must be used within LocaleProvider');
  return value;
}
```

- [ ] **Step 4: Run i18n tests — PASS**

Run: `npx jest src/i18n`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/i18n
git commit -m "feat: add i18n dictionaries (he default) and LocaleProvider"
```

---

## Task 15: Providers + root layout

**Files:**
- Create: `src/app/providers.tsx`
- Modify: `src/app/layout.tsx`

**Interfaces:**
- Consumes: `LocaleProvider`/`useTranslation` (Task 14), `ThemeProvider` (Task 13).
- Produces: `Providers({ children }): JSX.Element` wiring `QueryClientProvider → LocaleProvider → ThemeProvider(direction)`.

- [ ] **Step 1: Write Providers**

Create `src/app/providers.tsx`:
```tsx
'use client';

import { useState, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LocaleProvider, useTranslation } from '@/i18n/LocaleProvider';
import { ThemeProvider } from '@/theme/ThemeProvider';

function ThemedByLocale({ children }: { children: ReactNode }): JSX.Element {
  const { direction } = useTranslation();
  return <ThemeProvider direction={direction}>{children}</ThemeProvider>;
}

export function Providers({ children }: { children: ReactNode }): JSX.Element {
  const [client] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={client}>
      <LocaleProvider>
        <ThemedByLocale>{children}</ThemedByLocale>
      </LocaleProvider>
    </QueryClientProvider>
  );
}
```

- [ ] **Step 2: Wire the root layout**

Replace `src/app/layout.tsx` with:
```tsx
import type { ReactNode } from 'react';
import { Providers } from './providers';

export const metadata = { title: 'fun-saver' };

export default function RootLayout({ children }: { children: ReactNode }): JSX.Element {
  return (
    <html lang="he" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Rubik:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

- [ ] **Step 3: Type-check + build**

Run: `npx tsc --noEmit && npm run build`
Expected: PASS (build compiles).

- [ ] **Step 4: Commit**

```bash
git add src/app/providers.tsx src/app/layout.tsx
git commit -m "feat: wire QueryClient + Locale + Theme providers into root layout"
```

---

## Task 16: Data hooks (React Query)

**Files:**
- Create: `src/hooks/apiClient.ts`, `src/hooks/useAccounts.ts`, `src/hooks/useWallets.ts`, `src/hooks/useCreateAccount.ts`, `src/hooks/useAddTransaction.ts`
- Test: `src/hooks/__tests__/apiClient.test.ts`

**Interfaces:**
- Consumes: `Account`, `WalletWithDerived` (Task 1).
- Produces:
  - `fetchJson<T>(url: string, init?: RequestInit): Promise<T>` (adds `cache: 'no-store'`; throws `Error(message)` from `{ error }` on non-2xx).
  - `useAccounts()` → `UseQueryResult<Account[]>`.
  - `useWallets(accountId: string | null)` → `UseQueryResult<WalletWithDerived[]>` (disabled when null).
  - `useCreateAccount()` → mutation `(input: { name: string; avatarId: string }) => Promise<Account>`, invalidates `['accounts']`.
  - `useAddTransaction(accountId: string)` → mutation `(input: { walletId: string; type: 'deposit' | 'withdrawal'; amount: number }) => Promise<void>`, invalidates `['wallets', accountId]`.

- [ ] **Step 1: Write the failing apiClient test**

Create `src/hooks/__tests__/apiClient.test.ts`:
```ts
import { fetchJson } from '../apiClient';

describe('fetchJson', () => {
  afterEach(() => jest.restoreAllMocks());
  it('returns parsed JSON on success', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ ok: 1 }), { status: 200 }),
    );
    expect(await fetchJson('/x')).toEqual({ ok: 1 });
  });
  it('throws the API error message on failure', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ error: 'not enough in this wallet' }), { status: 400 }),
    );
    await expect(fetchJson('/x')).rejects.toThrow('not enough in this wallet');
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npx jest src/hooks/__tests__/apiClient.test.ts`
Expected: FAIL — module missing.

- [ ] **Step 3: Write the hooks**

Create `src/hooks/apiClient.ts`:
```ts
export async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, { cache: 'no-store', ...init });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((body as { error?: string }).error ?? 'request failed');
  return body as T;
}
```

Create `src/hooks/useAccounts.ts`:
```ts
'use client';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import type { Account } from '@/lib/types';
import { fetchJson } from './apiClient';

export function useAccounts(): UseQueryResult<Account[]> {
  return useQuery({ queryKey: ['accounts'], queryFn: () => fetchJson<Account[]>('/api/accounts') });
}
```

Create `src/hooks/useWallets.ts`:
```ts
'use client';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import type { WalletWithDerived } from '@/lib/types';
import { fetchJson } from './apiClient';

export function useWallets(accountId: string | null): UseQueryResult<WalletWithDerived[]> {
  return useQuery({
    queryKey: ['wallets', accountId],
    enabled: accountId !== null,
    queryFn: () => fetchJson<WalletWithDerived[]>(`/api/accounts/${accountId}/wallets`),
  });
}
```

Create `src/hooks/useCreateAccount.ts`:
```ts
'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Account } from '@/lib/types';
import { fetchJson } from './apiClient';

export function useCreateAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: { name: string; avatarId: string }) =>
      fetchJson<Account>('/api/accounts', { method: 'POST', body: JSON.stringify(input) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['accounts'] }),
  });
}
```

Create `src/hooks/useAddTransaction.ts`:
```ts
'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchJson } from './apiClient';

export function useAddTransaction(accountId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: { walletId: string; type: 'deposit' | 'withdrawal'; amount: number }) =>
      fetchJson<unknown>(`/api/wallets/${input.walletId}/transactions`, {
        method: 'POST',
        body: JSON.stringify({ type: input.type, amount: input.amount }),
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['wallets', accountId] }),
  });
}
```

- [ ] **Step 4: Run apiClient test — PASS**

Run: `npx jest src/hooks/__tests__/apiClient.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/hooks
git commit -m "feat: add React Query data hooks and fetchJson client"
```

---

## Task 17: Presentational — Money and CoinRow

**Files:**
- Create: `src/components/Money/{Money.tsx,Money.test.tsx,constants.ts,index.ts}`
- Create: `src/components/CoinRow/{CoinRow.tsx,CoinRow.test.tsx,constants.ts,index.ts}`

**Interfaces:**
- Consumes: `agorotToShekels`, `coinBreakdown` (Task 4).
- Produces: `Money({ amountAgorot, testId }): JSX.Element` (renders ₪ + shekel number); `CoinRow({ todayInterestAgorot }): JSX.Element` (full + optional half coin; renders nothing visible when hidden).

- [ ] **Step 1: Write failing Money test**

Create `src/components/Money/constants.ts`:
```ts
export const MONEY_TEST_ID = 'money';
export const CURRENCY_SYMBOL = '₪';
```

Create `src/components/Money/Money.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react';
import { Money } from './Money';

describe('Money', () => {
  it('renders the shekel value with the currency symbol', () => {
    render(<Money amountAgorot={8550} testId="bal" />);
    const el = screen.getByTestId('bal');
    expect(el.textContent).toContain('₪');
    expect(el.textContent).toContain('85.5');
  });
  it('renders zero for an empty wallet', () => {
    render(<Money amountAgorot={0} testId="bal" />);
    expect(screen.getByTestId('bal').textContent).toContain('0');
  });
});
```

- [ ] **Step 2: Run — fails**

Run: `npx jest src/components/Money`
Expected: FAIL — module missing.

- [ ] **Step 3: Implement Money**

Create `src/components/Money/Money.tsx`:
```tsx
import { Box } from '@mui/material';
import { agorotToShekels } from '@/lib/money';
import { CURRENCY_SYMBOL } from './constants';

export function Money({ amountAgorot, testId }: { amountAgorot: number; testId: string }): JSX.Element {
  const shekels = agorotToShekels(amountAgorot);
  return (
    <Box component="span" data-testid={testId} sx={{ display: 'inline-flex', alignItems: 'baseline', direction: 'ltr' }}>
      <Box component="span" sx={{ fontSize: '0.4em', opacity: 0.65, position: 'relative', top: '0.35em', mr: '2px' }}>
        {CURRENCY_SYMBOL}
      </Box>
      <Box component="span" sx={{ fontVariantNumeric: 'tabular-nums' }}>
        {Number.isInteger(shekels) ? shekels : shekels.toFixed(2).replace(/\.?0+$/, '')}
      </Box>
    </Box>
  );
}
```

Create `src/components/Money/index.ts`:
```ts
export { Money } from './Money';
```

- [ ] **Step 4: Run — pass**

Run: `npx jest src/components/Money`
Expected: PASS.

- [ ] **Step 5: Write failing CoinRow test**

Create `src/components/CoinRow/constants.ts`:
```ts
export const COIN_ROW_TEST_ID = 'coin-row';
export const FULL_COIN_TEST_ID = 'coin-full';
export const HALF_COIN_TEST_ID = 'coin-half';
```

Create `src/components/CoinRow/CoinRow.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react';
import { CoinRow } from './CoinRow';

describe('CoinRow', () => {
  it('shows floor full coins plus a half coin', () => {
    render(<CoinRow todayInterestAgorot={550} />); // 5.5
    expect(screen.getAllByTestId('coin-full')).toHaveLength(5);
    expect(screen.getAllByTestId('coin-half')).toHaveLength(1);
  });
  it('renders nothing when rounded value is zero', () => {
    render(<CoinRow todayInterestAgorot={20} />); // 0.2 -> 0
    expect(screen.queryByTestId('coin-row')).toBeNull();
  });
});
```

- [ ] **Step 6: Run — fails**

Run: `npx jest src/components/CoinRow`
Expected: FAIL — module missing.

- [ ] **Step 7: Implement CoinRow**

Create `src/components/CoinRow/CoinRow.tsx`:
```tsx
import { Box } from '@mui/material';
import { coinBreakdown } from '@/lib/money';
import { COIN_ROW_TEST_ID, FULL_COIN_TEST_ID, HALF_COIN_TEST_ID } from './constants';

export function CoinRow({ todayInterestAgorot }: { todayInterestAgorot: number }): JSX.Element | null {
  const { show, full, half } = coinBreakdown(todayInterestAgorot);
  if (!show) return null;
  return (
    <Box data-testid={COIN_ROW_TEST_ID} sx={{ display: 'inline-flex', gap: '5px', direction: 'ltr' }}>
      {Array.from({ length: full }, (_, i) => (
        <Box key={i} data-testid={FULL_COIN_TEST_ID} aria-label="coin" sx={{ fontSize: '24px' }}>
          🪙
        </Box>
      ))}
      {half && (
        <Box data-testid={HALF_COIN_TEST_ID} aria-label="half coin" sx={{ fontSize: '24px', clipPath: 'inset(0 0 0 50%)' }}>
          🪙
        </Box>
      )}
    </Box>
  );
}
```

Create `src/components/CoinRow/index.ts`:
```ts
export { CoinRow } from './CoinRow';
```

- [ ] **Step 8: Run — pass**

Run: `npx jest src/components/CoinRow`
Expected: PASS.

- [ ] **Step 9: Commit**

```bash
git add src/components/Money src/components/CoinRow
git commit -m "feat: add Money and CoinRow presentational components"
```

---

## Task 18: AvatarPicker

**Files:**
- Create: `src/components/AvatarPicker/{AvatarPicker.tsx,AvatarPicker.test.tsx,constants.ts,index.ts}`

**Interfaces:**
- Produces: `AVATAR_IDS: string[]` (`kid-01`..`kid-20`); `AvatarPicker({ value, onChange }): JSX.Element` — grid of selectable avatars rendering `/avatars/<id>.svg`, each `data-testid="avatar-option"`, selected one marked `aria-pressed`.

- [ ] **Step 1: Write the failing test**

Create `src/components/AvatarPicker/constants.ts`:
```ts
export const AVATAR_OPTION_TEST_ID = 'avatar-option';
export const AVATAR_IDS: string[] = Array.from({ length: 20 }, (_, i) => `kid-${String(i + 1).padStart(2, '0')}`);
```

Create `src/components/AvatarPicker/AvatarPicker.test.tsx`:
```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { AvatarPicker } from './AvatarPicker';
import { AVATAR_IDS } from './constants';

describe('AvatarPicker', () => {
  it('renders all bundled avatars and reports selection', () => {
    const onChange = jest.fn();
    render(<AvatarPicker value={null} onChange={onChange} />);
    const options = screen.getAllByTestId('avatar-option');
    expect(options).toHaveLength(AVATAR_IDS.length);
    fireEvent.click(options[2]);
    expect(onChange).toHaveBeenCalledWith('kid-03');
  });
  it('marks the selected avatar as pressed', () => {
    render(<AvatarPicker value="kid-05" onChange={() => undefined} />);
    const pressed = screen.getAllByTestId('avatar-option').filter((b) => b.getAttribute('aria-pressed') === 'true');
    expect(pressed).toHaveLength(1);
  });
});
```

- [ ] **Step 2: Run — fails**

Run: `npx jest src/components/AvatarPicker`
Expected: FAIL — module missing.

- [ ] **Step 3: Implement AvatarPicker**

Create `src/components/AvatarPicker/AvatarPicker.tsx`:
```tsx
import { Box, ButtonBase } from '@mui/material';
import { AVATAR_IDS, AVATAR_OPTION_TEST_ID } from './constants';

export function AvatarPicker({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (avatarId: string) => void;
}): JSX.Element {
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1.5 }}>
      {AVATAR_IDS.map((id) => (
        <ButtonBase
          key={id}
          data-testid={AVATAR_OPTION_TEST_ID}
          aria-pressed={value === id}
          onClick={() => onChange(id)}
          sx={{
            borderRadius: '50%',
            border: value === id ? '3px solid' : '3px solid transparent',
            borderColor: value === id ? 'primary.main' : 'transparent',
            overflow: 'hidden',
          }}
        >
          {/* bundled offline asset from public/avatars */}
          <Box component="img" src={`/avatars/${id}.svg`} alt="" sx={{ width: '100%', display: 'block' }} />
        </ButtonBase>
      ))}
    </Box>
  );
}
```

Create `src/components/AvatarPicker/index.ts`:
```ts
export { AvatarPicker, AVATAR_IDS } from './AvatarPicker';
```
(Re-export `AVATAR_IDS` from constants via `AvatarPicker.tsx`? Instead export from index directly:)
```ts
export { AvatarPicker } from './AvatarPicker';
export { AVATAR_IDS } from './constants';
```

- [ ] **Step 4: Run — pass**

Run: `npx jest src/components/AvatarPicker`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/AvatarPicker
git commit -m "feat: add AvatarPicker over bundled kid avatars"
```

---

## Task 19: AccountForm (empty state + create flow)

**Files:**
- Create: `src/components/AccountForm/{AccountForm.tsx,AccountForm.test.tsx,constants.ts,index.ts}`

**Interfaces:**
- Consumes: `AvatarPicker` + `AVATAR_IDS` (Task 18), `useCreateAccount` (Task 16), `useTranslation` (Task 14), `Money`? no.
- Produces: `AccountForm({ onCreated }): JSX.Element` — container `data-testid="empty-state"`, title (`h2`, `t('createAccount')`), name input `data-testid="account-name-input"`, `AvatarPicker`, submit `data-testid="create-account-submit"` (disabled until name + avatar chosen). On success calls `onCreated(account.id)`.

- [ ] **Step 1: Write the failing test**

Create `src/components/AccountForm/constants.ts`:
```ts
export const EMPTY_STATE_TEST_ID = 'empty-state';
export const NAME_INPUT_TEST_ID = 'account-name-input';
export const SUBMIT_TEST_ID = 'create-account-submit';
```

Create `src/components/AccountForm/AccountForm.test.tsx`:
```tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LocaleProvider } from '@/i18n/LocaleProvider';
import { AccountForm } from './AccountForm';

const mutateAsync = jest.fn().mockResolvedValue({ id: 'a1', name: 'נועה', avatarId: 'kid-01', isActive: true });
jest.mock('@/hooks/useCreateAccount', () => ({
  useCreateAccount: () => ({ mutateAsync, isPending: false }),
}));

function setup(onCreated = jest.fn()) {
  render(
    <LocaleProvider>
      <AccountForm onCreated={onCreated} />
    </LocaleProvider>,
  );
  return { onCreated };
}

describe('AccountForm', () => {
  beforeEach(() => mutateAsync.mockClear());
  it('renders the empty state with a disabled submit until name + avatar', () => {
    setup();
    expect(screen.getByTestId('empty-state')).toBeInTheDocument();
    expect(screen.getByTestId('create-account-submit')).toBeDisabled();
  });
  it('creates an account and reports the new id', async () => {
    const { onCreated } = setup();
    fireEvent.change(screen.getByTestId('account-name-input'), { target: { value: 'נועה' } });
    fireEvent.click(screen.getAllByTestId('avatar-option')[0]);
    fireEvent.click(screen.getByTestId('create-account-submit'));
    await waitFor(() => expect(mutateAsync).toHaveBeenCalledWith({ name: 'נועה', avatarId: 'kid-01' }));
    await waitFor(() => expect(onCreated).toHaveBeenCalledWith('a1'));
  });
});
```

- [ ] **Step 2: Run — fails**

Run: `npx jest src/components/AccountForm`
Expected: FAIL — module missing.

- [ ] **Step 3: Implement AccountForm**

Create `src/components/AccountForm/AccountForm.tsx`:
```tsx
'use client';

import { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useTranslation } from '@/i18n/LocaleProvider';
import { useCreateAccount } from '@/hooks/useCreateAccount';
import { AvatarPicker } from '@/components/AvatarPicker';
import { EMPTY_STATE_TEST_ID, NAME_INPUT_TEST_ID, SUBMIT_TEST_ID } from './constants';

export function AccountForm({ onCreated }: { onCreated: (accountId: string) => void }): JSX.Element {
  const { t } = useTranslation();
  const create = useCreateAccount();
  const [name, setName] = useState('');
  const [avatarId, setAvatarId] = useState<string | null>(null);

  const submit = async (): Promise<void> => {
    if (!name.trim() || !avatarId) return;
    const account = await create.mutateAsync({ name: name.trim(), avatarId });
    onCreated(account.id);
  };

  return (
    <Box data-testid={EMPTY_STATE_TEST_ID} sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h2">{t('createAccount')}</Typography>
      <TextField
        variant="outlined"
        label={t('nameLabel')}
        placeholder={t('namePlaceholder')}
        value={name}
        onChange={(e) => setName(e.target.value)}
        slotProps={{ htmlInput: { 'data-testid': NAME_INPUT_TEST_ID } }}
      />
      <Typography variant="overline">{t('chooseAvatar')}</Typography>
      <AvatarPicker value={avatarId} onChange={setAvatarId} />
      <Button
        data-testid={SUBMIT_TEST_ID}
        variant="contained"
        disabled={!name.trim() || !avatarId || create.isPending}
        onClick={submit}
        sx={{ borderRadius: 999, alignSelf: 'center', px: 4, py: 1.5 }}
      >
        {t('createAccountCta')}
      </Button>
    </Box>
  );
}
```

Create `src/components/AccountForm/index.ts`:
```ts
export { AccountForm } from './AccountForm';
```

- [ ] **Step 4: Run — pass**

Run: `npx jest src/components/AccountForm`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/AccountForm
git commit -m "feat: add AccountForm empty-state create flow"
```

---

## Task 20: Dashboard pieces — Ribbon, WalletCard, WalletList, WalletHero

**Files:**
- Create: `src/components/Ribbon/{Ribbon.tsx,Ribbon.test.tsx,constants.ts,index.ts}`
- Create: `src/components/WalletCard/{WalletCard.tsx,WalletCard.test.tsx,constants.ts,index.ts}`
- Create: `src/components/WalletList/{WalletList.tsx,WalletList.test.tsx,constants.ts,index.ts}`
- Create: `src/components/WalletHero/{WalletHero.tsx,WalletHero.test.tsx,constants.ts,index.ts}`

**Interfaces:**
- Consumes: `Money` (Task 17), `CoinRow` (Task 17), `useTranslation` (Task 14), `WalletWithDerived` (Task 1).
- Produces:
  - `Ribbon({ name, avatarId }): JSX.Element` — `data-testid="ribbon-name"`, `data-testid="ribbon-avatar"`, plus a presentational ☰ button (`data-testid="menu-button"`, no menu in MVP).
  - `WalletCard({ wallet }): JSX.Element` — `data-testid="wallet-card"`; balance via `<Money testId="wallet-balance" />`.
  - `WalletList({ wallets }): JSX.Element`.
  - `WalletHero({ wallet }): JSX.Element` — `data-testid="wallet-hero"`; hero balance via `<Money testId="wallet-balance" />`; `CoinRow`; deposits (`principal`) + `interestGain`.

- [ ] **Step 1: Ribbon — failing test**

Create `src/components/Ribbon/constants.ts`:
```ts
export const RIBBON_NAME_TEST_ID = 'ribbon-name';
export const RIBBON_AVATAR_TEST_ID = 'ribbon-avatar';
export const MENU_BUTTON_TEST_ID = 'menu-button';
```

Create `src/components/Ribbon/Ribbon.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react';
import { Ribbon } from './Ribbon';

beforeEach(() => render(<Ribbon name="נועה" avatarId="kid-03" />));

describe('Ribbon', () => {
  it('shows the account name only', () => {
    expect(screen.getByTestId('ribbon-name').textContent).toBe('נועה');
  });
  it('shows the account avatar', () => {
    const img = screen.getByTestId('ribbon-avatar').querySelector('img');
    expect(img?.getAttribute('src')).toBe('/avatars/kid-03.svg');
  });
});
```

- [ ] **Step 2: Run — fails**

Run: `npx jest src/components/Ribbon`
Expected: FAIL — module missing.

- [ ] **Step 3: Implement Ribbon**

Create `src/components/Ribbon/Ribbon.tsx`:
```tsx
import { Box, IconButton, Typography } from '@mui/material';
import { MENU_BUTTON_TEST_ID, RIBBON_AVATAR_TEST_ID, RIBBON_NAME_TEST_ID } from './constants';

export function Ribbon({ name, avatarId }: { name: string; avatarId: string }): JSX.Element {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, bgcolor: 'background.paper', borderRadius: 4, p: 1.25, boxShadow: '0 4px 0 rgba(0,0,0,0.06)' }}>
      {/* Full-screen menu is a Future Phase; button is presentational in MVP */}
      <IconButton data-testid={MENU_BUTTON_TEST_ID} aria-label="menu" disabled sx={{ borderRadius: 2 }}>
        ☰
      </IconButton>
      <Typography data-testid={RIBBON_NAME_TEST_ID} variant="h3" sx={{ flex: 1, textAlign: 'center' }}>
        {name}
      </Typography>
      <Box data-testid={RIBBON_AVATAR_TEST_ID} sx={{ width: 34, height: 34, borderRadius: '50%', overflow: 'hidden' }}>
        <Box component="img" src={`/avatars/${avatarId}.svg`} alt="" sx={{ width: '100%', display: 'block' }} />
      </Box>
    </Box>
  );
}
```

Create `src/components/Ribbon/index.ts`:
```ts
export { Ribbon } from './Ribbon';
```

- [ ] **Step 4: Run — pass**

Run: `npx jest src/components/Ribbon`
Expected: PASS.

- [ ] **Step 5: WalletCard — failing test**

Create `src/components/WalletCard/constants.ts`:
```ts
export const WALLET_CARD_TEST_ID = 'wallet-card';
export const WALLET_BALANCE_TEST_ID = 'wallet-balance';
```

Create `src/components/WalletCard/WalletCard.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react';
import { LocaleProvider } from '@/i18n/LocaleProvider';
import { WalletCard } from './WalletCard';
import type { WalletWithDerived } from '@/lib/types';

const wallet: WalletWithDerived = {
  id: 'w2', accountId: 'a1', name: 'spending', icon: '🛍️', monthlyInterestRate: 0,
  openedAt: '2026-01-01', lastInterestDate: '2026-01-01',
  balance: 0, principal: 0, interestGain: 0, todayInterest: 0,
};

beforeEach(() =>
  render(
    <LocaleProvider>
      <WalletCard wallet={wallet} />
    </LocaleProvider>,
  ),
);

describe('WalletCard', () => {
  it('renders the localized wallet name and a zero balance', () => {
    expect(screen.getByTestId('wallet-card').textContent).toContain('בזבוזים');
    expect(screen.getByTestId('wallet-balance').textContent).toContain('0');
  });
});
```

- [ ] **Step 6: Run — fails**

Run: `npx jest src/components/WalletCard`
Expected: FAIL — module missing.

- [ ] **Step 7: Implement WalletCard**

Create `src/components/WalletCard/WalletCard.tsx`:
```tsx
import { Box, Typography } from '@mui/material';
import { useTranslation } from '@/i18n/LocaleProvider';
import { Money } from '@/components/Money';
import type { WalletWithDerived } from '@/lib/types';
import { WALLET_BALANCE_TEST_ID, WALLET_CARD_TEST_ID } from './constants';

export function WalletCard({ wallet }: { wallet: WalletWithDerived }): JSX.Element {
  const { t } = useTranslation();
  return (
    <Box data-testid={WALLET_CARD_TEST_ID} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, bgcolor: 'background.paper', borderRadius: 4, p: 1.25 }}>
      <Box sx={{ fontSize: 22 }}>{wallet.icon}</Box>
      <Typography variant="body1" sx={{ flex: 1, fontWeight: 600 }}>
        {t(`wallet.${wallet.name}`)}
      </Typography>
      <Money amountAgorot={wallet.balance} testId={WALLET_BALANCE_TEST_ID} />
    </Box>
  );
}
```

Create `src/components/WalletCard/index.ts`:
```ts
export { WalletCard } from './WalletCard';
```

- [ ] **Step 8: Run — pass**

Run: `npx jest src/components/WalletCard`
Expected: PASS.

- [ ] **Step 9: WalletList — test + impl**

Create `src/components/WalletList/constants.ts`:
```ts
export const WALLET_LIST_TEST_ID = 'wallet-list';
```

Create `src/components/WalletList/WalletList.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react';
import { LocaleProvider } from '@/i18n/LocaleProvider';
import { WalletList } from './WalletList';
import type { WalletWithDerived } from '@/lib/types';

const make = (name: WalletWithDerived['name']): WalletWithDerived => ({
  id: name, accountId: 'a1', name, icon: '•', monthlyInterestRate: 0,
  openedAt: '2026-01-01', lastInterestDate: '2026-01-01',
  balance: 0, principal: 0, interestGain: 0, todayInterest: 0,
});

it('renders one card per wallet', () => {
  render(
    <LocaleProvider>
      <WalletList wallets={[make('spending'), make('goodDeeds')]} />
    </LocaleProvider>,
  );
  expect(screen.getAllByTestId('wallet-card')).toHaveLength(2);
});
```

Create `src/components/WalletList/WalletList.tsx`:
```tsx
import { Stack } from '@mui/material';
import { WalletCard } from '@/components/WalletCard';
import type { WalletWithDerived } from '@/lib/types';
import { WALLET_LIST_TEST_ID } from './constants';

export function WalletList({ wallets }: { wallets: WalletWithDerived[] }): JSX.Element {
  return (
    <Stack data-testid={WALLET_LIST_TEST_ID} spacing={1}>
      {wallets.map((wallet) => (
        <WalletCard key={wallet.id} wallet={wallet} />
      ))}
    </Stack>
  );
}
```

Create `src/components/WalletList/index.ts`:
```ts
export { WalletList } from './WalletList';
```

Run: `npx jest src/components/WalletList` → Expected: PASS.

- [ ] **Step 10: WalletHero — test + impl**

Create `src/components/WalletHero/constants.ts`:
```ts
export const WALLET_HERO_TEST_ID = 'wallet-hero';
export const HERO_BALANCE_TEST_ID = 'wallet-balance';
```

Create `src/components/WalletHero/WalletHero.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react';
import { LocaleProvider } from '@/i18n/LocaleProvider';
import { WalletHero } from './WalletHero';
import type { WalletWithDerived } from '@/lib/types';

const savings: WalletWithDerived = {
  id: 'w1', accountId: 'a1', name: 'savings', icon: '🐷', monthlyInterestRate: 0.2,
  openedAt: '2026-01-01', lastInterestDate: '2026-01-01',
  balance: 0, principal: 0, interestGain: 0, todayInterest: 0,
};

beforeEach(() =>
  render(
    <LocaleProvider>
      <WalletHero wallet={savings} />
    </LocaleProvider>,
  ),
);

describe('WalletHero', () => {
  it('renders the hero with a zero balance', () => {
    expect(screen.getByTestId('wallet-hero')).toBeInTheDocument();
    expect(screen.getByTestId('wallet-balance').textContent).toContain('0');
  });
});
```

Create `src/components/WalletHero/WalletHero.tsx`:
```tsx
import { Box, Stack, Typography } from '@mui/material';
import { useTranslation } from '@/i18n/LocaleProvider';
import { Money } from '@/components/Money';
import { CoinRow } from '@/components/CoinRow';
import type { WalletWithDerived } from '@/lib/types';
import { HERO_BALANCE_TEST_ID, WALLET_HERO_TEST_ID } from './constants';

export function WalletHero({ wallet }: { wallet: WalletWithDerived }): JSX.Element {
  const { t } = useTranslation();
  return (
    <Box data-testid={WALLET_HERO_TEST_ID} sx={{ bgcolor: 'background.paper', borderRadius: 6, p: 2.25, textAlign: 'center' }}>
      <Stack direction="row" spacing={1.5} alignItems="center">
        <Box sx={{ fontSize: 36 }}>{wallet.icon}</Box>
        <Box sx={{ textAlign: 'start' }}>
          <Typography variant="overline" color="text.secondary">{t('savingsEyebrow')}</Typography>
          <Typography variant="h3">{t(`wallet.${wallet.name}`)}</Typography>
        </Box>
      </Stack>
      <Typography variant="overline" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
        {t('totalInBucket')}
      </Typography>
      <Typography variant="h1" component="div">
        <Money amountAgorot={wallet.balance} testId={HERO_BALANCE_TEST_ID} />
      </Typography>
      <Box sx={{ mt: 1 }}>
        <CoinRow todayInterestAgorot={wallet.todayInterest} />
      </Box>
      <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="overline" color="text.secondary">{t('depositsLabel')}</Typography>
          <Money amountAgorot={wallet.principal} testId="hero-deposits" />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography variant="overline" color="success.main">{t('interestGainLabel')}</Typography>
          <Money amountAgorot={wallet.interestGain} testId="hero-interest" />
        </Box>
      </Stack>
    </Box>
  );
}
```

Create `src/components/WalletHero/index.ts`:
```ts
export { WalletHero } from './WalletHero';
```

Run: `npx jest src/components/WalletHero` → Expected: PASS.

- [ ] **Step 11: Commit**

```bash
git add src/components/Ribbon src/components/WalletCard src/components/WalletList src/components/WalletHero
git commit -m "feat: add Ribbon, WalletCard, WalletList, WalletHero"
```

---

## Task 21: NewActionButton + TransactionDrawer

**Files:**
- Create: `src/components/NewActionButton/{NewActionButton.tsx,NewActionButton.test.tsx,constants.ts,index.ts}`
- Create: `src/components/TransactionDrawer/{TransactionDrawer.tsx,TransactionDrawer.test.tsx,constants.ts,index.ts}`

**Interfaces:**
- Consumes: `useAddTransaction` (Task 16), `useTranslation` (Task 14), `WalletWithDerived` (Task 1).
- Produces:
  - `NewActionButton({ onClick }): JSX.Element` — `data-testid="new-action"`.
  - `TransactionDrawer({ open, onClose, accountId, wallets }): JSX.Element` — type toggle (`data-testid="tx-type-deposit"`/`"tx-type-withdrawal"`), amount `data-testid="tx-amount"` (shekels), submit `data-testid="tx-submit"`, error banner `data-testid="tx-error"`. Submits `{ walletId, type, amount }` (amount in shekels) and closes on success.

- [ ] **Step 1: NewActionButton — test + impl**

Create `src/components/NewActionButton/constants.ts`:
```ts
export const NEW_ACTION_TEST_ID = 'new-action';
```

Create `src/components/NewActionButton/NewActionButton.test.tsx`:
```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { LocaleProvider } from '@/i18n/LocaleProvider';
import { NewActionButton } from './NewActionButton';

it('fires onClick', () => {
  const onClick = jest.fn();
  render(
    <LocaleProvider>
      <NewActionButton onClick={onClick} />
    </LocaleProvider>,
  );
  fireEvent.click(screen.getByTestId('new-action'));
  expect(onClick).toHaveBeenCalled();
});
```

Create `src/components/NewActionButton/NewActionButton.tsx`:
```tsx
import { Button } from '@mui/material';
import { useTranslation } from '@/i18n/LocaleProvider';
import { NEW_ACTION_TEST_ID } from './constants';

export function NewActionButton({ onClick }: { onClick: () => void }): JSX.Element {
  const { t } = useTranslation();
  return (
    <Button data-testid={NEW_ACTION_TEST_ID} onClick={onClick} variant="contained" sx={{ borderRadius: 999, px: 4, py: 1.5 }}>
      ＋ {t('newAction')}
    </Button>
  );
}
```

Create `src/components/NewActionButton/index.ts`:
```ts
export { NewActionButton } from './NewActionButton';
```

Run: `npx jest src/components/NewActionButton` → Expected: PASS.

- [ ] **Step 2: TransactionDrawer — failing test**

Create `src/components/TransactionDrawer/constants.ts`:
```ts
export const TX_AMOUNT_TEST_ID = 'tx-amount';
export const TX_SUBMIT_TEST_ID = 'tx-submit';
export const TX_ERROR_TEST_ID = 'tx-error';
export const TX_TYPE_DEPOSIT_TEST_ID = 'tx-type-deposit';
export const TX_TYPE_WITHDRAWAL_TEST_ID = 'tx-type-withdrawal';
```

Create `src/components/TransactionDrawer/TransactionDrawer.test.tsx`:
```tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LocaleProvider } from '@/i18n/LocaleProvider';
import { TransactionDrawer } from './TransactionDrawer';
import type { WalletWithDerived } from '@/lib/types';

const mutateAsync = jest.fn();
jest.mock('@/hooks/useAddTransaction', () => ({
  useAddTransaction: () => ({ mutateAsync, isPending: false }),
}));

const wallets: WalletWithDerived[] = [
  { id: 'w1', accountId: 'a1', name: 'savings', icon: '🐷', monthlyInterestRate: 0.2, openedAt: '2026-01-01', lastInterestDate: '2026-01-01', balance: 0, principal: 0, interestGain: 0, todayInterest: 0 },
];

function setup(onClose = jest.fn()) {
  render(
    <LocaleProvider>
      <TransactionDrawer open onClose={onClose} accountId="a1" wallets={wallets} />
    </LocaleProvider>,
  );
  return { onClose };
}

describe('TransactionDrawer', () => {
  beforeEach(() => mutateAsync.mockReset());
  it('submits a deposit in shekels and closes', async () => {
    mutateAsync.mockResolvedValue(undefined);
    const { onClose } = setup();
    fireEvent.change(screen.getByTestId('tx-amount'), { target: { value: '80' } });
    fireEvent.click(screen.getByTestId('tx-submit'));
    await waitFor(() =>
      expect(mutateAsync).toHaveBeenCalledWith({ walletId: 'w1', type: 'deposit', amount: 80 }),
    );
    await waitFor(() => expect(onClose).toHaveBeenCalled());
  });
  it('shows the API error on failure', async () => {
    mutateAsync.mockRejectedValue(new Error('not enough in this wallet'));
    setup();
    fireEvent.change(screen.getByTestId('tx-amount'), { target: { value: '999' } });
    fireEvent.click(screen.getByTestId('tx-submit'));
    await waitFor(() =>
      expect(screen.getByTestId('tx-error').textContent).toContain('not enough in this wallet'),
    );
  });
});
```

- [ ] **Step 3: Run — fails**

Run: `npx jest src/components/TransactionDrawer`
Expected: FAIL — module missing.

- [ ] **Step 4: Implement TransactionDrawer**

Create `src/components/TransactionDrawer/TransactionDrawer.tsx`:
```tsx
'use client';

import { useState } from 'react';
import { Alert, Box, Button, Drawer, MenuItem, Stack, TextField, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { useTranslation } from '@/i18n/LocaleProvider';
import { useAddTransaction } from '@/hooks/useAddTransaction';
import type { WalletWithDerived } from '@/lib/types';
import {
  TX_AMOUNT_TEST_ID, TX_ERROR_TEST_ID, TX_SUBMIT_TEST_ID,
  TX_TYPE_DEPOSIT_TEST_ID, TX_TYPE_WITHDRAWAL_TEST_ID,
} from './constants';

export function TransactionDrawer({
  open, onClose, accountId, wallets,
}: {
  open: boolean;
  onClose: () => void;
  accountId: string;
  wallets: WalletWithDerived[];
}): JSX.Element {
  const { t } = useTranslation();
  const addTransaction = useAddTransaction(accountId);
  const [walletId, setWalletId] = useState(wallets[0]?.id ?? '');
  const [type, setType] = useState<'deposit' | 'withdrawal'>('deposit');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState<string | null>(null);

  const submit = async (): Promise<void> => {
    setError(null);
    const shekels = Number(amount);
    if (!walletId || !(shekels > 0)) {
      setError(t('errorGeneric'));
      return;
    }
    try {
      await addTransaction.mutateAsync({ walletId, type, amount: shekels });
      setAmount('');
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : t('errorGeneric'));
    }
  };

  return (
    <Drawer anchor="bottom" open={open} onClose={onClose}>
      <Box sx={{ p: 2 }}>
        <Stack spacing={2}>
          {error && <Alert data-testid={TX_ERROR_TEST_ID} severity="error">{error}</Alert>}
          <TextField select label={t('newAction')} value={walletId} onChange={(e) => setWalletId(e.target.value)}>
            {wallets.map((w) => (
              <MenuItem key={w.id} value={w.id}>{t(`wallet.${w.name}`)}</MenuItem>
            ))}
          </TextField>
          <ToggleButtonGroup exclusive value={type} onChange={(_e, v) => v && setType(v)} fullWidth>
            <ToggleButton data-testid={TX_TYPE_DEPOSIT_TEST_ID} value="deposit">{t('deposit')}</ToggleButton>
            <ToggleButton data-testid={TX_TYPE_WITHDRAWAL_TEST_ID} value="withdrawal">{t('withdrawal')}</ToggleButton>
          </ToggleButtonGroup>
          <TextField
            type="number"
            label={t('amountLabel')}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            slotProps={{ htmlInput: { 'data-testid': TX_AMOUNT_TEST_ID, min: 0 } }}
          />
          <Button
            data-testid={TX_SUBMIT_TEST_ID}
            variant="contained"
            disabled={addTransaction.isPending}
            onClick={submit}
            sx={{ borderRadius: 999, py: 1.5 }}
          >
            {t('submit')}
          </Button>
        </Stack>
      </Box>
    </Drawer>
  );
}
```

Create `src/components/TransactionDrawer/index.ts`:
```ts
export { TransactionDrawer } from './TransactionDrawer';
```

- [ ] **Step 5: Run — pass**

Run: `npx jest src/components/TransactionDrawer`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/components/NewActionButton src/components/TransactionDrawer
git commit -m "feat: add NewActionButton and TransactionDrawer"
```

---

## Task 22: Dashboard page wiring + README + E2E green

**Files:**
- Modify: `src/theme/buildMuiTheme.ts` (app background gradient via CssBaseline)
- Create: `src/app/page.tsx` (replace skeleton), `src/app/__tests__/page.test.tsx`
- Modify: `README.md`

**Interfaces:**
- Consumes: `useAccounts`, `useWallets` (Task 16); `AccountForm` (19); `Ribbon`, `WalletHero`, `WalletList` (20); `NewActionButton`, `TransactionDrawer` (21); `useTranslation` (14).
- Produces: the `/` route — empty state when no accounts, otherwise the dashboard; the failing E2E from Task 2 now passes.

- [ ] **Step 1: Add the app background gradient to the theme**

In `src/theme/buildMuiTheme.ts`, add a `components` block to the `createTheme({...})` call (after `typography`):
```ts
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: { background: tokens.appBgGradient, minHeight: '100vh' },
        },
      },
    },
```

- [ ] **Step 2: Write the failing page test**

Create `src/app/__tests__/page.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react';
import { LocaleProvider } from '@/i18n/LocaleProvider';
import HomePage from '../page';

const accountsMock = { data: undefined as unknown, isLoading: false, isError: false };
const walletsMock = { data: undefined as unknown, isLoading: false, isError: false };

jest.mock('@/hooks/useAccounts', () => ({ useAccounts: () => accountsMock }));
jest.mock('@/hooks/useWallets', () => ({ useWallets: () => walletsMock }));
jest.mock('@/hooks/useCreateAccount', () => ({ useCreateAccount: () => ({ mutateAsync: jest.fn(), isPending: false }) }));
jest.mock('@/hooks/useAddTransaction', () => ({ useAddTransaction: () => ({ mutateAsync: jest.fn(), isPending: false }) }));

const renderPage = (): void => {
  render(
    <LocaleProvider>
      <HomePage />
    </LocaleProvider>,
  );
};

describe('HomePage', () => {
  it('shows the empty state when there are no accounts', () => {
    accountsMock.data = [];
    walletsMock.data = undefined;
    renderPage();
    expect(screen.getByTestId('empty-state')).toBeInTheDocument();
  });
  it('shows the dashboard when an account exists', () => {
    accountsMock.data = [{ id: 'a1', name: 'נועה', avatarId: 'kid-01', isActive: true }];
    walletsMock.data = [
      { id: 'w1', accountId: 'a1', name: 'savings', icon: '🐷', monthlyInterestRate: 0.2, openedAt: '2026-01-01', lastInterestDate: '2026-01-01', balance: 0, principal: 0, interestGain: 0, todayInterest: 0 },
      { id: 'w2', accountId: 'a1', name: 'spending', icon: '🛍️', monthlyInterestRate: 0, openedAt: '2026-01-01', lastInterestDate: '2026-01-01', balance: 0, principal: 0, interestGain: 0, todayInterest: 0 },
    ];
    renderPage();
    expect(screen.getByTestId('ribbon-name').textContent).toBe('נועה');
    expect(screen.getByTestId('wallet-hero')).toBeInTheDocument();
  });
});
```

- [ ] **Step 3: Run to verify it fails**

Run: `npx jest src/app/__tests__/page.test.tsx`
Expected: FAIL — current `page.tsx` is the skeleton.

- [ ] **Step 4: Write the dashboard page**

Replace `src/app/page.tsx` with:
```tsx
'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { Alert, Box, CircularProgress } from '@mui/material';
import { useAccounts } from '@/hooks/useAccounts';
import { useWallets } from '@/hooks/useWallets';
import { useTranslation } from '@/i18n/LocaleProvider';
import { AccountForm } from '@/components/AccountForm';
import { Ribbon } from '@/components/Ribbon';
import { WalletHero } from '@/components/WalletHero';
import { WalletList } from '@/components/WalletList';
import { NewActionButton } from '@/components/NewActionButton';
import { TransactionDrawer } from '@/components/TransactionDrawer';

const ACTIVE_KEY = 'funsaver.activeAccountId';

function Shell({ children }: { children: ReactNode }): JSX.Element {
  return (
    <Box sx={{ minHeight: '100vh', p: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>{children}</Box>
  );
}

export default function HomePage(): JSX.Element {
  const { t } = useTranslation();
  const accounts = useAccounts();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    if (!accounts.data) return;
    const stored = typeof window !== 'undefined' ? window.localStorage.getItem(ACTIVE_KEY) : null;
    const exists = accounts.data.find((a) => a.id === stored);
    setActiveId(exists?.id ?? accounts.data[0]?.id ?? null);
  }, [accounts.data]);

  useEffect(() => {
    if (activeId && typeof window !== 'undefined') window.localStorage.setItem(ACTIVE_KEY, activeId);
  }, [activeId]);

  const wallets = useWallets(activeId);

  if (accounts.isLoading) {
    return <Shell><Box sx={{ m: 'auto' }}><CircularProgress /></Box></Shell>;
  }
  if (accounts.isError) {
    return <Shell><Alert severity="error">{t('errorGeneric')}</Alert></Shell>;
  }
  if (!accounts.data || accounts.data.length === 0 || !activeId) {
    return <Shell><AccountForm onCreated={(id) => setActiveId(id)} /></Shell>;
  }

  const account = accounts.data.find((a) => a.id === activeId);
  const savings = wallets.data?.find((w) => w.monthlyInterestRate > 0);
  const others = (wallets.data ?? []).filter((w) => w.monthlyInterestRate === 0);

  return (
    <Shell>
      {account && <Ribbon name={account.name} avatarId={account.avatarId} />}
      {wallets.isLoading && <Box sx={{ m: 'auto' }}><CircularProgress /></Box>}
      {wallets.isError && <Alert severity="error">{t('errorGeneric')}</Alert>}
      {savings && <WalletHero wallet={savings} />}
      <WalletList wallets={others} />
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 1 }}>
        <NewActionButton onClick={() => setDrawerOpen(true)} />
      </Box>
      {account && wallets.data && (
        <TransactionDrawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          accountId={account.id}
          wallets={wallets.data}
        />
      )}
    </Shell>
  );
}
```

- [ ] **Step 5: Run the page test — PASS**

Run: `npx jest src/app/__tests__/page.test.tsx`
Expected: PASS.

- [ ] **Step 6: Run the FULL unit suite**

Run: `npx jest`
Expected: PASS — all suites green.

- [ ] **Step 7: Update the README**

Replace `README.md` with:
```markdown
# fun-saver

A playful kids savings app. Create an account (name + avatar); each account has three
wallets (Savings 🐷, Spending 🛍️, Good deeds 💛). The savings wallet earns 20%/month,
compounded daily and settled lazily.

## Setup

```bash
npm install
npm run dev        # http://localhost:3000
```

No API keys required. Data persists to `src/db/data.json` (gitignored); delete it to reset.

## Scripts

- `npm run dev` — start the dev server
- `npm test` — unit + component tests (Jest)
- `npm run test:e2e` — build, boot, and run the Puppeteer acceptance test
- `npm run lint` — ESLint + Prettier

## Environment overrides (tests/dev)

- `FUNSAVER_DATA_PATH` — path to the JSON store file (isolates data)
- `FUNSAVER_NOW` — fixed `YYYY-MM-DD` "today" for deterministic interest

## Architecture

- `src/db` — swappable DAL (`DataStore` port + JSON / in-memory adapters; `getStore()`)
- `src/lib` — pure business logic (interest, derivations, money) + services
- `src/app/api` — thin route handlers (validate → service → JSON)
- `src/components`, `src/hooks`, `src/theme`, `src/i18n` — React Query + MUI + i18n frontend

Avatars are bundled offline in `public/avatars/` (SVGRepo kids pack, free for commercial use).

Design spec: `docs/superpowers/specs/2026-06-20-fun-saver-design.md`.
```

- [ ] **Step 8: Run the E2E — now GREEN**

Run: `npm run build && npm run test:e2e`
Expected: PASS — `E2E PASS: create account → dashboard with 3 zero wallets`.

- [ ] **Step 9: Lint**

Run: `npm run lint`
Expected: PASS (no errors; Prettier clean).

- [ ] **Step 10: Commit**

```bash
git add src/theme/buildMuiTheme.ts src/app/page.tsx src/app/__tests__/page.test.tsx README.md
git commit -m "feat: wire dashboard page, app gradient, README; acceptance E2E green"
```

---

## Self-Review (run after the plan is implemented)

- **Spec coverage:** Domain model (Task 1) · DAL ports/adapters (7–9) · interest module (6) · derivations/money (4–5) · services incl. overdraft + auto-seed (10–11) · API surface §2 (12) · theme + typography scale (13) · i18n he/rtl (14) · providers (15) · hooks (16) · avatars (18) · empty-state/create (19) · dashboard + ribbon/hero/cards (20) · transactions UI (21) · page + E2E (22). Deferred per spec Future Phases (menu, per-wallet ledger, theme/language switch UI) are intentionally **not** in this plan.
- **Placeholder scan:** none — every code step is concrete.
- **Type consistency:** `WalletWithDerived`, `DataStore` signatures, service signatures (`asOf` arg), and hook return types match across tasks; `data-testid` strings used by the E2E (Task 2) are produced by Tasks 18–22.

---

## Execution Handoff

**Plan complete and saved to `docs/superpowers/plans/2026-06-20-fun-saver-mvp.md`. Two execution options:**

**1. Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks, fast iteration.

**2. Inline Execution** — Execute tasks in this session using executing-plans, batch execution with checkpoints.

**Which approach?**
