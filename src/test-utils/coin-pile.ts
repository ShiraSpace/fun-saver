import { screen } from '@testing-library/react';
import { COIN_PILE_SPOTS } from '@/components/ChildAccount/ChildSavings/PiggyBank/coin-pile';
import { COIN_PILE_TEST_IDS } from '@/components/ChildAccount/ChildSavings/PiggyBank/CoinPile/constants';

export const COINS_IN_A_FULL_PILE = COIN_PILE_SPOTS.length;

export const COINS_IN_HALF_A_PILE = Math.round(COINS_IN_A_FULL_PILE / 2);

export function coinsDrawnInPile(): number {
  return screen.queryAllByTestId(COIN_PILE_TEST_IDS.coin).length;
}
