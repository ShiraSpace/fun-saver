# Handover — 2026-09-13

## What shipped

Merged to `main` since the last handover: **#32** (plan PR 2 — user repositories,
`BaseStore`, the `*.e2e.ts` rename, and a `DuplicateUserError` guard in all three
stores), **#33** (`findUserByIdentity` extracted to `src/db/user-identity.ts`),
plus #31 and #36 from outside this plan.

## In flight — plan PR 3, open as two stacked PRs

- **[#41](https://github.com/ShiraSpace/fun-saver/pull/41)** `feat/account-user-reads`
  — the `account_users` rename plus `getAccountUser` and `listAccountsForUser` in
  all three stores. Six commits; four review findings addressed and resolved.
- **[#47](https://github.com/ShiraSpace/fun-saver/pull/47)** `feat/account-user-create`
  — **based on #41**, adds `insertAccountWithOwner`. Two commits.

**Merge #41 first.** #47 retargets to `main` on its own once that happens.

Green at handover, verified against the committed tree with a clean worktree:
`tsc`, `eslint .`, `npx jest` 393 / 86 suites, `npm run test:db` 19.

[#34](https://github.com/ShiraSpace/fun-saver/pull/34) was plan PR 3 as one PR.
Closed unmerged and split — #41 and #47 are fresh branches, nothing was
force-pushed.

## Next

**Plan PR 4 — `feat/google-auth`**, blocked on the manual Google Cloud console
step in the plan. Worth doing that setup now so the chain that closes the public
hole (1 → 2 → 4 → 5 → 6) is not waiting on it. PR 4 branches off `main` and does
not depend on #41 or #47.

## Watch-outs

- **The Neon default branch is named `production`, not `main`, and has never been
  migrated** — `users` and `account_users` do not exist there. Nothing before plan
  PR 4 needs it. Run `npm run db:migrate` against it only when you mean to, and
  confirm `DATABASE_URL` points at it first.
- **`rtk` output is not trustworthy for facts.** It reported `git status --short`
  as `ok` on a dirty tree — which is how a "clean tree" claim in this session was
  wrong — a jest count of 364 where the truth was 368, and it swallowed an
  `eslint --fix`. Use `rtk proxy <cmd>` for anything you will report as a number,
  and capture to a file rather than piping.
- **Verify `HEAD`, not the working tree.** A commit here moved a file while
  leaving every importer on the old path, because one bad pathspec silently
  aborted the whole `git add`; `tsc` passed only because the working tree was
  right. Confirm the tree is clean before quoting a result.
- **A test that has never failed proves nothing.** Two tests in plan PR 3 passed
  against deliberately broken implementations on the first attempt and had to be
  rewritten. Break the code and watch the test fail.
- **`e2e/*.e2e.ts` depends on the `next build` that `test:visual` performs.** Run
  it alone and `next start` fails with "server did not start". Undocumented
  coupling, not fixed.
- **Other sessions may be editing this repo.** One wrote four commits' worth of
  code into the working tree mid-task here. Check `ListAgents` and file mtimes
  before assuming uncommitted changes are yours.
- Repo workflow is checkpoint-driven: approval before every commit and push. See
  CLAUDE.md.
- Never force-push. #41 and #47 are published; correct them with a commit on top.

## Housekeeping, all left alone deliberately

- `stash@{1}` "PR2 user store methods" is obsolete — written against the
  pre-#29/#30 tree. Drop it.
- Stale branches on origin: `feat/user-store-methods` (merged as #32) and
  `feat/account-user-store-methods` (the closed #34).
- `.plans/2026-07-25-neon-integration.md` still says `account_members`. It is a
  historical record of a past decision — correct to leave.
