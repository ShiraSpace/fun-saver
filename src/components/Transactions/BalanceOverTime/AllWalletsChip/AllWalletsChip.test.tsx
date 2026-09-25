import { fireEvent, render, screen } from '@/test-utils/render';
import { ALL_WALLETS_CHIP_TEST_IDS } from './constants';
import { AllWalletsChip } from './AllWalletsChip';

const mockOnToggle = jest.fn();

describe('the chip that shows every wallet', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    render(<AllWalletsChip allWalletsShown onToggle={mockOnToggle} />);
  });

  it('reports itself pressed while every wallet is shown', () => {
    expect(screen.getByTestId(ALL_WALLETS_CHIP_TEST_IDS.chip)).toHaveAttribute(
      'aria-pressed',
      'true'
    );
  });

  it('turns every wallet on or off together when tapped', () => {
    fireEvent.click(screen.getByTestId(ALL_WALLETS_CHIP_TEST_IDS.chip));

    expect(mockOnToggle).toHaveBeenCalledTimes(1);
  });
});
