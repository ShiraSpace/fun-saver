<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read
the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

# Watch-outs

Hard-won, and each one has cost a session at least once. Kept here rather than in
a handover note so they load with every session.

## Verifying that work landed

**This repo squash-merges.** `git log origin/main..origin/<branch>` shows commits
for a merged branch, so it proves nothing. Confirm by content:
`git diff origin/main origin/<branch> --stat`, or `git grep` a symbol the change
added. **A PR page saying "merged" is not proof either** — #47 says merged and
`main` never received a line of it, because it was stacked on another branch and
merged into that one. Retarget a stacked child to `main` before merging it.

**Verify `HEAD`, not the working tree.** A commit here moved a file while leaving
every importer on the old path: one bad pathspec silently aborted the whole
`git add`, and `tsc` passed only because the working tree was right.

**A test that has never failed proves nothing.** Break the implementation on
purpose, watch the test fail, and read *which* test reddened, not just the count.
Several tests here have passed against deliberately broken implementations.

**`git diff --quiet` is not a cleanliness check once the tree is dirty.** A
break-watch helper that guards on it works while the tree is committed and then
refuses every valid break the moment there is uncommitted work beside it. Snapshot
the file instead: `cp` it aside, apply the break, run, restore from the copy, and
`cmp` to prove the restore.

**An interrupted break-watch leaves the break applied.** A Ctrl-C between applying
and restoring leaves the deliberate break in the tree, and the *next* break then
reddens two tests — which reads as a real coupling between two unrelated things.
Before trusting any break result, check the tree actually holds only the break you
just made.

**"The existing suites already cover it" is a claim to test, not a fact.** Two
deliberate breaks once passed `test:db`, all visual shots and all browser checks —
87 checks agreeing with an assumption that was wrong. Related: every seeded
fixture carries `DEFAULT_THEME_ID`, so **any theme assertion must use a
non-default id** or it passes against a component that ignores the theme.

## Tooling

**`rtk` output is not trustworthy for facts.** It has reported `git status
--short` as `ok` on a dirty tree, miscounted a jest run, swallowed an
`eslint --fix`, rewritten a `tsc` run as a summary line, and hijacked `grep` and
`find`. Use `./node_modules/.bin/<tool>` captured to a file for anything you will
report as a number, and `rtk proxy <cmd>` for `git` and `gh`.

**zsh does not word-split unquoted variables.** `npx jest $FILES` with two paths
passes them as one pattern and prints `No tests found, exiting with code 1` — an
exit status that reads like a failure and is not one. Pass test paths literally.

**`npx jest` intermittently reports one suite failed with zero failing tests.** A
`SIGSEGV` in a worker. Environmental — re-run before believing it.

## Worktrees and concurrent sessions

**One worktree, one writer.** Do not run a HEAD-switching script, a build, or a
review agent against a worktree while its suites are running. That once produced
two browser failures that read exactly like regressions and were not.

**Other sessions and worktrees write to this repo and to the dev database.** Check
file mtimes before assuming uncommitted changes are yours, and re-measure rather
than trusting a number taken an hour ago.

**The stash stack is shared across every worktree.** Never bare `git stash` /
`git stash pop`. Prefer a temporary WIP commit; if you must stash, use
`git stash push -u -m "<unique-tag>"`, capture the SHA from
`git stash list --format='%H %gs'`, restore with `git stash apply <sha>`, then
drop that entry.

**A fresh worktree has no `node_modules` and no `.env.local`.** Both need
installing or copying before any `db:*` script or jest will run.

## Running the suites

Rising cost: `npx tsc --noEmit`, `npx eslint .`, `npx jest`, then
`npm run test:db` (live Neon), `npm run build`, `npm run test:e2e`. The last three
catch what the first three miss.

**`npm run test:e2e` runs `test:db` and `test:visual` first**, so its output holds
three summaries — read the right one. `e2e/*.e2e.ts` depends on the `next build`
that `test:visual` performs; run it alone and `next start` fails with "server did
not start".

## Environment

**The Neon default branch is named `production`, not `main`.** Confirm which
branch `DATABASE_URL` points at before any `npm run db:migrate`. `schema.sql` is
idempotent, so a replay is safe. **Production holds real data.**

**`~/.npmrc` sets `package-lock=false` and a Nexus registry**, so `npm install`
updates `node_modules` and leaves `package-lock.json` untouched — the dependency
never reaches Vercel. Regenerate with `npm install --package-lock-only
--package-lock=true --registry=https://registry.npmjs.org/` and check every
`resolved` URL still points at `registry.npmjs.org`.

**The public production origin is `https://fun-saver.vercel.app`.** The
per-deployment and `-git-main-` URLs sit behind Vercel deployment protection and
redirect to `vercel.com/sso-api`, so OAuth cannot complete through them.
