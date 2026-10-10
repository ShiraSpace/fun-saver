import type { TRANSACTION_TYPE } from '@/lib/transaction/constants';
import type { TransactionType } from '@/lib/transaction/types';

export type EnteredTransactionType = Exclude<
  TransactionType,
  typeof TRANSACTION_TYPE.interest
>;

export const TRANSACTION_DRAWER_TEST_IDS = {
  drawer: 'transaction-drawer',
  handle: 'transaction-drawer-handle',
  scrim: 'transaction-drawer-scrim',
  amount: 'transaction-drawer-amount',
  split: 'transaction-drawer-split',
  splitAmount: (walletName: string): string =>
    `transaction-drawer-split-${walletName}`,
  submit: 'transaction-drawer-confirm',
  error: 'transaction-drawer-error',
} as const;

export const TRANSACTION_DRAWER_COPY = {
  title: 'כמה מפקידים?',
  submit: 'הפקדה של',
  submitting: 'מפקידים…',
  error: 'אופס, משהו השתבש. נסו שוב.',
} as const;

export const TRANSACTION_DRAWER_STYLE = {
  maxHeight: '80svh',
  gap: 8,
  messageExtraTop: 6,
  padding: '8px 16px 0px',
  handlePaddingBottom: 14,
  bodyPaddingBottom: 24,
} as const;

export const SWIPE_TO_CLOSE = {
  closeThreshold: 100,
  snapMs: 200,
} as const;
