import type { ThemeTokens } from './theme-tokens';
import { sunshineQuest } from './themes/sunshine-quest';
import { jungleQuest } from './themes/jungle-quest';
import { midnightBlue } from './themes/midnight-blue';

export const THEME_ID = {
  sunshineQuest: 'sunshine-quest',
  jungleQuest: 'jungle-quest',
  midnightBlue: 'midnight-blue',
} as const;

export const THEMES = {
  [THEME_ID.sunshineQuest]: sunshineQuest,
  [THEME_ID.jungleQuest]: jungleQuest,
  [THEME_ID.midnightBlue]: midnightBlue,
} as const;

export type ThemeId = keyof typeof THEMES;

export const DEFAULT_THEME_ID: ThemeId = THEME_ID.sunshineQuest;

export function getThemeTokens(
  themeId: string = DEFAULT_THEME_ID
): ThemeTokens {
  const tokens = (THEMES as Record<string, ThemeTokens>)[themeId];

  if (!tokens) {
    throw new Error(`unknown theme id "${themeId}"`);
  }

  return tokens;
}

export function isThemeId(value: unknown): value is ThemeId {
  return typeof value === 'string' && value in THEMES;
}

export function resolveThemeId(storedThemeId: string | undefined): ThemeId {
  return isThemeId(storedThemeId) ? storedThemeId : DEFAULT_THEME_ID;
}
