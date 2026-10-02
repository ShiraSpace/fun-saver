import { floorToShekels } from '@/lib/money';
import type { WalletSummary } from './types';

export interface SavingsInWholeShekels {
  balanceShekels: number;
  principalShekels: number;
  interestEarnedShekels: number;
}

export function savingsInWholeShekels(
  savings: Pick<WalletSummary, 'balance' | 'interestEarned'>
): SavingsInWholeShekels {
  const balanceShekels = floorToShekels(savings.balance);
  const interestEarnedShekels = Math.min(
    floorToShekels(savings.interestEarned),
    balanceShekels
  );

  return {
    balanceShekels,
    principalShekels: balanceShekels - interestEarnedShekels,
    interestEarnedShekels,
  };
}
