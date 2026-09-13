# Handover — 2026-09-13

## Start here

**One PR is open and it is the only thing left in plan PR 3:
[#49](https://github.com/ShiraSpace/fun-saver/pull/49)** on
`feat/account-user-writes` — `insertAccountWithOwner` in all three stores, its
nine tests, a lint rule, and the plan update. Green against current `main`.
Review it, merge it, and plan PR 3 is done.

Then **plan PR 4 — `feat/google-auth`**, which does not depend on #49 and is
blocked only on the manual Google Cloud console step described in the plan.
Doing that setup is the highest-value thing available, because PR 4 → 5 → 6 is
what actually closes the public hole.

## What landed

Plan PR 2 (**#32**) and plan PR 3a (**#41**, `ca1a505`) are on `main`, along with
**#33** and a batch of unrelated work that moved `main` a long way while this was
open: #36, #42, #43, #44, #45 (styled-components extracted to
`<Component>.styles.ts`) and **#46**, which caps files at 200 lines and functions
at 40. #46 is the one that will bite: PR 4 onward gets linted against it.

## The trap that already cost a PR

**[#47](https://github.com/ShiraSpace/fun-saver/pull/47) says "merged" on GitHub
and `main` never received a line of it.** It was stacked on
`feat/account-user-reads`, so merging it merged into *that branch* (`99a539b`),
not into `main` — it was never retargeted after #41 landed. #49 is its four
commits replayed onto current `main`.

For any future stacked PR: retarget the child to `main` before merging it, or
merge the parent and confirm the child's base actually changed. **The only proof
work landed is `git log origin/main..origin/<branch>` coming back empty.** A
green PR page is not proof.

## Watch-outs

- **The Neon default branch is named `production`, not `main`, and has never been
  migrated** — `users` and `account_users` do not exist there. Nothing before
  plan PR 4 needs it. Confirm `DATABASE_URL` points at it before running
  `npm run db:migrate`.
- **`rtk` output is not trustworthy for facts.** It reported `git status --short`
  as `ok` on a dirty tree — which is how a "clean tree" claim in this session was
  wrong — a jest count of 364 where the truth was 368, and it swallowed an
  `eslint --fix`. Use `rtk proxy <cmd>` for anything you will report as a number,
  and capture to a file rather than piping.
- **Verify `HEAD`, not the working tree.** A commit here moved a file while
  leaving every importer on the old path, because one bad pathspec silently
  aborted the whole `git add`; `tsc` passed only because the working tree was
  right.
- **A test that has never failed proves nothing.** Two tests in plan PR 3 passed
  against deliberately broken implementations and had to be rewritten. Break the
  code and watch the test fail.
- **`npx jest` intermittently reports one suite failed with zero failing tests.**
  It is a `SIGSEGV` in a jest worker, hit three times here on three different
  component suites, and it always passes on a rerun. Environmental, unexplained,
  not caused by any branch. Re-run before believing it.
- **`e2e/*.e2e.ts` depends on the `next build` that `test:visual` performs.** Run
  it alone and `next start` fails with "server did not start". Undocumented
  coupling, not fixed.
- **Other sessions may be editing this repo.** One wrote four commits' worth of
  code into the working tree mid-task here. Check `ListAgents` and file mtimes
  before assuming uncommitted changes are yours.
- Repo workflow is checkpoint-driven: approval before every commit and push. See
  CLAUDE.md.
- Never force-push. Correct a published branch with a commit on top.

## Housekeeping, all left alone deliberately

- Stale branches on origin: `feat/user-store-methods`, `feat/account-user-reads`,
  `feat/account-user-create`, `feat/account-user-store-methods`. All merged or
  abandoned; `feat/account-user-create` is the only record of #47 as it was.
- `stash@{1}` "PR2 user store methods" is obsolete. Drop it.
- `.plans/2026-07-25-neon-integration.md` still says `account_members`. It is a
  historical record of a past decision — correct to leave.
