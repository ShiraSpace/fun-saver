import { fireEvent, render, screen, within } from '@/test-utils/render';
import { createMockSavedTowardGoal } from '@/test-utils/mocks/goal.mocks';
import { mockWalletSummaries } from '@/test-utils/mocks/wallet.mocks';
import type { SavedTowardGoal } from '@/lib/goal/saved-toward-goal';
import { agorotToShekels } from '@/lib/money';
import { WALLET_TILE_TEST_IDS } from '../WalletTile/constants';
import { WalletPicker } from './WalletPicker';
import { WALLET_PICKER_TEST_IDS } from './constants';

const mockOnSelect = jest.fn();
const [mockSavings, mockSpending] = mockWalletSummaries;

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
    renderPicker(mockSavings.id);

    expect(screen.getAllByTestId(/^wallet-picker-(?!balance)/)).toHaveLength(
      mockWalletSummaries.length
    );
    expect(
      screen.getByTestId(WALLET_PICKER_TEST_IDS.balance(mockSavings.name))
    ).toHaveTextContent(String(agorotToShekels(mockSavings.balance)));
  });

  it('marks the selected wallet as pressed', () => {
    renderPicker(mockSpending.id);

    expect(
      screen.getByTestId(WALLET_PICKER_TEST_IDS.wallet(mockSpending.name))
    ).toHaveAttribute('aria-pressed', 'true');
    expect(
      screen.getByTestId(WALLET_PICKER_TEST_IDS.wallet(mockSavings.name))
    ).toHaveAttribute('aria-pressed', 'false');
  });

  it('reports the tapped wallet id through onSelect', () => {
    renderPicker(mockSavings.id);

    fireEvent.click(
      screen.getByTestId(WALLET_PICKER_TEST_IDS.wallet(mockSpending.name))
    );

    expect(mockOnSelect).toHaveBeenCalledWith(mockSpending.id);
  });

  describe('with a goal not yet reached', () => {
    beforeEach(() => {
      renderPicker(mockSpending.id, createMockSavedTowardGoal());
    });

    it('locks savings', () => {
      expect(
        within(
          screen.getByTestId(WALLET_PICKER_TEST_IDS.wallet(mockSavings.name))
        ).getByTestId(WALLET_TILE_TEST_IDS.lock)
      ).toBeInTheDocument();
    });

    it('locks no other wallet', () => {
      expect(screen.getAllByTestId(WALLET_TILE_TEST_IDS.lock)).toHaveLength(1);
    });
  });

  it('locks nothing once the goal is reached', () => {
    renderPicker(mockSpending.id, createMockSavedTowardGoal({ reached: true }));

    expect(
      screen.queryByTestId(WALLET_TILE_TEST_IDS.lock)
    ).not.toBeInTheDocument();
  });

  it('floors savings to whole shekels while a goal is active, as the goal line does', () => {
    render(
      <WalletPicker
        wallets={[{ ...mockSavings, balance: 8450 }, mockSpending]}
        selectedWalletId={mockSpending.id}
        onSelect={mockOnSelect}
        savedTowardGoal={createMockSavedTowardGoal()}
      />
    );

    expect(
      screen.getByTestId(WALLET_PICKER_TEST_IDS.balance(mockSavings.name))
    ).toHaveTextContent('₪84');
  });
});
