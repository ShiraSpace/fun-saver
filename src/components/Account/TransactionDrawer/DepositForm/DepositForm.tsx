'use client';

import { JSX } from 'react';
import type { AccountSummary } from '@/lib/account/types';
import { REQUEST_STATE } from '@/lib/request-state';
import { MONEY_COPY } from '@/components/Money/constants';
import { DepositAmount } from '../DepositAmount';
import { DepositSplitPreview } from '../DepositSplitPreview';
import { AmountKeypadWithSubmit } from '../AmountKeypadWithSubmit';
import { useDepositForm } from '../use-deposit-form';
import { DrawerError, DrawerTitle, NoteLine } from '../drawer-parts';
import { TRANSACTION_DRAWER_COPY, TRANSACTION_DRAWER_TEST_IDS } from '../constants';

interface DepositFormProps {
  account: AccountSummary;
  onSaved: () => void;
}

export function DepositForm({ account, onSaved }: DepositFormProps): JSX.Element {
  const form = useDepositForm(account.id, onSaved);
  const isSaving = form.requestState === REQUEST_STATE.pending;
  const hasSaveFailed = form.requestState === REQUEST_STATE.failed;
  const submitLabel = isSaving
    ? TRANSACTION_DRAWER_COPY.submitting
    : `${TRANSACTION_DRAWER_COPY.submit} ${MONEY_COPY.currencySign}${form.amountShekels}`;
  const saveError = hasSaveFailed && (
    <DrawerError data-testid={TRANSACTION_DRAWER_TEST_IDS.error}>
      {TRANSACTION_DRAWER_COPY.error}
    </DrawerError>
  );

  return (
    <>
      <DrawerTitle>{TRANSACTION_DRAWER_COPY.title}</DrawerTitle>
      <DepositAmount amountShekels={form.amountShekels} />
      <DepositSplitPreview split={form.split} />
      <NoteLine>{saveError}</NoteLine>
      <AmountKeypadWithSubmit entry={form} canSubmit={form.canSubmit} submitLabel={submitLabel} />
    </>
  );
}
