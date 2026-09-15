# Donut load animation — the ring draws itself on load

**Date:** 2026-09-14
**Mockup:** `mockups/donut-load-animation.html` (five candidates, three themes, replay button) — the one
being built is **ה · סוויפ הכי קצר**, 0.6s.
**Worktree:** `/Users/technotronic/Projects/technotronic/fun-saver-legend-icons` on
`feat/donut-load-animation`, branched off `origin/main`. This branch carries the mockup and this plan.
**Branching:** each step below starts fresh off updated `origin/main`.

## Before you start

Open `mockups/donut-load-animation.html` in a browser and press **הרץ שוב** a few times. Candidate ה is the
spec; א–ד stay on the page as the record of what was rejected and why. `CLAUDE.md` governs the workflow
(branch per PR, production code → approval → commit, then tests **one at a time** with approval between
each). Don't batch tests.

**Current state of the card** (`src/components/Account/OverviewCard/`): `Donut` draws a track circle plus one
`<circle>` per wallet with a computed `stroke-dasharray` / `stroke-dashoffset`, `OverviewCard` puts the total
in the hole via `Money`, `Legend` lists the three rows. Nothing moves — the card is fully drawn on first
paint.

**Verify:** `npm test` (unit), `npm run lint`, `npx tsc --noEmit`, `npm run test:visual` (needs a build; kill
any `next dev` first). Seed data for the browser: `cp ~/Projects/technotronic/fun-saver/src/db/data.json
src/db/data.json` then `FUNSAVER_NOW=2026-09-12 npm run dev`.

## Progress

- [x] PR 1 — the ring sweep (#57, merged)
- [x] PR 2 — the count-up and the legend fade (#60)

Both steps shipped. The sections below record the plan as written; **What actually shipped** at the bottom
records where the build departed from it and why.

## Goal

```
0ms     the ring is empty, the hole says סך הכל, the legend is blank
0–340   חיסכון draws clockwise from 12 o'clock
80–680  the total counts 0 → ₪359
220     the legend rows start fading up, 50ms apart
340–550 בזבוזים draws
550–600 מעשים draws
600     everything is still
```

Under `prefers-reduced-motion: reduce` none of it runs — the card paints finished, exactly as it does today.

## Decisions (locked with the user)

- **Candidate ה, not ד.** Same shape as ד — the sweep of א with the legend fade of ב over it instead of
  behind it — squeezed from 0.8s into 0.6s, which is ב's budget. The cost is that מעשים at 8% gets a 50ms
  arc, closer to a flash than a draw; accepted.
- **Arc durations are proportional to share**, not equal. The 57% wallet gets 57% of the sweep. This falls
  out of the share the `Donut` is already handed, so it stays correct for any split.
- **The count-up runs on mount only.** Later changes to the total snap. It is a load animation; re-counting
  from zero after every deposit turns a flourish into a delay the kid sits through.
- **Switching accounts replays it.** The card is keyed by account id, so another kid's split arrives as fresh
  data rather than as numbers quietly changing in place.
- **`prefers-reduced-motion` is honoured by every piece**, including the count-up — which means the hook has
  to check it in JS, not only the styles.

## PR slicing

Two PRs. 1 → 2 in order; 2 needs 1's constants.

---

### PR 1 — the ring sweep

The arcs draw. The total and the legend stay as they are today, fully painted from the first frame.

**`OverviewCard/constants.ts`.** New `DONUT_ANIMATION`: `sweepMs: 600`, plus the fields PR 2 needs
(`amountDelayMs: 80`, `amountMs: 240`, `legendDelayMs: 220`, `legendStepMs: 50`, `legendMs: 220`). Every
timing lives here — no literal in a styles file.

**`Donut/Donut.tsx`.** `toArcs` already walks the segments accumulating `consumed`; it gains two fields per
arc — `duration = share / PERCENT_TOTAL × sweepMs` and `delay = the sum of the durations before it`. This is
the only real logic in the feature and the thing the unit test targets. A zero-balance wallet gets a zero
duration and must not consume a slot in the sequence.

**`Donut/Donut.styles.ts`.** A `drawArc` keyframe going from `stroke-dasharray: 0 <circumference>` to the
arc's own dasharray, and `Arc = styled.circle` taking `duration` / `delay`. Keyframes live here — `CLAUDE.md`
4a forbids them in a `.tsx`. The reduced-motion `@media` block sits on the same styled component.

**`e2e/driver/session.ts`.** At `newPage()`, `emulateMediaFeatures` with `prefers-reduced-motion: reduce`.
Without it `dashboard.visual.ts`, `deposit.visual.ts` and `withdraw.visual.ts` can screenshot a half-drawn
ring — flaky by construction. With it the screenshots are stable *and* the reduced-motion path is exercised
on every e2e run instead of never.

**Tests:** the arc timings off `toArcs` — proportional durations, cumulative delays, a zero-share wallet
taking no time.

---

### PR 2 — the count-up and the legend fade

**`OverviewCard/use-count-up.ts`.** `useCountUp(target, { delayMs, durationMs }): number` on
`requestAnimationFrame`. Counts from 0 on mount; a later change to `target` snaps. When
`matchMedia('(prefers-reduced-motion: reduce)')` matches it returns the target immediately and never schedules
a frame. Co-located rather than in `src/hooks/` — one consumer.

**`OverviewCard.tsx`.** The hole's `Money` takes the counted value instead of the raw total. `holeFontSize`
keeps sizing off the *final* total, so the digits don't resize mid-count.

**`Legend/Legend.tsx` + `Legend.styles.ts`.** `Row` gains the index it already has from the `map` and turns it
into `animation-delay: legendDelayMs + index × legendStepMs`.

**Account keying.** `Account.tsx` keys `OverviewCard` by account id so a switch remounts it and replays.

**Tests:** the hook returns the target immediately under reduced motion; a legend row carries the delay for
its position.

## What actually shipped

The plan held, but review changed four things worth carrying forward:

- **No pre-laid constants.** PR 1 was going to add PR 2's five timing fields up front. Review called it
  correctly — a constant nothing reads is a constant nothing verifies, and by the time PR 2 landed those
  numbers had been retuned anyway. Each PR added the fields it used. The timings also split by what they
  belong to: `DONUT_ANIMATION` (the arcs), `TOTAL_ANIMATION` (the number), `LEGEND_ANIMATION` (the rows),
  with `countMs: DONUT_ANIMATION.sweepMs` so the number and the ring finish together by construction.
- **Motion is a `useDriver` option, not a hardcoded line in `session.ts`.** Every e2e session still asks for
  reduced motion by default, but `useDriver(seed, 'no-preference')` opts back in, which is what let
  `donut-sweep.visual.ts` cover the animated path. The query it uses reads each arc's computed
  `animation-name` — `none` under reduced motion, the keyframe otherwise — so nothing has to be caught mid-draw.
- **`entrance()` in `src/theme/motion.ts`.** Three components declare a load animation; the five `animation-*`
  lines and the reduced-motion guard live in one helper instead of being copied three times.
- **`use-count-up.ts` became `use-animated-wallet-total.ts`.** `useAnimatedWalletTotal(walletTotal)` animates
  *progress* and multiplies, which is what makes "animate on mount, snap afterwards" fall out with no second
  effect. `jest.setup.ts` now defaults the jsdom `matchMedia` stub to **motion**, so the animated path is
  reachable from unit tests and a test wanting the settled card asks for reduced motion out loud.

**The one coupling to remember:** nothing flashes the final total before hydration only because the amount's
fade holds it at opacity 0 through its 80ms delay. Remove the fade, or set `startDelayMs: 0`, and the
server-rendered total becomes visible for a few frames before the count resets it to zero.

## Out of scope

- Animating anything else on the screen — the wallet cards, the stat strip, the action button.
- Transitions when a balance changes (the deposit/withdraw path stays instant).
- A settings toggle for animations beyond the OS-level `prefers-reduced-motion`.
- Candidates א–ד. They stay in the mockup as a record, not as work.
