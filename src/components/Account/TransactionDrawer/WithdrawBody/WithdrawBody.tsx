'use client';

import { JSX } from 'react';
import type { AccountWithDerivedWallets } from '@/lib/types';
import { agorotToShekels } from '@/lib/money';
import { AGOROT_PER_SHEKEL } from '@/lib/constants';
import { Money } from '@/components/Money';
import { WalletPicker } from '../WalletPicker';
import { PadAndConfirm } from '../PadAndConfirm';
import { useWithdrawForm } from '../use-withdraw-form';
import { DrawerTitle } from '../drawer-parts';
import { WithdrawMessage } from './WithdrawMessage';
import { withdrawCopy } from './withdraw-copy';
import { WITHDRAW_BODY_TEST_IDS } from './constants';
import { AmountValue } from './WithdrawBody.styles';

interface WithdrawBodyProps {
  account: AccountWithDerivedWallets;
  onClose: () => void;
}

export function WithdrawBody({
  account,
  onClose,
}: WithdrawBodyProps): JSX.Element {
  const wallets = account.wallets;
  const form = useWithdrawForm(account.id, wallets, onClose);
  const { title, submitLabel } = withdrawCopy(form);

  return (
    <>
      <DrawerTitle>{title}</DrawerTitle>
      <AmountValue donation={form.isDonation}>
        <Money
          amountAgorot={form.amount * AGOROT_PER_SHEKEL}
          testId={WITHDRAW_BODY_TEST_IDS.amount}
        />
      </AmountValue>
      <WalletPicker
        wallets={wallets}
        selectedId={form.selectedId}
        onSelect={form.onSelectWallet}
      />
      <WithdrawMessage
        isOverdraft={form.isOverdraft}
        hasError={form.hasError}
        balanceShekels={agorotToShekels(form.selectedBalance)}
      />
      <PadAndConfirm
        form={form}
        canSubmit={form.canSubmit}
        submitLabel={submitLabel}
      />
    </>
  );
}
