import { DEFAULT_THEME_ID, THEMES, type ThemeId } from '@/theme/registry';

export const THEME_COOKIE = 'fs-theme';

export function resolveThemeId(raw: string | undefined): ThemeId {
  return raw && raw in THEMES ? (raw as ThemeId) : DEFAULT_THEME_ID;
}
