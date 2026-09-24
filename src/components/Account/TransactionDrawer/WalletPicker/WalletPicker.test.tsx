import { fireEvent, render, screen } from '@/test-utils/render';
import { WalletPicker } from './WalletPicker';
import { WALLET_PICKER_TEST_IDS } from './constants';
import { mockWalletSummaries } from '@/test-utils/fixtures';
import { agorotToShekels } from '@/lib/money';

const mockOnSelect = jest.fn();
const [savings, spending] = mockWalletSummaries;

function renderPicker(selectedWalletId: string): void {
  render(
    <WalletPicker
      wallets={mockWalletSummaries}
      selectedWalletId={selectedWalletId}
      onSelect={mockOnSelect}
    />
  );
}

describe('WalletPicker', () => {
  beforeEach(() => {
    mockOnSelect.mockClear();
  });

  it('renders a tile with its balance for each wallet', () => {
    renderPicker(savings.id);

    expect(screen.getAllByTestId(/^wallet-picker-(?!balance)/)).toHaveLength(
      mockWalletSummaries.length
    );
    expect(
      screen.getByTestId(WALLET_PICKER_TEST_IDS.balance(savings.name))
    ).toHaveTextContent(String(agorotToShekels(savings.balance)));
  });

  it('marks the selected wallet as pressed', () => {
    renderPicker(spending.id);

    expect(
      screen.getByTestId(WALLET_PICKER_TEST_IDS.wallet(spending.name))
    ).toHaveAttribute('aria-pressed', 'true');
    expect(
      screen.getByTestId(WALLET_PICKER_TEST_IDS.wallet(savings.name))
    ).toHaveAttribute('aria-pressed', 'false');
  });

  it('reports the tapped wallet id through onSelect', () => {
    renderPicker(savings.id);

    fireEvent.click(
      screen.getByTestId(WALLET_PICKER_TEST_IDS.wallet(spending.name))
    );

    expect(mockOnSelect).toHaveBeenCalledWith(spending.id);
  });
});
