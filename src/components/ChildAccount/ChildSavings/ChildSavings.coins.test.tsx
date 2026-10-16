import { act, fireEvent, render, screen } from '@/test-utils/render';
import { captureCookies } from '@/test-utils/cookies';
import { createMockWalletSummary } from '@/test-utils/mocks/wallet.mocks';
import { createMockGoal, createMockSavedTowardGoal } from '@/test-utils/mocks/goal.mocks';
import { collectedInterestCookie } from '@/lib/cookies';
import { SAVED_OUT_OF_GOAL_TEST_IDS } from '@/components/Goal/SavedOutOfGoal/constants';
import { ChildSavings } from './ChildSavings';
import { INTEREST_COINS_TEST_IDS } from './InterestCoins/constants';
import { PRINCIPAL_AND_INTEREST_TEST_IDS } from './PrincipalAndInterest/constants';
import { SAVINGS_BALANCE_TEST_IDS } from './SavingsBalance/constants';

const mockAccountId = 'mock-account';
const mockSavingsWithFiveShekelsOfInterest = createMockWalletSummary({
  balance: 10500,
  interestEarned: 500,
});
const mockNoCoinsCollected = { collectedInterest: { [mockAccountId]: '0' } };
const written = captureCookies();

function savedMark(collectedInterest: number): RegExp {
  return new RegExp(
    `^${collectedInterestCookie(mockAccountId)}=${collectedInterest}; path=/; max-age=`
  );
}

function shownCoins(): HTMLElement[] {
  return screen.queryAllByTestId(INTEREST_COINS_TEST_IDS.coin);
}

function shownCoinAmounts(): (string | null)[] {
  return screen.getAllByTestId(INTEREST_COINS_TEST_IDS.amount).map((amount) => amount.textContent);
}

describe('ChildSavings with ₪5 of interest waiting as ₪2, ₪2 and ₪1, after the first coin is tapped', () => {
  beforeEach(() => {
    render(
      <ChildSavings accountId={mockAccountId} savings={mockSavingsWithFiveShekelsOfInterest} />,
      mockNoCoinsCollected
    );
    fireEvent.click(shownCoins()[0]);
  });

  it('raises the total by the coin', () => {
    expect(screen.getByTestId(SAVINGS_BALANCE_TEST_IDS.balance)).toHaveTextContent('₪102');
  });

  it('raises what the money earned by itself by the coin', () => {
    expect(screen.getByTestId(PRINCIPAL_AND_INTEREST_TEST_IDS.interestEarned)).toHaveTextContent(
      '₪2'
    );
  });

  it('leaves the other coins at their amounts', () => {
    expect(shownCoinAmounts()).toEqual(['₪2', '₪1']);
  });

  it('saves the coin as collected at the tap', () => {
    expect(written).toContainEqual(expect.stringMatching(savedMark(200)));
  });
});

describe('ChildSavings with ₪5 of interest waiting, when the page settles another ₪1', () => {
  beforeEach(() => {
    const { rerender } = render(
      <ChildSavings accountId={mockAccountId} savings={mockSavingsWithFiveShekelsOfInterest} />,
      mockNoCoinsCollected
    );
    rerender(
      <ChildSavings
        accountId={mockAccountId}
        savings={createMockWalletSummary({ balance: 10600, interestEarned: 600 })}
      />
    );
  });

  it('keeps the new interest out of the total until the next visit', () => {
    expect(screen.getByTestId(SAVINGS_BALANCE_TEST_IDS.balance)).toHaveTextContent('₪100');
  });

  it('keeps the coins the visit began with', () => {
    expect(shownCoinAmounts()).toEqual(['₪2', '₪2', '₪1']);
  });
});

describe('ChildSavings on the first visit on this phone', () => {
  beforeEach(() => {
    render(
      <ChildSavings accountId={mockAccountId} savings={mockSavingsWithFiveShekelsOfInterest} />
    );
  });

  it('offers no coins, counting from now', () => {
    expect(shownCoins()).toHaveLength(0);
  });

  it('saves the interest so far as collected', () => {
    expect(written).toContainEqual(expect.stringMatching(savedMark(500)));
  });
});

it('keeps a larger mark another tab saved, at the tap', () => {
  render(
    <ChildSavings accountId={mockAccountId} savings={mockSavingsWithFiveShekelsOfInterest} />,
    mockNoCoinsCollected
  );
  document.cookie = `${collectedInterestCookie(mockAccountId)}=400`;

  fireEvent.click(shownCoins()[0]);

  expect(written).toContainEqual(expect.stringMatching(savedMark(400)));
});

it('saves the mark again on a return visit, so the cookie does not expire', () => {
  render(
    <ChildSavings accountId={mockAccountId} savings={mockSavingsWithFiveShekelsOfInterest} />,
    { collectedInterest: { [mockAccountId]: '500' } }
  );

  expect(written).toContainEqual(expect.stringMatching(savedMark(500)));
});

it('collects a coin tapped twice once', () => {
  render(
    <ChildSavings accountId={mockAccountId} savings={mockSavingsWithFiveShekelsOfInterest} />,
    mockNoCoinsCollected
  );
  const [firstCoin] = shownCoins();

  fireEvent.click(firstCoin);
  fireEvent.click(firstCoin);

  expect(screen.getByTestId(SAVINGS_BALANCE_TEST_IDS.balance)).toHaveTextContent('₪102');
});

it('collects two coins tapped before the screen redraws', () => {
  render(
    <ChildSavings accountId={mockAccountId} savings={mockSavingsWithFiveShekelsOfInterest} />,
    mockNoCoinsCollected
  );
  const [firstCoin, secondCoin] = shownCoins();

  act(() => {
    fireEvent.click(firstCoin);
    fireEvent.click(secondCoin);
  });

  expect(screen.getByTestId(SAVINGS_BALANCE_TEST_IDS.balance)).toHaveTextContent('₪104');
});

it('leaves what waits out of the goal', () => {
  render(
    <ChildSavings
      accountId={mockAccountId}
      savings={mockSavingsWithFiveShekelsOfInterest}
      savedTowardGoal={createMockSavedTowardGoal({ saved: 10500, stillToSave: 19500 })}
    />,
    mockNoCoinsCollected
  );

  expect(screen.getByTestId(SAVED_OUT_OF_GOAL_TEST_IDS.saved)).toHaveTextContent('₪100');
});

it('shows the real savings once the goal is reached, coins or not', () => {
  render(
    <ChildSavings
      accountId={mockAccountId}
      savings={mockSavingsWithFiveShekelsOfInterest}
      savedTowardGoal={createMockSavedTowardGoal({
        goal: createMockGoal({ amount: 10000 }),
        saved: 10500,
        stillToSave: 0,
        reached: true,
      })}
    />,
    mockNoCoinsCollected
  );

  expect(screen.getByTestId(SAVED_OUT_OF_GOAL_TEST_IDS.saved)).toHaveTextContent('₪105');
});
