import type { ThemeId } from '@/theme/registry';

export const APPEARANCE_SECTION_TEST_IDS = {
  section: 'menu-appearance-section',
  swatch: 'menu-appearance-swatch',
  saveError: 'menu-appearance-save-error',
} as const;

export interface MenuTheme {
  id: ThemeId;
  label: string;
  background: string;
}

export const APPEARANCE_SECTION_CONTENT = {
  label: 'מראה',
  saveError: 'לא הצלחנו לשמור את העיצוב, נסו שוב',
  themes: [
    {
      id: 'sunshine-quest',
      label: 'Sunshine Quest',
      background: 'linear-gradient(135deg, #FFC34D, #E94E89)',
    },
    {
      id: 'jungle-quest',
      label: 'Jungle Quest',
      background: 'linear-gradient(135deg, #2A9D8F, #90BE6D)',
    },
    {
      id: 'midnight-blue',
      label: 'Midnight Blue',
      background: 'linear-gradient(135deg, #0F1620, #3B82F6)',
    },
  ] as MenuTheme[],
} as const;

export const APPEARANCE_SECTION_STYLE = {
  swatchSize: 48,
  swatchRadius: 14,
  rowGap: 12,
  ringColor: '#FFFFFF',
  ringWidth: 3,
  ringOffset: 2,
} as const;
