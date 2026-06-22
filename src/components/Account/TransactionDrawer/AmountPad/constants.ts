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
  clear: 'C',
  backspace: '⌫',
} as const;
