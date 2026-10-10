import { fireEvent, render, screen, within } from '@/test-utils/render';
import { WalletPicker } from './WalletPicker';
import { WALLET_PICKER_TEST_IDS } from './constants';
import { WALLET_TILE_TEST_IDS } from '../WalletTile/constants';
import { createMockSavedTowardGoal } from '@/test-utils/mocks/goal.mocks';
import type { SavedTowardGoal } from '@/lib/goal/saved-toward-goal';
import { mockWalletSummaries } from '@/test-utils/mocks/wallet.mocks';
import { agorotToShekels } from '@/lib/money';

const mockOnSelect = jest.fn();
const [savings, spending] = mockWalletSummaries;

function renderPicker(
  selectedWalletId: string,
  savedTowardGoal?: SavedTowardGoal
): void {
  render(
    <WalletPicker
      wallets={mockWalletSummaries}
      selectedWalletId={selectedWalletId}
      onSelect={mockOnSelect}
      savedTowardGoal={savedTowardGoal}
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

  describe('with a goal not yet reached', () => {
    beforeEach(() => {
      renderPicker(spending.id, createMockSavedTowardGoal());
    });

    it('locks savings', () => {
      expect(
        within(
          screen.getByTestId(WALLET_PICKER_TEST_IDS.wallet(savings.name))
        ).getByTestId(WALLET_TILE_TEST_IDS.lock)
      ).toBeInTheDocument();
    });

    it('locks no other wallet', () => {
      expect(screen.getAllByTestId(WALLET_TILE_TEST_IDS.lock)).toHaveLength(1);
    });
  });

  it('locks nothing once the goal is reached', () => {
    renderPicker(spending.id, createMockSavedTowardGoal({ reached: true }));

    expect(
      screen.queryByTestId(WALLET_TILE_TEST_IDS.lock)
    ).not.toBeInTheDocument();
  });

  it('floors savings to whole shekels while a goal is active, as the goal line does', () => {
    render(
      <WalletPicker
        wallets={[{ ...savings, balance: 8450 }, spending]}
        selectedWalletId={spending.id}
        onSelect={mockOnSelect}
        savedTowardGoal={createMockSavedTowardGoal()}
      />
    );

    expect(
      screen.getByTestId(WALLET_PICKER_TEST_IDS.balance(savings.name))
    ).toHaveTextContent('₪84');
  });
});
