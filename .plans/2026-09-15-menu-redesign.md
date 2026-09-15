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
default is `main`; there is no `master`.

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

Mockup variant ג׳ shows the target by *duplicating* the header card inside the
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

## PR 6 — the expansion becomes a popover

Absolutely positioned so opening it does not push the sections below it down, plus
close-on-outside-click.

`MenuOverlay` already closes the whole menu on `Escape`. Escape must close the
picker first and only close the menu when the picker is shut, so the handlers need
ordering rather than two independent listeners.

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

Reuse `softBg` / `softBorder` for the block tint rather than adding theme tokens.
Caveat: in `sunshine-quest` those are yellow (`#FFF8E0` / `#FFD23F`) where the
mockup used a neutral purple, so that theme will read warmer than the mockup.
Jungle and midnight are near-identical either way. Add real tokens only if the
sunshine difference is rejected.

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
- **Visual baselines** change in PRs 2, 3, 4, 5, 7 and 8.
- **`e2e/test-utils/fixtures`** — check `mockAccount` / `mockSecondAccount` produce
  non-zero wallet balances once the picker renders totals, or the rows read ₪0.
- **Whole epic is front-end.** No API, no store, no migration. Language was the
  only part that needed a data layer and it is out.
- **README is stale** on the deposit split: it says 60/20/20 where
  `DEPOSIT_SPLIT` is savings 40 / spending 50 / goodDeeds 10. Unrelated to this
  epic, worth a one-line fix in passing.
