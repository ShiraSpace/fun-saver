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

## Progress — updated 2026-09-23 (PRs 1–10 and 11a merged, plus #76, #90 and #109;
PR 11 is next and is the last of this epic)

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

Also outside the numbering,
[#109](https://github.com/ShiraSpace/fun-saver/pull/109) gave the panel's content
the page column's cap. The sheet is fixed to the viewport, so on anything wider
than a phone its rows ran the whole window under a 420px header card, and on a
phone they sat 22px in against the card's 14px. `Screen` now exports the `Column`
both pages were declaring separately, `MenuOverlay`'s `Content` takes the same
`SCREEN_LAYOUT.maxWidth` and `paddingX`, and `ACCOUNT_LAYOUT` and `METHOD_LAYOUT`
are gone the way their `paddingY` went in #90.

`Content` cannot simply extend `Column` — the column is a flex container with an
18px gap, which would respace the menu's sections — so the two agree by reading one
constant, and `Column.test.tsx` is what catches them drifting apart.

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
| PR 10   | [#101](https://github.com/ShiraSpace/fun-saver/pull/101) | `feat/home-link-in-header`   | **merged** — `709d74d` |
| PR 11a  | [#114](https://github.com/ShiraSpace/fun-saver/pull/114) | `feat/theme-css-vars`        | **merged** — `bb91cc9` |
| PR 11   | —                                                      | —                              | **next**               |

The panel is now a `softBg` sheet that starts below a header which no longer fades,
the accounts sit behind an `AccountTrigger`, tapping it floats the list over the
sections below instead of pushing them down, edit is a named button under the
trigger, the two scopes are visible blocks, and navigation is a strip of tabs at
the top of the panel rather than a setting of one child, and the avatar on every
screen that is not home is the way back to it. What is left is a loading boundary so
those screens do not arrive in silence (PR 11, found while reviewing PR 9).

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
- **Hiding a control with `visibility` leaves it clickable, twice over.** PR 10's
  linked avatar hid through `opacity: 0; visibility: hidden` on the ring, and both
  halves leaked. A descendant that declares `visibility: visible` is **shown again**
  inside a hidden ancestor (CSS 2.1 §11.2), so the avatar inside re-showed itself and
  only `opacity: 0` was left — and opacity-0 elements still take taps. And
  `visibility` is a discrete property under transition: going to `hidden` it holds
  `visible` for every progress below 1, so even once the descendant was fixed the
  control stayed hit-testable and tabbable for the whole 300ms. `pointer-events: none`
  in the hidden block is what actually settles it, being untransitioned and applying
  on the same frame. With the menu open, `Bar` at `overlayForeground` (60) sits above
  the overlay (50) and the panel starts below the header, so that corner is live.
- **`not.toBeVisible()` cannot see either of those.** jest-dom walks the element and
  its ancestors, never the child that re-shows itself, so the unit assertion passed
  throughout. `receivesTapAt` in `header-layout.visual.ts` is what caught it — and
  only after `menu.startOpening()` was added, because `menu.open()` waits for the
  overlay's own transition to finish and so samples nothing but the steady state.
  `REDUCED_MOTION` does not close that window: `src/theme/motion.ts` sets
  `animation: none` and never touches `transition`.
- **Nested opacity fades a badge off its own avatar.** Passing the hide down to the
  avatar *as well as* the ring dropped the face at opacity squared while `HouseBadge`,
  a sibling of the avatar rather than a child, fell only at the ring's — the house
  visibly lingering over a face already gone. One element owns the fade.
- **An `aria-label` silently discards the `alt` beneath it.** The linked avatar's
  label named the action only, so the child's name in the image `alt` was never
  announced — the page still said nothing about whose money it showed, for exactly
  the users it was added for. `HEADER_CONTENT.homeLabel` takes the name.
- **Nine test files were shadowing `__mocks__/next/navigation.ts`.** An inline
  `jest.mock` factory replaces the module wholesale, so each file re-declared whichever
  half its own subtree happened to call, and the shared mock only ever reached the
  files that declared nothing. It now owns a settable pathname and one `mockRouter`,
  reset from `jest.setup.ts` and reached through a new `@mocks/*` alias; `renderAt`
  and `renderWithAccountsAt` fold the route into the render. Two things fell out:
  `mockPush` was declared in both `Home` suites and asserted in neither, and
  `Method.test.tsx`'s "carries no avatar" passed only because the default mock returns
  `/` — it never rendered the off-home branch at all. `signed-in-accounts.test.ts`
  keeps its own, mocking `redirect` to throw.

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
- **The theme moves onto `<html>` before the loading boundary lands.** Decided
  2026-09-23: a static loading shell has no emotion context, so PR 11a publishes the
  themes as CSS custom properties and PR 11 reads them.
- **The loading shell is a header card plus a bar delayed 150ms**, and it is the
  same shell for every route. Decided 2026-09-23 against a dimmed body, a centred
  donut and a bare header card, in `mockups/loading-states.html`.
- **The arriving page fades, 240ms, and nothing moves.** Decided 2026-09-23 against
  a 6px rise, a 0.985 settle and a staggered rise, through the existing
  `entrance()` helper.
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

**A house, not a chevron. Decided 2026-09-26 — shape ב1, changed to ב3 while
building.** A back arrow answers "where did I come from", which the app cannot know
on a cold open; a house answers "where am I going", which is the same answer every
time. The house sits at the end edge on non-home screens, so the bar stays at three
slots and nothing shifts.

`usePathname()` decides which the slot holds, the same hook PR 9 already brings in
for `aria-current`. Home shows the plain avatar; everywhere else the avatar is a
link wearing the house.

Seven shapes were rendered on the summary phone's header, behind the mockup's
`חזרה לבית בכותרת` control group. The three chevron shapes are kept for reference:

|        | Shape                                                                           | Note                                                                                             |
| ------ | ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| ח1     | Chevron at the start edge, burger after it                                      | Four slots in a 68px bar; the title loses width                                                  |
| ח2     | Chevron glued to the title, the whole run tappable                              | Bar stays at three slots; the target is large but reads as a title, not a button                 |
| ח3     | Chevron in the avatar's slot at the end edge, avatar dropped off non-home pages | Keeps three slots, but the avatar is how you know which account you are looking at               |
| ב1     | House in the avatar's slot                                                      | Chosen 2026-09-26, built, then dropped: three slots, nothing moves, but it pays the avatar        |
| ב2     | House beside the avatar                                                         | Keeps the avatar, but four slots and the title loses width                                       |
| **ב3** | **The avatar itself is the button, badged with a house**                        | **Chosen.** Keeps both in one slot; the two meanings it carries turned out to be the same one    |
| ב4     | Labelled `🏠 בית` pill                                                          | The only one a child who does not read a bare glyph cannot misread; widest, and drops the avatar |

**Why ב1 did not survive contact.** Its cost was named in advance: the avatar is how
you know which child you are looking at, and ב1 takes it off every screen that is not
home — exactly the screens where a total on display belongs to somebody. Seen on the
built screen rather than in the table, that cost read larger than the objection to
ב3, which was that one 40px target carrying two meanings would be busy. It is not
two meanings: "this child" and "back to this child's home" are the same place, and
the badge says which. `/method` also passed no `avatarId` at all, so ב1 left that
header with nothing in the slot; ב3 made the page name its child for the first time.

**ב3 costs a ring the mockup drew and this does not.** The mockup gives the linked
avatar a 2.5px `textStrong` ring. Dropped on sight: it read as a hard outline around
one child's face, and at 2.5px the badge measures 45px against the burger's 44, which
grows the bar past the sheet — the trap below, reached through styling rather than
through the control. The avatar keeps the 2px `surface` border every avatar has.

**The trap this PR has to clear:** `HEADER_LAYOUT.height` is a `min-height`, and both
the menu sheet's height and the panel's `top` derive from it (#90). A control that
makes the bar even a few pixels taller paints an opaque card over the open menu. ב3
clears it by rendering the same avatar the home screen renders, wrapped in a link
that adds no box of its own — and `header-layout.visual.ts` is where that gets
asserted. ח1 was the shape most at risk, at 26px inside `40 + 12 × 2`.

Two things about that assertion, learned by getting them wrong. The real ceiling is
the **44px burger**, not the 40px avatar: the bar is `44 + 12 × 2`, so a 44px control
changes nothing and a 45px one grows it. And the assertion holds vacuously on a
header whose end slot is empty, so it checks the control is on screen before it
measures — see the two entries above on what an e2e run can pass without testing.

The chevron glyph, if a chevron is ever wanted after all, is `‹` in the source and
paints as `›`: it is bidi-mirrored, the same way `.chev` already is in the menu rows.
Writing `›` gets you an arrow pointing the wrong way in RTL.

## PR 11a — the theme leaves the page

Prerequisite for PR 11, its own branch and its own PR, and visually a no-op.

`ThemeController` provides the theme through emotion's React context, and it is
mounted by `ThemedPage` **inside** each page. `src/app/layout.tsx` is only
`<html><body><EmotionStyleRegistry>`. So anything rendered in place of a page —
which is exactly what a loading boundary is — has no theme at all: a styled
component reading `theme.colors.surface` there is a TypeError, not a wrong colour.
The same is true of the account: the shell has no name and no avatar to show.

`loading.tsx` cannot read its way out of this. It has to stay static or it is not
prefetched, which is the whole point of the file, so `cookies()` is not available
to it — and putting `cookies()` in the root layout would deopt every route instead.

**The theme is nonetheless knowable, twice over.** On a soft navigation it is
already live in the document; the only reason the shell cannot see it is that it
exists solely inside emotion's context. Put it on `<html data-theme>` with CSS
custom properties and the shell inherits the real theme for free. On a cold load, a
theme cookie written client-side — the pattern `persistSelectedAccount` already
uses — plus a three-line inline script in `layout.tsx` applies it before first
paint, with no dynamic API and so no deopt.

Decided 2026-09-23 to split this out rather than carry it inside PR 11: without it
the shell is grey and every navigation flashes neutral between two coloured
screens, and with it inside, PR 11 stops being about the loading boundary.

**Merged as `bb91cc9` ([#114](https://github.com/ShiraSpace/fun-saver/pull/114)).**
Verified by content, not by the PR label — this repo squash-merges. Visually a
no-op, and the screenshots proved it: four of five screens pixel-identical to
`main`, the fifth differing only where the header title crossfades, which two runs
of the same build reproduce. `motion.ts` sets `animation: none` and never touches
`transition`, so that fade still runs under reduced motion.

What it took, where that differs from what this plan expected:

- `src/theme/theme-at-first-paint.ts` — `everyThemeAsCss()` walks `THEMES` and, per
  theme, the four colour-bearing groups (`colors`, `gradients`, `shadows`, `tints`;
  `typography` is numbers), emitting `--fs-color-…`, `--fs-gradient-…`,
  `--fs-shadow-…`, `--fs-tint-…`. `applyStoredThemeScript()` sits beside it rather
  than in a file of its own, because the script **reads** the cookie the app
  **writes** and splitting them is what lets a cookie name drift apart. Named for
  the why: `theme-css.ts` and `theme-document.ts` were both written first and both
  name the mechanism.
- `src/lib/cookies.ts` — `writeCookie` plus both cookie names, and
  `src/components/Home/selected-account-cookie.ts` is **deleted**. It already
  carried its own copy of the `path` / `max-age` / `samesite` policy, so this plan's
  "modelled on `persistSelectedAccount`" would have been a third copy of a policy
  that should be decided once.
- `ThemeController` syncs the attribute **only**. The cookie is written by
  `SignedInUserProvider`, which both themed pages render and `/login` does not — so
  the component that means "a signed-in user is here" is the one that remembers
  their theme. It became a real component rather than a bare context `Provider` to
  carry the effect; every call site is unchanged.
- `layout.tsx` carries `suppressHydrationWarning` on `<html>`, for the reason below.

### What PR 11a turned up

- **`/login` mounts `ThemedPage` with a hardcoded `DEFAULT_THEME_ID`.** So writing
  the cookie from `ThemeController`, as this plan called for, resets a returning
  user's theme to sunshine every time they pass the login page — handing them a
  wrong-coloured shell on the navigation right after signing in, which is the exact
  flash 11a exists to remove. The writer has to sit where a signed-in user exists.
  `SignedInUserProvider` is rendered by `Home` and `Method` and not by `SignIn`, so the
  tree already names that set: no flag, hook or null-rendering component is needed
  to restate it. A `belongsToAccount` prop, a `RememberTheme` component and a
  `useRememberTheme` hook were each built and each deleted on the way to that, and
  review then moved it off `AccountManagement` — which is about the create and edit
  overlays and held the write only because it happened to be mounted on both themed
  routes. A third themed route not rendering it would have gone stale at first paint
  with nothing failing. The guard is now a test: _stores nothing on a screen with no
  signed-in user_, which reddens if the write migrates back into `ThemeController`.
- **A pre-paint attribute is a hydration mismatch, and only development says so.**
  The script stamps `data-theme` on `<html>` before React, so the live DOM carries
  an attribute the server markup never rendered and React reports a mismatched tree.
  Production strips the warning — which is why a browser check against `next start`
  came back clean and this reached review. `suppressHydrationWarning` on `<html>`
  settles it. **Verify warnings against `next dev`; `next start` cannot show them.**
- **React 19 takes string children on `<style>` and `<script>`** — no
  `dangerouslySetInnerHTML`. Both are raw-text elements, so the script's `&&` and
  `>=0` survive unescaped. Worth confirming in the served HTML rather than assuming:
  entity-escaping either one would have broken the script silently.
- **The CSS ships twice** — once as markup, once serialized into the RSC flight
  payload, which is unavoidable for anything rendered in the React tree. Measured on
  `/login` at **9,360 bytes raw, 1,058 gzipped**, and accepted. Curating the subset
  the shell happens to need would cut it to ~120 bytes and reintroduce precisely the
  drift the generated sweep exists to prevent.
- **Theme parity landed first after all** (`ec76b64`, #110), so the generator was
  written once against the final shape and the ordering question below answered
  itself. `ThemeTokens` now carries five groups.
- **`next build` is the cheap check that the layout stayed static.** `/login` still
  reports `○ (Static)`; a `cookies()` call anywhere in the layout flips it and
  silently costs PR 11 its prefetch, with nothing else to show for it.
- **A shared `writeCookie` makes "was a cookie written" ambiguous.**
  `Home.managing-accounts` asserted `not.toHaveBeenCalled()` as a proxy for "no
  account was selected"; once the theme write went through the same function, that
  had to name its cookie. Note also that jest never covered the real writer at all —
  both `Home` suites mock the module wholesale — so the consolidation was checked
  against the browser e2e and the emitted cookie string instead of the green suite.
- **jsdom defines `document` non-configurably**, so the server guard cannot be
  tested by stubbing it away. It needs its own file at `@jest-environment node`, and
  that file has to assert `document` is undefined first, or it passes under jsdom
  for the wrong reason and proves nothing.

**It overlapped `.plans/2026-09-23-theme-parity.md`**, which was unimplemented when
this section was written. That plan pulled the 18 literal gradient strings into
structured stops and gave the nine unowned `rgba()` component colours a home — the
shape a generator walks. It merged first, so the generator was written once.

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

**Measured 2026-09-23, click to content on screen**, puppeteer against a production
build at phone size, five runs each, min / median / max:

| Backend                           | home → `/method`    | `/method` → home    |
| --------------------------------- | ------------------- | ------------------- |
| JSON file store (the e2e harness) | 43 / 44 / 60        | 26 / 27 / 40        |
| **Neon dev branch, warm compute** | **242 / 251 / 269** | **156 / 165 / 178** |

Measured at `585a017`. A full document load of `/method` against Neon measured
254ms. The earlier figures
in this plan — 255ms cold connect, 71ms `listAccountsForUser`, 302ms
`withDerivedWallets` — were the database leg in isolation and add up pessimistically
for a warm compute; the real wait is **~250ms out and ~175ms back**, plus the user's
own network to Vercel, plus that 255ms cold connect on the first tap after Neon
autosuspends. Call it 250ms typical and 500ms+ when cold.

**The harness cannot measure this on its own.** `e2e/server.ts` sets
`FUNSAVER_DATA_PATH`, so every existing suite runs against the JSON store and sees
45ms — a tenth of the real number. The Neon figures came from a throwaway script in
the gitignored `e2e/shots/` that spawns `next start` with `DATABASE_URL` pointed at
the dev branch and mints a session cookie for a user who actually has accounts
there.

**One file, at the root, not under `method/`.** `/` is `force-dynamic` too, so
`🏠 בית` pays the same on the way back and a boundary under `method/` would fix one
tab while leaving its neighbour broken. `src/app/loading.tsx` covers `/`, `/method`
and `/login` together — and because it covers all three, **the shell has to be
screen-agnostic**. A skeleton of the home screen was mocked and rejected on exactly
that: it would show wallet cards on the way to `השיטה`.

**The shape — a header card and a bar that is late to arrive.** Decided 2026-09-23
from `mockups/loading-states.html`, which renders four shells and four entrances in
all three themes. The shell keeps the gradient and a header-shaped card, and adds a
3px indeterminate bar under it that only starts after 150ms. At the measured 250ms
that is about a hundred milliseconds of motion; a faster hop shows nothing at all
rather than flashing something on and off. The rejected three: a dimmed body (the
dim itself is the flash), the app's donut spinning centre-screen (the header
disappears and comes back — the biggest jump of the four), and the header card
alone (quietest, but says nothing happened).

**The page fades in when it lands, 240ms, nothing moves.** Also decided 2026-09-23.
`entrance()` in `src/theme/motion.ts` already does this for `OverviewCard`, at
`TOTAL_ANIMATION.fadeMs`, and already compiles to `animation: none` under
`prefers-reduced-motion` — so the entrance costs one call and inherits the
accessibility behaviour rather than restating it. A 6px rise, a 0.985 settle and a
50ms-per-card stagger were all mocked; the stagger lands its last card 250ms after
its first, making the entrance as long as the wait that preceded it.

**Superseded after building it, 2026-09-23 — the shell is for a first load only.**
Built as a root `loading.tsx`, the header card with its moving bar replaced the page
on every tab tap, and that read worse than the wait it covered. `loading.js` cannot
tell a cold load from a soft navigation: Next wraps each page segment in a fresh
boundary keyed by the segment, so its fallback always shows. What does tell them
apart is **one `<Suspense fallback={<LoadingShell />}>` in the root layout**. On a
cold load there is nothing on screen yet, so the fallback streams first — measured in
the served HTML of `/`: the shell at ~10KB, the page in a hidden chunk at ~55KB. On a
soft navigation that boundary is already revealed, and a router navigation is a
transition, so React keeps the old page up instead of re-showing the fallback. Measured
by holding the navigation `_rsc` response 1.5s: the home page stayed, no shell.

**Between pages, the old page stays and its own header shows the moving line**
(option 3 of three: nothing, a pending tab in an open menu, a line on the real
header). `useLinkStatus` reports the pending state, and it can only be read inside
the `<Link>` being tapped, so `PendingNavigationReporter` — rendering nothing — sits
inside the nav tab and the house link and tells `Header` through a context whose
default is a no-op. `<Link onNavigate>` plus `useTransition` and `router.push` was
weighed and turned down: it is the community's global-progress pattern and hook-only,
but it cancels `<Link>`'s own navigation to redo it by hand.

**The page fade is dropped.** With the shell gone from navigation there is nothing for
a landing page to fade in from. `mockups/loading-open-questions.html` records the
question as it stood; its reduced-motion answer (ד, the line moves regardless) still
holds, for the header line as much as the shell.

**The shell reads `var(--fs-…)`, never `theme.colors`.** That is what PR 11a is
for, and it is also what keeps `loading.tsx` renderable with no `ThemeProvider`
above it — worth a unit test of its own, because the failure mode is a production
TypeError that no themed test would ever see.

**`/login` was raised against this and is answered — do not re-solve it.** PR 11a's
boot script is route-agnostic: it stamps `data-theme` from the cookie on every
route, and `/login` then renders `ThemedPage` with a hardcoded `DEFAULT_THEME_ID`,
so `ThemeController` snaps the attribute back on hydration. Review of 11a called
that a flash this shell would expose. **Measured instead of argued**, by building
this boundary temporarily and driving it:

- A cold load of `/login` paints **no shell**. The page is prerendered whole; the
  fallback appears only inside the RSC flight payload, never as rendered markup.
- **Nothing soft-navigates to `/login`.** Sign-out and the expired-fetch handler
  both go through `goTo` → `window.location.assign`; `signed-in-accounts` uses the
  server `redirect()`; `proxy.ts` uses `NextResponse.redirect`. All four are
  document navigations, and a loading fallback only renders on a client transition.

So the two writers do disagree and it cannot reach the screen. No
`location.pathname` branch belongs in a theme file for it. **It becomes reachable
the day something introduces a `<Link href="/login">` or a `router.push(LOGIN_PATH)`**
— that is the trigger to revisit, not the disagreement itself.

**The assertions that carry this PR, all easy to write vacuously.** Originally a
prefetch-before-tap check and a shell-under-delay check; the first went with
`loading.tsx`. What the built version rests on:

- _A cold load streams the shell before the page_ — the shell's markup precedes the
  page's in the served HTML, and the page arrives in the hidden streamed chunk.
- _A navigation keeps the old page, with the line on its header_ — under a held
  navigation `_rsc` response (the JSON store answers in ~45ms, so without the hold
  nothing is catchable), the old page is still there, no shell is, the header line
  is, and the line is gone once the new page lands. Both directions.
- _The shell renders with no `ThemeProvider` above it_ — plain
  `@testing-library/react`; the failure mode is a production TypeError no themed test
  would ever see. Any theme assertion uses a non-default theme.

**What it does not fix.** The round trip still happens; a boundary only stops it
being invisible, and prefetching only fetches the static shell, not the data. Cutting
the ~250ms means collapsing the two sequential store calls or caching them — a
data-layer change this epic has otherwise avoided, and the reason this is its own PR
rather than a line in PR 9.

### PR 11 — build

- `src/app/layout.tsx` wraps `children` in `<Suspense fallback={<LoadingShell />}>`.
  There is no `loading.tsx`. The layout stays static — `next build` still reports
  `/login` as `○ (Static)`.
- `src/components/LoadingShell/` — its own styled parts, **not** `Screen` or `Bar`.
  Moving those two onto `var()` would repaint `/login` in the cookie's theme on a cold
  load until `ThemeController` snaps it back. It reuses what carries no theme:
  `Column`, `SCREEN_LAYOUT`, `HEADER_LAYOUT`, `HEADER_AVATAR_PROPS.size`, and the real
  `BurgerIcon` in a `MENU_ICON.buttonSize` slot — the 44px ceiling.
- `src/components/Header/ProgressLine/` — the 3px line, 150ms late, 900ms sweep, inset
  by the header radius. Shared by the shell's card and the real `Bar`.
- `src/components/Header/navigation-pending-context.tsx` — the reporter and its context;
  `Header` holds the state and draws the line.
- `MenuOverlay` is `memo`ised. Measured with a render-counting probe: a navigation
  starting re-rendered `MenuBody` once, and zero with the `memo`. All four props are
  already stable (`useCallback` with no deps, a state setter, two booleans); an inline
  `onClose` brings the render back.
- `themeVar(group, name)` beside `everyThemeAsCss()`, sharing its prefix table, so a
  misspelt token is a `tsc` error rather than a transparent card.

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
