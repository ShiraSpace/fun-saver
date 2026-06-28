import { fireEvent, render, screen, waitFor } from '@/test-support/render';
import { TransactionDrawer } from './TransactionDrawer';
import { TRANSACTION_DRAWER_TEST_IDS } from './constants';
import { AMOUNT_PAD_TEST_IDS } from './AmountPad/constants';
import { MODE_TOGGLE_TEST_IDS } from './ModeToggle/constants';
import { WALLET_PICKER_TEST_IDS } from './WalletPicker/constants';
import { splitDeposit } from '@/lib/transactions';
import { agorotToShekels } from '@/lib/money';
import { AGOROT_PER_SHEKEL } from '@/lib/constants';
import { mockDerivedAccount } from '@/test-support/fixtures';

const mockAddDeposit = jest.fn();
const mockWithdraw = jest.fn();
const mockRefresh = jest.fn();
const mockOnClose = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: (): { refresh: jest.Mock } => ({ refresh: mockRefresh }),
}));

jest.mock('./use-add-transaction', () => ({
  useAddTransaction: (): { addDeposit: jest.Mock; withdraw: jest.Mock } => ({
    addDeposit: mockAddDeposit,
    withdraw: mockWithdraw,
  }),
}));

describe('TransactionDrawer', () => {
  beforeEach(() => {
    mockAddDeposit.mockReset().mockResolvedValue(undefined);
    mockWithdraw.mockReset().mockResolvedValue(undefined);
    mockRefresh.mockClear();
    mockOnClose.mockClear();
    render(
      <TransactionDrawer account={mockDerivedAccount} onClose={mockOnClose} />
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

  it('shows a zero amount by default', () => {
    expect(
      screen.getByTestId(TRANSACTION_DRAWER_TEST_IDS.amount)
    ).toHaveTextContent('0');
  });

  it('builds the amount as digits are tapped', () => {
    fireEvent.click(screen.getByTestId(AMOUNT_PAD_TEST_IDS.key('2')));
    fireEvent.click(screen.getByTestId(AMOUNT_PAD_TEST_IDS.key('0')));

    expect(
      screen.getByTestId(TRANSACTION_DRAWER_TEST_IDS.amount)
    ).toHaveTextContent('20');
  });

  it('clears the amount back to zero', () => {
    fireEvent.click(screen.getByTestId(AMOUNT_PAD_TEST_IDS.key('5')));
    fireEvent.click(screen.getByTestId(AMOUNT_PAD_TEST_IDS.clear));

    expect(
      screen.getByTestId(TRANSACTION_DRAWER_TEST_IDS.amount)
    ).toHaveTextContent('0');
  });

  it('removes the last digit on backspace', () => {
    fireEvent.click(screen.getByTestId(AMOUNT_PAD_TEST_IDS.key('1')));
    fireEvent.click(screen.getByTestId(AMOUNT_PAD_TEST_IDS.key('2')));
    fireEvent.click(screen.getByTestId(AMOUNT_PAD_TEST_IDS.backspace));

    expect(
      screen.getByTestId(TRANSACTION_DRAWER_TEST_IDS.amount)
    ).toHaveTextContent('1');
  });

  it('shows the live split for the typed amount', () => {
    fireEvent.click(screen.getByTestId(AMOUNT_PAD_TEST_IDS.key('2')));
    fireEvent.click(screen.getByTestId(AMOUNT_PAD_TEST_IDS.key('0')));

    const split = splitDeposit(20 * AGOROT_PER_SHEKEL);

    expect(
      screen.getByTestId(TRANSACTION_DRAWER_TEST_IDS.splitShare('savings'))
    ).toHaveTextContent(String(agorotToShekels(split.savings)));
    expect(
      screen.getByTestId(TRANSACTION_DRAWER_TEST_IDS.splitShare('spending'))
    ).toHaveTextContent(String(agorotToShekels(split.spending)));
    expect(
      screen.getByTestId(TRANSACTION_DRAWER_TEST_IDS.splitShare('goodDeeds'))
    ).toHaveTextContent(String(agorotToShekels(split.goodDeeds)));
  });

  it('disables confirm until an amount is entered', () => {
    expect(
      screen.getByTestId(TRANSACTION_DRAWER_TEST_IDS.confirm)
    ).toBeDisabled();

    fireEvent.click(screen.getByTestId(AMOUNT_PAD_TEST_IDS.key('5')));

    expect(
      screen.getByTestId(TRANSACTION_DRAWER_TEST_IDS.confirm)
    ).toBeEnabled();
  });

  it('submits the deposit, refreshes, and closes on confirm', async () => {
    fireEvent.click(screen.getByTestId(AMOUNT_PAD_TEST_IDS.key('2')));
    fireEvent.click(screen.getByTestId(AMOUNT_PAD_TEST_IDS.key('0')));

    fireEvent.click(screen.getByTestId(TRANSACTION_DRAWER_TEST_IDS.confirm));

    await waitFor(() => expect(mockAddDeposit).toHaveBeenCalledWith(20));
    await waitFor(() => expect(mockRefresh).toHaveBeenCalled());
    await waitFor(() => expect(mockOnClose).toHaveBeenCalled());
  });

  it('shows an error and stays open when the deposit fails', async () => {
    mockAddDeposit.mockRejectedValueOnce(new Error('boom'));
    fireEvent.click(screen.getByTestId(AMOUNT_PAD_TEST_IDS.key('2')));
    fireEvent.click(screen.getByTestId(AMOUNT_PAD_TEST_IDS.key('0')));

    fireEvent.click(screen.getByTestId(TRANSACTION_DRAWER_TEST_IDS.confirm));

    await waitFor(() =>
      expect(
        screen.getByTestId(TRANSACTION_DRAWER_TEST_IDS.error)
      ).toBeInTheDocument()
    );
    expect(mockOnClose).not.toHaveBeenCalled();
    expect(mockRefresh).not.toHaveBeenCalled();
    expect(
      screen.getByTestId(TRANSACTION_DRAWER_TEST_IDS.amount)
    ).toHaveTextContent('20');
  });

  it('disables confirm while the deposit is in flight', async () => {
    let resolveDeposit = (): void => {};
    mockAddDeposit.mockReturnValueOnce(
      new Promise<void>((resolve) => {
        resolveDeposit = resolve;
      })
    );
    fireEvent.click(screen.getByTestId(AMOUNT_PAD_TEST_IDS.key('5')));

    fireEvent.click(screen.getByTestId(TRANSACTION_DRAWER_TEST_IDS.confirm));

    await waitFor(() =>
      expect(
        screen.getByTestId(TRANSACTION_DRAWER_TEST_IDS.confirm)
      ).toBeDisabled()
    );

    resolveDeposit();
    await waitFor(() => expect(mockOnClose).toHaveBeenCalled());
  });
});
