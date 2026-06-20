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
