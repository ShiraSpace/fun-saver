# Main screen redesign — ring total + per-wallet detail

**Date:** 2026-09-12
**Mockup:** `mockups/home-overview.html` (single source of truth — three themes, switcher at the top)
**Worktree:** `/Users/technotronic/Projects/technotronic/fun-saver-home-overview` on `feat/home-overview`,
branched off `origin/main`. The main `fun-saver` checkout is on `feat/user-store-methods` with unrelated
in-flight db-store work — do not touch `src/db/` from here.
**Branching:** each PR below starts fresh off updated `origin/main` (Phase 0); this worktree carries the plan
and the mockup, and hosts PR 1's branch.

## Before you start

Read `mockups/home-overview.html` in a browser first — it is the spec, and the theme switcher shows the
three themes the tokens have to satisfy. `CLAUDE.md` governs the workflow (branch per PR, production code →
approval → commit, then tests **one at a time** with approval between each). Don't batch tests.

**Current state of the screen** (`src/components/Account/Account.tsx`):
`Header` (burger · name · `TotalChip` · avatar) → `WalletHero` (savings: `HeroHead`, `HeroAmount`, `CoinRow`,
`HeroBreakdown`) → `WalletList` (spending, good deeds) → `ActionButton`.

**Seed account for sanity-checking** (`src/db/data.json`, account אלי, theme jungle-quest):
savings ₪204 (principal ₪137 + interest ₪67.43), spending ₪125, good deeds ₪30 → total ₪359.
Shares 57 / 35 / 8. Savings rate 15%/month, opened 2026-06-20. Today's interest 102 agorot → `+₪1`.

**Verify:** `npm test` (unit), `npm run lint`, `npm run test:e2e` (visual + e2e; needs a build).
Freeze the clock with `FUNSAVER_NOW=2026-09-12 npm run dev` to see the seeded daily-interest row.

## Progress

- [x] PR 1 — `halfShekelAmount`
- [ ] PR 2 — Overview card + savings detail row
- [ ] PR 3 — Header drops the total chip
- [ ] PR 4 — spending & good-deeds sub-lines

## Goal

```
Header       burger · אלי · avatar                       ← TotalChip removed
OverviewCard ₪359 inside the donut hole + legend 57/35/8 ← replaces WalletHero
Detail       חיסכון ₪204 · 15%/חודש · מאז 20 ביוני
               └ הפקדת ₪137 │ רווח מריבית ₪67 │ היום +₪1
             בזבוזים ₪125 · כבר ביזבזת ₪45
             מעשים טובים ₪30 · תרמת ₪18
＋ פעולה חדשה
```

Savings stops being a hero and becomes the first of three uniform wallet rows. The total moves out of the
header into the ring. Interest stays visible, but as **numbers instead of coins**.

## Decisions (locked with the user)

- **Header** keeps burger · name · avatar only. No total, no interest chip.
- **Everything on one screen.** No tap-through, no savings detail route.
- **`היום` uses half-shekel steps** — the exact rounding `coinBreakdown` already does, rendered as a number
  (`₪0.5`, `₪1`, `₪1.5`, `₪2.5`), and hidden when it rounds to zero. No `+` sign: the label and the gain
  colour already say it is a gain. `CoinRow` doesn't get replaced by
  new logic; its rounding is extracted and its drawing is dropped.
- **Everything else stays whole shekels.** `רווח מריבית` is really ₪67.43 — half-stepping it prints ₪67.5 and
  then `137 + 67.5 ≠ 204` on screen. Whole shekels keep the strip adding up.
- **Legend percentages use largest-remainder rounding** so they always sum to 100.

## PR slicing

Four PRs. 1 → 2 → 3 in order; 4 is independent once 2 lands.

---

### PR 1 — `halfShekelAmount` in `src/lib/money.ts`

Lib only, no UI change. Lands first so PR 2 has a formatter to call.

- Extract the half-shekel rounding currently inlined in `coinBreakdown` into
  `halfShekelAmount(agorot): number | null` — the rounded shekel amount, or `null` when it rounds to zero.
- Rewrite `coinBreakdown` on top of it so the new function has a real consumer from day one (no dead code).
  Existing `money.test.ts` cases for `coinBreakdown` must stay green untouched — that is the regression proof.
- New cases: `38 → 0.5`, `102 → 1`, `140 → 1.5`, `238 → 2.5`, `20 → null`, `0 → null`.
  (`18 → 0.5` was impossible — the locked rounding puts the 0.5 threshold above 25 agorot, so 18 is `null`.)

**Touches:** `src/lib/money.ts`, `src/lib/__tests__/money.test.ts`.

---

### PR 2 — Overview card + savings detail row (the pivot)

The one visual PR. Biggest of the four; see "Why this doesn't split" below.

**Theme tokens (new).** The donut needs three *solid* stroke colours — the existing `potSavings`/`potSpending`/
`potGood` are CSS gradient strings and can't be an SVG stroke. Add `walletSavings`, `walletSpending`,
`walletGood` to `ThemeColors` + `palette.ts` + all three themes (values are the `arc*` vars in the mockup).

**`src/lib/derivations.ts`.** Add `walletShares(balances: number[]): number[]` — percentages that sum to 100 via
largest remainder; all-zero total returns all zeros.

**New `src/components/Account/OverviewCard/`.**
- `Donut/Donut.tsx` — three `stroke-dasharray` arcs over a track circle, rotated −90°.
- `OverviewCard.tsx` — donut with the total in the hole, legend beside it (colour dot, name, %, dotted leader,
  amount).
- `Legend/Legend.tsx`, `constants.ts` (copy + test IDs).

**`WalletCard`.** Gains an optional sub-line under the name and an optional `StatStrip/` child
(`הפקדת` / `רווח מריבית` / `היום`, the last two on the gain background). Savings passes both; the other two
wallets pass neither in this PR.

**`Account.tsx`.** `WalletHero` → `OverviewCard`; `WalletList` now receives **all three** wallets with savings
first; section label copy `הקופות הנוספות` → `מה קורה בכל קופה`.

**Deleted:** `Account/WalletHero/` (with `HeroHead`, `HeroAmount`, `HeroBreakdown`, `Star`) and
`Account/CoinRow/`. Drop both from the `CONSTANT_FILES` list in `src/theme/__tests__/no-color-leaks.test.ts`
and add the new `OverviewCard/constants.ts`; the coin-gradient hexes leave the `ALLOW` set with `CoinRow`.

**e2e.** `DashboardDriver`: `heroExists` → `overviewExists`, `dailyRowExists` → `savingsTodayInterest`,
`savingsDeposits`/`waitForSavingsDeposits` re-anchored to the stat strip's `הפקדת` test ID.
Specs: `dashboard.visual.ts` (`walletCardCount` 2 → 3), `create-account.e2e.ts` (same), `deposit.visual.ts`,
`withdraw.visual.ts`.

**Why this doesn't split.** `deposit.visual.ts` and `withdraw.visual.ts` both assert on the hero's deposits
number. Deleting `WalletHero` and adding the savings stat strip has to happen in one commit or those two specs
have no anchor for a release. Splitting is possible only by pointing `savingsDeposits()` at the balance pill
for one release, which weakens both specs — not worth it.

---

### PR 3 — Header drops the total chip

Deliberately *after* PR 2: shipped before it, the total would vanish from the app entirely. Shipped after, the
app briefly shows the total twice — redundant, never broken.

- `Header.tsx`: remove the `TotalChip` render and the `totalBalance` prop. `Account.tsx` stops computing
  `totalBalance` for the header (`OverviewCard` computes its own).
- **Deleted:** `src/components/Header/TotalChip/`.
- `HeaderDriver`: drop `totalChipBox()` / `totalChipAmount()`.
- Specs: `header-layout.visual.ts` (chip box assertion), `dashboard.visual.ts` (chip amount assertion),
  `Header.test.tsx`.
- `totalBalance()` stays in `derivations.ts` — `OverviewCard` uses it.

---

### PR 4 — spending & good-deeds sub-lines

Independent of PR 3; needs PR 2's sub-line support on `WalletCard`.

- `src/lib/derivations.ts`: export `deposits(transactions)` and `withdrawals(transactions)` off the existing
  private `sumOf`. `principal` stays `deposits − withdrawals`.
- `src/lib/types.ts`: `WalletWithDerived` gains `deposits` and `withdrawals`.
- `src/lib/derive-wallet.ts`: populate both.
- `WalletCard` sub-lines: spending → `כבר ביזבזת ₪45`, good deeds → `תרמת ₪18`. Hidden when the wallet has no
  withdrawals yet.

This is what makes the good-deeds wallet finally say what the README promises — a running total of what the kid
has given.

## Out of scope

- Any savings detail screen or tap-through.
- Donut animation / transitions.
- Per-wallet history views.
- Touching the transaction drawer.
