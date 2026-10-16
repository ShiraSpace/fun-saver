# The child's piggy bank celebrates a reached goal

Chosen design: **D, the confetti party and the coin fountain together**, in
`mockups/goal-celebration-child.html` (2026-10-16). The mockup is built on the
piggy bank's coin space, option C (`mockups/coin-space.html` in
`fun-saver-piggy-bank`: the space closes after the last coin lands).

Worktree `fun-saver-child-celebration`, branch `feat/child-goal-celebration`,
off `origin/main` `3dd3142`.

## Why

Saving-goal PR 5 (#217, #219) celebrates a reached goal on the parent's savings
card only, and decided "child mode mounts no `Celebration`". The child is the
one who saved, so the child's screen should celebrate too, on the piggy bank
the child watched fill.

## Before starting: what must be on `main`

This PR builds on three others. Rebase the plan on whatever they actually
merged; if a name differs, `main` wins, and update this plan first.

| Needed | From | Check on `main` |
| --- | --- | --- |
| `Celebration` keyed by account, `celebration-parts.ts` (`travellingBorder`, `wobble`, `shine`), the theme's `celebrationBorder*`, `celebrationOutline`, `celebrationGlowOpacity`, `registerTravellingBorderAngle`, `GoalProgress`'s `celebratesWhenReached` | #219 (saving-goal PR 5b) | `git grep -n "travellingBorder\|celebrationOutline\|celebratesWhenReached" origin/main -- src` |
| `InterestCoins`, `use-interest-coins.ts`, `SavingsBalance`, the shown savings that leave out uncollected interest | #218 (piggy bank PR 3) | `git grep -n "InterestCoins\|SavingsBalance" origin/main -- src` |
| The coin space closing slowly after the last coin lands (coin-space option C) and its timing constants | piggy bank PR 4 (motion) | its plan and `ChildSavings.styles.ts` |

Confirm each by content (this repo squash-merges). Start Step 1 only once all
three are in.

## What plays (mockup D)

When the shown savings reach the goal, the child's home plays, at once:

- the app's confetti (`Celebration`) for 10 seconds, then it fades;
- the travelling border round the savings card, then the card keeps the
  theme's `celebrationOutline`;
- the coin fountain: about 26 coins pop out of the pig's slot, arc up and rain
  down past the cards (about 4 s);
- the pig hops three times, and its eyes turn into happy arcs;
- the total bumps twice and glows gold, with sparkles round it;
- the shine runs along the full bar (`GoalProgress` `celebratesWhenReached`).

Resting state, after 10 s and all a reduced-motion phone shows: the card's
outline, the reached goal row (green, as today), and the pig's happy eyes.

## When it plays

As in #219: CSS that runs once when the element mounts, so there is no timer
and no "celebrated" flag.

- **The last coin reaches the goal.** The shown savings become reached when the
  last coin is tapped in. The celebration waits for the coin space to settle
  (the wiggle, then the slow close; PR 4's timing) and then plays. Only this
  path waits: the delay is passed as the animations' `animation-delay`, not a
  timer.
- **Home opens with the goal already reached** (no coins waiting): it plays at
  once, as on the parent's card.
- **Account switch:** keyed by `account.id`, as #219 does for `Account`.
- **`router.refresh()`:** nothing remounts, so nothing replays.
- **A deposit made in parent mode reaches the goal:** the child sees it on the
  next open of child mode, which plays it.
- **Coins waiting but the goal is reached without them:** the celebration plays
  on open. Tapping more coins adds to an already-reached goal and does not play
  it again.

## Names (glossary first)

- `Celebration`: reused as is.
- `CoinFountain`: the coins that pour out of the piggy bank when the goal is
  reached. New glossary row, beside `CoinPile` (not "coin burst", "coin rain").
- The pig's happy eyes: a `PiggyBankFace` state named after the goal, such as
  `goalReached`, not a `happy`/`smile` mechanism flag. Check how `PiggyBankFace`
  names its props on `main` first.
- The pig's hop and the total's glow are style helpers in their components'
  `.styles.ts`, next to #219's `wobble`/`shine` in `celebration-parts.ts` if
  more than one component uses them.

## Steps

Each step: production code, then "commit", then the first three tests (each
watched failing against its own break), then approval, then the rest, then
"commit tests".

### Step 1: the confetti and the card in child mode

Production:
- `ChildAccount` mounts `Celebration` (keyed by `account.id`) when the shown
  savings reach the goal.
- `ChildSavings`' card takes #219's `travellingBorder` and `celebrationOutline`;
  its `GoalProgress` passes `celebratesWhenReached` (shine, picture wobble).
- The delay after the last coin: `ChildSavings` knows the reached state came
  from a coin tap this visit, and hands the settle time to the celebration's
  `animation-delay`.

First three tests (`ChildAccount.test.tsx` / `ChildSavings.test.tsx`):

| Test | Break |
| --- | --- |
| a reached goal plays the celebration in child mode | drop the mount |
| a goal reached only once the waiting coins are in does not play before the last tap | mount on the stored savings, not the shown ones |
| the last coin's tap plays it, after the coin space settles | no delay on the coin path |

Rest: an unreached goal does not; switching account plays it again (new
element); refresh keeps the same element; the card keeps the outline.

### Step 2: the piggy bank celebrates

Production:
- `CoinFountain`: absolutely placed over the screen, `pointer-events: none`,
  `aria-hidden`, on `LAYERS.celebration`. Coins start at the pig's slot;
  each coin's arc is fixed data in its `constants.ts` (no `Math.random`, so
  server and client draw the same, as `coin-pile.ts` does). Hidden under reduced
  motion.
- `PiggyBank`: hops three times while celebrating (body only, the shadow stays).
- `PiggyBankFace`: happy eyes and brighter cheeks for a reached goal; these stay
  after the motion stops.
- `SavingsBalance`: the total bumps and glows, with sparkles.

First three tests: `CoinFountain` draws its coins; it is not rendered under
reduced motion; `PiggyBankFace` draws happy eyes for a reached goal (break:
the open eyes stay). The rest: the hop is off under reduced motion; the
total's glow only while celebrating; the fountain starts from the slot.
Motion itself is checked in screenshots, since jsdom has no layout.

### Step 3: browser checks, screenshots, docs

- `e2e/child-home.visual.ts`: a reached goal celebrates in child mode on a
  phone that allows motion; the last coin plays it; a reduced-motion phone shows
  only the resting state. The coins and the celebration stay inside 393×745
  (`childAccount.walletsBottom()`); the layout must not move.
- `.plans/2026-10-03-saving-goal.md`: the "later: the goal in child mode" row
  points here.
- `docs/glossary.md`: `CoinFountain`, and the «A goal reached, shown» row gains
  the child's part.
- Screenshots (`pr-screenshots`) in all three themes: mid-play, settled, and
  reduced motion.

## Open points

- The coin fountain over the wallet rows: in the mockup the coins rain past the
  bottom cards. Keep, or clip them to the savings card?
- Sound: none, as everywhere else in the app.
