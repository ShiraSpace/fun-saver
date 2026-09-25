# Bugs

Known bugs not yet fixed. Add items freely; promote to `.plans/` when picked up.

## Interest

### A page load that loses the settling race shows interest that was never stored

Two page loads that settle the same day at the same moment each build that day's interest with a
new id. Only the first is stored; the second insert is skipped by the once-per-day rule (#165).
The losing page load still shows its own copy, so its screen holds an interest transaction whose id
is not in the database. The next load reads from the database and shows the stored one.

- **Today:** display only. The day appears once, the amount and balance are right, and nothing
  sends a transaction id back to the server.
- **Breaks when:** anything acts on a transaction by id (undo, details, edit). The losing page load
  would send an id no row has.
- **Fix:** have `insertTransactions` return what it stored (`RETURNING` in Postgres, the filtered
  list in the JSON and in-memory stores) and show those, or re-read the transactions after
  settling.
- **Where:** `settleAccountInterest` in `src/lib/interest/interest-settlement.ts` returns
  `settledInterest` whether or not it was stored.
