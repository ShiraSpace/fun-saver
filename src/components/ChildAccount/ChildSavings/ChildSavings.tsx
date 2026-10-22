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
import { piggyBankFillOf } from './PiggyBank';
import { PiggyBankAndCoins } from './PiggyBankAndCoins';
import { PrincipalAndInterest } from './PrincipalAndInterest';
import { SavingsBalance } from './SavingsBalance';
import { useInterestCoins } from './use-interest-coins';
import { CHILD_SAVINGS_COPY, CHILD_SAVINGS_TEST_IDS } from './constants';
import { Card, GoalSpace } from './ChildSavings.styles';

interface ChildSavingsProps {
  accountId: string;
  savings: WalletSummary;
  savedTowardGoal?: SavedTowardGoal;
}

interface SavingsShownParams {
  savings: WalletSummary;
  savedTowardGoal?: SavedTowardGoal;
  interestNotLanded: number;
}

interface SavingsShown extends SavingsWithoutAgorot {
  savedTowardGoal?: SavedTowardGoal;
  piggyBankFill: number;
}

function savingsShownToTheChild({
  savings,
  savedTowardGoal,
  interestNotLanded,
}: SavingsShownParams): SavingsShown {
  const savingsShown = savingsLessUncollectedInterest({
    savings,
    uncollectedInterest: interestNotLanded,
  });
  const savedTowardGoalShown = savedTowardGoalLessUncollectedInterest({
    savedTowardGoal,
    uncollectedInterest: interestNotLanded,
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

export function ChildSavings({
  accountId,
  savings,
  savedTowardGoal,
}: ChildSavingsProps): JSX.Element {
  const balanceElement = useRef<HTMLDivElement>(null);
  const { interestCoins, interestNotLanded, collect, land } = useInterestCoins({
    savings,
    accountId,
  });
  const savingsShown = savingsShownToTheChild({ savings, savedTowardGoal, interestNotLanded });
  const goalProgress = savingsShown.savedTowardGoal && (
    <GoalSpace>
      <GoalProgress
        savedTowardGoal={savingsShown.savedTowardGoal}
        size={GOAL_PROGRESS_SIZE.large}
        glowWhenReached
      />
    </GoalSpace>
  );

  return (
    <Card aria-label={CHILD_SAVINGS_COPY.title} data-testid={CHILD_SAVINGS_TEST_IDS.card}>
      <PiggyBankAndCoins
        interestCoins={interestCoins}
        piggyBankFill={savingsShown.piggyBankFill}
        onCollect={collect}
        onLand={land}
        whereFocusGoesLast={balanceElement}
      />
      <SavingsBalance balance={savingsShown.balance} ref={balanceElement} />
      {goalProgress}
      <PrincipalAndInterest
        principal={savingsShown.principal}
        interestEarned={savingsShown.interestEarned}
      />
    </Card>
  );
}
