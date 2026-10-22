import { PIGGY_BANK_SHAPE, PIGGY_BANK_SIZE } from '../PiggyBank/constants';

export const COIN_FOUNTAIN_TEST_IDS = {
  fountain: 'coin-fountain',
  coin: 'coin-fountain-coin',
} as const;

const { slot } = PIGGY_BANK_SHAPE;

export const SLOT_CENTRE_PERCENT = {
  left: ((slot.x + slot.width / 2) / PIGGY_BANK_SIZE.width) * 100,
  top: ((slot.y + slot.height / 2) / PIGGY_BANK_SIZE.height) * 100,
} as const;

export const FLYING_COIN_SIZE = 22;

export type CoinFlight = readonly [
  driftPx: number,
  risePx: number,
  fallPx: number,
  flightMs: number,
  delayMs: number,
];

export const COIN_FOUNTAIN_COINS: readonly CoinFlight[] = [
  [0, 70, 380, 1900, 200],
  [66, 107, 433, 2020, 290],
  [120, 144, 486, 2140, 380],
  [153, 101, 539, 2260, 470],
  [159, 138, 412, 2380, 560],
  [137, 95, 465, 1900, 650],
  [90, 132, 518, 2020, 740],
  [28, 89, 391, 2140, 830],
  [-39, 126, 444, 2260, 920],
  [-99, 83, 497, 2380, 1010],
  [-142, 120, 550, 1900, 1100],
  [-160, 77, 423, 2020, 1190],
  [-149, 114, 476, 2140, 1280],
  [-112, 71, 529, 2260, 1370],
  [-56, 108, 402, 2380, 1460],
  [11, 145, 455, 1900, 1550],
  [76, 102, 508, 2020, 1640],
  [127, 139, 381, 2140, 1730],
  [156, 96, 434, 2260, 1820],
  [157, 133, 487, 2380, 1910],
  [131, 90, 540, 1900, 2000],
  [81, 127, 413, 2020, 2090],
  [17, 84, 466, 2140, 2180],
  [-49, 121, 519, 2260, 2270],
  [-108, 78, 392, 2380, 2360],
  [-147, 115, 445, 1900, 2450],
];
