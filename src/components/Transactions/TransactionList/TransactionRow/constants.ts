import { countInWords } from '../../count-in-words';

export const TRANSACTION_ROW_COPY = {
  deposit: { icon: '💰', label: 'הפקדה' },
  withdrawal: {
    spending: { badge: '🛒', label: 'קנייה' },
    goodDeeds: { badge: '🎁', label: 'תרומה' },
    savings: { badge: '🏦', label: 'משיכה' },
  },
  interest: { badge: '✨', label: 'ריבית' },
  interestDays: (days: number): string =>
    countInWords(days, 'יום אחד', (count) => `${count} ימים`),
} as const;

export const TRANSACTION_ROW_TEST_IDS = {
  row: 'transaction-row',
  balanceChange: 'transaction-row-balance-change',
  balance: 'transaction-row-balance',
} as const;
