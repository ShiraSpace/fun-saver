import { JSX } from 'react';
import type { WalletWithDerived } from '@/lib/types';
import { StatStrip } from '../../WalletCard/StatStrip';

interface SavingsStatStripProps {
  wallet: WalletWithDerived;
}

export function SavingsStatStrip({
  wallet,
}: SavingsStatStripProps): JSX.Element | null {
  if (wallet.name !== 'savings') {
    return null;
  }

  return (
    <StatStrip
      principal={wallet.principal}
      interestGain={wallet.interestGain}
      todayInterest={wallet.todayInterest}
    />
  );
}
