'use client';

import { JSX, useState } from 'react';
import type { AccountSummary } from '@/lib/account/types';
import { savingsFirst } from '@/lib/wallet/wallet';
import { savedTowardGoalOf } from '@/lib/goal/saved-toward-goal';
import { totalBalance } from '@/lib/wallet/balance';
import { Column, Screen } from '@/components/Screen';
import { Header } from '@/components/Header';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Celebration } from '@/components/Goal/Celebration';
import { useRefreshWithLoader } from '@/hooks/loader-context';
import { BalanceBreakdown } from './BalanceBreakdown';
import { WalletList } from './WalletList/WalletList';
import { TransactionDrawer } from './TransactionDrawer';
import { ACCOUNT_COPY, ACCOUNT_TEST_IDS } from './constants';

interface AccountProps {
  account: AccountSummary;
}

export function Account({ account }: AccountProps): JSX.Element {
  const wallets = savingsFirst(account.wallets);
  const savedTowardGoal = savedTowardGoalOf(account);
  const isGoalReached = savedTowardGoal?.reached;
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const refreshWithLoader = useRefreshWithLoader();
  const balancesShown = `${account.id}:${totalBalance(wallets)}`;

  const showNewBalances = (): void => {
    setIsDrawerOpen(false);
    refreshWithLoader();
  };

  return (
    <Screen align="top">
      <Column>
        <Header title={account.name} account={account} />
        <BalanceBreakdown key={balancesShown} wallets={wallets} />
        <WalletList key={account.id} wallets={wallets} savedTowardGoal={savedTowardGoal} />
        <PrimaryButton
          type="button"
          data-testid={ACCOUNT_TEST_IDS.newTransaction}
          onClick={() => setIsDrawerOpen(true)}
        >
          {ACCOUNT_COPY.newTransaction}
        </PrimaryButton>
      </Column>
      {isGoalReached && <Celebration key={account.id} />}
      {isDrawerOpen && (
        <TransactionDrawer
          account={account}
          savedTowardGoal={savedTowardGoal}
          onClose={() => setIsDrawerOpen(false)}
          onSaved={showNewBalances}
        />
      )}
    </Screen>
  );
}
