# The child menu switches between children

> Status: **PR 1 built 2026-10-04** on `feat/child-account-switcher` (#183).
> The list holds the other accounts **in child view**; the rest are reached
> through the parent view (decided 2026-10-04, after a round that listed
> everyone). Mockups: `mockups/child-account-switcher.html` (row
> layout, option **C**) and `mockups/child-mode-in-menu.html` (where the
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

## As built (PR 1)

| Name | Where | What |
| --- | --- | --- |
| `otherAccounts(accounts, currentAccount)` | `src/lib/account/current-account.ts` | every account but the current one, in order; next to `findCurrentAccount` |
| `otherAccountsShownToChild(accounts, currentAccount)` | `src/lib/account/view-mode.ts` | `otherAccounts` kept to those `isShownToChild` |
| `useOpenAccount()` | `src/components/Menu/use-open-account.ts` | `switchAccount` then `closeMenu`; both pickers use it |
| `ChildMenuAccountList` (`accounts`, `onSelect`) | `src/components/Menu/ChildMenuAccountList/` | the card's section and rows; a `styled(Row)` per account |
| `childMenuRow` | `src/components/Menu/row-parts.ts` | the row geometry the top card and the rows share |
| `createMockAccountsContext`, `createMockChildAccountsContext` | `src/test-utils/mocks/account.mocks.ts` | context builders, so tests stop spreading contexts inline |

`CHILD_MENU_AVATAR_PROPS.size` is 40, read by the top card and the rows.

The e2e harness now clears the browser's cookies on every `open`. One browser
serves a whole `describe`, so a current-account cookie set by one test used to
open the next test on a different account.

**Tests:** `otherAccounts` (leaves out the current account, keeps the order),
`otherAccountsShownToChild` (leaves out an account in parent view),
`ChildMenuAccountList` (names in order, a tap selects that row's account, the
face is left out of the row's name), `ChildMenuContent` (only the sibling in
child view is listed, a tap switches and closes the menu, an only child gets
no card) and `e2e/child-view.e2e.ts` (opens on the child whose name sorts
first, offers only the sibling in child view, whose child screen survives a
reload). Every test was
watched failing against its own break.

**Known, not ours:** `e2e/menu-morph.visual.ts` fails 2 tests ("reaches down
over the per-account block", "takes a tap meant for…") on `main` itself, so
`npm run test:e2e` stops before the browser suites.

## Next: PR 2 — a child-view toggle on each account row (mockup A)

- Each row of the parent account list gets a toggle that saves that account's
  view mode, as `ViewModeSwitch` does today for the current account.
- The child-view setting under the picker goes away. Today it shows through
  the open account list (a stacking bug), so removing it fixes that too.
- A header line at the top of the list labels the toggle column (`🧒 מצב ילד`).
- The closed picker button says `🧒 מצב ילד` instead of `מוצג כרגע` when the
  current account is in child view.

## Then: PR 3 — view in parent mode, without saving

- The child menu's bottom `מצב הורה` switch becomes a small
  `👤 לצפות במצב הורה` button. It changes no account's saved view.
- The temporary parent view lives **in memory only**: a reload, switching
  accounts, or turning that account's toggle off ends it.
- While a child-view account is shown this way, the parent menu shows a
  `צפייה זמנית במצב הורה · חזרה למצב ילד` banner. It shows only then.
