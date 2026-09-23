# Theme parity

Every colour the app draws is a theme variable, every theme declares the same
set, and adding a theme or a token is filling one shape the compiler checks.
Today three things break that: gradients are literal strings, nine colours live
in component styles owned by no theme, and the theme picker previews the themes
from hardcoded copies that have already drifted.

## Where it stands (2026-09-23)

Nothing implemented. Branch `refactor/theme-parity` off `2b35a57` (#104).

## What diverges

| # | | measured on main |
| --- | --- | --- |
| 1 | gradients are literal strings | **18** of them, 6 per theme |
| 2 | the angle is repeated in each | 3 distinct angles, written 18 times |
| 3 | stops live in two homes | `screenGradient*` in `ThemeColors`; `GRADIENT_STOPS` outside it |
| 4 | a stop and its gradient can disagree | jungle declares `screenGradientStart: '#2A9D8F'` **and** repeats it inside its `screen` literal |
| 5 | gradients duplicated within a theme | jungle's `sunnyTile` ≡ `potSavings`; midnight's too |
| 6 | a stop duplicated as a literal | `#FFE6B0` is `sunnyTileSoft` **and** sits inside sunshine's `potSavings` |
| 7 | colours no theme owns | **9** `rgba()` in component styles — 5 black shadows, 3 white films |
| 8 | the leak test cannot see them | `no-color-leaks` greps `/#[0-9A-Fa-f]{3,6}/` only |
| 8b | and it does not scan `*-parts.ts` | `drawer-parts` · `scope-parts` · `header-parts` are a sanctioned style home per CLAUDE.md, unswept |
| 9 | the picker previews copies | 3 literals in `AppearanceSection/constants.ts` |

On 9, the copies have already drifted. Sunshine and jungle drop their middle
stop and use `135deg` where the screen uses `160deg`; **midnight's swatch is
`#3B82F6`, a colour its screen gradient does not contain.**

| theme | swatch today | its actual screen |
| --- | --- | --- |
| sunshine | `135deg #FFC34D → #E94E89` | `160deg #FFC34D → #FF8A4C → #E94E89` |
| jungle | `135deg #2A9D8F → #90BE6D` | `160deg #2A9D8F → #43AA8B → #90BE6D` |
| midnight | `135deg #0F1620 → #3B82F6` | `160deg #0A0E14 → #0F1620 → #122036` |

## What ships

**`ThemeStops` joins the contract.** `screen` a 3-tuple, `actionButton`,
`sunnyTile`, `potSavings`, `potSpending`, `potGood` 2-tuples each. One
`buildGradients(stops)` owns the angles, so `160deg` and `135deg` are decided
once rather than eighteen times. Each theme declares stops; `gradients` is
derived. `screenGradientStart/Mid/End` leave `ThemeColors` — nothing renders
them — and `GRADIENT_STOPS` folds into sunshine's stops.

**A shadow and film scale, per theme.** The nine ad-hoc `rgba()` values
normalise onto five tokens every theme declares:

| token | replaces | today |
| --- | --- | --- |
| `shadowFaint` | `MethodSection` ledge | `rgba(0,0,0,.06)` |
| `shadowLedge` | `MethodIntro` ledge | `rgba(0,0,0,.12)` |
| `shadowLift` | `SignIn` card, wordmark text-shadow | `rgba(0,0,0,.16)` |
| `shadowDeep` | drawer, `HomeAvatarLink` | `rgba(0,0,0,.25)` and `.28` |
| `filmOnColour` | `CloseButton`, `MethodIntro` pill and rule | `rgba(255,255,255,.4)`, `.2`, `.25` |

Geometry stays in the component; only the colour becomes a token. Midnight is
then free to give a shadow a value that shows against its own surfaces, which
a black shadow at `.06` does not.

**The swatches derive.** `AppearanceSection` reads each theme's `screen` stops
instead of carrying copies.

**The leak test widens** on both axes: `rgba(` and `hsl(` alongside hex, and
`*-parts.ts` alongside `.styles.ts` and `constants.ts`. The three parts files
are clean today, so that half is a guard rather than a fix — but they are a
sanctioned place to put styles and nothing was watching them.

## Decisions

1. **The swatch is the screen gradient, not a preview token.** Drawn both ways
   in `mockups/theme-swatches.html`. Deriving makes midnight a near-black tile
   in the picker, which is the honest thing it previews; a `preview` pair per
   theme would have kept midnight recognisably blue at the cost of a token
   whose only job is to differ from the theme. Consistency wins.
2. **Shadows are per-theme, not shared.** Same keys everywhere, each theme free
   to pick what reads on its own surfaces.
3. **Five steps, not nine values.** `.25` and `.28` collapse to one token, and
   the three white films to one. This changes some shadows by a few percent, so
   the PR carries before/after screenshots of the surfaces that move.
4. **All four in one PR**, so the contract changes once.

## Files

- `src/theme/theme-tokens.ts` — `ThemeStops`; `screenGradient*` and the shadow
  scale on `ThemeColors`.
- `src/theme/gradients.ts` — `buildGradients`, owning the angles.
- `src/theme/palette.ts` · `themes/jungle-quest.ts` · `midnight-blue.ts` ·
  `sunshine-quest.ts` — stops and shadow values per theme.
- `src/components/Menu/AppearanceSection/AppearanceSection.tsx` ·
  `constants.ts` — the swatches derive.
- The nine consumers in **Notes** below.
- `src/theme/__tests__/no-color-leaks.test.ts` — `rgba(`/`hsl(`.
- `src/theme/__tests__/registry.test.ts` — the gradient pins move.

## Notes / risks

- **The nine consumers:** `AccountForm.styles.ts`, `SignIn.styles.ts` (×2),
  `TransactionDrawer.styles.ts`, `MethodIntro.styles.ts` (×3),
  `MethodSection.styles.ts`, `HomeAvatarLink.styles.ts`.
- **`registry.test.ts` pins whole gradient strings**, and the built ones
  normalise whitespace — sunshine writes `135deg,#FFE6B0,#FFC34D` today while
  jungle writes `135deg, #52B69A, #2A9D8F`. The pins move; the rendering does
  not, because the whitespace is insignificant to CSS. Worth diffing the built
  strings before and after rather than trusting that.
- **Parity is a compile error, not an assertion.** Every theme is an object
  literal typed `ThemeTokens`, so a missing stop or shadow fails `tsc`. Sunshine
  is held by `satisfies` since #104. No test needs to restate that.
- **Nothing should look different** except the shadows decision 3 collapses, so
  any other visual diff in the screenshots is a bug in this pass.
- **The sweep is bounded, and this time that is checked.** No colour literal
  lives in a `.tsx`, in `src/app/globals.css` (which sets only `overflow-x`),
  or as a named CSS colour anywhere. The nine `rgba()` plus the theme layer are
  the whole set. Both previous passes shipped on an incomplete sweep; the check
  that settles it is enumerating every ground and every literal before choosing
  values, not grepping for the names already known.
- **`typography` is already shared, not per-theme** — all three point at the
  same `TYPE_SCALE`. Nothing to do; noted so it is not mistaken for divergence.
- **Not in scope:** the Google logo fills, `GOOGLE_BRAND_WHITE`, and
  `src/lib/avatars.ts` backgrounds — brand and identity colours, not theme
  colours, and already exempt from the leak test.
