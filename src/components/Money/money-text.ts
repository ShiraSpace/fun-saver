import {
  AGOROT_PER_TENTH,
  agorotToShekels,
  agorotToWholeShekels,
  floorToTenths,
  floorToShekels,
  nearestHalfShekel,
} from '@/lib/money';
import type { MoneyRounding } from './constants';

const AGOROT_DIGITS = 2;

function exactText(agorot: number): string {
  return agorotToShekels(agorot).toFixed(AGOROT_DIGITS);
}

function floorToTenthsText(agorot: number): string {
  const isBelowATenth = agorot !== 0 && Math.abs(agorot) < AGOROT_PER_TENTH;

  if (isBelowATenth) {
    return exactText(agorot);
  }

  return String(agorotToShekels(floorToTenths(agorot)));
}

type ShekelsText = (amountAgorot: number) => string;

const SHEKELS_TEXT: Record<MoneyRounding, ShekelsText> = {
  nearestShekel: (amountAgorot: number): string => String(agorotToWholeShekels(amountAgorot)),
  nearestHalfShekel: (amountAgorot: number): string => String(nearestHalfShekel(amountAgorot) ?? 0),
  floorToShekels: (amountAgorot: number): string => String(floorToShekels(amountAgorot)),
  floorToTenths: floorToTenthsText,
  exact: exactText,
};

export function shekelsText(amountAgorot: number, rounding: MoneyRounding): string {
  return SHEKELS_TEXT[rounding](amountAgorot);
}
