'use client';

import { JSX } from 'react';
import { agorotToWholeShekels, floorToShekels, nearestHalfShekel } from '@/lib/money';
import { MONEY_COPY, MONEY_ROUNDING, type MoneyRounding } from './constants';
import { floorToTenthsText } from './money-text';
import { Amount, Currency, Shekels } from './Money.styles';

interface ShownShekelsParams {
  amountAgorot: number;
  rounding: MoneyRounding;
}

type ShekelsText = (amountAgorot: number) => string;

const SHEKELS_TEXT: Record<MoneyRounding, ShekelsText> = {
  nearestShekel: (amountAgorot: number): string => String(agorotToWholeShekels(amountAgorot)),
  nearestHalfShekel: (amountAgorot: number): string => String(nearestHalfShekel(amountAgorot) ?? 0),
  floorToShekels: (amountAgorot: number): string => String(floorToShekels(amountAgorot)),
  floorToTenths: floorToTenthsText,
};

function shownShekels({ amountAgorot, rounding }: ShownShekelsParams): string {
  return SHEKELS_TEXT[rounding](amountAgorot);
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
      <Currency data-full-size={fullSizeCurrency}>{MONEY_COPY.currencySign}</Currency>
      <Shekels>{shekels}</Shekels>
    </Amount>
  );
}
