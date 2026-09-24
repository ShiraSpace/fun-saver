'use client';

import { JSX } from 'react';
import { AMOUNT_KEYPAD_COPY, AMOUNT_KEYPAD_TEST_IDS } from '../constants';
import { Keys, AmountEditKey, AmountEditIcon } from './AmountEditKeys.styles';

interface AmountEditKeysProps {
  onClear: () => void;
  onBackspace: () => void;
}

export function AmountEditKeys({
  onClear,
  onBackspace,
}: AmountEditKeysProps): JSX.Element {
  return (
    <Keys>
      <AmountEditKey
        type="button"
        data-testid={AMOUNT_KEYPAD_TEST_IDS.clear}
        onClick={onClear}
      >
        <AmountEditIcon>{AMOUNT_KEYPAD_COPY.clearIcon}</AmountEditIcon>
        {AMOUNT_KEYPAD_COPY.clear}
      </AmountEditKey>
      <AmountEditKey
        type="button"
        data-testid={AMOUNT_KEYPAD_TEST_IDS.backspace}
        onClick={onBackspace}
      >
        <AmountEditIcon>{AMOUNT_KEYPAD_COPY.backspaceIcon}</AmountEditIcon>
        {AMOUNT_KEYPAD_COPY.backspace}
      </AmountEditKey>
    </Keys>
  );
}
