import { fireEvent, render, screen, waitFor } from '@/test-utils/render';
import { DepositForm } from './DepositForm';
import { TRANSACTION_DRAWER_TEST_IDS } from '../constants';
import { AMOUNT_KEYPAD_TEST_IDS } from '../AmountKeypad/constants';
import { splitDeposit } from '@/lib/transactions';
import { agorotToShekels } from '@/lib/money';
import { AGOROT_PER_SHEKEL } from '@/lib/constants';
import { mockDerivedAccount } from '@/test-utils/fixtures';
import { mockRouter } from '@mocks/next/navigation';

const mockAddDeposit = jest.fn();
const onClose = jest.fn();

jest.mock('../use-add-transaction', () => ({
  useAddTransaction: (): {
    addDeposit: jest.Mock;
    addWithdrawal: jest.Mock;
  } => ({
    addDeposit: mockAddDeposit,
    addWithdrawal: jest.fn(),
  }),
}));

describe('DepositForm', () => {
  beforeEach(() => {
    mockAddDeposit.mockReset().mockResolvedValue(undefined);
    mockRouter.refresh.mockClear();
    onClose.mockClear();
    render(<DepositForm account={mockDerivedAccount} onClose={onClose} />);
  });

  it('shows a zero amount by default', () => {
    expect(
      screen.getByTestId(TRANSACTION_DRAWER_TEST_IDS.amount)
    ).toHaveTextContent('0');
  });

  it('builds the amount as digits are tapped', () => {
    fireEvent.click(screen.getByTestId(AMOUNT_KEYPAD_TEST_IDS.key('2')));
    fireEvent.click(screen.getByTestId(AMOUNT_KEYPAD_TEST_IDS.key('0')));

    expect(
      screen.getByTestId(TRANSACTION_DRAWER_TEST_IDS.amount)
    ).toHaveTextContent('20');
  });

  it('clears the amount back to zero', () => {
    fireEvent.click(screen.getByTestId(AMOUNT_KEYPAD_TEST_IDS.key('5')));
    fireEvent.click(screen.getByTestId(AMOUNT_KEYPAD_TEST_IDS.clear));

    expect(
      screen.getByTestId(TRANSACTION_DRAWER_TEST_IDS.amount)
    ).toHaveTextContent('0');
  });

  it('removes the last digit on backspace', () => {
    fireEvent.click(screen.getByTestId(AMOUNT_KEYPAD_TEST_IDS.key('1')));
    fireEvent.click(screen.getByTestId(AMOUNT_KEYPAD_TEST_IDS.key('2')));
    fireEvent.click(screen.getByTestId(AMOUNT_KEYPAD_TEST_IDS.backspace));

    expect(
      screen.getByTestId(TRANSACTION_DRAWER_TEST_IDS.amount)
    ).toHaveTextContent('1');
  });

  it('shows the live split for the typed amount', () => {
    fireEvent.click(screen.getByTestId(AMOUNT_KEYPAD_TEST_IDS.key('2')));
    fireEvent.click(screen.getByTestId(AMOUNT_KEYPAD_TEST_IDS.key('0')));

    const split = splitDeposit(20 * AGOROT_PER_SHEKEL);

    expect(
      screen.getByTestId(TRANSACTION_DRAWER_TEST_IDS.splitAmount('savings'))
    ).toHaveTextContent(String(agorotToShekels(split.savings)));
    expect(
      screen.getByTestId(TRANSACTION_DRAWER_TEST_IDS.splitAmount('spending'))
    ).toHaveTextContent(String(agorotToShekels(split.spending)));
    expect(
      screen.getByTestId(TRANSACTION_DRAWER_TEST_IDS.splitAmount('goodDeeds'))
    ).toHaveTextContent(String(agorotToShekels(split.goodDeeds)));
  });

  it('disables submit until an amount is entered', () => {
    expect(
      screen.getByTestId(TRANSACTION_DRAWER_TEST_IDS.submit)
    ).toBeDisabled();

    fireEvent.click(screen.getByTestId(AMOUNT_KEYPAD_TEST_IDS.key('5')));

    expect(
      screen.getByTestId(TRANSACTION_DRAWER_TEST_IDS.submit)
    ).toBeEnabled();
  });

  it('submits the deposit, refreshes, and closes on submit', async () => {
    fireEvent.click(screen.getByTestId(AMOUNT_KEYPAD_TEST_IDS.key('2')));
    fireEvent.click(screen.getByTestId(AMOUNT_KEYPAD_TEST_IDS.key('0')));

    fireEvent.click(screen.getByTestId(TRANSACTION_DRAWER_TEST_IDS.submit));

    await waitFor(() => expect(mockAddDeposit).toHaveBeenCalledWith(20));
    await waitFor(() => expect(mockRouter.refresh).toHaveBeenCalled());
    await waitFor(() => expect(onClose).toHaveBeenCalled());
  });

  it('shows an error and stays open when the deposit fails', async () => {
    mockAddDeposit.mockRejectedValueOnce(new Error('boom'));
    fireEvent.click(screen.getByTestId(AMOUNT_KEYPAD_TEST_IDS.key('2')));
    fireEvent.click(screen.getByTestId(AMOUNT_KEYPAD_TEST_IDS.key('0')));

    fireEvent.click(screen.getByTestId(TRANSACTION_DRAWER_TEST_IDS.submit));

    await waitFor(() =>
      expect(
        screen.getByTestId(TRANSACTION_DRAWER_TEST_IDS.error)
      ).toBeInTheDocument()
    );
    expect(onClose).not.toHaveBeenCalled();
    expect(mockRouter.refresh).not.toHaveBeenCalled();
    expect(
      screen.getByTestId(TRANSACTION_DRAWER_TEST_IDS.amount)
    ).toHaveTextContent('20');
  });

  it('disables submit while the deposit is in flight', async () => {
    let resolveDeposit = (): void => {};
    mockAddDeposit.mockReturnValueOnce(
      new Promise<void>((resolve) => {
        resolveDeposit = resolve;
      })
    );
    fireEvent.click(screen.getByTestId(AMOUNT_KEYPAD_TEST_IDS.key('5')));

    fireEvent.click(screen.getByTestId(TRANSACTION_DRAWER_TEST_IDS.submit));

    await waitFor(() =>
      expect(
        screen.getByTestId(TRANSACTION_DRAWER_TEST_IDS.submit)
      ).toBeDisabled()
    );

    resolveDeposit();
    await waitFor(() => expect(onClose).toHaveBeenCalled());
  });
});
