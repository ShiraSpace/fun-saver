'use client';

import { JSX } from 'react';
import type { WalletSummary } from '@/lib/wallet/types';
import {
  savedTowardGoalIn,
  type SavedTowardGoal,
} from '@/lib/goal/saved-toward-goal';
import { WalletCard } from '../WalletCard/WalletCard';
import { GoalProgress } from '../WalletCard/GoalProgress';
import { SavingsInterestStats } from './SavingsInterestStats';
import { WALLET_LIST_COPY, WALLET_LIST_TEST_IDS } from './constants';
import { List, Label } from './WalletList.styles';

interface WalletListProps {
  wallets: WalletSummary[];
  savedTowardGoal?: SavedTowardGoal;
}

export function WalletList({
  wallets,
  savedTowardGoal,
}: WalletListProps): JSX.Element {
  const cards = wallets.map((wallet) => {
    const savingsTowardGoal = savedTowardGoalIn(wallet, savedTowardGoal);

    return (
      <WalletCard
        key={wallet.id}
        wallet={wallet}
        savedTowardGoal={savingsTowardGoal}
      >
        <SavingsInterestStats wallet={wallet} />
        {savingsTowardGoal && (
          <GoalProgress savedTowardGoal={savingsTowardGoal} />
        )}
      </WalletCard>
    );
  });

  return (
    <List>
      <Label data-testid={WALLET_LIST_TEST_IDS.label}>
        {WALLET_LIST_COPY.label}
      </Label>
      {cards}
    </List>
  );
}
