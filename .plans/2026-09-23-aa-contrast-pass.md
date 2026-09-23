# The AA contrast pass

Raise every text-on-colour surface in the app to WCAG AA (4.5:1 at the sizes we
use). Decisions 7 and 10 of `.plans/2026-09-15-method-page.md` promised this
once, for two surfaces; auditing every pair found four more.

- Mockup: `mockups/method-contrast.html` — three switchers (theme · היום/אחרי ·
  רקע לכיתוב · זוהר), all six affected screens at once. **Approved as drawn.**
- Ratios below were measured, not remembered. Every gradient is scored on its
  **worst stop**, not its average.

## Where it stands (2026-09-23)

Nothing implemented. The colours are decided and drawn; this plan is the
handoff for the session that writes them.

## What fails today

| surface | where | sunshine | jungle | midnight |
| --- | --- | --- | --- | --- |
| white on `actionButton` | **every button in the app** | 6.37 | **2.57** | **2.54** |
| `textStrong` on a pot | `WalletTrio`, /method only | **3.88** | **3.33** | 4.55 |
| white on the screen gradient | «הקופות» on בית, the account-form title | **1.53** | **2.04** | 13.94 |
| `primary` as text | `TalkBubble` label, `SourceList` citations | 8.84 | **3.26** | 4.71 |
| `textMuted` on surface | every muted paragraph | **3.87** | 4.62 | 5.78 |

`actionButton` is the one that reaches everything: `ActionButton` is the login
button, the empty-state CTA, the home action, the deposit confirm and the form's
save button, and `MethodIntro` and the `MethodSection` numerals paint with it
directly.

## What ships

| token | sunshine | jungle | midnight |
| --- | --- | --- | --- |
| `gradients.actionButton` | unchanged | `#1B7A6B → #12564B` · 5.19 | `#1D4ED8 → #1E3A8A` · 6.70 |
| `primaryShadow` | unchanged | `#0B3A33` | `#152A63` |
| `primaryGlow` | unchanged | `rgba(27,122,107,.45)` | `rgba(29,78,216,.40)` |
| `textOnPot` **new** | `#2B1235` · 4.77 | `#2B1800` · 5.12 | `#ECF1F8` (= `textStrong`) |
| `primaryText` **new** | `#6B2C8E` (= `primary`) | `#1B7A6B` · 5.10 | `#3B82F6` (= `primary`) |
| `labelScrim` **new** | `rgba(0,0,0,.45)` · 4.94 | `rgba(0,0,0,.35)` · 4.72 | `transparent` |
| `textMuted` | `#786A92` · 4.91 | unchanged | unchanged |

## Decisions

1. **`primaryText` is a separate token, not a darkened `primary`.** Jungle's fix
   is the new button teal, but the same move breaks midnight: `#1D4ED8` as text
   on the dark surface measures **2.59**, worse than the `#3B82F6` it has today.
   Dark-theme text gets lighter, not darker. `primary` also stays as it is for
   borders and rings — `TalkBubble`'s outline, `WalletTile`'s selected state,
   `AvatarPicker`'s ring — which are UI components needing 3:1, not 4.5:1.

2. **`primaryShadow` moves with the button, or the button breaks.**
   `ActionButton` draws `0 5px 0 primaryShadow` as a solid ledge. Darkening the
   button puts the old shadow *above* it in luminance — jungle L=11.6% under a
   L=7.3% button, midnight L=7.0% under L=5.1% — so it reads as glowing from
   underneath rather than sitting on a step. The new values restore the ~50%
   drop the other themes have.

3. **`WalletList`'s `labelOpacity: 0.92` goes.** It is decorative, invisible at
   that value, and costs exactly enough contrast to drop the scrimmed label from
   4.94 to 4.46. Removing it is what lets the lighter scrim pass.

4. **The screen-gradient label needs a scrim, because no colour can fix it.**
   Sunshine runs yellow→pink and jungle teal→lime, both mid-luminance: white
   reaches 1.53/2.04 and `textStrong` only 3.88/3.33. Nothing clears 4.5 from
   either direction. Midnight already passes at 13.94 and gets `transparent`, so
   the chip shows on two themes and not the third — **drawn that way on
   purpose**, not an oversight to tidy.

5. **`textOnPot` touches one component.** On בית and מגירת הפקדה the pot
   gradient is a 34px tile carrying **an emoji only** — `Illust` in `WalletCard`,
   `IconTile` in `WalletTile` — with the name and amount beside it on `surface`.
   The only place text sits on a pot gradient is `WalletTrio` on /method.

6. **`primaryGlow` follows the button.** Derived from the old bright `primary`,
   it halos teal around a much darker jungle button — the button and its light
   stop reading as one object. Not a contrast defect; a look decision, taken
   against the mockup.

## Files

- `src/theme/theme-tokens.ts` — `textOnPot`, `primaryText`, `labelScrim` on
  `ThemeColors`.
- `src/theme/palette.ts` — the three new keys, and `textMuted`.
- `src/theme/themes/jungle-quest.ts` · `midnight-blue.ts` — the new keys,
  `primaryShadow`, `primaryGlow`, `gradients.actionButton`.
- `src/components/Method/WalletTrio/WalletTrio.styles.ts` — `textOnPot`.
- `src/components/Method/TalkBubble/TalkBubble.styles.ts` — label to
  `primaryText`; **the border stays `primary`**.
- `src/components/Method/SourceList/SourceList.styles.ts` — citation to
  `primaryText`.
- `src/components/Account/WalletList/WalletList.styles.ts` — drop the opacity,
  add the scrim behind the label.
- `src/components/AccountForm/AccountForm.styles.ts` — the same scrim.
- `src/components/Account/WalletList/constants.ts` — `labelOpacity` goes.

## Notes / risks

- **`registry.test.ts` asserts token completeness**, so every theme must define
  all three new keys or it fails.
- **The visual suites read `COLORS`**, so a token that moves moves them too.
  `menu-morph.visual.ts` asserts `textStrong` and `softBg`; neither changes.
  `textMuted` does, on sunshine — check before assuming.
- **Every screen is touched**, so this wants screenshots of login, בית, the
  drawer, the form and /method, per `pr-screenshots`.
- **Not in scope:** the emoji on the pot tiles. WCAG scores text, and the wallet
  name sits beside the tile on `surface`, already passing.

## What the review found (2026-09-23, PR #98)

The pass shipped as specified. Review re-measured it and found the **sweep was
not complete**: the table under «What fails today» reads as every failing pair
in the app, and it is not. Three more fail, all outside the six:

| surface | where | sunshine | jungle | midnight |
| --- | --- | --- | --- | --- |
| white on the screen gradient | `SignIn` — `Tagline`, `Fineprint`, `Wordmark` | **1.60** | n/a | n/a |
| `alert` on `alertSoftBg` | `WithdrawMessage`, the overdraw chip | **3.43** | **3.43** | 5.84 |
| `accent` on surface | `DrawerError`, every drawer submit failure | **3.55** | **3.04** | 4.71 |

`SignIn` is the sharper miss: התחברות renders sunshine only, and its tagline is
`textOnPrimary` on the screen gradient — the same pair the plan fixes with
`labelScrim` on בית and the account form, on a third screen nobody listed.

Two of the pass's own numbers also need correcting:

- **`textMuted` was scored against `surface` alone.** `#786A92` reaches 4.91
  there and 4.62 on `softBg`, but `EditAccountButton` puts it on
  `accountScopeBg`, where it lands at **4.32**. Jungle's untouched `#5C7A6E` is
  **4.19** on the same tint and **4.31** on `softBg`.
- **The screen-gradient row reads 1.53/2.04; the mockup's own prose says
  1.60/2.15.** 1.60 and 2.15 are correct — white on `#FFC34D` and on `#90BE6D`.
  The scrim decision is unaffected; both are far under 4.5.

And one caveat to decision 1. `primary` stays for "borders and rings, which need
3:1" — true of `TalkBubble`'s outline on `surface`, not of `AvatarPicker`'s ring,
which is a `box-shadow` landing on the **screen gradient**. Jungle's `#2A9D8F` is
that gradient's own start colour: **1.00**. The white `selectedBorder` is what
carries selection there, so nothing is unreadable — but the ring is decoration on
jungle, not a 3:1 indicator.

`StatStrip`'s gain label still carries `labelOpacity: 0.85` — the pattern
decision 3 removes from `WalletList`. Composited, 4.46 becomes **3.44** on
sunshine and 4.33 becomes **3.33** on jungle.

**Not scoped here.** Every item above is a separate pass; this plan's six
surfaces are done and merged as drawn.
