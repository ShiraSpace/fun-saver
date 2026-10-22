import { INTEREST_COIN_BUTTON_TEST_IDS } from './InterestCoinButton/constants';

export const INTEREST_COINS_TEST_IDS = {
  copy: 'interest-coins-copy',
} as const;

export const INTEREST_COIN_SELECTOR = `[data-testid="${INTEREST_COIN_BUTTON_TEST_IDS.coin}"]`;

export const INTEREST_COINS_COPY = {
  tapTheCoins: 'הכסף הרוויח לבד! לחצו על המטבעות',
} as const;

export const COIN_NOT_YET_TAPPED_SELECTOR = `${INTEREST_COIN_SELECTOR}:enabled`;

export const COINS_CLOSE_THE_GAP = {
  durationMs: 420,
  easing: 'cubic-bezier(.3, 1.35, .5, 1)',
  inPlace: 'translateX(0)',
} as const;

export const COIN_SPACE_CLOSE = {
  waitForTheWiggleMs: 450,
  durationMs: 650,
  easing: 'cubic-bezier(.3, .9, .4, 1)',
  noHeight: '0px',
} as const;
