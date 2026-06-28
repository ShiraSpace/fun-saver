'use client';

import { JSX } from 'react';
import styled from '@emotion/styled';
import { ActionButton } from '@/components/ActionButton';
import type { AccountWithDerivedWallets } from '@/lib/types';
import { agorotToShekels } from '@/lib/money';
import { AGOROT_PER_SHEKEL } from '@/lib/constants';
import { Money } from '../../Money/Money';
import { MONEY_COPY } from '../../Money/constants';
import { AmountPad } from '../AmountPad';
import { WalletPicker } from '../WalletPicker';
import { useWithdrawForm } from '../use-withdraw-form';
import { DrawerTitle } from '../drawer-parts';
import { TRANSACTION_DRAWER_TEST_IDS } from '../constants';
import { WithdrawMessage } from './WithdrawMessage';
import { WITHDRAW_BODY_COPY, WITHDRAW_BODY_TEST_IDS } from './constants';

const AmountValue = styled.div<{ donation: boolean }>`
  text-align: center;
  font-size: ${({ theme }): number => theme.typography.display}px;
  font-weight: 700;
  color: ${({ theme, donation }): string =>
    donation ? theme.colors.gainText : theme.colors.withdrawText};
`;

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
  const balanceShekels = agorotToShekels(form.selectedBalance);

  const title = form.isDonation
    ? WITHDRAW_BODY_COPY.donationTitle
    : WITHDRAW_BODY_COPY.title;
  const confirmVerb = form.isDonation
    ? WITHDRAW_BODY_COPY.donationConfirm
    : WITHDRAW_BODY_COPY.confirm;
  const submitButtonText = form.isSubmitting
    ? WITHDRAW_BODY_COPY.submitting
    : `${confirmVerb} ${MONEY_COPY.currency}${form.amount}`;

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
        balanceShekels={balanceShekels}
      />
      <AmountPad
        onDigit={form.onDigit}
        onClear={form.onClear}
        onBackspace={form.onBackspace}
      />
      <ActionButton
        type="button"
        data-testid={TRANSACTION_DRAWER_TEST_IDS.confirm}
        disabled={!form.canSubmit}
        onClick={form.onConfirm}
      >
        {submitButtonText}
      </ActionButton>
    </>
  );
}
