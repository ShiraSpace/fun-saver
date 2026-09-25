export const TRANSACTION_ROW_COPY = {
  deposit: { icon: '💰', label: 'הפקדה' },
  withdrawal: {
    spending: { badge: '🛒', label: 'קנייה' },
    goodDeeds: { badge: '🎁', label: 'תרומה' },
    savings: { badge: '🏦', label: 'משיכה' },
  },
  interest: { badge: '✨', label: 'ריבית' },
  interestDays: (days: number): string =>
    days === 1 ? 'יום אחד' : `${days} ימים`,
} as const;

export const TRANSACTION_ROW_TEST_IDS = {
  row: (key: string): string => `transaction-row-${key}`,
  balanceChange: (key: string): string => `transaction-row-${key}-change`,
  balance: (key: string): string => `transaction-row-${key}-balance`,
} as const;
