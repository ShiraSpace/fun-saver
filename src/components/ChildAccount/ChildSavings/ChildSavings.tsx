'use client';

import { JSX } from 'react';
import type { WalletSummary } from '@/lib/wallet/types';
import type { SavedTowardGoal } from '@/lib/goal/saved-toward-goal';
import { savingsWithoutAgorot } from '@/lib/wallet/wallet';
import { Money } from '@/components/Money';
import { GoalProgress } from '@/components/Goal/GoalProgress';
import { GOAL_PROGRESS_SIZE } from '@/components/Goal/GoalProgress/constants';
import { PiggyBank, piggyBankFillOf } from './PiggyBank';
import { PrincipalAndInterest } from './PrincipalAndInterest';
import { CHILD_SAVINGS_COPY, CHILD_SAVINGS_TEST_IDS } from './constants';
import { Card, GoalSpace, PiggyBankSpace, Total } from './ChildSavings.styles';

interface ChildSavingsProps {
  savings: WalletSummary;
  savedTowardGoal?: SavedTowardGoal;
}

export function ChildSavings({ savings, savedTowardGoal }: ChildSavingsProps): JSX.Element {
  const { balance, principal, interestEarned } = savingsWithoutAgorot(savings);
  const piggyBankFill = piggyBankFillOf({ savingsBalance: balance, savedTowardGoal });

  return (
    <Card aria-label={CHILD_SAVINGS_COPY.title} data-testid={CHILD_SAVINGS_TEST_IDS.card}>
      <PiggyBankSpace>
        <PiggyBank piggyBankFill={piggyBankFill} />
      </PiggyBankSpace>
      <Total>
        <Money amountAgorot={balance} testId={CHILD_SAVINGS_TEST_IDS.balance} />
      </Total>
      {savedTowardGoal && (
        <GoalSpace>
          <GoalProgress
            savedTowardGoal={savedTowardGoal}
            size={GOAL_PROGRESS_SIZE.large}
            glowWhenReached
          />
        </GoalSpace>
      )}
      <PrincipalAndInterest principal={principal} interestEarned={interestEarned} />
    </Card>
  );
}
