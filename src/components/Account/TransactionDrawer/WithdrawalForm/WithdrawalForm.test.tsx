import { fireEvent, render, screen, waitFor } from '@/test-utils/render';
import { WithdrawalForm } from './WithdrawalForm';
import { WITHDRAWAL_FORM_COPY, WITHDRAWAL_FORM_TEST_IDS } from './constants';
import { TRANSACTION_DRAWER_TEST_IDS } from '../constants';
import { WALLET_PICKER_TEST_IDS } from '../WalletPicker/constants';
import { AMOUNT_KEYPAD_TEST_IDS } from '../AmountKeypad/constants';
import { mockDerivedAccount, mockDerivedWallets } from '@/test-utils/fixtures';
import { agorotToShekels } from '@/lib/money';
import { mockRouter } from '@mocks/next/navigation';

const mockAddWithdrawal = jest.fn();
const mockOnClose = jest.fn();

jest.mock('../use-add-transaction', () => ({
  useAddTransaction: (): {
    addDeposit: jest.Mock;
    addWithdrawal: jest.Mock;
  } => ({
    addDeposit: jest.fn(),
    addWithdrawal: mockAddWithdrawal,
  }),
}));

const [savings, spending, goodDeeds] = mockDerivedWallets;

function type(...digits: string[]): void {
  for (const digit of digits) {
    fireEvent.click(screen.getByTestId(AMOUNT_KEYPAD_TEST_IDS.key(digit)));
  }
}

describe('WithdrawalForm', () => {
  beforeEach(() => {
    mockAddWithdrawal.mockReset().mockResolvedValue(undefined);
    mockRouter.refresh.mockClear();
    mockOnClose.mockClear();
    render(
      <WithdrawalForm account={mockDerivedAccount} onClose={mockOnClose} />
    );
  });

  it('renders a wallet picker with the savings wallet selected by default', () => {
    expect(
      screen.getByTestId(WALLET_PICKER_TEST_IDS.wallet(savings.name))
    ).toHaveAttribute('aria-pressed', 'true');
    expect(
      screen.getByTestId(WALLET_PICKER_TEST_IDS.wallet(spending.name))
    ).toBeInTheDocument();
  });

  it('disables submit until a valid amount is entered', () => {
    expect(
      screen.getByTestId(TRANSACTION_DRAWER_TEST_IDS.submit)
    ).toBeDisabled();

    type('5', '0');

    expect(
      screen.getByTestId(TRANSACTION_DRAWER_TEST_IDS.submit)
    ).toBeEnabled();
  });

  it('blocks an overdraft with a hint and a disabled submit', () => {
    type('9', '9');

    expect(
      screen.getByTestId(WITHDRAWAL_FORM_TEST_IDS.overdraft)
    ).toHaveTextContent(String(agorotToShekels(savings.balance)));
    expect(
      screen.getByTestId(TRANSACTION_DRAWER_TEST_IDS.submit)
    ).toBeDisabled();
  });

  it('reframes a good-deeds withdrawal as a donation', () => {
    fireEvent.click(
      screen.getByTestId(WALLET_PICKER_TEST_IDS.wallet(goodDeeds.name))
    );
    type('5');

    expect(
      screen.getByTestId(TRANSACTION_DRAWER_TEST_IDS.submit)
    ).toHaveTextContent(WITHDRAWAL_FORM_COPY.donationSubmit);
  });

  it('withdraws from the chosen wallet, refreshes, and closes on submit', async () => {
    fireEvent.click(
      screen.getByTestId(WALLET_PICKER_TEST_IDS.wallet(spending.name))
    );
    type('1', '0');

    fireEvent.click(screen.getByTestId(TRANSACTION_DRAWER_TEST_IDS.submit));

    await waitFor(() =>
      expect(mockAddWithdrawal).toHaveBeenCalledWith(spending.id, 10)
    );
    await waitFor(() => expect(mockRouter.refresh).toHaveBeenCalled());
    await waitFor(() => expect(mockOnClose).toHaveBeenCalled());
  });

  it('shows an error and stays open when the withdrawal fails', async () => {
    mockAddWithdrawal.mockRejectedValueOnce(new Error('boom'));
    type('5');

    fireEvent.click(screen.getByTestId(TRANSACTION_DRAWER_TEST_IDS.submit));

    await waitFor(() =>
      expect(
        screen.getByTestId(TRANSACTION_DRAWER_TEST_IDS.error)
      ).toBeInTheDocument()
    );
    expect(mockOnClose).not.toHaveBeenCalled();
  });
});
