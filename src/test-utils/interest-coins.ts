import { screen } from '@testing-library/react';
import { collectedInterestCookie } from '@/lib/cookies';
import { mockAccountId } from '@/test-utils/mocks/account.mocks';
import { INTEREST_COIN_BUTTON_TEST_IDS } from '@/components/ChildAccount/ChildSavings/InterestCoins/InterestCoinButton/constants';
import type { InterestCoin } from '@/components/ChildAccount/ChildSavings/InterestCoins';

export function shownCoins(): HTMLElement[] {
  return screen.queryAllByTestId(INTEREST_COIN_BUTTON_TEST_IDS.coin);
}

export function savedMark(collectedInterest: number): RegExp {
  return new RegExp(
    `^${collectedInterestCookie(mockAccountId)}=${collectedInterest}; path=/; max-age=`
  );
}

export const mockThreeInterestCoins: InterestCoin[] = [
  { place: 0, amount: 300, isDropping: false },
  { place: 1, amount: 200, isDropping: false },
  { place: 2, amount: 200, isDropping: false },
];
