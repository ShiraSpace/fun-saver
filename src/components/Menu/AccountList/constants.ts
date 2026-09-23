export const ACCOUNT_LIST_DOM_ID = 'menu-accounts';

export const ACCOUNT_LIST_TEST_IDS = {
  list: 'menu-account-list',
  row: 'menu-account-row',
  total: 'menu-account-total',
  addRow: 'menu-account-add',
} as const;

export const ACCOUNT_LIST_CONTENT = {
  addLabel: '＋ חשבון חדש',
  addAccessibleLabel: 'הוספת חשבון',
} as const;

export const ACCOUNT_LIST_STYLE = {
  avatarSize: 30,
  gap: 5,
  rowGap: 10,
  rowPaddingY: 8,
  rowPaddingX: 11,
  rowRadius: 14,
  nameColumnWidth: 56,
  popoverOffset: 5,
  popoverPadding: 7,
  popoverRadius: 16,
  shadow: '0 14px 30px',
} as const;
