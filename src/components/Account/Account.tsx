'use client';

import { JSX, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { AccountSummary } from '@/lib/account/types';
import { savingsFirst } from '@/lib/wallet/savings-first';
import { savedTowardGoalOf } from '@/lib/goal/saved-toward-goal';
import { totalBalance } from '@/lib/wallet/balance';
import { Column, Screen } from '@/components/Screen';
import { Header } from '@/components/Header';
import { PrimaryButton } from '@/components/PrimaryButton';
import { useRunWithLoader } from '@/hooks/loader-context';
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
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const router = useRouter();
  const runWithLoader = useRunWithLoader();
  const balancesShown = `${account.id}:${totalBalance(wallets)}`;

  const showNewBalances = (): void => {
    setIsDrawerOpen(false);
    runWithLoader(() => router.refresh());
  };

  return (
    <Screen align="top">
      <Column>
        <Header title={account.name} account={account} />
        <BalanceBreakdown key={balancesShown} wallets={wallets} />
        <WalletList wallets={wallets} savedTowardGoal={savedTowardGoal} />
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
          onSaved={showNewBalances}
        />
      )}
    </Screen>
  );
}
