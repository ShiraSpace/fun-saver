import { withoutAgorot } from '@/lib/money';
import type { WalletSummary } from './types';

export interface SavingsWithoutAgorot {
  balance: number;
  principal: number;
  interestEarned: number;
}

export function savingsWithoutAgorot(
  savings: Pick<WalletSummary, 'balance' | 'interestEarned'>
): SavingsWithoutAgorot {
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
