import { fireEvent, render, screen } from '@/test-support/render';
import { TransactionDrawer } from './TransactionDrawer';
import { TRANSACTION_DRAWER_TEST_IDS } from './constants';
import { MODE_TOGGLE_TEST_IDS } from './ModeToggle/constants';
import { WALLET_PICKER_TEST_IDS } from './WalletPicker/constants';
import { mockDerivedAccount } from '@/test-support/fixtures';

const mockRefresh = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: (): { refresh: jest.Mock } => ({ refresh: mockRefresh }),
}));

jest.mock('./use-add-transaction', () => ({
  useAddTransaction: (): { addDeposit: jest.Mock; withdraw: jest.Mock } => ({
    addDeposit: jest.fn(),
    withdraw: jest.fn(),
  }),
}));

describe('TransactionDrawer', () => {
  beforeEach(() => {
    mockRefresh.mockClear();
    render(
      <TransactionDrawer account={mockDerivedAccount} onClose={jest.fn()} />
    );
  });

  it('opens in deposit mode with the split visible', () => {
    expect(screen.getByTestId(MODE_TOGGLE_TEST_IDS.deposit)).toHaveAttribute(
      'aria-pressed',
      'true'
    );
    expect(
      screen.getByTestId(TRANSACTION_DRAWER_TEST_IDS.split)
    ).toBeInTheDocument();
  });

  it('switches to the withdraw wallet picker when the withdraw mode is chosen', () => {
    fireEvent.click(screen.getByTestId(MODE_TOGGLE_TEST_IDS.withdraw));

    expect(
      screen.getByTestId(WALLET_PICKER_TEST_IDS.wallet('savings'))
    ).toBeInTheDocument();
    expect(
      screen.queryByTestId(TRANSACTION_DRAWER_TEST_IDS.split)
    ).not.toBeInTheDocument();
  });
});
