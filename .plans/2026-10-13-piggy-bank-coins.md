# Child piggy bank, PR 3 — the coins, with no motion yet

> Approved 2026-10-13. PR 3 of 4 in `2026-10-04-child-piggy-bank.md`,
> re-planned against `origin/main` 9abe018. Merged as #218 (`7f6f23f`).

## Decision

The card's numbers **reuse the interest already worked out** on the savings `WalletSummary`. `savingsAtCollectedInterest`
builds the savings wallet as it stood at the collected mark, and the coins are «הרוויח לבד» of the real wallet less
«הרוויח לבד» of the wallet at the mark (`uncollectedInterestOf`), in whole shekels. The card then takes exactly those
shekels off `savingsWithoutAgorot` of the real wallet and off what is saved toward the goal
(`savingsLessUncollectedInterest`, `savedTowardGoalLessUncollectedInterest`), so each coin lands exactly: running
`savingsWithoutAgorot` on the wallet at the mark instead could round the total a shekel away from the coins. The fill
comes from that total. The real `isGoalReached` is kept; since #223 the shown goal waits for the coins that reach it.

The raise keeps the mark at least at the interest spent: `interestEarned` above the `balance`.

## Steps

Each step is production code, a commit, then three tests, approval, the rest, and a tests commit.

1. **Rules**: `src/lib/interest/collected-interest.ts` (`resolveCollectedInterest`, `savingsAtCollectedInterest`,
   `uncollectedInterestOf`, `interestCoinsOf`, `collectInterest`), `MAX_INTEREST_COINS`, glossary rows.
2. **Cookie and context**: `collectedInterestCookie`, `signedInAccounts().collectedInterest`,
   `Home/collected-interest-context.ts`, the provider in `page.tsx`, a `collectedInterest` option in `render.tsx`.
3. **The coins, on their own**: `ChildSavings/InterestCoins/`, the copy line, the total and its hidden live line
   extracted from `ChildSavings`.
4. **Wiring**: `use-interest-coins.ts`, `ChildSavings` from the wallet at the mark, `ChildAccount` keys `ChildSavings`
   by account id, `useDriver`'s `collectedInterest` option, `e2e/interest-coins.e2e.ts`, a visual shot. Layout shown as
   e2e screenshots at 393×745 before it is decided.

## Layout (decided 2026-10-16 from e2e shots and `mockups/2026-10-04-child-piggy-bank.html#coin-space`)

- The copy line and the coin row exist only while coins wait; with none the pig sits at the top of the card.
- The coins never overlap the pig: the coin row pulls the pig up 8px (5.2px clear of the ears) and the card's top
  padding is 8px. Coins waiting, with a goal, at 393×745: the wallets end at 742.6px; 5px between the copy line and the coins.
- When the last coin goes in the space closes at once; PR 4 makes it wait for the landing and close slowly.

Then: every review round fixed, the hydration check in a real browser (proved on a planted mismatch), PR screenshots.
