import { fireEvent, render, screen } from '@/test-utils/render';
import { TransactionDrawer } from './TransactionDrawer';
import { TRANSACTION_DRAWER_TEST_IDS } from './constants';
import { TRANSACTION_TYPE_TOGGLE_TEST_IDS } from './TransactionTypeToggle/constants';
import { WALLET_PICKER_TEST_IDS } from './WalletPicker/constants';
import { mockAccountSummary } from '@/test-utils/fixtures';
import { mockRouter } from '@mocks/next/navigation';
import { getThemeTokens } from '@/theme/registry';

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

  it('dims what it covers, so the sheet owns the attention', () => {
    const scrim = screen.getByTestId(TRANSACTION_DRAWER_TEST_IDS.scrim);

    expect(getComputedStyle(scrim).background).toContain(
      getThemeTokens().tints.shade
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
