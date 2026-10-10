import { fireEvent, render, screen } from '@/test-utils/render';
import { WalletTile } from './WalletTile';
import { agorotToShekels } from '@/lib/money';
import { WALLET_TILE_TEST_IDS } from './constants';

const VALUE_TEST_ID = 'tile-value';
const TILE_TEST_ID = 'tile';
const mockOnSelect = jest.fn();

describe('WalletTile', () => {
  beforeEach(() => {
    mockOnSelect.mockClear();
  });

  it('renders its balance in shekels', () => {
    render(
      <WalletTile
        walletName="savings"
        icon="🐷"
        amountAgorot={8500}
        amountTestId={VALUE_TEST_ID}
      />
    );

    expect(screen.getByTestId(VALUE_TEST_ID)).toHaveTextContent(
      String(agorotToShekels(8500))
    );
  });

  it('is selectable and reports presses when given onSelect', () => {
    render(
      <WalletTile
        walletName="savings"
        icon="🐷"
        amountAgorot={8500}
        amountTestId={VALUE_TEST_ID}
        testId={TILE_TEST_ID}
        selected
        onSelect={mockOnSelect}
      />
    );

    const tile = screen.getByTestId(TILE_TEST_ID);
    expect(tile).toBeEnabled();
    expect(tile).toHaveAttribute('aria-pressed', 'true');

    fireEvent.click(tile);
    expect(mockOnSelect).toHaveBeenCalledTimes(1);
  });

  it('is disabled when there is no onSelect', () => {
    render(
      <WalletTile
        walletName="savings"
        icon="🐷"
        amountAgorot={8500}
        amountTestId={VALUE_TEST_ID}
        testId={TILE_TEST_ID}
      />
    );

    expect(screen.getByTestId(TILE_TEST_ID)).toBeDisabled();
  });

  describe('kept for a goal', () => {
    beforeEach(() => {
      render(
        <WalletTile
          walletName="savings"
          icon="🐷"
          amountAgorot={8500}
          amountTestId={VALUE_TEST_ID}
          testId={TILE_TEST_ID}
          onSelect={mockOnSelect}
          locked
        />
      );
    });

    it('shows a lock', () => {
      expect(screen.getByTestId(WALLET_TILE_TEST_IDS.lock)).toBeInTheDocument();
    });

    it('is greyed out', () => {
      expect(getComputedStyle(screen.getByTestId(TILE_TEST_ID)).filter).toBe(
        'grayscale(1)'
      );
    });

    it('can still be picked', () => {
      fireEvent.click(screen.getByTestId(TILE_TEST_ID));

      expect(mockOnSelect).toHaveBeenCalledTimes(1);
    });
  });
});
