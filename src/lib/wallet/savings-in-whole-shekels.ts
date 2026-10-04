import { floorToShekels, shekelsToAgorot } from '@/lib/money';
import type { WalletSummary } from './types';

export interface SavingsInWholeShekels {
  balance: number;
  principal: number;
  interestEarned: number;
}

function withoutAgorot(amountAgorot: number): number {
  return shekelsToAgorot(floorToShekels(amountAgorot));
}

export function savingsInWholeShekels(
  savings: Pick<WalletSummary, 'balance' | 'interestEarned'>
): SavingsInWholeShekels {
  const balance = withoutAgorot(savings.balance);
  const interestEarned = Math.min(
    withoutAgorot(savings.interestEarned),
    balance
  );

  return {
    balance,
    principal: balance - interestEarned,
    interestEarned,
  };
}
