import { JSX } from 'react';
import type { WalletSummary } from '@/lib/wallet/types';
import { WALLET_NAMES } from '@/lib/wallet/constants';
import { InterestStats } from '../../WalletCard/InterestStats';

interface SavingsInterestStatsProps {
  wallet: WalletSummary;
}

export function SavingsInterestStats({
  wallet,
}: SavingsInterestStatsProps): JSX.Element | null {
  if (wallet.name !== WALLET_NAMES.savings) {
    return null;
  }

  return (
    <InterestStats
      principal={wallet.principal}
      interestEarned={wallet.interestEarned}
      interestEarnedToday={wallet.interestEarnedToday}
    />
  );
}
