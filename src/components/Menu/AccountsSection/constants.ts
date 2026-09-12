export const ACCOUNTS_SECTION_TEST_IDS = {
  section: 'menu-accounts-section',
  chip: 'menu-account-chip',
  editChip: 'menu-account-edit',
  addChip: 'menu-account-add',
} as const;

export const ACCOUNTS_SECTION_CONTENT = {
  label: 'החשבונות',
  editIcon: '✏️',
  editPrefix: 'עריכת',
  addIcon: '＋',
  addLabel: 'הוספת חשבון',
} as const;

export const ACCOUNTS_SECTION_STYLE = {
  avatarSize: 46,
  rowGap: 12,
  ringWidth: 3,
  ringMs: 200,
  pressScale: 0.92,
  pressMs: 120,
  badgeSize: 20,
  actionFontSize: 20,
  pillPadding: 16,
  pillGap: 7,
  pillFontSize: 15,
} as const;
