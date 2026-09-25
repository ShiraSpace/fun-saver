# A day's interest is settled once

Branch `fix/interest-paid-once`, off `origin/main` (ebfe561). Its own PR, outside the
transactions epic.

## Why it happened

Two causes, both proven by tests.

1. **Racing settlements (production and dev).** `settleAccountInterest` reads the account's
   transactions, works out the unsettled days and inserts them. Nothing stops two page loads
   doing that at the same time. Production, 2026-09-15 01:12:05: three requests each settled
   the day for all four accounts (8 extra rows, 176 agorot).
2. **Stale reads in `next dev` (dev only).** Next's `serverComponentsHmrCache` (on by default)
   replays every server-component `fetch` response on an HMR refresh, including `no-store`
   ones. The Neon driver runs each query as a `fetch`, so after a hot reload the page re-reads
   the transactions from the last full load, before that day was settled, and settles it again.
   This is what hid the stored 2026-09-23 from `settledThrough`: eight hot reloads over an
   hour, each re-rendering four page loads (32 extra copies per wallet). A throwaway `next dev`
   page reading `clock_timestamp()` returned the previous load's value on every HMR refresh;
   with the cache off, it read fresh.

Wallet ids are not unique across accounts. Every production account has wallets with the ids
`savings`, `spending` and `goodDeeds`. So the rule has to be per account:
**(account_id, wallet_id, occurred_at)**. An index on `(wallet_id, occurred_at)` would fail to
build on production and would reject real interest.

## Changes

1. `schema.sql`, replayed idempotently in the runner's single transaction:
   - delete the extra copies, keeping the earliest `created_at` (ties go to `id`) for each
     (account_id, wallet_id, occurred_at) of type `interest`; this is a no-op once clean
   - then `CREATE UNIQUE INDEX IF NOT EXISTS transactions_interest_once_per_day_idx ON
     transactions (account_id, wallet_id, occurred_at) WHERE type = 'interest'`

   The delete comes first, so the migration succeeds on any database without a manual clean-up
   first. On production it deletes the 8 rows, which is why production is migrated only after
   you approve it separately.
2. `PostgresTransactions.insert`: `ON CONFLICT (account_id, wallet_id, occurred_at) WHERE type =
   'interest' DO NOTHING`.
3. JSON file store and in-memory store: `insert` skips an interest transaction whose (account,
   wallet, day) is already stored or already earlier in the same batch. One shared helper in
   `src/db`, `withoutInterestAlreadySettled`. The JSON store's `FileSession` queue already
   makes its read and write atomic.

`serverComponentsHmrCache` stays on: the index already stops the extra writes.

## Tests (each watched failing against its own break)

- Settlement (in-memory store): settling the same day twice, where the second settlement reads
  the transactions from before the first, settles it once; two settlements racing settle it once.
- Stores: a second interest transaction for the same account, wallet and day is refused:
  in-memory and JSON (`*.test.ts`), Postgres (`transactions.e2e.ts`). A deposit on the same day
  is still stored, and so is interest for another account whose wallet has the same id.
- `test:db` uses `TEST_DATABASE_URL` (the `test` branch), so migrate it first with
  `npm run db:migrate-test`, and run it only when no other session is running it.

## Migration order

`test` (`--test`), then `dev` (`--dev`) once part 2 is done or approved. `production` (no flag)
only after you approve it separately. Before each run, the endpoint host is checked against its
branch: dev is `ep-red-firefly`, production `ep-jolly-truth`, test `ep-wispy-haze`.
