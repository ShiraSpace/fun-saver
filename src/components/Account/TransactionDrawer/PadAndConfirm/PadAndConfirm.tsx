'use client';

import { JSX } from 'react';
import { ActionButton } from '@/components/ActionButton';
import { AmountPad } from '../AmountPad';
import { TRANSACTION_DRAWER_TEST_IDS } from '../constants';
import type { AmountForm } from '../use-amount-form';

interface PadAndConfirmProps {
  form: AmountForm;
  canSubmit: boolean;
  submitLabel: string;
}

export function PadAndConfirm({
  form,
  canSubmit,
  submitLabel,
}: PadAndConfirmProps): JSX.Element {
  return (
    <>
      <AmountPad
        onDigit={form.onDigit}
        onClear={form.onClear}
        onBackspace={form.onBackspace}
      />
      <ActionButton
        type="button"
        data-testid={TRANSACTION_DRAWER_TEST_IDS.confirm}
        disabled={!canSubmit}
        onClick={form.onConfirm}
      >
        {submitLabel}
      </ActionButton>
    </>
  );
}
