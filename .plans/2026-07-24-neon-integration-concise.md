# Neon Integration Plan — Postgres + Shared Password Gate

**Goal:** Deploy the app to Vercel with Neon Postgres as the store, gated by one shared password. Real per-user auth (Neon Auth + Google + household sharing) is a follow-up PR after this ships.

**Scope decisions:**

- No `users` table, no `user_id` on accounts — v1 is single-tenant, shared data
- `src/db/data.json` is dev sample data → no migration script; recreate the account in prod via the UI
- Cookie: HttpOnly, HMAC-signed, 30-day expiry, no external auth libs
- E2e tests bypass the gate via `FUNSAVER_SKIP_AUTH=true` (same pattern as `FUNSAVER_NOW`)

---

## Prerequisites

- [ ] Create a Neon project → copy the pooled connection string into `.env.local` as `DATABASE_URL`
- [ ] Generate `APP_SESSION_SECRET` (`openssl rand -hex 32`) and pick an `APP_PASSWORD` → add both to `.env.local`

---

## Task 1 — SQL schema

- [ ] Write `src/db/schema.sql` with `accounts`, `wallets`, `transactions` (all IDs `TEXT`, dates `TEXT`, cascading FKs)
- [ ] Add a one-shot `src/db/run-migration.ts` runner + `npm run db:migrate` script
- [ ] Install `@neondatabase/serverless`
- [ ] **Verify:** run `npm run db:migrate` → open Neon console → confirm the three tables and their columns exist
- [ ] Commit

## Task 2 — PostgresStore

- [ ] Implement `src/db/postgres-store.ts` against the existing `DataStore` interface (no signature changes)
- [ ] **Verify:** no test yet — round-trip is validated in Task 3
- [ ] Commit

## Task 3 — Wire store selection

- [ ] Update `src/db/index.ts` to return `PostgresStore` when `DATABASE_URL` is set, else `JsonFileStore` (plain singleton)
- [ ] Update `.env.example` with `DATABASE_URL`, `APP_PASSWORD`, `APP_SESSION_SECRET` (do NOT list `FUNSAVER_SKIP_AUTH`)
- [ ] **Verify unit:** `npm test` — all existing tests still green (no `DATABASE_URL` in test env)
- [ ] **Verify manual:** `npm run dev` with `DATABASE_URL` set → create an account → refresh → account persists → Neon console shows the row
- [ ] Commit

## Task 4 — Shared password gate

- [ ] Add `src/lib/auth.ts` — sign/verify session cookie with `crypto.createHmac` (no deps), 30-day expiry
- [ ] Add `src/app/login/page.tsx` + `LoginForm.tsx` + `constants.ts` (Hebrew RTL, matches app style, uses `data-testid`)
- [ ] Add `src/app/api/auth/login/route.ts` (checks `APP_PASSWORD`, sets cookie) and `src/app/api/auth/logout/route.ts` (clears cookie)
- [ ] Add `src/middleware.ts` — redirect to `/login?redirectTo=...` when cookie missing/invalid; bypass on `FUNSAVER_SKIP_AUTH=true`; skip static assets
- [ ] **Verify unit:** `npm test` — all existing tests still green (middleware doesn't run in Jest)
- [ ] **Verify manual:** clear cookies → visit `/` → redirected to `/login` → wrong pw shows error → right pw loads app → refresh keeps you in
- [ ] Commit

## Task 5 — E2e auth bypass

- [ ] Add `FUNSAVER_SKIP_AUTH: 'true'` to the env block in `e2e/server.ts`
- [ ] **Verify:** `npm run test:e2e` passes unchanged
- [ ] Commit

## Task 6 — Deploy to Vercel

- [ ] Run `npm run build` locally — fix any type errors before pushing
- [ ] Push branch to GitHub → import project on vercel.com (Next.js auto-detected)
- [ ] Set Production env vars in Vercel: `DATABASE_URL` (pooled), `APP_PASSWORD`, `APP_SESSION_SECRET` (fresh secret, not your local one). Do NOT set `FUNSAVER_*` vars
- [ ] Trigger first deploy
- [ ] **Verify:** open Vercel URL on phone → login screen → enter password → create account → add deposit → refresh → both persist → Neon console shows data
- [ ] Add to home screen (Android Chrome / iOS Safari)

---

## Testing Summary

| Task              | Automated          | Manual                                                      |
| ----------------- | ------------------ | ----------------------------------------------------------- |
| 1 — Schema        | —                  | Neon console shows the three tables                         |
| 2 — PostgresStore | —                  | covered by Task 3                                           |
| 3 — Wire store    | `npm test` green   | Account persists across refresh via Neon                    |
| 4 — Password gate | `npm test` green   | Redirect + wrong-pw error + right-pw enters + refresh stays |
| 5 — E2e bypass    | `npm run test:e2e` | —                                                           |
| 6 — Deploy        | —                  | Full round-trip on phone against production                 |

---

## Out of scope (future PRs)

- Real auth: Neon Auth (Stack Auth) with Google + email/password, plus a household-sharing model (`users`, `households`, `household_members`, `invites` tables; invite-link flow; first-run "create or join household" page; per-household scoping on every store method)
- PWA manifest for a proper home-screen icon
- In-app password rotation (for now: change `APP_PASSWORD` in Vercel + redeploy)
