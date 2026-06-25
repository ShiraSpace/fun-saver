import { COLORS } from '@/theme/palette';

export const ACCOUNTS_SECTION_TEST_IDS = {
  section: 'menu-accounts-section',
  chip: 'menu-account-chip',
  editChip: 'menu-account-edit',
  addChip: 'menu-account-add',
} as const;

export const ACCOUNTS_SECTION_CONTENT = {
  label: 'החשבונות',
  editIcon: '✏️',
  editLabel: 'עריכת חשבון',
  addIcon: '＋',
  addLabel: 'הוספת חשבון',
} as const;

export const ACCOUNTS_SECTION_STYLE = {
  avatarSize: 46,
  rowGap: 12,
  ringColor: COLORS.gold,
  ringWidth: 3,
  ringMs: 200,
  pressScale: 0.92,
  pressMs: 120,
  badgeBg: COLORS.primary,
  badgeColor: COLORS.textOnPrimary,
  badgeSize: 20,
  actionFontSize: 20,
} as const;
