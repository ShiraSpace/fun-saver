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
  sheetBg: '#FFF7EE',
  sheetRadius: 28,
  handleColor: '#E7D9C9',
  gap: 14,
  depositGreen: '#2E7D32',
  depositGreenSoft: '#5BA570',
  splitBg: '#FFF8E0',
  splitBorder: '#FFD23F',
  splitText: '#7A5A0A',
  amountSize: 50,
  titleSize: 17,
} as const;
