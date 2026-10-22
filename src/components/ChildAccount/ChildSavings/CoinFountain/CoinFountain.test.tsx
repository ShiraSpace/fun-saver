import { render, screen } from '@/test-utils/render';
import { CoinFountain } from './CoinFountain';
import { COIN_FOUNTAIN_COINS, COIN_FOUNTAIN_TEST_IDS } from './constants';

describe('CoinFountain', () => {
  beforeEach(() => {
    render(<CoinFountain />);
  });

  it('pours every coin in its table', () => {
    expect(screen.getAllByTestId(COIN_FOUNTAIN_TEST_IDS.coin)).toHaveLength(
      COIN_FOUNTAIN_COINS.length
    );
  });

  it('hides the coins from screen readers', () => {
    expect(screen.getByTestId(COIN_FOUNTAIN_TEST_IDS.fountain)).toHaveAttribute(
      'aria-hidden',
      'true'
    );
  });
});
