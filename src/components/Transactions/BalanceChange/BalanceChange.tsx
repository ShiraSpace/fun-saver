import { JSX } from 'react';
import { MONEY_COPY, MONEY_ROUNDING, type MoneyRounding } from '@/components/Money/constants';
import { shekelsText } from '@/components/Money/money-text';
import { BALANCE_CHANGE_COPY } from './constants';
import { Amount } from './BalanceChange.styles';

interface BalanceChangeProps {
  balanceChange: number;
  testId: string;
  rounding?: MoneyRounding;
}

export function BalanceChange({
  balanceChange,
  testId,
  rounding = MONEY_ROUNDING.floorToTenths,
}: BalanceChangeProps): JSX.Element {
  const sign = balanceChange < 0 ? BALANCE_CHANGE_COPY.fell : BALANCE_CHANGE_COPY.rose;
  const shekelsMoved = shekelsText(Math.abs(balanceChange), rounding);

  return (
    <Amount dir="ltr" data-testid={testId}>
      {sign}
      {MONEY_COPY.currencySign}
      {shekelsMoved}
    </Amount>
  );
}
