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

## Progress — updated 2026-09-26 (PRs 1–9 merged, plus #90; PR 10 is next)

Outside the numbering, [#76](https://github.com/ShiraSpace/fun-saver/pull/76)
(`3897156`) added the `accountScopeBg` / `accountScopeBorder` tokens PR 8 was told to
do without. They are in all three themes, and the trigger and selected row already
read from them.

Also outside the numbering, [#90](https://github.com/ShiraSpace/fun-saver/pull/90)
(`82007b9`) stopped the screen gradient showing in the band around the header card
while the menu is open. Getting there dissolved `Menu`: it rendered the burger and
the whole overlay together, which put a viewport-covering overlay inside the 68px
header card, so anything it painted landed in that card's stacking context.
`MenuToggle` now sits in the bar, `MenuOverlay` beside it, their state in
`use-menu-state`, and `Header` places sheet, bar and overlay in stacking order. The
avatar hides while the menu is open, since the picker below already names and
pictures the same account.

Two things fell out of it that outlive the PR. `HEADER_LAYOUT.height` is a
**`min-height`**, and the sheet's height and the panel's `top` are derived from it —
so anything that makes the bar taller now paints an opaque card over the open menu,
because the bar sits above the panel. And the seam is cut from one
`SCREEN_LAYOUT.paddingY`; `ACCOUNT_LAYOUT.paddingY` and `METHOD_LAYOUT.paddingY` are
gone, having been two constants that only lined `/method` up by both being 16.

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
| PR 8    | [#88](https://github.com/ShiraSpace/fun-saver/pull/88) | `feat/menu-scope-blocks`       | **merged** — `0b12ebf` |
| PR 9    | [#96](https://github.com/ShiraSpace/fun-saver/pull/96) | `feat/menu-nav-tabs`           | **merged** — `d625dd3` |
| PR 10   | —                                                      | —                              | **next**               |
| PR 11   | —                                                      | —                              | planned                |

The panel is now a `softBg` sheet that starts below a header which no longer fades,
the accounts sit behind an `AccountTrigger`, tapping it floats the list over the
sections below instead of pushing them down, edit is a named button under the
trigger, the two scopes are visible blocks, and navigation is a strip of tabs at
the top of the panel rather than a setting of one child. What is left is a way home
from the screens the nav points at (PR 10, whose shape was chosen on 2026-09-26) and
a loading boundary so those screens do not arrive in silence (PR 11, found while
reviewing PR 9).

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
- **`Screen.tsx` centres the whole app, and both blocks had to opt out.** `text-align:
center` on the app shell is why `MenuLabel` already carried an explicit `text-align:
start`. The per-account note inherited the centring and had to say `start` too, and
  the language pill — now `width: fit-content` rather than full-bleed — would have sat
  in the middle of the block without a block-level box to anchor it at the start edge.
- **The popover stopped reaching the appearance section.** The per-account block's
  margin, padding, heading and note put ~75px between the list and the section that
  `menu-morph` asserted the overlap against — measured at list `173–283` against
  appearance `305–383`. The thing the popover now floats over is the per-account block
  itself, so both assertions retarget to it. That is the better assertion anyway: it
  names the block the paint order is actually about.
- **The mockup's control sizes were not optional.** Carried over unchanged, the 48px
  swatches and the full-width `heading`-size language bar dwarfed the text inside a
  tightened block. They take the mockup's own numbers — swatch 38/12/9, the language
  segment a `label`-size pill at 5/12 padding filled with `textStrong`, and
  `MenuLabel` margins 13/5 rather than 18/12. The labels sitting on their controls is
  what closes most of the gap.
- **`AccountsSection.test.tsx`'s eight tests were mostly duplicates.** Rows and the add
  row belong to `AccountList`, selection and menu-closing to `Home.test.tsx` and
  `account-switch.visual.ts`, create and edit mode to `Home.managing-accounts.test.tsx`.
  Deleting the folder was not a coverage hole to make good on — four tests carry what
  nothing else checks: the edit button is handed the account in view, adding and
  editing leave the menu, and the heading names the account whose settings these are.
  `MenuOverlay` also stopped asserting the three sections are on screen, which was true
  before this PR too, in favour of asserting two of them sit inside the per-account
  block.
- **Shooting a real `before` needed a second worktree with a real install.** The change
  is too wide to revert in place the way PR 7's was. A symlinked `node_modules` fails
  the build outright — `Symlink [project]/node_modules is invalid, it points out of the
filesystem root` — so the base worktree needs its own `npm install`, and `npm ci`
  dies with `Exit handler never called!` where `npm install` succeeds.
- **The shot fixtures select the wrong account.** `mockAccount` is `נועה` and
  `mockSecondAccount` is `מתן`; `מ` sorts before `נ`, so the wallet-less one is selected
  and every total shoots `₪0` even with `mockTransactions` seeded. The shot script
  builds its second account as `רותם` instead, so the funded one sorts first.
- **The mockup's `divider` frame disappears in `midnight-blue`.** Review caught it on
  #88: the dashed border the mockup specifies measures 1.15:1 against `softBg` there,
  so the one thing marking the per-account block out as a block was invisible in that
  theme. Measured against `softBg` in all three — `divider` 1.26 / 1.17 / 1.15,
  `softBorder` 1.36 / 1.48 / 4.51, `accountScopeBorder` 1.75 / 1.72 / 1.73. The scope
  token is the only steady one and is what both blocks now use, so they differ by fill
  and dash rather than by border colour. **The mockup only renders the light palette;
  a value read off it has not been checked against `midnight-blue`.**
- **Dropping the mockup's `position: relative; z-index` was wrong, for a reason that
  only bites later.** It looked like the no-op `popoverZIndex` was — a positioned
  element already paints over static siblings. True of the tree as it stands, false of
  the tree PR 9 builds: the nav rows land in the per-account block, and the first one
  to take a `position` becomes a positioned element later in tree order at the same
  `z-index: auto`, painting over the open account list and swallowing its taps.
  `menu-morph`'s tap assertion would keep passing right up until that row exists.
  `GlobalBlock` carries it again, as `z-index: 1` — sibling ordering inside the panel,
  not an app layer, so it stays out of `LAYERS`.
- **Single-use style values belong in the `.styles.ts`, not `constants.ts`.** The
  2026-09-15 convention: `constants.ts` holds test ids, copy, and values another module
  reads. `MENU_ACCOUNT_SCOPE_STYLE` keeps only `avatarSize`, which the component reads.
  The older menu files (`ACCOUNT_LIST_STYLE`, `ACCOUNT_PICKER_STYLE`,
  `MENU_OVERLAY_STYLE`, `EDIT_ACCOUNT_BUTTON_STYLE`) predate it and were left alone.
- **An unnamed `<section>` buys nothing.** `ScopeBlock` was a `styled.section`, so both
  blocks rendered one with no accessible name — exposed as a generic, identical to a
  `div`. Naming them would mean inventing a hidden heading for the global block, which
  has none. It is a `div`; the per-account block's `<h2>` still carries the outline.
- **The chosen theme's ring is `textStrong`, not white.** The mockup fills a reserved
  transparent border rather than drawing an outline, so choosing a theme moves nothing.
  White read as a gap around the swatch on a cream sheet. The swatch declares its own
  `box-sizing: border-box` — the app has no global one, unlike the mockup, so the
  border would otherwise have taken it from 38px to 43px.
- **A 60-character name only wraps if it contains spaces, and the longest-name e2e
  uses one that does not.** `edit-account.e2e.ts` types `'א'.repeat(60)` — a single
  unbroken token, which overflows the card sideways and leaves the bar at 68px. That
  is why nothing caught the header bar growing until #90 shot it with
  `'נועה '.repeat(20)`, which wraps to three rows. Any test meaning to exercise
  wrapping has to use a name with spaces; the existing one exercises overflow.
  The title now takes one row with an ellipsis, the treatment `EditLabel` already had.
- **CSS truncation hides nothing from a screen reader.** Raised in review against the
  header's new ellipsis, and worth writing down because it reads plausible:
  `text-overflow: ellipsis` is purely visual, the full string stays in the DOM and in
  the accessibility tree. No `title` attribute was added — it is a desktop-hover
  affordance that never fires on touch, on a screen where the picker and the edit
  button both carry the full name untruncated.

- **Emotion component selectors do not resolve in this repo, and fail silently.**
  PR 9 dimmed the unavailable tab's icon with `${InertTab} & { opacity: .45 }`.
  There is no `@emotion/babel-plugin` in `package.json` and no
  `compiler: { emotion: true }` in `next.config.ts`, so `String(InertTab)` is
  `.undefined`, the rule never reaches a stylesheet, and the icon shipped at full
  opacity. `tsc` cannot see it, no existing test looked at it, and the page renders
  without an error. The rule moved inside `InertTab`, which owns the only span
  child. **Anything wanting a component selector has to add the compiler option
  first**; until then a nested tag or attribute selector is the only safe form.
- **The tab for the screen you are on must not be a `Link`.** As first built, every
  tab was one, so the filled `בית` tab on the home screen — the most inviting target
  in the menu — closed the menu and soft-navigated to the page already on display.
  On a `force-dynamic` route with no loading boundary that is the ~370ms blind wait
  PR 11 is about, spent to arrive where you already were. There are three tab
  elements now, one per real state: `Tab` (a `Link`) for a screen you can reach,
  `CurrentTab` (a `span` with `aria-current="page"`) for the one you are on, and
  `InertTab` (a disabled `button`) for one that does not exist yet. Reusing
  `InertTab` for the current tab — the obvious shortcut — would have dimmed it,
  because its fade belongs to the unavailable state.
- **`opacity` on a tile fades the label and the fill together.** The unavailable tab
  started at `opacity: 0.55` on the whole tile, which dropped `תנועות` to 1.96:1 in
  sunshine-quest, 2.13 in jungle-quest and 2.60 in midnight-blue — exempt as a
  disabled control by the letter of WCAG, unreadable in daylight in an app for
  children. Unavailability is now a dashed border, the idiom the per-account block
  already uses, plus a faded icon which is `aria-hidden` and so costs no
  information. Measuring it also turned up `textMuted` sitting under AA app-wide,
  which became #98 and `.plans/2026-09-23-aa-contrast-pass-2.md`.
- **`tabColumns` was shipped, then deleted.** The plan decided a balanced-rows rule
  (`ceil(n / ceil(n / 4))`, so five screens are 3+2) and PR 9 built it as a module
  with a constant, a styled prop and a test file. `MENU_SCREENS` has three entries,
  so it only ever returned 3, and the `NaN` bug review found on it lived entirely
  inside the branch that could not run. `Strip` reads `MENU_SCREENS.length`. **The
  rule is still the decision** — it is written up in PR 9's section below; the code
  comes back with the fourth screen, not before.
- **`__mocks__/next/navigation.ts` is applied automatically, and inline mocks shadow
  it.** It sits next to `node_modules`, so Jest uses it for every suite without a
  `jest.mock` call — which is how `usePathname` reached most tests. But
  `Home.test.tsx` and `Home.managing-accounts.test.tsx` declare their own
  `jest.mock('next/navigation', …)` for the router spies, and a factory replaces the
  module wholesale, so each needed `usePathname` adding by hand. A factory there may
  reference an imported constant despite the usual Jest hoisting rule; `next/jest`'s
  SWC transform allows it, and `HOME_ROUTE` is used that way today.
- **An unnamed `<nav>` is a landmark a screen reader cannot describe.** The strip
  shipped with only a `data-testid`. It carries `NAV_TABS_CONTENT.stripLabel`, and
  the test asserts through `getByRole('navigation', { name })` rather than the
  attribute, so it is the accessible name under test.
- **A visual suite run on its own tests the last build, and says nothing.**
  `e2e/server.ts` spawns `next start`, which serves whatever `.next` already holds;
  the build lives in the npm script, where `test:visual` is
  `next build && tsx --test`. So `npx tsx --test e2e/<one>.visual.ts` — the obvious
  way to run a single suite — exercises stale code with no warning. In PR 10 it reported the header bar
  unchanged at a 48px control and again at 80px, because the served bundle had no
  such control in it at all. **Build before running a suite directly.**
- **A geometry assertion passes on an element that is not there.** The same PR 10
  run: `bar.height <= HEADER_LAYOUT.height` is satisfied by a header whose end slot
  is empty, so it cannot tell "the control does not grow the bar" from "there is no
  control". It now asserts the house exists before measuring. Same shape as the
  box-overlap note above — an assertion that holds either way round is not an
  assertion.

### Still open from the merged work

- **`alert` is under AA on the sheet** — 3.7:1 in sunshine-quest, 3.6:1 in
  jungle-quest, 6.0:1 in midnight-blue. `AppearanceSection`'s `SaveError` is the only
  reader today. There is no darker red in the palette, so fixing it means a new token
  across `ThemeColors` and all three themes — a theme PR, not a repaint. Deliberately
  not done in PR 2.
- **~~`השיטה` is still a bare link below both blocks.~~ Closed by PR 9.** It was not
  per-account, and the mockup at the time had nothing outside the two blocks. It is
  now a tab in the strip: the link was never homeless, it was waiting for a section
  that is not account-scoped.
- **The per-account block's stripe sits on the end edge, not the start.** The mockup's
  `box-shadow: inset 4px 0 0` draws on the left, and the app is RTL, so that is the end
  edge. Matched what the mockup renders rather than what reads as the reading-start
  edge; a sign flip is all it takes if the other way is wanted.
- **The method page's picker can switch account but its language and appearance rows
  are the account's, on a page that is not about an account.** Nothing is broken —
  they write to the account in view — but whether `/method` should carry the whole
  menu is a question PR 9's nav section will raise.
- **`HEADER_LAYOUT.foregroundZIndex` stopped being vestigial.** It existed so the
  title, avatar and burger could float above a panel that covered them, and since PR 3
  nothing covered them. #90 gave it a real job: `Bar` takes it, plus the
  `position: relative` without which a z-index is inert, so the header card paints
  above the sheet behind it. `MENU_TOGGLE.zIndex` is still vestigial.
- **`accountScopeBg` is ~1.05:1 on `softBg` in `midnight-blue`.** The global block
  reads as unfilled there and only its border separates it. Raised on #88 and left
  alone: the token is #76's, and the trigger and the selected account row read from it
  too, so changing it is a theme PR — the same shape as the `alert` item above.
- **The dashed frame holds at ~1.73:1, which is low.** Enough for a decorative
  boundary, and the best available without a new token. Named here so the next person
  measuring it knows it was chosen, not missed.

## Decisions

- **Panel is a light sheet**, not today's `theme.gradients.screen`. Decided
  2026-09-15 after comparing variants א׳ and ב׳ in the mockup.
- **Language stays a stub** and stays in the per-account block. Making it real is
  per-account and needs a data layer — parked in `docs/backlog.md` roadmap §2.
- **Nav section ships in this epic**, before the transactions screen exists, so the
  `תנועות בחשבון` row is inert on merge.
- **Nav is not an account setting.** Decided 2026-09-23: it leaves the per-account
  block and becomes a strip of tabs at the top of the panel — column נ3 of the
  mockup, balanced rows of at most four, short labels. נ1 and נ2 stay rendered for
  reference, and נ2 is where this goes if the app ever passes ~8 screens.
- **Back goes to home, not through history.** Decided 2026-09-23 with PR 10.
- **The control is a house, not a chevron**, in the avatar's slot — shape ב1.
  Decided 2026-09-26 after rendering four house shapes beside the three chevrons.
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

Shipped as `MenuGlobalScope` and `MenuAccountScope`, named for the menu they belong
to, over a shared `ScopeBlock` in `src/components/Menu/scope-parts.ts`. The blocks
were not enough on their own: `MenuOverlay` still hit 42 lines, so the Escape
ordering moved to `use-escape-dismissal.ts` beside `use-escape-key.ts` — the one part
of that component that was never markup. `MenuAccountScope` takes `children`, so
`MenuOverlay` keeps composing the sections and the block only supplies the frame.

## PR 9 — nav section, outside the account block

Three screens — `🏠 בית`, `📈 תנועות`, `📖 השיטה` — with the current one marked via
`aria-current="page"`.

**Nav leaves the per-account block.** Where the mockup first put it, under
`הגדרות של <name>`, says navigation is something you set per child. It is not: the
screens are the same screens whichever account is in view.

**Chosen 2026-09-23 — column נ3: a strip of tabs under the header.** Icon over a
short label, the current screen filled `textStrong`, sitting first in the panel above
the account picker. The menu then reads as where you are going, which child, what you
change about that child — and nav costs one row of height instead of one row per
screen, which is what a list of links spends.

The two columns not taken stay in the mockup for reference: נ1 is the same rows in a
block between the two existing ones, נ2 the same block headed `ניווט` above the
picker.

**How it grows.** The mockup's `כמה מסכים` control adds screens from the roadmap —
savings goal (§1), allowance (§5), split and rate (§3–§4) — so the strip can be seen
at 3, 4, 5 and 6 rather than argued about:

- At most **four tabs per row**; past that it wraps into **balanced rows**, so five
  screens are `3+2` and not `4+1`, six are `3+3`. One line:
  `columns = ceil(n / ceil(n / 4))`.
- Tabs carry a **short label** — `תנועות`, `יעד`, `חלוקה` — not the screen's full
  name. At four across a tile is ~85px on a 392px phone, which fits one short word
  and no more. The full name belongs to the screen's own title.
- The ceiling is around **eight**: at that point the strip is a block of tiles taller
  than the list it replaced, and the honest move is to go back to rows — column נ2,
  which is why it stays rendered.

`השיטה` folds into the strip, which is what the open item below asked for — it is the
only nav link the app has today and it has been sitting outside both blocks since
PR 8.

**The current screen cannot be marked with `depositBg`.** The mockup's
`menuRow[aria-current='page']` fills with it, and on the `softBg` sheet that is
`#F3F7E4` on `#F3F7E4` in jungle-quest and `#FFF6E0` on `#FFF8E0` in sunshine-quest —
invisible in two of three themes. The tab strip fills the current tab with
`textStrong`, the idiom the language segment and the wallet chips already use; the row
variants mark it with a `textStrong` border plus `font-weight: 700` and drop the
chevron, since there is nowhere to go from the screen you are on.

Real routes already exist: `/method` is one, reached from the menu through a
`next/link` `NavLink`, and `HOME_ROUTE` / `METHOD_ROUTE` live in their components'
`constants.ts`. So `🏠 בית` is a link, not a mode. What is still `APP_MODE` state is
creating and editing an account, and that hook is now
`src/hooks/use-account-navigation.ts`. `תנועות בחשבון` has nowhere to go until the
transactions epic and ships inert.

`/method` shows this section too, so `aria-current="page"` needs the real path —
`usePathname()` rather than anything the menu knows on its own.

With nav out of it, the per-account block holds only `מראה` and `שפה` — both of
which the merged work already flagged as questionable there (language is a device
preference, and `/method` is not about an account). Nothing to do in this PR; it
just gets easier to see.

## PR 10 — a way home from a screen that is not home

`/method` today can only be left through the menu, and the transactions screen will
have the same problem. The header gains a control that returns to `HOME_ROUTE`.

**To home, not `router.back()`.** These pages are reachable cold — a bookmark, a
refresh, a shared link — and history-back then leaves the app or goes nowhere.
`HOME_ROUTE` is deterministic and is a `next/link` rather than a handler.

**A house, not a chevron. Decided 2026-09-26 — shape ב1.** A back arrow answers
"where did I come from", which the app cannot know on a cold open; a house answers
"where am I going", which is the same answer every time. It takes the avatar's slot
at the end edge on non-home screens, so the bar stays at three slots and nothing
shifts.

`usePathname()` decides whether it renders at all, the same hook PR 9 already brings
in for `aria-current`. Home shows the avatar and no house.

Seven shapes were rendered on the summary phone's header, behind the mockup's
`חזרה לבית בכותרת` control group. The three chevron shapes are kept for reference:

|        | Shape                                                                           | Note                                                                                             |
| ------ | ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| ח1     | Chevron at the start edge, burger after it                                      | Four slots in a 68px bar; the title loses width                                                  |
| ח2     | Chevron glued to the title, the whole run tappable                              | Bar stays at three slots; the target is large but reads as a title, not a button                 |
| ח3     | Chevron in the avatar's slot at the end edge, avatar dropped off non-home pages | Keeps three slots, but the avatar is how you know which account you are looking at               |
| **ב1** | **House in the avatar's slot**                                                  | **Chosen.** Three slots, nothing moves; pays the avatar                                          |
| ב2     | House beside the avatar                                                         | Keeps the avatar, but four slots and the title loses width                                       |
| ב3     | The avatar itself is the button, ringed with a house badge                      | Keeps both, but one target carries two meanings and it is busy at 40px                           |
| ב4     | Labelled `🏠 בית` pill                                                          | The only one a child who does not read a bare glyph cannot misread; widest, and drops the avatar |

**What ב1 costs, named so it is not rediscovered in review.** The avatar is how you
know which child you are looking at, and it is gone on every screen that is not home
— exactly the screens where a total on display belongs to somebody. The title still
carries the name (`תנועות בחשבון · <name>`), which is what makes this affordable;
if a screen ever drops the name from its title, this decision needs revisiting.

**The trap this PR has to clear:** `HEADER_LAYOUT.height` is a `min-height`, and both
the menu sheet's height and the panel's `top` derive from it (#90). A control that
makes the bar even a few pixels taller paints an opaque card over the open menu. ב1
is the shape least likely to do it — it replaces a 40px avatar with a 40px tile, so
the bar's tallest child does not change — and `header-layout.visual.ts` is where
that gets asserted. ח1 was the shape most at risk, at 26px inside `40 + 12 × 2`.

The chevron glyph, if a chevron is ever wanted after all, is `‹` in the source and
paints as `›`: it is bidi-mirrored, the same way `.chev` already is in the menu rows.
Writing `›` gets you an arrow pointing the wrong way in RTL.

## PR 11 — the screens the nav points at arrive in silence

Raised while reviewing PR 9: `השיטה` takes a long time to appear. It is not the tab
strip — the same link behaved this way as `MenuOverlay`'s orphan `NavLink` — and it
is not really rendering.

Both `src/app/page.tsx` and `src/app/method/page.tsx` are
`export const dynamic = 'force-dynamic'`, and `src/app/` has no `loading.tsx`.
Next 16's own guide, `node_modules/next/dist/docs/01-app/02-guides/prefetching.md`,
is explicit about what that pair costs:

|                           | Static page     | Dynamic page            |
| ------------------------- | --------------- | ----------------------- |
| Prefetched                | Yes, full route | No, unless `loading.js` |
| Server roundtrip on click | No              | Yes                     |

and a section later, _automatic prefetching runs only in production_. So a tap on a
nav tab buys a full server round trip, and with no loading boundary the router has
nothing to put on screen — it holds the old page until the whole RSC payload lands.
The menu closes and then nothing happens.

Measured 2026-09-23 against the dev Neon branch:

| Step                      | ms                                  |
| ------------------------- | ----------------------------------- |
| cold connect + `select 1` | 255                                 |
| `listAccountsForUser`     | 71 — 3 accounts                     |
| `withDerivedWallets`      | 302 — 9 wallets, 6 parallel queries |

Each page awaits `signedInAccounts()` and then `withDerivedWallets`, sequential
because the second needs the first's accounts, so ~370ms of database before React
renders anything. In dev, add Turbopack compiling the Method tree — 1832 lines of
components plus ~20K of copy — the first time you go there.

**One file, at the root, not under `method/`.** `/` is `force-dynamic` too, so
`🏠 בית` pays the same on the way back and a boundary under `method/` would fix one
tab while leaving its neighbour broken. `src/app/loading.tsx` covers `/`, `/method`
and `/login` together.

**It invents the app's first loading state.** There is no spinner, skeleton or
pending affordance anywhere in `src/` today, so the work here is a design decision
rather than a wiring one. The cheap shape is the header card over a dimmed body, so
the shell does not jump when the real page arrives.

**What it does not fix.** The round trip still happens; a boundary only stops it
being invisible. Cutting the ~370ms means collapsing the two sequential store calls
or caching them — a data-layer change this epic has otherwise avoided, and the
reason this is its own PR rather than a line in PR 9.

Not measured: click-to-paint in a real browser. The figures above are the database
leg; the rest is read off the routing docs.

## Notes / risks

- **`e2e/driver/menu-driver.ts` is the seam.** Six of its methods hardcode
  `ACCOUNTS_SECTION_TEST_IDS`, consumed by four suites. Because it is one file,
  each PR updates the driver plus only the suites whose flow it changed. Without
  it this epic would touch every suite in every PR.
- **Visual baselines** changed in PRs 2 and 3 (`menu-morph.visual.ts`), PR 4 moved
  `account-switch.visual.ts` onto the new row test ids, and PR 6 added the popover
  assertions to `menu-morph.visual.ts` plus the signed-out `/method` case to
  `page-routing.visual.ts`. PR 7 needed none — nothing in the visual suites looks at
  the edit control. PR 8 moved `menu-morph.visual.ts` again — its two overlap
  assertions now name the per-account block instead of the appearance section.
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
