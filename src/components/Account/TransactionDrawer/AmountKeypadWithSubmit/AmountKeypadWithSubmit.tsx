'use client';

import { JSX } from 'react';
import { PrimaryButton } from '@/components/PrimaryButton';
import { AmountKeypad } from '../AmountKeypad';
import { TRANSACTION_DRAWER_TEST_IDS } from '../constants';
import type { AmountEntry } from '../use-amount-entry';

interface AmountKeypadWithSubmitProps {
  entry: AmountEntry;
  canSubmit: boolean;
  submitLabel: string;
}

export function AmountKeypadWithSubmit({
  entry,
  canSubmit,
  submitLabel,
}: AmountKeypadWithSubmitProps): JSX.Element {
  return (
    <>
      <AmountKeypad
        onDigit={entry.onDigit}
        onClear={entry.onClear}
        onBackspace={entry.onBackspace}
      />
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
