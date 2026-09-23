import { SCREEN_LAYOUT } from '@/components/Screen/constants';

export type TransactionMode = 'deposit' | 'withdraw';

export const TRANSACTION_DRAWER_TEST_IDS = {
  drawer: 'transaction-drawer',
  handle: 'transaction-drawer-handle',
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
  maxWidth: SCREEN_LAYOUT.maxWidth,
  maxHeight: '80svh',
  scrim: 'rgba(40, 20, 60, 0.42)',
  sheetRadius: 28,
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
