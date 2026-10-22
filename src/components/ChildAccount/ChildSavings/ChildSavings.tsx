'use client';

import { JSX, useRef } from 'react';
import type { SavedTowardGoal } from '@/lib/goal/saved-toward-goal';
import { GoalProgress } from '@/components/Goal/GoalProgress';
import { GOAL_PROGRESS_SIZE } from '@/components/Goal/GoalProgress/constants';
import { Celebration } from '@/components/Goal/Celebration';
import { PiggyBankAndCoins } from './PiggyBankAndCoins';
import { PrincipalAndInterest } from './PrincipalAndInterest';
import { SavingsBalance } from './SavingsBalance';
import { type ChildSavingsProps, useSavingsShown } from './use-savings-shown';
import { useGoalReachedOnceTheCoinsSettle } from './use-goal-reached-once-the-coins-settle';
import { CHILD_SAVINGS_COPY, CHILD_SAVINGS_TEST_IDS } from './constants';
import { Card, GoalSpace } from './ChildSavings.styles';

function goalProgressOf(
  savedTowardGoal: SavedTowardGoal | undefined,
  isGoalReached: boolean
): JSX.Element | undefined {
  if (!savedTowardGoal) {
    return;
  }

  return (
    <GoalSpace>
      <GoalProgress
        savedTowardGoal={{ ...savedTowardGoal, isGoalReached }}
        size={GOAL_PROGRESS_SIZE.large}
        glowWhenReached
        celebratesWhenReached
      />
    </GoalSpace>
  );
}

export function ChildSavings(childSavingsProps: ChildSavingsProps): JSX.Element {
  const balanceElement = useRef<HTMLDivElement>(null);
  const { savingsShown, interestCoins, collect, land } = useSavingsShown(childSavingsProps);
  const isGoalReached = useGoalReachedOnceTheCoinsSettle({
    isGoalReached: savingsShown.isGoalReached,
    interestCoins,
  });
  const goalProgress = goalProgressOf(savingsShown.savedTowardGoal, isGoalReached);
  const celebration = isGoalReached && <Celebration />;

  return (
    <Card
      aria-label={CHILD_SAVINGS_COPY.title}
      data-testid={CHILD_SAVINGS_TEST_IDS.card}
      celebrating={isGoalReached}
    >
      <PiggyBankAndCoins
        interestCoins={interestCoins}
        piggyBankFill={savingsShown.piggyBankFill}
        isGoalReached={isGoalReached}
        onCollect={collect}
        onLand={land}
        whereFocusGoesLast={balanceElement}
      />
      <SavingsBalance
        balance={savingsShown.balance}
        celebrating={isGoalReached}
        ref={balanceElement}
      />
      {goalProgress}
      <PrincipalAndInterest
        principal={savingsShown.principal}
        interestEarned={savingsShown.interestEarned}
      />
      {celebration}
    </Card>
  );
}
