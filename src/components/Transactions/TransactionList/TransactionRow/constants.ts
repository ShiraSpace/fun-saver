import { countInWords } from '../../count-in-words';

function interestDays(days: number): string {
  return countInWords(days, 'יום אחד', (count) => `${count} ימים`);
}

export const TRANSACTION_ROW_COPY = {
  deposit: { icon: '💰', label: 'הפקדה' },
  withdrawal: {
    spending: { badge: '🛒', label: 'קנייה' },
    goodDeeds: { badge: '🎁', label: 'תרומה' },
    savings: { badge: '🏦', label: 'משיכה' },
  },
  interest: { badge: '✨', label: 'ריבית' },
  interestDays,
  interestPeriod: (days: string, dayCount: number): string => `${days} · ${interestDays(dayCount)}`,
} as const;

export const TRANSACTION_ROW_TEST_IDS = {
  row: 'transaction-row',
  balanceChange: 'transaction-row-balance-change',
  balance: 'transaction-row-balance',
} as const;
