import { JSX } from 'react';
import { agorotToWholeShekels } from '@/lib/money';
import { MONEY_COPY } from '@/components/Money/constants';
import { BALANCE_CHANGE_COPY } from './constants';
import { Amount } from './BalanceChange.styles';

interface BalanceChangeProps {
  balanceChange: number;
  testId: string;
}

export function BalanceChange({
  balanceChange,
  testId,
}: BalanceChangeProps): JSX.Element {
  const sign =
    balanceChange < 0 ? BALANCE_CHANGE_COPY.fell : BALANCE_CHANGE_COPY.rose;

  return (
    <Amount dir="ltr" data-testid={testId}>
      {sign}
      {MONEY_COPY.currencySign}
      {agorotToWholeShekels(Math.abs(balanceChange))}
    </Amount>
  );
}
