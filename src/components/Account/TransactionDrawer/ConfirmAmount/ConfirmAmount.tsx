'use client';

import { JSX } from 'react';
import { ActionButton } from '@/components/ActionButton';
import { AmountPad } from '../AmountPad';
import { TRANSACTION_DRAWER_TEST_IDS } from '../constants';
import type { AmountEntry } from '../use-amount-entry';

interface ConfirmAmountProps {
  entry: AmountEntry;
  submitLabel: string;
}

export function ConfirmAmount({
  entry,
  submitLabel,
}: ConfirmAmountProps): JSX.Element {
  return (
    <>
      <AmountPad
        onDigit={entry.onDigit}
        onClear={entry.onClear}
        onBackspace={entry.onBackspace}
      />
      <ActionButton
        type="button"
        data-testid={TRANSACTION_DRAWER_TEST_IDS.confirm}
        disabled={!entry.canSubmit}
        onClick={entry.onConfirm}
      >
        {submitLabel}
      </ActionButton>
    </>
  );
}
