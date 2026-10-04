# The child menu switches between children

> Status: **planned 2026-10-04**, not started. Mockup:
> `mockups/child-account-switcher.html`, option **C** (chosen). Builds on child
> mode (`.plans/2026-10-03-child-mode.md`, merged).

## Why

On a shared phone, a child in child view can't get to a brother's or sister's
screen without a parent switching back to parent view, opening the account
picker, and turning child view on again. The child menu gets a simple
"switch to…" list under «הכסף שלי».

## Behaviour

- Under «הכסף שלי», a card titled `🔁 להחליף ל…` lists **the other accounts
  that are also in child view**, in the same order as the parent account
  picker, leaving out the current one. Each row shows a face, a name and a `‹`.
  It shows no money.
- **Tapping a row** calls `switchAccount(id)` and then `closeMenu()`, the same
  as `AccountControls.openAccount`. The theme and the current-account cookie
  follow, because `switchAccount` already handles both. The new account is
  already in child view, so the child screen stays.
- **No other account in child view → no card.** An account in parent view is
  never listed. Switching to it would hand the child the parent screen with
  no gate, which is the thing child view exists to prevent.
- **Same size as the top card.** The top child card shrinks from an 84px
  centred avatar to a row, so it matches the switcher rows. Both are 56px high,
  with a 40px face and the name in `theme.typography.heading`. With that, the
  menu fits on a 760px screen with up to 5 children (measured in the mockup).
- It works on Home, `/transactions` and `/method`. All three already provide
  `switchAccount` through `AccountsProvider`.

## Reused, not new

- `switchAccount` from `useAccounts()` and `closeMenu` from `useMenu()`.
- `isShownToChild` from `src/lib/account/view-mode.ts`.
- `AvatarBadge`, as the top card uses it.
- Row colours: `theme.colors.accountScopeBg` for the fill, `textStrong` for the
  name, `primary` for the `‹`. These are the same tokens the parent
  `AccountRow`'s current row uses.

## Names (proposals — re-check against the glossary when implementing)

| New | Where | Why this name |
| --- | --- | --- |
| `otherAccountsShownToChild(accounts, currentAccount)` | `src/lib/account/view-mode.ts` | sits next to `isShownToChild`; the glossary rejects `childView` |
| `ChildAccountSwitcher` | `src/components/Menu/ChildAccountSwitcher/` | its nearest siblings are `ChildMenuContent` and `ChildAccount` |
| `CHILD_ACCOUNT_SWITCHER_COPY` (`title`, `icon`, `go`) and `CHILD_ACCOUNT_SWITCHER_TEST_IDS` (`switcher`, `row`) | its `constants.ts` | house pattern |

`CHILD_MENU_AVATAR_PROPS.size` changes from 84 to 40. The switcher rows read
the same constant, so the top card and the rows can't drift apart. That makes
it a value two modules read, so it stays in `constants.ts`.

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
  `mockChildAccountsContext` has a sibling in parent view
  (`mockSiblingAccountSummary`). Add a second sibling in child view next to it
  in `src/test-utils/mocks/account.mocks.ts`.
- Start from a fresh worktree off `origin/main`. Run `npm install` and copy
  `.env.local` from `../fun-saver/.env.local`.

## Phase 1 — the rule in lib

**Code:** `otherAccountsShownToChild(accounts: AccountSummary[], currentAccount:
AccountSummary): AccountSummary[]` keeps the accounts where `isShownToChild` is
true and the id is not `currentAccount.id`, in the order given. It's generic
over `Pick<Account, 'id' | 'viewMode'>` if that reads cleaner.

**Tests:** `src/lib/account/__tests__/view-mode.test.ts` (extend it):
1. leaves out the account being viewed
2. leaves out an account in parent view
3. keeps the family's order
4. is empty when the child is the only one in child view

## Phase 2 — the switcher in the child menu

**Code:**
- `src/components/Menu/ChildAccountSwitcher/` holds `ChildAccountSwitcher.tsx`,
  `.styles.ts`, `constants.ts`, `index.ts` and a test. It reads `useAccounts()`
  and `useMenu()`, returns `null` when the list is empty, and otherwise renders
  a card with the title and one `button` per account (`AvatarBadge` with `alt=""`,
  the name, `‹` with `aria-hidden`).
- `ChildMenuContent.tsx`: render `<ChildAccountSwitcher />` between `HomeLink`
  and the appearance `Item`.
- `ChildMenuContent.styles.ts`: `Child` becomes a row (`display: flex`,
  `align-items: center`, `gap: 14px`, `min-height: 56px`, `padding: 6px 16px`,
  `margin-bottom: 12px`). `ChildName` takes `typography.heading`.
- `constants.ts`: `CHILD_MENU_AVATAR_PROPS.size` is 40.

**Tests:** `ChildAccountSwitcher.test.tsx`:
1. lists a sibling in child view
2. does not list a sibling in parent view
3. does not list the child being viewed
4. tapping a sibling switches to that account (`switchAccount` called with its id)
5. tapping a sibling closes the menu
6. shows nothing when no sibling is in child view

`ChildMenuContent.test.tsx`: one more case, "offers the switch to a sibling
under הכסף שלי".

## Phase 3 — proof in a real browser

- `e2e/driver/menu-driver.ts`: add `tapChildAccount(name)`. Find the row by
  `CHILD_ACCOUNT_SWITCHER_TEST_IDS.row` and its text. Add `childAccountNames()`.
- `e2e/child-view.e2e.ts`: add a `describe('a child switches to a sibling')`
  block with two child-view accounts plus one in parent view.
  - the menu offers only the sibling in child view
  - tapping it shows the child screen with the sibling's name after a reload
    (the cookie moved)
- One shot of the child menu for the PR with the `pr-screenshots` skill.

## One PR

`feat(child-mode): the child menu switches between children`. All three phases
go in one PR. The diff is small, and each phase is meaningless on its own.

## Open after merge

- Nothing marks which accounts are in child view in the parent picker. If
  parents get confused about why a child isn't listed, add a 🧒 to
  `AccountRow`.
