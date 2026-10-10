'use client';

import { JSX } from 'react';
import { AGOROT_PER_SHEKEL } from '@/lib/constants';
import { Money } from '@/components/Money';
import { WalletPicker } from '../WalletPicker';
import { AmountKeypadWithSubmit } from '../AmountKeypadWithSubmit';
import {
  useWithdrawalForm,
  type WithdrawalFormProps,
} from '../use-withdrawal-form';
import { DrawerTitle } from '../drawer-parts';
import { LockedSavings } from './LockedSavings';
import { SelectedWalletNote } from './SelectedWalletNote';
import { withdrawalCopy } from './withdrawal-copy';
import { WITHDRAWAL_FORM_TEST_IDS } from './constants';
import { AmountValue } from './WithdrawalForm.styles';

export function WithdrawalForm(props: WithdrawalFormProps): JSX.Element {
  const form = useWithdrawalForm(props);
  const { title, submitLabel } = withdrawalCopy(form);
  const lockedSavingsPanel = form.savingsLockedFor && (
    <LockedSavings savedTowardGoal={form.savingsLockedFor} />
  );

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
        wallets={props.account.wallets}
        selectedWalletId={form.selectedWalletId}
        onSelect={form.onSelectWallet}
        savedTowardGoal={form.savedTowardGoal}
      />
      <SelectedWalletNote form={form} />
      <AmountKeypadWithSubmit
        entry={form}
        canSubmit={form.canSubmit}
        submitLabel={submitLabel}
        inPlaceOfKeypad={lockedSavingsPanel}
      />
    </>
  );
}
