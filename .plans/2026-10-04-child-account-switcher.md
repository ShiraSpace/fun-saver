# The child menu switches between children

> Status: **PR 1 merged** as #183 (`7afb741`). **PR 2 built** on
> `feat/child-view-toggle-per-account` (the per-row child-view toggle).
> **PR 3 is next**, specified below, from a fresh branch off `main` once PR 2
> merges. The list holds the other accounts **in child view**; the rest are
> reached through the parent view. Mockups: `mockups/child-account-switcher.html`
> (row layout, option **C**) and `mockups/child-mode-in-menu.html` (where the
> child-view toggle lives, option **A**). Builds on child mode
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
| `siblingAccount`, `siblingAccounts` | `docs/glossary.md` | another child's account in the family; a bare `sibling` is banned |

The e2e harness clears the browser's cookies on every `open`
(`e2e/driver/app-browser.ts`). One browser serves a whole `describe`, so a
current-account cookie set by one test used to open the next test on another
account. `MenuDriver` has `childMenuAccountNames()` and
`switchAccountFromChildMenu(index)`.

## How the view mode works after PR 2 (read before PR 3)

- **Saved:** `PUT /api/accounts/[id]/view-mode`.
  `useAccountViewMode(account, shown)` in `src/components/Menu/ViewModeSwitch/`
  saves **the account it is given**. `shown` is `SAVED_VIEW_MODE_SHOWN`:
  `immediately` (the child menu's `מצב הורה` switch: close the menu, show the
  view, refresh) or `whenMenuCloses` (the list's rows: refresh at once so the
  list shows saved data; for the current account, keep the shown view until
  the menu closes, then show the saved one).
- **Shown:** `useShownViewMode(currentAccount)` (Home only) holds an
  in-memory choice. `showViewMode` is tied to the account **object**, so a
  refresh, switching accounts or a reload drops it.
  `keepViewModeUntilMenuCloses` is tied to the account **id**, so it survives
  the refresh after a save; the next `showViewMode` replaces it.
  `/transactions` and `/method` have no `viewModeChoice`: there the current
  account's toggle turns the open menu into the child menu at once.
- **Why the screen waits for the menu:** each screen (`Account`,
  `ChildAccount`) renders its own `Header`, which owns the menu state, so
  swapping the screen under an open menu would drop the menu.
- **Menu state:** `whenMenuCloses(step)` (`use-menu-state.ts`) runs a step once
  the menu closes, or at once if it is already closed.
- **Where the switches sit:** each row of `AccountList` has a `ChildViewToggle`
  under a `חשבון · 🧒 מצב ילד` header; `ChildViewSetting` under the picker is
  gone. `ChildMenuContent` still renders `<ViewModeSwitch viewMode={VIEW_MODE.parent} />`
  in `ParentCorner`.

## PR 2 — a child-view toggle on each account row (built)

Decisions (2026-10-04): toggling **another** account keeps the list open; rows
save independently (each locks only its own switch); toggling the **current**
account saves and keeps the menu open, and its child screen shows **when the
menu closes**. `ChildViewToggle` is the name (glossary updated).

| Name | Where | What |
| --- | --- | --- |
| `ChildViewToggle` | `Menu/AccountList/` | the row's `role="switch"`, labelled `מצב ילד ל{name}` |
| `AccountPickButton` | `Menu/AccountList/` | avatar, name, total; keeps the `row` test id and `aria-current` |
| `ViewModeSaveError` | `Menu/ViewModeSwitch/` | the save error, shared by both switches |
| `Track` | `Menu/switch-parts.ts` | the switch track, shared by both switches |
| `SAVED_VIEW_MODE_SHOWN` | `ViewModeSwitch/constants.ts` | when a saved view mode is shown |
| `keepViewModeUntilMenuCloses` | `ViewModeChoice` | the id-tied choice above |
| `whenMenuCloses` | `MenuState` | the step queue above |
| `tapChildViewToggle`, `waitForChildViewSaved`, `close` | `MenuDriver` | e2e |

Also in PR 2: the child menu's section titles use `typography.heading` through
`--menu-section-title-size` set on `ChildMenuCard`; the switcher's arrow is a
CSS chevron drawn with `border-inline-end`, because `stylis-plugin-rtl` flips
physical left and right (and a lone `‹`/`›` did not render reliably).

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
