# Child mode for the whole app, on this phone

> Status: PR 1 **merged** as #193 (2026-10-05); PR 2 next. Mockup:
> `mockups/global-child-mode.html`. Replaces the per-account view mode from
> `.plans/2026-10-03-child-mode.md` and the unbuilt PRs 2–3 of
> `.plans/2026-10-04-child-account-switcher.md` (#191 is superseded).

## Why

Child view is saved on each account, so handing the phone to one child and
then another means toggling each account, and the child menu only lists
brothers and sisters who happen to be in child view. A parent thinks of it the
other way round: "this phone is in the kids' hands now". One switch should put
the whole app into child mode on this phone, and back.

## Behaviour

- **One mode for the whole app, per phone.** `VIEW_MODE.child` or
  `VIEW_MODE.parent`, kept in a cookie the way the current account is
  (`CURRENT_ACCOUNT_COOKIE`: the cookie is the only copy, the server reads it).
  It survives a reload and closing the browser. Nothing is saved on any
  account. A new phone, or one whose cookies were cleared, starts in parent
  mode.
- **The phone, not the parent.** The cookie belongs to the browser, so signing
  out and signing in as another parent keeps the mode. Child mode is a screen
  choice, not a lock: the server enforces nothing on it, as today.
- **Child mode needs a current account.** With no account (the empty state,
  or the last one removed), the app shows the parent menu and screen whatever
  the cookie says, so a parent is never stuck in a child menu with nothing in it.
  The cookie is left as it is, so a first account created on a phone whose
  cookie says child (a session that expired in child mode) opens in child mode.
  Accepted: the switch is one tap away.
- **One switch, «מצב הורה/ילד».** Off is parent mode, on is child mode. The
  knob carries 👵🏼 in parent mode and 🧒🏼 in child mode. The same switch is used
  in both menus.
- **Parent menu.** As on `main`, except:
  - the «מצב ילד» row under the account picker is gone; the picker only picks
    a child;
  - a new **«⚙️ הגדרות כלליות»** section, under «הגדרות של …», in the same
    style (dashed frame, heading, note «לכל הילדים, במכשיר הזה.»), holds the
    switch, off. Like «הגדרות של …», it is shown only when there is an account.
- **Child menu.** As on `main`, except:
  - **«להחליף ל…» lists every other child**, not only those in child view;
    each opens in child mode;
  - the bottom «מצב הורה» switch is replaced by the same «מצב הורה/ילד»
    switch, on, as a card the size of «הכסף שלי» and «מראה».
- **Turning the switch.** The knob slides, the menu closes, and once it has
  faded the screen behind changes (as the switch does today, because each
  screen renders its own `Header`, which owns the menu). No request is sent,
  so there is no loader, no lock and no save error.
- **Every page, and the back button.** In child mode the menu is always the
  child menu and Home is always the child screen, whichever account is current,
  including after the browser's back or forward button. `/transactions` and
  `/method` keep today's behaviour: the page itself is unchanged.

## How it works today (read first)

- **Saved:** column `accounts.view_mode` (`src/db/schema.sql:13`), `Account.viewMode`,
  `DataStore.setAccountViewMode` (memory, json-file, postgres stores),
  `PUT /api/accounts/[id]/view-mode`, `API_ERRORS.invalidViewModeRequest` and
  `unknownViewMode` (`src/app/api/constants.ts`).
- **Read:** `isShownToChild(account)` in `src/lib/account/view-mode.ts`, used by
  `ShownAccount` (child or parent screen), `MenuContent` (child or parent menu)
  and `ChildMenuContent` (the sibling filter).
- **Changed:** `ViewModeSwitch` + `use-account-view-mode.ts` (save, loader,
  error, close, `viewModeChoice.showViewMode`, refresh). `useShownViewMode`
  keeps an in-memory override because the saved value arrives with the next
  refresh.
- **Cookies:** `src/lib/cookies.ts` (`writeCookie`, `THEME_COOKIE`,
  `CURRENT_ACCOUNT_COOKIE`); the server reads them in
  `src/app/signed-in-accounts.ts`, which all three pages call. The theme cookie
  is only a first-paint copy; the theme itself is saved on the account. There
  is **no client-side cookie reader**: the only client read is the regex inside
  the inline first-paint script (`src/theme/theme-at-first-paint.ts`).
- **Contexts:** `signed-in-user-context.tsx` and `accounts-context.ts` in
  `src/components/Home/`, built with `createRequiredContext`. Each page mounts
  its own providers inside `ThemedPage`; the root layout reads no cookie.
- **Back and forward reuse the page.** Next 16 serves a page from the client
  cache on the browser's back and forward buttons
  (`node_modules/next/dist/docs/01-app/04-glossary.md`, "Client Cache"), and
  `router.refresh()` clears only the current route. A provider seeded once
  from the server's value would show the mode the page had when it was left.
  `cacheComponents` is off here, so a restored page remounts its client
  components; if it is turned on, Next keeps pages hidden in `<Activity>`
  instead. `useSyncExternalStore` re-reads its snapshot in both cases.
- **The browser's own back-forward cache** can restore a whole document,
  JS heap included, after a full page load (iOS Safari does this readily).
  Nothing remounts and no React code runs, so only a `pageshow` or
  `visibilitychange` listener sees it.
- **Tests:** `src/test-utils/render.tsx` wraps every component test in the app
  providers. RTL's `render` is a client render, so `useSyncExternalStore`
  calls `getSnapshot` (the cookie), never `getServerSnapshot`. jsdom keeps
  `document.cookie` across the tests of a file, and `captureCookies`
  (`src/test-utils/cookies.ts`) keeps only the **last** cookie written: a
  `THEME_COOKIE` write from `SignedInUserProvider` would wipe a view-mode
  cookie. The e2e driver is `useDriver(initialStore, motion)`: the first
  argument is the store's contents, which a cookie is not, and one suite
  passes `motion`. `app-browser.ts` sets the session cookie.
- **Migrations are manual, one script per Neon branch:** `db:migrate-test`
  (`TEST_DATABASE_URL`), `db:migrate-dev` (`DEV_DATABASE_URL`) and
  `db:migrate`, which is **production** (`DATABASE_URL`).

## PR 1 — the mode belongs to the phone

> **Merged** as #193 (`c5c3542`). Where the build differs from the text below:
> - The context is `view-mode-context.ts` (no JSX in it), not `.tsx`.
> - The switch's hook is `use-view-mode-switch.ts`: `useViewModeSwitch()` returns
>   `{ shownViewMode, isSwitching, switchViewMode }`.
> - The header loader stayed: the hook still reports `isSwitching` through
>   `useReportPendingNavigation`, and the switch is `disabled` while it is true.
>   That already ignores a second tap until the mode has changed, which PR 2's
>   flipping switch needs.

The behaviour change, with the switches where they are today.

- `VIEW_MODE_COOKIE` (`'viewMode'`) and `readCookie(name): string | undefined`
  beside `writeCookie` in `src/lib/cookies.ts` (`undefined` without a
  `document`, like `writeCookie`). `signedInAccounts()` reads the cookie and
  returns `viewMode` (parent when missing or unknown, via `resolveViewMode`).
- **`src/components/Home/view-mode-context.tsx`**, next to its siblings:
  `ViewModeProvider` and `useViewMode(): { viewMode, chooseViewMode }`.
  - The cookie is the one source. The provider reads it with
    `useSyncExternalStore`: the snapshot is `resolveViewMode(readCookie(…))`,
    the server snapshot is the server's `viewMode`. So the first paint matches
    the server, and a page restored by back or forward reads the cookie again
    instead of its stale seed. There is no module-level copy of the value, so
    nothing can drift from the cookie or leak between tests.
  - `subscribe` is one module-level function (a new one per render would
    resubscribe every render). It listens to `chooseViewMode`'s notifications
    and to `pageshow` and `visibilitychange`, so a document restored by the
    browser's back-forward cache, or another tab on the phone when it is
    shown again, re-reads the cookie.
  - `chooseViewMode` writes the cookie and notifies the subscribers. No
    request, no `router.refresh()`. It is a module-level write, not component
    state, so calling it after the menu has unmounted is safe.
  - It hands out the cookie's mode as is. The no-account rule (see Behaviour)
    stays in the consumers, which already need an account: `MenuContent`
    already falls back to the parent menu without one, and `ShownAccount` is
    rendered only with one.
  - The three pages wrap their content in it next to `SignedInUserProvider`.
- `ShownAccount`, `MenuContent` and `ChildMenuContent` read `useViewMode()`
  instead of the account. The sibling filter becomes "every other account".
- `ViewModeSwitch` keeps today's sequence (the knob slides, the menu closes,
  it waits for the fade) and then calls `chooseViewMode` instead of saving.
  The knob must slide **before** the mode changes, so the switch keeps its own
  chosen mode for that moment: `isOn` is `(chosenViewMode ??
  useViewMode().viewMode) === viewMode`. The sequence stays in the switch's
  hook, which loses the request, the error and the pending report and is
  renamed from `use-account-view-mode.ts`, since the mode is no longer the
  account's (name checked against the glossary at step 7). `useShownViewMode`,
  `ViewModeChoice`/`viewModeChoice` in `accounts-context.ts`, the switch's
  save error and loader (`useReportPendingNavigation`),
  `Home.switching-view.test.tsx` and `ViewModeSwitch.saving.test.tsx` go
  away.
- The switch's note stops naming the account («מסך פשוט ל{name}») because the
  mode is no longer that account's: it becomes «לכל הילדים, במכשיר הזה.» until
  PR 2 moves it into the section heading.
- `render()` in `src/test-utils/render.tsx` always wraps in
  `ViewModeProvider`, with a `viewMode` option (parent by default), the way it
  does `AppThemeProvider`. A client render reads the cookie, not the
  provider's server value, so `render()` **writes `VIEW_MODE_COOKIE`** on
  every call as well. That also resets a mode an earlier test chose.
  `captureCookies` keeps its jar by cookie name, so a theme write no longer
  wipes the view mode.
- The e2e driver becomes `useDriver(initialStore, { motion, viewMode })`. The
  one suite that passes `motion` moves to the option. `AppBrowser.open` takes
  a list of cookies and sets `VIEW_MODE_COOKIE` beside the session cookie.
  `appBrowser.back()` waits for the screen through the driver, not for
  `networkidle0`, because a client-side back loads no document.
- Glossary, now that the meaning changes: the `ViewMode` row reads "the
  phone's mode" and names `VIEW_MODE_COOKIE` and `useViewMode`. `view_mode`
  and `isShownToChild` stay listed until PR 3 deletes them.
- Screenshots in the PR (`pr-screenshots`): the child menu now lists every
  sibling, and the switch's note changes.
- Per-account storage stays in place, unused by the UI, until PR 3. An
  already-open tab running the old code can still save through
  `PUT /view-mode` without an error.

Tests (each watched failing against its own break):
- `readCookie` finds a cookie among several, and returns `undefined` for a
  missing one.
- `signedInAccounts` returns `child` for a `child` cookie, and `parent` for a
  missing or unknown one.
- Provider: the server render (`renderToString`, the only render that calls
  `getServerSnapshot`) uses the server's mode; a client render with a stale
  server value (`parent`) and a `child` cookie shows `child` (break: seed
  `useState` from the server value); `chooseViewMode` writes
  `VIEW_MODE_COOKIE`; a second consumer in the same tree re-renders after it
  (break: no notify); a cookie changed elsewhere shows after
  `visibilitychange` (break: drop the listener).
- `ShownAccount` and `MenuContent` follow the mode, not the account, in both
  directions: an account saved as `child` in parent mode shows the parent
  screen and menu, and an account saved as `parent` in child mode shows the
  child ones. The `parent` default fixture alone would pass against a
  component that still reads the account.
- `MenuContent` in child mode with no account shows the parent menu.
- `ChildMenuContent` lists a sibling whose account says `parent`.
- `Home` in child mode shows the child screen for every account it switches to.
- `ViewModeSwitch`: the knob is on as soon as it is tapped, while the mode has
  not changed yet; the mode changes only after the fade.
- e2e (`child-view.e2e.ts`). Every suite moves from `viewMode` on the account
  to the cookie, and the account-based ones flip:
  - "an account stored in child view opens on the child screen" becomes
    "opens in parent mode" (Decided: no seeding);
  - "offers only the sibling who is also in child view" becomes "offers every
    sibling";
  - "…after a reload, with no cookie to remember it" becomes "stays in child
    mode after a reload";
  - `/method` and `/transactions` still show the child menu;
  - back: open `/method` **through the menu's navigation tabs** (a `visit()`
    is a full load and would pass against a seeded provider), turn child mode
    on there, press back, and Home is the child screen. Watched failing
    against the `useState` seed.

## PR 2 — «הגדרות כלליות» and the one switch

The menu from the mockup.

- **Switch:** «מצב הורה/ילד», a 64×36 track whose knob carries 👵🏼 or 🧒🏼
  (`aria-checked` = child mode; the label stays in the accessible name, the
  knob's emoji is `aria-hidden`). One component, no `viewMode` prop: it shows
  the current mode and flips it. Because it flips, a second tap during the
  slide and fade would flip it back, so taps are ignored from the first tap
  until the mode has changed. With PR 1's fixed target, a second tap only
  repeated the same choice.
- **Parent menu:** a new `MenuGlobalSettings` section under
  `MenuAccountSettings`, built on `SettingsBlock` with the same dashed frame,
  heading «⚙️ הגדרות כלליות» and note «לכל הילדים, במכשיר הזה.», shown under
  the same `hasAccount` condition. It holds the switch. `AccountControls`
  drops `ChildViewSetting`. The dashed frame, `Head` and `Note` now have two
  users, so they move from `MenuAccountSettings.styles.ts` to
  `settings-parts.ts` (rule 4a).
- **Child menu:** the switch in a `ChildMenuCard` at the bottom, the size of
  «הכסף שלי»; `ParentCorner` goes.
- **Glossary:** a row for «הגדרות כלליות» → `MenuGlobalSettings`, beside
  `MenuAccountSettings` and `MenuUserSettings`.

Tests: the switch shows the right face and `aria-checked` in each mode and
flips the mode; a double tap flips it once; the parent menu has the section under the account settings,
no section without an account, and no switch under the picker; the child
menu's last card is the switch. Visual: parent menu and child menu at phone
size, in a non-default theme too. Screenshots in the PR (`pr-screenshots`).

## PR 3 — accounts stop carrying a view mode

Cleanup once PR 1 is deployed to production.

- Delete `PUT /api/accounts/[id]/view-mode` and its tests,
  `API_ERRORS.invalidViewModeRequest`/`unknownViewMode`,
  `setAccountViewMode`/`setViewMode` in every store, `RepositoryStore` and
  `DataStore`,
  `Account.viewMode`, the row mapping (`rows.ts`), `viewMode` in
  `createAccount`, in the mocks and in the e2e fixtures. `isShownToChild`
  goes; `VIEW_MODE`, `ViewMode`, `isViewMode` and `resolveViewMode` stay for
  the cookie.
- The postgres INSERT stops naming `view_mode` (the column keeps its default,
  so the code runs against both the old and the new schema).
- Glossary: the `ViewMode` row drops `view_mode` and `isShownToChild` (its
  meaning changed in PR 1). `childView` stays under "Not".

## PR 4 — drop the column (after PR 3 is deployed to production)

In `schema.sql`, the `ADD COLUMN IF NOT EXISTS view_mode …` lines are
**replaced** by `ALTER TABLE accounts DROP COLUMN IF EXISTS view_mode;` (its
`CHECK` goes with it). Leaving the `ADD` would re-create the column on every
replay. Run `npm run db:migrate-test`, then `npm run db:migrate-dev`, then
`npm run db:migrate`, which is **production** (confirm which branch
`DATABASE_URL` points at first). Separate so no deployed
code still writes the column when it disappears. After it runs, a Vercel
rollback to a deployment older than PR 3 can no longer create accounts.

## Decided (2026-10-05)

- Accounts saved in child view on production open in parent mode once PR 1
  ships; no cookie seeding.
- The section component is `MenuGlobalSettings` (glossary row in PR 2).
- #191 is closed as superseded.
- `/transactions` and `/method` keep today's behaviour in child mode: the page
  is the parent page and the menu is the child menu. Children aren't meant to
  reach them, and it is fine if they do. What must hold: **in child mode the
  menu and Home always render the child version.**

## Out of scope

- Another tab that stays in view while the mode changes (a split screen)
  keeps its old mode until it is hidden and shown again. A tab picks up the
  mode on `visibilitychange`, and nothing listens for cookie changes as they
  happen.
- The current account has the same back-button staleness
  (`CURRENT_ACCOUNT_COOKIE` seeds `useAccountNavigation` once); a separate fix.
