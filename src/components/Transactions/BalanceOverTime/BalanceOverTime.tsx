'use client';

import { JSX } from 'react';
import {
  balanceOverRange,
  todaysTotalBalance,
  totalBalanceChange,
  type BalanceHistory,
} from '@/lib/wallet/balance-history';
import { ChoiceChips } from '../ChoiceChips';
import type { TransactionsViewChoices } from '../use-transactions-view-choices';
import { AllWalletsChip } from './AllWalletsChip';
import { BalanceChart } from './BalanceChart';
import { BalanceChips } from './BalanceChips';
import { TotalBalance } from './TotalBalance';
import {
  BALANCE_OVER_TIME_COPY,
  BALANCE_OVER_TIME_RANGE_GROUP_NAME,
  BALANCE_OVER_TIME_TEST_IDS,
  RANGE,
  RANGES,
} from './constants';
import { Card, RangeRow } from './BalanceOverTime.styles';

interface BalanceOverTimeProps {
  balanceHistory: BalanceHistory;
  viewChoices: TransactionsViewChoices;
}

export function BalanceOverTime({
  balanceHistory,
  viewChoices,
}: BalanceOverTimeProps): JSX.Element {
  const range = RANGE[viewChoices.range];
  const totalBalance = todaysTotalBalance(balanceHistory);
  const balanceChange = totalBalanceChange(balanceHistory, range.days);

  return (
    <Card data-testid={BALANCE_OVER_TIME_TEST_IDS.card}>
      <TotalBalance
        totalBalance={totalBalance}
        balanceChange={balanceChange}
        changeLabel={range.changeLabel}
      />
      <RangeRow>
        <ChoiceChips
          groupName={BALANCE_OVER_TIME_RANGE_GROUP_NAME}
          legend={BALANCE_OVER_TIME_COPY.rangeLegend}
          choices={RANGES}
          selected={range.id}
          onSelect={viewChoices.setRange}
          testId={BALANCE_OVER_TIME_TEST_IDS.ranges}
        />
        <AllWalletsChip
          allWalletsShown={viewChoices.allWalletsShown}
          onToggle={viewChoices.toggleAllWallets}
        />
      </RangeRow>
      <BalanceChart
        balanceHistory={balanceOverRange(balanceHistory, range.days)}
        shownBalances={viewChoices.shownBalances}
        rangeLabel={range.label}
      />
      <BalanceChips
        shownBalances={viewChoices.shownBalances}
        onToggle={viewChoices.toggleShownBalance}
      />
    </Card>
  );
}
