import { fireEvent, render, screen, waitFor } from '@/test-utils/render';
import { WithdrawalForm } from './WithdrawalForm';
import { WITHDRAWAL_FORM_COPY, WITHDRAWAL_FORM_TEST_IDS } from './constants';
import { TRANSACTION_DRAWER_TEST_IDS } from '../constants';
import { WALLET_PICKER_TEST_IDS } from '../WalletPicker/constants';
import { AMOUNT_KEYPAD_TEST_IDS } from '../AmountKeypad/constants';
import { mockAccountSummary } from '@/test-utils/mocks/account.mocks';
import { mockWalletSummaries } from '@/test-utils/mocks/wallet.mocks';
import { agorotToShekels } from '@/lib/money';
import { withdraw } from '@/lib/transaction/transaction-requests';

const mockOnSaved = jest.fn();

jest.mock('@/lib/transaction/transaction-requests');

const mockWithdraw = jest.mocked(withdraw);

const [mockSavings, mockSpending, mockGoodDeeds] = mockWalletSummaries;

function type(...digits: string[]): void {
  for (const digit of digits) {
    fireEvent.click(screen.getByTestId(AMOUNT_KEYPAD_TEST_IDS.key(digit)));
  }
}

describe('WithdrawalForm', () => {
  beforeEach(() => {
    mockWithdraw.mockReset().mockResolvedValue(undefined);
    mockOnSaved.mockClear();
    render(<WithdrawalForm account={mockAccountSummary} onSaved={mockOnSaved} />);
  });

  it('renders a wallet picker with the spending wallet selected by default', () => {
    expect(screen.getByTestId(WALLET_PICKER_TEST_IDS.wallet(mockSpending.name))).toHaveAttribute(
      'aria-pressed',
      'true'
    );
    expect(screen.getByTestId(WALLET_PICKER_TEST_IDS.wallet(mockSavings.name))).toHaveAttribute(
      'aria-pressed',
      'false'
    );
  });

  it('disables submit until a valid amount is entered', () => {
    expect(screen.getByTestId(TRANSACTION_DRAWER_TEST_IDS.submit)).toBeDisabled();

    type('5', '0');

    expect(screen.getByTestId(TRANSACTION_DRAWER_TEST_IDS.submit)).toBeEnabled();
  });

  it('blocks an overdraft with a hint and a disabled submit', () => {
    type('9', '9');

    expect(screen.getByTestId(WITHDRAWAL_FORM_TEST_IDS.overdraft)).toHaveTextContent(
      String(agorotToShekels(mockSpending.balance))
    );
    expect(screen.getByTestId(TRANSACTION_DRAWER_TEST_IDS.submit)).toBeDisabled();
  });

  it('reframes a good-deeds withdrawal as a donation', () => {
    fireEvent.click(screen.getByTestId(WALLET_PICKER_TEST_IDS.wallet(mockGoodDeeds.name)));
    type('5');

    expect(screen.getByTestId(TRANSACTION_DRAWER_TEST_IDS.submit)).toHaveTextContent(
      WITHDRAWAL_FORM_COPY.donationSubmit
    );
  });

  it('withdraws from the chosen wallet on submit', async () => {
    fireEvent.click(screen.getByTestId(WALLET_PICKER_TEST_IDS.wallet(mockSavings.name)));
    type('1', '0');

    fireEvent.click(screen.getByTestId(TRANSACTION_DRAWER_TEST_IDS.submit));

    await waitFor(() =>
      expect(mockWithdraw).toHaveBeenCalledWith({
        accountId: mockAccountSummary.id,
        walletId: mockSavings.id,
        amountShekels: 10,
      })
    );
  });

  it('reports the withdrawal saved', async () => {
    type('5');

    fireEvent.click(screen.getByTestId(TRANSACTION_DRAWER_TEST_IDS.submit));

    await waitFor(() => expect(mockOnSaved).toHaveBeenCalled());
  });

  it('shows an error, and does not report it saved, when the withdrawal fails', async () => {
    mockWithdraw.mockRejectedValueOnce(new Error('boom'));
    type('5');

    fireEvent.click(screen.getByTestId(TRANSACTION_DRAWER_TEST_IDS.submit));

    await waitFor(() =>
      expect(screen.getByTestId(TRANSACTION_DRAWER_TEST_IDS.error)).toBeInTheDocument()
    );
    expect(mockOnSaved).not.toHaveBeenCalled();
  });
});
