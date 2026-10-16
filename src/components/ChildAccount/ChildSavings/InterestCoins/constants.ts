import { INTEREST_COIN_BUTTON_TEST_IDS } from './InterestCoinButton/constants';

export const INTEREST_COINS_TEST_IDS = {
  copy: 'interest-coins-copy',
} as const;

export const INTEREST_COIN_SELECTOR = `[data-testid="${INTEREST_COIN_BUTTON_TEST_IDS.coin}"]`;

export const INTEREST_COINS_COPY = {
  tapTheCoins: 'הכסף הרוויח לבד! לחצו על המטבעות',
} as const;
