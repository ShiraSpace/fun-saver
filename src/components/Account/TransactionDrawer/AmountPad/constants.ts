const AMOUNT_PAD_KEYS = [
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '0',
] as const;

export const DIGIT_KEYS_WITHOUT_ZERO: string[] = AMOUNT_PAD_KEYS.filter(
  (key) => key !== '0'
);

export const AMOUNT_PAD_TEST_IDS = {
  key: (value: string): string => `amount-pad-key-${value}`,
  clear: 'amount-pad-clear',
  backspace: 'amount-pad-backspace',
} as const;

export const AMOUNT_PAD_COPY = {
  clear: 'נקה',
  backspace: 'מחק',
  clearIcon: 'C',
  backspaceIcon: '⌫',
} as const;

export const AMOUNT_PAD_STYLE = {
  gap: 6,
  radius: 13,
  keyPaddingY: 9,
  editPaddingY: 7,
  topGap: 10,
  shadow: '0 3px 0 rgba(0, 0, 0, 0.05)',
  pressDrop: 3,
  pressMs: 90,
} as const;
