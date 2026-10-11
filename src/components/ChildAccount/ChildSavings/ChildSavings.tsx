'use client';

import { JSX } from 'react';
import type { WalletSummary } from '@/lib/wallet/types';
import type { SavedTowardGoal } from '@/lib/goal/saved-toward-goal';
import { PIGGY_BANK_FULL_AT } from '@/lib/wallet/constants';
import { savingsWithoutAgorot } from '@/lib/wallet/wallet';
import { Money } from '@/components/Money';
import { PIGGY_BANK_FILL, PiggyBank, piggyBankFill } from './PiggyBank';
import { PrincipalAndInterest } from './PrincipalAndInterest';
import { CHILD_SAVINGS_COPY, CHILD_SAVINGS_TEST_IDS } from './constants';
import { Card, PiggyBankSpace, Total } from './ChildSavings.styles';

interface ChildSavingsProps {
  savings: WalletSummary;
  savedTowardGoal?: SavedTowardGoal;
}

export function ChildSavings({ savings, savedTowardGoal }: ChildSavingsProps): JSX.Element {
  const { balance, principal, interestEarned } = savingsWithoutAgorot(savings);
  const fullAt = savedTowardGoal?.goal.amount ?? PIGGY_BANK_FULL_AT;
  const fill = savedTowardGoal?.reached
    ? PIGGY_BANK_FILL.full
    : piggyBankFill({ savingsBalance: balance, fullAt });

  return (
    <Card aria-label={CHILD_SAVINGS_COPY.title} data-testid={CHILD_SAVINGS_TEST_IDS.card}>
      <PiggyBankSpace>
        <PiggyBank fill={fill} />
      </PiggyBankSpace>
      <Total>
        <Money amountAgorot={balance} testId={CHILD_SAVINGS_TEST_IDS.balance} />
      </Total>
      <PrincipalAndInterest principal={principal} interestEarned={interestEarned} />
    </Card>
  );
}
