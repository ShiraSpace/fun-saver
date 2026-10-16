# Child piggy bank, PR 4 — the motion

> Planned 2026-10-16, re-checked against `origin/main` 7f6f23f (#218). PR 4 of 4 in `2026-10-04-child-piggy-bank.md`
> (kept in `~/Projects/technotronic/fun-saver-piggy-bank`, untracked). Its "After PR 2" and "After the layout shots
> (2026-10-16)" sections override older text there. Motion mockup: `fun-saver-piggy-bank/mockups/coin-space.html`,
> variant C (chosen). The drop and the roll-up: `mockups/piggy-bank.html`.

## What PR 3 left on `main`

- `InterestCoins` draws nothing without coins; with coins, the copy line `TapTheCoins` and the `CoinRow` of
  `InterestCoinButton`s. Focus moves at the tap, before `onCollect`, found through `INTEREST_COIN_SELECTOR`.
- `useInterestCoins({ savings, accountId })` returns `{ interestCoins, uncollectedInterest, collect }`. The visit's
  coins and mark are fixed at mount; `collect` is a functional update; an effect saves the mark whenever the visit's
  mark moves (mount, and each tap).
- `ChildSavings` draws the total, «הרוויח לבד», the pile and the goal from `savingsLessUncollectedInterest` and
  `savedTowardGoalLessUncollectedInterest` (`src/lib/interest/collected-interest.ts`): the card's whole shekels less
  what the coins hold. A tap lands the coin's whole shekels at once.
- `SavingsBalance`: the drawn total is `aria-hidden`; a hidden `aria-live="polite"` `aria-atomic` line inside the
  focusable total holds the amount (`readByScreenReaderOnly`, `src/theme/accessibility.ts`).
- Layout: the coin row (61px) pulls the pig up 8px; card top padding 8px. With a goal and coins waiting the wallets
  end at 742.6px of 745 (`PHONE_IN_SAFARI`). Motion must not add layout height.
- Count-up: `useCountUpTotalBalance` in `Account/BalanceBreakdown/use-count-up-total-balance.ts` (`progressAt`,
  `TOTAL_ANIMATION`, `motionIsReduced`). `Account` keys `BalanceBreakdown` by `balancesShown`, not by the total.
- `src/theme/motion.ts`: `REDUCED_MOTION`, `motionIsReduced()`, `entrance()`. The slot: `PIGGY_BANK_SHAPE.slot`.

## Scope (the locked plan's PR 4, plus variant C)

1. **The drop.** A tapped coin moves over the slot, turns edge-on, slides through and lands on the pile (Web
   Animations); the pig wiggles; the coins left slide over to close the gap.
2. **The last coin (C).** The coin space waits for the landing and the wiggle, then closes slowly so the pig settles
   up. Under reduced motion it closes at once, as today.
3. **The breathe.** A few cycles after mount and after each landing, under 5 seconds in all, then still (WCAG 2.2.2).
   Off under `REDUCED_MOTION`.
4. **`useCountUp({ startAt, to, timing })`** in `src/hooks/`, replacing `useCountUpTotalBalance`: on mount it counts
   from `startAt` to `to` (nothing when equal); a later `to` counts from the number on screen. `BalanceBreakdown`
   passes `startAt: 0` and `TOTAL_ANIMATION` and behaves as today; `ChildSavings` passes `startAt: to`, no start delay.
5. **What waits for the landing.** The mark is still saved and focus still moves at the tap. Only the numbers on
   screen, the pile, the goal bar and the hidden live line wait for the landing. The live line takes the landed total,
   never the rolling one.
6. jsdom has no `element.animate`: the component goes straight to the end state, the same path as reduced motion.

## Re-check against `origin/main` 7f6f23f (2026-10-16)

Every file, symbol and test named above exists as described. What the code adds to the plan:

1. **Nothing separates the tap from the landing yet.** `useInterestCoins`' `collect` removes the coin and lowers
   `uncollectedInterest` in one update, and the card draws from that. PR 4 splits it: `collect` (tap) moves the mark and
   disables the coin, which stays in the row; `land` (drop finished) takes it out of the row and moves what is shown.
2. **«הרוויח לבד» rolls too.** The Decisions row "What the total shows" says a coin adds to both, rolling up; the PR 4
   section only names the total. Both roll; the hidden live line stays on the landed total.
3. **The coins cannot see the slot.** The slot is a bare `<rect>` in `PiggyBankFace`. It takes a ref, passed through
   `PiggyBank` and `ChildSavings` to `InterestCoins`, which measures it at the tap.
4. **The breathe has no timing yet.** The mockup loops 3.2s forever; the rule is "under 5 seconds, then still". Its
   cycles are decided from a recording of the real app before step 4 is built.
5. The e2e harness defaults to `motion: 'reduce'`, so the PR 3 coin suites keep their at-once landing. A motion check
   opens with `motion: 'no-preference'`.

## Steps (each: production commit, then its tests)

1. **`useCountUp({ startAt, to, timing })`** in `src/hooks/use-count-up.ts`, `timing` `{ startDelayMs, countMs }`;
   `progressAt` moves with it. `BalanceBreakdown` passes `startAt: 0`, `TOTAL_ANIMATION`. `use-count-up-total-balance.ts`
   and its test go. No visible change.
2. **The drop and the landing.** `useInterestCoins` gains the landed mark and `land`; the coin's drop runs on the
   button with `element.animate` (mockup keyframes, 950ms) toward the slot, then `land`. The pig wiggles on each
   landing. `SavingsBalance` and `PrincipalAndInterest` roll with `useCountUp({ startAt: to })` (900ms, no delay); the
   live line takes the landed total. No `animate` or reduced motion: `land` runs in the tap, as today.
3. **The coins close the gap, and the space closes after the last one (C).** At a landing the coins left slide over
   (420ms). After the last landing the space waits 450ms, then closes over 650ms and `InterestCoins` draws nothing.
   Reduced motion: at once.
4. **The breathe**, after mount and after each landing, timing from the recording.

Glossary rows, proposed: the coin going through the slot `drop`; reaching the pile `land` (`landedInterest`, the mark
the card draws from); `wiggle`; `breathe`; `useCountUp`.

Then: every review round fixed; the hydration check (prove it on a planted mismatch first); PR screenshots, mid-drop if
the harness can catch it (visual shots run with reduced motion, so they stay still).

## Tests (from the plan)

- jsdom has no `element.animate`, so a tap goes straight to the end state.
- `useCountUp`, one test each: counts from `startAt` on mount; nothing on mount when `startAt` equals `to`; a new `to`
  counts from the number on screen; `BalanceBreakdown` still counts up from 0 on mount.
- The live line holds the landed total, never a rolling one.

## Timings in the mockups (proposals, not decisions)

`piggy-bank.html`: drop 950ms, gap close 420ms, roll-up 900ms. `coin-space.html` (C): space closes over 650ms after a
450ms wait.
