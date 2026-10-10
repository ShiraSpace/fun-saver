import { fireEvent, render, screen } from '@/test-utils/render';
import { TransactionDrawer } from './TransactionDrawer';
import { TRANSACTION_DRAWER_TEST_IDS } from './constants';
import { TRANSACTION_TYPE_TOGGLE_TEST_IDS } from './TransactionTypeToggle/constants';
import { WALLET_PICKER_TEST_IDS } from './WalletPicker/constants';
import { mockAccountSummary } from '@/test-utils/mocks/account.mocks';
import { mockRouter } from '@mocks/next/navigation';
import { LAYERS } from '@/theme/layers';
import { layerOf } from '@/test-utils/layer';

jest.mock('./use-add-transaction', () => ({
  useAddTransaction: (): {
    addDeposit: jest.Mock;
    addWithdrawal: jest.Mock;
  } => ({
    addDeposit: jest.fn(),
    addWithdrawal: jest.fn(),
  }),
}));

describe('TransactionDrawer', () => {
  beforeEach(() => {
    mockRouter.refresh.mockClear();
    render(
      <TransactionDrawer account={mockAccountSummary} onClose={jest.fn()} />
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
});
