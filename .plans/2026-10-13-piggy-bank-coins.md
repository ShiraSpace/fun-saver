# Child piggy bank, PR 3 — the coins, with no motion yet

> Approved 2026-10-13. PR 3 of 4 in `2026-10-04-child-piggy-bank.md` (kept in `fun-saver-piggy-bank`, untracked),
> re-planned against `origin/main` 9abe018.

## Decision

The card's numbers **reuse the interest already worked out** on the savings `WalletSummary`. Instead of new arithmetic
for the total, «הרוויח לבד», the fill and the goal, `savingsAtCollectedInterest` builds the savings wallet as it stood
at the collected mark, and the existing `savingsWithoutAgorot`, `piggyBankFillOf` and `savedTowardGoalOf` run on it
unchanged. The coins are «הרוויח לבד» of the real wallet less «הרוויח לבד» of the wallet at the mark. The real
`savedTowardGoalOf` is kept once the goal is `reached`.

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

Then: every review round fixed, the hydration check in a real browser (proved on a planted mismatch), PR screenshots.
