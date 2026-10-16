import { AGOROT_PER_SHEKEL } from '@/lib/constants';

const TENTHS_PER_SHEKEL = 10;

export const AGOROT_PER_TENTH = AGOROT_PER_SHEKEL / TENTHS_PER_SHEKEL;

export const MONEY_COPY = {
  currencySign: '₪',
} as const;

export const MONEY_ROUNDING = {
  nearestShekel: 'nearestShekel',
  nearestHalfShekel: 'nearestHalfShekel',
  floorToShekels: 'floorToShekels',
  floorToTenths: 'floorToTenths',
} as const;

export type MoneyRounding = (typeof MONEY_ROUNDING)[keyof typeof MONEY_ROUNDING];

export const MONEY_STYLE = {
  currencyScale: 0.4,
  currencyOpacity: 0.65,
  currencyGap: 2,
} as const;
