import { JSX } from 'react';
import { agorotToShekels, balanceChangeInShekels } from '@/lib/money';
import { MONEY_COPY } from '@/components/Money/constants';
import { shekelsText } from '../money-text';
import { BALANCE_CHANGE_COPY } from './constants';
import { Amount } from './BalanceChange.styles';

interface BalanceChangeProps {
  balanceChange: number;
  testId: string;
  withAgorot?: boolean;
}

export function BalanceChange({
  balanceChange,
  testId,
  withAgorot = false,
}: BalanceChangeProps): JSX.Element {
  const shekels = withAgorot
    ? agorotToShekels(balanceChange)
    : balanceChangeInShekels(balanceChange);
  const sign =
    shekels < 0 ? BALANCE_CHANGE_COPY.fell : BALANCE_CHANGE_COPY.rose;
  const shekelsMoved = withAgorot
    ? shekelsText(Math.abs(balanceChange), withAgorot)
    : Math.abs(shekels);

  return (
    <Amount dir="ltr" data-testid={testId}>
      {sign}
      {MONEY_COPY.currencySign}
      {shekelsMoved}
    </Amount>
  );
}
