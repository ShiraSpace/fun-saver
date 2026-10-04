# The child menu switches between children

> Status: **planned 2026-10-04**, reviewed against `origin/main` at `6db66d7`
> the same day, not started. Mockup: `mockups/child-account-switcher.html`,
> option **C** (chosen). Builds on child mode
> (`.plans/2026-10-03-child-mode.md`, merged).

## Why

On a shared phone, a child in child view can't get to a brother's or sister's
screen. Today it takes four steps: turn child view off (which saves it on the
account), open the account picker, pick the sibling, and turn child view on
again for them. The child menu gets a simple "switch to…" list under
«הכסף שלי».

## Behaviour

- Under «הכסף שלי», a card titled `🔁 להחליף ל…` lists **the other accounts
  that are also in child view**, in the same order as the parent account
  picker, leaving out the current one. Each row shows a face, a name and a `‹`.
  It shows no money.
- **Tapping a row** opens that account the same way the parent picker does:
  `switchAccount(id)`, then `closeMenu()`. The theme and the current-account
  cookie follow, because `switchAccount` already handles both. Nothing is
  saved: tapping never changes any account's view mode.
- **No other account in child view → no card.** An account in parent view is
  never listed. Child view is not a lock (the child menu already has a one-tap
  way back to the parent screen), so this isn't about security: tapping a
  name in a "switch to…" list should never also take the child out of child
  view. A parent who wants a child listed turns child view on for that child.
- **Same size as the top card.** The top child card shrinks from an 84px
  centred avatar to a row, so it matches the switcher rows. Both are 56px high,
  with a 40px face and the name in `theme.typography.heading`. The menu fits a
  360×760 screen with up to 5 children (measured in the mockup). With 6 or
  more, the menu scrolls: `MenuOverlay` already has `overflow-y: auto`.
- **Where it shows.** The child menu shows on Home, `/transactions` and
  `/method`, and all three already provide `switchAccount` through
  `AccountsProvider`. On Home, the child screen changes to the sibling. On
  `/transactions` and `/method`, the page stays and shows the sibling's
  account, as it does after the parent picker.
- **The list comes from the last server render**, like the parent picker's.
  If a parent changes a sibling's view mode on another phone, this list
  catches up on the next page load. Nothing is cached beyond that.

## Reused, not new

- `switchAccount` from `useAccounts()` and `closeMenu` from `useMenu()`,
  through one shared `useOpenAccount()` (see Phase 2). Both pickers then open
  an account the same way and can't drift apart.
- `isShownToChild` from `src/lib/account/view-mode.ts`.
- The child menu's own card: `Item` in `ChildMenuContent.styles.ts`, holding a
  `<section>` with `MenuSectionTitle`, as `AppearanceSection` does in the card
  below it.
- `Row` from `src/components/Menu/row-parts.ts` for each row, which is the
  parent picker's row button. It brings the button reset, the press feedback
  and `text-align: start`. `styled(Row)` changes only the size, the font and
  the fill.
- `AvatarBadge`, as the top card uses it.
- Row colours: `theme.colors.accountScopeBg` for the fill, `textStrong` for the
  name, `primary` for the `‹`.

## Names (proposals — re-check against the glossary when implementing)

| New | Where | Why this name |
| --- | --- | --- |
| `otherAccountsShownToChild(accounts, currentAccount)` | `src/lib/account/view-mode.ts` | sits next to `isShownToChild`; the glossary rejects `childView` |
| `useOpenAccount()` | `src/components/Menu/use-open-account.ts` | named after `AccountControls.openAccount`, which it replaces; it sits next to `use-menu-state.ts` |
| `ChildMenuAccountList` (`accounts`, `onSelect`) | `src/components/Menu/ChildMenuAccountList/` | it is the child menu's `AccountList`, with the same props. `ChildAccountSwitcher` would read as part of `ChildAccount`, the child screen |
| `CHILD_MENU_ACCOUNT_LIST_COPY` (`icon`, `title`, `arrow`) and `CHILD_MENU_ACCOUNT_LIST_TEST_IDS` (`list`, `row`) | its `constants.ts` | mirrors `ACCOUNT_LIST_TEST_IDS.{list,row}` |

`CHILD_MENU_AVATAR_PROPS.size` changes from 84 to 40. The list rows read the
same constant, so the top card and the rows can't drift apart. Two modules
read it, so it stays in `constants.ts`.

## Global constraints

- Workflow from `CLAUDE.md`: production code → STOP → commit on "commit" →
  the first ≤3 tests → STOP → the rest → "commit tests". Watch every test fail
  against its own deliberate break (`cp` the file aside, break it, run, restore,
  `cmp`).
- No comments, single quotes, named exports, explicit return types, ≤200 lines
  per file and ≤40 per function. Styles go in `.styles.ts` with single-use px
  inline. Copy and test IDs go in `constants.ts`.
- **Any test that checks the list must have a sibling in parent view among
  its fixtures**, or it passes against a component that lists everyone.
- Start from a fresh worktree off `origin/main`. Run a real `npm install`
  (`next build` rejects a symlinked `node_modules`) and copy `.env.local` from
  `../fun-saver/.env.local`.

## Phase 1 — the rule in lib

**Code:** `otherAccountsShownToChild<Shown extends Pick<Account, 'id' |
'viewMode'>>(accounts: Shown[], currentAccount: Shown): Shown[]` keeps the
accounts where `isShownToChild` is true and the id is not
`currentAccount.id`, in the order given. It is generic like
`findCurrentAccount`, so it takes `AccountSummary[]` and returns them.

**Tests:** `src/lib/account/__tests__/view-mode.test.ts` (extend it). The
fixtures are built in the test with `createMockAccount` and distinct ids:
1. leaves out the account being viewed (break: drop the id check)
2. leaves out an account in parent view (break: drop the `isShownToChild` check)
3. keeps the family's order (two kept accounts; break: `.reverse()`)
4. is empty when the child is the only one in child view (break: return
   `accounts` when nothing is kept)

## Phase 2 — the list in the child menu

**Code:**
- `src/components/Menu/use-open-account.ts`: `useOpenAccount(): (id: string)
  => void` reads `switchAccount` from `useAccounts()` and `closeMenu` from
  `useMenu()`. `AccountControls` swaps its local `openAccount` for it.
- `src/components/Menu/ChildMenuAccountList/` holds `ChildMenuAccountList.tsx`,
  `.styles.ts`, `constants.ts`, `index.ts` and a test. It takes props, like
  `AccountList`: `accounts: AccountSummary[]` and `onSelect: (id: string) =>
  void`. It renders a `<section>` with `MenuSectionTitle`
  (`icon` with `aria-hidden`, then `title`), and one `styled(Row)`
  `type="button"` per account: `AvatarBadge` with `alt=""`, the name, and the
  `arrow` with `aria-hidden`. The row's accessible name is the child's name.
- `ChildMenuContent.tsx` computes `otherAccountsShownToChild(accounts,
  currentAccount)`. When the list isn't empty, it renders
  `<Item><ChildMenuAccountList accounts={…} onSelect={openAccount} /></Item>`
  between `HomeLink` and the appearance `Item`. With an empty list, no `Item`
  renders, so there is no empty card.
- `ChildMenuContent.styles.ts`: `Child` becomes a row (`display: flex`,
  `align-items: center`, `gap: 14px`, `min-height: 56px`, `padding: 6px 16px`,
  `margin-bottom: 12px`). `ChildName` takes `typography.heading`.
- `ChildMenuContent/constants.ts`: `CHILD_MENU_AVATAR_PROPS.size` is 40.

**Fixtures:** in `src/test-utils/mocks/account.mocks.ts`, add
`mockChildSiblingAccountSummary` (id `a3`, its own name and avatar,
`viewMode: VIEW_MODE.child`) and `mockChildFamilyAccountsContext`. The family
context holds `[mockAccountSummary, mockSiblingAccountSummary,
mockChildSiblingAccountSummary]`, with the current account in child view.
Leave `mockAccountsContext` and `mockChildAccountsContext` as they are, since
the parent picker tests count their rows. `mockChildAccountsContext` has only
a parent-view sibling, so it is the "no card" case as it stands.

**Tests:** `ChildMenuAccountList.test.tsx` (props only, no context):
1. shows each account it is given, in order (break: render
   `accounts.slice(1)`)
2. tapping a row selects that account (`onSelect` called with its id; break:
   pass `accounts[0].id`)
3. the face is left out of the row's name (break: `alt={account.name}`)

`ChildMenuContent.test.tsx`. Its top-level `beforeEach` renders with
`mockChildAccountsContext`, so the new cases go in a sibling `describe` that
renders with `mockChildFamilyAccountsContext`:
1. lists the sibling in child view (break: return `[]`)
2. does not list the sibling in parent view (break: drop the `isShownToChild`
   check)
3. does not list the child being viewed (break: drop the id check)
4. tapping the sibling switches to their account (break: `switchAccount`
   called with the current id)
5. tapping the sibling closes the menu (break: drop `closeMenu()`)

In the existing `describe`, with only a sibling in parent view:

6. shows no switch card (break: always render the `Item`)

`AccountControls.test.tsx` "leaves the menu when another account is picked"
already covers `AccountControls` after the `useOpenAccount` swap. Run it, and
watch it fail against `useOpenAccount` without `closeMenu()`.

## Phase 3 — proof in a real browser

- `e2e/driver/menu-driver.ts`: add `childMenuAccountNames()` (via
  `appBrowser.texts(CHILD_MENU_ACCOUNT_LIST_TEST_IDS.row)`) and
  `switchAccountFromChildMenu(index)` (via `clickNth`), mirroring
  `switchAccount(index)`. No new `AppBrowser` helper is needed.
- `e2e/child-view.e2e.ts`: add a `describe('a child switches to a sibling')`
  block with three accounts, in this order: the child (child view, `a1`), the
  sibling (child view, `a2`), and one in parent view (`a3`), each with its own
  name. The child must come first. With no cookie the app falls back to
  `accounts[0]`, so if the sibling came first, the reload check would pass
  without the cookie ever moving.
  - the menu offers only the sibling in child view (`childMenuAccountNames()`
    equals `[siblingName]`)
  - tapping it shows the child screen with the sibling's name, and still does
    after a reload (`childAccount.screenExists()` and `header.title()`)
- One shot of the child menu for the PR with the `pr-screenshots` skill.

## One PR

`feat(child-mode): the child menu switches between children`. All three phases
go in one PR. The diff is small, and each phase is meaningless on its own.

## Open after merge

- Nothing marks which accounts are in child view in the parent picker. If
  parents get confused about why a child isn't listed, add a 🧒 to
  `AccountRow`.
