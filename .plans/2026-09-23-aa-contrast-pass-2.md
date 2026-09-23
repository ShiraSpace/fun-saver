# The AA contrast pass, second set

What the first pass missed. `.plans/2026-09-23-aa-contrast-pass.md` fixed six
text-on-colour pairs and shipped as #98; review of that PR found its audit was
not complete. Four more pairs fail, one decision from the first pass does not
hold where it was applied, and one fade survives.

- Every ratio below was measured on the literal token values, sRGB relative
  luminance, WCAG 2.x, gradients on their **worst stop**.
- **No mockup yet.** The first pass drew one, had it approved, and only then
  wrote code. Nothing here is approved; the candidate values are arithmetic,
  not design.

## Where it stands (2026-09-23)

Nothing implemented. #98 is open with the first six surfaces done.

## What fails

| surface | where | sunshine | jungle | midnight |
| --- | --- | --- | --- | --- |
| white on the screen gradient | `SignIn` — `Tagline` 15px, `Fineprint` 12px, `Wordmark` 34px | **1.60** | n/a | n/a |
| `alert` as text | `WithdrawMessage` on `alertSoftBg` | **3.43** | **3.43** | 5.84 |
| `alert` as text | `SignIn.ErrorMessage`, `ModeToggle`, `AppearanceSection` on surface | **3.91** | **3.84** | 6.26 |
| `accent` as text | `DrawerError`, every drawer submit failure | **3.55** | **3.04** | 4.71 |
| `gainText` on `gainSoftBg` | `StatStrip`, once its fade goes | **4.46** | **4.33** | 7.57 |
| `textMuted` on `accountScopeBg` | `EditAccountButton` inside `GlobalBlock` | **4.32** | **4.19** | passes |

`SignIn` renders `DEFAULT_THEME_ID` whatever the account's theme is, so its
column is sunshine only.

## What has to be decided, not calculated

1. **A scrim behind a paragraph, not a label.** `labelScrim` exists and works:
   white over `rgba(0,0,0,.45)` on sunshine's worst stop measures **4.94**. But
   בית and the form scrim a two-word chip; `Tagline` is a sentence and
   `Fineprint` is two lines. A chip behind a paragraph is a different object and
   wants drawing before it is written.

2. **Which family `DrawerError` belongs to.** It is `accent` today — the pink
   that also paints `WalletCard`'s good-deeds pot. It is an error message, so it
   probably wants the `alert` family rather than a darker `accent`; that is a
   design call, and it decides whether this pass adds one token or two.

3. **`Fineprint` carries `opacity: 0.88`.** Same pattern decision 3 of the first
   pass removed from `WalletList`, same reason to remove it — a second,
   invisible colour decision on top of the token's.

## Candidates, measured but not approved

| token | sunshine | jungle | worst ground |
| --- | --- | --- | --- |
| `alertText` **new** | `#B42318` · 5.76 | `#B42318` · 5.76 | `alertSoftBg` |
| `gainText` | `#276E2C` · 5.45 | `#316A26` · 5.59 | `gainSoftBg` |
| `textMuted` | `#6F6189` · 4.93 | `#526E63` · 4.96 | `accountScopeBg` |

Midnight passes every row above on its own values and should not move —
the same shape as `primaryText` in the first pass, where the dark theme needed
the opposite direction from the light ones.

## The decision that did not hold

Decision 1 keeps `primary` because it paints "borders and rings, which need
3:1". True of `TalkBubble`'s outline on `surface` and `WalletTile`'s selected
state. **Not** true of `AvatarPicker`'s ring: it is a `box-shadow` landing on
the **screen gradient**, and jungle's `primary` `#2A9D8F` is that gradient's own
start colour — **1.00**. Nothing is unreadable, because the white
`selectedBorder` is what carries selection there, so this is decoration that
believes it is an indicator. Either give the ring its own value or drop the
claim; do not leave the justification as written.

## Also open

`primaryGradientTop` is dead weight on jungle and midnight. Their
`gradients.actionButton` is now a literal whose stops no longer equal
`primaryGradientTop`/`primary`, while `src/theme/gradients.ts` still derives
sunshine's from `COLORS`. Nothing reads it on those two themes, so it is stale
rather than wrong. `e2e/empty-state.visual.ts` only passes because it runs on
the default theme.

## Files

- `src/theme/theme-tokens.ts` · `palette.ts` · `themes/jungle-quest.ts` ·
  `midnight-blue.ts` — `alertText`, and the moved `gainText` / `textMuted`.
- `src/components/SignIn/SignIn.styles.ts` — the scrim on `Tagline`,
  `Fineprint`, `Wordmark`; the `opacity` goes.
- `src/components/Account/TransactionDrawer/WithdrawBody/WithdrawMessage/WithdrawMessage.styles.ts`
  · `ModeToggle/ModeToggle.styles.ts` · `drawer-parts.ts` —
  the `alert` and `accent` text.
- `src/components/Menu/AppearanceSection/AppearanceSection.styles.ts` — the same
  `alert`.
- `src/components/Account/WalletCard/StatStrip/StatStrip.styles.ts` ·
  `constants.ts` — `labelOpacity` goes.
- `src/components/AvatarPicker/AvatarPicker.styles.ts` — only if the ring gets
  its own value.

## Notes / risks

- **`registry.test.ts` now pins values, not just shapes.** The contrast-token
  table and the button-trio table both fail the moment a listed token moves, by
  design — update them in the same commit as the palette.
- **`create-account.visual.ts` asserts `COLORS.textMuted`** through the
  constant, so it follows a move on its own. `menu-morph.visual.ts` asserts
  `textStrong` and `softBg`; neither is in this set.
- **Every screen changes again**, so the PR carries screenshots per
  `pr-screenshots`. The first pass's shot script covered בית, the drawer, the
  form, /method and התחברות; this set adds the overdraw state and the menu's
  `עריכת <name>` row.
- **Not in scope:** `TalkBubble`'s `text-decoration-color`, which is a strike
  through text and not text itself.
