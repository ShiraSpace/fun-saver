import { createRef } from 'react';
import { render, screen } from '@/test-utils/render';
import { InterestCoins, type InterestCoin } from './InterestCoins';
import { INTEREST_COINS_TEST_IDS } from './constants';

describe('InterestCoins with ₪3, ₪2 and ₪2 waiting', () => {
  const mockInterestCoins: InterestCoin[] = [
    { place: 0, amount: 300 },
    { place: 1, amount: 200 },
    { place: 2, amount: 200 },
  ];

  beforeEach(() => {
    render(
      <InterestCoins
        interestCoins={mockInterestCoins}
        onCollect={jest.fn()}
        whereFocusGoesLast={createRef<HTMLElement>()}
      />
    );
  });

  it('offers a coin for each', () => {
    expect(screen.getAllByTestId(INTEREST_COINS_TEST_IDS.coin)).toHaveLength(3);
  });

  it('shows what each coin holds', () => {
    expect(
      screen.getAllByTestId(INTEREST_COINS_TEST_IDS.amount).map((amount) => amount.textContent)
    ).toEqual(['₪3', '₪2', '₪2']);
  });

  it('names each coin for a screen reader', () => {
    expect(screen.getAllByTestId(INTEREST_COINS_TEST_IDS.coin)[0]).toHaveAccessibleName(
      '₪3 ריבית, לחצו כדי להכניס לחיסכון'
    );
  });
});
