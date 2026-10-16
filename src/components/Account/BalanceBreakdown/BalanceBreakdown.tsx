'use client';

import { JSX } from 'react';
import type { WalletSummary } from '@/lib/wallet/types';
import { totalBalance, walletShares } from '@/lib/wallet/balance';
import { walletsWithoutAgorot } from '@/lib/wallet/wallet';
import { agorotToWholeShekels } from '@/lib/money';
import { Money } from '@/components/Money';
import { useCountUp } from '@/hooks/use-count-up';
import { Donut } from './Donut';
import { Legend } from './Legend';
import {
  BALANCE_BREAKDOWN_COPY,
  BALANCE_BREAKDOWN_STYLE,
  BALANCE_BREAKDOWN_TEST_IDS,
  TOTAL_ANIMATION,
} from './constants';
import {
  Card,
  TotalBalance,
  TotalBalanceAmount,
  TotalBalanceLabel,
  Ring,
} from './BalanceBreakdown.styles';

function totalBalanceFontSize(totalBalanceAgorot: number): number {
  const digits = String(agorotToWholeShekels(totalBalanceAgorot)).length;

  if (digits <= BALANCE_BREAKDOWN_STYLE.totalMaxDigits) {
    return BALANCE_BREAKDOWN_STYLE.totalAmountSize;
  }

  return Math.floor(
    (BALANCE_BREAKDOWN_STYLE.totalAmountSize * BALANCE_BREAKDOWN_STYLE.totalMaxDigits) / digits
  );
}

type BalanceBreakdownWallet = Pick<WalletSummary, 'id' | 'name' | 'icon' | 'balance'>;

interface BalanceBreakdownProps {
  wallets: BalanceBreakdownWallet[];
}

export function BalanceBreakdown({ wallets }: BalanceBreakdownProps): JSX.Element {
  const shownWallets = walletsWithoutAgorot(wallets);
  const shares = walletShares(shownWallets.map((wallet) => wallet.balance));
  const walletsWithShare = shownWallets.map((wallet, index) => ({
    ...wallet,
    share: shares[index],
  }));
  const totalBalanceAgorot = totalBalance(shownWallets);
  const countingTotalBalance = useCountUp({
    startAt: 0,
    to: totalBalanceAgorot,
    timing: TOTAL_ANIMATION,
  });

  return (
    <Card data-testid={BALANCE_BREAKDOWN_TEST_IDS.card}>
      <Ring>
        <Donut segments={walletsWithShare} />
        <TotalBalance>
          <TotalBalanceLabel>{BALANCE_BREAKDOWN_COPY.totalLabel}</TotalBalanceLabel>
          <TotalBalanceAmount fontSize={totalBalanceFontSize(totalBalanceAgorot)}>
            <Money amountAgorot={countingTotalBalance} testId={BALANCE_BREAKDOWN_TEST_IDS.total} />
          </TotalBalanceAmount>
        </TotalBalance>
      </Ring>
      <Legend wallets={walletsWithShare} />
    </Card>
  );
}
