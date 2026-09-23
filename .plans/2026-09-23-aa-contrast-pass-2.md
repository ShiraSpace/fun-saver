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
| `textMuted` | `#6F6189` · 4.93 | `#526E63` · 4.96 | unchanged |
| `primaryGradientTop` | stays in `palette.ts` | **key removed** | **key removed** |

Each ratio is the worst of **every** ground the token lands on, not the one
ground the failure table named — `divider` is the floor for `alertText` and
`gainText`, `accountScopeBg` for `textMuted`. Midnight moves nothing, the same
shape `primaryText` took in the first pass.

## The decisions

1. **No scrim, and no fix.** A chip behind a paragraph was drawn three ways —
   pills, plates, and the copy moved onto the card — and turned down as ugly.
   So was flipping the ink: `textOnPot` clears every stop of every screen
   gradient (**4.77** sunshine, **5.12** jungle, **14.39** midnight), which
   quietly corrects the first pass's claim that *nothing* clears 4.5 from either
   direction — that was measured against `textStrong` alone. So were all three
   ways of moving the ground under white: a 50% dim (**4.83**), a vignette dark
   at the ends and bright behind the card (**5.60**), and a deeper login
   gradient (**5.23**). White stays at **1.60**, and `AccountForm.SaveError`
   with it. **This is an accepted exception, not an oversight** — recorded here
   so the next audit does not rediscover it as a miss. The new red is no escape
   either: `#A81B3A` on that gradient is **2.05** and `#A83A21` is **1.92**,
   both worse than the white.

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

4. **The avatar ring got its own value.** It is `textOnPot` — 4.77 / 5.12 /
   14.39 against a 3:1 bar, no fourth token. `primary` there was a `box-shadow`
   landing on the screen gradient, and on jungle `#2A9D8F` **is** that
   gradient's start colour: **1.00**. Decoration that believed it was an
   indicator.

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
- **Not in scope:** `TalkBubble`'s `text-decoration-color`, which is a strike
  through text and not text itself. And `colors.accent`, which this pass leaves
  with **zero consumers** — dead the way `primaryGradientTop` was, but a brand
  colour rather than a derived one, so it stays for now.
