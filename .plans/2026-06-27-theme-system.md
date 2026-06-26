# Theme System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the app multi-theme and visually cohesive — one complete token set per theme, a 5-size type scale, two new themes, and a cookie-persisted runtime switcher.

**Architecture:** Every theme owns a full `ThemeTokens` object (colors + gradients + typography). Components read all theme colors via Emotion `useTheme()` / `props.theme` — no hardcoded theme hex. A `ThemeController` holds the selected `ThemeId` in React context and feeds Emotion's `ThemeProvider`; selection is stored in an `fs-theme` cookie read server-side for SSR-correct first paint.

**Tech Stack:** Next.js 16 App Router, React, TypeScript (strict), Emotion (`@emotion/react`, `@emotion/styled`), Jest + React Testing Library.

## Global Constraints

- Single quotes; named exports only; explicit return type on every function.
- No comments — code self-documents.
- Files ≤ 200 lines; hardcoded values live in a `constants.ts`.
- File naming: logic/test files kebab-case; React components + co-located tests PascalCase.
- Tests: `data-testid` selection, IDs/strings in `constants.ts`, `render()` in `beforeEach`, query via `getByTestId`. Centralized mocks in `__mocks__/`.
- Run tests with real output via: `rtk proxy npx jest <args> --json --outputFile=/tmp/jest.json` then read the JSON (RTK mangles raw jest output).
- Cookie name: `fs-theme`. `DEFAULT_THEME_ID` stays `sunshine-quest`.
- Theme ids: `sunshine-quest`, `jungle-quest`, `midnight-blue`.
- Work happens in worktree `~/Projects/technotronic/fun-saver-theme-system` on branch `feat/theme-system`.

---

## Task overview (write detail per-task before implementing each)

This plan is split into small, independently-testable tasks. **Tasks 1–2 are fully detailed below.** Tasks 3–11 have scope + file lists + the exact token mapping; their TDD steps follow the same shape as Tasks 1–2 and are expanded just-in-time at execution (the executor reads the target file, then writes the failing test → minimal change → pass → commit).

1. Consolidate the type scale (typography tokens + 5 consumers)
2. Expand the color-token contract + fill `sunshine-quest` (no behavior change)
3. Migrate `WalletCard` colors → tokens
4. Migrate `CoinRow` colors → tokens
5. Migrate `Star` + `WalletHero` (+ HeroAmount/HeroHead/HeroBreakdown) → tokens
6. Migrate `TransactionDrawer` (+ DepositSplit/AmountPad/DepositAmount) → tokens
7. Audit + migrate remaining constants (`Header`, `AvatarPicker`, `NameField`, `Menu/AccountsSection`); add leak-guard test
8. Add `jungle-quest` theme to the registry
9. Add `midnight-blue` theme to the registry
10. `ThemeController` + context + cookie read/write; refactor `providers.tsx`
11. Wire `AppearanceSection` swatches to the registry + live selection

---

### Task 1: Consolidate the type scale

**Files:**
- Modify: `src/theme/typography.ts` (whole file)
- Test: `src/theme/__tests__/typography.test.ts` (create)
- Modify (key renames only): `src/components/ActionButton/ActionButton.tsx:18`, `src/components/CreateAccount/CreateAccount.tsx:20`, `src/components/Header/CrossfadeTitle/Title.tsx:13`, `src/components/Menu/LanguageSection/LanguageSection.tsx:19`, `src/components/Menu/AccountsSection/AccountChip.tsx:41`, `src/components/Menu/MenuLabel/MenuLabel.tsx:9`

**Interfaces:**
- Produces: `TYPE_SCALE` (flat px map), `FONT_WEIGHTS`, type `ThemeTypography = typeof TYPE_SCALE`.
- Key rename map (old → new): `h1→display`, `h2→title`, `h3→heading`, `body1→body`, `subtitle1→label`, `caption→label`, `overline→label`.

**Old→new value map:** display 48 (was h1 54 — intentionally 48), title 22, heading 18, body 15, label 12. Weights: regular 500, medium 600, bold 700, heavy 800.

- [ ] **Step 1: Write the failing test** — `src/theme/__tests__/typography.test.ts`

```ts
import { FONT_WEIGHTS, TYPE_SCALE } from '../typography';

describe('type scale', () => {
  it('exposes exactly five role sizes', () => {
    expect(Object.keys(TYPE_SCALE).sort()).toEqual(
      ['body', 'display', 'heading', 'label', 'title'].sort()
    );
  });

  it('uses the consolidated px values', () => {
    expect(TYPE_SCALE).toEqual({
      display: 48,
      title: 22,
      heading: 18,
      body: 15,
      label: 12,
    });
  });

  it('exposes four weights', () => {
    expect(FONT_WEIGHTS).toEqual({
      regular: 500,
      medium: 600,
      bold: 700,
      heavy: 800,
    });
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `rtk proxy npx jest src/theme/__tests__/typography.test.ts --json --outputFile=/tmp/jest.json >/dev/null 2>&1; node -e "const r=require('/tmp/jest.json');console.log(r.numFailedTests,'failed')"`
Expected: fails — `FONT_WEIGHTS`/new keys not exported.

- [ ] **Step 3: Rewrite `src/theme/typography.ts`**

```ts
export const TYPE_SCALE = {
  display: 48,
  title: 22,
  heading: 18,
  body: 15,
  label: 12,
} as const;

export const FONT_WEIGHTS = {
  regular: 500,
  medium: 600,
  bold: 700,
  heavy: 800,
} as const;

export type ThemeTypography = typeof TYPE_SCALE;
```

- [ ] **Step 4: Update the 5 consumer key references**

- `ActionButton.tsx:18`: `${TYPE_SCALE.h3}px` → `${TYPE_SCALE.heading}px`
- `CreateAccount.tsx:20`: `theme.typography.h2` → `theme.typography.title`
- `CrossfadeTitle/Title.tsx:13`: `theme.typography.h2` → `theme.typography.title`
- `LanguageSection.tsx:19`: `theme.typography.h3` → `theme.typography.heading`
- `AccountChip.tsx:41`: `theme.typography.caption` → `theme.typography.label`
- `MenuLabel.tsx:9`: `theme.typography.subtitle1` → `theme.typography.label`

- [ ] **Step 5: Run the full suite — verify green**

Run: `rtk proxy npx jest --json --outputFile=/tmp/jest.json >/dev/null 2>&1; node -e "const r=require('/tmp/jest.json');console.log('failed:',r.numFailedTests)"`
Expected: `failed: 0`. (If a component test asserted an old px value, update that assertion to the new value.)

- [ ] **Step 6: Commit**

```bash
git add src/theme/typography.ts src/theme/__tests__/typography.test.ts src/components
git commit -m "refactor: consolidate type scale to 5 role-named sizes"
```

---

### Task 2: Expand the color-token contract + fill `sunshine-quest`

No behavior change — components still import `COLORS` directly. This only adds new tokens to the contract and to the default theme so later tasks can repoint to them. `palette.ts`/`gradients.ts` remain as `sunshine-quest`'s private building blocks.

**Files:**
- Modify: `src/theme/theme-tokens.ts` (extend `ThemeColors` + `ThemeGradients` + Emotion module augmentation)
- Modify: `src/theme/palette.ts` (add the new named colors), `src/theme/gradients.ts` (add pot gradients)
- Modify: `src/theme/themes/sunshine-quest.ts` (already spreads COLORS/GRADIENTS — verify all new fields present)
- Test: `src/theme/__tests__/registry.test.ts` (extend)

**Interfaces — Produces (new `ThemeColors` fields):** `accent`, `accentSoft`, `star`, `divider`, `softBg`, `softBorder`, `softText`, `depositBg`, `gainText`, `gainSoftBg`.
**New `ThemeGradients` fields:** `potSavings`, `potSpending`, `potGood`.
(Existing fields unchanged: colors `primary/primaryGradientTop/primaryShadow/primaryGlow/textOnPrimary/surface/textMuted/textStrong/screenGradient{Start,Mid,End}`; gradients `screen/actionButton/sunnyTile`.)

**sunshine-quest values (from current leaks):** accent `#E94E89`, accentSoft `#FFF1D9`, star `#FFD23F`, divider `#F2D9D2`, softBg `#FFF8E0`, softBorder `#FFD23F`, softText `#7A5A0A`, depositBg `#FFF6E0`, gainText `#2E7D32`, gainSoftBg `#E1F4E5`. Gradients: potSavings `linear-gradient(135deg,#FFE6B0,#FFC34D)`, potSpending `linear-gradient(135deg,#FFD8C7,#FF8A4C)`, potGood `linear-gradient(135deg,#FBC4DA,#E94E89)`.

- [ ] **Step 1: Write the failing test** — extend `registry.test.ts`

```ts
it('exposes the full cohesive token set for the default theme', () => {
  const { colors, gradients } = getThemeTokens(DEFAULT_THEME_ID);
  for (const key of ['accent', 'accentSoft', 'star', 'divider', 'softBg',
    'softBorder', 'softText', 'depositBg', 'gainText', 'gainSoftBg'] as const) {
    expect(colors[key]).toMatch(/^#|rgb/);
  }
  for (const key of ['potSavings', 'potSpending', 'potGood'] as const) {
    expect(gradients[key]).toContain('linear-gradient');
  }
});
```

- [ ] **Step 2: Run to verify it fails** — TS error / undefined fields.
  Run: `rtk proxy npx jest src/theme/__tests__/registry.test.ts --json --outputFile=/tmp/jest.json >/dev/null 2>&1; node -e "const r=require('/tmp/jest.json');console.log(r.numFailedTestSuites,'suite fail')"`

- [ ] **Step 3: Extend `theme-tokens.ts`** — add the new fields to `ThemeColors`, `ThemeGradients`, and the `@emotion/react` module augmentation (mirror the existing interface fields, all `readonly string`).

- [ ] **Step 4: Add the values** — `palette.ts` (new colors above) and `gradients.ts` (`potSavings/potSpending/potGood`). Confirm `sunshine-quest.ts` spreads them (it already does `colors: COLORS, gradients: GRADIENTS`).

- [ ] **Step 5: Run the full suite — verify green** (`failed: 0`).

- [ ] **Step 6: Commit**

```bash
git add src/theme
git commit -m "feat: expand theme token contract with cohesive color roles"
```

---

### Migration pattern (Tasks 3–7)

Each migration task follows the same TDD shape. For each file: **(1)** write/extend a test that renders the component and asserts a themed style comes from the active theme (or simply that the component still renders after migration — most are style-only, so the guard test in Task 7 is the real safety net); **(2)** repoint styled-components from the hardcoded value to the theme token; **(3)** remove the migrated hex from the local `constants.ts`; **(4)** full suite green; **(5)** commit.

Repointing patterns:
- Direct `COLORS.x` import → `props.theme.colors.x`. In a `styled` template: `background: ${({ theme }): string => theme.colors.surface};`. Replace `COLORS.ink` → `theme.colors.textStrong`, `COLORS.accent` → `theme.colors.accent`, `COLORS.surface` → `theme.colors.surface`. Remove the `import { COLORS } from '@/theme/palette';` line once unused.
- Local `*_STYLE.<colorKey>` constant (hardcoded hex) → `theme.colors.<token>` / `theme.gradients.<token>`; delete that key from the constant object. Keep non-color keys (sizes, radii) in the constant.
- Font-size literals → `${({ theme }): number => theme.typography.<role>}px` (or `${TYPE_SCALE.<role>}px` for static).
- Genuinely theme-independent values stay as constants: the **silver coin gradient/border/glyph** in `CoinRow`, the scrim `rgba`, the neutral black box-shadows.

### Task 3: Migrate `WalletCard` → tokens

**Files:** Modify `src/components/Account/WalletCard/WalletCard.tsx`, `src/components/Account/WalletCard/constants.ts`; Test `WalletCard.test.tsx`.

**Mapping:**
| current | → token |
|---|---|
| `COLORS.surface` (Card bg) | `theme.colors.surface` |
| `COLORS.ink` (Name, Pill color) | `theme.colors.textStrong` |
| `WALLET_CARD_STYLE.illustGradient[name]` (savings/spending/goodDeeds hex) | `theme.gradients.potSavings / potSpending / potGood` (map by name) |
| `WALLET_CARD_STYLE.pillBg` `#FFF6E0` | `theme.colors.depositBg` |
| `WALLET_CARD_STYLE.pillBorder` `1.5px solid #FFD23F` | `1.5px solid ${theme.colors.softBorder}` |
| `WALLET_CARD_STYLE.nameSize` | `theme.typography.body` |
| `WALLET_CARD_STYLE.pillFontSize` | `theme.typography.body` |

The `name→gradient` selection moves into the styled component: `background: ${({ name, theme }): string => ({ savings: theme.gradients.potSavings, spending: theme.gradients.potSpending, goodDeeds: theme.gradients.potGood }[name])};`. Delete `illustGradient`, `pillBg`, `pillBorder` color from constants (keep sizes/radii).

Commit: `refactor: WalletCard reads colors from theme tokens`.

### Task 4: Migrate `CoinRow` → tokens

**Files:** Modify `src/components/Account/CoinRow/CoinRow.tsx`, `.../CoinRow/constants.ts`; Test `CoinRow.test.tsx`.

**Mapping (theme):** `COIN_ROW_STYLE.background` `#FFF8E0` → `theme.colors.softBg`; `.border` (dashed `#FFD23F`) → `1.5px dashed ${theme.colors.softBorder}`; `.labelColor` `#7A5A0A` → `theme.colors.softText`; `.labelSize` → `theme.typography.label`.
**Keep as constants (theme-independent, silver coin):** `coinGradient`, `coinBorder`, `coinGlyphColor`, `coinSize`, `coinGlyphSize`, gaps.

Commit: `refactor: CoinRow reads soft-chip colors from theme`.

### Task 5: Migrate `Star` + `WalletHero` (+ HeroAmount/HeroHead/HeroBreakdown)

**Files:** Modify `src/components/Account/WalletHero/Star/Star.tsx` + `Star/constants.ts`, `WalletHero.tsx`, `WalletHero/constants.ts`, and the sub-components `HeroAmount/HeroAmount.tsx`, `HeroHead/HeroHead.tsx`, `HeroBreakdown/HeroBreakdown.tsx` (each currently imports `@/theme/palette`); Tests: the co-located `*.test.tsx` for each.

**Star:** it currently hardcodes `fill`/`stroke` in `STAR`. Make `Star` accept fill/stroke from theme: read `useTheme()` and pass `fill={theme.colors.star}`; keep the `path`/`strokeWidth` in constants; use a darker stroke token — reuse `theme.colors.star` for fill and derive stroke from `theme.colors.accent`? **Decision:** add no new token — fill = `theme.colors.star`, stroke keeps the static `#E69B00` in `STAR` constants ONLY IF it reads acceptable across themes; since it does not (gold stroke on blue star), instead drop the stroke (set `stroke="none"`) so the star is a single themed fill. Update `STAR` constants to `{ path, strokeWidth }` and Star to `fill={theme.colors.star} stroke="none"`.

**WalletHero:** `COLORS.surface` → `theme.colors.surface`; `COLORS.ink` → `theme.colors.textStrong`.
**WalletHero/constants.ts:** `divider` `1.5px dashed #F2D9D2` → build in component `1.5px dashed ${theme.colors.divider}`; `depositsBg` `#FFF6E0` → `theme.colors.depositBg`; `gainBg` `#E1F4E5` → `theme.colors.gainSoftBg`; `gainText` `#2E7D32` → `theme.colors.gainText`. Keep `shadow` (neutral black) as constant.
**HeroAmount / HeroHead / HeroBreakdown:** replace each `COLORS.*` with `theme.colors.*` (`ink→textStrong`, `textMuted→textMuted`, `accent→accent`) and font literals/tokens to `theme.typography.*` (hero amount = `display`, breakdown amount = `title`, labels = `label`, eyebrow = `label`, name = `heading`, meta = `label`). Remove `@/theme/palette` imports once unused.

Commit (may be 2–3 commits, one per sub-area): `refactor: WalletHero + Star read colors/type from theme`.

### Task 6: Migrate `TransactionDrawer` (+ DepositSplit/AmountPad/DepositAmount)

**Files:** Modify `TransactionDrawer.tsx` + `constants.ts`, `DepositSplit/DepositSplit.tsx`, `AmountPad/AmountPad.tsx`, `DepositAmount/*`; Tests: co-located.

**TransactionDrawer mapping:** `COLORS.accent` (ErrorText) → `theme.colors.accent` (then remove palette import — `Title` already uses `theme.colors.textStrong`). `TRANSACTION_DRAWER_STYLE.sheetBg` `#FFF7EE` → `theme.colors.surface`; `.handleColor` `#E7D9C9` → `theme.colors.divider`; `.splitBg` `#FFF8E0` → `theme.colors.softBg`; `.splitBorder` `#FFD23F` → `theme.colors.softBorder`; `.splitText` `#7A5A0A` → `theme.colors.softText`; `.depositGreen` `#2E7D32` → `theme.colors.gainText`; `.depositGreenSoft` `#5BA570` → keep or map to `theme.colors.gainText` at reduced opacity. **Keep:** `scrim` `rgba(40,20,60,0.42)` (overlay) and the neutral sheet box-shadow as constants.
**Font literals → tokens:** the `font-size: 12px` ErrorText → `theme.typography.label`; `titleSize` → `theme.typography.heading`; any `AmountPad`/`DepositSplit` literals → nearest role.

Commit: `refactor: TransactionDrawer family reads colors/type from theme`.

### Task 7: Audit remaining constants + leak-guard test

**Files:** Inspect `src/components/Header/constants.ts`, `AvatarPicker/constants.ts`, `CreateAccount/NameField/constants.ts`, `Menu/AccountsSection/constants.ts`. For each hex value decide: **theme color** (a brand/surface/text hue that should change with theme → migrate to the matching token, same pattern as above) vs **neutral** (pure black/white/transparent overlays, decorative shadows → leave as constant). `Menu/AccountsSection/constants.ts` imports `@/theme/palette` — repoint to tokens.

- [ ] **Leak-guard test** — `src/theme/__tests__/no-color-leaks.test.ts`: read each migrated component `constants.ts` via `fs` and assert it contains no 3/6-digit hex except an allowlist (coin silver set, neutral overlays). This locks the migration.

```ts
import { readFileSync } from 'fs';
import { join } from 'path';

const FILES = [
  'Account/WalletCard/constants.ts',
  'Account/CoinRow/constants.ts',
  'Account/WalletHero/constants.ts',
  'Account/TransactionDrawer/constants.ts',
];
const ALLOW = /#FFFFFF|#FFF\b|#000|coin/i; // refine to the documented neutral set

it('migrated component constants hold no theme hex', () => {
  for (const rel of FILES) {
    const src = readFileSync(join(process.cwd(), 'src/components', rel), 'utf8');
    const hex = src.match(/#[0-9A-Fa-f]{3,6}/g) ?? [];
    expect(hex.filter((h) => !ALLOW.test(h))).toEqual([]);
  }
});
```

Commit: `test: guard against theme-color leaks in component constants`.

---

### Task 8: Add `jungle-quest` theme

**Files:** Create `src/theme/themes/jungle-quest.ts`; Modify `src/theme/registry.ts`; Test `registry.test.ts`.

- [ ] **Step 1: Failing test** — extend `registry.test.ts`:

```ts
it('resolves jungle-quest with full tokens', () => {
  const t = getThemeTokens('jungle-quest');
  expect(t.colors.primary).toBe('#2A9D8F');
  expect(t.colors.surface).toBe('#FFFDF5');
  expect(t.gradients.potGood).toContain('linear-gradient');
});
```

- [ ] **Step 2: Run → fail** (`getThemeTokens('jungle-quest')` throws).

- [ ] **Step 3: Create `src/theme/themes/jungle-quest.ts`**

```ts
import { TYPE_SCALE } from '../typography';
import type { ThemeTokens } from '../theme-tokens';

export const jungleQuest: ThemeTokens = {
  colors: {
    primary: '#2A9D8F', primaryGradientTop: '#3AB3A3', primaryShadow: '#1B6B61',
    primaryGlow: 'rgba(42, 157, 143, 0.45)', textOnPrimary: '#FFFFFF',
    surface: '#FFFDF5', textMuted: '#5C7A6E', textStrong: '#1B4332',
    screenGradientStart: '#2A9D8F', screenGradientMid: '#43AA8B', screenGradientEnd: '#90BE6D',
    accent: '#E76F51', accentSoft: '#FBE6DC', star: '#F9C74F', divider: '#DDE7CC',
    softBg: '#F3F7E4', softBorder: '#B5D94C', softText: '#4A6A1E',
    depositBg: '#F3F7E4', gainText: '#3A7D2E', gainSoftBg: '#E4F2D9',
  },
  gradients: {
    screen: 'linear-gradient(160deg, #2A9D8F, #43AA8B, #90BE6D)',
    actionButton: 'linear-gradient(#3AB3A3, #2A9D8F)',
    sunnyTile: 'linear-gradient(135deg, #52B69A, #2A9D8F)',
    potSavings: 'linear-gradient(135deg, #52B69A, #2A9D8F)',
    potSpending: 'linear-gradient(135deg, #B5D94C, #90BE6D)',
    potGood: 'linear-gradient(135deg, #F4A261, #E76F51)',
  },
  typography: TYPE_SCALE,
};
```

- [ ] **Step 4: Register** in `registry.ts`: import `jungleQuest`, add `'jungle-quest': jungleQuest` to `THEMES`.
- [ ] **Step 5: Full suite green.**
- [ ] **Step 6: Commit** `feat: add jungle-quest theme`.

### Task 9: Add `midnight-blue` theme

**Files:** Create `src/theme/themes/midnight-blue.ts`; Modify `registry.ts`; Test `registry.test.ts`. Same shape as Task 8.

```ts
import { TYPE_SCALE } from '../typography';
import type { ThemeTokens } from '../theme-tokens';

export const midnightBlue: ThemeTokens = {
  colors: {
    primary: '#3B82F6', primaryGradientTop: '#60A5FA', primaryShadow: '#1E40AF',
    primaryGlow: 'rgba(59, 130, 246, 0.40)', textOnPrimary: '#FFFFFF',
    surface: '#141B24', textMuted: '#8A96A8', textStrong: '#ECF1F8',
    screenGradientStart: '#0A0E14', screenGradientMid: '#0F1620', screenGradientEnd: '#122036',
    accent: '#3B82F6', accentSoft: '#14213F', star: '#93C5FD', divider: '#1E2A40',
    softBg: '#121E36', softBorder: '#3B82F6', softText: '#93C5FD',
    depositBg: '#111B30', gainText: '#34D399', gainSoftBg: '#0E2E2A',
  },
  gradients: {
    screen: 'linear-gradient(160deg, #0A0E14, #0F1620, #122036)',
    actionButton: 'linear-gradient(#60A5FA, #3B82F6)',
    sunnyTile: 'linear-gradient(135deg, #1E40AF, #172554)',
    potSavings: 'linear-gradient(135deg, #1E40AF, #172554)',
    potSpending: 'linear-gradient(135deg, #2563EB, #1E40AF)',
    potGood: 'linear-gradient(135deg, #4338CA, #312E81)',
  },
  typography: TYPE_SCALE,
};
```

Test asserts `colors.primary === '#3B82F6'` and `colors.surface === '#141B24'`. Commit `feat: add midnight-blue dark theme`.

### Task 10: ThemeController + cookie persistence; refactor providers

**Files:** Create `src/lib/theme-cookie.ts` (+ test `src/lib/__tests__/theme-cookie.test.ts`); Create `src/theme/ThemeController.tsx` (client, context + state); Modify `src/app/providers.tsx`; Modify `src/app/layout.tsx` (server: read cookie, pass `initialThemeId`).

> **Next 16 note (per AGENTS.md):** `cookies()` from `next/headers` is async in this version — `const store = await cookies();`. Verify against `node_modules/next/dist/docs/` before writing.

**Interfaces — Produces:**
- `theme-cookie.ts`: `THEME_COOKIE = 'fs-theme'`; `resolveThemeId(raw: string | undefined): ThemeId` (returns `raw` if it's a registry key, else `DEFAULT_THEME_ID`).
- `ThemeController.tsx`: `ThemeController({ initialThemeId, children })` (wraps Emotion `ThemeProvider`); hooks `useThemeId(): ThemeId` and `useSetThemeId(): (id: ThemeId) => void`.

- [ ] **Step 1: Failing test** — `theme-cookie.test.ts`:

```ts
import { DEFAULT_THEME_ID } from '@/theme/registry';
import { resolveThemeId } from '../theme-cookie';

it('passes through a known id', () => {
  expect(resolveThemeId('jungle-quest')).toBe('jungle-quest');
});
it('falls back for unknown/missing', () => {
  expect(resolveThemeId('nope')).toBe(DEFAULT_THEME_ID);
  expect(resolveThemeId(undefined)).toBe(DEFAULT_THEME_ID);
});
```

- [ ] **Step 2: Run → fail.**
- [ ] **Step 3: `src/lib/theme-cookie.ts`**

```ts
import { DEFAULT_THEME_ID, THEMES, type ThemeId } from '@/theme/registry';

export const THEME_COOKIE = 'fs-theme';

export function resolveThemeId(raw: string | undefined): ThemeId {
  return raw && raw in THEMES ? (raw as ThemeId) : DEFAULT_THEME_ID;
}
```

(Requires `registry.ts` to export `THEMES` — it already declares it; add `export` if missing.)

- [ ] **Step 4: `src/theme/ThemeController.tsx`**

```tsx
'use client';

import { createContext, JSX, ReactNode, useCallback, useContext, useState } from 'react';
import { ThemeProvider } from '@emotion/react';
import { getThemeTokens, type ThemeId } from './registry';
import { THEME_COOKIE } from '@/lib/theme-cookie';

const ThemeIdContext = createContext<ThemeId | null>(null);
const SetThemeIdContext = createContext<((id: ThemeId) => void) | null>(null);

interface ThemeControllerProps {
  initialThemeId: ThemeId;
  children: ReactNode;
}

export function ThemeController({ initialThemeId, children }: ThemeControllerProps): JSX.Element {
  const [themeId, setThemeId] = useState<ThemeId>(initialThemeId);

  const select = useCallback((id: ThemeId): void => {
    setThemeId(id);
    document.cookie = `${THEME_COOKIE}=${id}; path=/; max-age=31536000; samesite=lax`;
  }, []);

  return (
    <ThemeIdContext.Provider value={themeId}>
      <SetThemeIdContext.Provider value={select}>
        <ThemeProvider theme={getThemeTokens(themeId)}>{children}</ThemeProvider>
      </SetThemeIdContext.Provider>
    </ThemeIdContext.Provider>
  );
}

export function useThemeId(): ThemeId {
  const id = useContext(ThemeIdContext);
  if (id === null) throw new Error('useThemeId must be used within ThemeController');
  return id;
}

export function useSetThemeId(): (id: ThemeId) => void {
  const set = useContext(SetThemeIdContext);
  if (set === null) throw new Error('useSetThemeId must be used within ThemeController');
  return set;
}
```

- [ ] **Step 5: Refactor `providers.tsx`** — accept `initialThemeId: ThemeId`, keep the Emotion cache registry, and replace the inline `<ThemeProvider theme={getThemeTokens()}>` with `<ThemeController initialThemeId={initialThemeId}>`. (`ThemeController` now owns the Emotion `ThemeProvider`.)

- [ ] **Step 6: `layout.tsx` (server)** — read the cookie and pass it down:

```tsx
import { cookies } from 'next/headers';
import { resolveThemeId, THEME_COOKIE } from '@/lib/theme-cookie';
// inside the async layout component:
const store = await cookies();
const initialThemeId = resolveThemeId(store.get(THEME_COOKIE)?.value);
// <Providers initialThemeId={initialThemeId}>{children}</Providers>
```

- [ ] **Step 7: Controller test** — `ThemeController.test.tsx`: render with a child that calls `useThemeId()`, assert it shows `initialThemeId`; render a button calling `useSetThemeId()` and assert the displayed id changes after click. Mock `document.cookie` assignment is implicit (jsdom).

- [ ] **Step 8: Full suite green; Commit** `feat: cookie-persisted runtime theme switching`.

### Task 11: Wire `AppearanceSection` to the registry

**Files:** Modify `src/components/Menu/AppearanceSection/AppearanceSection.tsx` + `constants.ts`; Modify `AppearanceSection.test.tsx`.

- [ ] **Step 1: Update `constants.ts`** — replace `themes` with the three real ids and remove `selectedId` (selection now comes from context):

```ts
export const APPEARANCE_SECTION_CONTENT = {
  label: 'מראה',
  themes: [
    { id: 'sunshine-quest', label: 'Sunshine Quest', background: 'linear-gradient(135deg, #FFC34D, #E94E89)' },
    { id: 'jungle-quest', label: 'Jungle Quest', background: 'linear-gradient(135deg, #2A9D8F, #90BE6D)' },
    { id: 'midnight-blue', label: 'Midnight Blue', background: 'linear-gradient(135deg, #0F1620, #3B82F6)' },
  ],
} as const;
```

- [ ] **Step 2: Failing test** — `AppearanceSection.test.tsx`: render inside a `ThemeController` (or mock `useThemeId`/`useSetThemeId`), click the `jungle-quest` swatch, assert the set function is called with `'jungle-quest'` and that swatch's `data-selected` becomes `true`.

- [ ] **Step 3: Update `AppearanceSection.tsx`** — `const selectedId = useThemeId(); const setThemeId = useSetThemeId();` Swatch gets `onClick={(): void => setThemeId(id)}` and `data-selected={id === selectedId}`. Map over `APPEARANCE_SECTION_CONTENT.themes`.

- [ ] **Step 4: Full suite green; Commit** `feat: wire appearance swatches to live theme switching`.

---

## Self-review

- **Spec coverage:** type scale → T1; expanded color contract → T2; leak migration → T3–T7; jungle-quest → T8; midnight-blue → T9; switching+cookie+SSR → T10; switcher wiring → T11. Testing requirements → typography test (T1), registry tests (T2/T8/T9), leak guard (T7), controller test (T10), AppearanceSection test (T11). All spec sections mapped.
- **Type consistency:** `ThemeId`, `getThemeTokens`, `THEMES`, `resolveThemeId`, `THEME_COOKIE`, `useThemeId`/`useSetThemeId`, `ThemeController` used consistently across T8–T11.
- **Deferred (stretch, not in plan):** per-theme typography/shape, illustrations, per-account theming — intentionally excluded.

## Notes for the implementer

- Fine-tune exact px/colors against the **real local run** (`npm run dev`) — the approved mockups approximate the live design.
- After T2 the app still renders identically (sunshine); visible multi-theme behavior arrives at T10–T11.
- Keep each file ≤ 200 lines; if `AppearanceSection.tsx` or a theme file approaches it, split.
