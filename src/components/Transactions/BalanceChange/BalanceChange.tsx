import { JSX } from 'react';
import { balanceChangeInShekels } from '@/lib/money';
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
  const shekels = balanceChangeInShekels(balanceChange);
  const sign =
    shekels < 0 ? BALANCE_CHANGE_COPY.fell : BALANCE_CHANGE_COPY.rose;
  const shekelsMoved = Math.abs(shekels);

  return (
    <Amount dir="ltr" data-testid={testId}>
      {sign}
      {MONEY_COPY.currencySign}
      {shekelsMoved}
    </Amount>
  );
}
