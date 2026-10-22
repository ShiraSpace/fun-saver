import { act, fireEvent, render, screen } from '@/test-utils/render';
import { captureCookies } from '@/test-utils/cookies';
import { elementsAnimate, finishAnimation, prefersReducedMotion } from '@/test-utils/motion';
import { savedMark, shownCoins } from '@/test-utils/interest-coins';
import { createMockWalletSummary } from '@/test-utils/mocks/wallet.mocks';
import { mockAccountId } from '@/test-utils/mocks/account.mocks';
import { ChildSavings } from './ChildSavings';
import { PRINCIPAL_AND_INTEREST_TEST_IDS } from './PrincipalAndInterest/constants';
import { SAVINGS_BALANCE_TEST_IDS } from './SavingsBalance/constants';
import { SAVINGS_ROLL_UP } from './constants';

const mockSavingsWithFiveShekelsOfInterest = createMockWalletSummary({
  balance: 10500,
  interestEarned: 500,
});
const mockNoCoinsCollected = { collectedInterest: { [mockAccountId]: '0' } };

describe('ChildSavings with ₪5 of interest waiting as ₪2, ₪2 and ₪1, while the first coin tapped drops', () => {
  const written = captureCookies();
  const mockAnimate = jest.fn(() => ({}) as Animation);

  beforeEach(() => {
    mockAnimate.mockClear();
    jest.useFakeTimers();
    elementsAnimate(mockAnimate);
    render(
      <ChildSavings accountId={mockAccountId} savings={mockSavingsWithFiveShekelsOfInterest} />,
      mockNoCoinsCollected
    );
    fireEvent.click(shownCoins()[0]);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('keeps the total as it was for as long as a roll-up takes', () => {
    act(() => jest.advanceTimersByTime(SAVINGS_ROLL_UP.countMs * 2));

    expect(screen.getByTestId(SAVINGS_BALANCE_TEST_IDS.balance)).toHaveTextContent('₪100');
  });

  it('saves the coin as collected at the tap', () => {
    expect(written).toContainEqual(expect.stringMatching(savedMark(200)));
  });

  it('keeps the coin from being tapped again', () => {
    expect(shownCoins()[0]).toBeDisabled();
  });

  describe('when it lands', () => {
    beforeEach(() => {
      const [drop] = mockAnimate.mock.results.map((result) => result.value);

      act(() => finishAnimation(drop));
    });

    it('reads out the landed total at once', () => {
      expect(screen.getByTestId(SAVINGS_BALANCE_TEST_IDS.announcedBalance)).toHaveTextContent(
        '₪102'
      );
    });

    it('starts the total rolling from where it was', () => {
      expect(screen.getByTestId(SAVINGS_BALANCE_TEST_IDS.balance)).toHaveTextContent('₪100');
    });

    it('rolls the total up to the landed amount', () => {
      act(() => jest.advanceTimersByTime(SAVINGS_ROLL_UP.countMs));

      expect(screen.getByTestId(SAVINGS_BALANCE_TEST_IDS.balance)).toHaveTextContent('₪102');
    });

    it('starts what the money earned by itself rolling from where it was', () => {
      expect(screen.getByTestId(PRINCIPAL_AND_INTEREST_TEST_IDS.interestEarned)).toHaveTextContent(
        '₪0'
      );
    });

    it('rolls what the money earned by itself up by the coin', () => {
      act(() => jest.advanceTimersByTime(SAVINGS_ROLL_UP.countMs));

      expect(screen.getByTestId(PRINCIPAL_AND_INTEREST_TEST_IDS.interestEarned)).toHaveTextContent(
        '₪2'
      );
    });

    it('takes the coin out of the row', () => {
      expect(shownCoins()).toHaveLength(2);
    });
  });
});

it('lands a tapped coin at once when the browser asks for reduced motion', () => {
  const mockAnimate = jest.fn();
  prefersReducedMotion();
  elementsAnimate(mockAnimate);
  render(
    <ChildSavings accountId={mockAccountId} savings={mockSavingsWithFiveShekelsOfInterest} />,
    mockNoCoinsCollected
  );

  fireEvent.click(shownCoins()[0]);

  expect(screen.getByTestId(SAVINGS_BALANCE_TEST_IDS.balance)).toHaveTextContent('₪102');
});
