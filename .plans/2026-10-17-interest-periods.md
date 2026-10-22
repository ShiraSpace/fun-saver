# Interest per period on the transactions page

Mockup: `mockups/2026-09-23-transactions.html#interest-periods` (before and after,
with the decisions in that page's table).

Worktree `fun-saver-interest-periods`.

| PR | Branch | What | State |
| --- | --- | --- | --- |
| — | `fix/interest-periods` | Balance after each row, interest per period, the month's interest beside its name, the year on every month | Merged #225 (`2c31de6`) |

## Problem

Each row's יתרה was the end-of-day total of its day, so two withdrawals on one
day shared a balance, and one interest row per month (`+₪7.26 · 17 ימים`) did
not match the balance step beside it, because the balances already held that
interest day by day.

## Change

1. **Balance after each row.** Rows are sorted newest first, then the newest row
   of each day takes that day's closing balance from `balanceHistory` and every
   older row on the same day takes the newer row's balance less its change.
2. **Interest per period.** `INTEREST_MODE.monthly` became `byPeriod`. An
   interest period runs from the day after a deposit or withdrawal day to the
   next one, or to the end of the month. One row per wallet per period, below
   that day's transactions, so its change equals the step in the balance.
3. **Copy.** The toggle reads «מרוכזת · יומית». A period row reads
   «10–16 באוקטובר · 7 ימים» (`dayRange`, `TRANSACTION_ROW_COPY.interestPeriod`),
   and a one-day period shows its date.
4. **Month heading** shows the month's interest, «ריבית החודש +₪7.96», and its
   year.
5. **Glossary:** rows for the interest period and for the month's interest.

## Decisions (2026-10-22)

- Balances come only from `balanceHistory`; the rows are not summed a second time.
- The month's interest is counted from the month's transactions, so it stays
  beside the name when the type filter hides the interest rows.
- The month's interest is shown to the agora, like the rows under it, not to the
  tenth like the page's other totals.
- Every month heading names its year («אוקטובר 2026»); `asOf` no longer reaches
  the list.
- The range shows as «16–10 בדצמבר» on screen: it is the browser's Hebrew
  `formatRange`, read right to left.
