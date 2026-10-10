'use client';

import { JSX, ReactNode } from 'react';
import { PrimaryButton } from '@/components/PrimaryButton';
import { AmountKeypad } from '../AmountKeypad';
import { TRANSACTION_DRAWER_TEST_IDS } from '../constants';
import type { AmountEntry } from '../use-amount-entry';
import { AMOUNT_KEYPAD_WITH_SUBMIT_TEST_IDS } from './constants';
import {
  Keypad,
  KeypadSpace,
  InPlaceOfKeypad,
} from './AmountKeypadWithSubmit.styles';

interface AmountKeypadWithSubmitProps {
  entry: AmountEntry;
  canSubmit: boolean;
  submitLabel: string;
  inPlaceOfKeypad?: ReactNode;
}

export function AmountKeypadWithSubmit({
  entry,
  canSubmit,
  submitLabel,
  inPlaceOfKeypad,
}: AmountKeypadWithSubmitProps): JSX.Element {
  return (
    <>
      <KeypadSpace>
        <Keypad covered={Boolean(inPlaceOfKeypad)}>
          <AmountKeypad
            onDigit={entry.onDigit}
            onClear={entry.onClear}
            onBackspace={entry.onBackspace}
          />
        </Keypad>
        {inPlaceOfKeypad && (
          <InPlaceOfKeypad
            data-testid={AMOUNT_KEYPAD_WITH_SUBMIT_TEST_IDS.inPlaceOfKeypad}
          >
            {inPlaceOfKeypad}
          </InPlaceOfKeypad>
        )}
      </KeypadSpace>
      <PrimaryButton
        type="button"
        data-testid={TRANSACTION_DRAWER_TEST_IDS.submit}
        disabled={!canSubmit}
        onClick={entry.onSubmit}
      >
        {submitLabel}
      </PrimaryButton>
    </>
  );
}
