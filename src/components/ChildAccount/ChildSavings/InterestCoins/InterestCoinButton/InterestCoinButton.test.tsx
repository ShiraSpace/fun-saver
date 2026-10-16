import { fireEvent, render, screen } from '@/test-utils/render';
import { InterestCoinButton } from './InterestCoinButton';
import { INTEREST_COIN_BUTTON_TEST_IDS } from './constants';

describe('InterestCoinButton holding ₪3', () => {
  const mockOnTap = jest.fn();

  beforeEach(() => {
    render(<InterestCoinButton amount={300} onTap={mockOnTap} />);
  });

  it('names itself for a screen reader', () => {
    expect(screen.getByTestId(INTEREST_COIN_BUTTON_TEST_IDS.coin)).toHaveAccessibleName(
      '₪3 ריבית, לחצו כדי להכניס לחיסכון'
    );
  });

  it('shows what it holds', () => {
    expect(screen.getByTestId(INTEREST_COIN_BUTTON_TEST_IDS.amount)).toHaveTextContent('₪3');
  });

  it('says what a tap does', () => {
    fireEvent.click(screen.getByTestId(INTEREST_COIN_BUTTON_TEST_IDS.coin));

    expect(mockOnTap).toHaveBeenCalledTimes(1);
  });
});
