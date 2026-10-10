import { fireEvent, render, screen, waitFor } from '@/test-utils/render';
import { TransactionDrawer } from './TransactionDrawer';
import { TRANSACTION_DRAWER_TEST_IDS } from './constants';
import { TRANSACTION_TYPE_TOGGLE_TEST_IDS } from './TransactionTypeToggle/constants';
import { WALLET_PICKER_TEST_IDS } from './WalletPicker/constants';
import { AMOUNT_KEYPAD_TEST_IDS } from './AmountKeypad/constants';
import { mockAccountSummary } from '@/test-utils/mocks/account.mocks';
import { LAYERS } from '@/theme/layers';
import { layerOf } from '@/test-utils/layer';

jest.mock('./use-add-transaction', () => ({
  useAddTransaction: (): {
    addDeposit: jest.Mock;
    addWithdrawal: jest.Mock;
  } => ({
    addDeposit: jest.fn().mockResolvedValue(undefined),
    addWithdrawal: jest.fn(),
  }),
}));

describe('TransactionDrawer', () => {
  const mockOnClose = jest.fn();
  const mockOnSaved = jest.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
    mockOnSaved.mockClear();
    render(
      <TransactionDrawer
        account={mockAccountSummary}
        onClose={mockOnClose}
        onSaved={mockOnSaved}
      />
    );
  });

  it('opens on a deposit with the split visible', () => {
    expect(
      screen.getByTestId(TRANSACTION_TYPE_TOGGLE_TEST_IDS.deposit)
    ).toHaveAttribute('aria-pressed', 'true');
    expect(
      screen.getByTestId(TRANSACTION_DRAWER_TEST_IDS.split)
    ).toBeInTheDocument();
  });

  it('dims at the modal layer', () => {
    expect(layerOf(TRANSACTION_DRAWER_TEST_IDS.scrim)).toBe(LAYERS.modal);
  });

  it('keeps the drawer above its own dimming', () => {
    expect(layerOf(TRANSACTION_DRAWER_TEST_IDS.drawer)).toBeGreaterThan(
      layerOf(TRANSACTION_DRAWER_TEST_IDS.scrim)
    );
  });

  it('switches to the wallet picker when a withdrawal is chosen', () => {
    fireEvent.click(
      screen.getByTestId(TRANSACTION_TYPE_TOGGLE_TEST_IDS.withdrawal)
    );

    expect(
      screen.getByTestId(WALLET_PICKER_TEST_IDS.wallet('savings'))
    ).toBeInTheDocument();
    expect(
      screen.queryByTestId(TRANSACTION_DRAWER_TEST_IDS.split)
    ).not.toBeInTheDocument();
  });

  describe('once a deposit is saved', () => {
    beforeEach(async () => {
      fireEvent.click(screen.getByTestId(AMOUNT_KEYPAD_TEST_IDS.key('5')));
      fireEvent.click(screen.getByTestId(TRANSACTION_DRAWER_TEST_IDS.submit));
      await waitFor(() => expect(mockOnSaved).toHaveBeenCalled());
    });

    it('reports the deposit saved', () => {
      expect(mockOnSaved).toHaveBeenCalledTimes(1);
    });

    it('does not report the drawer dismissed', () => {
      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });
});
