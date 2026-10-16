# Saving goal PR 5 — the celebration

Parent plan: `.plans/2026-10-03-saving-goal.md` (PR 5). Spec: Decisions «How
often the celebration plays», New components (`Celebration`), Changes to
existing components (`WalletCard, savings`). Mockup: `.savingsCard.celebrating`,
`.savingsCard.reachedOutline` and the reduced-motion block
(`mockups/saving-goal.html:64-106`).

Worktree `fun-saver-celebration`.

| PR | Branch | What | State |
| --- | --- | --- | --- |
| 5a | `feat/goal-celebration-plays` | Step 1, and `SavedTowardGoal.reached` → `isGoalReached` | Merged #217 (`a4645f5`) |
| 5b | `feat/goal-celebration-card` | Steps 2–3, off `a4645f5` | Step 2 done; step 3 in progress |

`feat/goal-celebration` on the remote is #188's merged branch; not reused.

## Decisions (2026-10-16)

- Only the parent's savings card celebrates. The child's piggy bank keeps the
  reached glow it has today; child mode mounts no `Celebration`.
- The confetti plays on home and on the goal screen, as the spec says.
- The motion is the mockup's: the border goes round every 2 s, 5 times; 🐷
  wobbles every 0.8 s, 12 times; the goal picture wobbles the same way 0.4 s
  later; the bar shines every 1.4 s, 7 times. The border fades with the confetti
  (`CELEBRATION_MOTION.fadeDelayMs` / `fadeMs`), so the whole card is still by
  10 s. No motion choice is open.
- Each theme owns the border's colours (`celebrationBorderLight/Main/Accent/Deep`,
  apart from the confetti's), `celebrationOutline` (card outline, picture ring,
  goal-screen ring), `reachedBarStart` and `celebrationGlowOpacity`. sunshine
  and jungle look as the mockup; midnight-blue is "night sky"
  (`mockups/saving-goal-celebration-themes.html`, option B). The shine is 60%
  white everywhere (`mockups/saving-goal-shine.html`).
- The border's angle is registered from code (`registerTravellingBorderAngle`,
  on `WalletCard` mount): `next dev`'s Tailwind pipeline drops an `@property`
  rule in `globals.css`, which left the border standing still.
- A reached goal's picture keeps a ring and its bar a gradient wherever
  `GoalProgress` draws it, as the mockup's `.goalProgress.reached` does.
- Wallet cards sit 10 px apart (was 8).

## How it plays, and replays

All of it is CSS that runs once when the element mounts. No timer and no
"celebrated" state:

- **Home opens or the goal screen opens:** the elements mount, so it plays.
- **`router.refresh()`:** the same elements stay mounted, so nothing replays.
- **Account switch:** `WalletCard` is keyed by `wallet.id`, which repeats across
  accounts (`savings`), so today a switch does **not** remount the card. `Account`
  keys `WalletList` and `Celebration` by `account.id`, the way it already keys
  `BalanceBreakdown`.
- **A deposit reaches the goal while home is open:** after the refresh the card
  becomes reached, so `Celebration` mounts for the first time and plays. This is
  the first play, not a replay.
- **Reduced motion:** `Celebration` already hides itself through
  `@media (prefers-reduced-motion: reduce)`. The card's border, wobble and shine
  do the same, and the outline stays.

---

### Step 1 — the confetti on home and on the goal screen

Production:
- `Account.tsx`: `{isGoalReached && <Celebration key={account.id} />}`
  after `Column`, and `key={account.id}` on `WalletList`. `ChildAccount` is not
  touched.
- `ViewGoal.tsx`: `{isGoalReached && <Celebration />}`. The goal screen sits in
  `Overlay` (`LAYERS.modal`), so the confetti falls over it; the home confetti
  underneath is covered by the overlay.

First three tests (`Account.test.tsx`):

| Test | Break |
| --- | --- |
| a reached goal plays the celebration | drop the `Celebration` mount |
| a goal not yet reached does not | mount it whenever there is a goal |
| switching to another account with a reached goal plays it again (a new element) | drop `key={account.id}` |

Rest: refreshing with the same account keeps the same element (no replay);
`ViewGoal` plays it for a reached goal; `ViewGoal` does not for an unreached one.

### Step 2 — the savings card celebrates (done)

Production, as built:
- `Celebration/celebration-parts.ts`: `travellingBorder(theme, cornerRadius)`,
  `wobble(delayMs)` and `shine(theme)`, each off under reduced motion.
- `WalletCard`: `Card` gets the theme's `celebrationOutline` and, while it plays,
  the travelling border and its glow (`celebrationGlowOpacity`); `WalletIcon`
  (🐷) wobbles. It mounts `registerTravellingBorderAngle` (see Decisions).
- `GoalLine` passes `celebratesWhenReached` to `GoalProgress`, which wobbles the
  picture 0.4 s after 🐷 and passes `celebrating` to `GoalProgressBar` for the
  shine. `MenuGoal` and `ChildSavings` don't pass it.
- `WalletList`'s list has `isolation: isolate`, so the border's `z-index: -1`
  sits behind the card.
- The goal screen's reached card (`GoalHero`) rings itself in
  `celebrationOutline` too.
- Colours: the theme tokens listed under Decisions; no literals in components.

Tests (each watched failing against its own break): the card's outline and 🐷
wobble (`WalletCard`), the picture ring, glow and wobble (`GoalProgress`), the
reached bar's colours (`GoalProgressBar`), the goal screen's ring (`GoalHero`),
`GoalLine` celebrates and `MenuGoal`
stays still, and `registerTravellingBorderAngle`. jsdom can't read `::before` /
`::after`, so the border, glow and shine are checked in screenshots.

### Step 3 — e2e and docs (done)

- `e2e/goal.visual.ts`: «a goal reached» keeps the celebration off a phone that
  reduces motion; «a goal reached, on a phone that allows motion» celebrates over
  home. `GoalDriver.celebrationShown()` checks it is mounted and displayed. Both
  run and watched failing in a separate worktree, so the dev server's `.next` is
  left alone.
- `.plans/2026-10-03-saving-goal.md`: 4b row → merged (#209, #211, #214); PR 5
  row → this PR.
- `docs/glossary.md`, the «A goal reached, shown» row: add the card's part
  (`celebratesWhenReached`) and «the travelling border». Done.
- Screenshots of home playing and settled, and the goal screen, in all three
  themes, through `pr-screenshots`.

## Not in this PR

- The child's piggy bank celebrating (decided 2026-10-16).
- A seeded "reached" goal for local Neon `dev`: still none (as in PR 3).
