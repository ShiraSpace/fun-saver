export const ACCOUNT_LIST_DOM_ID = 'menu-accounts';

export const ACCOUNT_LIST_TEST_IDS = {
  list: 'menu-account-list',
  row: 'menu-account-row',
  total: 'menu-account-total',
  addAccount: 'menu-account-add',
  childViewToggle: 'menu-account-child-view-toggle',
} as const;

export const ACCOUNT_LIST_COPY = {
  addLabel: '＋ חשבון חדש',
  addAccessibleLabel: 'הוספת חשבון',
  accountColumn: 'חשבון',
  childViewColumn: '🧒 מצב ילד',
  childViewToggleLabel: (accountName: string): string =>
    `מצב ילד ל${accountName}`,
} as const;

export const ACCOUNT_LIST_STYLE = {
  avatarSize: 30,
  gap: 5,
  nameColumnWidth: 56,
  popoverOffset: 5,
  popoverPadding: 7,
  popoverRadius: 16,
} as const;
