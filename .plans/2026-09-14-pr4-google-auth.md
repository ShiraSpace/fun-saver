# PR 4 — `feat/google-auth`

> Plan PR 4 of `.plans/2026-09-12-google-login.md`, expanded for implementation.
> Branch `feat/google-auth`, cut from `origin/main` at `070eaaa`.
> Approved 2026-09-14.

## Prerequisites — both done before this plan was approved

- **Google Cloud OAuth 2.0 Client (Web)** created. Authorised redirect URIs
  registered for `http://localhost:3000` and `https://fun-saver.vercel.app`,
  plus two extra Vercel URLs that will never resolve (see below).
  `AUTH_SECRET` / `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` are in `.env.local`
  and in Vercel's Production environment. The dead `STACK_*` keys were deleted
  from `.env.local` at the same time.
- **Neon `production` migrated.** `users` and `account_users` now exist on
  branch `production` (`br-old-snow-a2xg871l`), with the `role` CHECK, both
  foreign keys, both primary keys and `account_users_user_idx`. Verified
  through the Neon MCP after running `npm run db:migrate`.

### The production URL, corrected

`https://fun-saver.vercel.app` is the stable, public, ungated production origin.
The URL recorded in the parent plan
(`fun-saver-bz2phs1ad-shiraspaces-projects.vercel.app`) is **not** usable:

- it is a per-deployment URL and changes on every deploy, and
- it redirects to `vercel.com/sso-api` — it is behind Vercel deployment
  protection, so an OAuth round-trip can never complete through it.

`fun-saver-git-main-shiraspaces-projects.vercel.app` is stable but likewise
SSO-gated. Both are registered in Google and both are dead weight. **Sign in
through `https://fun-saver.vercel.app`.** Preview deployments cannot sign in;
that is expected, not a bug.

### Production is not empty

The parent plan says production has 0 rows. It holds **4 accounts and 216
transactions**. `users` and `account_users` are empty, as expected for new
tables. Consequences: PR 6 is the real urgency, not a formality, and PR 8 has
four real accounts to assign rather than none.

## Library — Auth.js v5 (`next-auth@beta`)

Chosen over `next-auth@4`, which is the `latest` tag. Both declare `next@^16`
support, so that is not the differentiator. v4 has no `auth()` universal helper,
which **PR 6 (`proxy.ts`) and PR 7 (profile section) both need** — picking v4
means rewriting `src/auth.ts` at PR 6. Accepted cost: v5 is still labelled beta.

## Files

| File | What |
| --- | --- |
| `src/lib/user-provisioning.ts` | `provisionUser(store, identity)` — find by `('google', sub)`, else build with `newId()` and `new Date().toISOString()` and insert. Pure logic; takes a `DataStore`; imports no Auth.js. |
| `src/auth.ts` | `NextAuth({...})` — Google provider, `signIn` provisions, `jwt` / `session` stamp `userId`. |
| `src/app/api/auth/[...nextauth]/route.ts` | `export const { GET, POST } = handlers` and nothing else. |
| `.env.example` | Add `AUTH_SECRET`, `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET` — names, empty values. |
| `package.json` | `next-auth` dependency. |

Reused rather than rewritten: `newId()` (`src/lib/ids.ts`), `DuplicateUserError`
(`src/lib/errors.ts`), `createMockUser` (`src/test-utils/fixtures.ts`),
`MemoryStore` for tests.

`today()` from `src/lib/clock.ts` is deliberately **not** reused: it returns
`YYYY-MM-DD`, and `User.createdAt` is a full ISO timestamp. `new
Date().toISOString()` inline matches `src/lib/transactions.ts` and
`src/lib/interest/add-daily-interest.ts`.

All files sit well under #46's 200-line file and 40-line function caps.

## Where provisioning runs

The parent plan says `signIn` provisions and `jwt` stamps `userId`. In Auth.js
v5 the `signIn` callback returns a boolean and **cannot hand data to `jwt`**, so
`jwt` re-reads the user by `('google', sub)`.

Keeping that shape anyway: a provisioning failure inside `signIn` produces a
clean `AccessDenied` rather than an opaque token error. The extra read happens
on first sign-in only — afterwards the token carries `userId` and neither
callback touches the database.

## Tests — written after the production code is committed, one at a time

`src/lib/__tests__/user-provisioning.test.ts`, against `MemoryStore`:

1. A new `sub` creates a user.
2. A known `sub` reuses it and does not duplicate.

Each test is mutation-checked: break the implementation, watch *that* test fail,
restore. Per the handover, a test that has never failed proves nothing — three
of plan PR 3's tests passed against deliberately broken implementations.

`src/auth.ts` gets no unit test here. It is configuration, which is why the
provisioning logic lives in its own module. It is verified by signing in.

## Verification

- `npm run lint`
- `npm test`
- `npm run dev`, then sign in at `http://localhost:3000/api/auth/signin` —
  Auth.js's own default page. No UI ships in this PR.
- Confirm the `users` row landed by querying Neon `dev` (`npm run dev` resolves
  `DEV_DATABASE_URL`).

## Deliberately out of scope

- **Nothing is gated.** `page.tsx` still calls `listAccounts()` and renders all
  four real accounts to anyone. That is PR 6.
- **No `auth.config.ts` edge split.** v5 wants configuration split in two once
  `proxy.ts` needs edge-safe config. Building it now is scaffolding for a PR
  that has not started.
- **Sign in once on production after this merges** — that creates the `users`
  row PR 8 assigns the four existing accounts to.

## Watch-outs

- **Next 16 renamed `middleware.ts` to `proxy.ts`.** No effect on PR 4; it
  rewrites PR 6's section of the parent plan.
- `next-auth` is ESM. If jest trips on it, only `src/auth.ts` is affected — the
  provisioning test does not import it. Report it rather than quietly
  reconfiguring jest.
