# Child piggy bank (B2) — plan

> Status: **locked 2026-10-11**, refreshed against `origin/main` daddfee, then reviewed against 26b87a6 twice
> (Third and Fourth review, below). **PR 1 merged as #207 (48c78e9). PR 2 merged as #210 (b704a75), its review
> fixes as #212 (9abe018). PR 3 merged as #218 (7f6f23f).** Next: PR 4, planned in
> `fun-saver-piggy-bank-motion/.plans/2026-10-16-piggy-bank-motion.md`. What PR 2 and PR 3 changed is in "After PR 2"
> and "After the layout shots" at the end.
> Mockup: `mockups/2026-10-04-child-piggy-bank.html#piggy-bank` (the agreed design, with and without a goal, at the live app's real sizes).
> Research: `docs/research/child-engagement.md` (§ 5–7 for the why, § 9 for the art).
> Depends on: #171 child mode, the goal (#174, #190, #199) and the phone-wide view mode (#193–#198), all on `main`.
> Each PR below branches from fresh `origin/main`.
>
> **Picking up:** each PR gets a fresh worktree off `origin/main`. Next step: PR 4.

## Purpose

The child's savings card becomes a piggy bank that faces the child. Its glass belly shows a pile of coins that grows toward
the saving goal. Interest the child has not yet seen waits above the slot as up to three coins. Tapping a coin drops it
through the slot, and the total rolls up. Under the total, the goal shows its picture, its name, what is still to save,
its amount and a bar. The aim is a small reason to open the app and see the money that grew by itself, without streaks,
guilt or prizes.

## The screen (mockup, "With a goal")

Top to bottom inside the savings card:

1. A line of copy, «הכסף הרוויח לבד! לחצו על המטבעות», while any coin waits.
2. The coin row, centred over the slot. The row and the copy line keep their space when empty, so nothing jumps when
   the last coin goes in.
3. The pig, 50% of the card wide. The coins hover over its empty top instead of above it.
4. The total, `typography.display` (48, down from `hero` 76). The «החיסכון שלך» label is removed: the pig says it.
5. The goal: the shared `GoalProgress` at `size={GOAL_PROGRESS_SIZE.large}` with `glowWhenReached` (shipped in #210):
   picture, name and «₪85 / ₪250», then the 14px bar. Shown only when the account has a goal. (The mockup's
   «· עוד ₪102» heading and a separate `ChildGoalProgress` were dropped: the user chose to reuse the goal line.)
6. The dashed divider and the two tiles, «הפקדת» and «הרוויח לבד», unchanged.

Under the card, the spending and good-deeds rows stay rows: 92 → 72px tall, icons 58 → 48px. Their text sizes are
unchanged.

**Fit.** With a goal and coins waiting, the screen fits 393×745 (iPhone 16 in Safari, bars hidden) with 16px to spare, and
412×780 (Pixel 7 in Chrome). An iPhone 14 with Safari's bars showing (390×664) scrolls about 60px; that is accepted. The
iPhone SE scrolls.

## Decisions

| Question | Decision |
|---|---|
| Where "already collected" is remembered | **On the device, in a cookie**, one per account: `collectedInterest-<accountId>`. The server reads it like the theme and view-mode cookies, so the first paint already shows the right total and coins. `localStorage` is not used: the screen is rendered on the server, which cannot read it, so every visit with coins would paint the full total and then drop it on hydration. No migration, no API. Another device keeps its own count. |
| Who holds the mark while the page is open | **Nobody: the cookie is the only copy**, read through a context and a hook, the way `view-mode-context.ts` reads child mode. `CollectedInterestProvider` carries the server's values for first paint; `useCollectedInterest(accountId)` reads the cookie through `useSyncExternalStore`, with the provider's value as the server snapshot. It does not subscribe to anything: the visit reads the mark once, at mount, and `collect` reads the cookie afresh, so no reader needs telling. Switching child/parent view unmounts `ChildAccount`; switching accounts does not (`ShownAccount` re-renders the same `ChildAccount`), so `ChildAccount` keys `ChildSavings` by account id. Either way `ChildSavings` remounts and reads the cookie afresh, so collected coins never come back. No state in `Home`, no props through `ShownAccount`. |
| How full the piggy bank is | The savings **shown on the card** (after uncollected coins) ÷ the goal's `amount`, or ÷ `PIGGY_BANK_FULL_AT` (₪300) when the account has no goal. Capped at full. The pile grows when a coin lands, never before. At ₪0 the pile is empty. |
| Without a goal | `PIGGY_BANK_FULL_AT` is a transition default: the aim is for every account to have a goal. No goal line, no extra copy when full. |
| When the goal is reached | `savedTowardGoalOf(account).reached`, on the **real** balance. The pig is full, the goal's picture glows and its heading reads «הגעת ליעד!», even while coins wait. The goal bar is full too. |
| The goal bar and «עוד ₪…» | Follow the **shown** savings, like the pile, so they move when a coin lands. Until the goal is reached: then they are full. |
| Money on the coins | **Whole shekels only**, held in **agorot** like every other amount (`withoutAgorot`). A coin holds at least ₪1. Agorot of interest wait, unseen, until they make a whole shekel. |
| How many coins | **At most 3.** More uncollected shekels put more on each coin, never more coins; every coin is drawn the same size. Split as evenly as possible, larger first, e.g. ₪7 → ₪3, ₪2, ₪2, so they add up exactly. A coin's label fits four digits (`+₪1500`). |
| Coins during a visit | **Fixed when the screen opens.** Tapping a coin removes it; the others keep their amounts and slide over. Not re-split until the next visit. A visit is one mount of `ChildSavings`. |
| What the total shows | The savings balance **minus the uncollected interest**, in whole shekels, worked out from the account as it is now and the visit's mark. "הרוויח לבד" counts the same way. Tapping a coin adds it to both, rolling up. Interest settled while the screen stays open (the child menu's theme save runs `router.refresh()`, which settles a new day's interest after midnight) stays out of the total and becomes coins on the next visit, so the total never shows money and then takes it back. |
| Coins never exceed what is shown | The mark is **raised** so that what is uncollected never exceeds the "הרוויח לבד" amount, which #171 caps at the balance. After a savings withdrawal below the interest (allowed with no goal, and how #174 ends a reached goal) the interest that was spent is never a coin: not on this visit, not on the next, and not after a later deposit. The total never goes below ₪0. |
| First time on a device | The count starts **now**: the mark is written on the first visit, and coins appear once a whole shekel of new interest is earned. |
| Deposits and withdrawals | No coins. They show in the total, the pile and the goal bar straight away. |
| Animation | Coins slide into a row centred over the slot. A tapped coin moves over the slot, turns edge-on, slides through and lands on the pile, and the pig wiggles. The rest slide over to close the gap. The pig "breathes" a few times after the screen opens and after each landing, under 5 seconds in all, then rests: endless motion beside content needs a pause control (WCAG 2.2.2). |
| Reduced motion | Under `prefers-reduced-motion`, and wherever `element.animate` is missing, nothing moves: a tapped coin goes straight in and the total updates at once (`motionIsReduced()` in `src/theme/motion.ts`). |
| Count-up | `useCountUpTotalBalance` (`Account/BalanceBreakdown`) counts once, from 0, on mount; `Account` keys `BalanceBreakdown` by the total, so a deposit remounts it and it counts from 0 again. It becomes `useCountUp({ startAt, to, timing })` in `src/hooks/` once the piggy bank is its second user: on mount it counts from `startAt` to `to` (nothing when they are equal), and on each later `to` it counts **from the number on screen**. `BalanceBreakdown` passes `startAt: 0` and behaves as today. `ChildSavings` passes `startAt: to` and is not remounted by a coin, so a coin rolls the total from the old value. |
| Sound | None in v1. |
| Art | The SVG from the mockup, as a React component split into parts to stay under 200 lines a file. Rive is a later option (research § 9). |
| The pig's colours | The same pink in every theme (the pig is a character, not chrome), written once as `PIGGY_BANK_COLORS` in `src/theme/piggy-bank-colors.ts` and imported by `PiggyBank.styles.ts`. **Not a theme token group:** `theme-at-first-paint.test.ts` requires every group a theme declares (except `typography`) to be published as CSS variables, so a `piggyBank` group would have to be published too, for nothing. `no-color-leaks.test.ts` still passes: the literals live under `src/theme`, and only `@/theme/themes/` imports are forbidden. Upgrade path: a token group once a theme needs its own pig. |
| Type sizes | Steps of the existing scale only; no new token. The total moves `hero` → `display`. |
| Parent view | Unchanged. It shows the full balance; the child's screen on the same device shows less until the coins are tapped. |
| Celebration | Out of scope. `Celebration` exists on `main` but nothing mounts it yet; the goal work owns where it goes. |

## Rules

- **The collected mark** is the savings wallet's `interestEarned`, in agorot, at the time of the last collect.
  `interestEarned` almost only grows: interest is only inserted by settlement, and no route deletes a transaction. It can
  drop once, when `schema.sql` removes duplicate interest rows on a migrate, and a deleted account takes its
  transactions with it (its cookie then expires unread). The third case below covers both.
- **The mark is resolved (`resolveCollectedInterest`) to the current `interestEarned` when:**
  - there is no cookie yet (first visit on this device, or cookies were cleared)
  - the cookie is not a whole number of agorot ≥ 0
  - the cookie is above today's `interestEarned` (a migrate's dedupe, a reset or a reseeded store)
- **Otherwise it is raised to `interestEarned` less the "הרוויח לבד" amount** when it is below that. Interest the child
  spent is no longer in the piggy bank, so it can never be a coin. Without this, after a savings withdrawal below the
  interest the same capped coins came back on every visit, and a later deposit showed up as interest coins.
- **The client writes the resolved mark on every mount.** Without it every visit would be a first visit and coins would
  never appear, and the write renews the cookie's one-year `max-age`.
- **The visit's mark** is the mark resolved at mount, plus every coin tapped since. It lives in the visit's state.
- **Uncollected interest** = `withoutAgorot(interestEarned − mark)`, capped at "הרוויח לבד". It is worked out on every
  render from the account as it is now and the visit's mark. Between visits the raise keeps it within "הרוויח לבד"; the
  cap covers a refresh during a visit that brings in a withdrawal made on another phone. Below ₪1 there are no coins.
- **Collecting a coin of N agorot** adds N to the visit's mark and writes the larger of that and the cookie read afresh
  (resolved), capped at `interestEarned`, **at the tap**, not when the animation ends. A reload mid-drop keeps the coin
  collected. Two tabs that collect the same coin count it once, because each writes its own visit's mark, not "stored +
  N". A coin collected in another tab is never undone. The agorot left over in the mark carry to the next coin.
- **A tapped coin is disabled at once**, so a double tap collects it once.
- The coins of a visit belong to one account: `ChildAccount` renders `<ChildSavings key={account.id} …>`. Without the key a
  switch to a sibling keeps the same `ChildSavings`, and the first child's coins show on the sibling's card.
- **A cookie that cannot be written** (cookies blocked) never breaks the screen: the visit's coins live in the visit's
  state, so a tapped coin stays in for that visit. The next visit counts as a first visit.
- Tapping a coin is cosmetic: the interest is already settled and in the balance. **Nothing is lost by not tapping**, and
  coins wait for any number of days.

## Glossary additions (`docs/glossary.md`)

Names are proposals, re-checked against the glossary and the nearest sibling when implemented.

| Concept | Hebrew UI | Code term | Not |
|---|---|---|---|
| The savings wallet drawn for the child | — | `PiggyBank` | jar, pig, pot |
| What the piggy bank is full at without a goal | — | `PIGGY_BANK_FULL_AT` (agorot) | placeholder goal, target |
| How full the piggy bank is (0–1) | — | `piggyBankFill` | level, progress, percent |
| ~~The goal on the child's savings card~~ | — | ~~`ChildGoalProgress`~~ dropped in PR 2: `GoalProgress` with `size` (`GOAL_PROGRESS_SIZE`) and `glowWhenReached` | goal line, goal bar |
| Interest the child has not tapped in yet | — | `uncollectedInterest` (agorot); worked out by `uncollectedInterestOf` | pending, waiting, unseen |
| One of the up-to-3 coins above the slot | מטבע | `InterestCoins` (component), `interestCoins` (their agorot); split by `interestCoinsOf` | token, reward |
| Tapping a coin into the piggy bank | — | `collect`; the mark is `collectedInterest` | claim, pick, settle (settle is paying interest) |

## Phases (one PR each)

Each PR ships only code that something on `main` calls. A rule lands in `src/lib` in the same PR as its first caller.

### PR 1 — `PiggyBank`, standing still, and the new sizes — merged #207

- `PIGGY_BANK_FULL_AT = shekelsToAgorot(300)` in `src/lib/wallet/constants.ts`: what full means without a goal is a rule.
- `ChildAccount` passes `savedTowardGoal` (`savedTowardGoalOf(account)`) to `ChildSavings`, the way `Account` passes it
  down. `ChildSavings` fills toward `savedTowardGoal?.goal.amount ?? PIGGY_BANK_FULL_AT`, and draws the pig full once
  `savedTowardGoal?.reached`. PR 2 and PR 3 add no props: they read the same object.
- `src/components/ChildAccount/ChildSavings/PiggyBank/` (one user, so it sits under it): `PiggyBank.tsx`, `.styles.ts`,
  `constants.ts`, `index.ts`, a test, and the SVG parts it needs to stay under 200 lines a file.
  - It draws the SVG, and the coin pile inside the glass belly from `fill` (a prop, 0 to 1).
  - `piggyBankFill({ savingsBalance, fullAt }): number` and the pile's positions live in `pile-spots.ts` in the same
    folder: drawing maths, like `GoalProgressBar`'s `savedPercent`, not a business rule. Capped at 1; a `fullAt` of 0 or
    less is full, never a division by zero.
  - SVG gradient ids come from `useId()`, so two pigs on a page never share one.
  - The pig's colours are `PIGGY_BANK_COLORS` from `src/theme/piggy-bank-colors.ts`, read by `PiggyBank.styles.ts`
    (Decisions). No `ThemeTokens` or theme file changes. `no-color-leaks.test.ts` keeps colour literals out of the
    component, `.tsx` included.
- `ChildSavings` swaps its icon tile and its «החיסכון שלך» title for `PiggyBank` (50% of the card wide), and its total
  moves to `typography.display`. The two tiles stay. The art is `aria-hidden`, so the name moves to the card:
  `<Card aria-label={CHILD_SAVINGS_COPY.title}>`, a labelled region a screen reader still announces.
- `ChildSavings` will hold the pig, the coins, the total, the goal and the tiles by PR 3. Whichever PR takes it over the
  size limits moves the two tiles into their own component; the limit is never met by squeezing.
- `ChildWallet` rows: 92 → 72px min-height, icon 58 → 48px.
- Tests:
  - the fill, one test each: empty, half, full, capped above, `fullAt` of 0
  - the pile, one test each: an empty pile, a full pile, more coins at a higher `fill`, `aria-hidden` on the art
  - `ChildSavings`, one test each: fills toward the goal's amount, toward ₪300 with no goal, full once the goal is
    reached; the card's accessible name is «החיסכון שלך»
  - `ChildAccount`: hands `ChildSavings` the account's goal (a goal of ₪10 with ₪5 saved draws a half pile)
- A visual shot of the child home, and PR screenshots (`pr-screenshots` skill), with and without a goal.

### PR 2 — the goal under the total — merged #210, review fixes #212

> As shipped (supersedes the bullets below): no `ChildGoalProgress`. `ChildSavings` renders the shared `GoalProgress`
> at `size={GOAL_PROGRESS_SIZE.large}` with `glowWhenReached`; `GoalProgress` keeps one `SIZE_STYLE` row per size
> (picture, heading, thin bar). `PHONE_IN_SAFARI` (393×745) in `e2e/driver/viewports.ts`; the fit check in
> `e2e/child-view.e2e.ts` waits for the goal (`childAccount.waitForGoal()`) and measures `walletsBottom()`. #212: long
> goal names wrap beside «₪85 / ₪5000» (`GoalHeadingText`, `overflow-wrap: anywhere`), checked at `SMALL_PHONE`.

- `src/components/ChildAccount/ChildSavings/ChildGoalProgress/` (one user, so it sits under it, like `PiggyBank`):
  picture, name and «· עוד ₪N» (`stillToSave`) on one side, the goal's `amount` on the other, then `GoalProgressBar`.
  Reached: the heading reads «🎉 הגעת ליעד!» and the picture glows.
- The reached copy moves from `Account/WalletCard/GoalProgress/constants.ts` to `GOAL_COPY.reached` in
  `src/components/Goal/constants.ts`, where shared goal copy lives; `GoalProgress` and `ChildGoalProgress` both read it.
  The child screen never imports the parent screen's internals.
- `ChildSavings` renders it between the total and the tiles from the `savedTowardGoal` it already has (PR 1); nothing
  without a goal. The total and the tiles are both inside the card, so `ChildAccount` cannot place it between them.
- e2e (`e2e/child-view.e2e.ts`): at 393×745 (`appBrowser.resize`), with a goal, the good-deeds row ends inside the
  viewport. The viewport goes beside `PHONE` in `e2e/driver/viewports.ts`.
- Tests, one each: hidden without a goal; still to save; the amount; the reached heading; the reached glow; the bar gets
  the same `savedTowardGoal`.
- PR screenshots: in progress and reached.

### PR 3 — the coins, with no motion yet

- The rules, in one module, `src/lib/interest/collected-interest.ts` (small functions of one kind share a module):
  - `resolveCollectedInterest({ storedCollectedInterest, savings }): number` (sibling of
    `resolveThemeId(storedThemeId)`, hence the name): the three resets and the raise in the Rules. It takes the savings
    wallet, not only `interestEarned`, because the raise needs the balance.
  - `uncollectedInterestOf({ savings, collectedInterest }): number`, from the visit's mark, capped at "הרוויח לבד"
  - `interestCoinsOf(uncollectedInterest: number): number[]`, in agorot. Up to `MAX_INTEREST_COINS` (3, in
    `src/lib/interest/constants.ts`) whole-shekel coins, larger first, adding up exactly. `[]` below ₪1.
  - `collectInterest({ storedCollectedInterest, savings, collectedInterest }): number`, the next mark to save: the larger
    of the visit's mark (coin already added) and the resolved stored mark, capped at `interestEarned`
  - The functions end in `Of` like `savedTowardGoalOf`, so the values they return can be called `uncollectedInterest` and
    `interestCoins` without shadowing them (#204 just removed that kind of shadowing).
  - `savingsWithoutAgorot({ savings, uncollectedInterest })` (one params object) takes the uncollected interest off
    `balance` and `interestEarned`. Its one caller, `ChildSavings`, moves with it.
  - The goal on screen: a `SavedTowardGoal` whose `saved` and `stillToSave` leave out the uncollected interest, unless
    `reached`. Beside `savedTowardGoalOf` in `src/lib/goal/saved-toward-goal.ts`; name re-checked at implementation.
    It is handed to the same `GoalProgress` PR 2 mounts, which shows `saved` («₪85 / ₪250») and the bar; `stillToSave`
    is not on the child card, so keep it correct but do not test it through the card.
- Cookies:
  - `collectedInterestCookie(accountId)` beside the other cookie names in `src/lib/cookies.ts`. `readCookie` and
    `writeCookie` already exist.
  - `src/app/signed-in-accounts.ts` reads the cookie of each account the user has, not every cookie with the prefix, and
    returns `collectedInterest: Record<string, string | undefined>`.
- The context, `src/components/Home/collected-interest-context.ts`, copying `view-mode-context.ts`:
  - `CollectedInterestProvider` from `createRequiredContext`, given the server's record in `src/app/page.tsx` (the only
    page that shows the child screen).
  - `useCollectedInterest(accountId)`: `{ storedCollectedInterest, saveCollectedInterest(mark) }`. The cookie through
    `useSyncExternalStore`, the provider's value as the server snapshot. Its subscribe adds no listeners: nothing reads
    the mark after mount (see Decisions), so `view-mode-context.ts`'s subscriber set and `pageshow` /
    `visibilitychange` listeners are not copied.
  - `src/test-utils/render.tsx` wraps every render in `CollectedInterestProvider` (a `collectedInterest` option,
    default `{}`) and sets the cookies, the way it handles `viewMode`. Without it, every existing test that renders
    `ChildAccount` (`ChildAccount`, `ShownAccount`, `Home`) throws "No CollectedInterestProvider above this component".
- `ChildAccount` keys `ChildSavings` by `account.id` (Rules).
- `src/components/ChildAccount/ChildSavings/use-interest-coins.ts` (one user):
  - resolves the mark and saves it on mount
  - holds the visit's mark and the visit's coins, both fixed at mount; `collect` moves the mark
  - returns `{ interestCoins, uncollectedInterest, collect(coinIndex) }`. `uncollectedInterest` comes from the account
    passed now and the visit's mark (Rules). `collect` reads the cookie afresh.
- `src/components/ChildAccount/ChildSavings/InterestCoins/`: the row centred over the slot, one button per coin with its
  `+₪N`, keyed by its place when the visit began.
  - Each button has a Hebrew `aria-label` from `constants.ts`, e.g. "₪2 ריבית, לחצו כדי להכניס לחיסכון".
  - Each button is at least 44 × 44 px, and its label fits four digits.
  - The `+₪N` label is `dir="ltr"`, like the «הרוויח לבד» amount, or the RTL line draws it `₪N+`.
  - At the tap, focus moves to the next coin, or to the total when none are left (the total takes `tabIndex={-1}`). It
    never waits for an animation: a focused button that is disabled or removed drops focus to `<body>`.
  - A visually hidden `aria-live="polite"` line holds the total, so the new amount is read out once.
- The copy line «הכסף הרוויח לבד! לחצו על המטבעות» above the coins, in `constants.ts`, while any wait.
- `ChildSavings` wires it together: the total, "הרוויח לבד", the fill and the goal come from the shown savings.
- `ChildAccount.test.tsx`'s "offers the child nothing to do but look" becomes "offers the child nothing to press but the
  coins": the coins change only this device's cookie, never the account.
- Tests:
  One behaviour per test, each watched failing against its own break:
  - the split: ₪0, ₪1, ₪2, ₪3, ₪7 → 3, 2, 2, ₪100 → 34, 33, 33, and agorot below a shekel ignored
  - the mark: no cookie, garbage, negative, above `interestEarned`, a valid mark kept
  - the raise: a mark below `interestEarned` less "הרוויח לבד" is raised; one within it is kept
  - uncollected: agorot carried; after a savings withdrawal below the interest, coins of at most the balance; once they
    are collected, the next visit has none; a deposit after that is never a coin
  - collecting: adds, caps at `interestEarned`, keeps a larger stored value (another tab collected more), counts a coin
    two tabs both collect once
  - the savings: the total less what waits; "הרוויח לבד" less what waits; never below 0
  - interest settled during a visit (rerendering `ChildSavings` with a larger `interestEarned`) leaves the total and
    the coins unchanged
  - the goal on screen: `saved` and `stillToSave` less what waits; full when reached
  - the context: the server value at first render; the cookie after it; a remount reads the cookie, not the page-load
    value
  - the coin count; nothing breaks with no coins
  - tapping a coin, one test each: raises the total; raises "הרוויח לבד"; leaves the other coins at their amounts; saves
    the mark
  - a double tap collects once
  - a tap moves focus to the next coin; the last tap moves it to the total
  - a first visit saves the mark; a first visit shows no coins; a visit with a mark still saves it (the `max-age`
    renewal)
  - switching to a sibling (rerendering `ChildAccount` with another account) shows the sibling's coins, not the first
    child's
- `e2e/driver/use-driver.ts` takes a `collectedInterest` option (account id → mark) and sets one cookie per account,
  the way it sets `viewModeCookie`. Today `DriverOptions` has only `motion` and `viewMode`.
- e2e (`e2e/child-view.e2e.ts`), seeding an older mark through that option:
  - a seeded older mark shows coins; tapping one raises the total; a reload keeps it
  - collecting, switching to another account and back shows it still collected; the same through child → parent → child
  - a first visit shows none, and a reload still none
  - the 393×745 fit check, now with coins waiting (the tallest state)
- A visual shot with coins, and PR screenshots: coins waiting, and after.

### PR 4 — the motion

- The drop through the slot (Web Animations), the wiggle, closing the gap.
- The breathe: a few cycles after mount and after each landing, under 5 seconds, then still (Decisions). Off under
  `REDUCED_MOTION`, the way `entrance()` does it.
- `useCountUpTotalBalance` becomes `useCountUp({ startAt, to, timing })` in `src/hooks/` (Decisions), used by
  `BalanceBreakdown` (`startAt: 0`, `TOTAL_ANIMATION`) and `ChildSavings` (`startAt: to`, no start delay). The total
  rolls up when the coin lands.
- The mark is still saved and focus still moves at the tap (PR 3); only the numbers on screen, the goal bar and the
  hidden live line wait for the landing. The live line takes the landed total, never the rolling one.
- Tests:
  - jsdom has no `element.animate`, so the component goes straight to the end state (the reduced-motion path)
  - `useCountUp`, one test each: counts from `startAt` on mount; nothing on mount when `startAt` equals `to`; a new `to`
    counts from the number on screen, not from `startAt`; `BalanceBreakdown` still counts up from 0 on mount
- PR screenshots, mid-drop if the harness can catch it. Visual shots run with reduced motion, so they stay still.

## Out of scope

- Sound and haptics.
- Rive or Lottie art.
- An animation for deposits made since the last visit.
- Mounting `Celebration` for a reached goal.
- A "next coin" meter for agorot of interest.
- Copy explaining a full piggy bank without a goal.
- Fitting 390×664 and smaller without a scroll.
- Coin labels above four digits. With three coins that takes ₪10,000 of uncollected interest; the label may then wrap.
- A child-facing way into the goal screen. `feat/goal-ways-in` (WIP) links the parent's goal line to it; if a later PR
  makes `ChildGoalProgress` pressable, "nothing to press but the coins" changes with it.
- Remembering the collected mark on the account. Upgrade path: a column plus a route. The ceiling of the cookie: one
  ~70-byte cookie per account rides on every request, fine for tens of accounts a user.

## Settled

1. **`PIGGY_BANK_FULL_AT` is ₪300**, a transition default until every account has a goal.
2. **A first visit starts from now.** No coins until a new whole shekel of interest is earned.
3. **Small savings see few coins in v1** (₪200 makes a coin a day, ₪20 one every 10 days).
4. **At ₪0 the pile is empty.** A coin is literal money, so there is no sliver.
5. **The goal sits under the total** (mockup version 5b), with «עוד ₪…» in its heading.
6. **«החיסכון שלך» is removed**; the pig carries it, in its accessible name too.
7. **The target is 393×745**; 390×664 may scroll.
8. **The collected mark is read through a context and a hook**, the cookie the only copy.

## Fourth review (2026-10-11)

Checked against the code on `origin/main` 26b87a6 (still the tip), not against the plan's own claims, in seven rounds:
baseline, state, architecture, naming, scale and security, UX and a11y, tests. Every file, symbol and test the plan
cites exists as described, except where a row below says otherwise.

| # | Round | Found | Fixed by |
|---|---|---|---|
| 1 | Architecture | A `piggyBank` token group cannot "stay out" of the first-paint CSS: `theme-at-first-paint.test.ts` fails for any theme group but `typography` that is not published | `PIGGY_BANK_COLORS` in `src/theme/piggy-bank-colors.ts`, read directly; still written once. Supersedes Third review #9's mechanism and drops the mock-theme test |
| 2 | State | The child menu's `AppearanceSection` runs `router.refresh()` with `ChildSavings` mounted. After midnight that settles new interest, which "balance less coins waiting" shows at once and then takes back as coins on the next visit | The total comes from the uncollected interest, worked out from the live account and the visit's mark; interest settled mid-visit waits for the next visit's coins. A unit test |
| 3 | State | "Stored + N" made two tabs that collect the same coin add it twice, marking untapped interest collected | `collectInterest` writes the larger of the visit's mark and the stored one. A unit test |
| 4 | State | Third review #1 removed the cap on uncollected interest; a mid-visit refresh can still bring in a withdrawal made on another phone | A cap at "הרוויח לבד" inside `uncollectedInterestOf`, beside the raise (which still stops the recurring coins) |
| 5 | Architecture | `useCountUp({ from, to })` "counting again whenever `to` changes" left `from` meaning two things: where a mount starts, and where a change starts | `useCountUp({ startAt, to, timing })`: `startAt` only on mount, later from the number on screen. Tested. (Corrected in PR 1: `BalanceBreakdown` is keyed by the total and remounts on a deposit, so the parent screen is unchanged) |
| 6 | Tests | `useCollectedInterest` needs a required provider that `src/test-utils/render.tsx` does not give, so every existing test rendering `ChildAccount` would throw | The render helper takes a `collectedInterest` option, default `{}` |
| 7 | UX and a11y | PR 4 moved focus at the landing, after the tapped coin was disabled; a disabled or removed focused button drops focus to `<body>` | Focus moves at the tap in PR 3 and PR 4. A unit test |
| 8 | UX and a11y | An endless idle breathe is motion with no pause control (WCAG 2.2.2) | A few cycles, under 5 seconds, after mount and each landing |
| 9 | UX and a11y | `+₪N` in an RTL line renders `₪N+` | `dir="ltr"`, like the «הרוויח לבד» amount |
| 10 | Naming | `storedValue` names the mechanism; the sibling is `resolveThemeId(storedThemeId)` | `storedCollectedInterest` |

Checked and sound: SSR and hydration (the server snapshot is the request's cookie, so first paint and hydration agree;
later client mounts read the cookie); the visual shots (the e2e server pins `FUNSAVER_NOW`, so coin amounts are fixed);
account ids are `randomUUID()`, valid in a cookie name; neither the header nor the child menu shows a balance that the
uncollected coins would contradict; the cookie's value is display-only, validated, and read only for the user's own
accounts.

## Third review (2026-10-11)

Checked against `origin/main` 26b87a6 (#203 goal screen, #204 `savingsWithoutAgorot` locals, #205 Prettier — none
touches `ChildAccount`) in seven rounds: baseline, state, architecture, naming, scale and security, UX and a11y, tests.

| # | Round | Found | Fixed by |
|---|---|---|---|
| 1 | State | Capping uncollected interest at "הרוויח לבד" without moving the mark: after a savings withdrawal below the interest (ending a reached goal), the same coins came back every visit, and a later deposit showed as interest coins | The mark is raised to `interestEarned` less "הרוויח לבד" when resolved; the cap is gone |
| 2 | State | `ShownAccount` re-renders the same `ChildAccount` on an account switch, so `ChildSavings` does not remount and its visit's coins would follow onto the sibling. The plan stated the remount as a fact | `ChildAccount` keys `ChildSavings` by account id; a unit test |
| 3 | State | "No code path deletes a transaction" is false: `schema.sql` dedupes interest rows on every migrate, and a deleted account cascades | Claim corrected; the "above `interestEarned`" reset covers both |
| 4 | Architecture | `ChildAccount` cannot render the goal "between the total and the tiles": both are inside `ChildSavings`'s card | `ChildSavings` renders `ChildGoalProgress`, which moves under its folder |
| 5 | Architecture | PR 1 added `fullAt` and `goalReached` props and PR 2 a third for the same goal | One `savedTowardGoal` prop from PR 1, as `Account` does |
| 6 | Architecture | `piggyBankFill` got its own `src/lib` file, while `GoalProgressBar` keeps the same maths in the component | Beside `pile-spots.ts` in `PiggyBank/` |
| 7 | Architecture | Three new `src/lib/interest` files for four small functions of one kind | One `collected-interest.ts` |
| 8 | Architecture | Reusing `GOAL_PROGRESS_COPY` meant the child screen importing `Account/WalletCard/GoalProgress` internals | `GOAL_COPY.reached` in `components/Goal/constants.ts` |
| 9 | Architecture | ~20 pig colours, identical in all three themes, written three times | Written once, each theme points at it |
| 10 | Architecture | The hook's subscriber set and `pageshow`/`visibilitychange` listeners have no reader: the visit reads at mount, `collect` reads afresh | Not copied; the "a save tells every reader" test goes |
| 11 | Naming | `uncollectedInterest()` and `interestCoins()` would be shadowed by the values they return | `uncollectedInterestOf`, `interestCoinsOf`, like `savedTowardGoalOf` |
| 12 | UX and a11y | The art is `aria-hidden` yet was to carry the accessible name «החיסכון שלך» | The card takes `aria-label`; tested |
| 13 | Tests | The e2e "driver's `cookies`" does not exist: `DriverOptions` has `motion` and `viewMode` only | A `collectedInterest` option |
| 14 | Tests | Several bullets bundled 2–4 behaviours in one test | Split, one behaviour per test |
| 15 | Tests | No test for #1, #2 or #12 | Added to PR 1 and PR 3 |
| 16 | Scale | A coin label fits four digits, which three coins pass at ₪10,000 uncollected | Accepted, in Out of scope |

## Refresh (2026-10-11)

Against `origin/main` daddfee.

| # | Changed on `main` | Plan change |
|---|---|---|
| 1 | Goals shipped: `account.goal`, `savedTowardGoalOf`, `GoalProgressBar`, savings locked while a goal is active | The pig fills toward the goal from PR 1; the goal shows under the total (PR 2) with the existing bar |
| 2 | Child mode is the phone's, read through `view-mode-context.ts` with `useSyncExternalStore` | The mark copies that pattern: no state in `Home`, no props through `ShownAccount`; the `Home` round-trip tests become context tests and e2e |
| 3 | `readCookie` landed in `src/lib/cookies.ts` | Only `collectedInterestCookie` is new |
| 4 | `savingsWithoutAgorot` lives in `src/lib/wallet/wallet.ts` | Path updated |
| 5 | The design was measured at the live app's real sizes | Total `hero` → `display`, pig 50%, wallet rows 72px, label removed, a 393×745 e2e fit check |
| 6 | `Celebration` exists, unmounted | Out of scope |

## Second review (2026-10-04)

Checked against `origin/main` 82daf24 in six rounds: premise, state, architecture, scale, UX and a11y, tests. Rows 1, 5,
7 and 13 are superseded by the Refresh (the mark no longer lives in `Home`).

| # | Round | Found | Fixed by |
|---|---|---|---|
| 1 | State | A mark read from page-load props goes stale: `switchAccount` has no refresh, and the view-mode switch shows the child screen before `router.refresh()`. Collected coins came back after A → B → A. | The mark lives in `Home` state, seeded from the server, saved with the cookie |
| 2 | State | Writing the mark only "when it differs" never renewed the one-year cookie | Save on every mount |
| 3 | State | `PIGGY_BANK_FULL_AT` was given as ₪300 with no unit | `shekelsToAgorot(300)` |
| 4 | Premise | The goal counts as reached on the real balance, but the pig fills from the shown one | The pig is full once `goalReached` |
| 5 | Premise | The prop path skipped `ShownAccount` | `Home` → `ShownAccount` → `ChildAccount` |
| 6 | Architecture | PR 1 put rules on `main` with no caller for two PRs | Each rule ships with its first caller |
| 7 | Architecture | `use-collected-interest` would have named both the marks and the coins | Separate files for the marks and the visit |
| 8 | Architecture | `savingsWithoutAgorot` would have taken a second positional argument | One params object |
| 9 | UX | "Bigger coins" could read as drawn bigger; a coin label was not sized for large amounts | Same drawn size; labels fit four digits |
| 10 | A11y | `aria-live` on a rolling number reads out every frame | A hidden live line with the landed total |
| 11 | A11y | Focus moved to a total that cannot take focus | `tabIndex={-1}` on the total |
| 12 | Tests | A colour assertion through a real theme passes against a pig that ignores it | A mock theme with a different pink |
| 13 | Tests | No test for #1 | `Home` tests for account and view-mode round trips |
| 14 | Tests | `useCountUp` would only count on mount, and from 0 on every child visit | Counts on each `to` change; nothing when `from` equals `to` |

## After PR 2 (2026-10-13)

Against `origin/main` 9abe018. What PR 2 and #212 change for PR 3 and PR 4:

| # | Shipped | Plan change |
|---|---|---|
| 1 | The child card reuses `GoalProgress` (`size="large"`, `glowWhenReached`); no `ChildGoalProgress` | PR 3 feeds `GoalProgress` the shown `SavedTowardGoal`; the card shows `saved` out of the amount, not «עוד ₪N» |
| 2 | With a goal and no coins, the wallets end at ~684px of 745 (`PHONE_IN_SAFARI`) | The copy line and coin row get ~61px. They must overlap the pig's empty top (mockup `.smaller .pigArea { margin-top: -16px }`, coin row 58px), or the existing fit check fails. Re-run it with coins waiting |
| 3 | `childAccount.waitForGoal()`, `walletsBottom()`, `goalAmountsBox()`, `goalAmountsLines()` in `e2e/driver/child-account-driver.ts`; `goalPictureGlow()` in `src/test-utils/goal-picture.ts` | Reuse them; add coin methods to the same driver |
| 4 | `ChildSavings.tsx` holds the pig, the total, the goal and the tiles | PR 3 adds the coins, the copy line and the live line: watch the 200-line / 40-line limits; extract (e.g. the total and its live line) rather than squeeze |
| 5 | PR 2 was merged before its last review round; the fixes needed a second PR | Get every review round done before asking for the merge |

## After the layout shots (2026-10-16)

Measured in the real app (e2e harness, 393×745, with a goal) during PR 3. Overrides "The screen" items 1–3 and the
Decisions rows on the coin row.

| # | Found | Change |
|---|---|---|
| 1 | Keeping the copy line and the coin row's space with no coins put a gap above the pig and pushed the wallets to 745.6px, past the screen, even with no coins | **The space exists only while coins wait.** With none, `InterestCoins` draws nothing and the pig sits at the top of the card. A visit with coins is drawn with the space open from the server's first paint, so nothing moves on arrival; a deposit leaves it as it is |
| 2 | The mockup's 16px overlap put the `+₪N` tags 2.8px over the pig's ears | The coins never overlap the pig. The pig moves up 10px under the coin row (3.2px clear of the ears), and the card's top padding goes 22 → 8px (the mockup's "smaller" value). Coins waiting: wallets end at 737.6px, 7px to spare |
| 3 | `stylis-plugin-rtl` flips `left` to `right` but not `translate`, so `left: 50%; translate: -50%` drew each tag a tag-width off its coin | Tags are centred with `left: 0; right: 0; width: max-content; margin: auto` |
| 4 | The space now closes when the last coin goes in | **PR 3:** it closes at once (no motion yet). **PR 4:** it waits for the landing and the wiggle, then closes slowly so the pig settles up (mockup `mockups/2026-10-04-child-piggy-bank.html#coin-space`, variant C). Under reduced motion it closes at once |

