import { render, screen } from '@testing-library/react';
import { CoinRow } from './CoinRow';
import { COIN_ROW_COPY, COIN_ROW_TEST_IDS } from './constants';

describe('CoinRow', () => {
  it('renders one full coin and one half coin for 1.5₪ of interest', () => {
    render(<CoinRow todayInterest={150} />);
    expect(screen.getAllByTestId(COIN_ROW_TEST_IDS.fullCoin)).toHaveLength(1);
    expect(screen.getAllByTestId(COIN_ROW_TEST_IDS.halfCoin)).toHaveLength(1);
  });

  it('hides the row when the interest rounds to zero', () => {
    const { rerender } = render(<CoinRow todayInterest={150} />);
    expect(screen.getByTestId(COIN_ROW_TEST_IDS.row)).toBeInTheDocument();

    rerender(<CoinRow todayInterest={20} />);
    expect(screen.queryByTestId(COIN_ROW_TEST_IDS.row)).toBeNull();
  });

  it('shows the daily-interest label', () => {
    render(<CoinRow todayInterest={150} />);
    expect(screen.getByTestId(COIN_ROW_TEST_IDS.label)).toHaveTextContent(
      COIN_ROW_COPY.label
    );
  });
});
