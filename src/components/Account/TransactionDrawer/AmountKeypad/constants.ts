const AMOUNT_KEYPAD_KEYS = [
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

export const DIGIT_KEYS_WITHOUT_ZERO: string[] = AMOUNT_KEYPAD_KEYS.filter(
  (key) => key !== '0'
);

export const AMOUNT_KEYPAD_TEST_IDS = {
  key: (value: string): string => `amount-pad-key-${value}`,
  clear: 'amount-pad-clear',
  backspace: 'amount-pad-backspace',
} as const;

export const AMOUNT_KEYPAD_COPY = {
  clear: 'נקה',
  backspace: 'מחק',
  clearIcon: 'C',
  backspaceIcon: '⌫',
} as const;

export const AMOUNT_KEYPAD_STYLE = {
  gap: 5,
  radius: 13,
  keyPaddingY: 6,
  editPaddingY: 6,
  gridMarginBottom: 10,
  topGap: 10,
  pressDrop: 3,
  pressMs: 90,
} as const;
