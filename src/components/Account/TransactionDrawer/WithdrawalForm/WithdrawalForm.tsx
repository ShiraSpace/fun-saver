'use client';

import { JSX } from 'react';
import type { AccountWithDerivedWallets } from '@/lib/types';
import { agorotToShekels } from '@/lib/money';
import { AGOROT_PER_SHEKEL } from '@/lib/constants';
import { Money } from '@/components/Money';
import { WalletPicker } from '../WalletPicker';
import { AmountKeypadWithSubmit } from '../AmountKeypadWithSubmit';
import { useWithdrawalForm } from '../use-withdrawal-form';
import { DrawerTitle } from '../drawer-parts';
import { WithdrawalAlert } from './WithdrawalAlert';
import { withdrawalCopy } from './withdrawal-copy';
import { WITHDRAWAL_FORM_TEST_IDS } from './constants';
import { AmountValue } from './WithdrawalForm.styles';

interface WithdrawalFormProps {
  account: AccountWithDerivedWallets;
  onClose: () => void;
}

export function WithdrawalForm({
  account,
  onClose,
}: WithdrawalFormProps): JSX.Element {
  const wallets = account.wallets;
  const form = useWithdrawalForm(account.id, wallets, onClose);
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
        wallets={wallets}
        selectedId={form.selectedId}
        onSelect={form.onSelectWallet}
      />
      <WithdrawalAlert
        isOverdraft={form.isOverdraft}
        hasError={form.hasError}
        balanceShekels={agorotToShekels(form.selectedBalance)}
      />
      <AmountKeypadWithSubmit
        entry={form}
        canSubmit={form.canSubmit}
        submitLabel={submitLabel}
      />
    </>
  );
}
