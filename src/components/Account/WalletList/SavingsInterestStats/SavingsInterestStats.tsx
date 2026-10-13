import { JSX } from 'react';
import type { WalletSummary } from '@/lib/wallet/types';
import { WALLET_NAMES } from '@/lib/wallet/constants';
import { savingsWithoutAgorot } from '@/lib/wallet/wallet';
import { InterestStats } from '../../WalletCard/InterestStats';

interface SavingsInterestStatsProps {
  wallet: WalletSummary;
}

export function SavingsInterestStats({ wallet }: SavingsInterestStatsProps): JSX.Element | null {
  if (wallet.name !== WALLET_NAMES.savings) {
    return null;
  }

  const { principal, interestEarned } = savingsWithoutAgorot(wallet);

  return (
    <InterestStats
      principal={principal}
      interestEarned={interestEarned}
      interestEarnedToday={wallet.interestEarnedToday}
    />
  );
}
