import {
  ALL_TRANSACTION_TYPES,
  INTEREST_MODE,
  TRANSACTION_TYPE,
} from '@/lib/transaction/constants';
import type {
  InterestMode,
  TransactionTypeFilter,
} from '@/lib/transaction/transaction-rows';
import type { Choice } from '../ChoiceChips';
import { countInWords } from '../count-in-words';

export const TRANSACTION_LIST_COPY = {
  title: 'התנועות',
  count: (rowCount: number, dayCount: number): string =>
    `${countInWords(rowCount, 'שורה אחת', (count) => `${count} שורות`)} · ${countInWords(dayCount, 'יום אחד', (count) => `${count} יום`)}`,
  filterLegend: 'סוג תנועה',
  interestTitle: 'ריבית',
  emptyFilter: 'אין תנועות בסינון הזה',
  noTransactions: 'כאן יופיעו ההפקדות, המשיכות והריבית',
  columns: { balanceChange: 'שינוי', balance: 'יתרה' },
} as const;

export const TRANSACTION_TYPE_FILTERS: readonly Choice<TransactionTypeFilter>[] =
  [
    { id: ALL_TRANSACTION_TYPES, label: 'הכל' },
    { id: TRANSACTION_TYPE.deposit, label: 'הפקדות' },
    { id: TRANSACTION_TYPE.withdrawal, label: 'משיכות' },
    { id: TRANSACTION_TYPE.interest, label: 'ריבית' },
  ];

export const INTEREST_MODES: readonly Choice<InterestMode>[] = [
  { id: INTEREST_MODE.monthly, label: 'חודשית' },
  { id: INTEREST_MODE.daily, label: 'יומית' },
];

export const TRANSACTION_LIST_TYPE_GROUP_NAME = 'transaction-type';

export const TRANSACTION_LIST_INTEREST_GROUP_NAME = 'interest-mode';

export const TRANSACTION_LIST_TEST_IDS = {
  list: 'transaction-list',
  count: 'transaction-list-count',
  filters: TRANSACTION_LIST_TYPE_GROUP_NAME,
  interestMode: TRANSACTION_LIST_INTEREST_GROUP_NAME,
  emptyFilter: 'transaction-list-empty-filter',
  noTransactions: 'transaction-list-no-transactions',
} as const;
