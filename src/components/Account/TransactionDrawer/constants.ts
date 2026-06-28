export type TransactionMode = 'deposit' | 'withdraw';

export const TRANSACTION_DRAWER_TEST_IDS = {
  drawer: 'transaction-drawer',
  scrim: 'transaction-drawer-scrim',
  amount: 'transaction-drawer-amount',
  split: 'transaction-drawer-split',
  splitShare: (name: string): string => `transaction-drawer-split-${name}`,
  confirm: 'transaction-drawer-confirm',
  error: 'transaction-drawer-error',
} as const;

export const TRANSACTION_DRAWER_COPY = {
  title: 'כמה מפקידים?',
  confirm: 'הפקדה של',
  submitting: 'מפקידים…',
  error: 'אופס, משהו השתבש. נסו שוב.',
} as const;

export const TRANSACTION_DRAWER_STYLE = {
  maxWidth: 420,
  scrim: 'rgba(40, 20, 60, 0.42)',
  sheetRadius: 28,
  gap: 10,
} as const;
