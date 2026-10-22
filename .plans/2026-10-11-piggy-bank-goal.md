# Child piggy bank, PR 2 — the goal under the total

> Approved 2026-10-11. PR 2 of 4 in `2026-10-04-child-piggy-bank.md`,
> re-planned against `origin/main` 48c78e9, where `GoalProgress` is shared in `src/components/Goal/GoalProgress`.

## Decision

The child card **reuses `GoalProgress`** instead of a `ChildGoalProgress` of its own. The locked design's
«· עוד ₪N» heading is dropped; the card shows what `GoalProgress` shows everywhere: the name, then «₪85 / ₪250».

## Production code

1. `GoalProgress` takes `size` (`GOAL_PROGRESS_SIZE`: `small`, the default and today's look; `large`, the child card):
   a bigger picture, the heading one type step up, and the 14px bar (`thin` only for `small`). A third size is one more
   entry.
2. `GoalProgress` takes `glowWhenReached` (default `false`): the picture glows, in theme colours only (`gainSoftBg`
   ring, `gainText` glow), when it is set and the goal is reached. The savings card and the menu do not set it.
3. `ChildSavings` renders `<GoalProgress size="large" glowWhenReached />` between the total and
   `PrincipalAndInterest`, only with a goal.
4. `PHONE_IN_SAFARI` (393×745, iPhone 16 with Safari's bars hidden) beside `PHONE` and `SMALL_PHONE`.
5. `e2e/child-view.e2e.ts`: at `PHONE_IN_SAFARI`, with a goal, the good-deeds row ends inside the viewport.

## Tests

- `ChildSavings`: no goal without one; names the goal; shows the goal's amount; the bar gets the same
  `savedTowardGoal`; the reached heading; the picture glows once reached.
- `GoalProgress`: `large` draws the 14px bar; `small` keeps the thin one; glows once reached with `glowWhenReached`;
  no glow while saving; no glow when reached without it.
- e2e fit check.

## Screenshots

The child card, in progress and reached.
