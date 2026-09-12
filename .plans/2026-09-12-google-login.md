# Google Login + Account Members — 10 PRs

> Written against `main` **after** the Neon/Postgres merge (`66f9c68`, PR #15).
> Supersedes the deferred Tasks 4–6 of `.plans/2026-07-25-neon-integration.md`.
> Restructured 2026-09-12 from four phases into ten independently shippable
> pull requests. The JSON→Neon import PR was dropped: there is no real data
> worth migrating, and it was new code serving a one-time need.

## Progress — updated 2026-09-12 (PR 2 open)

Plan PR numbers below are **not** GitHub PR numbers. Mapping so far:

| Plan    | GitHub                                                 | Branch                          | Status                                                       |
| ------- | ------------------------------------------------------ | ------------------------------- | ------------------------------------------------------------ |
| PR 1    | [#28](https://github.com/ShiraSpace/fun-saver/pull/28) | `feat/members-schema`           | **merged**                                                   |
| —       | [#29](https://github.com/ShiraSpace/fun-saver/pull/29) | test-utils rename               | **merged** (not in this plan)                                |
| —       | [#30](https://github.com/ShiraSpace/fun-saver/pull/30) | `feat/split-stores-by-entity`   | **merged** (not in this plan)                                |
| PR 2    | [#32](https://github.com/ShiraSpace/fun-saver/pull/32) | `feat/user-store-methods`       | **open** — also carries `BaseStore` and the `*.db.ts` rename |
| PR 3    | —                                                      | `feat/membership-store-methods` | **next**                                                     |
| PR 4–10 | —                                                      | —                               | not started                                                  |

**Two out-of-plan refactors landed between PR 1 and PR 2.** Neither is part of
the feature; both were done to stop later PRs making things worse.

- **#29** renamed `src/test-support/` → `src/test-utils/` and `e2e/support/` →
  `e2e/test-utils/`. Every `@/test-support/...` import is now `@/test-utils/...`.
- **#30** split the three stores into folders. This is the important one for
  PR 2 and PR 3 — see **Store layout after #30** below.

### Store layout after #30 and PR 2

```
src/db/data-store.ts       DataStore + the three repository interfaces
src/db/base-store.ts       BaseStore — every DataStore method, written once

src/db/memory-store/       index.ts  accounts.ts  transactions.ts  users.ts
src/db/json-file-store/    index.ts  accounts.ts  transactions.ts  users.ts  file-session.ts
src/db/postgres-store/     index.ts  accounts.ts  transactions.ts  users.ts  query.ts
```

Each entity file is one class implementing its repository interface. Each
`index.ts` now only constructs those classes and hands them to `super(...)` —
`BaseStore` holds the delegation, so a new `DataStore` method is written once
rather than three times. Class names are unchanged, so no caller outside
`src/db` moved.

The dependency each class takes differs by store: `PostgresAccounts` takes `sql`
(from `query.ts`), `MemoryAccounts` owns its own array, `JsonAccounts` takes a
`FileSession` — and **both json repositories must share one `FileSession`**, or
concurrent writes to the single file lose data. `json-file-store/__tests__/file-session.test.ts`
guards that.

Tests mirror the source, one test file per module, under each folder's `__tests__/`.

### Database state

| Branch                     | `users` / `account_members` | `role` CHECK |
| -------------------------- | --------------------------- | ------------ |
| Neon **dev**               | created                     | yes          |
| Neon **test**              | created                     | yes          |
| Neon **main** (production) | **not created**             | —            |

Production has never been migrated. Run `npm run db:migrate` against it only
when you mean to. Dev and test got the CHECK via a one-off
`ALTER TABLE ... ADD CONSTRAINT`, because `CREATE TABLE IF NOT EXISTS` cannot
add a constraint to a table that already exists — the runner ceiling this plan
documents, hit on its first real use. A fresh database gets it from `CREATE TABLE`.

### Conventions PR 2 added

- **`BaseStore` owns delegation.** A new `DataStore` method is one method in
  `src/db/base-store.ts` plus one method per repository class. Do not add
  delegating methods to a store's `index.ts`.
- **A test needing a live database is named `*.db.ts`**, beside `*.e2e.ts` and
  `*.visual.ts`: `accounts.db.ts`, `transactions.db.ts`, `users.db.ts`.
  `npm test` only matches `*.test.ts` and never loads them; `npm run test:db`
  selects them by the same name. This replaced a per-file `TEST_DATABASE_URL`
  guard that skipped the suite at runtime. `jest.config.ts` needs no entry.
- **`live-store.ts` reads `TEST_DATABASE_URL` itself and throws** when it is
  missing, so `test:db` without a database fails loudly rather than reporting
  green with everything skipped. `withLiveStore()` takes no argument and hands
  back `accountId` / `txId` / `userId` prefix helpers.
- **`test:e2e` runs `test:db` first**, so a broken query fails in seconds
  instead of after a full `next build`.

The old `git stash` entry named `PR2 user store methods` is obsolete — PR 2 was
written fresh against the split folders. Drop it.

### Naming settled in review

`#28`'s review produced three renames, all already applied on `main`:
`mutableEnv` uses a plain type annotation rather than an `as` cast; the row
fixtures in `row-mappers.test.ts` carry a `mock` prefix (`mockAccountRow`,
`mockUserRow`, …); and the URL fixtures in `index.test.ts` are
`mockPostgresUrl` / `mockDevPostgresUrl`.

**`TRACKED_ENV_KEYS` deliberately stays UPPER_CASE.** It is an `as const` list of
environment variable _names_ that `withCleanEnv` iterates — a real constant, not
a mock value. It was renamed to `trackedEnvKeys` once and reverted on purpose.
Leave it alone.

## Why

`page.tsx` calls `store.listAccounts()` and renders **every** account to whoever
opens the app. The Vercel deployment is public and ungated. Add Google sign-in
so a person owns what they created, and model ownership as a membership table
so sharing and per-child logins are later a row insert, not a re-architecture.

## Current state — verified 2026-09-12

Everything below was measured, not assumed. Re-check before relying on it.

**Repo / deploy**

- `origin` = `git@github.com:ShiraSpace/fun-saver.git`, default branch `main`.
- Production is live on Vercel (team `shiraspaces-projects`), deployed from
  `main` through the GitHub integration. It is **public and ungated**.
  `https://fun-saver-bz2phs1ad-shiraspaces-projects.vercel.app`
  (per-deployment URL; the stable alias is in the Vercel dashboard).
- **Every merged PR ships to public production.** This is the constraint the
  PR ordering below is built around. Production currently has 0 rows, so
  nothing real is exposed — but the app is reachable by anyone until PR 6.
- No `.vercel` directory and no Vercel CLI locally.

**Environment**

- `.env.local` exists with `DATABASE_URL`, `DEV_DATABASE_URL` and
  `TEST_DATABASE_URL` all set to three distinct Neon endpoints.
- It also carries three **empty, dead** `NEXT_PUBLIC_STACK_*` /
  `STACK_SECRET_SERVER_KEY` keys, left over from the abandoned Neon Auth plan.
  Delete them in PR 4; `AUTH_SECRET` / `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET`
  replace them.
- `DATABASE_URL`'s endpoint is **unpooled** while dev and test are pooled. Fine
  locally — it only feeds `npm run db:migrate`. Confirm Vercel's own
  `DATABASE_URL` uses the pooled string, since that one serves requests.

**Which store runs where** — `src/db/index.ts`

- `npm run dev` / `dev:mobile` → `NODE_ENV=development` → reads **`DEV_DATABASE_URL`
  only**. `DATABASE_URL` is deliberately ignored in development.
- Production → `DATABASE_URL` → Neon main.
- Neither set → silent fallback to `src/db/data.json`. Silent, not an error — a
  typo'd URL looks like a working app writing to the wrong place.
- e2e → `FUNSAVER_DATA_PATH` → a temp JSON file.

**Data**

| Store                      | accounts       | transactions |
| -------------------------- | -------------- | ------------ |
| local `data.json`          | 2 (אלי, מושית) | 179          |
| Neon **dev**               | 1              | 8            |
| Neon **main** (production) | 0              | 0            |
| Neon **test**              | 0              | 0            |

All three Neon branches are migrated (`accounts`, `transactions` exist).
`data.json`'s 2 accounts are **not** being migrated into Neon — that was the
dropped import PR. They stay where they are; local dev reads Neon dev and shows
its 1 account. Recreate through the UI if you want data locally.

**`listAccounts` callers** — measured, not assumed:
`src/app/page.tsx:17` is the **only** production caller. Everything else is the
three store implementations, the interface, and four test files. The "atomic
switch" of PR 9 is therefore small.

**Dependencies** — `npm install` has been run in `fun-saver/`; the
`fun-saver-edit-account` and `fun-saver-ralph-loop` worktrees may still need it.

**Mockup** — `mockups/login.html`, standalone, open in a browser. Four states
(signed out → signing in → new user → returning user) and all three themes.
Sign-in and sign-up are deliberately the same button; only the landing screen
differs.

## Decisions (confirmed)

- **Auth.js v5** (`next-auth@5`) + Google provider, **JWT sessions**, no DB adapter.
  Session `maxAge: 30d`, `updateAge: 24h` — rolling, so active users effectively
  never sign in again and only idle sessions expire.
  Chosen over Neon Auth / Stack Auth (the old Task 4 pick): Neon Auth keeps users
  in the managed `neon_auth.users_sync` table, so adding a child PIN identity
  later would mean running a second auth system. Auth.js keeps identity in our
  schema and a PIN is a Credentials provider away.
- **`account_members` join table**, name and shape carried over from the neon
  plan's deferred sketch. Users ↔ Accounts is many-to-many.
- **Roles:** `owner` | `editor` | `viewer` (the neon sketch said `guardian`;
  we use `editor`). Owner can share. Owner and editor can edit. Viewer reads.
  No capability abstraction — check the role.
- **`accounts` table is untouched.** No `user_id` column — the neon plan
  deliberately left it off and that decision still holds.
- **Only `owner` is ever issued.** `editor`/`viewer` are storable and enforced
  by the guard, but nothing hands them out until there is a sharing UI.
- **All three stores stay.** `JsonFileStore`, `PostgresStore` and `InMemoryStore`
  all implement `DataStore`; every new method lands three times. Deleting the
  JSON store is a separate cleanup, not this feature.
- **No data migration.** `data.json` is not imported into Neon. Existing Neon
  rows are adopted in place by PR 8's backfill, which is the only data step.
- **e2e uses `FUNSAVER_SKIP_AUTH=true`**, the bypass the neon plan already
  specified — but it hard-throws if `NODE_ENV === 'production'`.
- **Tests ride with their PR.** There is no trailing test phase. A PR that adds
  logic adds its tests before it merges, because merging means deploying. The
  repo workflow (production code → approval → commit → tests one at a time →
  approval → commit) runs _inside_ each PR.

## Model

```ts
export interface User {
  id: string;
  provider: 'google'; // 'pin' | 'password' later
  providerAccountId: string; // Google `sub`
  email: string;
  name: string;
  createdAt: string;
}

export type MembershipRole = 'owner' | 'editor' | 'viewer';

export interface AccountMember {
  accountId: string;
  userId: string;
  role: MembershipRole;
  addedAt: string;
}
```

```
User u1  Eli                       Account a1  נועה  ── wallets(JSONB) → transactions
User u2  Dana   (later)            Account a2  איתי  ── wallets(JSONB) → transactions
User u3  נועה   (later, own login)

account_members
  a1 → u1  owner     a2 → u1  owner
  a1 → u2  editor    (later: shared)
  a1 → u3  viewer    (later: נועה signs in herself)
```

Adding u2 or u3 touches **zero existing rows**.

## Schema (PR 1 — append to `src/db/schema.sql`)

The migration runner reads one idempotent `schema.sql`, so this is purely
additive — no ALTER, no versioning table needed.

```sql
CREATE TABLE IF NOT EXISTS users (
  id                  TEXT PRIMARY KEY,
  provider            TEXT NOT NULL,
  provider_account_id TEXT NOT NULL,
  email               TEXT NOT NULL,
  name                TEXT NOT NULL,
  created_at          TEXT NOT NULL,
  UNIQUE (provider, provider_account_id)
);

CREATE TABLE IF NOT EXISTS account_members (
  account_id TEXT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  user_id    TEXT NOT NULL REFERENCES users(id)    ON DELETE CASCADE,
  role       TEXT NOT NULL,
  added_at   TEXT NOT NULL,
  PRIMARY KEY (account_id, user_id)
);

CREATE INDEX IF NOT EXISTS account_members_user_idx ON account_members(user_id);
```

Run `db:migrate`, `db:migrate-dev`, `db:migrate-test`.

> **Known ceiling:** `run-migration.ts` only replays `CREATE ... IF NOT EXISTS`.
> It has no mechanism to ALTER an existing table idempotently. This feature adds
> tables only, so it is not a problem today — the day a column changes, the
> runner needs a versioned migrations table first.

## Authorization seam — the one file that tightens later

`src/lib/account-access.ts` (PR 9), framework-agnostic, unit-tested, the only
place that decides who may do what:

```ts
listAccountsForUser(store, userId): Promise<Account[]>   // replaces listAccounts()
requireMembership(store, userId, accountId): Promise<AccountMember>  // else Forbidden
assertCanEdit(role): void    // owner | editor
assertCanShare(role): void   // owner — defined, unused today
```

`DataStore.listAccounts()` is **deleted**, not kept-and-guarded, so no future
caller can leak someone else's child by accident.

---

# The PRs

Each PR branches off updated `origin/main`; a PR that depends on an unmerged
one branches off its parent and rebases when the parent lands. Every PR is
green and deployable on its own — merging it ships it.

**Critical path to closing the public hole: 1 → 2 → 4 → 5 → 6.**
PRs 3 and 7 can land in parallel with that chain.

### PR 1 — `feat/members-schema` — MERGED (#28)

- Append `users` and `account_members` to `schema.sql`; run all three migrate
  scripts.
- `src/lib/types.ts` — add `User`, `MembershipRole`, `AccountMember`.
  `Account` unchanged.
- `src/db/row-mappers.ts` — `UserRow`/`toUser`, `AccountMemberRow`/`toAccountMember`.

Tests: row-mapper unit tests alongside the existing ones.

Depends on: nothing. Ships: two unread tables; zero behaviour change.

### PR 2 — `feat/user-store-methods` — OPEN (#32)

Shipped as described, plus two things the section did not anticipate.

**`src/db/data-store.ts`** — `StoreData` gains `users: User[]`; a
`UserRepository` interface (`findByProvider`, `insert`); `DataStore` gains
`findUserByProvider` and `insertUser`.

**One `users.ts` per store folder** — `MemoryUsers` (own array), `JsonUsers`
(the shared `FileSession`), `PostgresUsers` (`Sql` from `./query`, a
parameterised `SELECT` through `toUser` and a tagged-template `INSERT`, backed
by PR 1's `UNIQUE (provider, provider_account_id)`).

**`emptyData()` gains `users: []`** — it lives in `json-file-store/file-session.ts`,
not `file.ts`; this plan named a file that does not exist.

**`BaseStore`** — the three `index.ts` files were 196 lines that differed only
in how they built their repositories. See _Conventions PR 2 added_ above.

**`*.db.ts`** — the live postgres suites were renamed and their per-file skip
guards deleted. Same section.

Tests: `users.test.ts` under `memory-store` and `json-file-store`, `users.db.ts`
under `postgres-store`. Each covers what is distinctive about its store — the
lookup, surviving a reopen of the file, live SQL — and both unit suites insert a
user before the unknown-id case so it proves the lookup discriminates rather
than passing on an empty store. `file.test.ts` gained the case that guards
`emptyData`: a file written before users existed reads back as no user. No test
for `BaseStore` — pure delegation, no branching, and `implements DataStore`
catches a missing method at compile time.

Depends on: PR 1 (merged) and #30. Ships: unused interface methods.

### PR 3 — `feat/membership-store-methods`

Same shape as PR 2: a `MemberRepository` in `data-store.ts` and one new
`members.ts` per store folder.

- `DataStore` gains `getMembership`, `listAccountsForUser`,
  `insertAccountWithOwner`. `listAccounts` **stays** — nothing breaks mid-stack.
  The three delegating methods are written **once**, in `base-store.ts`.
- `StoreData` gains `members: AccountMember[]`; `emptyData()` — in
  `json-file-store/file-session.ts` — gains `members: []`.
- `postgres-store/members.ts` — JOIN for `listAccountsForUser`, keeping
  `ORDER BY accounts.name`; `sql.transaction([...])` for `insertAccountWithOwner`.
- `json-file-store/members.ts` — the shared `FileSession` is what makes the
  two-write `insertAccountWithOwner` atomic; write both rows inside one
  `session.write(...)` before calling `save()` once.
- `memory-store/members.ts` — a second array.

`insertAccountWithOwner` spans two entities, so it belongs on the member
repository, which needs to reach accounts too — give `MemberRepository` the
whole operation rather than splitting it across two repositories and losing
atomicity.

Tests: `memory-store` and `json-file-store` — `listAccountsForUser` returns only
the user's accounts, `getMembership` returns undefined for a non-member,
`insertAccountWithOwner` writes both rows or neither. The postgres suite is
`postgres-store/__tests__/members.db.ts`; `live-store.ts` needs `account_members`
in its cleanup.

Depends on: PR 1. Ships: unused interface methods.

### PR 4 — `feat/google-auth`

**Blocked on the manual Google Cloud step below.**

- `src/lib/user-provisioning.ts` — Google `sub` → existing user, else create.
- `src/auth.ts` — Auth.js config; `signIn` → provisioning; `jwt`/`session`
  stamp `userId`.
- `src/app/api/auth/[...nextauth]/route.ts` — handler re-export, thin.
- `.env.example` — `AUTH_SECRET`, `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`.
  Delete the three dead `STACK_*` keys from `.env.local`.

Verifiable end to end through Auth.js's own default sign-in page — no UI needed
yet. **Sign in once on production after this merges**: that creates the `users`
row PR 8 assigns the existing accounts to. No risk; nothing is gated.

Tests: `user-provisioning` unit tests — a new `sub` creates a user, a known
`sub` reuses it and does not duplicate.

Depends on: PR 2. Ships: a working `/api/auth/*`; nothing else changes.

### PR 5 — `feat/login-page`

- `src/app/login/page.tsx` + `src/components/SignIn/` — one Google button, RTL,
  themed, per `mockups/login.html`. Sign-in and sign-up are the same button.

Reachable by URL; nothing redirects to it yet.

Tests: `SignIn` component test — renders the button, calls `signIn('google')`.

Depends on: PR 4. Ships: a new route.

### PR 6 — `feat/auth-middleware`

**This is the PR that closes the public hole. Nothing real is protected before it.**

- `src/middleware.ts` — unauthenticated → `/login`; honours
  `FUNSAVER_SKIP_AUTH` and **throws at startup if `NODE_ENV === 'production'`**.
- `e2e/server.ts` — `FUNSAVER_SKIP_AUTH=true` in the spawned env, so the
  existing e2e suite stays green.

Tests: the existing e2e suite passing with the bypass is the test. Add a unit
test that the production guard throws.

Depends on: PR 5. Ships: the app goes private.

### PR 7 — `feat/profile-section`

- `src/components/Menu/ProfileSection/` — signed-in name + sign out, mirroring
  `AppearanceSection`.

Tests: component test — renders the name, calls `signOut`.

Depends on: PR 4. Independent of 5/6 — can land any time after 4.

### PR 8 — `feat/assign-owner`

**The one data step. Without it, accounts created before auth have no member row
and go invisible the moment PR 9 lands.**

- `src/db/migration-target.ts` — **new**, `resolveTarget()` / `requireTargetUrl()`
  lifted out of `run-migration.ts` so both scripts share `--dev` / `--test`
  targeting.
- `src/db/assign-owner.ts` — every account with no member row gets an `owner`
  row for the user matching a given email. Idempotent.
- `db:backfill`, `db:backfill-dev`, `db:backfill-test` npm scripts.
- **Claude runs it from the session**, not you: `.env.local` is readable here and
  Neon is reachable (verified 2026-09-12 against dev). The **dev** run happens as
  part of this PR. The **main** run writes to production and needs your explicit
  go-ahead each time — it is never run unprompted.
- Verify zero orphans on every target, also run from the session:

```sql
SELECT COUNT(*) FROM accounts a
LEFT JOIN account_members m ON m.account_id = a.id
WHERE m.account_id IS NULL;   -- must be 0
```

Running this before anything enforces is free: nothing reads `account_members`
yet, so a wrong result breaks nothing and is fixed by re-running — which is
exactly when you want to find a bug in it.

Tests: unit tests against `InMemoryStore` — accounts without a member get one,
accounts with one are untouched, second run is a no-op.

Depends on: PR 3, and a real user row existing (so, after signing in once
post-PR 4).

> **Why not earlier?** Assigning an owner needs a user to assign to, and users
> only exist after a Google sign-in. Seeding a placeholder user at migration time
> would work, but only if provisioning then claimed it by matching on email — a
> permanent account-linking path added for a one-time bootstrap. Not worth it.

### PR 9 — `feat/scope-accounts-to-user`

**The switch. Atomic by necessity — deleting the interface method moves every
caller in one commit. Measured: one production caller.**

- **Re-run the backfill and re-check the orphan query first** (Claude runs both;
  production still needs your go-ahead). It is idempotent, and this closes the
  window for any account created during PRs 1–8.
- `src/lib/account-access.ts` — the seam above.
- `src/app/page.tsx` — `listAccounts()` → `listAccountsForUser(store, session.userId)`.
- **Delete `listAccounts`** from `DataStore` and all three stores; the compiler
  finds every caller.
- `POST /api/accounts` — `userId` from the session, **never** the body;
  `insertAccountWithOwner`, so every account created from here on is owned at
  birth. Request body stays `{name, avatarId}`.

Tests: `account-access` unit tests — owner and editor pass `assertCanEdit`,
viewer throws, `requireMembership` throws for a non-member. Route test:
unauthenticated `POST /api/accounts` → 401.

Depends on: PR 3, PR 8. Ships: users see only their own accounts.

### PR 10 — `feat/guard-transaction-routes`

- `src/app/api/accounts/[id]/{deposits,withdrawals,theme}/route.ts` —
  `requireMembership` + `assertCanEdit` before the existing `getAccount`.

Tests: per route — unauthenticated → 401, non-member `accountId` → 403.

Depends on: PR 9. Ships: writes are authorized.

---

## Architecture touch points

| Layer                                                             | Change                                                                    | PR      |
| ----------------------------------------------------------------- | ------------------------------------------------------------------------- | ------- |
| `src/db/schema.sql`                                               | append `users`, `account_members`                                         | 1       |
| `src/lib/types.ts`                                                | add `User`, `MembershipRole`, `AccountMember`                             | 1       |
| `src/db/row-mappers.ts`                                           | add `UserRow`/`toUser`, `AccountMemberRow`/`toAccountMember`              | 1       |
| `src/db/data-store.ts`                                            | add user methods, then membership methods, then **remove** `listAccounts` | 2, 3, 9 |
| `src/db/base-store.ts`                                            | delegate each new `DataStore` method once                                 | 2, 3, 9 |
| `src/db/postgres-store/{users,members}.ts`                        | implement — JOIN, `sql.transaction([...])`                                | 2, 3, 9 |
| `src/db/json-file-store/{users,members}.ts`                       | implement — `StoreData` gains `users`, `members`                          | 2, 3, 9 |
| `src/db/memory-store/{users,members}.ts`                          | implement — two arrays                                                    | 2, 3, 9 |
| `src/lib/user-provisioning.ts`                                    | **new** — Google `sub` → user, else create                                | 4       |
| `src/auth.ts`                                                     | **new** — Auth.js config                                                  | 4       |
| `src/app/api/auth/[...nextauth]/route.ts`                         | **new** — handler re-export                                               | 4       |
| `.env.example`                                                    | `AUTH_SECRET`, `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`                     | 4       |
| `src/app/login/page.tsx` + `src/components/SignIn/`               | **new** — one Google button, RTL, themed                                  | 5       |
| `src/middleware.ts`                                               | **new** — unauthenticated → `/login`; honours `FUNSAVER_SKIP_AUTH`        | 6       |
| `e2e/server.ts`                                                   | `FUNSAVER_SKIP_AUTH=true` in the spawned env                              | 6       |
| `src/components/Menu/ProfileSection/`                             | **new** — name + sign out                                                 | 7       |
| `src/db/migration-target.ts`                                      | **new** — shared `--dev` / `--test` target resolution                     | 8       |
| `src/db/assign-owner.ts`                                          | **new** — adopt orphan accounts as `owner`                                | 8       |
| `src/lib/account-access.ts`                                       | **new** — the authorization seam                                          | 9       |
| `src/app/page.tsx`                                                | `listAccounts()` → `listAccountsForUser(store, session.userId)`           | 9       |
| `src/app/api/accounts/route.ts`                                   | session `userId` + `insertAccountWithOwner`                               | 9       |
| `src/app/api/accounts/[id]/{deposits,withdrawals,theme}/route.ts` | `requireMembership` + `assertCanEdit`                                     | 10      |

Unchanged throughout: `AccountSwitcher`, `Account`, `AccountForm`, wallets,
drawer, transactions, theme, `EmptyState`, `use-create-account`.
`SELECTED_ACCOUNT_COOKIE` is client-writable but `page.tsx` already validates it
against the rendered list — scoping that list is the whole fix.

## Prerequisite (manual, once, before PR 4)

Google Cloud Console → OAuth 2.0 Client ID (Web). Authorised redirect URIs:
`http://localhost:3000/api/auth/callback/google` and the Vercel origin.
Secrets → `.env.local` and Vercel env; names only → `.env.example`.

## Shipping loose on purpose — and how each tightens

Every row below is a deliberate shortcut, with the change that closes it.
None requires new architecture.

| Loose now                                                                                                                                   | Tighten later                                                                                                      |
| ------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Only `owner` is ever issued                                                                                                                 | Sharing UI + `insertMember`. The guard already enforces all three roles — no route changes.                        |
| JWT sessions, 30d rolling, no server-side revocation — a lost phone can only be cut off by rotating `AUTH_SECRET`, which signs everyone out | Auth.js DB adapter + `users`-backed sessions, then revoke one session. App code unchanged; sign-out already works. |
| Google only                                                                                                                                 | Add a provider to `src/auth.ts`. `users.provider` is already a column, not an enum in the DB.                      |
| No child login                                                                                                                              | Credentials provider + `provider='pin'` user + member row. **No schema change.**                                   |
| `FUNSAVER_SKIP_AUTH` exists                                                                                                                 | Delete the env var once e2e can seed a real session cookie. Production already refuses it.                         |
| No rate limiting on sign-in                                                                                                                 | Vercel/Neon edge config; no app change.                                                                            |
| No audit trail                                                                                                                              | `account_members.added_at` is the start; add `added_by` when sharing ships.                                        |

## Out of scope

Sharing UI and invites; child PIN/password; issuing `editor`/`viewer`; account
deletion; ownership transfer; deleting `JsonFileStore`; versioned migrations;
migrating `data.json` into Neon.

## Starting this in a fresh session

1. **Read the Progress section at the top of this file first.** It records what
   has merged, the store layout PR 2 and PR 3 now land in, and which database
   branches are migrated.
2. **Fetch, then** `git checkout -b feat/user-store-methods origin/main`.
   Drop the stale `PR2 user store methods` stash — see the Progress section.
3. **Read before coding:** `src/db/data-store.ts` (the interface plus the three
   repository interfaces), any one store folder end to end — `memory-store/` is
   the smallest — `src/db/index.ts` (store selection), `src/app/page.tsx` (the
   unscoped `listAccounts()` call this feature exists to kill), and `AGENTS.md`
   — this is Next.js 16 and the docs in `node_modules/next/dist/docs/` are
   authoritative over training data.
4. **Repo workflow is checkpoint-driven, per PR.** Production code first,
   committed on approval, then tests one at a time. No commits or pushes without
   explicit approval. See CLAUDE.md.
5. **Verification that actually catches things**, in rising cost:
   `npx tsc --noEmit`, `npx eslint .`, `npx jest`, then `npm run test:db`
   (live Neon), `npm run build`, and `npm run test:e2e`. The last three catch
   what the first three miss — folder resolution, and anything only the real
   app exercises.
6. **Start with PR 3.** PR 2 is open as #32. Both are additive only; nothing
   reads the new methods until PR 9.

### Still undecided

- Whether to delete the pre-existing Neon **dev** account (1 account, 8
  transactions, from the Postgres work) before PR 8. If kept, the backfill
  adopts it as yours.
- When "go-live" is — the moment production gets real data, PR 10 must already
  have merged.
- Whether `data.json` and `JsonFileStore` retire once Neon is the real store.
  Out of scope here, but it is the cleanup that would collapse three store
  implementations into two.
