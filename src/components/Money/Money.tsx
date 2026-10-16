'use client';

import { JSX } from 'react';
import { MONEY_COPY, MONEY_ROUNDING, type MoneyRounding } from './constants';
import { shekelsText } from './money-text';
import { Amount, Currency, Shekels } from './Money.styles';

interface MoneyProps {
  amountAgorot: number;
  testId: string;
  fullSizeCurrency?: boolean;
  rounding?: MoneyRounding;
}

export function Money({
  amountAgorot,
  testId,
  fullSizeCurrency = false,
  rounding = MONEY_ROUNDING.nearestShekel,
}: MoneyProps): JSX.Element {
  const shekels = shekelsText(amountAgorot, rounding);

  return (
    <Amount dir="ltr" data-testid={testId}>
      <Currency data-full-size={fullSizeCurrency}>{MONEY_COPY.currencySign}</Currency>
      <Shekels>{shekels}</Shekels>
    </Amount>
  );
}
