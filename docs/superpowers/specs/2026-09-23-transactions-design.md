# The transactions screen — design

> Status: **design approved 2026-09-23**, revised after review 2026-09-23,
> revised again after a second review the same day, and a third time after a
> review that measured the colour table it had only asserted and re-did its
> payload arithmetic. `sunshine-quest`'s chart-line colours settled 2026-09-23
> in PR 1 (the plan's decision A).
> Implementation in progress; PR 1, the chart-line colour tokens, merged as #122;
> PR 2, the whole-ledger store read, as #125; PR 3, the shared read, as #129.
> Mockup: `mockups/account-summary/transactions.html` + `account-summary.js` —
> one screen, no competing variants; the controls beneath it are details inside
> that screen. The mockup is the specification of record for anything this
> document leaves ambiguous.
> Second of the two epics opened by `.plans/2026-09-15-menu-redesign.md`, which
> shipped the `תנועות` nav tab inert and left this plan unwritten.
> Implementation plan: `.plans/2026-09-23-transactions.md` (PRs 1–9).
> PR numbers below refer to it and are provisional until it exists; the order
> they must fall in is fixed under "Delivery order" at the end of this document.

## Purpose

Answer two questions the home screen cannot: **how did the balance get here**,
and **what happened**. The graph carries the first, the list the second. Both are
scoped to one account, and the account is the only global thing on the screen —
picking a different child in the menu changes graph, list and theme together.

## Scope

**In:** one route, `/transactions`. The chart card with its total, change pill,
total/per-wallet chips and four ranges. The transaction list with month sections,
type filters and a monthly/daily interest rollup. Hebrew only, RTL. Plus five
things outside the route that the screen cannot ship without:

- three new chart-line colour tokens across all three themes;
- turning `getWalletsForAccount` inside out so one read serves both the wallets
  and the ledger;
- `listByAccount` on `TransactionRepository`, `DataStore`, `RepositoryStore` and all
  three repositories;
- `WALLET_SHORT_LABEL` hoisted out of `BalanceBreakdown` into `src/lib/constants.ts`,
  which edits a shipped screen's constants;
- `monthLabel()` in `src/lib/dates.ts`, and an `href` on the `transactions` entry
  of `NAVIGATION_DESTINATIONS`.

**Out (deliberate):**
- **No new API route.** Every read in this app is a server component. The only
  `GET` handler in the tree is NextAuth's catch-all
  (`src/app/api/auth/[...nextauth]/route.ts`); no hand-written data `GET` exists
  and this screen does not introduce the first.
- **No charting dependency.** The geometry is ~150 lines of path math that
  already exists in the mockup.
- **No date-range picker.** Four fixed ranges, no custom span.
- **No per-transaction detail view**, no editing, no deleting. The list is
  read-only; money is changed through the existing drawer.
- **No English.** Same reasoning as the method page — `docs/backlog.md` §2.

## Route and entry point

`/transactions`, a server component in the shape `/method/page.tsx` already has:
resolve the signed-in user's accounts, redirect to `HOME_ROUTE` if there is no
selected account, wrap in `ThemedPage`, hand a client component every account.
Header title `תנועות`, from a `TRANSACTIONS_COPY` constant — the screen's own
name, the way `/method` titles itself `השיטה`. The account is deliberately not in
the title. `/` titles itself with the account name and `/method` with the
screen's; `תנועות בחשבון · {name}` would be a third pattern, and at 22px in the
~284px between the burger and the home avatar it ellipsises for a long child's
name, truncating the one part that would have justified it. The child is already
named by the avatar, by the menu's account trigger, and by the theme.

The `transactions` entry in the `NAVIGATION_DESTINATIONS` array
(`src/components/Menu/NavigationTabs/constants.ts`) has no `href` today — the menu epic
shipped it inert precisely because this screen did not exist. It gains an `href`
of `TRANSACTIONS_ROUTE` once the route renders (see "Delivery order"); the
constant lives in `src/components/Transactions/constants.ts`, its own screen's
folder, where `HOME_ROUTE` and `METHOD_ROUTE` each live in theirs, and
`NAVIGATION_DESTINATIONS` imports it the way it already imports those two. The header's house control from menu-epic
PR 10 already covers the way home — `Header` swaps the avatar for `HomeAvatarLink`
on any non-home path — and `usePathname()` already drives `aria-current`, so
neither needs work here.

## Data

### What exists

`DataStore` exposes only `listTransactionsByWallet(accountId, walletId)`.
`getWalletsForAccount` loops the three wallets, calls it once each, settles
interest, inserts accrued rows, derives a `WalletSummary`, and **discards the
transactions**. The transactions screen needs exactly those rows, and needs the
settlement to have happened or it renders stale history.

### The shared read

Rather than adding a second path beside `getWalletsForAccount`, the existing one
is turned inside out:

```
settleInterest({ store, accounts, asOf })
  -> { account: AccountSummary, transactions: Transaction[] }[]

summarizeAccounts = settleInterest(...).map((settledAccount) => settledAccount.account)
```

One `listTransactionsByAccount` call per account, grouped by `walletId`, each
wallet settled through `addDailyInterest`, accrued rows inserted in **one** write.
The returned `transactions` are the **settled** set — stored rows plus the rows
just accrued — because the screen must not render history one settlement behind.
They come back oldest first, the rows just accrued sorted in, so the first visit
reads in the same order as every later one.
`/` and `/method` keep their current signature and get faster: per account, 3
queries become 1 and 3 inserts become 1. It stays one insert **per account** —
`summarizeAccounts` still maps over accounts — because batching the settlement
of unrelated accounts into one write buys nothing at three children.
`getWalletsForAccount` has no caller outside `summarizeAccounts` and its own
tests, so the refactor is contained: it stops being exported, and its body becomes
`settleInterest`' per-account branch. The one existing test file it rewrites
exercised `getWalletsForAccount` directly; it moves with the code, from
`account-dashboard` to `src/lib/__tests__/interest-settlement.test.ts`.

Three details the grouping has to get right that the current per-wallet loop
cannot get wrong:

- **A wallet with no transactions must still derive.** Today each wallet is
  queried on its own, so an empty result is an empty array. Grouped, a wallet
  absent from the map reads `undefined` and `summarizeWallet` throws on it. Every
  brand-new account is exactly that case, and it is the case this screen exists
  to render. The grouping therefore seeds a bucket per wallet in
  `account.wallets`, not per `walletId` present in the rows.
- **The insert stays guarded.** `if (accrued.length > 0)` is not decoration:
  under the json-file store an unguarded `insertTransactions([])` rewrites
  `data.json` on every render of every screen.
- **Rows are projected before they cross the wire.** See the payload note under
  "Deliberate simplifications" — the page ships five fields per row, not a
  `Transaction`, and both derivations take the projection.

`/transactions/page.tsx` hands the client shell the `AccountSummary[]`
that `useAccountNavigation` already takes, plus the projected transactions keyed by
account id. Switching child reads the new key; nothing about `useAccountNavigation`
changes.

### Store contract

`TransactionRepository` gains `listByAccount(accountId): Promise<Transaction[]>`,
surfaced on `DataStore` as `listTransactionsByAccount`, delegated in `RepositoryStore`,
and implemented in the memory, json-file and postgres stores. Postgres orders by `occurred_at, created_at, id` —
the same three keys `listByWallet` already uses, `id` included, because interest
rows accrued in one settlement run can share `created_at` to the millisecond. The
existing `transactions_account_wallet_idx` on `(account_id, wallet_id)` covers the
`account_id` prefix, so there is **no new index and no migration**.

`listTransactionsByWallet` stays. `addWithdrawal` uses it for the overdraft check
and has no reason to read the whole account.

**Every store returns the same order: oldest first.** `listByAccount` and
`listByWallet` both sort by `occurred_at, created_at, id` — postgres in SQL, the
memory and json-file repositories through one shared `inOrderOfOccurrence`
(`src/db/transaction-order.ts`) — so dev (json-file) and prod (postgres) hand back the
same rows in the same order. The derivations still do not lean on it:
`balance-history` is independent of order and `transaction-rows` sorts newest
first for display. The index covers the `account_id` lookup, not the sort, so
Postgres adds a sort node over roughly a thousand rows, which costs nothing at
this size.

### Why every account, not just the selected one

`/method` hands its client component all accounts and switches between them in
client state through `useAccountNavigation`, with no server round trip. The mockup
requires the same here, so the page loads every visible account's transactions and
account switching stays free.

`/method` is the precedent for the **interaction**, not for the cost: its
per-account payload is three wallets, this one is a whole ledger. The cost is
therefore argued on its own terms under "Deliberate simplifications", and the
alternative — ship only the selected account and take a `router.refresh()` on
switch — is named there as the upgrade.

## The graph

A hand-rolled SVG. `src/lib/balance-history.ts` will be pure and unit-tested:
`Transaction[]` to a per-day balance per wallet plus a total, over the account's
whole history. Days with no transactions carry the previous day's balance forward, so
the history has one point per day from the account's first transaction to `asOf`
and the path never gaps. The component owns the scales, path building, axis ticks
and direct labels.

**Degenerate histories.** An account whose whole history is one day yields a
one-point history: a `M x y` path with no `L` draws nothing, and the extent
collapses so the vertical scale divides by a zero span. One point renders as a
dot at mid-height with its direct label, and zero points falls through to the
no-transactions state below — neither is left to the path builder.

**Ranges slice the history, never the transactions.** A range selects a slice of
the already-built balance history. Deriving a history from transactions filtered to the
last seven days would start every line at zero instead of at the balance carried
into the range.

**The vertical scale is relative, not zero-based.** It runs from the minimum to
the maximum of the *currently visible lines* within the *current range*, as the
mockup's `balanceExtent` does. Two consequences the port must keep deliberately:
turning off `סך הכל` re-scales the chart, so a savings line that looked flat
beneath the total becomes a mountain; and narrowing the range re-scales it again.
This is what makes a seven-day range readable at all — a zero-based axis would
flatten every line at this app's amounts — but it means the chart shows shape,
not magnitude, which is why the direct labels and the y-axis ticks carry the
numbers.

**Both axes.** The far edge (the right, in RTL) carries three y ticks and reserves
horizontal room for them; the gridlines *are* those three ticks' lines, so there
is no separate gridline decision.

**The y ticks cannot all be whole shekels.** The mockup labels them through the
equivalent of `agorotToWholeShekels`, which reads correctly at its synthetic
amounts and collapses at this app's. A quiet seven-day range on an ₪18 savings
pot moves about ₪0.63 end to end, so a relative scale over that range yields
three ticks that all round to the same number and three gridlines that read as
noise — the exact failure the relative scale was chosen to avoid, moved off the
paths and onto the labels. The ticks therefore take the same precision rule as the
change column below: agorot when the range's visible span is under ₪10, whole
shekels above it, one shared helper serving both. The x axis carries 4, 5 or 6 date ticks depending on the span,
switches from day-and-month to month names past a wide span, adds the year past a
wider one, and the newest tick reads `היום`.

Details the mockup already solved and the port must keep: the axis runs
right-to-left, so `text-anchor` is inverted from the intuitive reading — `end`
places text to the right of `x`. That inversion is inherited from the document's
`dir="rtl"`, so nothing inside the SVG may re-scope direction. The direct labels
are not rendered through `Money` for a blunter reason than that: `Money` renders
HTML `<span>`s, which are not SVG content at all — its `dir="ltr"` would be the
second problem, not the first. Every label carries the mockup's
`paint-order: stroke` halo in `surface` so it survives crossing a line. Direct
labels push apart when lines converge and shift as a group if they overflow;
x-axis tick granularity changes with range, and the newest tick reads `היום`.

**Ranges:** שבוע (7) · חודש (30) · שנה (365) · הכל, defaulting to **חודש**, as the
mockup boots. Switching a range or a chip never refetches — it re-slices data
already on the page.

**`שנה` and `הכל` are the same range until an account is a year old**, which is
every account this app currently has; the mockup only separates them by giving
itself 430 days of synthetic history. Both chips ship anyway rather than
appearing later, because a range strip that grows a button on an account's first
birthday is stranger than two chips that agree for a while.

**Headline and change.** The headline total is always today's account total, in
whole shekels, independent of range. The change pill is
`total(today) − total(range start)` in whole shekels, labelled by the selected
range: `השבוע` · `החודש` · `השנה` · `מאז ההתחלה`. Negative takes `withdrawalText`,
non-negative `gainText`.

**Chips:** `סך הכל` toggles independently, each wallet toggles independently, and
a separate `כל הקופות` chip turns the three wallet lines on together — not
labelled `הכל`, which is already both a range and a type filter. The mockup puts
`כל הקופות` at the end of the **ranges** row as a dashed ghost chip, and the four
line chips in their own row below the chart, each wallet chip carrying a small
colour swatch. The mockup also recolours a pressed chip's **text** to its line's
colour; the port does not, for the reason the direct labels do not either — 12.5px
text at 2.28:1 in `sunshine-quest` is the same 4.5:1 failure. The swatch carries
the line's colour and the label stays a text token, pressed or not. The default state is
**total on, all three wallets off**. With nothing selected the chart renders a
"pick at least one line" message rather than an empty frame.

The chips carry short wallet names so total plus three wallets fit one row —
`WALLET_LABEL.goodDeeds` is `מעשים טובים` and does not. Those short names already
exist as `BALANCE_BREAKDOWN_COPY.shortWalletLabel` in
`src/components/Account/BalanceBreakdown/constants.ts`, where the donut legend uses
them, and they are exactly the mockup's: `חיסכון` · `בזבוזים` · `מעשים`. They move
to `WALLET_SHORT_LABEL` beside `WALLET_LABEL` in `src/lib/constants.ts` and both
screens read them from there. A second copy is not written.

**Colours** come from the emotion theme: `textStrong` for the total line and its
fill, and three chart-line tokens for the wallets. Those three tokens do not
exist yet, and adding them is a **prerequisite of the chart PR, not a follow-up**.

`walletSavings`, `walletSpending` and `walletGoodDeeds` are the obvious candidates and
are the wrong ones. They are not the wallet gradients — `theme.gradients.walletSavings` and friends are
separate `ThemeGradientStops` — they are flat arc tokens whose only consumer is `Donut`,
which already strokes them onto `surface` at 14px. A 2.25px hairline is not a
14px arc, and the mockup, which is the specification of record, replaced at least
one of the three in every theme:

| theme | savings | spending | good |
| --- | --- | --- | --- |
| `sunshine-quest` | `#FFC34D` → **`#E0A020`** | `#FF8A4C` | `#E94E89` |
| `jungle-quest` | `#2A9D8F` | `#90BE6D` → **`#6E9B22`** | `#E76F51` |
| `midnight-blue` | `#1E40AF` → **`#60A5FA`** | `#60A5FA` → **`#38BDF8`** | `#818CF8` → **`#A78BFA`** |

**Those are the mockup's eye, and the measurement does not agree with it.** This
repo has just spent two PRs on contrast — `.plans/2026-09-23-aa-contrast-pass.md`
and `-pass-2.md` — whose rule is that every ratio is measured on the literal token
values, sRGB relative luminance, WCAG 2.x. Measured the same way against each
theme's `surface`:

| theme | surface | savings | spending | good |
| --- | --- | --- | --- | --- |
| `sunshine-quest` | `#FFFFFF` | `#E0A020` **2.28** | `#FF8A4C` **2.34** | `#E94E89` 3.55 |
| `jungle-quest` | `#FFFDF5` | `#2A9D8F` 3.26 | `#6E9B22` 3.23 | `#E76F51` 3.04 |
| `midnight-blue` | `#141B24` | `#60A5FA` 6.82 | `#38BDF8` 8.09 | `#A78BFA` 6.37 |

Two bars apply and the mockup trips both:

- **A line is a graphical object: 3:1** (WCAG 1.4.11). `sunshine-quest` fails it
  twice over. `jungle-quest` clears `good` by 0.04. Only `midnight-blue` has room.
- **A direct label is 9.5px text: 4.5:1** (WCAG 1.4.3). The mockup paints each
  label in its line's colour, so every label in `sunshine-quest` and
  `jungle-quest` fails — 2.28 to 3.55 against a 4.5 bar. The mockup's
  `paint-order: stroke` halo separates a label from a line crossing beneath it and
  does nothing for the card behind it.

So the port departs from what the mockup drew, twice:

- **A direct label is text and takes a text token.** `textStrong` measures
  13.78 / 10.88 / 15.27 on the three surfaces, and the label already carries the
  wallet's short name, so nothing is lost by taking the colour out of it. The
  line's colour moves to the small swatch beside the label — the same 9px swatch
  the wallet chips already carry. That retires the 4.5:1 bar by construction
  instead of chasing it through three palettes.
- **The tokens still have to clear 3:1 as strokes, and `sunshine-quest`'s pair
  does not.** Those two values were re-derived in the theme PR against the
  measured bar rather than copied across from the mockup, and settled the way
  `contrast-pass-2` settled its three design calls — with a mockup drawn *during*
  the decision, `mockups/chart-contrast.html`. `sunshine-quest` draws savings
  green, spending blue and good pink. The first proposal, `#B07D00` (3.63) ·
  `#E2661F` (3.41), cleared the bar and was rejected with every orange spending:
  spending read too close to good's pink. `softText`'s brown for savings was
  rejected too. `jungle-quest`'s `#E76F51` at 3.04 is a pass, and is recorded so
  the next audit knows it was measured and left alone.

What ships, measured against each theme's `surface`:

| theme | `chartSavings` | `chartSpending` | `chartGoodDeeds` |
| --- | --- | --- | --- |
| `sunshine-quest` | `#276E2C` 6.26 | `#2563EB` 5.17 | `#E94E89` 3.55 |
| `jungle-quest` | `#2A9D8F` 3.26 | `#6E9B22` 3.23 | `#E76F51` 3.04 |
| `midnight-blue` | `#60A5FA` 6.82 | `#38BDF8` 8.09 | `#A78BFA` 6.37 |

`sunshine-quest`'s savings is the value of `gainText`, not a new colour; its
spending blue is the one hue that palette did not already carry.

Nine values ship across three themes, six of them different from the wallet token
they sit beside. They ship together rather than one at a time: with `chartSavings`
alone, `midnight-blue`'s new savings (`#60A5FA`) *is* the current
`walletSpending`, so a chart mixing new chart tokens with old wallet ones would
draw two lines the same colour. Shipping the chart against the existing tokens and
raising the contrast later means shipping a chart nobody can read in two themes.

`walletSavings` in `midnight-blue` measures **1.99** against `surface` on the donut
itself, under the same 3:1 bar. That is a shipped screen and not this epic's to
fix; the chart tokens are new and additive, so the donut is untouched. It is
recorded here because the measurement was taken.

Two further constraints on the port:

- **No colour literals.** `no-color-leaks.test.ts` fails any `#hex`, `rgba(` or
  `hsla(` in a `.tsx`, `.styles.ts`, `constants.ts` or `-parts.ts` under
  `src/components`. The total's area fill therefore carries transparency through
  `fill-opacity`, never through an `rgba()` string, and the chip swatches take
  their colour from the theme through a prop rather than an inline literal the
  way the mockup does.
- **Gridlines reuse `divider`, and that is a departure from the mockup**, not a
  gap it left. The mockup authors a `--grid` token distinct from `--divider` in
  `sunshine-quest` (`#EFE7F2` vs `#F2D9D2`) and `jungle-quest` (`#E8EFDC` vs
  `#DDE7CC`), identical in `midnight-blue`. Adding a fourth token to the theme PR
  above would be nearly free; it is skipped because the two values are neighbours
  in both themes that differ, and three faint tick lines are not worth a token.
  If it reads wrong against the card, it joins the same theme PR.

CSS custom properties (menu-epic PR 11a) are for the pre-hydration loading shell
only; this chart lives inside `ThemedPage` and reads the theme like every
component.

## The list

The list shows the account's whole history. **The ranges belong to the chart
alone** — selecting `שבוע` does not shorten the list, and the count line beneath
the title reads the row count and the span of the account's whole history.

### Deposits are three transactions and one row

`addDeposit` writes one transaction per wallet and gives all three a **single
`createdAt`**, computed once before the map, plus the same `occurredAt`. The list
groups `type === TRANSACTION_TYPE.deposit` by `createdAt` and renders one row carrying the sum.
Exact, not heuristic. A deposit row shows a single icon and no wallet badge,
because a deposit has no one wallet.

### Interest rolls up per wallet per month

`addDailyInterest` emits at most one row per wallet per day — it skips days where
the interest rounds to zero, and wallets whose `monthlyInterestRate` is 0 never
produce any, so today only `savings` does. Monthly mode (the default) buckets by
`(walletId, the UTC calendar month of occurredAt)` — the same UTC day the rest of
the app counts in, so a bucket boundary and a section header can never disagree —
showing the sum and the day count (`12 ימים`); the
month's last interest date anchors the row for sorting and sectioning but is not
printed. Daily mode lists the rows as stored, each with its own date.

The mockup names a rolled-up row `ריבית ספטמבר`, which repeats the month already
printed in the sticky header directly above it. The row reads `ריבית` and lets the
section header say which month — the same copy as a daily row, distinguished by
its `12 ימים` meta. This is a copy decision, listed with the others below.

Bucketing per wallet rather than per month costs nothing today and stops a second
interest-bearing wallet from silently merging under one icon later.

### Running balance

The balance column is the account total **at the end of the row's day** — a
lookup into the same per-day totals of the balance history the chart draws, not an accumulation
down the list.

This is the only definition that survives the monthly rollup. A rolled-up row
covers a month in which deposits and withdrawals also happened, so
`previous row + amount` cannot equal its balance; any accumulating derivation
stops reconciling the moment monthly mode is on. Reading the balance out of the
history keeps every row true on its own terms, and makes the column independent of
which type filter is active.

Three consequences, all of them deliberate:

- `transaction-rows.ts` depends on `balance-history.ts`. They are not two
  independent derivations; the list asks the history for the balance of a day.
- **An interest row reads the end-of-day total minus that day's deposits and withdrawals,
  in both modes.** `addDailyInterest` accrues on the opening balance and only
  then applies the day's deposit or withdrawal, so within a day the interest is
  the earlier event, and the balance beside it is the balance interest actually
  landed on. This is the same fact as the ordering rule below, seen from the
  balance column. The mockup applies the subtraction to daily rows and not to
  monthly ones, so the same month's interest shows two different balances
  depending on the toggle; that is a mockup bug and the port does not carry it —
  a rolled-up row subtracts its anchor day's deposits and withdrawals the same way.
  Read precisely, the number is *the account total after all of that day's
  interest*, which stays true if a second wallet starts bearing interest; "minus
  the deposits and withdrawals" is how that reads today, with one interest-bearing wallet.
- **Two transactions on the same day show the same balance.** A deposit and a
  purchase on one afternoon are two rows with different amounts and one identical
  `יתרה`, and neither equals the balance immediately after its own row. This is
  the price of a definition that does not accumulate, and it is paid knowingly:
  the alternative is ordering transactions within a day, which the data cannot do —
  `occurredAt` is a date, and `createdAt` is settlement time, not event time.
  Upgrade is an intra-day sequence on the transaction, which is a migration and
  a write-path change, so it is not this epic's.

### Ordering, sections, filters

Sort key is `(occurredAt descending, interest last within a day)` — newest first,
and within one day a deposit or withdrawal sits above the interest, which mirrors the
accrual order above. **Not `createdAt`:** interest rows are written at settlement
time, so a `createdAt` sort floats today's settlement of an old day above recent
transactions. `createdAt` is used for one thing only — grouping a deposit's three
legs.

Rows are grouped into one `<section>` per month with a sticky header, so headers
replace each other instead of stacking. The header carries the month label and
the two column headings (`שינוי` · `יתרה`), so the columns stay named while
scrolling. The month label omits the year when it is the current year — a new
`monthLabel()` beside `dayMonth()` in `src/lib/dates.ts`; `Intl` in `he` gives
`ספטמבר` and `ספטמבר 2026` directly.

The list scrolls with the page rather than inside its own scroller, and the month
headers stick to the viewport. The mockup's inner scroller is an artefact of its
phone frame; a nested scroll region inside `Screen`'s `min-height: 100vh` column
needs a bounded height and gives a phone two scrollers to fight over.

Type filters are single-select: `הכל · הפקדות · משיכות · ריבית`. Filtering happens
after balances resolve, so a filtered view still shows true balances. A filter
that matches nothing renders the mockup's `אין תנועות בסינון הזה`, not a blank
panel. Being single-select, the four chips are one group with one `aria-checked`
option, not four independent `aria-pressed` toggles — same for the
monthly/daily interest switch; only the chart's line chips, which really are
independent, use `aria-pressed`.

**An account with no history needs its own state, and `EmptyState` is not it.**
`EmptyState` is the *no-account* state: a pig and a `צור חשבון` button, wrapped
in its own full-page `<Screen>`. Offering a parent a new child because this one
has not had pocket money yet is the wrong action, and the component cannot sit
inside the list card in any case. The route already redirects to `HOME_ROUTE`
when there is no selected account, which covers the no-account case; a selected
account with zero transactions renders the chart card's "pick at least one line"
frame replaced by a no-transactions message and the list replaced by its own, both new
copy on this screen.

Icons use the **corner-badge** variant (`תג בפינה`), decided 2026-09-15: the
wallet icon carries a small badge of what happened. The badge and the row name are
per wallet, because the data model has one `withdrawal` type and the copy does
not: spending is `🛒 קנייה`, goodDeeds is `🎁 תרומה`. **A savings withdrawal has no
name or badge in the mockup and the app permits one**, so the implementation plan
picks its pair before the list PR starts.

Range, chip, filter and interest-mode state live in the client shell, not the
URL — the same choice `/method` made. The back button therefore leaves the screen
rather than undoing a chip. The state is **one set for the screen, not one per
account**: switching child keeps the range and the lines you were looking at and
re-draws them from the new account's balance history, which is what the mockup does and
what makes comparing two children a single tap.

## Components

```
src/lib/balance-history.ts      pure, graph: per-day balance per wallet + total
src/lib/transaction-rows.ts     pure, list: grouping, rollup, ordering; reads the history for balances
src/components/Transactions/
  Transactions.tsx              client shell, account navigation
  use-transactions-view.ts      range, shown balances, transaction type filter, interest mode
  use-balance-history.ts        the current account's balance history, memoised
  constants.ts                  TRANSACTIONS_ROUTE, TRANSACTIONS_COPY, test ids
  index.ts
  ChartCard/                    card shell, chips, ranges
    TotalBalanceHeader/         headline total balance + change pill
    BalanceChart/               svg: scales, paths, both axes, direct labels
    BalanceChips/               which balances the chart shows
  TransactionList/              list shell, count line, no-transactions state
    TransactionMonth/ TransactionRow/ TypeFilters/ InterestMode/
```

Every folder carries the `index.ts`, `constants.ts` and `.styles.ts` siblings
CLAUDE.md requires; only the files worth naming are listed.

Split to stay inside the 200-line file and 40-line function limits without
collapsing anything to get under them. `BalanceChart` is its own folder because
the path math alone is ~150 lines and would otherwise push `ChartCard` over the
file limit on its first PR. `use-transactions-view.ts` exists from the first PR
rather than being extracted when the limit bites: `Method.tsx` is already 57
lines doing nothing but the `AccountManagement` / `AccountsProvider` / `Screen` /
`Column` / `Header` wrapping this screen also needs, and four pieces of state
with their setters do not fit in the 40 lines left.

## Reuse

| Need | Already exists |
| --- | --- |
| wallet icons | `WALLET_ICON` in `src/lib/constants.ts` |
| wallet labels (rows) | `WALLET_LABEL` in `src/lib/constants.ts` |
| short wallet labels (chips, direct labels) | `BALANCE_BREAKDOWN_COPY.shortWalletLabel`, hoisted to `WALLET_SHORT_LABEL` in `src/lib/constants.ts` |
| whole-shekel formatting (headline, change, balances) | `agorotToWholeShekels()` in `src/lib/money.ts` |
| row date (`14 בספטמבר`) | `dayMonth()` in `src/lib/dates.ts` |
| amount rendering | `Money` |
| gain / loss colours | `gainText`, `withdrawalText` |
| page column, header, menu | `Screen`, `Column`, `Header` |
| account switching | `useAccountNavigation` |
| wallet → colour-token map | `WALLET_COLOR` in `BalanceBreakdown/constants.ts`; the chart's `WALLET_CHART_COLOR` is its twin, not a new idea |

New, small, and not reusable from anything: `monthLabel()` in `src/lib/dates.ts`
for section headers.

**The change column does not go through `Money`, and the reason is not only
precision.** Three things are wrong with reusing it:

- It rounds to whole shekels, so every interest row would read `₪0` — daily
  interest on ₪18 is 9 agorot. That erases the "you earned interest" moment the
  granularity decision exists to protect.
- It has never been handed a negative number. Every call site today is a balance.
  `agorotToWholeShekels(-1200)` is `-12`, and the markup is
  `<Currency>₪</Currency><Number>-12</Number>` inside `dir="ltr"`, which renders
  **`₪-12`**. The mockup wants `-₪12`: the sign belongs before the currency, and
  the column is *always* signed, `+` included.
- `Money` shrinks and fades the `₪` to 0.4em at 65% opacity. The change column is
  a flat 11.5px `+₪0.09`, no such treatment.

So the change column gets a small `ChangeAmount` inside `TransactionRow`:
always-signed, sign then `₪` then the number, `dir="ltr"`, tabular numerals, and
the mockup's precision rule exactly — show agorot when `|amount| < ₪10` **and**
the amount is not a whole shekel, otherwise whole shekels. `Money` is not
touched, which also means the `allowHalf` / `fullSizeCurrency` pair does not grow
into a three-way pile of mutually exclusive props. The headline total, the change
pill and the balance column keep `Money` and whole shekels.

## RTL / mobile / accessibility

The screen is RTL like the rest of the app, inheriting `dir="rtl"` from the root
layout. The chart's time axis runs right-to-left, newest at the right edge. Direct
labels sit at the newest edge with inverted anchors.

**The rows need labels of their own.** `שינוי` and `יתרה` are printed once in the
sticky month header, which makes them visual column headings and nothing more: a
screen reader moving down the rows reads two bare numbers. The list is not a
`<table>` — making it one to win header association would fight both the sticky
header and the RTL layout — so each row's change and balance carry their own
accessible name, and a row reads as what happened, when, how much, and the balance
it left behind.

The chart is an `<svg role="img">` with an `aria-label`, and its "pick at least
one line" state carries its own label — both already in the mockup. The list
below carries every balance the chart plots as text, so the chart needs no data
table; what it does not carry is *which range and which lines are currently
drawn*, and the mockup's label is the static `מאזן לאורך זמן`. The label is
therefore built from the selected range and the visible lines, so toggling a chip
or a range changes what a screen reader is told, not just what the path looks
like.

## Testing

Pure derivations (`balance-history`, `transaction-rows`) carry the weight as plain
unit tests: forward-fill across empty days, slicing a range out of a built
history, deposit grouping, interest rollup in both modes, the running balance in
both modes including an interest row's deposits-and-withdrawals subtraction in each, two transactions on one
day resolving to one balance, ordering within a day, filters, and the empty
cases. The one-day and zero-day histories get their own tests, since the path
builder and the extent both degenerate there. Store tests cover `listByAccount`
in all three implementations, with the live-database ones as `*.e2e.ts`; the
`settleInterest` refactor rewrites `src/lib/__tests__/interest-settlement.test.ts`,
the only existing test file it touches.

Four of those are not obvious from the list, and are named because they are the
ones that catch the failures this design argued itself into:

- **Rows handed in insertion order and the same rows handed sorted produce the
  same history.** Every store now returns rows oldest first, but the history must
  not depend on that; this is what keeps it right for rows from anywhere else.
- **An account whose wallet has no transactions still derives.** That is the
  grouping's `undefined` case, and every brand-new account.
- **A range whose whole visible span is under ₪1 does not print three identical
  y ticks.**
- **Deposit fixtures carry distinct `createdAt`s.** `createMockTransaction`
  defaults every row to `2026-01-01T00:00:00.000Z` and deposit grouping keys on
  `createdAt`, so a fixture with two deposits on different days merges them into
  one row and the test passes for the wrong reason. Any fixture with more than one
  deposit sets it explicitly.

Components get their usual dedicated tests against `data-testid`s from a
`constants.ts`. Any theme assertion uses a **non-default** theme id, since every
seeded fixture carries `DEFAULT_THEME_ID` and would pass against a component that
ignores the theme.

The route also gets an `e2e/transactions.visual.ts` and a
`TransactionsDriver` in `e2e/driver/`, like every other screen, and
`e2e/page-routing.visual.ts` grows the third tab. `useDriver` already seeds
`Partial<StoreContents>`, which carries `transactions`, so the suite can stand up an
account's transactions without new plumbing. A hand-rolled SVG is the one thing in this app that
unit tests cannot keep honest — and the chart-line colours are exactly what a
unit test cannot see, so the visual suite covers all three themes.

Every test is watched failing against its own deliberate break before it counts.
Every PR that changes something visible carries screenshots — the `pr-screenshots`
skill.

## Delivery order

Three orderings are load-bearing; the rest of the sequence is the implementation
plan's to choose.

1. **The chart-line theme tokens come first.** `chartSavings` · `chartSpending` ·
   `chartGoodDeeds` across all three themes — nine values, six of them different from
   the wallet token beside them, two of them re-derived against the 3:1 bar rather
   than copied from the mockup. The PR carries its measurements the way the two AA
   passes do: a ratio per token per surface in the body. The chart PR cannot ship a
   readable line without them, and they cannot land one at a time without
   `midnight-blue` drawing two lines the same colour.
2. **The `settleInterest` refactor comes before anything that reads a ledger.**
   It changes `src/lib/interest-settlement.ts` and the store contract under `/` and
   `/method`, which both keep their behaviour; landing it alone keeps that
   regression surface separate from the new screen.
3. **`TRANSACTIONS_ROUTE` reaches `NAVIGATION_DESTINATIONS` only once the route renders.**
   The menu epic shipped the tab inert on purpose; giving it an `href` before
   `/transactions` exists trades an inert tab for a broken one.

Not an ordering, but a cross-epic dependency worth naming rather than leaving in a
parenthetical: the loading shell is menu-epic **PR 11, which has not merged**
(its prerequisite, PR 11a, merged as #114). `/transactions` arrives in silence until it does, exactly as `/method`
does today, and inherits the shell when it ships. It does not block this epic and
this epic does not block it.

## Deliberate simplifications

Each is a known ceiling with its upgrade path, recorded here rather than as a
comment in the source.

- **The payload is bounded by accounts × history, not by family size.**
  `listTransactionsByAccount` reads all history, and `/transactions` ships every
  visible account's transactions to the client so switching stays free. The arithmetic,
  measured rather than guessed:

  - A `Transaction` carries **three** 36-character uuids (`id`, `walletId`,
    `accountId`), a date and an ISO timestamp, and serialises to **240 bytes**.
  - An account produces about **550 rows a year**, not 365: one interest row a day
    from `savings`, plus **three rows per deposit** — `addDeposit` writes one per
    wallet — so a weekly allowance alone adds 156, plus withdrawals.
  - Three children and three years is therefore ~5,000 rows and, unprojected,
    **~1.2 MB** — on a phone, under `export const dynamic = 'force-dynamic'`, so
    nothing is cached. The projection below takes that to ~720 KB.
  - It is rebuilt and re-sent on every visit and every `router.refresh()`. This
    screen has no deposit drawer, so the refreshes that reach it come from the
    menu: **every tap on a theme in `AppearanceSection` calls `router.refresh()`**,
    and so does finishing an account edit. A child paging through three themes
    re-sends every transaction three times and re-runs settlement for every visible
    account three times.

  **One response is taken now and one is deferred.**

  Taken now, because it is a `.map()` on the server: the page ships a projection —
  `walletId`, `type`, `amount`, `occurredAt`, `createdAt` — and not the
  `Transaction`. `id` and `accountId` are 95 of the 240 bytes, neither derivation
  reads either, and the list's React key is composite. That is **145 bytes a row, a
  40% cut**, and it costs nothing in purity: `balance-history.ts` and
  `transaction-rows.ts` take the projection, which is all they ever needed.

  Deferred, with the trigger stated honestly rather than optimistically: **when the
  page's payload approaches ~500 KB** — about 3,500 projected rows, which three
  children reach in roughly **two years**. That is a near ceiling, not a distant
  one, and it is accepted on the grounds that both upgrades are cheap when it
  arrives, because `balance-history.ts` and `transaction-rows.ts` are pure and
  framework-agnostic and run unchanged on the server. In order: ship the derived
  balance history and the month-rolled list instead of rows; then ship only the selected
  account and take a `router.refresh()` on switch, trading free switching for the
  payload. Neither is a parameter until something calls it.
- **Settlement can run twice.** Two concurrent renders — two tabs, two devices —
  both settle the same day and both insert, producing duplicate interest rows.
  This is true today on every page — and every page settles *every* visible
  account, so a parent with three children opening the app in two tabs can
  duplicate a day's interest three times over, not once. This screen is simply
  the first surface that shows it. Upgrade is a partial unique index
  (`(account_id, wallet_id, occurred_at) WHERE type = 'interest'`) plus
  `ON CONFLICT DO NOTHING` on the insert — a migration, so it is its own PR, taken
  the first time a duplicate is seen rather than pre-emptively.
- **Days are UTC days.** `today()` slices a UTC ISO string, so a transaction made
  between midnight and 03:00 Israel time is filed to the previous day. Invisible
  until now; this is the first screen that prints dates in a list. Upgrade is a
  timezone-aware `today()`, which changes interest accrual too and so is its own
  decision, not this epic's.
- **Deposit grouping keys on `createdAt`.** Two deposits committed in the same
  millisecond would merge into one row. One parent, one tap — unreachable in
  production, but trivially reachable in a fixture, which is why the testing
  section makes distinct `createdAt`s a rule. Upgrade is a batch-id column.
- **Two transactions on one day share a balance**, and a rolled-up interest row
  shares its anchor day with whatever else happened. Both follow from a balance
  column that reads the balance history instead of accumulating; the upgrade is an
  intra-day sequence on the transaction, which is a migration.
- **Gridlines borrow `divider` rather than the mockup's `--grid`.** If it reads
  wrong against the card in one theme, it joins the chart-token theme PR.

## Open questions, deferred not forgotten

- **Interest rollup default.** Monthly ships as the default on the reasoning that
  a daily list is mostly interest rows. If it reads as hiding data, flipping the
  default is a one-line change.
- **The savings-withdrawal name and badge.** The mockup never produced one. Needs
  a copy decision before the list PR.
- **The rolled-up interest row's name.** `ריבית`, letting the month come from the
  section header, versus the mockup's `ריבית ספטמבר`. Same PR as the one above.
- **The no-transactions copy**, for the chart frame and the list, on an account that
  exists but has never had a transaction. Also the same PR.

(The graph needs no loading state: it is server-rendered. The shell it arrives
under is menu-epic PR 11 / 11a — see the note under "Delivery order".)
