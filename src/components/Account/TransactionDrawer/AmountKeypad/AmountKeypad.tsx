'use client';

import { JSX } from 'react';
import { AmountEditKeys } from './AmountEditKeys';
import { AMOUNT_KEYPAD_TEST_IDS, DIGIT_KEYS_WITHOUT_ZERO } from './constants';
import { Grid, Key, ZeroKey } from './AmountKeypad.styles';

interface AmountKeypadProps {
  onDigit: (digit: number) => void;
  onClear: () => void;
  onBackspace: () => void;
}

export function AmountKeypad({
  onDigit,
  onClear,
  onBackspace,
}: AmountKeypadProps): JSX.Element {
  const digitKeys = DIGIT_KEYS_WITHOUT_ZERO.map((digit: string) => (
    <Key
      key={digit}
      type="button"
      data-testid={AMOUNT_KEYPAD_TEST_IDS.key(digit)}
      onClick={(): void => onDigit(Number(digit))}
    >
      {digit}
    </Key>
  ));

  return (
    <>
      <AmountEditKeys onClear={onClear} onBackspace={onBackspace} />
      <Grid dir="ltr">
        {digitKeys}
        <ZeroKey
          type="button"
          data-testid={AMOUNT_KEYPAD_TEST_IDS.key('0')}
          onClick={(): void => onDigit(0)}
        >
          0
        </ZeroKey>
      </Grid>
    </>
  );
}
