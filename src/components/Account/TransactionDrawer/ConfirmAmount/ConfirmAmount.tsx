'use client';

import { JSX } from 'react';
import { PrimaryButton } from '@/components/PrimaryButton';
import { AmountPad } from '../AmountPad';
import { TRANSACTION_DRAWER_TEST_IDS } from '../constants';
import type { AmountEntry } from '../use-amount-entry';

interface ConfirmAmountProps {
  entry: AmountEntry;
  canSubmit: boolean;
  submitLabel: string;
}

export function ConfirmAmount({
  entry,
  canSubmit,
  submitLabel,
}: ConfirmAmountProps): JSX.Element {
  return (
    <>
      <AmountPad
        onDigit={entry.onDigit}
        onClear={entry.onClear}
        onBackspace={entry.onBackspace}
      />
      <PrimaryButton
        type="button"
        data-testid={TRANSACTION_DRAWER_TEST_IDS.confirm}
        disabled={!canSubmit}
        onClick={entry.onConfirm}
      >
        {submitLabel}
      </PrimaryButton>
    </>
  );
}
