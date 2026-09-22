# Handover — 2026-09-22 (PR 6 built)

## Start here

**Plan PRs 1–5, 8, 8b and 9 are all merged** (`#28`, `#32`, `#41`, `#49`, `#53`,
`#55`, `#61`, `#74`, `#81` — PR 9 as `f947725`), along with **`#67`**
(`1cbb01c`), which settled the two store divergences the plan once assigned to
PR 9. Verify by content on `main`, never by PR pages.

**The public hole is closed and the app is no longer readable signed out.**
`DataStore.listAccounts()` does not exist. Both pages go through
`src/app/signed-in-accounts.ts`, which resolves the session user, the
selected-account cookie, that user's accounts and the theme — and **redirects to
`/login` when there is no session**. `POST /api/accounts` refuses an
unauthenticated caller and writes the account with its owner row in one
transaction.

**Plan PR 6 is built on `feat/auth-proxy`** (off `f9d6573`), not yet pushed.
`src/proxy.ts` sends a request with no session cookie to `/login`. Three things
about it that the plan got wrong or left open, all now settled — the plan's PR 6
section has the detail:

- **Next 16 renamed the file convention: it is `proxy.ts` exporting `proxy`, not
  `middleware.ts`.** Deprecated and renamed in v16.0.0. `config.matcher` and the
  redirect API are unchanged, and the runtime now defaults to Node.js. This is
  precisely the AGENTS.md trap — read `node_modules/next/dist/docs/` first.
- **Both session cookie names are read**, because Auth.js prefixes the cookie
  `__Secure-` on https and production is the only https target. Keying on one
  name passes all 81 e2e checks and breaks production. `SESSION_COOKIE_NAMES`.
- **`FUNSAVER_SKIP_AUTH` never existed.** `test:e2e` was identical to baseline
  with no bypass at all.

**The page-level redirect in `signed-in-accounts.ts` stays, deliberately.** The
proxy makes the optimistic cookie check only; `signedInAccounts()` is what
verifies the session and is the only source of a `userId` for the pages. A forged
cookie passes the proxy and is caught there.

**No screenshots on this PR**, against what CLAUDE.md asks for on a visible
change — called off explicitly to save the time. `withShots` still cannot shoot a
signed-out browser: `openApp` always installs a session cookie. Making `cookie`
optional through `Session.open`/`openApp`/`withShots` is about 8 lines if a later
PR needs it.

PR 7 and PR 11 are independent. **PR 10 is next** — it guards the `[id]` mutation
routes, still the only cross-user path left and the highest-value thing
outstanding. PR 6 did not narrow it: `/api` is deliberately outside the proxy's
matcher, because a redirect answers a `fetch()` with an HTML login page.

## New on main that this repo did not have before

- **`.claude/skills/pr-screenshots`, and CLAUDE.md now requires it** (#80): every
  pull request whose diff changes something visible carries screenshots of what
  it changed. PR 6 changes visible behaviour — a signed-out visitor lands on the
  login page — so it needs them.

## What PR 9 changed that you need to know

- **The account list is sorted by name now, not insertion order.**
  `listAccountsForUser` runs `byAccountName`; `listAccounts` did not. With no
  `selectedAccountId` cookie the app opens on the alphabetically first account
  rather than the oldest. Accepted deliberately.
- **The backfill is deleted** — `run-backfill.ts`, `assign-owner.ts`, its test
  and the three `db:backfill*` scripts. **`src/db/migration-target.ts` stays**;
  `run-migration.ts` uses it, and `npm run db:migrate-dev` is the check that it
  survived. If an orphan account ever appears there is no script to adopt it —
  write the `INSERT` by hand. It should not be possible any more.
- **An orphan did appear mid-PR, on dev**, created through another worktree still
  running the old unowned `insertAccount` path. Deleted rather than adopted.
  **Other worktrees write to the same dev database** — remember it before
  trusting a measurement taken an hour ago.
- **`getStore()` refuses `src/db/data.json` under `NODE_ENV=test`.** Before this,
  a suite that forgot `FUNSAVER_DATA_PATH` silently wrote real accounts into the
  local store file and still passed. Use **`withTempDataPath()`** from
  `src/test-utils/test-utils.ts` in any suite that touches the store.
- **`createOwnedAccount(store, { input, owner })`** seeds the owner and creates an
  account; it tolerates repeat calls and takes a different owner.
- **`src/auth.ts` exports `signedInUserId()`**, a narrow accessor over the
  overloaded `auth()`. Use it rather than `auth()` — `jest.mocked()` types
  against it cleanly, where `auth()`'s overloads force a cast.
- **`clock.ts` has `now()`**, and `today()` is defined through it, so one
  `FUNSAVER_NOW` freezes every timestamp. An override that is not a date throws
  `ValidationError` naming the variable.
- **Mocking under jest**: `jest.config.ts` maps `^@/(.*)$` because SWC rewrites
  `@/` in import specifiers but not inside a `jest.mock()` string. Mock `@/auth`
  with a **factory**, never an automock — an automock loads the real module and
  `next-auth` is ESM, so jest dies with `require(esm)` before any test runs. A
  mock of `next/navigation` must **throw**, because the real `redirect` is typed
  `never`.

## Database state — measured 2026-09-22

| branch       | `users` | `accounts` | `account_users` | orphan accounts | transactions |
| ------------ | ------- | ---------- | --------------- | --------------- | ------------ |
| `production` | 1       | 4          | 4               | **0**           | 263          |
| `dev`        | 1       | 3          | 3               | **0**           | 221          |
| `test`       | 0       | 0          | 0               | **0**           | 0            |

Re-measure rather than trusting this table — dev grew an orphan between two
measurements an hour apart during PR 9. The `test` branch is written and cleaned
by `npm run test:db`, which keys on a per-run id prefix.

**The dev and test TTLs were extended to 2026-10-10** (they were 09-19 and
09-27). Neon caps an extension at roughly 30 days out, so they will need
extending again. Prefer extending over recreating: recreating `dev` from
`production` destroys dev's own data, which has diverged.

## Verifying anything

**This repo squash-merges.** `git log origin/main..origin/<branch>` always shows
commits for a merged branch, so it proves nothing. Check content instead:

```
git diff origin/main origin/<branch> --stat
git grep -c <symbol the PR added> origin/main
```

A PR page saying "merged" is not proof either. **#47 says merged and `main`
never received a line of it** — it was stacked on another branch and merged into
_that_, never having been retargeted. #49 is its commits replayed onto `main`.
For any future stacked PR: retarget the child to `main` before merging it.

## Watch-outs

- **The Neon default branch is named `production`, not `main`.** `DATABASE_URL`
  points at endpoint `ep-jolly-truth-a21toeir`, which is that branch — confirm it
  before any `npm run db:migrate`. `schema.sql` is idempotent, so a replay is
  safe.
- **`~/.npmrc` sets `package-lock=false` and a Nexus registry.** An `npm install`
  here updates `node_modules` but leaves `package-lock.json` untouched, so the
  dependency never reaches Vercel. Regenerate with
  `npm install --package-lock-only --package-lock=true --registry=https://registry.npmjs.org/`
  and check that every `resolved` URL still points at `registry.npmjs.org`.
- **The public production origin is `https://fun-saver.vercel.app`.** The
  per-deployment and `-git-main-` URLs are behind Vercel deployment protection
  and redirect to `vercel.com/sso-api`, so OAuth cannot complete through them.
- **`rtk` output is not trustworthy for facts.** It reported `git status --short`
  as `ok` on a dirty tree, a jest count of 364 where the truth was 368, and
  swallowed an `eslint --fix`. During PR 9 it also rewrote a `tsc` run as a
  summary line, and hijacked `grep` and `find`. Prefer
  `./node_modules/.bin/<tool>` written to a file, and `rtk proxy <cmd>` for
  anything you will report as a number.
- **zsh does not word-split unquoted variables.** `npx jest $FILES` with two
  paths passes them as a single pattern and prints `No tests found, exiting with
code 1` — an exit status that reads like a real failure and is not one. Pass
  test paths literally.
- **Verify `HEAD`, not the working tree.** A commit here moved a file while
  leaving every importer on the old path, because one bad pathspec silently
  aborted the whole `git add`; `tsc` passed only because the working tree was
  right.
- **A test that has never failed proves nothing.** Break the implementation on
  purpose, watch the test fail, and read _which_ test failed, not just the count.
  Three tests in plan PR 3 passed against deliberately broken implementations,
  and one of #67's tests asserted on the wrong promise in a `Promise.allSettled`
  pair and passed for it.
- **`npx jest` intermittently reports one suite failed with zero failing tests.**
  A `SIGSEGV` in a jest worker. Environmental. Re-run before believing it.
- **`e2e/*.e2e.ts` depends on the `next build` that `test:visual` performs.** Run
  it alone and `next start` fails with "server did not start".
- **A fresh worktree has no `node_modules` and no `.env.local`.** Both need
  installing or copying before any `db:*` script or jest will run.
- **Other sessions may be editing this repo.** One wrote four commits' worth of
  code into the working tree mid-task here. Check `ListAgents` and file mtimes
  before assuming uncommitted changes are yours.
- Repo workflow is checkpoint-driven: approval before every commit and push. See
  CLAUDE.md.
- Never force-push. Correct a published branch with a commit on top.

## The store divergences are settled

`#67` closed both of the plan's divergences, so **PR 9 never had that decision to
make**:

- A repeat `insertAccountWithOwner` and an owner with no `users` row are now
  rejected by memory and json as well as postgres, before either write.
- Postgres translates `23505` and `23503` into the same `DuplicateAccountError`
  and `UnknownOwnerError` the other two raise, so a caller can branch on the type
  the way `user-provisioning.ts` already does for `DuplicateUserError`.
- All three stores check the duplicate before the owner, so a create that is both
  a repeat and an orphan fails identically everywhere.

PR 9 corrected the plan's own section, which had still described both as open.

## Housekeeping, all left alone deliberately

- Stale branches on origin, all merged or abandoned and safe to delete:
  `feat/user-store-methods`, `feat/account-user-reads`, `feat/account-user-create`,
  `feat/account-user-writes`, `feat/account-user-store-methods`,
  `fix/store-write-parity`.
- `stash@{1}` "PR2 user store methods" is obsolete. Drop it. The stash stack is
  shared across every worktree — never bare `git stash pop`.
- `.plans/2026-07-25-neon-integration.md` still says `account_members`. Historical
  record of a past decision — correct to leave.
