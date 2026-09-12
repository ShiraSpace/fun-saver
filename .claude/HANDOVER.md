# Handover — 2026-09-12

## What shipped

- `main` — b9ae600 `docs(plan)`, cherry-picked from `docs/plan-progress` onto updated
  `origin/main` (the branch itself, local and on origin, is now redundant — safe to delete)
- **PR [#32](https://github.com/ShiraSpace/fun-saver/pull/32)** open on
  `feat/user-store-methods`, four commits, plan PR 2 of `.plans/2026-09-12-google-login.md`:
  - `feat(db)` user repositories in all three stores (`findUserByProvider`, `insertUser`)
  - `refactor(db)` `BaseStore` — `DataStore` delegation written once instead of three times
  - `test(db)` users tests + the `emptyData` guard in `file.test.ts`
  - `test(db)` live suites renamed `*.e2e.ts`, per-file `TEST_DATABASE_URL` guards deleted

Green at handover: `npx jest` 366, `npm run test:db` 9, `tsc`, ESLint. Background code
review ran twice on the branch and found nothing.

## In flight

- #32 awaits review and merge. It ships no behaviour change — nothing calls the new
  store methods until plan PR 9.
- `origin/main` moved to 232a591 (#31 `halfShekelAmount`) after #32 branched. Different
  files, so no conflict; do **not** rebase #32, it is pushed.

## Next

**Plan PR 3 — `feat/account-user-store-methods`**, branched off updated `origin/main` once
#32 merges. Its section in the plan is current: `AccountUserRepository`, one `account-users.ts` per
store folder, the three `DataStore` methods delegated once in `base-store.ts`, and a
`account-users.e2e.ts` live suite needing `account_users` added to `live-store.ts` cleanup.

## Watch-outs

- **Neon main (production) has never been migrated** — `users` / `account_users` do not
  exist there. Run `npm run db:migrate` against it only when you mean to.
- **`e2e/*.e2e.ts` depends on the `next build` that `test:visual` performs.** Run it alone
  and `next start` fails with "server did not start". Undocumented coupling, not fixed.
- `stash@{0}` "PR2 user store methods" is obsolete — written against the pre-#29/#30 tree.
  Drop it.
- Repo workflow is checkpoint-driven: approval before every commit and push. See CLAUDE.md.
- Never force-push; #32 is published, correct it with a commit on top.
