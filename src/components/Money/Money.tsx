'use client';

import { JSX } from 'react';
import { agorotToWholeShekels, halfShekelAmount } from '@/lib/money';
import { MONEY_COPY } from './constants';
import { Amount, Currency, Number } from './Money.styles';

interface MoneyProps {
  amountAgorot: number;
  testId: string;
  allowHalf?: boolean;
}

export function Money({
  amountAgorot,
  testId,
  allowHalf = false,
}: MoneyProps): JSX.Element {
  const shekels = allowHalf
    ? (halfShekelAmount(amountAgorot) ?? 0)
    : agorotToWholeShekels(amountAgorot);

  return (
    <Amount dir="ltr" data-testid={testId}>
      <Currency>{MONEY_COPY.currency}</Currency>
      <Number>{shekels}</Number>
    </Amount>
  );
}
