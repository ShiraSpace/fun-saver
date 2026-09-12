import { fireEvent, render, screen, waitFor } from '@/test-support/render';
import { WithdrawBody } from './WithdrawBody';
import { WITHDRAW_BODY_COPY, WITHDRAW_BODY_TEST_IDS } from './constants';
import { TRANSACTION_DRAWER_TEST_IDS } from '../constants';
import { WALLET_PICKER_TEST_IDS } from '../WalletPicker/constants';
import { AMOUNT_PAD_TEST_IDS } from '../AmountPad/constants';
import {
  mockDerivedAccount,
  mockDerivedWallets,
} from '@/test-support/fixtures';
import { agorotToShekels } from '@/lib/money';

const mockWithdraw = jest.fn();
const mockRefresh = jest.fn();
const onClose = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: (): { refresh: jest.Mock } => ({ refresh: mockRefresh }),
}));

jest.mock('../use-add-transaction', () => ({
  useAddTransaction: (): { addDeposit: jest.Mock; withdraw: jest.Mock } => ({
    addDeposit: jest.fn(),
    withdraw: mockWithdraw,
  }),
}));

const [savings, spending, goodDeeds] = mockDerivedWallets;

function type(...digits: string[]): void {
  for (const digit of digits) {
    fireEvent.click(screen.getByTestId(AMOUNT_PAD_TEST_IDS.key(digit)));
  }
}

describe('WithdrawBody', () => {
  beforeEach(() => {
    mockWithdraw.mockReset().mockResolvedValue(undefined);
    mockRefresh.mockClear();
    onClose.mockClear();
    render(<WithdrawBody account={mockDerivedAccount} onClose={onClose} />);
  });

  it('renders a wallet picker with the savings wallet selected by default', () => {
    expect(
      screen.getByTestId(WALLET_PICKER_TEST_IDS.wallet(savings.name))
    ).toHaveAttribute('aria-pressed', 'true');
    expect(
      screen.getByTestId(WALLET_PICKER_TEST_IDS.wallet(spending.name))
    ).toBeInTheDocument();
  });

  it('disables confirm until a valid amount is entered', () => {
    expect(
      screen.getByTestId(TRANSACTION_DRAWER_TEST_IDS.confirm)
    ).toBeDisabled();

    type('5', '0');

    expect(
      screen.getByTestId(TRANSACTION_DRAWER_TEST_IDS.confirm)
    ).toBeEnabled();
  });

  it('blocks an overdraft with a hint and a disabled confirm', () => {
    type('9', '9');

    expect(
      screen.getByTestId(WITHDRAW_BODY_TEST_IDS.overdraft)
    ).toHaveTextContent(String(agorotToShekels(savings.balance)));
    expect(
      screen.getByTestId(TRANSACTION_DRAWER_TEST_IDS.confirm)
    ).toBeDisabled();
  });

  it('reframes a good-deeds withdrawal as a donation', () => {
    fireEvent.click(
      screen.getByTestId(WALLET_PICKER_TEST_IDS.wallet(goodDeeds.name))
    );
    type('5');

    expect(
      screen.getByTestId(TRANSACTION_DRAWER_TEST_IDS.confirm)
    ).toHaveTextContent(WITHDRAW_BODY_COPY.donationConfirm);
  });

  it('withdraws from the chosen wallet, refreshes, and closes on confirm', async () => {
    fireEvent.click(
      screen.getByTestId(WALLET_PICKER_TEST_IDS.wallet(spending.name))
    );
    type('1', '0');

    fireEvent.click(screen.getByTestId(TRANSACTION_DRAWER_TEST_IDS.confirm));

    await waitFor(() =>
      expect(mockWithdraw).toHaveBeenCalledWith(spending.id, 10)
    );
    await waitFor(() => expect(mockRefresh).toHaveBeenCalled());
    await waitFor(() => expect(onClose).toHaveBeenCalled());
  });

  it('shows an error and stays open when the withdrawal fails', async () => {
    mockWithdraw.mockRejectedValueOnce(new Error('boom'));
    type('5');

    fireEvent.click(screen.getByTestId(TRANSACTION_DRAWER_TEST_IDS.confirm));

    await waitFor(() =>
      expect(
        screen.getByTestId(TRANSACTION_DRAWER_TEST_IDS.error)
      ).toBeInTheDocument()
    );
    expect(onClose).not.toHaveBeenCalled();
  });
});
