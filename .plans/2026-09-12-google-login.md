# Google Login + Account Users — 10 PRs

> Written against `main` **after** the Neon/Postgres merge (`66f9c68`, PR #15).
> Supersedes the deferred Tasks 4–6 of `.plans/2026-07-25-neon-integration.md`.
> Restructured 2026-09-12 from four phases into ten independently shippable
> pull requests. The JSON→Neon import PR was dropped: there is no real data
> worth migrating, and it was new code serving a one-time need.

## Progress — updated 2026-09-14 (plan PR 4 merged; PR 5 is next)

Plan PR numbers below are **not** GitHub PR numbers. Mapping so far:

| Plan    | GitHub                                                 | Branch                             | Status                                               |
| ------- | ------------------------------------------------------ | ---------------------------------- | ---------------------------------------------------- |
| PR 1    | [#28](https://github.com/ShiraSpace/fun-saver/pull/28) | `feat/members-schema`              | **merged**                                           |
| —       | [#29](https://github.com/ShiraSpace/fun-saver/pull/29) | test-utils rename                  | **merged** (not in this plan)                        |
| —       | [#30](https://github.com/ShiraSpace/fun-saver/pull/30) | `feat/split-stores-by-entity`      | **merged** (not in this plan)                        |
| PR 2    | [#32](https://github.com/ShiraSpace/fun-saver/pull/32) | `feat/user-store-methods`          | **merged**                                           |
| —       | [#33](https://github.com/ShiraSpace/fun-saver/pull/33) | `refactor/user-identity-predicate` | **merged** (not in this plan)                        |
| PR 3a   | [#41](https://github.com/ShiraSpace/fun-saver/pull/41) | `feat/account-user-reads`          | **merged** — `ca1a505`                               |
| PR 3b   | [#49](https://github.com/ShiraSpace/fun-saver/pull/49) | `feat/account-user-writes`         | **merged** — `41319f8`                               |
| PR 4    | [#53](https://github.com/ShiraSpace/fun-saver/pull/53) | `feat/google-auth`                 | **merged** — `5d02045`                               |
| PR 5    | —                                                      | `feat/login-page`                  | **next**                                             |
| PR 6–10 | —                                                      | —                                  | not started                                          |

**Sign-in works; nothing is gated.** PR 4 shipped Auth.js with Google, and
signing in provisions a `users` row and puts our own user id on the session.
`page.tsx` still calls `listAccounts()` and renders all four real accounts to
whoever opens the public URL. **PR 6 is what closes that, and it may not ship
before PR 9's read path — see _Authentication is open by design_ below.**

**No PR in this plan is open.** PR 5 branches off `main` and depends on PR 4.

### How to confirm work actually landed

`git log origin/main..origin/<branch>` is **not** the check — this repo
squash-merges, so a merged branch's commits are never ancestors of `main` and
that command always looks alarming. Use content instead:

```
git diff origin/main origin/<branch> --stat     # empty, or only main's newer work
git grep -c <a symbol the PR added> origin/main
```

This matters because a PR page saying "merged" is not proof either — see #47.

### Two PRs that are not what their status says

- [**#34**](https://github.com/ShiraSpace/fun-saver/pull/34) — plan PR 3 as a
  single PR. **Closed unmerged**, deliberately, and split into #41 and #47.
- [**#47**](https://github.com/ShiraSpace/fun-saver/pull/47) — GitHub says
  **merged**, and `main` never received a line of it. It was stacked on
  `feat/account-user-reads`, and when it was merged it went **into that branch**
  (`99a539b`) rather than into `main`, because it was never retargeted after #41
  landed. #49 is its four commits replayed onto current `main`.

  **The lesson, for any future stacked PR:** merging the parent does not
  retarget the child on its own in this repo. Either retarget the child to
  `main` before merging it, or merge the parent and confirm the child's base
  changed. Verify with `git log origin/main..origin/<branch>` — an empty result
  is the only proof the work actually landed. A green PR page is not.

**Three out-of-plan refactors have landed.** None is part of the feature; each
was done to stop later PRs making things worse.

- **#29** renamed `src/test-support/` → `src/test-utils/` and `e2e/support/` →
  `e2e/test-utils/`. Every `@/test-support/...` import is now `@/test-utils/...`.
  One file was missed and completed later: `e2e/support/css-color.ts`.
- **#30** split the three stores into folders — see **Store layout** below.
- **#33** extracted `findUserByIdentity` into `src/db/user-identity.ts`, which
  `MemoryUsers` and `JsonUsers` had each written for themselves.

**`main` also moved underneath this work** while plan PR 3 was open: #36, #42,
#43, #44 and #45 (styled-components extracted to `<Component>.styles.ts`), plus
**#46**, which caps files at 200 lines and functions at 40. #46 is the one to
keep in mind — PR 4 onward will be linted against it.

### Why PR 3 became two

The single PR carried a rename, three store implementations, a shared helper and
a two-table transaction. Splitting **by store** was impossible: `BaseStore`
gaining a fourth constructor argument forces all three to change together.
Splitting **by capability** worked, and put everything arguable in the smaller
half — the transaction, the single-`FileSession`-write atomicity, and
`PostgresAccountUsers` needing the concrete `PostgresAccounts`.
`postgres-store/accounts.ts` is untouched by #41, which is the evidence the cut
landed in the right place.

### Store layout after #30, PR 2 and PR 3

```
src/db/data-store.ts       DataStore + the four repository interfaces + AccountOwner
src/db/base-store.ts       BaseStore — every DataStore method, written once
src/db/user-identity.ts    findUserByIdentity — shared by memory and json (#33)
src/db/account-users.ts    findAccountUser, ownerAccountUser, byAccountName, accountsForUser

src/db/memory-store/       index.ts  accounts.ts  transactions.ts  users.ts  account-users.ts
src/db/json-file-store/    index.ts  accounts.ts  transactions.ts  users.ts  account-users.ts  file-session.ts
src/db/postgres-store/     index.ts  accounts.ts  transactions.ts  users.ts  account-users.ts  query.ts
```

Each entity file is one class implementing its repository interface. Each
`index.ts` only constructs those classes and hands them to `super(...)` —
`BaseStore` holds the delegation, so a new `DataStore` method is written once
rather than three times.

The dependency each class takes differs by store: `PostgresAccounts` takes `sql`
(from `query.ts`), `MemoryAccounts` owns its own array, `JsonAccounts` takes a
`FileSession` — and **all json repositories must share one `FileSession`**, or
concurrent writes to the single file lose data.
`json-file-store/__tests__/file-session.test.ts` guards that, and its
account-plus-owner case fails if `JsonAccountUsers` is handed its own session.

**Two repositories reach a second entity**, because one operation spans two
tables: `MemoryAccountUsers` takes the `AccountRepository`, and
`PostgresAccountUsers` takes the concrete `PostgresAccounts` — not the
interface, because it needs `insertQuery()`, an *unexecuted* statement, which is
a notion only SQL has. `JsonAccountUsers` needs nothing extra; the shared
session already reaches every array.

Tests mirror the source, one test file per module, under each folder's `__tests__/`.

### Database state

| Branch                           | `users` / `account_users` | `role` CHECK |
| -------------------------------- | ------------------------- | ------------ |
| Neon **dev**                     | created                   | yes          |
| Neon **test**                    | created                   | yes          |
| Neon **production** (default)    | created                   | yes          |

The default branch is named **`production`**, not `main`. It was migrated on
2026-09-14 for plan PR 4, the first code that needs those tables. Unlike dev
and test it took the `role` CHECK straight from `CREATE TABLE`, so no one-off
`ALTER` was needed. Confirm `DATABASE_URL` points at `production`
(endpoint `ep-jolly-truth-a21toeir`) before running `npm run db:migrate`.

Dev and test got the CHECK via a one-off `ALTER TABLE ... ADD CONSTRAINT`,
because `CREATE TABLE IF NOT EXISTS` cannot add a constraint to a table that
already exists. A fresh database gets it from `CREATE TABLE`. That constraint
could equally be carried in `schema.sql` as an idempotent `ALTER`, the way the
`account_users` rename now is.

### Conventions PR 2 added

- **`BaseStore` owns delegation.** A new `DataStore` method is one method in
  `src/db/base-store.ts` plus one method per repository class. Do not add
  delegating methods to a store's `index.ts`.
- **A test needing a live database is named `*.e2e.ts`**, the same suffix as
  the browser suites in `e2e/`, beside `*.visual.ts`: `accounts.e2e.ts`,
  `transactions.e2e.ts`, `users.e2e.ts`. `npm test` only matches `*.test.ts` and
  never loads them; `npm run test:db` selects them by the same name, scoped to
  `src/**/__tests__/` so the browser suites in `e2e/` stay out of it. This replaced a per-file `TEST_DATABASE_URL`
  guard that skipped the suite at runtime. `jest.config.ts` needs no entry.
- **`live-store.ts` reads `TEST_DATABASE_URL` itself and throws** when it is
  missing, so `test:db` without a database fails loudly rather than reporting
  green with everything skipped. `withLiveStore()` takes no argument and hands
  back `accountId` / `txId` / `userId` prefix helpers.
- **`test:e2e` runs `test:db` first**, so a broken query fails in seconds
  instead of after a full `next build`.

The old `git stash` entry named `PR2 user store methods` is obsolete — PR 2 was
written fresh against the split folders. Drop it.

### Conventions PR 3 added

- **One comparator orders accounts, in JavaScript, for every store.**
  `byAccountName` in `src/db/account-users.ts` is the only thing that sorts
  accounts; `listAccountsForUser` does **not** order in SQL. Postgres orders by
  its own collation, which on Neon is code point, while JS `localeCompare` is
  ICU: `Noa` and `eitan` come back as `Noa, eitan` from a live database and
  `eitan, Noa` from the json store dev runs on. Sorting in the app is what makes
  the three stores agree. The comparator is **total** — it falls back to the
  account id — so equal names cannot reorder between two identical calls.
  Ordering tests must use fixtures that would actually diverge; the Hebrew
  fixtures could not, since מ precedes נ under both collations.
- **A schema change that is not additive goes in `schema.sql` as an idempotent
  `ALTER`.** `run-migration.ts` splits the file and runs every statement inside
  one `sql.transaction`, so `ALTER TABLE IF EXISTS ... RENAME TO` replays
  forever and no-ops once the old name is gone. Do not leave a rename as a
  manual step recorded in a PR description — a database still holding the old
  name would silently gain a second, empty table from `CREATE TABLE IF NOT
  EXISTS` and report success.
- **Parameters of the same type do not sit next to each other on a write.**
  `insertAccountWithOwner(account, ownerId, addedAt)` let a transposition
  compile and write a timestamp into the user column; it takes
  `AccountOwner { userId, addedAt }` instead. Read methods keep positional
  arguments, matching `listTransactionsByWallet(accountId, walletId)`.
- **Type-aware lint is on for `src/` only.** `@typescript-eslint/no-floating-promises`
  guards `PostgresAccounts.insertQuery`, which returns an unexecuted
  `NeonQueryPromise`: a bare `accounts.insertQuery(account)` is a silent no-op —
  no INSERT, no error, no unhandled rejection. CLAUDE.md forbids the explanatory
  comment that would otherwise warn about it, so the rule does the job instead.
  It is scoped to `src/`, because `e2e/` uses `node:test`, whose `describe`/`it`
  are floating promises by design.
- **A test is not finished until a mutation proves it can fail.** Both rollback
  claims in PR 3 were written wrong the first time and passed anyway — see
  _What PR 3's tests do and do not prove_ below.

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
so a person owns what they created, and model ownership as an account_users join table
so sharing and per-child logins are later a row insert, not a re-architecture.

## Current state — verified 2026-09-12

Everything below was measured, not assumed. Re-check before relying on it.

**Repo / deploy**

- `origin` = `git@github.com:ShiraSpace/fun-saver.git`, default branch `main`.
- Production is live on Vercel (team `shiraspaces-projects`), deployed from
  `main` through the GitHub integration. It is **public and ungated**.
  **`https://fun-saver.vercel.app`** — the stable alias, and the only origin
  worth registering with an OAuth provider. The per-deployment URLs
  (`fun-saver-<hash>-shiraspaces-projects.vercel.app`) rotate every deploy, and
  both they and the branch alias `fun-saver-git-main-shiraspaces-projects.vercel.app`
  sit behind Vercel deployment protection — they redirect to `vercel.com/sso-api`,
  so an OAuth round-trip can never complete through them. Preview deployments
  cannot sign in, by the same rule.
- **Every merged PR ships to public production.** This is the constraint the
  PR ordering below is built around. Production holds **4 accounts and 216
  transactions**, and an anonymous request renders them — so PR 6 is the real
  urgency, not a formality, and PR 8 has four accounts to assign rather than
  none. `users` and `account_users` are empty.
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
- **`account_users` join table**, name and shape carried over from the neon
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

export type AccountUserRole = 'owner' | 'editor' | 'viewer';

export interface AccountUser {
  accountId: string;
  userId: string;
  role: AccountUserRole;
  addedAt: string;
}
```

```
User u1  Eli                       Account a1  נועה  ── wallets(JSONB) → transactions
User u2  Dana   (later)            Account a2  איתי  ── wallets(JSONB) → transactions
User u3  נועה   (later, own login)

account_users
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

CREATE TABLE IF NOT EXISTS account_users (
  account_id TEXT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  user_id    TEXT NOT NULL REFERENCES users(id)    ON DELETE CASCADE,
  role       TEXT NOT NULL,
  added_at   TEXT NOT NULL,
  PRIMARY KEY (account_id, user_id)
);

CREATE INDEX IF NOT EXISTS account_users_user_idx ON account_users(user_id);
```

Run `db:migrate`, `db:migrate-dev`, `db:migrate-test`.

> **Corrected 2026-09-13.** This plan previously claimed the runner "has no
> mechanism to ALTER an existing table idempotently". That was wrong.
> `run-migration.ts` splits `schema.sql` and runs every statement inside one
> `sql.transaction`, so `ALTER TABLE IF EXISTS ... RENAME TO` and
> `ALTER INDEX IF EXISTS ... RENAME TO` replay safely forever — they no-op once
> the old name is gone. The `account_users` rename is carried in `schema.sql`
> itself for exactly this reason, rather than being a manual step recorded in a
> PR description. A column *type* change would still want a versioned
> migrations table; a rename does not.

## Authentication is open by design — and what that costs

Plan PR 4 (#53) ships **no allowlist**: any Google account completes sign-in and
gets a `users` row. That is safe only because such a user has no `account_users`
rows, so once PR 9 deletes `listAccounts()` they see an empty app.

**It therefore constrains the merge order: PR 9's read path lands before or with
PR 6.** A PR 6 that gates on "has a session" while `page.tsx` still calls
`listAccounts()` hands every signed-in stranger all four real accounts. If PR 6
must ship first, it carries the allowlist itself — `AUTH_ALLOWED_EMAILS` checked
in `signIn`, alongside `profile.email_verified` because it keys on email.

`signIn` is kept free of database work on purpose: `@auth/core` wraps any
non-`AuthError` thrown there in `AccessDenied`, so a database outage would look
identical to a refusal. Provisioning lives in `jwt`.

**A stored user is never reconciled with the Google profile.** A changed name or
email stays as first seen. `UserRepository` has no `update`; adding one across
the three stores is its own PR.

## Authorization seam — the one file that tightens later

`src/lib/account-access.ts` (PR 9), framework-agnostic, unit-tested, the only
place that decides who may do what:

```ts
listAccountsForUser(store, userId): Promise<Account[]>   // replaces listAccounts()
requireAccountUser(store, userId, accountId): Promise<AccountUser>  // else Forbidden
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

- Append `users` and `account_users` to `schema.sql`; run all three migrate
  scripts.
- `src/lib/types.ts` — add `User`, `AccountUserRole`, `AccountUser`.
  `Account` unchanged.
- `src/db/row-mappers.ts` — `UserRow`/`toUser`, `AccountUserRow`/`toAccountUser`.

Tests: row-mapper unit tests alongside the existing ones.

Depends on: nothing. Ships: two unread tables; zero behaviour change.

### PR 2 — `feat/user-store-methods` — MERGED (#32)

Shipped as described, plus three things the section did not anticipate. It also
gained a duplicate-identity guard on the branch: `DuplicateUserError` is thrown
by all three stores, postgres via `ON CONFLICT ... DO NOTHING RETURNING id`
rather than sniffing an error code.

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

**`*.e2e.ts`** — the live postgres suites were renamed and their per-file skip
guards deleted. Same section.

Tests: `users.test.ts` under `memory-store` and `json-file-store`, `users.e2e.ts`
under `postgres-store`. Each covers what is distinctive about its store — the
lookup, surviving a reopen of the file, live SQL — and both unit suites insert a
user before the unknown-id case so it proves the lookup discriminates rather
than passing on an empty store. `file.test.ts` gained the case that guards
`emptyData`: a file written before users existed reads back as no user. No test
for `BaseStore` — pure delegation, no branching, and `implements DataStore`
catches a missing method at compile time.

Depends on: PR 1 (merged) and #30. Ships: unused interface methods.

### PR 3 — shipped as two, both merged: #41 reads, #49 writes

#41 merged as `ca1a505`, #49 as `41319f8`. See _Two PRs that are not what their
status says_ above for why the second is numbered 49 and not 47.

**#41 — `feat/account-user-reads`**

- The rename: `AccountMember`→`AccountUser`, `MembershipRole`→`AccountUserRole`,
  `account_members`→`account_users`, table, index, mockups, docs. Carried in
  `schema.sql` as idempotent `ALTER`s, so it replays rather than depending on the
  two databases that were fixed by hand.
- `AccountUserRepository` with `get` and `listAccountsForUser`; `DataStore` gains
  `getAccountUser` and `listAccountsForUser`; both delegated once in
  `base-store.ts`. `listAccounts` **stays** — nothing breaks mid-stack.
- `StoreData` gains `accountUsers: AccountUser[]`; `emptyData()` — in
  `json-file-store/file-session.ts` — gains `accountUsers: []`.
- `postgres-store/account-users.ts` — JOIN on `account_users(user_id)`, **no**
  `ORDER BY`; rows go through `byAccountName` like every other store.

**#49 — `feat/account-user-writes`**

- `insertAccountWithOwner(account, owner)` on the repository, `DataStore` and
  `BaseStore`. It spans two tables, so one repository owns the whole operation
  rather than two calls a caller could half-complete.
- postgres: both inserts through `sql.transaction`, account first so the foreign
  key resolves inside it, using `PostgresAccounts.insertQuery` so the accounts
  INSERT exists once. json: both rows inside one `session.write` before one
  `save()`. memory: writes the account through the accounts repository.
- `ownerAccountUser` is the only place `'owner'` is written.

### What PR 3's tests do and do not prove

Each claim below was mutation-checked — the implementation was broken
deliberately and the suite re-run. **Two tests passed against a broken
implementation on the first attempt** and had to be rewritten:

| claim | mutation | result |
| ----- | -------- | ------ |
| postgres writes both rows **or neither** | `sql.transaction` → two sequential `await`s | **caught** |
| the three stores order accounts identically | restore `ORDER BY accounts.name` | **caught** |
| `JsonAccountUsers` shares one `FileSession` | give it its own session | **caught** |
| json writes both rows in **one** `save()` | split into two `session.write` calls | **not caught** |

- The rollback test first failed the *accounts* insert. That is the first
  statement, so it throws before the second runs and two sequential inserts pass
  too. It now fails the *second* statement, via a foreign key to a user that was
  never inserted.
- The ordering test first used נועה and מתן, which agree under every collation.
  It now uses `Noa` and `eitan`.
- **The json single-`save()` property is not covered.** It holds structurally —
  two synchronous pushes, no `await` between them, one `save()` — but catching a
  split needs a failed disk write, and a read-only directory fails the first
  write too, so it does not discriminate either. Postgres covers the analogous
  risk where it is real, across two network round trips.

Depends on: PR 1, PR 2. Ships: unused interface methods.

### Known divergences to settle before PR 9

Raised in #47's review, and carried into #49. Neither blocks that PR; both are decisions PR 9 has to
make rather than defects in the store layer.

- **A repeat `insertAccountWithOwner` diverges by store.** Postgres rejects it —
  `accounts.id` is a primary key and `account_users` is PK `(account_id,
  user_id)`. The memory and json stores push unconditionally, so calling it twice
  with the same account leaves two entries in `data.accounts`, and because
  `accountsForUser` filters by an id `Set`, **both survive and
  `listAccountsForUser` returns the same account twice** — a duplicated card
  rather than an error. The realistic route is a caller retrying after a timeout
  on a write that actually committed.

  The root cause is `AccountRepository.insert`, not `insertAccountWithOwner`, so
  the fix is a `DuplicateAccountError` in the memory and json `insert` methods —
  the same shape as PR 2's `DuplicateUserError` — and it belongs in its own PR
  rather than widening #47. **PR 9 has to decide whether account creation is
  retryable**; if it is, that PR is a prerequisite.

- **An owner who does not exist is accepted by memory and json, rejected by
  postgres.** `account_users.user_id REFERENCES users(id)`, so postgres throws
  and rolls back — the live rollback test relies on exactly that. The memory and
  json stores push the row unconditionally, so the same call succeeds and leaves
  an account whose only member row points at a user that does not exist. That
  account is then unreachable: no `listAccountsForUser` will ever return it.

  This matters for PR 9's signup flow, which inserts the user and then calls
  `insertAccountWithOwner`. If the user insert did not land, dev on the json
  store passes and production on postgres throws — a failure that only appears
  after deploy. Same decision as the repeat-insert divergence above, and it wants
  deciding at the same time.

- **`insertAccountWithOwner` assumes one accounts repository instance.** It
  routes an account write through the account-users repository, which holds its
  own `AccountRepository`. Nothing in the types requires it to be the same object
  `BaseStore` reads through: `new BaseStore(accountsA, tx, users, new
  MemoryAccountUsers(accountsB))` compiles, and then the account is written to
  one and read from the other — a silent disappearing write. Before this PR a
  mismatch only degraded `listAccountsForUser`.

  **For postgres this is now unrepresentable**: `PostgresAccountUsers` takes only
  `sql` and builds its own `PostgresAccounts` from it, so the statement it batches
  and the transaction it batches into cannot belong to different connections. The
  repository is stateless, so the second instance costs nothing.

  **The memory store still carries the assumption**, and cannot shed it the same
  way: `MemoryAccounts` owns an actual array, so `MemoryAccountUsers` needs *that
  instance*, not an equivalent one. It stays unenforced deliberately — the
  alternative is `BaseStore` orchestrating the two writes itself, which gives up
  the atomicity the whole operation exists for. **A new store must not get this
  wrong.**


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

**Import `signIn` from `next-auth/react`, not from `@/auth`.** `src/auth.ts`
exports a server-side `signIn` for server actions; a `"use client"` button needs
the react one. Both exist and only one works in a client component.

Depends on: PR 4 — `next-auth` reached `main` with `5d02045`, so this branches
off `main` normally. Ships: a new route.

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
LEFT JOIN account_users m ON m.account_id = a.id
WHERE m.account_id IS NULL;   -- must be 0
```

Running this before anything enforces is free: nothing reads `account_users`
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
viewer throws, `requireAccountUser` throws for a non-member of the account. Route test:
unauthenticated `POST /api/accounts` → 401.

Depends on: PR 3, PR 8. Ships: users see only their own accounts.

### PR 10 — `feat/guard-transaction-routes`

- `src/app/api/accounts/[id]/{deposits,withdrawals,theme}/route.ts` —
  `requireAccountUser` + `assertCanEdit` before the existing `getAccount`.

Tests: per route — unauthenticated → 401, non-member of the account `accountId` → 403.

Depends on: PR 9. Ships: writes are authorized.

---

## Architecture touch points

| Layer                                                             | Change                                                                    | PR      |
| ----------------------------------------------------------------- | ------------------------------------------------------------------------- | ------- |
| `src/db/schema.sql`                                               | append `users`, `account_users`                                         | 1       |
| `src/lib/types.ts`                                                | add `User`, `AccountUserRole`, `AccountUser`                             | 1       |
| `src/db/row-mappers.ts`                                           | add `UserRow`/`toUser`, `AccountUserRow`/`toAccountUser`              | 1       |
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
| `src/app/api/accounts/[id]/{deposits,withdrawals,theme}/route.ts` | `requireAccountUser` + `assertCanEdit`                                     | 10      |

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
| No audit trail                                                                                                                              | `account_users.added_at` is the start; add `added_by` when sharing ships.                                        |

## Out of scope

Sharing UI and invites; child PIN/password; issuing `editor`/`viewer`; account
deletion; ownership transfer; deleting `JsonFileStore`; versioned migrations;
migrating `data.json` into Neon.

## Starting this in a fresh session

1. **Read the Progress section at the top of this file first.** It records what
   has merged, the store layout PR 2 and PR 3 now land in, and which database
   branches are migrated.
2. **Fetch, then branch off updated `origin/main`** — or off the parent branch
   when the work depends on a PR that has not merged, rebasing once it lands.
   Never force-push a branch that is already published; correct it with a commit
   on top. Drop the stale `PR2 user store methods` stash — see Progress.
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
6. **Verify what you commit, not what you have.** Two defects this plan's own
   work shipped came from checking the working tree instead of `HEAD`: a commit
   that moved a file but left every importer pointing at the old path (one bad
   pathspec aborted the whole `git add`), and a test that was never run against
   a broken implementation. Confirm the tree is clean before quoting a result,
   and break the code on purpose to see the test fail.
7. **`rtk` output is not trustworthy for facts.** It has reported `git status
   --short` as `ok` on a dirty tree, a jest count of 364 where the real number
   was 368, and swallowed an `eslint --fix`. Use `rtk proxy <cmd>` for anything
   you intend to report as a number, and capture to a file rather than piping.
8. **Confirm work landed by content, not by commit ancestry.** This repo
   squash-merges, so `git log origin/main..origin/<branch>` always shows commits
   for a merged branch. Use `git diff origin/main origin/<branch> --stat` or
   `git grep` for a symbol the PR added. A PR page saying "merged" is not proof
   either — see #47.
9. **Start with PR 4** — the Google Cloud step below has to happen first, and it
   is manual. Nothing in this plan is open; PR 4 branches off `main`.

### Still undecided

- Whether the json store's single-`save()` atomicity is worth an `fs`-mocking
  test, or whether reading the code is enough. Postgres covers the same risk
  where it is real.
- Whether to delete the pre-existing Neon **dev** account (1 account, 8
  transactions, from the Postgres work) before PR 8. If kept, the backfill
  adopts it as yours.
- When "go-live" is — the moment production gets real data, PR 10 must already
  have merged.
- Whether `data.json` and `JsonFileStore` retire once Neon is the real store.
  Out of scope here, but it is the cleanup that would collapse three store
  implementations into two.
