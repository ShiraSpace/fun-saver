'use client';

import { JSX } from 'react';
import type { AccountWithDerivedWallets } from '@/lib/types';
import { MONEY_COPY } from '@/components/Money/constants';
import { DepositAmount } from '../DepositAmount';
import { DepositSplit } from '../DepositSplit';
import { ConfirmAmount } from '../ConfirmAmount';
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
  const form = useDepositForm(account.id, onClose);
  const submitLabel = form.isSubmitting
    ? TRANSACTION_DRAWER_COPY.submitting
    : `${TRANSACTION_DRAWER_COPY.confirm} ${MONEY_COPY.currency}${form.amount}`;

  return (
    <>
      <DrawerTitle>{TRANSACTION_DRAWER_COPY.title}</DrawerTitle>
      <DepositAmount amount={form.amount} />
      <DepositSplit split={form.split} />
      {form.hasError && (
        <DrawerError data-testid={TRANSACTION_DRAWER_TEST_IDS.error}>
          {TRANSACTION_DRAWER_COPY.error}
        </DrawerError>
      )}
      <ConfirmAmount
        entry={form}
        canSubmit={form.canSubmit}
        submitLabel={submitLabel}
      />
    </>
  );
}
