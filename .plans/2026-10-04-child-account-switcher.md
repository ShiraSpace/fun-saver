# The child menu switches between children

> Status: **PR 1 merged** as #183 (`7afb741`, 2026-10-04). **PR 2 and PR 3
> are next**, specified below; each starts from a fresh branch off `main`.
> The list holds the other accounts **in child view**; the rest are reached
> through the parent view (decided 2026-10-04, after a round that listed
> everyone). Mockups: `mockups/child-account-switcher.html` (row layout,
> option **C**) and `mockups/child-mode-in-menu.html` (where the child-view
> toggle lives, option **A**). Builds on child mode
> (`.plans/2026-10-03-child-mode.md`, merged).

## Why

On a shared phone, a child in child view can't get to a brother's or sister's
screen. Today a parent has to turn child view off, open the account picker and
pick the sibling. Turning child view off is saved on the account, so the first
child is left in parent view until a parent turns it back on. The child menu
gets a simple "switch to…" list under «הכסף שלי».

## Behaviour

- Under «הכסף שלי», a card titled `🔁 להחליף ל…` lists **the other
  accounts that are also in child view**, in the same order as the parent account
  picker (by name: every store returns `sortedByName`), leaving out the
  current one. Each row shows a face, a name and a `‹`. It shows no money.
- **Tapping a row** opens that account the same way the parent picker does:
  `switchAccount(id)`, then `closeMenu()`. The theme and the current-account
  cookie follow, because `switchAccount` already handles both. Nothing is
  saved: tapping never changes any account's view mode.
- **No other account in child view → no card.** A sibling in parent view is
  reached through the parent view: today the «מצב הורה» switch, after PR 3
  the «לצפות במצב הורה» button.
- **Same size as the top card.** The top child card shrinks from an 84px
  centred avatar to a row, so it matches the switcher rows. Both are 56px high,
  with a 40px face and the name in `theme.typography.heading`. Measured in the
  app: 5 children fit at 402×874; at 360×760 the menu scrolls and the bottom
  switch is cut off (`MenuOverlay` already has `overflow-y: auto`).
- **Where it shows.** The child menu shows on Home, `/transactions` and
  `/method`, and all three already provide `switchAccount` through
  `AccountsProvider`. On Home, the screen changes to the sibling's. On
  `/transactions` and `/method`, the page stays and shows the sibling's
  account, as it does after the parent picker.
- **The list comes from the last server render**, like the parent picker's.
  A view mode changed on another phone shows on the next page load.

## PR 1 — on `main` (#183)

| Name | Where | What |
| --- | --- | --- |
| `siblingAccounts` | `ChildMenuContent.tsx` | `accounts` kept to the other accounts that `isShownToChild`, filtered inline |
| `ChildMenuAccountList` (`siblingAccounts`, `onSelect`) | `src/components/Menu/ChildMenuAccountList/` | the `🔁 להחליף ל…` card; returns `null` when the list is empty |
| `ChildMenuAccountRow` (`siblingAccount`, `onSelect`) | same folder | one row: 40px `AvatarBadge` (`alt=""`), the name, an `aria-hidden` `‹` |
| `ChildMenuCard` | `src/components/Menu/child-menu-parts.ts` | the child menu's white card, shared by the list and the appearance card |
| `childMenuRow` | `src/components/Menu/row-parts.ts` | the 56px row geometry the top card and the rows share |
| `CHILD_MENU_AVATAR_PROPS` (`size: 40`) | `src/components/Menu/constants.ts` | read by the top card and the rows |
| `useOpenAccount()` | `src/components/Menu/use-open-account.ts` | `switchAccount` then `closeMenu`; both pickers use it |
| `createMockAccountsContext`, `createMockChildAccountsContext` | `src/test-utils/mocks/account.mocks.ts` | context builders; tests no longer spread contexts inline |
| `sibling`, `siblings` | `docs/glossary.md` | another child's account in the family |

The e2e harness clears the browser's cookies on every `open`
(`e2e/driver/app-browser.ts`). One browser serves a whole `describe`, so a
current-account cookie set by one test used to open the next test on another
account. `MenuDriver` has `childMenuAccountNames()` and
`switchAccountFromChildMenu(index)`.

**Known, not ours:** `e2e/menu-morph.visual.ts` fails 2 tests ("reaches down
over the per-account block", "takes a tap meant for…") on `main` itself, so
`npm run test:e2e` stops before the browser suites. Run
`npx tsx --test e2e/*.e2e.ts` after a `next build` to reach them.

## How the view mode works today (read before PR 2 and PR 3)

- **Saved:** `PUT /api/accounts/[id]/view-mode`
  (`src/app/api/accounts/[id]/view-mode/route.ts`).
  `useAccountViewMode()` in `src/components/Menu/ViewModeSwitch/` sends it
  **for `currentAccount` only**, then closes the menu, calls
  `viewModeChoice.showViewMode(viewMode)` and `router.refresh()`.
- **Shown:** `useShownViewMode(currentAccount)` in
  `src/components/Home/use-shown-view-mode.ts` holds an **in-memory** override
  `{ viewMode, chosenOn }`. It applies only while `chosenOn` is the same
  `currentAccount` object, so switching accounts, `router.refresh()` and a
  reload all drop it. Only **Home** uses it: it puts the shown account in
  `AccountsProvider` as `currentAccount` and keeps the saved list in
  `accounts`. `/transactions` and `/method` have no `viewModeChoice`.
- **Which menu:** `MenuContent` shows `ChildMenuContent` when
  `isShownToChild(currentAccount)`; `ShownAccount` picks the screen the same
  way. So in the **parent** menu the current account is always shown in
  parent view.
- **Where the switch sits:** `AccountControls` renders
  `<ViewModeSwitch viewMode={VIEW_MODE.child} />` in `ChildViewSetting` under
  the picker (it shows through the open list: the stacking bug).
  `ChildMenuContent` renders `<ViewModeSwitch viewMode={VIEW_MODE.parent} />`
  in `ParentCorner`.

## PR 2 — a child-view toggle on each account row (mockup A)

**Behaviour**

- Each row of the parent account list (`AccountList` → `AccountRow`) gets a
  `🧒` switch showing that account's **saved** view mode. Tapping it saves
  that account's view mode.
- Toggling the **current** account on behaves as the switch does today: the
  menu closes and the child screen shows.
- Toggling **another** account saves it and refreshes; the menu and the list
  stay open, and that row's switch shows the new state.
- A header line at the top of the list labels the switch column
  (`🧒 מצב ילד`), as in the mockup.
- The child-view setting under the picker (`ChildViewSetting`) is removed,
  which also ends the stacking bug.
- A failed save shows `VIEW_MODE_SWITCH_COPY.saveError` under that row and
  puts its switch back.

**Code (proposals; re-check names against the glossary)**

- `useAccountViewMode(account: AccountSummary)` takes the account it saves,
  instead of reading `currentAccount`. The close-menu-and-show steps run only
  when `account.id === currentAccount.id`; otherwise it only refreshes.
- `AccountRow` stops being one `<button>`: a switch can't sit inside a
  button. It becomes a row holding the pick button (avatar, name, total; keeps
  `ACCOUNT_LIST_TEST_IDS.row` and `aria-current`) and a switch button
  (`role="switch"`, `aria-checked`, `aria-label` with the account's name, its
  own test id). Check `Row` in `row-parts.ts`: `AddButton` shares its private
  `row` string, so the split must not change the add button.
- The switch: either a `compact` use of `ViewModeSwitch` given the account, or
  a small `AccountViewModeSwitch` beside `AccountRow`. Pick whichever keeps
  `ViewModeSwitch` under 200 lines and its saving tests intact.
- `AccountControls` drops `ChildViewSetting` and its `.styles.ts` if empty.
- `MenuDriver.tapViewModeSwitch()` is used by `e2e/child-view.e2e.ts` for the
  parent's switch; add `tapChildViewToggle(index)` for the list and keep
  `tapViewModeSwitch()` for the child menu's parent switch.

**Tests (first three, then the rest; each watched failing against its break)**

1. `AccountRow`: the switch is on for an account saved in child view and off
   for one in parent view (fixtures with **both**; break: always off).
2. `AccountRow`/`AccountList`: tapping a row's switch saves **that** account
   (`fetch` URL has its id; break: use `currentAccount.id`).
3. `AccountRow`: tapping the name still selects the account and does not
   toggle (break: wire the switch's handler to the pick button).
4. `AccountControls`: no child-view setting under the picker (break: render it).
5. Toggling another account keeps the menu open (break: always `closeMenu`).
6. A failed save shows the error under that row (break: drop the error).
7. e2e: a parent turns child view on for a sibling from the list, opens that
   sibling, and sees the child screen; the existing "a parent turns child view
   on" flow uses the current account's row.

**Open questions for the user before coding**

- When toggling another account, should the list stay open (the mockup's
  behaviour) or close like today?
- Saving while another row is still saving: allow, or disable all switches?

## PR 3 — view in parent mode, without saving

**Behaviour**

- The child menu's bottom `מצב הורה` switch becomes a small
  `👤 לצפות במצב הורה` button. It saves nothing.
- It shows the parent screen and the parent menu for that account **in memory
  only**: a reload, switching accounts, or saving that account's view mode
  (PR 2's toggle) ends it. This is exactly what `useShownViewMode` already
  does with `viewModeChoice.showViewMode(VIEW_MODE.parent)`.
- While the current account is **saved** in child view but **shown** in
  parent view, the parent menu shows a
  `👤 צפייה זמנית במצב הורה · חזרה למצב ילד` banner above the tabs. Tapping
  `חזרה למצב ילד` calls `showViewMode(VIEW_MODE.child)` and closes the menu.
  The banner shows only then.
- In that same state the picker's button reads `🧒 מצב ילד` instead of
  `מוצג כרגע` (from mockup A; it can't appear in PR 2, because the parent menu
  never shows a child-view account there).

**Code (proposals; re-check names against the glossary)**

- The saved view of the current account is
  `findCurrentAccount(accounts, currentAccount.id)`'s `viewMode`, because
  `accounts` keeps the saved list while `currentAccount` is the shown one. A
  small lib helper (`isShownAsParentForNow`?) or a hook next to
  `use-shown-view-mode.ts` can answer "saved child, shown parent".
- `ParentCorner` renders the new button instead of `ViewModeSwitch`; the
  parent-view use of `ViewModeSwitch` goes away, so its `isCompact` branch and
  copy may too.
- The banner is a new component in `src/components/Menu/`, rendered at the top
  of `MenuContent`'s parent branch.

**Open question for the user before coding**

- `/transactions` and `/method` have no `viewModeChoice`, so the button can't
  switch the view there. Either lift `useShownViewMode` into a provider all
  three pages share, or have the button go to Home in parent view. The first
  is the honest fix; check the size of that change first.

**Tests (first three, then the rest)**

1. `ChildMenuContent`: tapping the button shows the parent view without a
   `fetch` (break: call `chooseViewMode`, which saves).
2. Banner: shown when the saved view is child and the shown view is parent
   (break: show it always; also test it is hidden for an account saved in
   parent view).
3. Banner: `חזרה למצב ילד` shows the child view again and closes the menu.
4. The picker's button reads `🧒 מצב ילד` during the temporary view.
5. e2e: a child taps `לצפות במצב הורה` → parent screen; reload → child
   screen again (proves nothing was saved).
