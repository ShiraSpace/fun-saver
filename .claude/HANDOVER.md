# Handover — 2026-09-22

## Start here

**Plan PRs 1–5 and 8 are merged** (`#28`, `#32`, `#41`, `#49`, `#53`, `#55`,
`#61`), plus **`#67`** (`1cbb01c`), which settled the two store divergences the
plan listed as PR 9's to decide. All verified by content on `main`, not by PR
pages.

Google sign-in works end to end, every account carries an owner row, and
**nothing is gated**.

**The public hole is still open and live.** `src/app/page.tsx` calls
`listAccounts()` and renders **4 real accounts and 263 transactions** to
anonymous visitors on <https://fun-saver.vercel.app>. Plan PR 9 is what closes
it.

**Next is plan PR 9 — `feat/scope-accounts-to-user`**, branched off updated
`origin/main`. Not PR 6. PR 7 is independent and can land any time.

Two parts of PR 9 are easy to miss, both spelled out in its plan section:

- It **opens** by re-running the backfill on both targets and re-checking the
  orphan query — `npm run db:backfill-dev -- --email=<owner address>` is
  idempotent and should report `0 account(s) assigned`. **Never run it against
  `production` without the user's explicit go-ahead.**
- It **closes** by deleting the backfill: `src/db/run-backfill.ts`,
  `src/db/assign-owner.ts`, `src/db/__tests__/assign-owner.test.ts` and the three
  `db:backfill*` scripts. **`src/db/migration-target.ts` stays** —
  `run-migration.ts` uses it.

Deleting `DataStore.listAccounts()` breaks every test file that calls it. Those
edits have to ride in the same commit or nothing compiles.

> **PR 6 must not ship a session-only gate.** Sign-in is open to any Google
> account by design — #53 has no allowlist. A stranger who signs in gets a
> `users` row and no `account_users` rows, which is harmless *only* once PR 9
> has deleted `DataStore.listAccounts()` and routed reads through
> `listAccountsForUser`. Gate on a session while `page.tsx` still calls
> `listAccounts()` and every signed-in stranger sees all four real accounts.
> **So PR 9's read path lands before or with PR 6.** If PR 6 has to go first,
> add the allowlist in it — `AUTH_ALLOWED_EMAILS` checked in `signIn`, plus
> `profile.email_verified`, since it keys on email.

**Do not trust `#68`'s title** ("PRs 1 to 4 merged, PR 5 is next"). The plan
content on `main` is correct and current: PR 8 merged, PR 9 next.

## Database state — measured 2026-09-22

| branch       | `users` | `accounts` | `account_users` | orphan accounts | transactions |
| ------------ | ------- | ---------- | --------------- | --------------- | ------------ |
| `production` | 1       | 4          | 4               | **0**           | 263          |
| `dev`        | 1       | 3          | 3               | **0**           | 200          |

Re-measure rather than trusting this table; PR 9's opening step exists to catch
what was created since.

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
*that*, never having been retargeted. #49 is its commits replayed onto `main`.
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
  swallowed an `eslint --fix`. Use `rtk proxy <cmd>` for anything you will report
  as a number, and capture to a file rather than piping.
- **zsh does not word-split unquoted variables.** `npx jest $FILES` with two
  paths passes them as a single pattern and prints `No tests found, exiting with
  code 1` — an exit status that reads like a real failure and is not one. Pass
  test paths literally.
- **Verify `HEAD`, not the working tree.** A commit here moved a file while
  leaving every importer on the old path, because one bad pathspec silently
  aborted the whole `git add`; `tsc` passed only because the working tree was
  right.
- **A test that has never failed proves nothing.** Break the implementation on
  purpose, watch the test fail, and read *which* test failed, not just the count.
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

`#67` closed both of the plan's _Known divergences to settle before PR 9_, so
**PR 9 no longer has that decision to make**:

- A repeat `insertAccountWithOwner` and an owner with no `users` row are now
  rejected by memory and json as well as postgres, before either write.
- Postgres translates `23505` and `23503` into the same `DuplicateAccountError`
  and `UnknownOwnerError` the other two raise, so a caller can branch on the type
  the way `user-provisioning.ts` already does for `DuplicateUserError`.
- All three stores check the duplicate before the owner, so a create that is both
  a repeat and an orphan fails identically everywhere.

**The plan's own divergences section is now stale** — it still describes both as
open. Correcting it belongs in PR 9.

## Housekeeping, all left alone deliberately

- Stale branches on origin, all merged or abandoned and safe to delete:
  `feat/user-store-methods`, `feat/account-user-reads`, `feat/account-user-create`,
  `feat/account-user-writes`, `feat/account-user-store-methods`,
  `fix/store-write-parity`.
- `stash@{1}` "PR2 user store methods" is obsolete. Drop it.
- `.plans/2026-07-25-neon-integration.md` still says `account_members`. Historical
  record of a past decision — correct to leave.
