# Theme System — Design Spec

**Date:** 2026-06-27
**Branch:** `feat/theme-system`
**Status:** Approved design, pending implementation plan

## Summary

Make the app multi-theme and visually cohesive. Today there is one theme (`sunshine-quest`,
warm/pink — reads "girly") whose values are partly shared globally and partly hardcoded
inside individual components. We will:

1. Consolidate typography to a small, role-named **type scale** (5 sizes, 4 weights).
2. Define a single **semantic color-role set** that every theme fills.
3. Make every theme own its **complete token set** and remove the hardcoded color leaks,
   so changing the selected theme re-skins the entire app in one flip.
4. Add two new themes: **`jungle-quest`** (boy-kid) and **`midnight-blue`** (adult, dark).
5. Add **runtime theme switching** with a **global, cookie-persisted** selection (SSR-correct).
6. Wire the existing (currently inert) `AppearanceSection` swatches to the real registry.

Scope is colors **and** typography. Shape, illustrations, copy tone, and per-account
theming are explicitly deferred (see Non-goals / Stretch).

## Current state

- `src/theme/theme-tokens.ts` — `ThemeTokens` = `{ colors, gradients, typography }`; augments
  Emotion's `Theme`. `ThemeColors` has ~11 fields; `ThemeGradients` has `screen`, `actionButton`,
  `sunnyTile`.
- `src/theme/registry.ts` — `THEMES` map (only `sunshine-quest`), `getThemeTokens(id)`,
  `DEFAULT_THEME_ID`. Throws on unknown id.
- `src/theme/themes/sunshine-quest.ts` — re-exports shared `palette.ts` / `gradients.ts` /
  `typography.ts`; the per-theme indirection exists in name only.
- `src/app/providers.tsx` — wraps the tree in Emotion `ThemeProvider theme={getThemeTokens()}`.
  **Hardcoded to the default; no state, no switching, no persistence.**
- `src/components/Menu/AppearanceSection/` — renders 3 swatches but they are **inert**, and the
  ids (`mint-ledger`, `sunny-modern`) **do not match** the registry.
- **Color leaks** (hardcoded theme colors bypassing tokens), confirmed in:
  - `Account/WalletCard/constants.ts` — pot gradients (savings/spending/goodDeeds), pill bg/border
  - `Account/CoinRow/constants.ts` — soft tile bg/border/label
  - `Account/WalletHero/constants.ts` — divider, deposits bg, gain bg/text
  - `Account/WalletHero/Star/constants.ts` — star fill/stroke
  - `Account/TransactionDrawer/constants.ts` — sheet bg, split bg/border/text, deposit green
  (The silver coin gradient is genuinely theme-independent and stays a plain constant.)
- **Type drift**: the home screen uses ~10 distinct font sizes (54/36/22/18/15/14/13/12/11/10)
  where 13/14/15 and 10/11/12 are visually interchangeable.

## Goals

- A single source of truth for type sizes and colors; the same tokens used everywhere.
- Flipping `ThemeId` changes **every** on-screen color with no leaks left behind.
- Two additional, distinct themes shipped and selectable from the menu.
- Selection persists across visits and renders correctly on first paint (no flash/mismatch).

## Non-goals (this phase)

- Per-theme typography family, corner-radii, shadows, or shape language (stretch).
- Per-theme illustrations, mascots, or copy tone (stretch).
- Per-account / per-profile theme selection (stretch). Selection is global for now.

## Design

### 1. Type scale (consolidated)

Replace the current `TYPE_SCALE` with 5 role-named sizes and 4 weights. Each role has one job.

| Role      | px | weight | Used for                                                        |
|-----------|----|--------|-----------------------------------------------------------------|
| `display` | 48 | 800    | hero balance                                                    |
| `title`   | 22 | 700    | secondary amounts, section titles                               |
| `heading` | 18 | 700    | account / card name, screen title                               |
| `body`    | 15 | 600    | CTA, pill balances, quest names, default                        |
| `label`   | 12 | 600    | metadata, field labels, eyebrows, tiny uppercase labels, captions |

There is no separate `caption` size — the smallest role is `label` (12). Uppercase styling
(eyebrows) is a `text-transform` concern, not a size, so it also uses `label`.

Weights: `500` regular body, `600` medium/labels, `700` headings, `800` display only.

`ThemeTypography` becomes a structured token (size + weight per role) rather than a flat
size map, e.g. `{ display: { size: 48, weight: 800 }, ... }`. Typography is shared across
all three themes in this phase (only colors differ per theme); it lives in `typography.ts`
and each theme references it. Per-theme typography is a stretch concern.

### 2. Color roles (semantic)

Every theme fills the same role set. `ThemeColors` / `ThemeGradients` expand to cover the
roles currently leaking. Proposed roles:

- **Surfaces & text:** `screenGradient` (3 stops), `surface`, `textStrong`, `textMuted`
- **Brand:** `primary` (+ `primaryGradientTop`, `primaryShadow`, `primaryGlow`, `textOnPrimary`),
  `accent`, `accentSoft`
- **Pots:** `potSavings`, `potSpending`, `potGood` (each a 2-stop gradient pair)
- **Status:** `positive` / `gain` (+ `gainSoftBg`), `divider`
- **Decorative:** `star`
- **Soft info chip:** `softBg`, `softBorder`, `softText`

`palette.ts` / `gradients.ts` are absorbed into `sunshine-quest.ts` (or kept as its private
building blocks). No more shared global palette — each theme file is self-contained.

### 3. The two new themes

Full `ThemeTokens` objects in `src/theme/themes/`. Values approved in the visual companion.

**`jungle-quest`** (boy-kid):
- screen `#2A9D8F → #43AA8B → #90BE6D`, surface `#FFFDF5`, textStrong `#1B4332`, textMuted `#5C7A6E`
- primary `#2A9D8F` (top `#3AB3A3`, shadow `#1B6B61`), accent `#E76F51`, star `#F9C74F`
- pots: savings `#52B69A→#2A9D8F`, spending `#B5D94C→#90BE6D`, good `#F4A261→#E76F51`
- soft `#F3F7E4` / border `#B5D94C` / text `#4A6A1E`; gain `#3A7D2E` on `#E4F2D9`; divider `#DDE7CC`

**`midnight-blue`** (adult, dark — the app's first dark theme):
- screen `#0A0E14 → #0F1620 → #122036`, surface `#141B24`, textStrong `#ECF1F8`, textMuted `#8A96A8`
- primary `#3B82F6` (top `#60A5FA`, shadow `#1E40AF`), accent `#3B82F6`, star `#93C5FD`
- pots: savings `#1E40AF→#172554`, spending `#2563EB→#1E40AF`, good `#4338CA→#312E81`
- soft `#121E36` / border `#3B82F6` / text `#93C5FD`; gain stays green `#34D399` on `#0E2E2A`; divider `#1E2A40`

Dark mode is still "colors only": `surface` is dark and text inverts via the existing tokens.
No structural change is required — proof that the token set is sufficient.

### 4. Runtime switching + cookie persistence

- New **`ThemeController`** (client component) holds the selected `ThemeId` in React state and
  exposes it via context: `useThemeId()` and `setThemeId(id)`. It wraps Emotion's `ThemeProvider`
  with `getThemeTokens(currentId)`, so `setThemeId` re-skins the whole tree.
- **Cookie for SSR correctness:** the root layout / `providers.tsx` (server side) reads an
  `fs-theme` cookie and passes the initial id down. The server renders the correct theme on first
  paint — no flash, no hydration mismatch.
- `setThemeId` writes the `fs-theme` cookie (~1 year) so selection sticks across visits.
- Missing/invalid cookie falls back to `DEFAULT_THEME_ID` (`sunshine-quest`). The controller
  validates against the registry and falls back safely rather than letting `getThemeTokens` throw.

### 5. Wire the switcher

`AppearanceSection`:
- Rebuild its `constants.ts` to the three real registry ids (`sunshine-quest`, `jungle-quest`,
  `midnight-blue`) with representative swatch gradients and labels.
- Swatch `onClick` → `setThemeId(id)`. `data-selected` derived from `useThemeId()`.
  The inert button becomes the live control.

### 6. Migrate the leaks

Move every hardcoded theme color from the component `constants.ts` files listed above into the
corresponding theme tokens, and have the components read from `props.theme` / `useTheme()`.
This is the bulk of the mechanical work and is what makes the flip total. Genuinely
theme-independent values (silver coin gradient) remain plain constants.

## Sequencing

Independent, reviewable steps:

1. **Foundation** — expand `ThemeTokens` (color roles + structured `ThemeTypography`); fill
   `sunshine-quest` with the full set (absorb `palette.ts`/`gradients.ts`). No behavior change.
2. **Migrate leaks + apply type scale** — repoint the leaking components and all text sizes to
   tokens. App still renders `sunshine-quest`, now fully tokenized and cohesive.
3. **New themes** — add `jungle-quest` and `midnight-blue` to the registry.
4. **Switching + persistence** — `ThemeController`, context, cookie read/write; refactor
   `providers.tsx`.
5. **Wire switcher** — `AppearanceSection` → real ids + live selection.
6. **Tests** throughout (see below).

## Testing

- `registry.test.ts` — all three ids resolve to valid, complete token sets; unknown id throws.
- `ThemeController` — reads initial id from cookie; `setThemeId` updates context and writes the
  cookie; invalid cookie falls back to default.
- `AppearanceSection.test.tsx` — clicking a swatch calls `setThemeId` and reflects selection via
  `data-selected`.
- A guard (unit or visual `e2e`) confirming no hardcoded theme colors remain in the migrated
  components.

## Assumptions

- Typography is shared across themes this phase; only colors vary per theme.
- Global theme selection (not per-account); cookie name `fs-theme`.
- `sunshine-quest` remains `DEFAULT_THEME_ID`.
- Final pixel sizes/colors will be fine-tuned against the real local app; the mockups approximate.

## Stretch (later phases)

- Per-theme typography / shape / radii / shadows.
- Per-theme illustrations, mascots, copy tone (e.g. jungle mascot; sober adult labels).
- Per-account / per-profile theme selection (theme tied to the selected account, stored in DB).
