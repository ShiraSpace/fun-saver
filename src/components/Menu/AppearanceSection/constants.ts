import { THEME_ID, type ThemeId } from '@/theme/registry';

export const APPEARANCE_SECTION_TEST_IDS = {
  section: 'menu-appearance-section',
  swatch: 'menu-appearance-swatch',
  saveError: 'menu-appearance-save-error',
} as const;

export interface MenuTheme {
  id: ThemeId;
  label: string;
}

const MENU_THEMES: MenuTheme[] = [
  { id: THEME_ID.sunshineQuest, label: 'Sunshine Quest' },
  { id: THEME_ID.jungleQuest, label: 'Jungle Quest' },
  { id: THEME_ID.midnightBlue, label: 'Midnight Blue' },
];

export const APPEARANCE_SECTION_COPY = {
  label: 'מראה',
  saveError: 'לא הצלחנו לשמור את העיצוב, נסו שוב',
  themes: MENU_THEMES,
} as const;

export const APPEARANCE_SECTION_STYLE = {
  swatchSize: 38,
  swatchRadius: 12,
  rowGap: 9,
  ringWidth: 2.5,
} as const;
