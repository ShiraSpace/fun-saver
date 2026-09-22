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

## Progress — updated 2026-09-22 (PRs 1–5 merged; PR 6 is next)

Outside the numbering, [#76](https://github.com/ShiraSpace/fun-saver/pull/76)
(`3897156`) added the `accountScopeBg` / `accountScopeBorder` tokens PR 8 was told to
do without. They are in all three themes, and the trigger and selected row already
read from them.

Plan PR numbers below are **not** GitHub PR numbers. Mapping so far:

| Plan PR    | GitHub                                                 | Branch                       | Status                 |
| ---------- | ------------------------------------------------------ | ---------------------------- | ---------------------- |
| PR 1       | [#58](https://github.com/ShiraSpace/fun-saver/pull/58) | `feat/menu-derived-accounts` | **merged** — `0085222` |
| PR 2       | [#59](https://github.com/ShiraSpace/fun-saver/pull/59) | `feat/menu-light-sheet`      | **merged** — `6288806` |
| PR 3       | [#62](https://github.com/ShiraSpace/fun-saver/pull/62) | `feat/menu-below-header`     | **merged** — `80d0b67` |
| PR 4       | [#65](https://github.com/ShiraSpace/fun-saver/pull/65) | `feat/menu-account-list`     | **merged** — `8036baa` |
| PR 5       | [#70](https://github.com/ShiraSpace/fun-saver/pull/70) | `feat/menu-account-picker`   | **merged** — `d162cde` |
| PR 6       | —                                                      | `feat/menu-account-popover`  | **next**               |
| PR 7, 8, 9 | —                                                      | —                            | not started            |

The panel is now a `softBg` sheet that starts below a header which no longer fades,
and the accounts sit behind an `AccountTrigger` showing the current account, its
total and a caret. What is left is making that expansion a popover (PR 6), moving
edit under the trigger (PR 7), grouping by scope (PR 8) and the nav section (PR 9).

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

### Still open from the merged work

- **`alert` is under AA on the sheet** — 3.7:1 in sunshine-quest, 3.6:1 in
  jungle-quest, 6.0:1 in midnight-blue. `AppearanceSection`'s `SaveError` is the only
  reader today. There is no darker red in the palette, so fixing it means a new token
  across `ThemeColors` and all three themes — a theme PR, not a repaint. Deliberately
  not done in PR 2.
- **The edit pencil floats alone** under the account list since PR 4 deleted the chip
  row that held it. PR 7 is what resolves this, which is an argument for not leaving
  PR 5 and 6 sitting in review for long.
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

`menu-driver.ts`: `clickEditAccountChip`, `editAccountChipBox`. Suites:
`edit-account.e2e.ts`, `header-layout.visual.ts`.

## PR 8 — scope grouping

Wrap the two groups so the split is visible: the account picker and its edit button
in one block, and a per-account block headed `הגדרות של <name> <avatar>` with a
one-line `נשמר על החשבון הזה בלבד.` under it. Drops the old `החשבונות` label.
`AccountsSection` is empty by now — delete the folder and let `MenuOverlay` compose
the blocks directly.

Tint the blocks with `accountScopeBg` / `accountScopeBorder`, which #76 added for
exactly this after the `softBg` / `softBorder` stand-in was rejected. The caveat this
section carried — sunshine-quest reading yellow where the mockup is purple — is what
that PR resolved.

Watch `MenuOverlay.tsx` against the 40-line function cap — extract the blocks as
components rather than inlining them.

## PR 9 — nav section

`מסכים` with `🏠 בית` and `📈 תנועות בחשבון`, current screen marked via
`aria-current="page"`.

Navigation today is `APP_MODE` state in `use-home-navigation.ts`, not a router, so
this either adds a mode or introduces the first real route. Decide when the
transactions epic is planned — until then `תנועות בחשבון` has nowhere to go and
ships inert.

## Notes / risks

- **`e2e/driver/menu-driver.ts` is the seam.** Six of its methods hardcode
  `ACCOUNTS_SECTION_TEST_IDS`, consumed by four suites. Because it is one file,
  each PR updates the driver plus only the suites whose flow it changed. Without
  it this epic would touch every suite in every PR.
- **Visual baselines** changed in PRs 2 and 3 only so far (`menu-morph.visual.ts`),
  and PR 4 moved `account-switch.visual.ts` onto the new row test ids. Still expected
  in PRs 5, 7 and 8.
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
  only part that needed a data layer and it is out.
- **README is stale** on the deposit split: it says 60/20/20 where
  `DEPOSIT_SPLIT` is savings 40 / spending 50 / goodDeeds 10. Unrelated to this
  epic, worth a one-line fix in passing.
