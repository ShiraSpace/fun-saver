'use client';

import { JSX, useState } from 'react';
import type { AccountSummary } from '@/lib/account/types';
import { walletNamed } from '@/lib/wallet/wallet-named';
import { WALLET_NAMES } from '@/lib/wallet/constants';
import { savedTowardGoalOf } from '@/lib/goal/saved-toward-goal';
import { Column, Screen } from '@/components/Screen';
import { Header } from '@/components/Header';
import { PrimaryButton } from '@/components/PrimaryButton';
import { BalanceBreakdown } from './BalanceBreakdown';
import { WalletList } from './WalletList/WalletList';
import { TransactionDrawer } from './TransactionDrawer';
import { ACCOUNT_COPY, ACCOUNT_TEST_IDS } from './constants';

interface AccountProps {
  account: AccountSummary;
}

export function Account({ account }: AccountProps): JSX.Element {
  const { wallets } = account;
  const savings = walletNamed(wallets, WALLET_NAMES.savings);
  const otherWallets = wallets.filter(
    (wallet) => wallet.name !== WALLET_NAMES.savings
  );
  const savingsFirst = savings ? [savings, ...otherWallets] : otherWallets;
  const savedTowardGoal = savedTowardGoalOf(account);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <Screen align="top">
      <Column>
        <Header title={account.name} account={account} />
        <BalanceBreakdown key={account.id} wallets={savingsFirst} />
        <WalletList wallets={savingsFirst} savedTowardGoal={savedTowardGoal} />
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
          savedTowardGoal={savedTowardGoal}
          onClose={() => setIsDrawerOpen(false)}
        />
      )}
    </Screen>
  );
}
