# Bugs

Known bugs not yet fixed. Add items freely; promote to `.plans/` when picked up.

## Goal

### A refused withdrawal leaves the drawer showing an error after it refreshes

When the server refuses a withdrawal with `409` (savings kept for a goal), the drawer refreshes the
page and then shows its failure alert. The spec says it should return to idle: the refreshed account
shows savings as locked, and the lock panel is the message.

- **Fix:** in `useAmountEntry`, set `requestState` to idle instead of failed after a `409`.
- **Where:** `src/components/Account/TransactionDrawer/use-amount-entry.ts`.

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
