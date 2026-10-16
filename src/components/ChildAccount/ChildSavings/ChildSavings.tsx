'use client';

import { JSX, useRef } from 'react';
import type { WalletSummary } from '@/lib/wallet/types';
import { savedTowardGoalOf, type SavedTowardGoal } from '@/lib/goal/saved-toward-goal';
import { savingsWithoutAgorot, type SavingsWithoutAgorot } from '@/lib/wallet/wallet';
import { GoalProgress } from '@/components/Goal/GoalProgress';
import { GOAL_PROGRESS_SIZE } from '@/components/Goal/GoalProgress/constants';
import { PiggyBank, piggyBankFillOf } from './PiggyBank';
import { PrincipalAndInterest } from './PrincipalAndInterest';
import { SavingsBalance } from './SavingsBalance';
import { InterestCoins } from './InterestCoins';
import { useInterestCoins } from './use-interest-coins';
import { CHILD_SAVINGS_COPY, CHILD_SAVINGS_TEST_IDS } from './constants';
import { Card, GoalSpace, PiggyBankSpace } from './ChildSavings.styles';

interface ChildSavingsProps {
  accountId: string;
  savings: WalletSummary;
  savedTowardGoal?: SavedTowardGoal;
}

interface SavingsShownParams {
  savedTowardGoal?: SavedTowardGoal;
  savingsAtCollectedInterest: WalletSummary;
}

interface SavingsShown extends SavingsWithoutAgorot {
  savedTowardGoal?: SavedTowardGoal;
  piggyBankFill: number;
}

function savedTowardGoalAtCollectedInterest({
  savedTowardGoal,
  savingsAtCollectedInterest,
}: SavingsShownParams): SavedTowardGoal | undefined {
  if (!savedTowardGoal || savedTowardGoal.isGoalReached) {
    return savedTowardGoal;
  }

  return savedTowardGoalOf({ goal: savedTowardGoal.goal, wallets: [savingsAtCollectedInterest] });
}

function savingsShownToTheChild(params: SavingsShownParams): SavingsShown {
  const savingsWithoutAgorotShown = savingsWithoutAgorot(params.savingsAtCollectedInterest);
  const savedTowardGoal = savedTowardGoalAtCollectedInterest(params);

  return {
    ...savingsWithoutAgorotShown,
    savedTowardGoal,
    piggyBankFill: piggyBankFillOf({
      savingsBalance: savingsWithoutAgorotShown.balance,
      savedTowardGoal,
    }),
  };
}

export function ChildSavings({
  accountId,
  savings,
  savedTowardGoal,
}: ChildSavingsProps): JSX.Element {
  const balanceElement = useRef<HTMLDivElement>(null);
  const { interestCoins, savingsAtCollectedInterest, collect } = useInterestCoins({
    savings,
    accountId,
  });
  const shown = savingsShownToTheChild({ savedTowardGoal, savingsAtCollectedInterest });
  const goalProgress = shown.savedTowardGoal && (
    <GoalSpace>
      <GoalProgress
        savedTowardGoal={shown.savedTowardGoal}
        size={GOAL_PROGRESS_SIZE.large}
        glowWhenReached
      />
    </GoalSpace>
  );

  return (
    <Card aria-label={CHILD_SAVINGS_COPY.title} data-testid={CHILD_SAVINGS_TEST_IDS.card}>
      <InterestCoins
        interestCoins={interestCoins}
        onCollect={collect}
        whereFocusGoesLast={balanceElement}
      />
      <PiggyBankSpace>
        <PiggyBank piggyBankFill={shown.piggyBankFill} />
      </PiggyBankSpace>
      <SavingsBalance balance={shown.balance} ref={balanceElement} />
      {goalProgress}
      <PrincipalAndInterest principal={shown.principal} interestEarned={shown.interestEarned} />
    </Card>
  );
}
