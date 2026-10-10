'use client';

import { JSX } from 'react';
import type { AccountSummary } from '@/lib/account/types';
import { AGOROT_PER_SHEKEL } from '@/lib/constants';
import { Money } from '@/components/Money';
import { WalletPicker } from '../WalletPicker';
import { AmountKeypadWithSubmit } from '../AmountKeypadWithSubmit';
import { useWithdrawalForm } from '../use-withdrawal-form';
import { DrawerTitle } from '../drawer-parts';
import { LockedSavings } from './LockedSavings';
import { SelectedWalletNote } from './SelectedWalletNote';
import { withdrawalCopy } from './withdrawal-copy';
import { WITHDRAWAL_FORM_TEST_IDS } from './constants';
import { AmountValue } from './WithdrawalForm.styles';

interface WithdrawalFormProps {
  account: AccountSummary;
  onClose: () => void;
}

export function WithdrawalForm({
  account,
  onClose,
}: WithdrawalFormProps): JSX.Element {
  const form = useWithdrawalForm(account, onClose);
  const { title, submitLabel } = withdrawalCopy(form);

  return (
    <>
      <DrawerTitle>{title}</DrawerTitle>
      <AmountValue isDonation={form.isDonation}>
        <Money
          amountAgorot={form.amountShekels * AGOROT_PER_SHEKEL}
          testId={WITHDRAWAL_FORM_TEST_IDS.amount}
        />
      </AmountValue>
      <WalletPicker
        wallets={account.wallets}
        selectedWalletId={form.selectedWalletId}
        onSelect={form.onSelectWallet}
        savedTowardGoal={form.savedTowardGoal}
      />
      <SelectedWalletNote form={form} />
      <AmountKeypadWithSubmit
        entry={form}
        canSubmit={form.canSubmit}
        submitLabel={submitLabel}
        inPlaceOfKeypad={
          form.savingsLockedFor && (
            <LockedSavings savedTowardGoal={form.savingsLockedFor} />
          )
        }
      />
    </>
  );
}
