# Menu redesign

Split the menu into the one setting that is global — which account you are looking
at — and everything else, which belongs to that account. The account row of avatar
chips becomes a real picker showing each child's total, editing moves next to it,
and the menu gains a navigation section.

Mockup: `mockups/account-summary.html`. Three menu variants are rendered side by
side. **Variant ג׳ — light surface plus the app's own header — is the approved
target**, confirmed 2026-09-15. Variant א׳ is the same light treatment without the
header continuity; variant ב׳ shows today's gradient for comparison and is not the
target.

First of two epics. `תנועות בחשבון` (the transactions screen the nav section points
at) follows in its own plan.

## Progress — updated 2026-09-22 (PRs 1–7 merged; PR 8 is next)

Outside the numbering, [#76](https://github.com/ShiraSpace/fun-saver/pull/76)
(`3897156`) added the `accountScopeBg` / `accountScopeBorder` tokens PR 8 was told to
do without. They are in all three themes, and the trigger and selected row already
read from them.

Also outside the numbering, [#80](https://github.com/ShiraSpace/fun-saver/pull/80)
(`1ce3581`) added `withShots` in `e2e/shot.ts`, the `pr-screenshots` skill and
`.github/pull_request_template.md`. Every PR from here on that changes something
visible carries screenshots; `gh --attach` uploads them and needs `gh` ≥ 2.99.

Plan PR numbers below are **not** GitHub PR numbers. Mapping so far:

| Plan PR | GitHub                                                 | Branch                         | Status                 |
| ------- | ------------------------------------------------------ | ------------------------------ | ---------------------- |
| PR 1    | [#58](https://github.com/ShiraSpace/fun-saver/pull/58) | `feat/menu-derived-accounts`   | **merged** — `0085222` |
| PR 2    | [#59](https://github.com/ShiraSpace/fun-saver/pull/59) | `feat/menu-light-sheet`        | **merged** — `6288806` |
| PR 3    | [#62](https://github.com/ShiraSpace/fun-saver/pull/62) | `feat/menu-below-header`       | **merged** — `80d0b67` |
| PR 4    | [#65](https://github.com/ShiraSpace/fun-saver/pull/65) | `feat/menu-account-list`       | **merged** — `8036baa` |
| PR 5    | [#70](https://github.com/ShiraSpace/fun-saver/pull/70) | `feat/menu-account-picker`     | **merged** — `d162cde` |
| PR 6    | [#79](https://github.com/ShiraSpace/fun-saver/pull/79) | `feat/menu-account-popover`    | **merged** — `f9d6573` |
| PR 7    | [#85](https://github.com/ShiraSpace/fun-saver/pull/85) | `feat/menu-edit-under-trigger` | **merged** — `2e49d4e` |
| PR 8    | —                                                      | —                              | **next**               |
| PR 9    | —                                                      | —                              | not started            |

The panel is now a `softBg` sheet that starts below a header which no longer fades,
the accounts sit behind an `AccountTrigger`, tapping it floats the list over the
sections below instead of pushing them down, and edit is a named button under the
trigger. What is left is grouping by scope (PR 8) and the nav section (PR 9).

### What the merged PRs changed that this plan did not predict

- **PR 2 also had to repaint `Header.styles.ts`.** Not on the plan's list, but
  `Bar[data-open='true']` set `textOnPrimary`, which rendered the menu title white on
  a pale sheet.
- **PR 2 moved `MenuLabel` to `softText`, not `textMuted`.** `textMuted` on `softBg`
  measures 3.6:1 in sunshine-quest and 4.3:1 in jungle-quest — both under WCAG AA for
  a 12px label. `softText` measures 6.0 / 5.7 / 9.2 and is the token the palette ships
  alongside `softBg`.
- **PR 3 had to stop the header fading and stop it swapping its title.** The plan says
  only to inset the panel, but variant ג׳'s note is explicit that _only the content
  below the header changes_. Insetting alone would have left a gradient strip above the
  panel and a header still relabelled `תפריט`. `Bar` lost its whole `data-open` block
  and `Header` lost the prop.
- **`header-layout.visual.ts` never needed new baselines.** It asserts geometry and
  type size, no colour. Only `menu-morph.visual.ts` moved, in PRs 2 and 3.
- **PR 4 needed `AccountRow` as its own component.** Hoisting the map into a variable
  left `AccountList` at 41 lines against the 40-line `max-lines-per-function` cap.
- **`AccountChip`'s `Badge` never needed a light-panel equivalent.** It is a
  `primary`-filled pill on the avatar, independent of the panel colour. PR 4 deleted it.
- **PR 5 had to reset the picker when the menu opens.** `MenuOverlay` renders
  `<Panel data-open>` always — closing is a CSS toggle, never an unmount — so an
  expanded list stayed expanded and every later opening showed the full list. Fixed
  with `<AccountsSection key={String(isOpen)}>`. An effect resetting the state is what
  React documents and what `react-hooks/set-state-in-effect` rejects; the state lives
  in the picker, and the reset belongs to whoever owns `isOpen`. PR 6 lifts it anyway
  for the Escape ordering, which is where this stops being a `key`.
- **PR 5 gave `Money` a `fullSizeCurrency` variant.** `MONEY_STYLE` shrinks the mark
  to `0.4em` at `0.65` opacity — right for the hero's 38px, a ~5px speck at the row's
  12px label. The variant restores `1em`, full opacity and no gap, matching the
  mockup's single `₪1165` text run.
- **PR 5 put the totals in a column.** The mockup gives `.tot` an auto inline-start
  margin resolved against its own `direction: ltr`, so each total sits next to its
  name and shifts with the name's width — measured in a browser, not read off the
  picture. A real column was wanted instead, so `Name` reserves `nameColumnWidth: 56`.
  Names wider than that push their total out of the column.
- **PR 5's e2e seam needed a wait, not just a click.** Rows are reached with
  `clickNth`, which does not wait, so `openAccountPicker()` waits on the list through
  a new `session.waitForTestId`.
- **The account scope needed colours of its own, sooner than PR 8.** The mockup paints
  the trigger border and the selected row from `--globalBg` / `--globalBorder`, a tint
  it varies per theme; `softBg` / `softBorder` stood in for them and read lime in
  jungle-quest and yellow in sunshine-quest. Rejected on sight once PR 5 shipped, so
  #76 took the mockup's own values into `accountScopeBg` / `accountScopeBorder`:
  `#F4EEFA` / `#C9B6E4` in sunshine-quest, `#EDF4E6` / `#A9C77E` in jungle-quest,
  `#101A2C` / `#2F4470` in midnight-blue. The panel keeps `softBg`, which the mockup
  paints the same way.
- **PR 6 put the picker state in `Menu`, not `Header`.** `Header` only holds the
  `useState`; `Menu` owns the `toggle` and `close` handlers that have to reset the
  picker, so the state went beside them and `Header` was not touched. One prop
  travels down — `isAccountListOpen` plus `onAccountListToggle(isOpen: boolean)`,
  the same shape `Menu` already takes from `Header`, so the outside-click hook and
  the Escape branch both say `false` rather than passing a toggle where a close is
  meant.
- **PR 6 rewrote `AccountsContextValue` and deleted `AccountSwitcher`.** The context
  handed out `accounts` plus `selectedAccountId` without saying the id named one of
  them, so every reader re-resolved the pair and re-checked an `undefined` none of
  them could reach. It now carries `currentAccount` (required), `Home` resolves it
  once and provides it **inside** the `hasAccounts` gate, and `AccountSwitcher` —
  which existed only to do that resolving — is gone. The file moved to
  `src/components/Home/accounts-context.ts`, and `useAccounts()` **throws** outside a
  provider rather than serving a blank sentinel.
- **That throw found a 500 on the method page.** `/method` renders `Header` → `Menu`
  → `AccountsSection` → `useAccounts()` with no provider, and had been living off the
  old empty default: its picker showed a lone `＋ חשבון חדש` row and no trigger. It
  now loads accounts like the home screen through `withDerivedWallets` in
  `src/lib/account-dashboard.ts`, composed onto #81's `signedInAccounts()`. `/method`
  with no account to show redirects to `HOME_ROUTE`.
- **The menu's create and edit rows were inert on `/method` too.** The app mode and
  both overlays lived inside `Home`. They are now `AccountManagement`
  (`src/components/AccountManagement/`), which both pages wrap their content in, and
  the navigation hook moved to `src/hooks/use-account-navigation.ts` since neither
  page owns it any more.
- **`popoverZIndex` was a no-op and is not in `LAYERS`.** A positioned element already
  paints over static siblings and the list has no positioned ones, so the line went
  rather than moving into the registry.
- **Box overlap does not catch a paint-order regression.** `menu-morph` asserts the
  list _takes the tap_ where it overlaps the appearance section, through
  `document.elementFromPoint` behind `session.receivesTapAt`. Comparing boxes passes
  either way round; this was verified by giving the appearance section a `z-index`
  and watching only that assertion fail.
- **The trigger's total sat below the `מוצג כרגע` beside it.** `Current` is a flex
  row and `Money` sets `line-height: 1`, so the default `stretch` dropped the amount.
  `align-items: baseline` fixes it — visible in the before/after on #79.
- **PR 7's underline belongs to the label, not the button.** `EditButton` is a flex
  row with a `gap`, so `text-decoration: underline` on it drew two stubs with the gap
  cut out between them. The underline sits on `EditLabel`; the pencil is not
  underlined, which is what the mockup's single run reads as anyway.
- **The pencil has to come first in the DOM.** It followed the label, and an RTL flex
  row puts the last item on the left — the pencil ended up on the far side of the
  text it belongs to. Leading it is a JSX reorder, invisible to the accessible name
  because the icon is `aria-hidden`.
- **The label needed `min-width: 0` and an ellipsis, and that is all.** At
  `MAX_ACCOUNT_NAME_LENGTH` 60 the label is wider than a phone. With the label
  explicitly at `min-width: 0` and the icon left at `min-width: auto`, the icon
  cannot shrink below its own glyph and the label absorbs every pixel of the shrink —
  so no `flex-shrink: 0` on the icon, unlike the `flex: 1` pairings in `WalletCard`
  and `Legend`. Confirmed by shooting the 60-character name, not by reading the rule.
- **`header-layout.visual.ts` never touched the edit chip.** The plan said it asserts
  the chip fits at the longest name; that assertion is `edit-account.e2e.ts`'s fourth
  `it`, and it only ever checks the button's outer box, never the icon inside it.

### Still open from the merged work

- **`alert` is under AA on the sheet** — 3.7:1 in sunshine-quest, 3.6:1 in
  jungle-quest, 6.0:1 in midnight-blue. `AppearanceSection`'s `SaveError` is the only
  reader today. There is no darker red in the palette, so fixing it means a new token
  across `ThemeColors` and all three themes — a theme PR, not a repaint. Deliberately
  not done in PR 2.
- **`AccountsSection` is no longer empty.** It forwards the picker's open state and
  reads `accounts`, `currentAccount` and `selectAccount` from context, and since PR 7
  it also passes `currentAccount.name` to the edit button. PR 8 still deletes the
  folder, but `MenuOverlay` has to take those props over — it already holds them, so
  it is a move rather than new plumbing.
- **`ACCOUNTS_SECTION_*` outlive their folder.** `EditAccountButton`, its styles and
  the `editButton` test id live in `src/components/Menu/AccountsSection/` and are
  reached by `menu-driver.ts`, `home-test-helpers.tsx` and two e2e describes. PR 8
  deletes the folder, so the button and its constants need a home of their own before
  those imports break.
- **The method page's picker can switch account but its language and appearance rows
  are the account's, on a page that is not about an account.** Nothing is broken —
  they write to the account in view — but whether `/method` should carry the whole
  menu is a question PR 9's nav section will raise.
- **`HEADER_LAYOUT.foregroundZIndex` and `MENU_TOGGLE.zIndex` are vestigial.** They
  existed so the title, avatar and burger could float above a panel that covered them;
  since PR 3 nothing covers them. Left in place because the panel still animates under
  a `scale()` transform and removing them risks a stacking regression for no visible
  gain.

## Decisions

- **Panel is a light sheet**, not today's `theme.gradients.screen`. Decided
  2026-09-15 after comparing variants א׳ and ב׳ in the mockup.
- **Language stays a stub** and stays in the per-account block. Making it real is
  per-account and needs a data layer — parked in `docs/backlog.md` roadmap §2.
- **Nav section ships in this epic**, before the transactions screen exists, so the
  second row is inert on merge.
- **Transaction icons use the corner-badge variant** (`תג בפינה`) — decided
  2026-09-15, relevant to the transactions epic, not this one.

## Phase 0 — branch

One branch and one PR per phase below, each off updated `origin/main`. The repo
default is `main`; there is no `master`. The repo squash-merges, so a branch whose
predecessor is still open should be rebased with `git rebase --onto origin/main
<predecessor> <branch>` once that predecessor lands, not rebased plainly.

## PR 1 — derived accounts reach the menu

`src/components/AccountSwitcher/accounts-context.ts`: widen
`AccountsContextValue.accounts` from `Account[]` to `AccountWithDerivedWallets[]`.

`page.tsx` already builds `AccountWithDerivedWallets` for every account and passes
them straight into `AccountsProvider`, so this exposes balances the menu cannot
currently see. Per-account totals then come from the existing, already-tested
`totalBalance(account.wallets)` in `src/lib/derivations.ts` — no new helper.

Type-only, no runtime change, so no new test; `tsc` and the existing suites are the
check. `AccountChip` keeps taking `Account` and stays assignable.

## PR 2 — repaint the panel as a light sheet

`MenuOverlay.styles.ts` — `Panel` background becomes `theme.colors.softBg` with
`theme.colors.textStrong`. A faint tint rather than `surface`, so the white cards
inside keep floating on it; on pure `surface` the header card and the language
segment both disappear into the background. Keep the scale/opacity transition.

Everything that assumed white-on-gradient has to follow:

- `MenuLabel.styles.ts` — drop the `opacity` trick, use `theme.colors.textMuted`.
- `Menu.styles.ts` — `ToggleButton`'s `&[data-open='true']` colour is
  `textOnPrimary`; on a light panel the burger turns white-on-white. Use
  `textStrong`.
- `AppearanceSection.styles.ts` — `SaveError` is `textOnPrimary`, invisible on
  light. Use `theme.colors.alert`.
- `LanguageSection.styles.ts` — `Segment` is filled `surface`; give it a
  `divider` border so it reads as a control.
- `AccountsSection.styles.ts` — `ActionChip`'s `rgba(255,255,255,.4)` and
  `AccountChip.styles.ts`'s `Badge` need light-panel equivalents.

The last item is deliberately throwaway: PRs 4 and 7 delete those chips. Repainting
first is still the cheaper order — the alternative is authoring all six new
components against a gradient and re-tuning every one of them at the end.

Baselines change: `menu-morph.visual.ts`, `header-layout.visual.ts`.

## PR 3 — panel starts below the header

Today `Panel` is `position: fixed; inset: 0` and covers the header, with
`MENU_OVERLAY_LAYOUT.contentPaddingTop: 92` reserving blank space where the header
used to be. Only the burger survives, because `ToggleButton` sits outside the panel
at a higher `z-index` — so opening the menu blanks the name, avatar and total.

Inset the panel below the header instead and drop the 92px padding, leaving the
real `Header` visible and mounted. Nothing about the header re-renders on open, so
there is nothing to flicker.

Mockup variant ג׳ shows the target by _duplicating_ the header card inside the
panel. Do not build it that way — one header that is never covered beats two that
have to match.

Needs the header's height as a shared constant rather than the current magic 92.

## PR 4 — `AccountList`

New `src/components/Menu/AccountList/`. One row per account: avatar, name, and
total via `<Money>` and `totalBalance`. Selected row marked. Absorbs the add action
as a `＋ חשבון חדש` row.

Deletes `AccountChip`, `AddAccountChip` and the `Row` from `AccountsSection`.
Selection and create keep their existing wiring — `useAccounts().selectAccount` and
`APP_MODE.creatingAccount`.

`menu-driver.ts`: `accountChipCount` / `selectAccount` / `clickAddAccountChip` move
to the new test ids. Suites: `account-switch.visual.ts`, `create-account.e2e.ts`.

## PR 5 — collapse behind `AccountTrigger`

New `AccountPicker` wrapping the list: a trigger showing the current account, its
total and a caret, expanding the list inline. Open state is local to the picker.

Split from PR 4 on purpose — PR 4 is a layout rewrite, this is new state.

As of PR 4 the pieces are in `src/components/Menu/AccountList/`: `AccountList` renders
the rows plus the add row, and `AccountRow` is a standalone avatar / name / total row
marked with `aria-current`. `AccountsSection` renders `AccountList` directly and owns
the select and add handlers, so the picker slots between them. The trigger shows the
same three things a row does — `selectedAccount(accounts, selectedAccountId)` from
`src/lib/selected-account.ts` gives the current one — but it is not an `AccountRow`:
it carries a caret, toggles rather than selects, and PR 7 hangs the edit button
directly under it. Watch the 40-line cap; `AccountRow` already exists because of it.

## PR 6 — the expansion becomes a popover

Absolutely positioned so opening it does not push the sections below it down, plus
close-on-outside-click.

`MenuOverlay` already closes the whole menu on `Escape`. Escape must close the
picker first and only close the menu when the picker is shut, so the handlers need
ordering rather than two independent listeners.

As of PR 5 the open state is `useState` inside `AccountPicker`, which `MenuOverlay`
cannot see. Escape ordering is what forces the lift — put it where `isMenuOpen`
already lives (`Header`) and reset it in the toggle handler, which also retires the
`key={String(isOpen)}` remount PR 5 leaned on. `AccountList` carries
`ACCOUNT_LIST_DOM_ID` and the trigger points at it with `aria-controls`, so the
popover keeps that pair. The mockup's `.acctList` is the shape to match: absolutely
positioned, `inset-inline: 11px`, `surface` fill, a `softBorder` edge and a drop
shadow.

## PR 7 — edit moves under the trigger

Replace `EditAccountChip` with a centred text-and-pencil button directly under the
trigger, labelled `עריכת <name>` so the accessible name says which account. Keeps
`APP_MODE.editingAccount`.

Shipped as `EditAccountButton` beside `AccountsSection`, taking `accountName` and
`onEditAccount`. The visible text is the accessible name — the pencil is
`aria-hidden` and the `aria-label` the chip carried is gone. `menu-driver.ts` now
says `clickEditAccountButton` / `editAccountButtonBox`, and the callers that followed
were `edit-account.e2e.ts` (two describes), `home-test-helpers.tsx`,
`Home.managing-accounts.test.tsx` and `AccountsSection.test.tsx`. The test id value
`menu-account-edit` did not change; only its constant did.

## PR 8 — scope grouping

Wrap the two groups so the split is visible: the account picker and its edit button
in one block, and a per-account block headed `הגדרות של <name> <avatar>` with a
one-line `נשמר על החשבון הזה בלבד.` under it. Drops the old `החשבונות` label.
Delete the `AccountsSection` folder and let `MenuOverlay` compose the blocks directly
— but note it is not empty: it forwards `isAccountListOpen` / `onAccountListToggle`
and owns `handleSelectAccount`, `handleAddAccount` and `handleEditAccount`, each of
which closes the menu. `MenuOverlay` already receives the picker props and `onClose`,
so those handlers move up with the markup.

The folder also holds PR 7's `EditAccountButton`, its `.styles.ts` and the
`ACCOUNTS_SECTION_*` constants, which `menu-driver.ts`, `home-test-helpers.tsx` and
two e2e describes import by path. They need somewhere to land — a folder of the
button's own next to `AccountPicker` is the shape the rest of `src/components/Menu/`
already uses — and the constants rename with it.

Tint the blocks with `accountScopeBg` / `accountScopeBorder`, which #76 added for
exactly this after the `softBg` / `softBorder` stand-in was rejected. The caveat this
section carried — sunshine-quest reading yellow where the mockup is purple — is what
that PR resolved.

Watch `MenuOverlay.tsx` against the 40-line function cap — extract the blocks as
components rather than inlining them.

## PR 9 — nav section

`מסכים` with `🏠 בית` and `📈 תנועות בחשבון`, current screen marked via
`aria-current="page"`.

Real routes already exist: `/method` is one, reached from the menu through a
`next/link` `NavLink`, and `HOME_ROUTE` / `METHOD_ROUTE` live in their components'
`constants.ts`. So `🏠 בית` is a link, not a mode. What is still `APP_MODE` state is
creating and editing an account, and that hook is now
`src/hooks/use-account-navigation.ts`. `תנועות בחשבון` has nowhere to go until the
transactions epic and ships inert.

`/method` shows this section too, so `aria-current="page"` needs the real path —
`usePathname()` rather than anything the menu knows on its own.

## Notes / risks

- **`e2e/driver/menu-driver.ts` is the seam.** Six of its methods hardcode
  `ACCOUNTS_SECTION_TEST_IDS`, consumed by four suites. Because it is one file,
  each PR updates the driver plus only the suites whose flow it changed. Without
  it this epic would touch every suite in every PR.
- **Visual baselines** changed in PRs 2 and 3 (`menu-morph.visual.ts`), PR 4 moved
  `account-switch.visual.ts` onto the new row test ids, and PR 6 added the popover
  assertions to `menu-morph.visual.ts` plus the signed-out `/method` case to
  `page-routing.visual.ts`. PR 7 needed none — nothing in the visual suites looks at
  the edit control. Still expected in PR 8.
- **Every PR from #80 on carries screenshots** when it changes something visible.
  Write a `.mts` script in the gitignored `e2e/shots/`, shoot with
  `npx next build && npx tsx e2e/shots/<topic>.shot.mts`, attach with
  `gh pr edit <n> --attach`. The `pr-screenshots` skill has the whole route.
- **A `before` shot may have to be faked in place.** The classifier blocks
  `git checkout` / `git show` inside a worktree-isolated session, so PR 7's before
  shot came from temporarily rewriting the styles file to the old chip and putting it
  straight back. Also: the shot script writes to the same filename every run, so
  rename the `after` PNG before shooting the `before` or it is overwritten.
- **Seed the shot with an account that has money.** Accounts sort by name, so the
  first account alphabetically is the selected one — with the stock fixtures that is
  wallet-less `mockSecondAccount` and every total shoots as `₪0`.
- **Assert through the helper, never restate its output.** A component test checks
  that the component uses the method we chose; `totalBalance` and
  `agorotToWholeShekels` have their own tests in `derivations.test.ts` and
  `money.test.ts`. Hardcoding an expected shekel figure couples a component test to a
  dependency's implementation and reddens the wrong file when it changes.
- **Fixtures — resolved in PR 4.** `mockSecondDerivedAccount` now carries
  `createMockDerivedWallet({ id: 'w4', balance: 4200 })` so the two rows have totals
  that can be told apart. `mockSecondAccount` itself stays wallet-less on purpose:
  `src/db/memory-store/__tests__/accounts.test.ts` asserts account `a2` comes back
  with no wallets, to prove wallets stay attached to their own account. The plain
  fixture is the store layer's empty case, the derived one the menu's funded case.
- **Whole epic is front-end.** No API, no store, no migration. Language was the
  only part that needed a data layer and it is out. PR 6 is the exception that
  proves it: nothing about the menu changed the data layer, but making `/method`
  carry the same menu meant giving that page the same accounts the home screen has.
- **README's deposit split is no longer stale** — it reads 50% spending / 40%
  savings / 10% good deeds, which is `DEPOSIT_SPLIT`. The note that said otherwise
  is gone.
