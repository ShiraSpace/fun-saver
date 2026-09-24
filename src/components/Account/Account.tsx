'use client';

import { JSX, useState } from 'react';
import type { AccountWithDerivedWallets } from '@/lib/types';
import { Column, Screen } from '@/components/Screen';
import { Header } from '@/components/Header';
import { PrimaryButton } from '@/components/PrimaryButton';
import { BalanceBreakdown } from './BalanceBreakdown';
import { WalletList } from './WalletList/WalletList';
import { TransactionDrawer } from './TransactionDrawer';
import { ACCOUNT_COPY, ACCOUNT_TEST_IDS } from './constants';

interface AccountProps {
  account: AccountWithDerivedWallets;
}

export function Account({ account }: AccountProps): JSX.Element {
  const { wallets } = account;
  const savings = wallets.find((wallet) => wallet.name === 'savings');
  const otherWallets = wallets.filter((wallet) => wallet.name !== 'savings');
  const savingsFirst = savings ? [savings, ...otherWallets] : otherWallets;
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <Screen align="top">
      <Column>
        <Header title={account.name} account={account} />
        <BalanceBreakdown key={account.id} wallets={savingsFirst} />
        <WalletList wallets={savingsFirst} />
        <PrimaryButton
          type="button"
          data-testid={ACCOUNT_TEST_IDS.newTransaction}
          onClick={() => setIsDrawerOpen(true)}
        >
          {ACCOUNT_COPY.newTransaction}
        </PrimaryButton>
      </Column>
      {isDrawerOpen && (
        <TransactionDrawer
          account={account}
          onClose={() => setIsDrawerOpen(false)}
        />
      )}
    </Screen>
  );
}
