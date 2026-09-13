'use client';

import { JSX } from 'react';
import { EditRow } from './EditRow';
import { AMOUNT_PAD_TEST_IDS, DIGIT_KEYS_WITHOUT_ZERO } from './constants';
import { Grid, Key, ZeroKey } from './AmountPad.styles';

interface AmountPadProps {
  onDigit: (digit: number) => void;
  onClear: () => void;
  onBackspace: () => void;
}

export function AmountPad({
  onDigit,
  onClear,
  onBackspace,
}: AmountPadProps): JSX.Element {
  const digitKeys = DIGIT_KEYS_WITHOUT_ZERO.map((digit: string) => (
    <Key
      key={digit}
      type="button"
      data-testid={AMOUNT_PAD_TEST_IDS.key(digit)}
      onClick={(): void => onDigit(Number(digit))}
    >
      {digit}
    </Key>
  ));

  return (
    <>
      <EditRow onClear={onClear} onBackspace={onBackspace} />
      <Grid dir="ltr">
        {digitKeys}
        <ZeroKey
          type="button"
          data-testid={AMOUNT_PAD_TEST_IDS.key('0')}
          onClick={(): void => onDigit(0)}
        >
          0
        </ZeroKey>
      </Grid>
    </>
  );
}
