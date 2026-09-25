import { fireEvent, render, screen } from '@/test-utils/render';
import { SHOWN_BALANCE } from '../../constants';
import { BALANCE_CHIPS_TEST_IDS } from './constants';
import { BalanceChips } from './BalanceChips';

const mockOnToggle = jest.fn();

describe('the chips that choose the lines', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    render(
      <BalanceChips
        shownBalances={[SHOWN_BALANCE.totalBalance]}
        onToggle={mockOnToggle}
      />
    );
  });

  it('reports a shown line as pressed', () => {
    expect(
      screen.getByTestId(
        BALANCE_CHIPS_TEST_IDS.chip(SHOWN_BALANCE.totalBalance)
      )
    ).toHaveAttribute('aria-pressed', 'true');
  });

  it('reports a hidden line as not pressed', () => {
    expect(
      screen.getByTestId(BALANCE_CHIPS_TEST_IDS.chip(SHOWN_BALANCE.savings))
    ).toHaveAttribute('aria-pressed', 'false');
  });

  it('turns the tapped wallet’s line on or off', () => {
    fireEvent.click(
      screen.getByTestId(BALANCE_CHIPS_TEST_IDS.chip(SHOWN_BALANCE.spending))
    );

    expect(mockOnToggle).toHaveBeenCalledWith(SHOWN_BALANCE.spending);
  });

  it('turns the total’s line on or off', () => {
    fireEvent.click(
      screen.getByTestId(
        BALANCE_CHIPS_TEST_IDS.chip(SHOWN_BALANCE.totalBalance)
      )
    );

    expect(mockOnToggle).toHaveBeenCalledWith(SHOWN_BALANCE.totalBalance);
  });
});
