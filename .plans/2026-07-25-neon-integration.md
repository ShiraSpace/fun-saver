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

Schema decision: **wallets are embedded on the `accounts` row as JSONB**, not a separate table. Each account owns exactly three wallets, always created together — no independent lifecycle to justify a join table. `transactions.wallet_id` stays as plain TEXT (no FK).

Steps:

1. Revise `src/db/schema.sql`: drop the `wallets` table, add `wallets JSONB NOT NULL DEFAULT '[]'::jsonb` on `accounts`, make `user_id` nullable (Stack Auth wires it up in Task 4).
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

## Task 4 — Stack Auth setup

**Files:** `src/stack.ts`, `src/app/handler/[...stack]/page.tsx`, `src/app/layout.tsx`

Steps:

1. Install `@stackframe/stack`
2. Create `src/stack.ts` — `StackServerApp` with `tokenStore: 'nextjs-cookie'`
3. Create `src/app/handler/[...stack]/page.tsx` — renders `StackHandler`
4. Update `src/app/layout.tsx` — wrap children in `StackProvider` and `StackTheme`
5. Run `npm test` — all tests green
6. Manual: visit `/handler/sign-in`, sign up, confirm redirect to app
7. Commit

**Test:** All tests pass. Sign-in page renders and sign-up flow works.

---

## Task 5 — Protect routes with middleware

**Files:** `src/middleware.ts`

Steps:

1. Create `src/middleware.ts` — delegates to `stackServerApp.middleware`. When `FUNSAVER_SKIP_AUTH=true`, passes through (for e2e tests).
2. Run `npm test` — all tests green
3. Manual: clear cookies, visit `/` — expect redirect to sign-in. Sign in — expect app loads. Sign out — expect redirect.
4. Commit

**Test:** All tests pass. Unauthenticated access redirects to sign-in.

---

## Task 6 — E2e auth bypass

**Files:** `e2e/server.ts`

Steps:

1. Add `FUNSAVER_SKIP_AUTH: 'true'` to the env block in `e2e/server.ts`
2. Run `npm run test:e2e` — all e2e tests pass unchanged
3. Commit

**Test:** All e2e tests pass (Puppeteer bypasses the sign-in wall via env var).

---

## Task 7 — Deploy to Vercel

Steps:

1. Push branch to GitHub
2. Import project on vercel.com → New Project → select `fun-saver`
3. Set env vars: `DATABASE_URL` (Neon pooled), Stack Auth keys
4. Deploy
5. Smoke test on phone: sign in, confirm שירה's balances, make a deposit, refresh — confirm it persists

**Test:** App loads on phone, data persists after deposit.
