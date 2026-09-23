# Theme parity

Every colour the app draws is a theme variable, every theme declares the same
set, and adding a theme or a token is filling one shape the compiler checks.
Today three things break that: gradients are literal strings, colours live in
component styles owned by no theme, and the theme picker previews the themes
from hardcoded copies that have already drifted.

## Where it stands (2026-09-23)

Shipped as `e1592fd` on `refactor/theme-parity`, rebased onto `4066c45`. Tests
still to come.

Three things below are what the plan said before the work; the sections marked
**revised** are what it actually turned out to be. They are left in place rather
than rewritten, because the gap between them is the useful part.

## What diverges

| # | | measured on main |
| --- | --- | --- |
| 1 | gradients are literal strings | **18** of them, 6 per theme |
| 2 | the angle is repeated in each | 3 distinct angles, written 18 times |
| 3 | stops live in two homes | `screenGradient*` in `ThemeColors`; `GRADIENT_STOPS` outside it |
| 4 | a stop and its gradient can disagree | jungle declares `screenGradientStart: '#2A9D8F'` **and** repeats it inside its `screen` literal |
| 5 | gradients duplicated within a theme | jungle's `sunnyTile` ≡ `potSavings`; midnight's too |
| 6 | a stop duplicated as a literal | `#FFE6B0` is `sunnyTileSoft` **and** sits inside sunshine's `potSavings` |
| 7 | colours no theme owns | **9** `rgba()` in component styles — 5 black shadows, 3 white films — **revised: 17** |
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

### Revised: row 7 was an undercount

Nine was wrong. There are **17**, and the eight the plan missed sit in
`constants.ts` files — a home the leak test already scanned, for hex only:

| file | value | token |
| --- | --- | --- |
| `NameField` · `OverviewCard` · `WalletCard` · `Header` | `rgba(0,0,0,.06)` | `faint` |
| `AmountPad` (two consumers) | `rgba(0,0,0,.05)` | `faint` |
| `AvatarPicker` | `rgba(0,0,0,.12)` | `soft` |
| `AccountList` popover | `rgba(0,0,0,.22)` | `deep` |
| `TransactionDrawer` scrim | `rgba(40,20,60,.42)` | `modal` |

This was never a choice between nine and seventeen. Widening the leak test to
`rgba(` — item 8, in this same pass — fails on all eight, so the alternative was
eight exemptions in the test the pass exists to strengthen. Both previous
contrast passes shipped on a sweep that stopped at the names already known;
this is the third time, and the first time it was caught before merge.

## What ships

**`ThemeStops` joins the contract.** `screen` a 3-tuple, `actionButton`,
`sunnyTile`, `potSavings`, `potSpending`, `potGood` 2-tuples each. One
`buildGradients(stops)` owns the angles, so `160deg` and `135deg` are decided
once rather than eighteen times. Each theme declares stops; `gradients` is
derived. `screenGradientStart/Mid/End` leave `ThemeColors` — nothing renders
them — and `GRADIENT_STOPS` folds into sunshine's stops.

**A shadow and film scale.** The ad-hoc `rgba()` values normalise onto one
scale. *Revised:* six tokens, not five, and shared rather than per-theme —
see decisions 2 and 3.

| token | replaces | today |
| --- | --- | --- |
| `faint` | `MethodSection` · `NameField` · `OverviewCard` · `WalletCard` · `AmountPad` · `Header` | `rgba(0,0,0,.06)` and `.05` |
| `soft` | `MethodIntro` ledge, `AvatarPicker` | `rgba(0,0,0,.12)` |
| `mid` | `SignIn` card, wordmark text-shadow | `rgba(0,0,0,.16)` |
| `deep` | drawer, `HomeAvatarLink`, `AccountList` popover | `rgba(0,0,0,.25)`, `.28` and `.22` |
| `film` | `CloseButton`, `MethodIntro` pill and rule | `rgba(255,255,255,.4)`, `.2`, `.25` |
| `shade` | `TransactionDrawer` scrim | `rgba(40,20,60,.42)` |

The last two are not shadows — `film` is consumed as a `background` and a
`border-top` colour, `shade` dims a covered page — so they live in their own
`tints` group. `theme.shadows.*` is depth; `theme.tints.*` is a translucent
layer, light or dark.

Geometry stays in the component, written inline in the `.styles.ts` —
`box-shadow: 0 4px 0 ${faint}` — per the repo convention that spacing, radii and
shadows are literals there rather than a `*_STYLE` constants object.

They live in `src/theme/shadows.ts` as one `SHADOW_SCALE`, in their own group
on `ThemeTokens` rather than on `ThemeColors` — shared by identity the way
`TYPE_SCALE` already was, so `theme.shadows.faint`. `labelShade` stays in
`colors`, where it genuinely varies: `.45` · `.35` · `transparent`.

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
2. ~~**Shadows are per-theme, not shared.**~~ **Reversed.** Drawn three ways in
   `mockups/midnight-shadows.html` — today's values, a middle ladder, and the
   raised one the arithmetic argued for — midnight read best on the values every
   theme already used. The premise for per-theme shadows was that midnight would
   need its own; the theme with the strongest claim did not. One `SHADOW_SCALE`,
   shared. **The cost, stated plainly:** nothing structural now stops a future
   theme needing its own value, and it would have to pull `shadows` back out of
   the group to get one. That is the accepted trade, not an oversight.
3. **Six steps, not seventeen values.** `.25`/`.28`/`.22` collapse to `deep`,
   `.06`/`.05` to `faint`, and the three white films to `film`. This is the only
   thing in the pass that changes how anything looks — **five** surfaces move:
   AmountPad keys `.05→.06`, popover `.22→.25`, house badge `.28→.25`, close
   button film `.4→.25`, Method eyebrow `.2→.25`. The badge was missed on the
   first count, which would have had a reviewer chasing a correct change as a
   regression.
4. **All four in one PR**, so the contract changes once.

## Files

- `src/theme/theme-tokens.ts` — `ThemeStops`; `screenGradient*` off
  `ThemeColors`; `shadows` joins `ThemeTokens`.
- `src/theme/shadows.ts` — `SHADOW_SCALE`, new, shared by all three themes.
- `src/theme/gradients.ts` — `buildGradients`, owning the angles.
- `src/theme/palette.ts` · `themes/jungle-quest.ts` · `midnight-blue.ts` ·
  `sunshine-quest.ts` — stops per theme; each points at the shared scale.
- `src/components/Menu/AppearanceSection/AppearanceSection.tsx` ·
  `constants.ts` — the swatches derive.
- The seventeen consumers in **Notes** below.
- `src/theme/__tests__/no-color-leaks.test.ts` — `rgba(`/`hsl(`.
- `src/theme/__tests__/registry.test.ts` — the gradient pins move.

## Notes / risks

- **The seventeen consumers:** the nine first counted — `AccountForm.styles.ts`,
  `SignIn.styles.ts` (×2), `TransactionDrawer.styles.ts`,
  `MethodIntro.styles.ts` (×3), `MethodSection.styles.ts`,
  `HomeAvatarLink.styles.ts` — plus the eight in `constants.ts` tabled above.
- **`registry.test.ts` pins whole gradient strings**, and the built ones
  normalise whitespace — sunshine wrote `135deg,#FFE6B0,#FFC34D` while jungle
  wrote `135deg, #52B69A, #2A9D8F`. *Measured:* all 18 built strings are
  byte-identical to main, so no pin moved at all. Only sunshine's three pot
  gradients gained a space after each comma, and nothing pins those. Diffed,
  not assumed.
- **Parity is a compile error, not an assertion.** Every theme is an object
  literal typed `ThemeTokens`, so a missing stop or shadow fails `tsc`. Sunshine
  is held by `satisfies` since #104. No test needs to restate that.
- **Nothing should look different** except the five surfaces decision 3 names,
  so any other visual diff in the screenshots is a bug in this pass. Two values
  invented mid-pass — a teal scrim for jungle, raised alphas for midnight —
  were reverted for exactly this reason: they would have made the screenshots
  unreadable as evidence.
- **The sweep is bounded, and this time that is checked.** No colour literal
  lives in a `.tsx`, in `src/app/globals.css` (which sets only `overflow-x`),
  or as a named CSS colour anywhere. The **seventeen** `rgba()` plus the theme
  layer are the whole set — the count this plan shipped with was nine, and the
  other eight were found by widening the leak test, not by planning. Both
  previous passes shipped on an incomplete sweep; the check that settles it is
  enumerating every ground and every literal before choosing values, not
  grepping for the names already known.
- **`typography` is already shared, not per-theme** — all three point at the
  same `TYPE_SCALE`. Nothing to do; noted so it is not mistaken for divergence.
  `shadows` now joins it on that footing, by decision 2.
- **Not in scope:** the Google logo fills, `GOOGLE_BRAND_WHITE`, and
  `src/lib/avatars.ts` backgrounds — brand and identity colours, not theme
  colours, and already exempt from the leak test.

## What the tests pin

Five, each watched reddening alone against its own deliberate break, plus a
sixth break that adds no test: an `rgba()` planted back in `Header/constants.ts`
to watch `no-color-leaks` fail on the axis it gained here. It had passed since
the day it was widened, which is also what a broken test does.

| test | the break that reddens it |
| --- | --- |
| `buildGradients` runs the screen down one diagonal and every tile down another | `160deg` → `161deg` |
| every theme reads depth the same way | midnight given a `faint` of its own |
| previews midnight as the near-black it actually is | the swatch back to a literal |
| the drawer dims what it covers | `modal` → `film` |
| the header takes its ledge colour from the theme | `faint` → `soft` |

A first draft had ten, asserting each of the six tokens on the surface that
reads it. Five went: they mirrored the styles file line for line, so they failed
when the code changed and passed when it did not, and they re-proved what the
leak test already makes impossible. The two component tests left guard
**absence**, not choice — drop the scrim token and the dim goes transparent with
no literal for the leak test to catch; drop the colour half of the header ledge
and `0 4px 0` is still valid CSS, painting in `currentColor`. Which step a
surface picks is the visual suite's business.

## Closed on review

Four comments on #110, three of which held.

**The leak test could not see a `.tsx`.** Five component files keep styled CSS
in their `.tsx` — `ActionButton`, `Pig`, `Screen`, `Column`, `MenuHeaderSheet` —
which CLAUDE.md sanctions for a component that *is* a styled component. A hex
dropped into any of them stayed green. `STYLE_HOMES` now covers `.tsx`, with
`GoogleLogo.tsx` joining the brand exemption, and the guard has been watched
failing on a planted literal. This one mattered beyond its size: the five
per-component tests were cut on the premise that a colour literal in a style
home is impossible, and for those five files it was not.

**Both idioms closed.** Sunshine declares a module-private `STOPS` in its own
theme file like the other two, so `palette.ts` holds only `COLORS`. The shadow
geometry moved inline in all eight consumers the sweep found, so seventeen
consumers now share one idiom and the older `*_STYLE` pattern stops spreading.

The fourth comment — that the PR body still said four moving surfaces — was
already stale: the body had been rewritten with the screenshots.

## Known gap

Nothing pins a theme's actual stop values. Changing sunshine's `#E94E89` to
`#E94E88` reddens nothing: the `buildGradients` test uses synthetic stops, and
the swatch test and visual suites both assert *through* `getThemeTokens`, so
they move with the change. True before this branch too — `screenGradient*` was
never pinned — and a pin would be the change-detector kind of test this pass
deliberately cut five of. Recorded as a decision, not an oversight.

## What the work turned up

1. **The sweep was still short, a third time.** The plan counted the `rgba()`
   it already had names for. Eight more sat in `constants.ts`, and only
   widening the leak test surfaced them. Enumerating the *homes* before the
   *values* is what would have caught it — the leak test's own file list was
   the enumeration, and it went unread.
2. **A decision drawn beats a decision derived.** Per-theme shadows survived
   planning on an arithmetic argument about midnight's near-black surfaces.
   Rendered at real size the argument lost, and the token group collapsed from
   three copies to one.
3. **Ten tests where five would do.** One assertion per token read as thorough
   and was three shapes wearing seven names. The question that sorted them: does
   this catch a value being *wrong*, or only being *changed*? Only the two that
   catch a token going missing entirely survived.
4. **A plan on `main` outlives the session that wrote it.** Three of its claims
   were false within a day — the count, decision 2, and five token names. A
   reviewer read the stale plan and filed the code as the defect. The plan is
   the artifact that drifts; correcting it is part of the work, not after it.
