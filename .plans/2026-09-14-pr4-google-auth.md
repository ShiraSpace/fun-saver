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
provisioning would have to happen twice or be re-read.

Settled the other way under review: **`signIn` only validates the profile shape
and `jwt` does the provisioning.** One provisioning site, and `AccessDenied` keeps
a single meaning. `provisionUser` is idempotent and always returns a user, so
`token.userId` cannot be undefined. `jwt` sees a `profile` only at sign-in;
afterwards the token carries `userId` and neither callback touches the database.

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

## Decisions taken under review

**Sign-in is open to any Google account, deliberately.** There is no allowlist.
A stranger who signs in gets a `users` row and no `account_users` rows, so once
PR 9 deletes `DataStore.listAccounts()` and routes every read through
`listAccountsForUser`, they see an empty app rather than anyone's data.

**This makes an ordering constraint, not a free choice: PR 9's read path must
land before or together with PR 6's gate.** A PR 6 that gates on "has a session"
while `page.tsx` still calls `listAccounts()` would let every signed-in stranger
see all four real accounts. If PR 6 has to ship first, add the allowlist
(`AUTH_ALLOWED_EMAILS` checked in `signIn`, plus `profile.email_verified`, since
it keys on email) in the same PR.

**A stored user is never reconciled with the Google profile.** A changed display
name or email stays as it was at first sign-in. `UserRepository` has no `update`,
and adding one means three store implementations plus tests — its own PR, not a
widening of this one. The reuse test pins the current behaviour on purpose; it is
a record of the decision, not an accident.

**`signIn` does pure logic only.** `@auth/core` wraps any non-`AuthError` thrown
from `signIn` in `AccessDenied`
(`lib/actions/callback/index.js`), so a database outage there would render to the
user as "Access Denied" — indistinguishable from "you are not permitted". All
database work happens in `jwt`, where a failure surfaces as a real error, and
`signIn` only validates the profile shape. This is also where an allowlist
belongs if one is ever added.

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
