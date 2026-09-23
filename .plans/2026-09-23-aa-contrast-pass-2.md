# The AA contrast pass, second set

What the first pass missed. `.plans/2026-09-23-aa-contrast-pass.md` fixed six
text-on-colour pairs and shipped as #98; review of that PR found its audit was
not complete. Four more pairs failed, one decision from the first pass did not
hold where it was applied, and one fade survived.

- Every ratio below was measured on the literal token values, sRGB relative
  luminance, WCAG 2.x, gradients on their **worst stop**.
- **No mockup was drawn before the decisions.** `mockups/contrast-pass-2.html`
  was drawn during them, to settle the three calls that were design rather than
  arithmetic, and it records the options that were turned down.

## Where it stands (2026-09-23)

Shipped on `feat/aa-contrast-pass-2`. Tokens and consumers in one commit, tests
in a second, one test per consumer, each watched failing against its own break.

## What failed

| surface | where | sunshine | jungle | midnight |
| --- | --- | --- | --- | --- |
| white on the screen gradient | `SignIn` — `Tagline` 15px, `Fineprint` 12px, `Wordmark` 34px | **1.60** | n/a | n/a |
| white on the screen gradient | `AccountForm.SaveError`, **found during this pass** | **1.60** | **2.15** | passes |
| `alert` as text | `WithdrawMessage` on `alertSoftBg` | **3.43** | **3.43** | 5.84 |
| `alert` as text | `SignIn.ErrorMessage`, `AppearanceSection` on surface | **3.91** | **3.84** | 6.26 |
| `alert` as text | `ModeToggle`'s arrow on `divider`, **not surface** | **2.91** | **3.05** | 5.20 |
| `gainText` as text | `ModeToggle`'s arrow on `divider`, **not listed before** | **3.82** | **3.94** | 7.48 |
| `textMuted` on `divider` | `ModeToggle`'s inactive pill, **found in review** | **3.66** | **3.67** | 4.80 |
| `accent` as text | `DrawerError`, every drawer submit failure | **3.55** | **3.04** | 4.71 |
| `gainText` on `gainSoftBg` | `StatStrip`, once its fade goes | **4.46** | **4.33** | 7.57 |
| `textMuted` on `accountScopeBg` | `EditAccountButton` inside `GlobalBlock` | **4.32** | **4.19** | passes |

`SignIn` renders `DEFAULT_THEME_ID` whatever the account's theme is, so its
column is sunshine only.

## What shipped

| token | sunshine | jungle | midnight |
| --- | --- | --- | --- |
| `alertText` **new** | `#A81B3A` · 5.42 | `#A83A21` · 4.97 | `#F87171` (= `alert`) · 5.20 |
| `gainText` | `#276E2C` · 4.66 | `#316A26` · 5.09 | unchanged |
| `textMuted` | `#675A80` · 4.66 | `#4B655B` · 4.95 | unchanged |
| `selectionRing` **new** | `#2B1235` | `#2B1800` | `#3B82F6` (= `primary`) |
| `primaryGradientTop` | stays in `palette.ts` | **key removed** | **key removed** |

Each ratio is the worst of **every** ground the token lands on. `divider` is
that floor for all three of `alertText`, `gainText` and `textMuted` — it is the
darkest tint on both light themes, so clearing it clears `accountScopeBg`,
`softBg`, `depositBg` and `surface` behind it. `textMuted` was first moved to
`#6F6189`/`#526E63` against `accountScopeBg` and **that was not the floor**:
review caught it still failing the toggle track at 4.17/4.34. Midnight moves
nothing, the same shape `primaryText` took in the first pass.

`selectionRing` is measured against **both** layers it sits between — the screen
gradient outside it and the white `selectedBorder` inside it: 4.77/16.93,
5.12/17.03, 4.44/3.68, against a 3:1 bar.

## The decisions

1. **No scrim, and no fix.** A chip behind a paragraph was drawn three ways —
   pills, plates, and the copy moved onto the card — and turned down as ugly.
   So was flipping the ink: `textOnPot` clears every stop of every screen
   gradient (**4.77** sunshine, **5.12** jungle, **14.39** midnight), which
   quietly corrects the first pass's claim that *nothing* clears 4.5 from either
   direction — that was measured against `textStrong` alone. So were all three
   ways of moving the ground under white: a 50% dim (**4.83**), a vignette dark
   at the ends and bright behind the card (**5.60**), and a deeper login
   gradient (**5.23**). White stays at **1.60**. The new red is no escape
   either: `#A81B3A` on that gradient is **2.05** and `#A83A21` is **1.92**,
   both worse than the white.

   **The exception widened rather than narrowed.** `AccountForm.SaveError` was
   drawn both ways — bare and wearing the `Title`'s chip at **4.94** — and the
   bare one was chosen. Then the **`Title`'s own chip was removed too**, on
   create and edit alike, which **undoes what #98 shipped for that surface**:
   decision 4 of the first pass put `labelScrim` there precisely because white
   cannot carry on the gradient. At 22px/700 that title is *large text*, so its
   bar is 3:1 rather than 4.5 — and sunshine still misses it at **1.60**, while
   jungle clears it at 3.32. This is a look decision taken against the drawing,
   with the ratios on the table, and it is the one change in this pass that
   leaves a surface worse than `main`. `labelScrim` keeps one consumer,
   `WalletList`'s «הקופות» on בית.

   **`SaveError` did take the red**, after review pointed out that white left a
   failed save looking exactly like ordinary form copy — no colour signal at
   all, contrast aside. Scored on the **worst stop** the red is 2.05 sunshine
   and 1.92 jungle, but that convention misleads here: this element sits below
   the save button, at the gradient's **end**, and the red's best stop is the
   top it never occupies. Where the text actually is:

   | at the gradient's end | white | `alertText` |
   | --- | --- | --- |
   | sunshine `#E94E89` | 3.55 | **2.05** |
   | jungle `#90BE6D` | 2.15 | **2.97** |
   | midnight `#122036` | 16.33 | 5.91 |

   So it is not one trade but two: jungle gains legibility along with the
   signal, and **sunshine loses it**, 3.55 down to 2.05. Neither cleared 4.5
   either way. Taken deliberately, with the split understood.

2. **`DrawerError` joins the `alert` family, and the red fits each theme.** Not
   one flat red across all three: a crimson on sunshine pulled toward its
   `#E94E89`, a brick on jungle pulled toward its `#E76F51`. `accent` stops
   being a text colour anywhere — it was the pink that also paints the
   good-deeds pot, and in the withdraw drawer the overdraw chip and the submit
   failure occupy **one slot**, so the two arrived in two colours for the same
   kind of problem. `alert` survives with a single consumer, `TalkBubble`'s
   strike-through, which is out of scope.

3. **Both fades go**, for the reason the first pass removed `WalletList`'s: a
   second, invisible colour decision on top of the token's. `StatStrip`'s 0.85
   cost the gain label 4.46 → 3.44. `SignIn`'s `Fineprint` carried 0.88.

4. **The avatar ring got its own token, `selectionRing`.** `primary` there was
   a `box-shadow` landing on the screen gradient, and on jungle `#2A9D8F` **is**
   that gradient's start colour: **1.00**. Sunshine's `#6B2C8E` was no better at
   **2.49** — jungle was never the only theme failing. It first reused
   `textOnPot`, which broke midnight: `#ECF1F8` against a white `selectedBorder`
   is **1.13**, a white ring on a white border where `primary` had been 3.68.
   So the token goes the `primaryText` way — dark ink on the light themes,
   `primary` kept on the dark one.

5. **`primaryGradientTop` leaves `ThemeColors`.** Only sunshine's button
   gradient reads it, from `palette.ts`. `sunshineQuest` passes `colors: COLORS`
   as a variable, so the extra key is not excess-property-checked.

## Also measured, no action

`WithdrawBody`'s `AmountValue` is `withdrawText` at 38px bold — large text, so
its bar is 3:1, and it sits at 4.30 / 4.22. It passes and does not move.

## Notes / risks

- **The predicted test failure did not happen.** The note in this plan said both
  pinning tables in `registry.test.ts` fail the moment a listed token moves.
  They do not: the contrast table pinned `primaryText` / `textOnPot` /
  `labelScrim` and the button table the trio, and this pass moves none of them.
  `alertText` was **added** to the first table, and `gainText` / `textMuted`
  needed a table of their own — nothing held them before.
- **`create-account.visual.ts` asserts `COLORS.textMuted`** through the
  constant, so it follows a move on its own and would never redden. The new
  registry table is what catches a walk-back.
- **Every screen changes**, so the PR carries screenshots per `pr-screenshots`:
  the five the last PR shot, plus the overdraw state in מגירת הפקדה and the
  menu's `עריכת <name>` row.
- **The sweep was incomplete twice.** The first pass missed these surfaces; this
  pass then measured `textMuted` against `accountScopeBg` and called it done
  while `divider` was darker. Ranking every ground by luminance before choosing
  a value is the check that would have caught both — it is what finally settled
  `textMuted`, and `divider` is the floor on both light themes.
- **`e2e/avatar-picker.visual.ts` asserted the ring's old token.** It names no
  moved token, so grepping `e2e/` for the moved names missed it; the ring change
  is a *consumer* move and the suite pinned what the consumer used to read.
  A `box-shadow` also normalises to `rgb()` in the browser but keeps its hex in
  jsdom, so the e2e needs `hexToRgb` and the unit test must not have it.
- **`colors.accent` and `colors.accentSoft` are deleted.** Moving `DrawerError`
  off `accent` left it with zero consumers and `accentSoft` had none already.
- **`primaryGradientTop` stays half-removed on purpose** — out of `ThemeColors`
  and both themes, still in `COLORS` for `gradients.ts`. `COLORS` already
  carried one key the interface does not (`sunnyTileSoft`) before this branch,
  so the mismatch is pre-existing rather than introduced.
- **The opacity assertions say "not faded", not "unset".** `toBe('')` leaned on
  jsdom resolving an unset property to the empty string, so a jsdom that
  resolved it to `1` would have reddened them with no regression behind it, and
  an explicit `opacity: 1` failed them for nothing. `opacityOf` in
  `src/test-utils/css-color.ts` reads the number instead, across `StatStrip`,
  `SignIn` and `WalletList` so the repo keeps one idiom.
- **Not in scope:** `TalkBubble`'s `text-decoration-color`, which is a strike
  through text and not text itself.
