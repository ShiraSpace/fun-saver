import { screen } from '@testing-library/react';
import { INTEREST_COIN_BUTTON_TEST_IDS } from '@/components/ChildAccount/ChildSavings/InterestCoins/InterestCoinButton/constants';

export function shownCoins(): HTMLElement[] {
  return screen.queryAllByTestId(INTEREST_COIN_BUTTON_TEST_IDS.coin);
}
