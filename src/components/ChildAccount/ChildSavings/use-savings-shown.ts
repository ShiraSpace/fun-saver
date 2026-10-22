'use client';

import type { WalletSummary } from '@/lib/wallet/types';
import type { SavedTowardGoal } from '@/lib/goal/saved-toward-goal';
import type { SavingsWithoutAgorot } from '@/lib/wallet/wallet';
import {
  savedTowardGoalLessUncollectedInterest,
  savingsLessUncollectedInterest,
} from '@/lib/interest/collected-interest';
import { piggyBankFillOf } from './PiggyBank';
import type { InterestCoin } from './InterestCoins';
import { useInterestCoins } from './use-interest-coins';

export interface ChildSavingsProps {
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
  isGoalReached: boolean;
  piggyBankFill: number;
}

interface SavingsOnTheCard {
  savingsShown: SavingsShown;
  interestCoins: InterestCoin[];
  collect: (place: number) => void;
  land: (place: number) => void;
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
    isGoalReached: savedTowardGoalShown?.isGoalReached ?? false,
    piggyBankFill: piggyBankFillOf({
      savingsBalance: savingsShown.balance,
      savedTowardGoal: savedTowardGoalShown,
    }),
  };
}

export function useSavingsShown({
  accountId,
  savings,
  savedTowardGoal,
}: ChildSavingsProps): SavingsOnTheCard {
  const { interestCoins, interestNotLanded, collect, land } = useInterestCoins({
    savings,
    accountId,
  });

  return {
    savingsShown: savingsShownToTheChild({ savings, savedTowardGoal, interestNotLanded }),
    interestCoins,
    collect,
    land,
  };
}
