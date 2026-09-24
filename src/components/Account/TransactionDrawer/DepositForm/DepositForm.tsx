'use client';

import { JSX } from 'react';
import type { AccountWithDerivedWallets } from '@/lib/types';
import { MONEY_COPY } from '@/components/Money/constants';
import { DepositAmount } from '../DepositAmount';
import { DepositSplitPreview } from '../DepositSplitPreview';
import { AmountKeypadWithSubmit } from '../AmountKeypadWithSubmit';
import { useDepositForm } from '../use-deposit-form';
import { DrawerError, DrawerTitle } from '../drawer-parts';
import {
  TRANSACTION_DRAWER_COPY,
  TRANSACTION_DRAWER_TEST_IDS,
} from '../constants';

interface DepositFormProps {
  account: AccountWithDerivedWallets;
  onClose: () => void;
}

export function DepositForm({
  account,
  onClose,
}: DepositFormProps): JSX.Element {
  const form = useDepositForm(account.id, onClose);
  const submitLabel = form.isSubmitting
    ? TRANSACTION_DRAWER_COPY.submitting
    : `${TRANSACTION_DRAWER_COPY.submit} ${MONEY_COPY.currencySign}${form.amountShekels}`;

  return (
    <>
      <DrawerTitle>{TRANSACTION_DRAWER_COPY.title}</DrawerTitle>
      <DepositAmount amountShekels={form.amountShekels} />
      <DepositSplitPreview split={form.split} />
      {form.hasError && (
        <DrawerError data-testid={TRANSACTION_DRAWER_TEST_IDS.error}>
          {TRANSACTION_DRAWER_COPY.error}
        </DrawerError>
      )}
      <AmountKeypadWithSubmit
        entry={form}
        canSubmit={form.canSubmit}
        submitLabel={submitLabel}
      />
    </>
  );
}
