# Interest per period on the transactions page

Mockup: https://claude.ai/artifact/QPx35jHFhDNN4M6C1VcNxw

## Problem

Each row's יתרה is the end-of-day total of its day, so two withdrawals on one day
share a balance, and one interest row per month (`+₪7.26 · 17 ימים`) does not
match the balance step beside it, because the balances already hold that
interest day by day.

## Change

1. **Balance after each row.** Rows are sorted newest first, then the newest row
   of each day takes that day's closing balance and every older row on the same
   day takes the newer row's balance less its change.
2. **Interest per period.** `INTEREST_MODE.monthly` becomes `byPeriod`. An
   interest period runs from the day after a deposit/withdrawal day to the next
   deposit/withdrawal day, or to the end of the month. One row per wallet per
   period, sitting after that day's transactions, so its change equals the step
   in the balance.
3. **Copy.** The toggle reads «מרוכזת · יומית». A period row reads
   «10–16 באוקטובר · 7 ימים» (`formatRange`), and a one-day period shows its date.
4. **Month heading** shows the month's interest: «ריבית החודש +₪7.26».
5. **Glossary:** an `interestPeriod` row.

## Progress

- [x] Production code
- [x] Tests
- [x] PR with screenshots
