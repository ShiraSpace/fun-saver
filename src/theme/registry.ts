import type { ThemeTokens } from './theme-tokens';
import { sunshineQuest } from './themes/sunshine-quest';
import { jungleQuest } from './themes/jungle-quest';
import { midnightBlue } from './themes/midnight-blue';

export const THEMES = {
  'sunshine-quest': sunshineQuest,
  'jungle-quest': jungleQuest,
  'midnight-blue': midnightBlue,
} as const;

export type ThemeId = keyof typeof THEMES;

export const DEFAULT_THEME_ID: ThemeId = 'sunshine-quest';

export function getThemeTokens(id: string = DEFAULT_THEME_ID): ThemeTokens {
  const tokens = (THEMES as Record<string, ThemeTokens>)[id];

  if (!tokens) {
    throw new Error(`unknown theme id "${id}"`);
  }

  return tokens;
}

export function resolveThemeId(raw: string | undefined): ThemeId {
  return raw && raw in THEMES ? (raw as ThemeId) : DEFAULT_THEME_ID;
}
