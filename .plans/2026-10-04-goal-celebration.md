# Saving goal, PR 5a: the `Celebration` component

**Branch:** `feat/goal-celebration`, worktree `fun-saver-goal-celebration`, off
`origin/main` at `a47859a`.
**Parent plan:** `.plans/2026-10-03-saving-goal.md` (PR 5). **Spec:**
`docs/superpowers/specs/2026-10-03-saving-goal-design.md`, the `Celebration` row of
"New components" and the "How often the celebration plays" decision.
**Mockup:** `mockups/saving-goal.html`, frames 2b and 4b, lines 53-62 and 81-82
(CSS) and the 60 `<i>` pieces on line 383.

## What this PR is

A self-contained `Celebration`: the confetti that falls for about 10 seconds and
then fades. **No screen renders it yet.** It does not touch `GoalProgress`,
`ViewGoal`, `MenuGoal`, the savings card's border, wobble or bar shine (PR 3 / the
wiring PR), and nothing mounts it.

### What the spec says it is (and is not)

- Confetti only. The `הגעת ליעד!` heading belongs to `ViewGoal` (frame 2b) and
  `🎉 הגעת ליעד!` to `GoalProgress` (4b). `Celebration` has **no copy**.
- `pointer-events: none` and `aria-hidden`: nothing to tap, so **no dismiss
  callback**. It ends by itself (fade to opacity 0).
- Drawn above the cards on a `LAYERS` value below `modal`.
- Hidden when the device asks for reduced motion: `@media REDUCED_MOTION { display: none }`
  on the layer, like `entrance()`; no hook.
- Replays on remount only. CSS animations do not restart on re-render, so
  `router.refresh()` not replaying it comes for free; the caller (wiring PR)
  replays it by mounting it, and by `key` on an account switch.

So the component takes **no props**: it does not need the `Goal`. The caller
decides whether to render it (`goalReached(goal, balance)`), which is wiring.

## Public API

```ts
// src/components/Goal/Celebration/index.ts
export { Celebration } from './Celebration';

// Celebration.tsx
export function Celebration(): JSX.Element | null;
```

## Names (checked against the glossary and siblings)

| Name | Why |
| --- | --- |
| `Celebration` | Glossary: "A goal reached, shown → `Celebration`; not confetti, party". |
| `src/components/Goal/Celebration/` | Spec: new goal components live in `src/components/Goal/<Name>/`. |
| `CELEBRATION_TEST_IDS`, `CELEBRATION_PIECES`, `CELEBRATION_COLORS`, `CELEBRATION_MOTION` | `<COMPONENT>_TEST_IDS` / `_ANIMATION` / `_STYLE` pattern (`EMPTY_STATE_ANIMATION`, `MENU_OVERLAY_STYLE`). "confetti" stays out of identifiers, per the glossary's Not column. |
| `CelebrationPiece` (type) | one falling piece. |
| `LAYERS.celebration` | beside `overlay` / `modal`. |
| `celebrationGold`, `celebrationPink`, `celebrationPurple`, `celebrationGreen`, `celebrationBlue`, `celebrationOrange` | new `ThemeColors` fields, as the spec asks ("confetti … colours are new `ThemeColors` fields"), named like the `chart*` / `wallet*` families. |
| Styled: `Falling` (the full-screen layer), `Piece`; keyframes `fall`, `fadeAway` | name what is drawn. |

## Look and motion (copied from the mockup)

- Layer: `position: fixed; inset: 0; overflow: hidden; pointer-events: none;
  z-index: LAYERS.celebration`. Fades: `fadeAway` to `opacity: 0`, **800 ms,
  `ease-in`, starting at 9 200 ms, `forwards`**.
- 60 pieces, each `position: absolute; top: -20px; border-radius: 2px;
  opacity: 0.9`, its own `right` %, width, height, fall time, delay and sway,
  copied verbatim from line 383. Colour cycles by index through six:
  gold, pink, purple, green, blue, orange (the mockup's order).
- `fall`: `linear`, one run, fill `both`, `--sway` per piece:
  `0% translate(0,0) rotate(0)`, `25% translate(var(--sway), Y1) rotate(180deg)`,
  `50% translate(0, Y2) rotate(360deg)`, `75% translate(calc(var(--sway) * -1), Y3)
  rotate(540deg)`, `100% translate(0, Y4) rotate(720deg)`.
  The mockup's screen is 760 px and the pieces fall 200 / 400 / 600 / 820 px, so in
  the app (full viewport, not a phone frame) **Y = 26vh / 53vh / 79vh / 108vh**.
- Ranges, for reference: fall 2.4-3.6 s, delay 0-6 s, sway ±10-30 px, sizes
  6/8/10 × 6/10/14 px. Last piece lands by ~9.6 s; the fade covers 9.2-10 s.
- Animation properties are written as long-hands (`animation-name`, `-duration`,
  `-delay`, `-timing-function`, `-fill-mode`), as `entrance()` does, so jsdom's
  `getComputedStyle` reads them in tests (the `Donut` test relies on this).
  `entrance()` itself does not fit: it fills `backwards` and has its own
  reduced-motion branch.

### Theme colours

`ThemeColors` gains the six fields; each theme file sets them. `no-color-leaks`
keeps the literals in `src/theme/themes/*`. They are plain strings, so
`everyThemeAsCss()` emits six harmless `--fs-color-celebration*` vars like every
other colour (a tuple field would emit junk there, which rules that shape out).

| Field | sunshine-quest (mockup) | jungle-quest (proposed) | midnight-blue (proposed) |
| --- | --- | --- | --- |
| `celebrationGold` | `#FFD23F` | `#F9C74F` | `#FCD34D` |
| `celebrationPink` | `#E94E89` | `#F28482` | `#F472B6` |
| `celebrationPurple` | `#6B2C8E` | `#7B5EA7` | `#A78BFA` |
| `celebrationGreen` | `#5CC870` | `#90BE6D` | `#34D399` |
| `celebrationBlue` | `#2563EB` | `#2A9D8F` | `#60A5FA` |
| `celebrationOrange` | `#FF8A4C` | `#E76F51` | `#FB923C` |

Jungle and midnight values are proposals to tune by eye. They must differ from
sunshine in at least one colour, or the theme test below cannot fail
(AGENTS.md: a theme assertion uses a non-default id).

### Reduced motion

`Falling` carries `@media ${REDUCED_MOTION} { display: none; }`, as `entrance()`
does with `animation: none`. The browser follows the setting, so there is no hook,
no server snapshot and no hydration question. The pieces are mounted but never
drawn; the layer is `aria-hidden`, so nothing reaches a screen reader either.
jsdom does not evaluate `@media`, so this is not unit-tested.

## Tasks

Phase 0 is done: the branch is fresh off `origin/main`, the tree is clean, and
`npm install` left `package-lock.json` untouched.

### Task 1: theme tokens and the layer (production)

- `src/theme/theme-tokens.ts`: six `readonly celebration*: string` fields.
- `src/theme/themes/{sunshine-quest,jungle-quest,midnight-blue}.ts`: the values
  above.
- `src/theme/layers.ts`: `celebration: 65`, between `overlayForeground` (60, the
  header and burger) and `modal` (70, the transaction drawer). Over the header,
  like mockup 4b; under the drawer, as the spec asks.

### Task 2: the component (production)

`src/components/Goal/Celebration/`:

- `constants.ts` (~90 lines):
  - `CELEBRATION_TEST_IDS = { celebration: 'celebration', piece: 'celebration-piece' }`
  - `CELEBRATION_COLORS`, the six fields in mockup order (like `WALLET_COLOR`),
    `as const satisfies readonly (keyof ThemeColors)[]`.
  - `CELEBRATION_MOTION = { fadeDelayMs: 9200, fadeMs: 800 }`.
  - `type CelebrationPiece = readonly [rightPercent: number, widthPx: number,
    heightPx: number, fallMs: number, delayMs: number, swayPx: number]` and
    `CELEBRATION_PIECES: readonly CelebrationPiece[]`, the 60 mockup pieces.
    Labelled tuples, one per line: prettier here uses the default 80 columns, and
    an object per piece (~82 chars) would wrap to 8 lines each, 480 lines, far
    past `max-lines`. Transcribed with a one-off `node` read of line 383, not
    by hand.
- `Celebration.styles.ts`: `fall` and `fadeAway` keyframes, `Falling`, and
  `Piece` taking `{ piece: CelebrationPiece; colorName: keyof ThemeColors }`
  (non-HTML prop names, so emotion does not forward them to the DOM), reading
  `theme.colors[colorName]` in its style helper. `Piece` sets `--sway`, `right`,
  `width`, `height`, `background`, `animation-duration`, `animation-delay`.
  Single-use px stay inline here (memory: style values inline). ~55 lines.
- `Celebration.tsx` (`'use client'`), ~25 lines, one function well under 40:
  `<Falling aria-hidden
  data-testid>` with one `<Piece>` per entry, `key` = index (a fixed list),
  `colorName` `CELEBRATION_COLORS[index % CELEBRATION_COLORS.length]`.
- `index.ts`: `export { Celebration } from './Celebration';`

Checks before showing: `./node_modules/.bin/tsc --noEmit`,
`./node_modules/.bin/eslint src/components/Goal src/theme`, `npx jest src/theme`
(`no-color-leaks`, registry). STOP for review, then commit:
`feat(goal): the celebration rains confetti for ten seconds when a goal is reached (not shown yet)`.

### Task 3: tests (after the production commit is approved)

`src/components/Goal/Celebration/Celebration.test.tsx`, `render` from
`@/test-utils/render`, `render()` in `beforeEach`, `getByTestId`. Each test
watched failing against its own break: copy the file aside, apply the break,
run only this file, read which test reddens, restore from the copy, `cmp`.

**First three** (STOP for approval after these):

| Test | Asserts | Deliberate break |
| --- | --- | --- |
| hides the celebration from screen readers | the layer has `aria-hidden="true"` | drop `aria-hidden` |
| lets a tap through to the cards under it | computed `pointer-events` is `none` | delete the `pointer-events` line |

**The rest, in bulk:**

| Test | Asserts | Deliberate break |
| --- | --- | --- |
| drops every piece the mockup drops | 60 `piece` test ids (literal `mockupPieceCount`) | render `CELEBRATION_PIECES.slice(1)` |
| lets each piece fall for its own time after its own wait | first piece 2600ms / 4000ms, second 3500ms / 1300ms (`animation-duration` / `-delay`) | swap duration and delay in `Piece`; separately, draw every piece from `CELEBRATION_PIECES[0]` |
| places each piece where the mockup does | first piece 32% / 6px / 14px, second 57% / 6px / 10px (`right` / `width` / `height`) | swap width and height; separately, draw every piece from `CELEBRATION_PIECES[0]` |
| fades the whole celebration out once the pieces have fallen | layer: duration 800ms, delay 9200ms | drop the fade delay |
| colours the pieces with the theme's celebration colours in turn | rendered with `themeId: midnight-blue`: pieces 0, 1 and 6 are its gold, pink, gold | read `getThemeTokens()` (default theme) in `pieceLook` instead of its `theme`; separately, cycle by `% 5` |
| sits over the header and under the drawer | computed `z-index` above `LAYERS.overlayForeground`, below `LAYERS.modal` | set it to `LAYERS.modal` |

Not tested here, on purpose: reduced motion (a CSS `@media` rule jsdom does not
evaluate), the sway (jsdom does not resolve custom properties
in keyframes; checked by eye against the mockup), replay on remount and "not on
`router.refresh()`" (that is the caller's wiring, tested where it is mounted).

STOP for "commit tests", then commit:
`test(goal): the celebration's pieces, fade, layer and theme`.

## Size limits

Every file is far under 200 lines (`constants.ts` is the largest, ~90, because
of the 60 one-line pieces). The only function of note, `Celebration`, is ~15
lines. Nothing needs extracting; if `constants.ts` grows past comfort, the pieces
move to their own `celebration-pieces.ts` beside it.

## Showing it for review

No screen changes in this PR, so `pr-screenshots`' skip clause applies to the
committed diff ("touches nothing a user can see"); the wiring PR carries the real
screenshots. For the reviewer to see the motion anyway, the PR body gets a
**preview**, not part of the diff: mount `<Celebration />` in `Home` locally, `npx
next build`, shoot with a throwaway `e2e/shots/celebration.shot.mts` (seed
`mockAccount` + `mockTransactions`, wait ~3 s so pieces are mid-fall), then
restore `Home` from a copy and `cmp` it. Attached as "preview: not mounted in
this PR". Mockup frames 4b and 2b remain the reference for motion.

## Decisions (approved 2026-10-04)

1. **No props**, as the spec says.
2. **`LAYERS.celebration: 65`**: over the header, under the drawer, as in mockup 4b.
3. **Colours**: sunshine-quest takes the mockup's six; jungle-quest and
   midnight-blue take the proposed palettes above, tuned by eye in the wiring
   PR. They differ from sunshine-quest so the theme test can fail.
4. **No preview image** in this PR; the "Showing it for review" preview is dropped.
   The PR body says nothing on screen changes yet.
5. **Mounting** on home and in `ViewGoal` goes in a later PR.
6. Reduced motion is CSS on `Falling`, using `REDUCED_MOTION` from
   `src/theme/motion.ts`; no hook (changed on review, 2026-10-04).
