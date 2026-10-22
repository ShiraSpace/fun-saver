import { screen } from '@testing-library/react';
import { collectedInterestCookie } from '@/lib/cookies';
import { mockAccountId } from '@/test-utils/mocks/account.mocks';
import { INTEREST_COIN_BUTTON_TEST_IDS } from '@/components/ChildAccount/ChildSavings/InterestCoins/InterestCoinButton/constants';

export function shownCoins(): HTMLElement[] {
  return screen.queryAllByTestId(INTEREST_COIN_BUTTON_TEST_IDS.coin);
}

export function savedMark(collectedInterest: number): RegExp {
  return new RegExp(
    `^${collectedInterestCookie(mockAccountId)}=${collectedInterest}; path=/; max-age=`
  );
}
