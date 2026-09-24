import { JSX } from 'react';
import type { WalletWithDerived } from '@/lib/types';
import { InterestStats } from '../../WalletCard/InterestStats';

interface SavingsInterestStatsProps {
  wallet: WalletWithDerived;
}

export function SavingsInterestStats({
  wallet,
}: SavingsInterestStatsProps): JSX.Element | null {
  if (wallet.name !== 'savings') {
    return null;
  }

  return (
    <InterestStats
      principal={wallet.principal}
      interestGain={wallet.interestGain}
      todayInterest={wallet.todayInterest}
    />
  );
}
