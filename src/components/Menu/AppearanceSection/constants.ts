export const APPEARANCE_SECTION_TEST_IDS = {
  section: 'menu-appearance-section',
  swatch: 'menu-appearance-swatch',
} as const;

export interface MenuTheme {
  id: string;
  label: string;
  background: string;
}

export const APPEARANCE_SECTION_CONTENT = {
  label: 'מראה',
  selectedId: 'sunshine-quest',
  themes: [
    {
      id: 'sunshine-quest',
      label: 'Sunshine Quest',
      background: 'linear-gradient(135deg, #FFC34D, #E94E89)',
    },
    { id: 'mint-ledger', label: 'Mint Ledger', background: '#2E7D67' },
    { id: 'sunny-modern', label: 'Sunny Modern', background: '#3D5AFE' },
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
