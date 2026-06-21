export const ACCOUNTS_SECTION_TEST_IDS = {
  section: 'menu-accounts-section',
  chip: 'menu-account-chip',
  editChip: 'menu-account-edit',
  addChip: 'menu-account-add',
} as const;

export interface MenuAccount {
  id: string;
  name: string;
  avatarId: string;
}

export const ACCOUNTS_SECTION_CONTENT = {
  label: 'החשבונות',
  accounts: [
    { id: 'noa', name: 'נועה', avatarId: 'kid-03' },
    { id: 'matan', name: 'מתן', avatarId: 'kid-08' },
  ] as MenuAccount[],
  selectedId: 'noa',
  editIcon: '✏️',
  editLabel: 'עריכת חשבון',
  addIcon: '＋',
  addLabel: 'הוספת חשבון',
} as const;

export const ACCOUNTS_SECTION_STYLE = {
  avatarSize: 46,
  rowGap: 12,
  ringColor: '#FFD23F',
  ringWidth: 3,
  badgeBg: '#6B2C8E',
  badgeColor: '#FFFFFF',
  badgeSize: 20,
  badgeFontSize: 11,
  actionFontSize: 20,
  labelFontSize: 10,
  labelLetterSpacing: 0.6,
  labelOpacity: 0.92,
  labelMarginTop: 18,
  labelMarginBottom: 8,
} as const;
