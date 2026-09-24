'use client';

import { JSX } from 'react';
import { agorotToWholeShekels, nearestHalfShekel } from '@/lib/money';
import { MONEY_COPY } from './constants';
import { Amount, Currency, Shekels } from './Money.styles';

interface MoneyProps {
  amountAgorot: number;
  testId: string;
  allowHalf?: boolean;
  fullSizeCurrency?: boolean;
}

export function Money({
  amountAgorot,
  testId,
  allowHalf = false,
  fullSizeCurrency = false,
}: MoneyProps): JSX.Element {
  const shekels = allowHalf
    ? (nearestHalfShekel(amountAgorot) ?? 0)
    : agorotToWholeShekels(amountAgorot);

  return (
    <Amount dir="ltr" data-testid={testId}>
      <Currency data-full-size={fullSizeCurrency}>
        {MONEY_COPY.currencySign}
      </Currency>
      <Shekels>{shekels}</Shekels>
    </Amount>
  );
}
