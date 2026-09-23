# Google Login + Account Users — 10 PRs

> Written against `main` **after** the Neon/Postgres merge (`66f9c68`, PR #15).
> Supersedes the deferred Tasks 4–6 of `.plans/2026-07-25-neon-integration.md`.
> Restructured 2026-09-12 from four phases into ten independently shippable
> pull requests. The JSON→Neon import PR was dropped: there is no real data
> worth migrating, and it was new code serving a one-time need.

## Progress — updated 2026-09-23 (PR 7 open as #100; then 12, 13 and 14)

Plan PR numbers below are **not** GitHub PR numbers. Mapping so far:

| Plan  | GitHub                                                   | Branch                             | Status                                                  |
| ----- | -------------------------------------------------------- | ---------------------------------- | ------------------------------------------------------- |
| PR 1  | [#28](https://github.com/ShiraSpace/fun-saver/pull/28)   | `feat/members-schema`              | **merged**                                              |
| —     | [#29](https://github.com/ShiraSpace/fun-saver/pull/29)   | test-utils rename                  | **merged** (not in this plan)                           |
| —     | [#30](https://github.com/ShiraSpace/fun-saver/pull/30)   | `feat/split-stores-by-entity`      | **merged** (not in this plan)                           |
| PR 2  | [#32](https://github.com/ShiraSpace/fun-saver/pull/32)   | `feat/user-store-methods`          | **merged**                                              |
| —     | [#33](https://github.com/ShiraSpace/fun-saver/pull/33)   | `refactor/user-identity-predicate` | **merged** (not in this plan)                           |
| PR 3a | [#41](https://github.com/ShiraSpace/fun-saver/pull/41)   | `feat/account-user-reads`          | **merged** — `ca1a505`                                  |
| PR 3b | [#49](https://github.com/ShiraSpace/fun-saver/pull/49)   | `feat/account-user-writes`         | **merged** — `41319f8`                                  |
| PR 4  | [#53](https://github.com/ShiraSpace/fun-saver/pull/53)   | `feat/google-auth`                 | **merged** — `5d02045`                                  |
| PR 5  | [#55](https://github.com/ShiraSpace/fun-saver/pull/55)   | `feat/login-page`                  | **merged**                                              |
| PR 8  | [#61](https://github.com/ShiraSpace/fun-saver/pull/61)   | `feat/assign-owner`                | **merged** — `b93e218`                                  |
| PR 8b | [#74](https://github.com/ShiraSpace/fun-saver/pull/74)   | `chore/e2e-signed-in-driver`       | **merged** — test infrastructure, no production diff    |
| PR 9  | [#81](https://github.com/ShiraSpace/fun-saver/pull/81)   | `feat/scope-accounts-to-user`      | **merged** — `f947725`                                  |
| PR 6  | [#86](https://github.com/ShiraSpace/fun-saver/pull/86)   | `feat/auth-proxy`                  | **merged** — `7312359`, plus `63cc6cc` straight to main |
| PR 10 | [#87](https://github.com/ShiraSpace/fun-saver/pull/87)   | `feat/guard-transaction-routes`    | **merged** — `f1a283d`                                  |
| PR 11 | [#94](https://github.com/ShiraSpace/fun-saver/pull/94)   | `refactor/themed-page-shell`       | **merged** — `c36afa1`                                  |
| PR 7  | [#100](https://github.com/ShiraSpace/fun-saver/pull/100) | `feat/profile-section`             | **open** — reviewed, fixes pushed                       |
| PR 12 | —                                                        | `fix/empty-state-sign-out`         | not started — found during PR 7                         |
| PR 13 | —                                                        | `refactor/required-context`        | not started — found during PR 7                         |
| PR 14 | —                                                        | `fix/menu-state-on-close`          | not started — found reviewing PR 7                      |

### PR 7 is open as #100, and review turned up more than it fixed

PR 9 closed the public hole: `DataStore.listAccounts()` is gone and both pages
read through `listAccountsForUser` with the id from the session. A stranger who
signs in now has no `account_users` rows and therefore an empty app, which is
what makes **PR 6 safe to write as a plain session gate** — the allowlist it
would otherwise have had to carry is no longer needed.

PR 6 merged as #86 (`7312359`) and the app now goes private at the edge as well
as at the page. **One correction landed after it, `63cc6cc`, pushed straight to
main** — see the matcher paragraph below. **The gate is `src/proxy.ts`, not `src/middleware.ts` —
Next 16 renamed the convention**, and the PR 6 section below records the rest of
what changed against what this plan assumed.

**PR 10 closed the last cross-user path.** The four `[id]` mutation routes ran
with no authorization at all until now — `/api` is deliberately outside the
proxy's matcher, so PR 6 did not narrow that hole by a line. All four now pass
through one wrapper that answers 401 without a session and 403 without an editing
membership. PR 7 is independent and can land at any time.

**PR 7 turned up three follow-ups**, all recorded below: a signed-in stranger
has no way to sign out (PR 12), four contexts hand-roll the same
required-context boilerplate (PR 13), and menu state survives the menu closing
(PR 14). None blocks PR 7.

**Review of #100 found a hole this plan did not anticipate: the closed menu was
still reachable by keyboard.** The panel is always mounted and hidden with
`opacity` and `pointer-events`, which stops the mouse and not the keyboard — so
every control in it sat in the tab order of both pages. That was harmless while
the menu held only a picker and an edit button. PR 7 put **sign out** behind it,
which is what turned a latent oddity into a way to end the session by pressing
Enter at nothing. Fixed with `inert` on the panel. Worth remembering the shape:
a pre-existing structure became a defect because of what was added to it.

**PR 11 merged as #94 (`c36afa1`).** One `ThemedPage` in `src/theme/` holds the
shell the three pages were each writing out. It also corrected this plan: the
section below claimed no new test was needed because the browser suites already
assert the themed render. They do not — see there.

### PR 8's backfill ran on both targets, and PR 9 deleted it

The manual step that blocked it — signing in on production — happened on
2026-09-15, and both backfills ran the same evening. Measured after, and
unchanged since:

| branch       | `users` | `accounts` | `account_users` | orphan accounts | transactions |
| ------------ | ------- | ---------- | --------------- | --------------- | ------------ |
| `production` | 1       | 4          | **4**           | **0**           | 266          |
| `dev`        | 1       | 3          | **3**           | **0**           | 293          |

Re-measured 2026-09-23 during PR 11. Production's transactions moved 263 → 266:
**that is real use**, PR 10 having been the last thing blocking go-live. Dev's
221 → 293 is other worktrees. Orphans are still 0 on both, which is the
invariant PR 9 depends on.

All four production accounts — אמא, יעל, רוני, שירי — carry an `owner` row for
the one user, written in a single transaction. The plan's verification query
returns 0 on both, which is the condition PR 9 depends on.

**The backfill is deleted — PR 9 removed it.** Its last dev run reported
`0 account(s) assigned`.

**An orphan really did appear mid-PR, which is why the re-check mattered.** Dev
was measured at 3 accounts / 0 orphans, and an hour later carried a fourth,
`פווו`, with no member row — created through a worktree still running the old
unowned `insertAccount` path. It had no transactions and was deleted rather than
adopted. Production stayed at 4 / 4 / 0 throughout.

**The window is now closed by construction**, not by a script: `POST
/api/accounts` refuses an unauthenticated caller and writes the account and its
owner in one transaction, so an account with no member row can no longer be
created. Nothing is left that could adopt one if it were.

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
  changed. Verify by content, per _How to confirm work actually landed_ above —
  not with `git log origin/main..origin/<branch>`, which this repo's squash
  merges make useless.

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
interface, because it needs `insertQuery()`, an _unexecuted_ statement, which is
a notion only SQL has. `JsonAccountUsers` needs nothing extra; the shared
session already reaches every array.

Tests mirror the source, one test file per module, under each folder's `__tests__/`.

### Database state

| Branch                        | `users` / `account_users` | `role` CHECK |
| ----------------------------- | ------------------------- | ------------ |
| Neon **dev**                  | created                   | yes          |
| Neon **test**                 | created                   | yes          |
| Neon **production** (default) | created                   | yes          |

The default branch is named **`production`**, not `main`. It was migrated on
2026-09-14 for plan PR 4, the first code that needs those tables. Unlike dev and
test it took the `role` CHECK straight from `CREATE TABLE`, so no one-off
`ALTER` was needed. Confirm `DATABASE_URL` points at `production` (endpoint
`ep-jolly-truth-a21toeir`) before running `npm run db:migrate`.

**Dev and test are Neon branches with a TTL.** Measured 2026-09-15: `dev`
(`br-shiny-dawn-a29qxouu`) expires **2026-09-19**, `test`
(`br-damp-silence-a229bobw`) expires **2026-09-27**. `npm run test:db` runs
against `test` and `db:migrate-dev` against `dev`, so both start failing with a
connection error rather than an obvious expiry message once those dates pass.
Recreate the branch from `production` and re-run the migration.

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
- ~~**e2e uses `FUNSAVER_SKIP_AUTH=true`**~~ — overtaken by PR 8b, which gave
  every browser suite a real signed session cookie. PR 6 should try middleware
  with no bypass at all.
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
> PR description. A column _type_ change would still want a versioned
> migrations table; a rename does not.

## Authentication is open by design — and what that costs

Plan PR 4 (#53) ships **no allowlist**: any Google account completes sign-in and
gets a `users` row. That is safe only because such a user has no `account_users`
rows, so — since PR 9 deleted `listAccounts()` — they see an empty app.

**It constrained the merge order: PR 9's read path had to land before or with
PR 6, and it did.** A PR 6 that gates on "has a session" while `page.tsx` still calls
`listAccounts()` hands every signed-in stranger all four real accounts. If PR 6
must ship first, it carries the allowlist itself — `AUTH_ALLOWED_EMAILS` checked
in `signIn`, alongside `profile.email_verified` because it keys on email.

`signIn` is kept free of database work on purpose: `@auth/core` wraps any
non-`AuthError` thrown there in `AccessDenied`, so a database outage would look
identical to a refusal. Provisioning lives in `jwt`.

**A stored user is never reconciled with the Google profile.** A changed name or
email stays as first seen. `UserRepository` has no `update`; adding one across
the three stores is its own PR.

## Authorization seam — where the decisions live

**This section predicted `src/lib/account-access.ts`. PR 9 did not build it**,
and the reason is worth keeping: of the four functions it listed, the only one
PR 9 needed was `listAccountsForUser(store, userId)`, a one-line delegation to
the `DataStore` method of the same name. The other three had no caller until
PR 10. A file of functions nobody calls is not a seam.

What makes the read path safe is the interface, not a wrapper:
`DataStore.listAccounts()` is **deleted**, not kept-and-guarded, so
`listAccountsForUser(userId)` is the only way to read accounts at all and no
future caller can leak someone else's child by accident.

`src/app/signed-in-accounts.ts` (PR 9) is where the session meets the store —
session id, the selected-account cookie, the scoped list and the resolved theme,
shared by `page.tsx` and `method/page.tsx`. It sits under `src/app` rather than
`src/lib` because it reaches for `next/headers`.

**PR 10 created `src/lib/account-access.ts`**, and not in the shape this section
predicted. It holds the rule as one predicate rather than two functions:

```ts
canEditAccount(store, userId, accountId): Promise<boolean>   // owner | editor
```

`requireAccountUser` throwing plus `assertCanEdit` would have put a `try`/`catch`
in all four routes and given `assertCanEdit` exactly one caller. The split can
come back when `assertCanShare` joins it, which waits for sharing to exist.

**The HTTP half is `src/app/api/accounts/[id]/with-account-editor.ts`.** Session
and status codes live there rather than in `src/lib`, for the reason
`signed-in-accounts.ts` sits under `src/app`. It wraps a route handler: no
session → 401, no editing membership → 403, otherwise the handler runs with the
resolved account id. **Wrapping rather than calling is what makes it one place** —
a route cannot reach its own body without passing the guard, where a guard the
route calls is a guard the next route can forget.

`canEditAccount` takes `AccountUserReader = Pick<DataStore, 'getAccountUser'>`,
the single method it uses, so the role rule can be tested against a stub reader.
Nothing in the app writes a non-owner row yet — `insertAccountWithOwner` is the
only membership write there is — so `viewer` is unreachable through the store's
own API.

---

# The PRs

Each PR branches off updated `origin/main`; a PR that depends on an unmerged
one branches off its parent and rebases when the parent lands. Every PR is
green and deployable on its own — merging it ships it.

**Critical path to closing the public hole: 1 → 2 → 3 → 4 → 5 → 8 → 9 → 6.**
PR 6 is last, not fifth: gating on a session while `page.tsx` still calls
`listAccounts()` would show every signed-in stranger all four real accounts. PR
7 is independent of the chain and can land at any time after PR 4.

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

| claim                                       | mutation                                    | result         |
| ------------------------------------------- | ------------------------------------------- | -------------- |
| postgres writes both rows **or neither**    | `sql.transaction` → two sequential `await`s | **caught**     |
| the three stores order accounts identically | restore `ORDER BY accounts.name`            | **caught**     |
| `JsonAccountUsers` shares one `FileSession` | give it its own session                     | **caught**     |
| json writes both rows in **one** `save()`   | split into two `session.write` calls        | **not caught** |

- The rollback test first failed the _accounts_ insert. That is the first
  statement, so it throws before the second runs and two sequential inserts pass
  too. It now fails the _second_ statement, via a foreign key to a user that was
  never inserted.
- The ordering test first used נועה and מתן, which agree under every collation.
  It now uses `Noa` and `eitan`.
- **The json single-`save()` property is not covered.** It holds structurally —
  two synchronous pushes, no `await` between them, one `save()` — but catching a
  split needs a failed disk write, and a read-only directory fails the first
  write too, so it does not discriminate either. Postgres covers the analogous
  risk where it is real, across two network round trips.

Depends on: PR 1, PR 2. Ships: unused interface methods.

### Store divergences — the first two are settled, the third stands

Raised in #47's review and carried into #49. **#67 (`1cbb01c`) closed both of the
first two**, so PR 9 never had the decision this section once assigned it. All
three stores now reject a repeat account and an unknown owner _before_ either
write, postgres translating `23505` and `23503` into the same
`DuplicateAccountError` and `UnknownOwnerError` the other two raise, and all
three check the duplicate before the owner, so a create that is both fails
identically everywhere. The two entries below are kept as the record of what was
wrong and why it was fixed there rather than here.

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
  rather than widening #47. **Done in #67**, in exactly that shape.

- **An owner who does not exist is accepted by memory and json, rejected by
  postgres.** `account_users.user_id REFERENCES users(id)`, so postgres throws
  and rolls back — the live rollback test relies on exactly that. The memory and
  json stores push the row unconditionally, so the same call succeeds and leaves
  an account whose only member row points at a user that does not exist. That
  account is then unreachable: no `listAccountsForUser` will ever return it.

  This mattered for PR 9's create path, which inserts the user and then calls
  `insertAccountWithOwner`: if the user insert did not land, dev on the json
  store would pass and production on postgres throw — a failure that only appears
  after deploy. **Done in #67**, at the same time as the repeat-insert case.
  PR 9's `createOwnedAccount` test helper relies on it: seeding the owner first
  is not optional, and forgetting it raises `UnknownOwnerError` on every store
  rather than only on postgres.

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
  way: `MemoryAccounts` owns an actual array, so `MemoryAccountUsers` needs _that
  instance_, not an equivalent one. It stays unenforced deliberately — the
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

### PR 5 — `feat/login-page` — MERGED (#55)

- `src/app/login/page.tsx` + `src/components/SignIn/` — one Google button, RTL,
  themed, per `mockups/login.html`. Sign-in and sign-up are the same button.

Reachable by URL; nothing redirects to it yet — PR 6 is what does that.

Tests: `SignIn` component test — renders the button, calls `signIn('google')`.

**Import `signIn` from `next-auth/react`, not from `@/auth`.** `src/auth.ts`
exports a server-side `signIn` for server actions; a `"use client"` button needs
the react one. Both exist and only one works in a client component.

Depends on: PR 4 — `next-auth` reached `main` with `5d02045`, so this branches
off `main` normally. Ships: a new route.

### PR 6 — `feat/auth-proxy` — MERGED (#86, `7312359`)

**Next 16 renamed the file convention.** It is `src/proxy.ts` exporting `proxy`,
not `src/middleware.ts` exporting `middleware` — deprecated and renamed in
v16.0.0, see `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md`.
Behaviour, `config.matcher` and the redirect API are unchanged; the runtime now
defaults to Node.js and setting `runtime` throws. The branch was named for the
file, not for the plan.

**The page-level redirect stays, as defence in depth — decided, not forgotten.**
The proxy runs on every request including prefetches, so it makes the optimistic
check Next's own auth guide prescribes: is a session cookie present. It does not
verify the signature and imports no `next-auth`. `signedInAccounts()` keeps its
own `redirect()`, which is what actually verifies the session and is the only
source of a `userId` for the pages — removing it would hand
`listAccountsForUser(undefined)` to the store. A forged cookie therefore passes
the proxy and is caught one layer down.

**Both cookie names are read.** Auth.js prefixes the cookie `__Secure-` on
https. Production is https; dev and every e2e suite are http. A check keyed on
one name passes all 81 e2e checks and then redirects every signed-in user on
`fun-saver.vercel.app` to `/login` for ever. `SESSION_COOKIE_NAMES` in
`src/lib/constants.ts` carries both, and the unit tests pin the two literals
rather than looping over the constant.

**`FUNSAVER_SKIP_AUTH` was never needed, and does not exist.** The plan's hunch
was right: PR 8b gives every suite a real signed cookie, and `test:e2e` was
identical to baseline with no bypass at all. The _Shipping loose on purpose_ row
is closed.

**`/api` is left out of the matcher.** A redirect answers a `fetch()` with an
HTML login page; `POST /api/accounts` already returns 401, and the `[id]` routes
need per-user authorization, which is PR 10 — gating them here would look like
PR 10 was done.

**The matcher is the security boundary, so it is tested.** Its alternatives are
anchored to whole path segments — an unanchored `login|api` left `/loginx` and
`/apikeys` public, which is the very failure this PR exists to close. The
framework namespace is excluded as `_next(?:/|$)`, one alternative rather than a
list: the first attempt wrote `_next/image/`, which **never matched the image
optimizer** — it is requested at `/_next/image?url=...` with nothing after
`image`, so the endpoint was gated, while `/_next/image/x`, a path nothing is
served at, was not. `_next/static/` worked only because a real static request
always carries a further segment. That shipped in #86 and was corrected on main
in `63cc6cc`; the test table now covers the bare endpoint, which is the shape
that hides it. Static
files are gated too: nothing on the login page loads from `public/`, and its own
JS is under `_next/static`, which stays excluded. The matcher cannot reference
`LOGIN_PATH` — Next statically analyses it at build time and silently ignores a
variable — so a test ties the two together instead.

Known ceiling: **a chunked session cookie would read as signed out.** Auth.js
splits the cookie into `authjs.session-token.0`, `.1`, … above 3936 bytes, and
then no cookie carries the bare name, which is what `cookies.has()` matches. The
JWT adds only `userId` to a default Google token, so this is nowhere near real
today. It becomes real the day the token carries an access or refresh token, and
the upgrade is one line: match `name === sessionName ||
name.startsWith(`${sessionName}.`)`.

Not built, deliberately: no `callbackUrl`. `useGoogleSignIn` always lands on
`SIGNED_IN_DESTINATION`, so a signed-out visitor to `/method` returns to `/`.

Verified on a built server rather than by a green suite — `/nope`, a route with
no page to redirect, still lands on `/login` signed out and 404s with a cookie,
which is the proof the proxy covers routes nobody has written yet:

| request               | signed out     | cookie present |
| --------------------- | -------------- | -------------- |
| `/`, `/method`        | 307 → `/login` | —              |
| `/nope`               | 307 → `/login` | 404            |
| `/login`              | 200            | —              |
| `/api/*`              | untouched      | —              |
| `/avatars/kid-01.svg` | 200            | 200            |

Tests: four in `src/__tests__/proxy.test.ts` — the redirect, its destination,
and each cookie name. Each was watched failing against a deliberately broken
implementation. The browser suites passing unchanged is the other half.

Ships: the app goes private.

### PR 7 — `feat/profile-section` — OPEN (#100)

- `src/components/Menu/ProfileSection/` — signed-in name + sign out.

Depends on: PR 4. Independent of 5/6 — can land any time after 4.

**The session already carried everything the strip shows.** `signedInUserId()`
called `auth()` and discarded all but the id, so name, address and photo cost no
extra query and no extra call. It is now `signedInUser()`, the only session
accessor; the API routes take `.id` from it.

**Two invisible things are load-bearing, and both were found by running the app
rather than reading it:**

- The address carries `dir="ltr"` as an **attribute**, not CSS. `stylis-plugin-rtl`
  mirrors every stylesheet, so `direction: ltr` written in a styled component is
  emitted as `rtl` — confirmed by reading the emitted rule. **Any `direction` in
  any `.styles.ts` in this repo is reversed.** Without it a long address
  truncated its local part and kept the domain.
- `referrerPolicy="no-referrer"` on the photo: `lh3.googleusercontent.com`
  answers 403 to a request carrying a `Referer`, which renders as a broken
  image. No `images.remotePatterns` is needed — `unoptimized` bypasses the host
  check, measured against a remote image that actually loads.

**Tests: the plan said "renders the name, calls `signOut`". That was a third of
it.** The browser suites can never reach the photo — the e2e session cookie
carries no `picture` — so `ProfilePhoto`'s four cases are its only cover, and
the `referrerPolicy` case is the only thing standing between a working avatar
and a broken one.

**This section predates #88 and #93 and its one placement instruction is now
stale.** It said "mirroring `AppearanceSection`", but #88 regrouped the menu into
two blocks and put `AppearanceSection` **inside** `MenuAccountScope`, the
per-account block headed with the current account's name and avatar. A profile
section is about the signed-in **user**, not the account in view, so mirroring
`AppearanceSection` would file it under the wrong heading. `MenuGlobalScope`
(the account picker and edit button) is the global block; #93 then took
navigation out of the account block as well. Decide the placement against the
menu as it now stands — `MenuOverlay.tsx` composes all of it — not against this
line.

**There is no mockup for it.** `mockups/` has no profile or sign-out artwork,
and `.plans/2026-09-15-menu-redesign.md` does not cover it. Every other menu
block was designed in a mockup first.

### PR 8 — `feat/assign-owner` — MERGED (#61, `b93e218`)

**The one data step. Without it, accounts created before auth have no member row
and go invisible the moment PR 9 lands.**

- `src/db/migration-target.ts` — **new**, `resolveTarget()` / `requireTargetUrl()`
  lifted out of `run-migration.ts` so both scripts share `--dev` / `--test`
  targeting.
- `src/db/assign-owner.ts` — `assignOwners`, pure: every account with no member
  row gets an `owner` row for a given owner. Idempotent, and it keys on
  `account_id` alone, so an account owned by _anyone_ is skipped rather than
  colliding with the `(account_id, user_id)` primary key.
- `src/db/run-backfill.ts` — the script around it, mirroring `run-migration.ts`.
  **Split from the logic deliberately:** a module with a top-level `main()`
  executes on import, so a test importing `assign-owner.ts` would run the
  backfill.
- `db:backfill`, `db:backfill-dev`, `db:backfill-test` npm scripts, taking
  `--email=<address>`.
- **Claude runs it from the session**, not you: `.env.local` is readable here and
  Neon is reachable (verified 2026-09-15 against dev and production). The **dev**
  run happens as part of this PR. The **production** run writes to real data and
  needs your explicit go-ahead each time — it is never run unprompted.
- **Both runs are done** — dev 3 accounts, production 4, orphans 0 on each. See
  the Progress section for the measured state.
- Verify zero orphans on every target, also run from the session:

```sql
SELECT COUNT(*) FROM accounts a
LEFT JOIN account_users m ON m.account_id = a.id
WHERE m.account_id IS NULL;   -- must be 0
```

Running this before anything enforces is free: nothing reads `account_users`
yet, so a wrong result breaks nothing and is fixed by re-running — which is
exactly when you want to find a bug in it.

Tests: unit tests on `assignOwners` with plain arrays — accounts without a
member get one, accounts with one are untouched, second run is a no-op. **Not
against `InMemoryStore`**, because the script never touches the store: see below.

Depends on: PR 3, and a real user row existing (so, after signing in once
post-PR 4). Both are satisfied.

> **Why raw SQL instead of the `DataStore`?** The script needs three things the
> interface does not have: find a user by email, list every `account_users` row,
> and insert a member for an account that already exists. `insertAccountWithOwner`
> cannot stand in — it inserts an account and its member together in one
> transaction, so there is no path through it to an existing account.
>
> Adding the three as repository methods means implementing them on postgres,
> memory **and** json, widening the interface — and the memory and json `insert`
> methods are already the subject of _Known divergences to settle before PR 9_.
> All three would be dead the day PR 9 lands, because accounts are owned at
> birth from then on and the orphan set is empty by construction. Deleting a
> script, a pure function and its test is one clean commit; un-adding three
> methods from three stores is not. A code review will flag the raw SQL — this
> paragraph is the answer.

> **Why not earlier?** Assigning an owner needs a user to assign to, and users
> only exist after a Google sign-in. Seeding a placeholder user at migration time
> would work, but only if provisioning then claimed it by matching on email — a
> permanent account-linking path added for a one-time bootstrap. Not worth it.

### PR 8b — `chore/e2e-signed-in-driver` — MERGED (#74)

**Test infrastructure, no production diff. Landed before PR 9 and was green on
its own, because `page.tsx` still calls `listAccounts()` until PR 9 switches it.**

Why it is its own PR: 10 of the 13 browser suites seed accounts through
`store.insertAccount()` — no owner row — and open the page with no session. The
moment PR 9 scopes the read to the signed-in user, every one of them renders the
empty state, and `create-account.e2e.ts`'s menu group takes a 401 from
`POST /api/accounts`. Repairing that inside PR 9 buries the switch in a test
refactor.

- `e2e/server.ts` — the spawned `next start` gets a fixed test `AUTH_SECRET`,
  returned alongside `baseUrl` and `dataPath` so the driver signs its cookie with
  the same value. Deliberately not read from `.env.local`: `test:visual` does not
  load it, and a hermetic secret keeps the suites independent of a local file.
- `e2e/driver/use-driver.ts` — `seedStore` inserts the owner user **first**, then
  each seeded account through `insertAccountWithOwner`. Accounts before users
  raises `UnknownOwnerError`. `mockUser` is seeded unconditionally and
  `state.users` adds to it, so a suite that passes the owner a second time gets a
  `DuplicateUserError` rather than a branch nothing exercises.
- `e2e/driver/session.ts` — `open()` sets an `authjs.session-token` cookie before
  navigating, via `encode({ token, secret, salt })` from `next-auth/jwt` with the
  cookie name as the salt.
- A default owner-user fixture, so **no suite changes**: `useDriver()` and
  `useDriver({ accounts: [mockAccount] })` keep their signatures and every seeded
  account belongs to the signed-in user.

No test-only branch reaches production code. The session is a real signed JWT
that `auth()` reads the same way it reads a browser's.

Tests: the 13 existing browser suites are the test — green before and after.
`page-routing.visual.ts`'s "with no accounts" group still gets the empty state,
now as a signed-in user who owns nothing. They would all pass against a broken
cookie too, since nothing reads the session until PR 9, so
`e2e/driver-session.e2e.ts` asserts the app opens as the seeded owner. Change
`SESSION_COOKIE_NAME` in `e2e/driver/auth-session.ts` and it fails with an empty
user id.

**`AUTH_TRUST_HOST` is required, not optional.** `next start` runs with
`NODE_ENV=production`, and `@auth/core`'s `setEnvDefaults` then leaves
`trustHost` false, so `auth()` raises `UntrustedHost`. The spawned server sets it
alongside `AUTH_SECRET`.

Depends on: PR 3, PR 8. Ships: nothing user-visible.

### PR 9 — `feat/scope-accounts-to-user` — MERGED (#81, `f947725`)

**The switch.** Shipped as four commits, each green on its own.

**1 — creation is owned.** `POST /api/accounts` takes the owner from the session
and returns 401 before parsing a body when there is none.
`AccountsStore.createAccount` writes through `insertAccountWithOwner`, so account
and member row land in one transaction. It takes a `CreateAccountParams` object,
and **`asOf` is gone**: every caller passed "now", and `today()` already honours
`FUNSAVER_NOW`, so a second clock seam bought nothing. `src/auth.ts` gained
`signedInUserId()`, a narrow accessor over the overloaded `auth()` — this plan's
first caller of `auth()` anywhere.

**2 — the read path.** Both pages read through `src/app/signed-in-accounts.ts`;
`listAccounts` deleted from `DataStore` and `BaseStore`.
**`AccountRepository.list()` stays** — `MemoryAccountUsers.listAccountsForUser`
builds its answer from it.

**3 — the backfill deleted**, with `src/db/migration-target.ts` kept for
`run-migration.ts`. Verified by running `db:migrate-dev`, not by grep.

**4 — this file and `.claude/HANDOVER.md`.**

**Thirteen test files moved, not seven.** The seven were right for
`listAccounts`; six more used `AccountsStore.createAccount` as fixture setup and
had to seed an owner user first, since #67 made `UnknownOwnerError` uniform
across stores. Five of those share `createOwnedAccount` from
`src/test-utils/owned-account.ts`. Every deleted `listAccounts` assertion became
`getAccount` — no test actually needed "all accounts", only "the insert landed".

**The account list is now sorted by name, not insertion order.**
`listAccountsForUser` runs `byAccountName` where `listAccounts` returned
insertion order, so with no `selectedAccountId` cookie the app opens on the
alphabetically first account rather than the oldest. `account-switch.visual.ts`
caught it and now asserts through `byAccountName` rather than encoding either
order. Accepted deliberately: the old order was whatever the store happened to
return, and the cookie decides every visit after the first.

**`jest.config.ts` maps the `@/` alias.** SWC rewrites `@/` in import specifiers
but not inside a `jest.mock()` string, which is why every other mock in this repo
is relative. PR 10 added `src/__mocks__/auth.ts`, so a suite needs only a bare
`jest.mock('@/auth')`.

**No `src/lib/account-access.ts`** — see _Authorization seam_ above.

**What review added, after the four commits above.** Two rounds, five
comments, all acted on; each had a premise worth checking first.

- **A signed-out visitor hit a dead end**, so `signedInAccounts()` now
  `redirect`s to `/login`. Scoping the read left an anonymous visitor on the
  empty state, invited to create an account the new 401 refuses. **This is a
  bite out of PR 6** — see that section.
- **`clock.ts` gained `now()`**, and `today()` is defined through it, so one
  `FUNSAVER_NOW` freezes every timestamp in an account write rather than only
  the wallet dates. It rejects an override that is not a date: routing
  `addedAt` through parsing turned a typo into `RangeError` on every render,
  naming neither the variable nor its value.
- **`getStore()` refuses `src/db/data.json` under `NODE_ENV=test`.** A suite
  that forgot `FUNSAVER_DATA_PATH` did not fail — it wrote real accounts into
  the developer's local store. Removing the helper from a suite passed 19 of 19
  and changed the file; it now fails naming both the env var and the helper.
- **`withTempDataPath()`** in `src/test-utils/test-utils.ts` replaced six copies
  of the temp-directory dance, and `createOwnedAccount` takes an `owner` and
  tolerates repeat calls.
- **The `next/navigation` mock throws**, as the real `redirect` does. Returning
  `undefined` let the signed-out test walk past the guard into
  `listAccountsForUser(undefined)`, proving `redirect` was _called_ rather than
  that it _stopped_ anything.

Two review premises were wrong and worth not repeating: `CreateAccount`'s
submit is **not** uncaught — `useAccountForm` catches it and `SaveAccount`
renders the message — and deleting the `!userId` guard does **not** go
unnoticed, since `tsc` rejects it. The defects behind both were real; only the
reasoning needed correcting.

Tests: `createAccount` writes an owner row the user can read back
(`getAccountUser` **and** `listAccountsForUser`); unauthenticated
`POST /api/accounts` → 401 with nothing written. Both were written after
confirming the suite stayed green with the behaviour deliberately broken — the
owner write reverted to `insertAccount`, the role flipped to `viewer`, the guard
deleted, the status changed to 403.

Depends on: PR 3, PR 8. Ships: users see only their own accounts, and it is
the prerequisite of PR 6 rather than a sequel to it.

### PR 10 — `feat/guard-transaction-routes` — MERGED (#87, `f1a283d`)

- `src/app/api/accounts/[id]/with-account-editor.ts` — **new**, the whole guard.
- `src/lib/account-access.ts` — **new**, `canEditAccount`, and `EDITING_ROLES` in
  `src/lib/constants.ts`. See _Authorization seam_ above for why it is one
  predicate and a wrapper rather than the two functions this plan named.
- All four routes became `export const PUT/POST = withAccountEditor(async
(request, id) => …)` and **lost** their own `RouteContext` and `await
context.params`: −42/+12 across the four. **`[id]/route.ts` is the one this
  plan kept leaving out** — the PUT that renames an account and changes its
  avatar, omitted by every earlier draft of this list.

**An unknown account now answers 403, not 404.** The guard runs ahead of every
existence check, so an id nobody is a member of is refused rather than reported
missing, and account ids stop being probeable. The three `404` tests became
`403`; the routes' own 404 branches stay as defence, unreachable while a
membership row can only exist for an account that exists.

**Every `[id]` route suite mocks `@/auth`, or it cannot load at all** — the
route imports `signedInUserId`, `next-auth` is ESM, and jest dies with
`require(esm)` before the first test. The mock is **`src/__mocks__/auth.ts`**,
found by a bare `jest.mock('@/auth')`. A bare one with no manual mock behind it
is what automocks and crashes; that is what the older warning against it meant.

**The browser suites needed no change.** `openApp` seeds through
`insertAccountWithOwner(account, mockOwner)` and signs the browser in as
`mockUser`, so every e2e request already carries an owner membership.

Tests, 10 of them: `canEditAccount` for an owner, a `viewer` and a stranger with
no row; the wrapper for 401, 403 and pass-through, each asserting the handler did
or did not run; one stranger case per route, asserting the **store** as well as
the status, because a 403 that arrives after the write would pass on status
alone. Each was watched failing against a deliberate break — the role list, a
forced `true`, each wrapper branch, a wrong id handed to the handler, and each
route unwrapped in turn.

**What review added, and it doubled the PR.** Five inline comments and three
notes, every premise checked before it was acted on:

- **`jsonBody` returned `Body | null` for a type argument the caller chose**,
  asserting a shape nothing had verified. It returns `unknown`, and
  `src/lib/transaction-input.ts` validates a deposit and a withdrawal the way
  `account-input.ts` already validated an account. It had survived only because
  `shekelsToAgorot(undefined)` makes `NaN` and `addDeposit` rejects it.
- **`isThemeId` in `src/theme/registry.ts`** replaced the route's `as ThemeId`
  and the identical cast inside `resolveThemeId`. `asObject` moved out of
  `account-input.ts` to `json-object.ts`, shared rather than copied.
- **A malformed theme body answered `unknown theme`**, sending a reader to the
  theme registry. The branches are separate, and both tests assert the message.
- **`API_ERRORS` in `src/app/api/constants.ts`** holds the nine refusal
  messages, read by the routes and the tests alike.
- **Three routes answered 500 to a malformed body** — pre-existing, and cheap to
  fix while all four signatures were open.
- **An expired session failed the tab silently**: `fetchJson` turned every
  non-`ok` into one generic error and nothing branched on 401, so a tab left open
  past expiry failed every mutation until a reload. It sends the browser to
  `/login` through `goTo` in `src/lib/navigate.ts` — a seam, because jsdom will
  not let a test observe `window.location.assign`.
- **`canEditAccount` takes `CanEditAccountParams`.** Two of its three arguments
  were adjacent strings, one swap away from asking whether the account may edit
  the user.

Measured on the merge: jest 598 across 116 suites, `test:db` 22, visual 45,
browser e2e 14, `tsc` and `eslint` clean, `next build` accepts the wrapped
`export const` handlers.

Depends on: PR 9. Ships: writes are authorized.

### PR 11 — `refactor/themed-page-shell` — MERGED (#94, `c36afa1`)

`<main><ThemeController initialThemeId={...}>{children}</ThemeController></main>`
is written out in full in all three pages — `src/app/page.tsx`,
`src/app/method/page.tsx` and `src/app/login/page.tsx`. One `ThemedPage`
taking `themeId` and `children` replaces the three copies.

**Raised during PR 9 and deliberately left out of it.** The duplication
predates that PR, and the third copy lives in `login/page.tsx`, which a PR
about the read path has no other reason to open. PR 9 did fold the two
_data_ duplications into `src/app/signed-in-accounts.ts` — the session read,
the cookie, the scoped account list and the resolved theme — because both of
its own callers shared them. The shell is what is left.

**Shipped in `src/theme/ThemedPage.tsx`**, beside `ThemeController` rather than
under `src/components/`: it carries no styles, no constants and no test IDs,
which is what that folder layout exists to hold. It stays a server component —
`ThemeController` is still the client boundary.

**"No new test" was wrong, and the suites proved it.** Both deliberate breaks —
dropping the `<main>`, and ignoring `themeId` in favour of `DEFAULT_THEME_ID` —
passed `test:db`, all 51 visual shots and all 14 browser checks, twice. Nothing
in `src/` or `e2e/` selects a `main` element, and **every fixture carries
`DEFAULT_THEME_ID`** (`src/test-utils/fixtures.ts`), which `resolveThemeId` also
falls back to. No suite could tell the resolved theme from the default, so "the
browser suites assert the themed render" held only for the one theme every
fixture uses. `src/theme/__tests__/ThemedPage.test.tsx` covers both, each case
watched failing against its own break and passing against the other's.

The shared `ThemeDisplay` probe lives in `src/test-utils/theme-probe.tsx`; it
was copy-pasted in two theme suites. It is deliberately **not** in
`test-utils/render.tsx`, whose `render` wraps everything in a `ThemeController`
on `DEFAULT_THEME_ID` — the exact thing these suites exist to distinguish.

Depends on: nothing. Independent of 6, 7 and 10; can land any time.

---

### PR 12 — `fix/empty-state-sign-out`

**A stranger who signs in cannot sign out.** With no `account_users` rows the
app renders `EmptyState`, which has no `Header` — and the menu, with it the
profile strip, lives in `Header` inside `Account`. The only way out is clearing
cookies. Found while placing the profile strip in PR 7, and it is the state this
plan's own authorization model makes reachable: signing in is open, so any
stranger lands there.

`SignedInProviders` wraps the page above `Home`, so the user is already in scope
at the empty state. This is a placement decision, not new plumbing.

Depends on: PR 7.

### PR 13 — `refactor/required-context`

Four contexts hand-roll the same `createContext<T | null>(null)` plus a
throw-if-missing hook: `accounts-context`, `signed-in-user-context`, and both of
`ThemeController`'s. One `createRequiredContext<T>(message)` returning
`[Provider, useRequired]` replaces them.

`app-mode-context` stays as it is — it carries a default and never throws, which
is a deliberate difference, not an inconsistency.

Same shape as PR 11: no behaviour change, provable by the suites not moving, and
each throw watched firing against a deliberate break. **Deliberately not folded
into PR 7** — a factory with one caller while two hand-rolled copies remain is
worse than the duplication it removes.

Depends on: nothing.

### PR 14 — `fix/menu-state-on-close`

The menu panel never unmounts, so state inside it survives the menu closing.
Found reviewing PR 7: fail a sign-out offline, close the menu, come back online
and reopen it, and the red failure message is still there with nothing in
flight. `ProfilePhoto` has the same shape — once a photo has failed to load, the
neutral mark sticks even if the URL changes.

Neither is reachable by accident and both need a failure first, which is why
they were left out of PR 7 rather than bolted on at review time. The fix is one
decision, not two: either the panel unmounts when closed — it does not today,
because the open/close transition animates it — or the menu's open state reaches
the pieces that hold state, and they reset on close.

Depends on: PR 7.

## Architecture touch points

| Layer                                               | Change                                                                      | PR      |
| --------------------------------------------------- | --------------------------------------------------------------------------- | ------- |
| `src/db/schema.sql`                                 | append `users`, `account_users`                                             | 1       |
| `src/lib/types.ts`                                  | add `User`, `AccountUserRole`, `AccountUser`                                | 1       |
| `src/db/row-mappers.ts`                             | add `UserRow`/`toUser`, `AccountUserRow`/`toAccountUser`                    | 1       |
| `src/db/data-store.ts`                              | add user methods, then membership methods, then **remove** `listAccounts`   | 2, 3, 9 |
| `src/db/base-store.ts`                              | delegate each new `DataStore` method once                                   | 2, 3, 9 |
| `src/db/postgres-store/{users,members}.ts`          | implement — JOIN, `sql.transaction([...])`                                  | 2, 3, 9 |
| `src/db/json-file-store/{users,members}.ts`         | implement — `StoreData` gains `users`, `members`                            | 2, 3, 9 |
| `src/db/memory-store/{users,members}.ts`            | implement — two arrays                                                      | 2, 3, 9 |
| `src/lib/user-provisioning.ts`                      | **new** — Google `sub` → user, else create                                  | 4       |
| `src/auth.ts`                                       | **new** — Auth.js config                                                    | 4       |
| `src/app/api/auth/[...nextauth]/route.ts`           | **new** — handler re-export                                                 | 4       |
| `.env.example`                                      | `AUTH_SECRET`, `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`                       | 4       |
| `src/app/login/page.tsx` + `src/components/SignIn/` | **new** — one Google button, RTL, themed                                    | 5       |
| `src/proxy.ts`                                      | **new** — no session cookie → `/login`; `/login` and `/api` off the matcher | 6       |
| `src/components/Menu/ProfileSection/`               | **new** — name + sign out                                                   | 7       |
| `src/app/SignedInProviders.tsx`                     | **new** — the providers every signed-in page gets; add new ones here        | 7       |
| `src/test-utils/render.tsx`                         | `renderWithUser` beside `renderWithAccounts`, both opt-in                   | 7       |
| `src/db/migration-target.ts`                        | **new** — shared `--dev` / `--test` target resolution                       | 8       |
| `src/db/assign-owner.ts`                            | **new** — adopt orphan accounts as `owner`; deleted again in 9              | 8       |
| `src/app/signed-in-accounts.ts`                     | **new** — session + cookie + scoped list + theme, shared by both pages      | 9       |
| `src/app/page.tsx` + `src/app/method/page.tsx`      | `listAccounts()` → `signedInAccounts()`                                     | 9       |
| `src/app/api/accounts/route.ts`                     | session `userId` + `insertAccountWithOwner`; 401 when signed out            | 9       |
| `src/db/{run-backfill,assign-owner}.ts`             | **deleted** — every account is owned at birth from here on                  | 9       |
| `src/lib/clock.ts`                                  | add `now()`; `today()` runs through it; a bad `FUNSAVER_NOW` throws         | 9       |
| `src/db/index.ts`                                   | refuse the default `data.json` under `NODE_ENV=test`                        | 9       |
| `src/test-utils/{owned-account,test-utils}.ts`      | `createOwnedAccount`, `withTempDataPath`                                    | 9       |
| `src/lib/account-access.ts`                         | **new** — `canEditAccount`; `EDITING_ROLES` in `constants.ts`               | 10      |
| `src/app/api/accounts/[id]/with-account-editor.ts`  | **new** — 401 without a session, 403 without an editing membership          | 10      |
| `src/app/api/accounts/[id]/**/route.ts`             | wrapped in `withAccountEditor`, edit PUT included                           | 10      |
| `src/theme/ThemedPage.tsx`                          | **new** — the `main` + `ThemeController` shell, one copy for three pages    | 11      |
| `src/app/{,method/,login/}page.tsx`                 | each drops its own copy of the shell                                        | 11      |

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
| ~~`FUNSAVER_SKIP_AUTH` may never exist~~ — **closed in PR 6**                                                                               | It never existed. PR 8b gave the suites a real cookie, and PR 6 shipped with no bypass.                            |
| No rate limiting on sign-in                                                                                                                 | Vercel/Neon edge config; no app change.                                                                            |
| No audit trail                                                                                                                              | `account_users.added_at` is the start; add `added_by` when sharing ships.                                          |

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
9. **Start with PR 6** — PRs 1–5, 8, 8b and 9 are done, and the Google Cloud step
   is long done. PR 6 is now a plain session gate: PR 9 deleted
   `DataStore.listAccounts()`, so a signed-in stranger with no `account_users`
   rows sees an empty app and the `AUTH_ALLOWED_EMAILS` allowlist PR 6 would
   otherwise have needed is unnecessary. PR 7 and PR 11 are independent.
10. **The backfill is gone.** If an orphan account ever appears again, there is
    no script to adopt it — write the `INSERT` by hand or re-create the account
    through the app. It should not be possible: `POST /api/accounts` is the only
    way in and it writes the owner in the same transaction.

### Still undecided

- Whether the json store's single-`save()` atomicity is worth an `fs`-mocking
  test, or whether reading the code is enough. Postgres covers the same risk
  where it is real.
- ~~Whether to delete the pre-existing Neon **dev** account before PR 8.~~
  Settled by default: it was kept, so PR 8's backfill adopted it. Dev only, and
  a `DELETE` undoes it.
- ~~When "go-live" is — the moment production gets real data, PR 10 must already
  have merged.~~ Settled: #87 merged, so production may take real data.
- Whether `data.json` and `JsonFileStore` retire once Neon is the real store.
  Out of scope here, but it is the cleanup that would collapse three store
  implementations into two.
