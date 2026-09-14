# Handover — 2026-09-14

## Start here

**Plan PR 4 is open as [#53](https://github.com/ShiraSpace/fun-saver/pull/53)**
— `feat/google-auth`. Google sign-in works end to end: signing in provisions a
`users` row, and the session carries our own user id rather than the provider's
`sub`. Its prerequisites are both done — the Google Cloud OAuth client exists,
and Neon `production` has been migrated.

**The public hole is still open.** `src/app/page.tsx` calls `listAccounts()` and
renders every account to whoever opens the public URL. Production holds **4 real
accounts and 216 transactions**, and an anonymous request renders them — so this
is live exposure, not a theoretical one. Nothing in PR 4 gates anything.

**Next is plan PR 5 — `feat/login-page`**, then PR 6, which is the one that
actually closes the hole. PR 7 can land in parallel.

After #53 merges, **sign in once on production** — that creates the `users` row
plan PR 8 assigns those four accounts to.

## What landed

Plan PRs 1, 2 and 3 (`#28`, `#32`, `#41`, `#49`), plus `#29`, `#30` and `#33`.

`main` also moved a long way underneath this work: #36, #42, #43, #44, #45
(styled-components extracted to `<Component>.styles.ts`), #48 (wallet hero and
coin row removed) and **#46, which caps files at 200 lines and functions at 40**.
#46 is the one that will bite — PR 4 onward is linted against it.

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

- **The Neon default branch is named `production`, not `main`.** It was migrated
  on 2026-09-14; `users` and `account_users` now exist there with the `role`
  CHECK, both foreign keys and `account_users_user_idx`. `DATABASE_URL` points at
  endpoint `ep-jolly-truth-a21toeir`, which is that branch — confirm it before
  any future `npm run db:migrate`. `schema.sql` is idempotent, so a replay is
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
- **Verify `HEAD`, not the working tree.** A commit here moved a file while
  leaving every importer on the old path, because one bad pathspec silently
  aborted the whole `git add`; `tsc` passed only because the working tree was
  right.
- **A test that has never failed proves nothing.** Three tests in plan PR 3
  passed against deliberately broken implementations. Two were rewritten and one
  was deleted — it could not fail in any world. Break the code and watch the test
  fail, and read *which* test failed, not just the count.
- **`npx jest` intermittently reports one suite failed with zero failing tests.**
  A `SIGSEGV` in a jest worker, hit three times here on three different component
  suites, always passing on rerun. Environmental. Re-run before believing it.
- **`e2e/*.e2e.ts` depends on the `next build` that `test:visual` performs.** Run
  it alone and `next start` fails with "server did not start".
- **Other sessions may be editing this repo.** One wrote four commits' worth of
  code into the working tree mid-task here. Check `ListAgents` and file mtimes
  before assuming uncommitted changes are yours.
- Repo workflow is checkpoint-driven: approval before every commit and push. See
  CLAUDE.md.
- Never force-push. Correct a published branch with a commit on top.

## Known divergences PR 9 has to decide

Both are recorded in full in the plan under _Known divergences to settle before
PR 9_. Both have the same root cause — the memory and json `insert` methods
accept anything — and want one PR between them:

- A **repeat** `insertAccountWithOwner` duplicates the account in memory/json and
  is rejected by postgres; `listAccountsForUser` then returns it twice.
- An owner that **does not exist** is accepted by memory/json and rejected by
  postgres, leaving an account nothing can reach. PR 4's signup path makes this
  reachable: dev-on-json passes where production-on-postgres throws.

## Housekeeping, all left alone deliberately

- Stale branches on origin: `feat/user-store-methods`, `feat/account-user-reads`,
  `feat/account-user-create`, `feat/account-user-writes`,
  `feat/account-user-store-methods`. All merged or abandoned; safe to delete now
  that #49 has landed.
- `stash@{1}` "PR2 user store methods" is obsolete. Drop it.
- `.plans/2026-07-25-neon-integration.md` still says `account_members`. Historical
  record of a past decision — correct to leave.
