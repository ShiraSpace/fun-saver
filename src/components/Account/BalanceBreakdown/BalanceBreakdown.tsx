'use client';

import { JSX } from 'react';
import type { WalletSummary } from '@/lib/types';
import { totalBalance, walletShares } from '@/lib/wallet-totals';
import { agorotToWholeShekels } from '@/lib/money';
import { Money } from '@/components/Money';
import { Donut } from './Donut';
import { useCountUpTotalBalance } from './use-count-up-total-balance';
import { Legend } from './Legend';
import {
  BALANCE_BREAKDOWN_COPY,
  BALANCE_BREAKDOWN_STYLE,
  BALANCE_BREAKDOWN_TEST_IDS,
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
    (BALANCE_BREAKDOWN_STYLE.totalAmountSize *
      BALANCE_BREAKDOWN_STYLE.totalMaxDigits) /
      digits
  );
}

type BalanceBreakdownWallet = Pick<
  WalletSummary,
  'id' | 'name' | 'icon' | 'balance'
>;

interface BalanceBreakdownProps {
  wallets: BalanceBreakdownWallet[];
}

export function BalanceBreakdown({
  wallets,
}: BalanceBreakdownProps): JSX.Element {
  const shares = walletShares(wallets.map((wallet) => wallet.balance));
  const walletsWithShare = wallets.map((wallet, index) => ({
    ...wallet,
    share: shares[index],
  }));
  const totalBalanceAgorot = totalBalance(wallets);
  const countingTotalBalance = useCountUpTotalBalance(totalBalanceAgorot);

  return (
    <Card data-testid={BALANCE_BREAKDOWN_TEST_IDS.card}>
      <Ring>
        <Donut segments={walletsWithShare} />
        <TotalBalance>
          <TotalBalanceLabel>
            {BALANCE_BREAKDOWN_COPY.totalLabel}
          </TotalBalanceLabel>
          <TotalBalanceAmount
            fontSize={totalBalanceFontSize(totalBalanceAgorot)}
          >
            <Money
              amountAgorot={countingTotalBalance}
              testId={BALANCE_BREAKDOWN_TEST_IDS.total}
            />
          </TotalBalanceAmount>
        </TotalBalance>
      </Ring>
      <Legend wallets={walletsWithShare} />
    </Card>
  );
}
