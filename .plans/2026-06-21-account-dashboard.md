# Main Account Page (Dashboard) — `feat/account-dashboard`

**Worktree:** `/Users/technotronic/Projects/technotronic/fun-saver-account-dashboard` (branched from `main` HEAD `290d009`).
**Parallel session:** owns the create-account flow on `main` — do not touch create-account code.

## Goal

When an account exists, the page renders the dashboard from the mock (`docs/superpowers/specs/mockup-home-screen.html`):
a **savings hero** (balance + daily-interest coins + deposits/interest split) above the **two wallet cards**
(spending, good-deeds). Wallet values are **derived from seeded transactions** — no interest accrual engine this round.

## Method (locked)

UI-driven, outside-in, **top of the mock → bottom**. Each cycle:
**failing test → (extend driver only if needed) → minimal code to green → refactor (mandatory) → next piece.**
A module (`money`, `derivations`, DAL methods, types) is created **only when a cycle forces it** — test-first.

- Each UI piece is driven by a fast **jsdom RTL component test**.
- The Puppeteer driver is extended + the real seeded **E2E added once, at the wiring step (cycle 10)**.
- Top bar: **keep existing `Header` as-is** (mock's "ribbon" deferred).

## Conventions (from the real codebase, not the stale MVP plan)

`@emotion/styled` + `@/theme` tokens; Hebrew copy + test-ids in per-component `constants.ts`; named exports;
explicit return types; kebab-case for lib/db/e2e, PascalCase for components; files < 200 lines; integer **agorot** internally.
No i18n layer (copy lives in `constants.ts`). No MUI components (despite the old plan's Task 20).

**Component layout:** the dashboard's inner components live **nested under `Account/`** (Account is the main account
component holding all its inner components). Each keeps its own folder:

```
src/components/Account/
  Account.tsx · Account.test.tsx · index.ts
  WalletHero/   WalletHero.tsx · WalletHero.test.tsx · constants.ts · index.ts
  WalletList/   WalletCard/   CoinRow/   Money/   (each its own folder)
```

Promote a component to `src/components/` only if it's reused outside the Account subtree.

**Theming & background (keep themes in mind):**

- The `Account` view renders its content inside the existing **`Screen`** component (cycle 9), so the sunset gradient
  background comes from `GRADIENTS.screen` — same as empty-state/create-account. `WalletHero`/cards are white surfaces
  *on* that gradient; `Screen` is the single page-level background wrapper, not nested per card.
- **No inline hex or font-size in components.** Every color → `@/theme/palette` `COLORS`; every size → `@/theme/typography`
  `TYPE_SCALE`; every gradient → `@/theme/gradients` `GRADIENTS`. Extend these token files **just-in-time** as each cycle
  needs a value (e.g. `surface`, `ink`, `accent`, `muted`, daily-row + breakdown backgrounds, gain green, coin gradient).
- Goal: buttons, backgrounds, fonts, and colors are all changeable from `@/theme` alone. A future multi-theme registry
  (swap whole palettes) stays an easy drop-in — but is **not** built this round (nothing needs it yet).

## Cycles (each = red → green → refactor)

1. **Hero shows the savings balance** — `WalletHero` renders `wallet-hero` + balance number from prop. Minimal: raw number.
2. **Hero head** — 🐷 icon, eyebrow "החיסכון של {name}", interest line, "פעיל מאז". Copy/test-ids in `WalletHero/constants.ts`.
3. **Daily-interest coins** — `CoinRow` renders full/half coins from `todayInterest`, hidden when 0.
   *Forces `money.ts → coinBreakdown` (test-first).*
4. **Breakdown (deposits + gain)** — show `principal` + `interestGain`. Repeated ₪-formatting *forces extracting `Money`*;
   refactor cycles 1 & 4 onto it. *`money.ts → agorot↔shekels` JIT.*
5. **Supporting label + wallet list** — `WalletCard` (icon, Hebrew name, `Money` balance) + `WalletList`; assert two cards.
6. **Derive a wallet from transactions** — introduce `derivations.ts` (balance/principal/interestGain/todayInterest)
   + `deriveWallet(wallet, txns, asOf)` test-first. Adds `Wallet`/`Transaction`/`WalletWithDerived` to `types.ts`.
7. **Store wallets + transactions** — extend `DataStore`/`StoreData` + memory-store + json-file-store (migrate seam). Test-first per adapter.
8. **Service `getWalletsForAccount(store, accountId, asOf)`** — reads + derives, savings-first. Test-first.
9. **Wire it up** — `Account` composes `Header` + `WalletHero` + `WalletList` from a `wallets` prop, **wrapped in `Screen`**
   (gradient background from the theme); `page.tsx` fetches via the service. Existing Account/Header tests stay green.
10. **End-to-end** — extend `useDriver` seeding + add `DashboardDriver`; add `e2e/dashboard.visual.ts` asserting the page
    top-to-bottom; seed local `data.json` for `npm run dev`. Update plan Progress + README.

## Checkpoints

Stop after each cycle's green+refactor for review before committing; one test at a time.
Keep `wallet-hero` / `wallet-balance` test-ids aligned with the acceptance E2E the parallel session owns.

## Baseline

20 jest tests passing in the worktree at start.

## Progress (updated 2026-06-21)

All 10 cycles complete, each committed red→green→refactor.

- **Cycles 1–5 (UI, top→bottom):** `WalletHero` (balance, head, coins, breakdown), `CoinRow`,
  `Money`, `WalletCard`, `WalletList` — nested under `Account/`, emotion-free structure +
  copy/test-ids in `constants.ts`.
- **Cycle 6:** domain types (`Wallet`/`Transaction`/`WalletWithDerived`/`WalletName`), pure
  `derivations`, `deriveWallet`; components tied to the domain type via `Pick<WalletWithDerived>`.
- **Cycle 7:** DAL stores wallets + transactions (port + memory + json adapters, legacy-file merge).
- **Cycle 8:** `getWalletsForAccount` service (derive + savings-first).
- **Cycle 9:** `Account` composes `Header` + `WalletHero` + `WalletList` inside `Screen`;
  `page.tsx` fetches via the service; `clock.today()` (FUNSAVER_NOW-aware).
- **Cycle 10:** driver seeding (wallets/txns) + `DashboardDriver` + `e2e/dashboard.visual.ts`;
  local `data.json` dev seed. **The E2E caught a real gap — `CoinRow` was built but never composed
  into `WalletHero`; fixed test-first.**

**Status:** jest 55 passing; visual E2E green (see final run). tsc + eslint clean.

**Still owed (out of this slice):** wallet-seeding on account creation (create-account flow,
parallel session); the daily-interest accrual engine.

---

## Styling pass (done — 2026-06-21)

Dashboard styled to mock fidelity (`docs/superpowers/specs/mockup-home-screen.html`), screenshot-driven.
All theme values are tokens (`@/theme/palette` `COLORS` + per-component `*_STYLE` constants) — no inline hex.

- **Header ribbon** (`b10af65`): white rounded bar, soft shadow, bold ink name; page top-aligned in a
  420px column. Added `COLORS.surface/ink/accent/muted` + `Screen align="top"` variant.
- **Hero card** (`485b710`): gradient pig tile, pink eyebrow, "סך הכל בקופה" + 54px amount, cream dashed
  daily-row with silver ₪ coins, tinted breakdown cells. Styled shared `Money` (raised ₪ mark) + `CoinRow`.
  **Decomposed `WalletHero` → `HeroHead` / `HeroAmount` / `HeroBreakdown`**, each its own tested folder;
  `WalletHero` is a thin composition + smoke test.
- **Wallet cards** (`07e2b5a`): per-type gradient illust tile, ink name, cream/gold balance pill; white
  "הקופות הנוספות" label.
- **Corner star** (`a885101`): rotated gold star sticker on the hero; SVG extracted into a tested `Star`
  component, `CornerStar = styled(Star)`.

**Status after styling:** jest **59 green**, visual E2E **17/17 green** (run before the corner-star;
star is decorative + presence-tested), tsc + eslint clean.

### Gotchas learned (read before resuming)

- **RTL flip:** `stylis-plugin-rtl` (in `src/app/providers.tsx`) **flips physical `left`/`right`**. To place
  something on the physical left in this app, write `right` (and vice-versa). This bit the corner-star.
- **Dev server etiquette:** the USER runs their own `next dev` on **port 3001** — do NOT kill it or run a
  competing `next dev` (Next allows one dev instance per dir; a second just fails on the lock). For
  screenshots, build once and run your OWN `next start` on a **dedicated port (3030)**, shoot, then stop
  only that server. The visual E2E harness already uses its own port **3987**.
- **Screenshot loop:** `e2e/shot.mjs` (puppeteer, 402×874) — `SHOT_URL=... SHOT_OUT=... node e2e/shot.mjs`.
- **Local seed:** `src/db/data.json` (gitignored) seeds one account (נועה) + 3 wallets + txns; its interest
  is dated **today** so the coin row shows on a plain `npm run dev`. For mock-accurate dates run
  `FUNSAVER_NOW=2026-01-01 npm run dev` (then date the interest 2026-01-01 to keep coins).

---

## DASHBOARD MERGED TO MAIN (2026-06-21)

The whole dashboard was merged into **`main`** (merge commit `5420b12`, pushed to origin) alongside the
create-account flow — union-resolving `Screen`/`Header`/`use-driver`/`palette` conflicts; post-merge fixes
for main's stricter eslint (explicit return types on styled interpolations) + `Account.test` now renders via
`@/test-support/render`. **No account is seeded** (`src/db/data.json` untracked+gitignored) so fresh `main`
shows the create-account screen.

**Left for the create-account owner to reconcile on main:** semantic-dup theme tokens — create-account uses
`COLORS.textMuted`/`textStrong`; dashboard uses `COLORS.muted`/`ink` (identical hex). Both kept so each side
compiles.

---

## NEXT FEATURE — transaction flow (IN PROGRESS on `feat/transaction-flow`)

**Branch:** `feat/transaction-flow`, cut off `origin/main` in the SAME worktree
(`/Users/technotronic/Projects/technotronic/fun-saver-account-dashboard`). Pushed to origin (`0c5f8b1`).

**Method (locked by user this session):** UI-driven, outside-in TDD. The **UI test leads** every cycle:
failing UI test → extend driver/scaffold only when the test demands it → minimal code to green →
**refactor (mandatory: extract/rename/simplify)** → next. The bottom-up list below is a **dependency map,
NOT the order** — `errors.ts`/`transactions.ts`/the API route/the hook get built only when a UI test can't
go green without them. One test at a time; stop for review before each commit.

### Done this session
- **Cycle 1 — CTA renders** (commit `486816a`): failing `Account` test → `ActionButton` "＋ פעולה חדשה"
  below the wallet list; test-id `account-action-cta` + copy in `Account/constants.ts`.
- **Styling/fit pass** (commit `0c5f8b1`): shrank `WalletHero` so the CTA fits S24-class phones
  (hero 392→329px, CTA bottom 743→680); `Money` ₪ now LEFT of the number + bottom-aligned; `Column` gap 14→18.

### NEXT — Cycle 2: clicking the CTA opens the transaction drawer
Failing test: click `account-action-cta` → a `TransactionDrawer` becomes visible. This forces
`Account/TransactionDrawer/` into existence (bottom sheet). Build it out piece-by-piece from there
(wallet select → deposit/withdraw toggle → amount → submit → loading/error), pulling in the hook + API +
`transactions.ts` + `errors.ts` as later cycles' tests require them.

### Gotchas learned this session (read before resuming)
- **`stylis-plugin-rtl` flips `direction:` too** (not just physical left/right). For an LTR subtree (e.g. the
  ₪+number money widget) use the **`dir="ltr"` HTML attribute** (plugin only rewrites CSS, never attributes) —
  do NOT rely on `direction: ltr` in CSS, it gets flipped to rtl.
- **Visual measuring:** the user runs their own `next dev` on **port 3001 FROM THIS WORKTREE** — a 2nd
  `next dev`/`next build` here fights the `.next` lock, so don't. To measure/screenshot, point puppeteer at
  **localhost:3001** (Fast Refresh already has your latest edits) with a throwaway script in `e2e/` (delete
  before commit; `import puppeteer from 'puppeteer'` only resolves from inside the project dir).
- `.e2e-data/` is untracked harness output; leave it out of commits.

**Decisions (2026-06-21):**
1. **Actions:** deposit + withdraw on a chosen wallet (withdrawal from good-deeds = a donation). Interest stays
   automatic. **Overdraft-protected** (can't withdraw more than the wallet balance).
2. **Mechanism:** **API route + React Query** (POST `/api/wallets/[id]/transactions`).
3. **Entry UX:** **bottom drawer** — pick wallet → deposit/withdraw → amount → confirm.

**Scaffolding reality (confirmed — all MISSING, must be built):**
- `src/app/providers.tsx` sets up **Emotion only** — **no `QueryClientProvider`**. Must add one (client) for
  React Query `useMutation`.
- **No `src/app/api/` routes** exist. **No `src/lib/errors.ts`**. **No `src/hooks/`**. React Query installed
  but **unused** anywhere.
- Page/dashboard data is **server-rendered** (`page.tsx` reads the store, `force-dynamic`). React Query here is
  only for the mutation lifecycle; after a successful mutation call **`router.refresh()`** to re-fetch the
  server component (wallet data isn't a React Query cache entry).
- **Money boundary:** store/logic are integer **agorot**; the drawer takes **shekels** → convert with
  `shekelsToAgorot` at the API route only.
- **Next 16 route handlers:** dynamic params are async — `const { id } = await ctx.params`; return
  `Response.json(body, { status })`; errors as `{ error: string }` (400 validation/overdraft, 404 not found).

**Proposed TDD slice (outside-in-ish, piece by piece):**
1. `src/lib/errors.ts` — `ValidationError`, `OverdraftError`.
2. `src/lib/transactions.ts` — `addTransaction(store, walletId, { type, amountAgorot }, asOf): Promise<Transaction>`
   (amount > 0; withdrawal ≤ current `balance(txns)`; `newId`; `store.insertTransactions`). Unit-test all cases.
3. API route `src/app/api/wallets/[id]/transactions/route.ts` — thin: parse shekels → agorot, call service,
   map errors to status. (Validated by E2E; keep logic in the service.)
4. `QueryClientProvider` in providers; `src/hooks/use-add-transaction.ts` (`useMutation` → POST → `router.refresh()`).
5. UI: CTA pill (reuse `ActionButton` purple pill, "+ פעולה חדשה") on the dashboard → opens
   `Account/TransactionDrawer/` (bottom sheet: wallet select, deposit/withdraw toggle, amount, submit; loading +
   error states). Component tests with the mutation/fetch mocked.
6. Wire into `Account`; add an E2E (`e2e/*.visual.ts`) that deposits and asserts the balance changes
   (extend `useDriver`/`DashboardDriver`). Update README + this plan.

**Branch:** `feat/transaction-flow` (worktree `/Users/technotronic/Projects/technotronic/fun-saver-account-dashboard`),
cut off updated `origin/main` — **merge/PR back into `main`** when done.
Dropped from mock: the bottom **dock child-switcher** (will be done from the menu instead).

---

## DEPOSIT PHASE — DONE (2026-06-21)

Spec: `docs/superpowers/specs/2026-06-21-transaction-deposit-design.md`. Companion mockup (chosen
Variant B): `docs/superpowers/specs/mockup-transaction-drawer.html`. Built UI-driven TDD,
red→green→refactor, one test at a time.

**Scope reset (locked with user this session):** deposit-only MVP. A deposit is one amount that
**auto-splits 60% savings / 20% spending / 20% good-deeds** — no wallet picker, no deposit/withdraw
toggle. Ratios live in `DEPOSIT_SPLIT` (`src/lib/constants.ts`). Whole shekels only via a custom
in-drawer number pad.

**Deviations from the original proposal above (superseded):**
- **No React Query / no `QueryClientProvider`.** The shipped `useCreateAccount` is a plain `fetch`
  hook; mirrored that with co-located `use-add-transaction.ts` (`addDeposit`) — the drawer manages
  `isSubmitting`/`hasError` locally and calls `router.refresh()` on success.
- **Account-level endpoint** `POST /api/accounts/[id]/deposits` (deposit auto-splits across the
  account's wallets), not the per-wallet `…/wallets/[id]/transactions`. Withdraw will get its own
  per-wallet route later.
- **`OverdraftError` deferred** to the withdraw phase (nothing drove it — no unused code).

**What shipped:**
- `splitDeposit(totalAgorot)` (pure; remainder→savings) + `addDeposit(store, accountId, agorot, asOf)`
  in `src/lib/transactions.ts`; `shekelsToAgorot` in `money.ts`; `ValidationError` in `errors.ts`.
- `POST /api/accounts/[id]/deposits` — thin: 400 (ValidationError) / 404 (unknown account).
- `Account/TransactionDrawer/` bottom sheet (scrim + sheet, handle, title, green amount, dashed
  60/20/20 split line, `AmountPad`, confirm pill with live amount, loading + error). `Account` owns
  open/close; `accountId` threaded from `page.tsx`.

**Status:** jest **104 passing**, visual E2E **29/29** (incl. `e2e/deposit.visual.ts` — deposit ₪50,
assert savings deposits update via the config-derived split), tsc + eslint clean. Visual matches
Variant B.

- E2E wiring: extended `DashboardDriver` (`deposit`, `savingsDeposits`, `waitForSavingsDeposits`) +
  added a generic `Session.waitForText`. Asserted on the **unique** `hero-deposits` test-id because
  `WALLET_HERO_TEST_IDS.balance` and `WALLET_CARD_TEST_IDS.balance` collide on `'wallet-balance'`
  (pre-existing latent collision — worth deduping later).
- `.e2e-data/` is now gitignored.

**Owed:** withdraw phase (per-wallet, overdraft-protected; the generic names/boundaries are already in
place).

---

## NEXT FEATURE — menu → header unification (PLANNED on `feat/menu-header`)

Full plan: [2026-06-23-menu-header.md](./2026-06-23-menu-header.md). Collapse the two stacked bars
(`Header` + `MenuOverlay`'s `TopBar`) into one morphing `Header`. (Link added 2026-06-23; can be removed
once this section is folded in or the feature ships.)
