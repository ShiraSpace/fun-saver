'use client';

import { JSX } from 'react';
import { ActionButton } from '@/components/ActionButton';
import type { AccountWithDerivedWallets } from '@/lib/types';
import { MONEY_COPY } from '../../Money/constants';
import { AmountPad } from '../AmountPad';
import { DepositAmount } from '../DepositAmount';
import { DepositSplit } from '../DepositSplit';
import { useDepositForm } from '../use-deposit-form';
import { DrawerError, DrawerTitle } from '../drawer-parts';
import {
  TRANSACTION_DRAWER_COPY,
  TRANSACTION_DRAWER_TEST_IDS,
} from '../constants';

interface DepositBodyProps {
  account: AccountWithDerivedWallets;
  onClose: () => void;
}

export function DepositBody({
  account,
  onClose,
}: DepositBodyProps): JSX.Element {
  const {
    amount,
    split,
    isSubmitting,
    hasError,
    canSubmit,
    onDigit,
    onClear,
    onBackspace,
    onConfirm,
  } = useDepositForm(account.id, onClose);

  const submitButtonText = isSubmitting
    ? TRANSACTION_DRAWER_COPY.submitting
    : `${TRANSACTION_DRAWER_COPY.confirm} ${MONEY_COPY.currency}${amount}`;

  return (
    <>
      <DrawerTitle>{TRANSACTION_DRAWER_COPY.title}</DrawerTitle>
      <DepositAmount amount={amount} />
      <DepositSplit split={split} />
      {hasError && (
        <DrawerError data-testid={TRANSACTION_DRAWER_TEST_IDS.error}>
          {TRANSACTION_DRAWER_COPY.error}
        </DrawerError>
      )}
      <AmountPad
        onDigit={onDigit}
        onClear={onClear}
        onBackspace={onBackspace}
      />
      <ActionButton
        type="button"
        data-testid={TRANSACTION_DRAWER_TEST_IDS.confirm}
        disabled={!canSubmit}
        onClick={onConfirm}
      >
        {submitButtonText}
      </ActionButton>
    </>
  );
}
