# Handover — 2026-09-23 (the google-login plan is done; PR 15 is next)

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

**Plan PR 6 merged as #86 (`7312359`), with one correction after it.**
`src/proxy.ts` sends a request with no session cookie to `/login`. Three things
the plan got wrong or left open, all now settled — the plan's PR 6 section has
the detail:

- **Next 16 renamed the file convention: it is `proxy.ts` exporting `proxy`, not
  `middleware.ts`.** Deprecated and renamed in v16.0.0. `config.matcher` and the
  redirect API are unchanged, and the runtime now defaults to Node.js. This is
  precisely the AGENTS.md trap — read `node_modules/next/dist/docs/` first.
- **Both session cookie names are read**, because Auth.js prefixes the cookie
  `__Secure-` on https and production is the only https target. Keying on one
  name passes all 81 e2e checks and breaks production. `SESSION_COOKIE_NAMES`.
- **`FUNSAVER_SKIP_AUTH` never existed.** `test:e2e` was identical to baseline
  with no bypass at all.

**`63cc6cc` went straight to main after the merge**, correcting the matcher to
`_next(?:/|$)`. What #86 shipped, `_next/image/`, never matched the image
optimizer — it is requested at `/_next/image?url=...` with nothing after
`image`. The lesson is in the test, not the regex: the table asserted
`/_next/static/chunk.js`, a path with a further segment, which is exactly the
shape that hides an unanchored prefix. Assert the bare endpoint.

**The page-level redirect in `signed-in-accounts.ts` stays, deliberately.** The
proxy makes the optimistic cookie check only; `signedInAccounts()` is what
verifies the session and is the only source of a `userId` for the pages. A forged
cookie passes the proxy and is caught there.

**Known ceiling, recorded not built: a chunked session cookie reads as signed
out.** Auth.js splits the cookie above 3936 bytes and then no cookie carries the
bare name that `cookies.has()` matches. The JWT holds only `userId` today; this
becomes real the day it carries a provider access or refresh token.

**No screenshots on PR 6**, against what CLAUDE.md asks for on a visible change —
called off explicitly to save time. `withShots` still cannot shoot a signed-out
browser: `openApp` always installs a session cookie. Making `cookie` optional
through `Session.open`/`openApp`/`withShots` is about 8 lines if a later PR needs
it.

**Plan PR 11 merged as #94 (`c36afa1`), and PR 7 is the only thing left.** One
`ThemedPage` in `src/theme/` holds the `<main>` + `ThemeController` shell that
all three pages were writing out. Read "What PR 11 proved about the suites"
below before trusting any claim that the browser suites already cover something.

**Plan PR 10 merged as #87 (`f1a283d`).** It closed the last cross-user path —
the four `[id]` mutation routes ran with no authorization at all, and PR 6 never
narrowed them, because `/api` is deliberately outside the proxy's matcher.
**Production may now take real data.** **PR 7 (`feat/profile-section`) and PR 11
(`refactor/themed-page-shell`) are what is left**, both independent of
everything else and of each other.

## What PR 11 proved about the suites — read this before writing a test plan

**The plan said PR 11 needed no new test, because "the browser suites assert the
themed render already". That was false, and two deliberate breaks proved it.**
Dropping the `<main>` and ignoring the passed `themeId` in favour of
`DEFAULT_THEME_ID` each passed `test:db`, all 51 visual shots and all 14 browser
checks — twice. Two reasons, both worth remembering beyond this PR:

- **Nothing in `src/` or `e2e/` selects a `main` element.** A landmark no test
  queries is a landmark no test protects.
- **Every seeded fixture carries `DEFAULT_THEME_ID`** (`src/test-utils/fixtures.ts`),
  and `resolveThemeId` falls back to it too. So no suite can distinguish the
  resolved theme from the default. **Any future theme assertion must use a
  non-default id** — `midnight-blue` is what `ThemedPage.test.tsx` uses — or it
  passes against a component that ignores the theme entirely.

The lesson generalises: "the existing suites already cover it" is a claim to
test by breaking the thing, not a fact to accept. 87 checks agreed with the
plan and were wrong.

- **`src/test-utils/theme-probe.tsx`** holds the shared `ThemeDisplay` probe and
  `THEME_ID_TESTID`, used by both theme suites. It is **not** in
  `test-utils/render.tsx` on purpose: that `render` wraps everything in a
  `ThemeController` on `DEFAULT_THEME_ID`, which is the very thing these suites
  exist to tell apart.

## PR 7 merged as #100, and four traps came out of it

**`direction` in a styled component is reversed.** `EmotionStyleRegistry` runs
`stylis-plugin-rtl`, which mirrors every stylesheet, so `direction: ltr` is
emitted as `rtl`. Confirmed by reading the emitted rule against the source.
Use the HTML `dir` attribute for content whose direction differs from the page;
do not reach for the stylesheet.

**A Google avatar needs `referrerPolicy="no-referrer"`.**
`lh3.googleusercontent.com` answers 403 to a request carrying a `Referer`, and
it renders as a broken image. It does **not** need `images.remotePatterns` —
`unoptimized` bypasses the host check, measured against a remote image that
actually loads, not inferred.

**The closed menu was reachable by keyboard.** The panel is always mounted and
hidden with `opacity` and `pointer-events`, which stops the mouse and not the
keyboard, so every control in it sat in the tab order of both pages. Harmless
while the menu held a picker and an edit button; not harmless once it held sign
out. `inert` on the panel closes it. The lesson generalises: a pre-existing
structure can become a defect because of what is added to it.

**`src/test-utils/render.tsx` has six render helpers and wants one (plan PR 15,
next).** They are a matrix — theme × user × accounts × route — and each new
dimension doubles it. One `render(element, options)` with optional keys
replaces them. **Whatever replaces them must leave `user` out of the default:** the
shared wrapper used to give every test a signed-in user, which made the throw in
`signed-in-user-context` unreachable. Omitting an option has to keep meaning
"no provider".

**Follow-ups found, all in the plan:** a signed-in stranger cannot sign out
(PR 12), four contexts hand-roll the same required-context boilerplate (PR 13),
and menu state survives the menu closing (PR 14).

## The earlier follow-ups, still open

- **A signed-in stranger cannot sign out (plan PR 12).** No `account_users`
  rows → `EmptyState` → no `Header` → no menu → no sign-out. Only exit is
  clearing cookies. The open sign-in this plan chose makes that state reachable
  by anyone.
- **Four contexts hand-roll the same required-context boilerplate (plan PR 13)**
  — `accounts-context`, `signed-in-user-context`, and both of
  `ThemeController`'s. `app-mode-context` is deliberately different: it has a
  default and never throws.

**Both signed-in pages wrap their content in `SignedInUserProvider` inside
`ThemedPage`.** A context Provider from a `'use client'` module can be rendered
straight from a server component — measured, not assumed — so no wrapper
component is needed for one provider. If a second app-wide provider ever
arrives, that is the moment to compose them in one place, not before.
`AccountsProvider` stays inside `Home`/`Method` regardless: its value comes from
each one's own `useAccountNavigation` state.

**`signedInUserId` is gone — `signedInUser()` is the only session accessor**, and
returns `id`, `name`, `email` and an optional `image`. The API routes take `.id`
from it. `src/__mocks__/auth.ts` mocks that one name.

## PR 7's plan section was stale

**The plan says `ProfileSection` should mirror `AppearanceSection`. Do not.**
#88 regrouped the menu into `MenuGlobalScope` (account picker, edit button) and
`MenuAccountScope` (headed with the current account's name and avatar), and put
`AppearanceSection` **inside the per-account block**. A profile section is about
the signed-in _user_, so mirroring `AppearanceSection` files it under the wrong
heading. #93 then took navigation out of the account block too. `MenuOverlay.tsx`
composes the lot — decide placement from there.

**There is no mockup for it.** `mockups/` has no profile or sign-out artwork and
the menu-redesign plan does not cover it, unlike every other menu block. Worth
settling the design before writing the component.

## What PR 10 changed that you need to know

- **`withAccountEditor` in `src/app/api/accounts/[id]/with-account-editor.ts` is
  the only guard.** It wraps a handler — no session → 401, no editing membership
  → 403, otherwise the handler runs with the resolved account id. A new route
  under `[id]` that mutates gets wrapped; wrapping is what stops the next route
  from forgetting, which calling a guard does not.
- **`canEditAccount(store, userId, accountId)` in `src/lib/account-access.ts`**
  holds the rule, with `EDITING_ROLES` in `src/lib/constants.ts`. It takes
  `AccountUserReader = Pick<DataStore, 'getAccountUser'>` so the role rule can be
  tested against a stub: nothing in the app writes a non-owner row, because
  `insertAccountWithOwner` is the only membership write there is.
- **An unknown account answers 403, not 404**, on all four routes. The guard runs
  ahead of every existence check, so ids are not probeable. The routes' 404
  branches are kept as defence and are unreachable in practice.
- **A route suite under `[id]` must mock `@/auth` or it cannot load at all** —
  the route imports `signedInUserId`, `next-auth` is ESM, and jest dies with
  `require(esm)` before the first test runs. `src/__mocks__/auth.ts` is that
  mock; a bare `jest.mock('@/auth')` finds it. **Bare with no manual mock is
  what automocks and crashes** — that is what the older note against it meant.
- **A request body is narrowed where it is read.** `jsonBody` returns `unknown`;
  `account-input.ts` and `transaction-input.ts` hold the validators, `asObject`
  is shared through `json-object.ts`, and `isThemeId` narrows a theme id in the
  registry. A route that casts its body is the bug this replaced.
- **Refusal messages live in `API_ERRORS`** (`src/app/api/constants.ts`), read by
  the routes and by the tests that assert them, so neither can drift.
- **A 401 from any mutation sends the browser to `/login`**, through `goTo` in
  `src/lib/navigate.ts`. The seam exists because jsdom will not let a test
  observe `window.location.assign` — read-only, not redefinable, and a real call
  prints "Not implemented: navigation". Everything else in the app navigates with
  the Next router and should keep doing so; `goTo` is for throwing the page away
  when the session is gone.
- **The browser suites needed no change**: `openApp` seeds through
  `insertAccountWithOwner(account, mockOwner)` and signs in as `mockUser`, so
  every e2e request already carries an owner membership.
- **The guard tests assert the store, not only the status.** A 403 that arrives
  after the deposit is split or the name is written passes a status-only
  assertion. Each one was also watched failing against a deliberate break,
  including unwrapping each route in turn — the wrapper's own suite cannot catch
  a route that forgot to use it.

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
  through `src/__mocks__/auth.ts`, never an automock — an automock loads the real module and
  `next-auth` is ESM, so jest dies with `require(esm)` before any test runs. A
  mock of `next/navigation` must **throw**, because the real `redirect` is typed
  `never`.

## Test suites — measured 2026-09-23 on `c36afa1` (PR 11 merged)

`jest` **622 across 122 suites** · `test:db` 22 across 5 · `test:visual` **51** ·
browser `e2e` 14 · `tsc --noEmit` and `eslint .` clean.

**The handover's previous figures were stale in both directions** — it recorded
598/116 and 45 visual against an actual 620/121 and 47 at the same commit, and
#92 then added 4 more shots. Re-measure; do not cite this table without doing so.

**Re-run a failing browser suite before believing it, and check nothing else is
touching the worktree.** Two visual tests failed here with
`Navigation timeout of 30000 ms exceeded` and a puppeteer `protocolTimeout`,
which read as visual regressions and were neither: a concurrent review agent had
checked the branch back out mid-run, swapping `.next` under a live `next start`.
A clean re-run went 51/51. **One worktree, one writer** — do not run a
HEAD-switching script and a review agent against the same worktree at once.

## Database state — re-measured 2026-09-23 during PR 11

| branch       | `users` | `accounts` | `account_users` | orphan accounts | transactions |
| ------------ | ------- | ---------- | --------------- | --------------- | ------------ |
| `production` | 1       | 4          | 4               | **0**           | **266**      |
| `dev`        | 1       | 3          | 3               | **0**           | **293**      |
| `test`       | 0       | 0          | 0               | **0**           | 0            |

**Production's transactions moved 263 → 266 — that is real use**, PR 10 having
been the last thing blocking go-live. Treat production as live data from here
on. Dev's 221 → 293 is other worktrees, as ever.

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
