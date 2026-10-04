'use client';

import { JSX } from 'react';
import {
  agorotToWholeShekels,
  floorToShekels,
  nearestHalfShekel,
} from '@/lib/money';
import { MONEY_COPY, MONEY_ROUNDING, type MoneyRounding } from './constants';
import { Amount, Currency, Shekels } from './Money.styles';

interface ShownShekelsParams {
  amountAgorot: number;
  rounding: MoneyRounding;
}

type RoundToShekels = (amountAgorot: number) => number;

const ROUND_TO_SHEKELS: Record<MoneyRounding, RoundToShekels> = {
  nearestShekel: agorotToWholeShekels,
  nearestHalfShekel: (amountAgorot: number): number =>
    nearestHalfShekel(amountAgorot) ?? 0,
  downToShekel: floorToShekels,
};

function shownShekels({ amountAgorot, rounding }: ShownShekelsParams): number {
  return ROUND_TO_SHEKELS[rounding](amountAgorot);
}

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
  const shekels = shownShekels({ amountAgorot, rounding });

  return (
    <Amount dir="ltr" data-testid={testId}>
      <Currency data-full-size={fullSizeCurrency}>
        {MONEY_COPY.currencySign}
      </Currency>
      <Shekels>{shekels}</Shekels>
    </Amount>
  );
}
