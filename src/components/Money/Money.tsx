'use client';

import { JSX } from 'react';
import {
  agorotToWholeShekels,
  floorToShekels,
  nearestHalfShekel,
} from '@/lib/money';
import { MONEY_COPY } from './constants';
import { Amount, Currency, Shekels } from './Money.styles';

function shownShekels(
  amountAgorot: number,
  allowHalf: boolean,
  roundDown: boolean
): number {
  if (roundDown) {
    return floorToShekels(amountAgorot);
  }

  return allowHalf
    ? (nearestHalfShekel(amountAgorot) ?? 0)
    : agorotToWholeShekels(amountAgorot);
}

interface MoneyProps {
  amountAgorot: number;
  testId: string;
  allowHalf?: boolean;
  fullSizeCurrency?: boolean;
  roundDown?: boolean;
}

export function Money({
  amountAgorot,
  testId,
  allowHalf = false,
  fullSizeCurrency = false,
  roundDown = false,
}: MoneyProps): JSX.Element {
  const shekels = shownShekels(amountAgorot, allowHalf, roundDown);

  return (
    <Amount dir="ltr" data-testid={testId}>
      <Currency data-full-size={fullSizeCurrency}>
        {MONEY_COPY.currencySign}
      </Currency>
      <Shekels>{shekels}</Shekels>
    </Amount>
  );
}
