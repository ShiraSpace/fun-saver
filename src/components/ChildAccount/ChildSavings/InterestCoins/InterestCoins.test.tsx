import { createRef } from 'react';
import { fireEvent, render, screen } from '@/test-utils/render';
import { InterestCoins, type InterestCoin } from './InterestCoins';
import { INTEREST_COINS_COPY, INTEREST_COINS_TEST_IDS } from './constants';

function shownCoins(): HTMLElement[] {
  return screen.getAllByTestId(INTEREST_COINS_TEST_IDS.coin);
}

describe('InterestCoins with ₪3, ₪2 and ₪2 waiting', () => {
  const mockInterestCoins: InterestCoin[] = [
    { place: 0, amount: 300 },
    { place: 1, amount: 200 },
    { place: 2, amount: 200 },
  ];
  const mockOnCollect = jest.fn();
  const mockWhereFocusGoesLast = createRef<HTMLElement>();

  beforeEach(() => {
    render(
      <InterestCoins
        interestCoins={mockInterestCoins}
        onCollect={mockOnCollect}
        whereFocusGoesLast={mockWhereFocusGoesLast}
      />
    );
  });

  it('offers a coin for each', () => {
    expect(shownCoins()).toHaveLength(3);
  });

  it('shows what each coin holds', () => {
    expect(
      screen.getAllByTestId(INTEREST_COINS_TEST_IDS.amount).map((amount) => amount.textContent)
    ).toEqual(['₪3', '₪2', '₪2']);
  });

  it('names each coin for a screen reader', () => {
    expect(shownCoins()[0]).toHaveAccessibleName('₪3 ריבית, לחצו כדי להכניס לחיסכון');
  });

  it('tells the child to tap them', () => {
    expect(screen.getByTestId(INTEREST_COINS_TEST_IDS.copy)).toHaveTextContent(
      INTEREST_COINS_COPY.tapTheCoins
    );
  });

  it('moves focus to the next coin at the tap', () => {
    fireEvent.click(shownCoins()[0]);

    expect(shownCoins()[1]).toHaveFocus();
  });

  it('moves focus to the coin before when the last in the row is tapped', () => {
    fireEvent.click(shownCoins()[2]);

    expect(shownCoins()[1]).toHaveFocus();
  });
});

it('draws nothing with no coins waiting', () => {
  const mockOnCollect = jest.fn();
  const mockWhereFocusGoesLast = createRef<HTMLElement>();
  const { container } = render(
    <InterestCoins
      interestCoins={[]}
      onCollect={mockOnCollect}
      whereFocusGoesLast={mockWhereFocusGoesLast}
    />
  );

  expect(container).toBeEmptyDOMElement();
});

it('collects a coin by the place it had when the visit began', () => {
  const mockOnCollect = jest.fn();
  const mockWhereFocusGoesLast = createRef<HTMLElement>();
  render(
    <InterestCoins
      interestCoins={[
        { place: 1, amount: 200 },
        { place: 2, amount: 200 },
      ]}
      onCollect={mockOnCollect}
      whereFocusGoesLast={mockWhereFocusGoesLast}
    />
  );

  fireEvent.click(shownCoins()[0]);

  expect(mockOnCollect).toHaveBeenCalledWith(1);
});

it('moves focus to where it goes last when the only coin is tapped', () => {
  const mockWhereFocusGoesLast = createRef<HTMLDivElement>();
  const mockOnCollect = jest.fn();
  render(
    <>
      <div ref={mockWhereFocusGoesLast} tabIndex={-1} />
      <InterestCoins
        interestCoins={[{ place: 0, amount: 100 }]}
        onCollect={mockOnCollect}
        whereFocusGoesLast={mockWhereFocusGoesLast}
      />
    </>
  );

  fireEvent.click(shownCoins()[0]);

  expect(mockWhereFocusGoesLast.current).toHaveFocus();
});
