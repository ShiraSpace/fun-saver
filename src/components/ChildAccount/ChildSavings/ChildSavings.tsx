'use client';

import { JSX, useRef } from 'react';
import type { WalletSummary } from '@/lib/wallet/types';
import type { SavedTowardGoal } from '@/lib/goal/saved-toward-goal';
import type { SavingsWithoutAgorot } from '@/lib/wallet/wallet';
import {
  savedTowardGoalLessUncollectedInterest,
  savingsLessUncollectedInterest,
} from '@/lib/interest/collected-interest';
import { GoalProgress } from '@/components/Goal/GoalProgress';
import { GOAL_PROGRESS_SIZE } from '@/components/Goal/GoalProgress/constants';
import { Celebration } from '@/components/Goal/Celebration';
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
  savings: WalletSummary;
  savedTowardGoal?: SavedTowardGoal;
  uncollectedInterest: number;
}

interface SavingsShown extends SavingsWithoutAgorot {
  savedTowardGoal?: SavedTowardGoal;
  piggyBankFill: number;
}

function savingsShownToTheChild({
  savings,
  savedTowardGoal,
  uncollectedInterest,
}: SavingsShownParams): SavingsShown {
  const savingsShown = savingsLessUncollectedInterest({ savings, uncollectedInterest });
  const savedTowardGoalShown = savedTowardGoalLessUncollectedInterest({
    savedTowardGoal,
    uncollectedInterest,
  });

  return {
    ...savingsShown,
    savedTowardGoal: savedTowardGoalShown,
    piggyBankFill: piggyBankFillOf({
      savingsBalance: savingsShown.balance,
      savedTowardGoal: savedTowardGoalShown,
    }),
  };
}

function goalProgressOf(savedTowardGoal?: SavedTowardGoal): JSX.Element | undefined {
  if (!savedTowardGoal) {
    return;
  }

  return (
    <GoalSpace>
      <GoalProgress
        savedTowardGoal={savedTowardGoal}
        size={GOAL_PROGRESS_SIZE.large}
        glowWhenReached
        celebratesWhenReached
      />
    </GoalSpace>
  );
}

export function ChildSavings({
  accountId,
  savings,
  savedTowardGoal,
}: ChildSavingsProps): JSX.Element {
  const balanceElement = useRef<HTMLDivElement>(null);
  const { interestCoins, uncollectedInterest, collect } = useInterestCoins({ savings, accountId });
  const savingsShown = savingsShownToTheChild({ savings, savedTowardGoal, uncollectedInterest });
  const isGoalReached = !!savingsShown.savedTowardGoal?.isGoalReached;

  return (
    <Card
      aria-label={CHILD_SAVINGS_COPY.title}
      data-testid={CHILD_SAVINGS_TEST_IDS.card}
      celebrating={isGoalReached}
    >
      <InterestCoins
        interestCoins={interestCoins}
        onCollect={collect}
        whereFocusGoesLast={balanceElement}
      />
      <PiggyBankSpace>
        <PiggyBank piggyBankFill={savingsShown.piggyBankFill} />
      </PiggyBankSpace>
      <SavingsBalance balance={savingsShown.balance} ref={balanceElement} />
      {goalProgressOf(savingsShown.savedTowardGoal)}
      <PrincipalAndInterest
        principal={savingsShown.principal}
        interestEarned={savingsShown.interestEarned}
      />
      {isGoalReached && <Celebration />}
    </Card>
  );
}
