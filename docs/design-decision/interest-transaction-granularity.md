# Interest transaction granularity — keep one row per day

**Status:** accepted
**Date:** 2026-09-12
**Related code:** `src/lib/interest/add-daily-interest.ts`, `src/db/schema.sql`

## Question

Interest accrues daily and is persisted as one `type: 'interest'` transaction per wallet per day. This is a lot of writes for a long-lived wallet. Is it worth changing to a lower-granularity representation (aggregate per settlement run, monthly settlement, or derive-on-read)?

## What we measured

### Row size — one interest transaction

Postgres TEXT (varlena, 1-byte length header for values ≤126 chars), 8-byte row alignment.

| Field                  | Sample                     | Bytes |
| ---------------------- | -------------------------- | ----: |
| `id` (UUID)            | 36 chars                   |    37 |
| `wallet_id`            | `savings`                  |     9 |
| `account_id` (UUID)    | 36 chars                   |    37 |
| `type`                 | `interest`                 |     9 |
| `amount` (int4)        | —                          |     4 |
| `occurred_at`          | `2026-06-12`               |    11 |
| `created_at`           | `2026-06-12T14:30:00.000Z` |    25 |
| Column data            |                            |  ~132 |
| Heap header + line ptr |                            |   ~32 |
| **Heap row**           |                            |  ~164 |

Add indexes touched by every insert:

- PK btree on `id`: ~55 B
- Composite btree on `(account_id, wallet_id)`: ~65 B

**≈ 280 bytes per interest row, all-in.** Round to **300 B** to cover WAL and minor bloat.

### Projection to 1,000 users

Assumptions:

- 1 savings wallet per user earns interest (spending and goodDeeds have rate 0 → no interest rows).
- Deposit/withdrawal volume negligible next to daily interest volume.

| Scenario                                       | Rows | Storage |
| ---------------------------------------------- | ---: | ------: |
| 1,000 users, 6-month avg history (linear ramp) | 180K |  ~54 MB |
| 1,000 users × 1 year steady state              | 365K | ~110 MB |
| 1,000 users × 2 years (+ ~30% MVCC/WAL bloat)  | 730K | ~285 MB |
| 1,000 users × 3 years (+ bloat)                | 1.1M | ~430 MB |

### Neon Free tier (binding constraints)

- **Storage: 0.5 GB / project** ← binding constraint
- Compute: 100 CU-hours / month
- Egress: 5 GB / month
- Hitting any monthly limit suspends compute until next billing period.

Compute and egress are not the concern at this shape of workload; storage is.

## Alternatives considered

1. **Lazy aggregate** — same daily-compound math, but emit one interest transaction covering the whole settled period on each run. ~5× write reduction; loses per-day granularity in transaction history.
2. **Monthly settlement (avg daily balance)** — one interest row per wallet per month, using bank-style average-daily-balance math. ~30× fewer rows, but a real behavior change (mid-month deposits earn less than under daily compounding).
3. **Derive-on-read, never persist** — compute current balance from principal transactions + rate + duration on every read. Zero writes, but the "you earned interest!" moment disappears from transaction history.

## Decision

**Keep the current design: one interest transaction per wallet per day.**

Rationale:

- At 1,000 users, one year of steady-state usage stores ~110 MB — well under Neon Free's 0.5 GB.
- The "you earned interest today" transaction is a product feature, not just a bookkeeping artifact. It shows up in the child's transaction history and reinforces the yield mechanic described in `docs/the-method.md`.
- We do not project to reach the 1,000-user, multi-year scale where the storage math becomes uncomfortable.
- The alternatives all trade UX or math correctness for storage we don't need to save yet.

## Revisit if

- Sustained user growth pushes storage above ~250 MB (half of Free tier).
- We add more wallets-with-interest or shorten the accrual period (e.g., hourly interest for gamification).
- We upgrade Neon tiers for reasons other than transaction volume (larger indexes, longer retention) — at which point storage headroom is not the constraint anyway.
- We introduce a data retention policy (e.g., archive interest older than N months into a summary row); implement lazy aggregate at that boundary rather than up front.
