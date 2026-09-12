# Neon Integration Plan

**Goal:** Replace JSON file store with Neon Postgres and add Stack Auth login so the app can be deployed to Vercel and used by the family.

**Stack:** Next.js 16 App Router, `@neondatabase/serverless`, `@stackframe/stack`, Vercel

---

## Prerequisites (manual, before any code)

1. Create a Neon account, create a project named `fun-saver`
2. In Neon console → Branches, create a `test` branch from `main`
3. Enable Neon Auth (Settings → Auth)
4. Add to `.env.local`:
   - `DATABASE_URL` — main branch connection string
   - `TEST_DATABASE_URL` — test branch connection string
   - `NEXT_PUBLIC_STACK_PROJECT_ID`, `NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY`, `STACK_SECRET_SERVER_KEY` — from Neon Auth → SDK keys

---

## Task 1 — SQL Schema

**Files:** `src/db/schema.sql`, `src/db/run-migration.ts`, `package.json`

Steps:

1. Create `src/db/schema.sql` — tables: `accounts`, `wallets`, `transactions`. Dates and IDs as TEXT. Foreign keys with CASCADE.
2. Install `@neondatabase/serverless`
3. Create `src/db/run-migration.ts` — reads schema file, runs it against `DATABASE_URL`. Idempotent (`CREATE TABLE IF NOT EXISTS`).
4. Add scripts: `db:migrate` and `db:migrate-test` (uses `TEST_DATABASE_URL`)
5. Run `npm run db:migrate` and `npm run db:migrate-test`
6. Commit

**Test:** Neon console → Tables — verify `accounts`, `wallets`, `transactions` exist on both `main` and `test` branches.

---

## Task 2 — PostgresStore

**Files:** `src/db/postgres-store.ts`, `src/db/schema.sql`

Schema decisions:

- **Wallets are embedded on the `accounts` row as JSONB**, not a separate table. Each account owns exactly three wallets, always created together — no independent lifecycle to justify a join table. `transactions.wallet_id` stays as plain TEXT (no FK).
- **No `user_id` column on `accounts`**. An account represents a child (or shared savings pot) that multiple humans may access (kid + parent + sibling). The user-to-account relationship is many-to-many and will live in a future `account_members` join table (see Task 4 note). Do not couple `accounts` to a single owner.

Steps:

1. Revise `src/db/schema.sql`: drop the `wallets` table, add `wallets JSONB NOT NULL DEFAULT '[]'::jsonb` on `accounts`, drop `user_id` column (idempotent).
2. Re-run `npm run db:migrate` and `npm run db:migrate-test`.
3. Create `src/db/postgres-store.ts` implementing the `DataStore` interface using `neon` tagged-template queries. Comment the intentional race-window trade-off on `insertTransactionWithGuard` (read-then-insert, no `SELECT ... FOR UPDATE`; acceptable for family scope).
4. Run `npm test` — all existing tests still pass.
5. Commit.

**Test:** All existing unit tests pass. Store correctness verified manually via Task 3's smoke test (Neon console shows the persisted account after creation).

### Skipped: automated integration tests for `PostgresStore`

Deferred on purpose. Reasoning:

- `PostgresStore` is thin CRUD glue; the interesting logic (balance, interest, overdraft) is already covered by unit tests on `src/lib/`.
- No CI is wired up yet, so a skip-on-missing-env test file would never actually run and would decay silently.
- Manual smoke test in Task 3 catches the wiring failure modes we care about most (JSONB round-trip, real Neon roundtrip).

**Revisit when:** we add CI, when a second contributor joins, or after the first bug caused by a `PostgresStore` change slips through.

**When resurrecting:** patterns to reuse — `jest-environment: node` docblock, guard with `if (!TEST_URL) { it.skip(...); return; }` inside the describe, per-run id prefix (`it-<timestamp>-<random>`), `afterEach` cleanup by prefix. Add `--env-file-if-exists=.env.local` to the `npm test` script so local devs get the DB suite automatically.

---

## Task 3 — Wire store selection

**Files:** `src/db/index.ts`, `.env.example`

Steps:

1. Update `src/db/index.ts` — return `PostgresStore` when `DATABASE_URL` is set, `JsonFileStore` otherwise
2. Update `.env.example` — document all new env vars
3. Run `npm test` — all tests green (no `DATABASE_URL` set in tests → `JsonFileStore` used)
4. Manual: start dev with `DATABASE_URL` set, create an account, confirm it persists in Neon console
5. Commit

**Test:** All existing tests pass. Account persists in Neon console after creation.

---

## Tasks 4, 5, 6 — Deferred (Stack Auth and e2e bypass)

Skipped for now. Ship the app publicly on Vercel first, add auth later once we have real users beyond ourselves.

**What's deferred and why:**

- Task 4 (Stack Auth setup) — no sign-in flow yet
- Task 5 (route-protecting middleware) — nothing to protect while there's no auth
- Task 6 (e2e `FUNSAVER_SKIP_AUTH=true` bypass) — nothing to bypass

**Also deferred (from earlier Task 4 note): `account_members` join table** — many-to-many users ↔ accounts. Add when we introduce per-account permissions.

```sql
CREATE TABLE account_members (
  account_id TEXT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  user_id    TEXT NOT NULL,
  role       TEXT NOT NULL,       -- 'owner' | 'guardian' | 'viewer'
  added_at   TEXT NOT NULL,
  PRIMARY KEY (account_id, user_id)
);
```

**Revisit when:** we want to share the URL beyond the immediate household, when logs show unknown visitors, or before adding any feature that writes sensitive data.

---

## Task 7 — Deploy to Vercel (no app-level auth)

**Public deployment.** Anyone with the URL can view and modify data. Acceptable for now — the URL isn't shared and there's no sensitive data. Revisit when Task 4 is picked up.

Steps:

1. `next build` locally — catch any Next.js 16 build issues before Vercel does
2. Confirm `main` branch schema in Neon matches the current `schema.sql` (it does — migrations already ran)
3. **Merge PR #15 into `main`.** Vercel deploys from `main` by default; without the merge the deployed build won't contain any Neon integration code and the `DATABASE_URL` env var will do nothing
4. Vercel → New Project → import `ShiraSpace/fun-saver`, production branch = `main`
5. Add env var: `DATABASE_URL` = Neon **main** branch pooled connection string. Do not set `DEV_DATABASE_URL` (that's for local dev only).
6. Deploy
7. Smoke test on phone: create account, deposit, refresh; confirm data persists in Neon main branch

**Test:** App loads on phone. Data survives a refresh. Neon `accounts` and `transactions` on main branch reflect the smoke-test writes.
