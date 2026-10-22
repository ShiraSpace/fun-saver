import { BALANCE_CELEBRATION_START_MS } from '../constants';

export const BALANCE_TWINKLES_TEST_IDS = {
  twinkles: 'balance-twinkles',
  twinkle: 'balance-twinkle',
} as const;

export const TWINKLE = '✨';

export const TWINKLE_GAP_MS = 150;

export const FIRST_TWINKLE_MS = BALANCE_CELEBRATION_START_MS;

export type TwinklePlace = readonly [xPx: number, yPx: number];

export const TWINKLE_PLACES: readonly TwinklePlace[] = [
  [80, 0],
  [57, 24],
  [0, 34],
  [-57, 24],
  [-80, 0],
  [-57, -24],
  [0, -34],
  [57, -24],
];
