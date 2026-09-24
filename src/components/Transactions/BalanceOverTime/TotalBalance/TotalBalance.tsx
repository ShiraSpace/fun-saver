import { JSX } from 'react';
import { Money } from '@/components/Money';
import { BalanceChange } from '../../BalanceChange';
import { TOTAL_BALANCE_COPY, TOTAL_BALANCE_TEST_IDS } from './constants';
import {
  ChangeOverRange,
  Head,
  TotalBalanceAmount,
  TotalBalanceLabel,
} from './TotalBalance.styles';

interface TotalBalanceProps {
  totalBalance: number;
  balanceChange: number;
  changeLabel: string;
}

export function TotalBalance({
  totalBalance,
  balanceChange,
  changeLabel,
}: TotalBalanceProps): JSX.Element {
  return (
    <Head>
      <TotalBalanceLabel>{TOTAL_BALANCE_COPY.label}</TotalBalanceLabel>
      <TotalBalanceAmount>
        <Money
          amountAgorot={totalBalance}
          testId={TOTAL_BALANCE_TEST_IDS.totalBalance}
        />
      </TotalBalanceAmount>
      <ChangeOverRange
        data-balance-fell={balanceChange < 0}
        data-testid={TOTAL_BALANCE_TEST_IDS.changeOverRange}
      >
        <BalanceChange
          balanceChange={balanceChange}
          testId={TOTAL_BALANCE_TEST_IDS.balanceChange}
        />
        {changeLabel}
      </ChangeOverRange>
    </Head>
  );
}
