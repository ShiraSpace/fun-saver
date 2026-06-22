export const LANGUAGE_SECTION_TEST_IDS = {
  section: 'menu-language-section',
  option: 'menu-language-option',
} as const;

export interface MenuLanguage {
  code: string;
  label: string;
}

export const LANGUAGE_SECTION_CONTENT = {
  label: 'שפה',
  selectedCode: 'he',
  options: [
    { code: 'he', label: 'עברית' },
    { code: 'en', label: 'EN' },
  ] as MenuLanguage[],
} as const;

export const LANGUAGE_SECTION_STYLE = {
  radius: 14,
  paddingY: 12,
} as const;
