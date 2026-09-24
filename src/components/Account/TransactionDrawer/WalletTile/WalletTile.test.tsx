import { fireEvent, render, screen } from '@/test-utils/render';
import { WalletTile } from './WalletTile';
import { agorotToShekels } from '@/lib/money';

const VALUE_TEST_ID = 'tile-value';
const TILE_TEST_ID = 'tile';
const onSelect = jest.fn();

describe('WalletTile', () => {
  beforeEach(() => {
    onSelect.mockClear();
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
        onSelect={onSelect}
      />
    );

    const tile = screen.getByTestId(TILE_TEST_ID);
    expect(tile).toBeEnabled();
    expect(tile).toHaveAttribute('aria-pressed', 'true');

    fireEvent.click(tile);
    expect(onSelect).toHaveBeenCalledTimes(1);
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
});
